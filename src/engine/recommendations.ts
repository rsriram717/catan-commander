import { VertexCoordinate } from '../types/coordinates'
import { BoardConfiguration } from '../types/board'
import { PlacementRecommendation, RecommendationSet } from '../types/recommendations'
import { getAllVertices, getAllEdges } from '../utils/geometry'
import { scoreSettlement } from './scoring'

/**
 * Generate settlement placement recommendations
 */
export function generateRecommendations(
  board: BoardConfiguration,
  occupiedVertices: VertexCoordinate[] = [],
  firstPlacement?: VertexCoordinate,
  topN: number = 5
): RecommendationSet {
  // Get all possible vertices on the board
  const allVertices = getAllVertices(board.hexes.map(h => h.coordinate))
  const allEdges = getAllEdges(board.hexes.map(h => h.coordinate))

  // Filter out occupied vertices and those too close (distance rule)
  const availableVertices = allVertices.filter(vertex => {
    // Check if vertex is already occupied
    if (occupiedVertices.some(occ => JSON.stringify(occ) === JSON.stringify(vertex))) {
      return false
    }

    // Check distance rule: no settlements can be placed adjacent to existing ones
    // Get adjacent vertices and check if any are occupied
    const adjacentEdges = allEdges.filter(
      edge =>
        JSON.stringify(edge.vertices[0]) === JSON.stringify(vertex) ||
        JSON.stringify(edge.vertices[1]) === JSON.stringify(vertex)
    )

    const adjacentVertices = adjacentEdges.flatMap(edge => edge.vertices)

    for (const adj of adjacentVertices) {
      if (occupiedVertices.some(occ => JSON.stringify(occ) === JSON.stringify(adj))) {
        return false
      }
    }

    return true
  })

  // Score each available vertex
  const recommendations = availableVertices
    .map(vertex => scoreSettlement(vertex, board, allEdges, occupiedVertices, firstPlacement))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)

  return {
    recommendations,
    placementNumber: firstPlacement ? 2 : 1,
    consideringPlacements: occupiedVertices,
  }
}

/**
 * Get the best road placement from a settlement
 * Considers: expansion toward good spots, port access, blocking opponents
 */
export function recommendRoadPlacement(
  settlement: VertexCoordinate,
  board: BoardConfiguration,
  occupiedVertices: VertexCoordinate[],
  occupiedEdges: any[] = []
): any[] {
  const allEdges = getAllEdges(board.hexes.map(h => h.coordinate))

  // Get edges connected to this settlement
  const connectedEdges = allEdges.filter(
    edge =>
      JSON.stringify(edge.vertices[0]) === JSON.stringify(settlement) ||
      JSON.stringify(edge.vertices[1]) === JSON.stringify(settlement)
  )

  // Filter out occupied edges
  const availableEdges = connectedEdges.filter(
    edge => !occupiedEdges.some(occ => JSON.stringify(occ) === JSON.stringify(edge))
  )

  // Score edges based on where they lead
  const scoredEdges = availableEdges.map(edge => {
    const otherVertex =
      JSON.stringify(edge.vertices[0]) === JSON.stringify(settlement)
        ? edge.vertices[1]
        : edge.vertices[0]

    // Score the vertex this road leads to
    const targetScore = scoreSettlement(
      otherVertex,
      board,
      allEdges,
      occupiedVertices
    ).score

    return {
      edge,
      score: targetScore,
    }
  })

  return scoredEdges
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(se => se.edge)
}
