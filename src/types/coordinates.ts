// Axial coordinate system for hexagons
// https://www.redblobgames.com/grids/hexagons/
export interface HexCoordinate {
  q: number; // column
  r: number; // row
}

// A vertex is where 3 hexes meet (settlement placement point)
// We identify vertices by the 3 hexes that surround them
export interface VertexCoordinate {
  // The 3 hexes that touch this vertex
  // Sorted in a consistent order for deduplication
  hexes: [HexCoordinate, HexCoordinate, HexCoordinate];
  // Position relative to center hex (for rendering)
  direction: 0 | 1 | 2 | 3 | 4 | 5; // 0 = top, clockwise
}

// An edge is where 2 hexes meet (road placement line)
export interface EdgeCoordinate {
  // The 2 hexes that border this edge
  hexes: [HexCoordinate, HexCoordinate];
  // The 2 vertices this edge connects
  vertices: [VertexCoordinate, VertexCoordinate];
}

// Pixel coordinates for rendering
export interface PixelCoordinate {
  x: number;
  y: number;
}
