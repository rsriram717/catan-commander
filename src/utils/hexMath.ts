import { HexCoordinate, PixelCoordinate } from '../types/coordinates'
import { HEX_SIZE } from './constants'

/**
 * Convert axial hex coordinates to pixel coordinates
 * Using flat-top hexagon orientation
 * Reference: https://www.redblobgames.com/grids/hexagons/#hex-to-pixel-axial
 */
export function hexToPixel(hex: HexCoordinate): PixelCoordinate {
  const x = HEX_SIZE * (3/2 * hex.q)
  const y = HEX_SIZE * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r)
  return { x, y }
}

/**
 * Get the 6 neighboring hex coordinates
 * Returns in clockwise order starting from top-right
 */
export function getHexNeighbors(hex: HexCoordinate): HexCoordinate[] {
  const directions: HexCoordinate[] = [
    { q: 1, r: -1 }, // top-right
    { q: 1, r: 0 },  // right
    { q: 0, r: 1 },  // bottom-right
    { q: -1, r: 1 }, // bottom-left
    { q: -1, r: 0 }, // left
    { q: 0, r: -1 }, // top-left
  ]

  return directions.map(dir => ({
    q: hex.q + dir.q,
    r: hex.r + dir.r,
  }))
}

/**
 * Check if two hex coordinates are equal
 */
export function hexEquals(a: HexCoordinate, b: HexCoordinate): boolean {
  return a.q === b.q && a.r === b.r
}

/**
 * Calculate distance between two hexes
 */
export function hexDistance(a: HexCoordinate, b: HexCoordinate): number {
  const s1 = -a.q - a.r
  const s2 = -b.q - b.r
  return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(s1 - s2)) / 2
}

/**
 * Get pixel coordinates for the 6 vertices of a hex
 * Returns in clockwise order starting from top
 */
export function getHexVertexPixels(center: PixelCoordinate): PixelCoordinate[] {
  const vertices: PixelCoordinate[] = []
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30 // Start at top
    const angleRad = (Math.PI / 180) * angleDeg
    vertices.push({
      x: center.x + HEX_SIZE * Math.cos(angleRad),
      y: center.y + HEX_SIZE * Math.sin(angleRad),
    })
  }
  return vertices
}

/**
 * Generate SVG path string for hexagon
 */
export function getHexPath(center: PixelCoordinate): string {
  const vertices = getHexVertexPixels(center)
  const path = vertices.map((v, i) => `${i === 0 ? 'M' : 'L'} ${v.x},${v.y}`).join(' ')
  return `${path} Z`
}

/**
 * Check if a hex coordinate is in the standard board layout
 */
export function isValidHex(hex: HexCoordinate, validHexes: HexCoordinate[]): boolean {
  return validHexes.some(validHex => hexEquals(validHex, hex))
}
