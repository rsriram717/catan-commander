import { VertexCoordinate, EdgeCoordinate } from '../types/coordinates'
import { Hex, Port, BoardConfiguration, ResourceType } from '../types/board'
import {
  ResourceYield,
  SettlementScoreBreakdown,
  PlacementRecommendation,
} from '../types/recommendations'
import { hexEquals } from '../utils/hexMath'
import { getAllEdges, getVertexEdges, getAdjacentVertices } from '../utils/geometry'
import { getExpectedYield, getAverageNumberQuality } from './probabilities'

/**
 * Calculate resource yield for a settlement at a given vertex
 */
function calculateResourceYield(
  vertex: VertexCoordinate,
  hexes: Hex[]
): { resourceYield: ResourceYield; total: number; numbers: number[] } {
  const resourceYield: ResourceYield = {
    wood: 0,
    brick: 0,
    sheep: 0,
    wheat: 0,
    ore: 0,
  }

  let totalYield = 0
  const numbers: number[] = []

  // Get hexes that touch this vertex (filter out water placeholders)
  const adjacentHexes = vertex.hexes
    .filter(coord => coord.q !== 999)
    .map(coord => hexes.find(h => hexEquals(h.coordinate, coord)))
    .filter((h): h is Hex => h !== undefined)

  for (const hex of adjacentHexes) {
    if (hex.resource && hex.resource !== 'desert' && hex.number) {
      const expected = getExpectedYield(hex.number)
      resourceYield[hex.resource as keyof ResourceYield] += expected
      totalYield += expected
      numbers.push(hex.number)
    }
  }

  return { resourceYield, total: totalYield, numbers }
}

/**
 * Calculate resource diversity score (0-1)
 */
function calculateDiversity(resourceYield: ResourceYield): number {
  const uniqueResources = Object.values(resourceYield).filter(amount => amount > 0).length
  return uniqueResources / 5 // Max 5 different resources
}

/**
 * Get resources accessible from this vertex
 */
function getAdjacentResources(vertex: VertexCoordinate, hexes: Hex[]): ResourceType[] {
  const resources: Set<ResourceType> = new Set()

  const adjacentHexes = vertex.hexes
    .filter(coord => coord.q !== 999)
    .map(coord => hexes.find(h => hexEquals(h.coordinate, coord)))
    .filter((h): h is Hex => h !== undefined)

  for (const hex of adjacentHexes) {
    if (hex.resource && hex.resource !== 'desert') {
      resources.add(hex.resource)
    }
  }

  return Array.from(resources)
}

/**
 * Check if vertex has access to a port
 */
function getPortAccess(
  vertex: VertexCoordinate,
  ports: Port[],
  allEdges: EdgeCoordinate[]
): Port | null {
  const connectedEdges = getVertexEdges(vertex, allEdges)

  for (const port of ports) {
    for (const edge of connectedEdges) {
      // Simple check: if the vertices match (would need better logic for exact edge matching)
      const portEdgeKey = `${port.edge.vertices[0]}-${port.edge.vertices[1]}`
      const connectedEdgeKey = `${edge.vertices[0]}-${edge.vertices[1]}`

      if (portEdgeKey === connectedEdgeKey) {
        return port
      }
    }
  }

  return null
}

/**
 * Calculate expansion potential (0-1)
 * Based on number of adjacent empty vertices
 */
function calculateExpansionPotential(
  vertex: VertexCoordinate,
  allEdges: EdgeCoordinate[],
  occupiedVertices: VertexCoordinate[]
): number {
  const adjacent = getAdjacentVertices(vertex, allEdges)
  const emptyAdjacent = adjacent.filter(
    adj => !occupiedVertices.some(occ => JSON.stringify(occ) === JSON.stringify(adj))
  )

  // Max 3 adjacent vertices typically
  return Math.min(emptyAdjacent.length / 3, 1)
}

/**
 * Calculate port access score (0-1)
 */
function calculatePortScore(
  port: Port | null,
  adjacentResources: ResourceType[]
): number {
  if (!port || !port.type) return 0

  if (port.type === 'generic') {
    return 0.3 // Generic 3:1 port is okay
  }

  // Resource-specific 2:1 port
  const hasMatchingResource = adjacentResources.includes(port.type)
  return hasMatchingResource ? 1.0 : 0.6 // Better if we have the resource
}

/**
 * Score a single settlement location
 */
export function scoreSettlement(
  vertex: VertexCoordinate,
  board: BoardConfiguration,
  allEdges: EdgeCoordinate[],
  occupiedVertices: VertexCoordinate[] = [],
  firstPlacement?: VertexCoordinate
): PlacementRecommendation {
  const { resourceYield, total, numbers } = calculateResourceYield(vertex, board.hexes)
  const diversity = calculateDiversity(resourceYield)
  const numberQuality = getAverageNumberQuality(numbers)
  const adjacentResources = getAdjacentResources(vertex, board.hexes)
  const port = getPortAccess(vertex, board.ports, allEdges)
  const portScore = calculatePortScore(port, adjacentResources)
  const expansion = calculateExpansionPotential(vertex, allEdges, occupiedVertices)

  // Weights for scoring components
  const WEIGHTS = {
    expectedYield: 0.40,
    diversity: 0.30,
    numberQuality: 0.15,
    portAccess: 0.10,
    expansion: 0.05,
  }

  // Normalize expected yield (max ~14 for 6-8-5 combo)
  const normalizedYield = Math.min(total / 14, 1)

  // For second placement, boost complementary resources
  let diversityBonus = 0
  if (firstPlacement) {
    const firstYield = calculateResourceYield(firstPlacement, board.hexes).resourceYield
    const firstResources = Object.entries(firstYield)
      .filter(([_, amount]) => amount > 0)
      .map(([resource]) => resource as keyof ResourceYield)

    // Bonus if we're getting resources we don't have yet
    const newResources = adjacentResources.filter(
      r => !firstResources.includes(r as keyof ResourceYield)
    )
    diversityBonus = newResources.length * 0.1
  }

  const breakdown: SettlementScoreBreakdown = {
    expectedYield: normalizedYield,
    resourceDiversity: diversity + diversityBonus,
    numberQuality,
    portAccess: portScore,
    expansionPotential: expansion,
  }

  // Calculate weighted total score (0-100)
  const score =
    (breakdown.expectedYield * WEIGHTS.expectedYield +
      breakdown.resourceDiversity * WEIGHTS.diversity +
      breakdown.numberQuality * WEIGHTS.numberQuality +
      breakdown.portAccess * WEIGHTS.portAccess +
      breakdown.expansionPotential * WEIGHTS.expansion) *
    100

  // Get recommended roads (edges from this vertex)
  const recommendedRoads = getVertexEdges(vertex, allEdges).slice(0, 3)

  return {
    vertex,
    score,
    breakdown,
    resourceYield,
    adjacentResources,
    adjacentNumbers: numbers,
    portAccess: port?.type || null,
    recommendedRoads,
  }
}
