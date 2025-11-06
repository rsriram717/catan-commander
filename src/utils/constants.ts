import { HexCoordinate } from '../types/coordinates'
import { ResourceType } from '../types/board'

// Hex rendering constants
export const HEX_SIZE = 60 // Radius of hexagon
export const HEX_WIDTH = HEX_SIZE * 2
export const HEX_HEIGHT = HEX_SIZE * Math.sqrt(3)

// Standard Catan board layout (19 hexes in axial coordinates)
// Using proper axial coordinates for a hexagonal board
// Layout visualization:
//       ( 0,-2) ( 1,-2)
//     (-1,-1) ( 0,-1) ( 1,-1)
//   (-2, 0) (-1, 0) ( 0, 0) ( 1, 0) ( 2, 0)
//     (-2, 1) (-1, 1) ( 0, 1) ( 1, 1)
//       (-2, 2) (-1, 2)
export const STANDARD_BOARD_LAYOUT: HexCoordinate[] = [
  // Row 1 (top) - 3 hexes
  { q: 0, r: -2 },
  { q: 1, r: -2 },
  { q: 2, r: -2 },
  // Row 2 - 4 hexes
  { q: -1, r: -1 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
  { q: 2, r: -1 },
  // Row 3 (middle - widest) - 5 hexes
  { q: -2, r: 0 },
  { q: -1, r: 0 },
  { q: 0, r: 0 },
  { q: 1, r: 0 },
  { q: 2, r: 0 },
  // Row 4 - 4 hexes
  { q: -2, r: 1 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
  { q: 1, r: 1 },
  // Row 5 (bottom) - 3 hexes
  { q: -2, r: 2 },
  { q: -1, r: 2 },
  { q: 0, r: 2 },
]

// Standard beginner board setup
export const BEGINNER_BOARD: Array<{ resource: ResourceType; number: number | null }> = [
  { resource: 'ore', number: 10 },
  { resource: 'sheep', number: 2 },
  { resource: 'wood', number: 9 },

  { resource: 'wheat', number: 12 },
  { resource: 'brick', number: 6 },
  { resource: 'sheep', number: 4 },
  { resource: 'brick', number: 10 },

  { resource: 'wheat', number: 9 },
  { resource: 'wood', number: 11 },
  { resource: 'desert', number: null },
  { resource: 'wood', number: 3 },
  { resource: 'ore', number: 8 },

  { resource: 'wood', number: 8 },
  { resource: 'ore', number: 3 },
  { resource: 'wheat', number: 4 },
  { resource: 'sheep', number: 5 },

  { resource: 'brick', number: 5 },
  { resource: 'wheat', number: 6 },
  { resource: 'sheep', number: 11 },
]

// Dice roll probabilities
export const DICE_PROBABILITIES: Record<number, number> = {
  2: 1 / 36,
  3: 2 / 36,
  4: 3 / 36,
  5: 4 / 36,
  6: 5 / 36,
  7: 6 / 36, // Robber - not used for resource calculation
  8: 5 / 36,
  9: 4 / 36,
  10: 3 / 36,
  11: 2 / 36,
  12: 1 / 36,
}

// Number of dots typically shown on Catan number tokens (for visual reference)
export const NUMBER_DOTS: Record<number, number> = {
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  8: 5,
  9: 4,
  10: 3,
  11: 2,
  12: 1,
}

// Resource colors - matching physical Catan board
export const RESOURCE_COLORS: Record<ResourceType, string> = {
  wood: '#2d5a1f', // Rich forest green
  brick: '#b44c2e', // Reddish terracotta clay
  sheep: '#7cb342', // Natural lime green pasture
  wheat: '#e6b833', // Warm golden fields
  ore: '#708090', // Slate gray mountains
  desert: '#d4b896', // Sandy beige
}

// Secondary colors for gradients - lighter shades
export const RESOURCE_COLORS_LIGHT: Record<ResourceType, string> = {
  wood: '#4a7c2f',
  brick: '#d4764e',
  sheep: '#a5d26a',
  wheat: '#f4d03f',
  ore: '#9ca3af',
  desert: '#e8d4a2',
}
