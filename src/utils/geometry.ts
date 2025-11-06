import {
  HexCoordinate,
  VertexCoordinate,
  EdgeCoordinate,
  PixelCoordinate,
} from '../types/coordinates'
import { hexEquals, hexToPixel, getHexNeighbors } from './hexMath'
import { HEX_SIZE } from './constants'

/**
 * Get all 6 vertices of a hex
 * Each vertex is identified by the 3 hexes it touches
 */
export function getHexVertices(
  hex: HexCoordinate,
  allHexes: HexCoordinate[]
): VertexCoordinate[] {
  const vertices: VertexCoordinate[] = []
  const neighbors = getHexNeighbors(hex)

  // For each corner of the hex, find the 3 hexes that meet there
  // Vertices are numbered 0-5 clockwise from top
  for (let i = 0; i < 6; i++) {
    // Each vertex touches the current hex and two adjacent neighbors
    const neighbor1 = neighbors[i]
    const neighbor2 = neighbors[(i + 1) % 6]

    // Check if these neighbors actually exist on the board
    const hasNeighbor1 = allHexes.some(h => hexEquals(h, neighbor1))
    const hasNeighbor2 = allHexes.some(h => hexEquals(h, neighbor2))

    // Collect all hexes that meet at this vertex
    const touchingHexes: HexCoordinate[] = [hex]
    if (hasNeighbor1) touchingHexes.push(neighbor1)
    if (hasNeighbor2) touchingHexes.push(neighbor2)

    // Only create vertex if at least 2 hexes meet (for coastal vertices)
    if (touchingHexes.length >= 2) {
      // Sort hexes for consistent ordering
      const sortedHexes = [...touchingHexes].sort((a, b) => {
        if (a.q !== b.q) return a.q - b.q
        return a.r - b.r
      })

      // Pad with "water" hexes if needed (represented as very far away)
      while (sortedHexes.length < 3) {
        sortedHexes.push({ q: 999, r: 999 })
      }

      vertices.push({
        hexes: [sortedHexes[0], sortedHexes[1], sortedHexes[2]],
        direction: i as 0 | 1 | 2 | 3 | 4 | 5,
      })
    }
  }

  return vertices
}

/**
 * Get all unique vertices on the board
 */
export function getAllVertices(hexes: HexCoordinate[]): VertexCoordinate[] {
  const vertexMap = new Map<string, VertexCoordinate>()

  for (const hex of hexes) {
    const hexVertices = getHexVertices(hex, hexes)
    for (const vertex of hexVertices) {
      const key = vertexToKey(vertex)
      if (!vertexMap.has(key)) {
        vertexMap.set(key, vertex)
      }
    }
  }

  return Array.from(vertexMap.values())
}

/**
 * Convert vertex to unique string key for deduplication
 */
export function vertexToKey(vertex: VertexCoordinate): string {
  // Sort hexes to ensure consistent key regardless of order
  const sorted = [...vertex.hexes].sort((a, b) => {
    if (a.q !== b.q) return a.q - b.q
    return a.r - b.r
  })
  return `v-${sorted.map(h => `${h.q},${h.r}`).join('-')}`
}

/**
 * Check if two vertices are equal
 */
export function vertexEquals(a: VertexCoordinate, b: VertexCoordinate): boolean {
  return vertexToKey(a) === vertexToKey(b)
}

/**
 * Get pixel coordinate for a vertex
 * Takes the average position of its surrounding hexes plus offset
 */
export function vertexToPixel(vertex: VertexCoordinate): PixelCoordinate {
  // Find the actual hexes (not water placeholders)
  const realHexes = vertex.hexes.filter(h => h.q !== 999 && h.r !== 999)

  if (realHexes.length === 0) {
    return { x: 0, y: 0 }
  }

  // Use the first real hex as reference
  const refHex = realHexes[0]
  const hexCenter = hexToPixel(refHex)

  // Calculate vertex position based on direction
  const direction = vertex.direction
  const angleDeg = 60 * direction - 30
  const angleRad = (Math.PI / 180) * angleDeg

  return {
    x: hexCenter.x + HEX_SIZE * Math.cos(angleRad),
    y: hexCenter.y + HEX_SIZE * Math.sin(angleRad),
  }
}

/**
 * Get all 6 edges of a hex
 */
export function getHexEdges(
  hex: HexCoordinate,
  allHexes: HexCoordinate[]
): EdgeCoordinate[] {
  const edges: EdgeCoordinate[] = []
  const vertices = getHexVertices(hex, allHexes)
  const neighbors = getHexNeighbors(hex)

  for (let i = 0; i < 6; i++) {
    const neighbor = neighbors[i]
    const hasNeighbor = allHexes.some(h => hexEquals(h, neighbor))

    // Create edge even if no neighbor (coastal edge)
    const vertex1 = vertices[i]
    const vertex2 = vertices[(i + 1) % 6]

    if (vertex1 && vertex2) {
      edges.push({
        hexes: hasNeighbor
          ? [hex, neighbor].sort((a, b) => {
              if (a.q !== b.q) return a.q - b.q
              return a.r - b.r
            }) as [HexCoordinate, HexCoordinate]
          : [hex, { q: 999, r: 999 }],
        vertices: [vertex1, vertex2],
      })
    }
  }

  return edges
}

/**
 * Get all unique edges on the board
 */
export function getAllEdges(hexes: HexCoordinate[]): EdgeCoordinate[] {
  const edgeMap = new Map<string, EdgeCoordinate>()

  for (const hex of hexes) {
    const hexEdges = getHexEdges(hex, hexes)
    for (const edge of hexEdges) {
      const key = edgeToKey(edge)
      if (!edgeMap.has(key)) {
        edgeMap.set(key, edge)
      }
    }
  }

  return Array.from(edgeMap.values())
}

/**
 * Convert edge to unique string key
 */
export function edgeToKey(edge: EdgeCoordinate): string {
  const v1Key = vertexToKey(edge.vertices[0])
  const v2Key = vertexToKey(edge.vertices[1])
  const [key1, key2] = [v1Key, v2Key].sort()
  return `e-${key1}-${key2}`
}

/**
 * Check if two edges are equal
 */
export function edgeEquals(a: EdgeCoordinate, b: EdgeCoordinate): boolean {
  return edgeToKey(a) === edgeToKey(b)
}

/**
 * Get pixel coordinates for edge midpoint
 */
export function edgeToPixel(edge: EdgeCoordinate): PixelCoordinate {
  const p1 = vertexToPixel(edge.vertices[0])
  const p2 = vertexToPixel(edge.vertices[1])
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}

/**
 * Get edges connected to a vertex
 */
export function getVertexEdges(
  vertex: VertexCoordinate,
  allEdges: EdgeCoordinate[]
): EdgeCoordinate[] {
  return allEdges.filter(
    edge =>
      vertexEquals(edge.vertices[0], vertex) || vertexEquals(edge.vertices[1], vertex)
  )
}

/**
 * Get vertices adjacent to a vertex (connected by an edge)
 */
export function getAdjacentVertices(
  vertex: VertexCoordinate,
  allEdges: EdgeCoordinate[]
): VertexCoordinate[] {
  const edges = getVertexEdges(vertex, allEdges)
  const adjacent: VertexCoordinate[] = []

  for (const edge of edges) {
    if (vertexEquals(edge.vertices[0], vertex)) {
      adjacent.push(edge.vertices[1])
    } else {
      adjacent.push(edge.vertices[0])
    }
  }

  return adjacent
}
