import { Hex as HexType, Settlement, Road, Port as PortType } from '../../types/board'
import { VertexCoordinate, EdgeCoordinate } from '../../types/coordinates'
import Hex from './Hex'
import Vertex from './Vertex'
import Edge from './Edge'
import Port from './Port'
import { hexToPixel } from '../../utils/hexMath'
import { getAllVertices, getAllEdges, vertexToKey } from '../../utils/geometry'
import { HEX_SIZE } from '../../utils/constants'

interface HexBoardProps {
  hexes: HexType[]
  settlements?: Settlement[]
  roads?: Road[]
  ports?: PortType[]
  onHexClick?: (hex: HexType) => void
  onVertexClick?: (vertex: VertexCoordinate) => void
  onEdgeClick?: (edge: EdgeCoordinate) => void
  selectedHex?: HexType
  recommendedVertices?: VertexCoordinate[]
  highlightedVertex?: VertexCoordinate
}

export default function HexBoard({
  hexes,
  settlements = [],
  roads = [],
  ports = [],
  onHexClick,
  onVertexClick,
  onEdgeClick,
  selectedHex,
  recommendedVertices = [],
  highlightedVertex,
}: HexBoardProps) {
  // Calculate viewBox to center the board
  const positions = hexes.map(hex => hexToPixel(hex.coordinate))
  const minX = Math.min(...positions.map(p => p.x)) - HEX_SIZE * 2
  const maxX = Math.max(...positions.map(p => p.x)) + HEX_SIZE * 2
  const minY = Math.min(...positions.map(p => p.y)) - HEX_SIZE * 2
  const maxY = Math.max(...positions.map(p => p.y)) + HEX_SIZE * 2

  const width = maxX - minX
  const height = maxY - minY

  // Get all vertices and edges
  const allVertices = getAllVertices(hexes.map(h => h.coordinate))
  const allEdges = getAllEdges(hexes.map(h => h.coordinate))

  return (
    <svg
      viewBox={`${minX} ${minY} ${width} ${height}`}
      className="w-full h-full"
      style={{ maxHeight: '80vh' }}
    >
      <defs>
        <radialGradient id="ocean-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.15} />
        </radialGradient>

        {/* Terrain Patterns */}
        {/* Wood/Forest Pattern */}
        <pattern id="wood-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="3" fill="#1a3d1a" opacity="0.4" />
          <circle cx="30" cy="15" r="4" fill="#1a3d1a" opacity="0.3" />
          <circle cx="20" cy="30" r="3.5" fill="#1a3d1a" opacity="0.35" />
          <rect x="9" y="13" width="2" height="6" fill="#2d1a0a" opacity="0.3" />
          <rect x="29" y="19" width="2" height="7" fill="#2d1a0a" opacity="0.25" />
        </pattern>

        {/* Brick/Clay Pattern */}
        <pattern id="brick-pattern" x="0" y="0" width="30" height="15" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="28" height="6" fill="none" stroke="#7a3e2e" strokeWidth="0.5" opacity="0.3" />
          <rect x="0" y="8" width="28" height="6" fill="none" stroke="#7a3e2e" strokeWidth="0.5" opacity="0.3" />
          <line x1="14" y1="0" x2="14" y2="6" stroke="#7a3e2e" strokeWidth="0.5" opacity="0.3" />
          <line x1="7" y1="8" x2="7" y2="14" stroke="#7a3e2e" strokeWidth="0.5" opacity="0.3" />
          <line x1="21" y1="8" x2="21" y2="14" stroke="#7a3e2e" strokeWidth="0.5" opacity="0.3" />
        </pattern>

        {/* Sheep/Pasture Pattern */}
        <pattern id="sheep-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M10,15 Q10,12 12,12 Q14,12 14,15 Q14,18 12,18 Q10,18 10,15" fill="#6b9b6b" opacity="0.25" />
          <path d="M35,20 Q35,17 37,17 Q39,17 39,20 Q39,23 37,23 Q35,23 35,20" fill="#6b9b6b" opacity="0.25" />
          <path d="M20,40 Q20,37 22,37 Q24,37 24,40 Q24,43 22,43 Q20,43 20,40" fill="#6b9b6b" opacity="0.25" />
        </pattern>

        {/* Wheat Pattern */}
        <pattern id="wheat-pattern" x="0" y="0" width="35" height="50" patternUnits="userSpaceOnUse">
          <g opacity="0.3">
            <line x1="10" y1="35" x2="10" y2="15" stroke="#b8860b" strokeWidth="1" />
            <ellipse cx="10" cy="13" rx="3" ry="6" fill="#b8860b" />
            <line x1="25" y1="40" x2="25" y2="18" stroke="#b8860b" strokeWidth="1" />
            <ellipse cx="25" cy="16" rx="3" ry="6" fill="#b8860b" />
          </g>
        </pattern>

        {/* Ore/Mountain Pattern */}
        <pattern id="ore-pattern" x="0" y="0" width="45" height="40" patternUnits="userSpaceOnUse">
          <polygon points="15,30 10,20 20,20" fill="#4a5568" opacity="0.3" />
          <polygon points="35,35 28,18 42,18" fill="#4a5568" opacity="0.25" />
          <polygon points="25,38 20,28 30,28" fill="#4a5568" opacity="0.28" />
        </pattern>

        {/* Desert Pattern */}
        <pattern id="desert-pattern" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
          <path d="M0,15 Q15,10 30,15 T60,15" fill="none" stroke="#b89968" strokeWidth="1" opacity="0.25" />
          <path d="M0,20 Q15,15 30,20 T60,20" fill="none" stroke="#b89968" strokeWidth="1" opacity="0.25" />
          <circle cx="45" cy="8" r="1.5" fill="#b89968" opacity="0.3" />
          <circle cx="15" cy="12" r="1.5" fill="#b89968" opacity="0.3" />
        </pattern>

        {/* Token texture pattern */}
        <pattern id="token-texture" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="10" height="10" fill="#ffffff" opacity="0.05" />
          <line x1="0" y1="0" x2="10" y2="10" stroke="#000000" strokeWidth="0.3" opacity="0.05" />
        </pattern>
      </defs>

      {/* Water/ocean background */}
      <rect
        x={minX}
        y={minY}
        width={width}
        height={height}
        fill="url(#ocean-gradient)"
      />

      {/* Render all edges (roads) */}
      {allEdges.map((edge, index) => {
        const road = roads.find(r => JSON.stringify(r.edge) === JSON.stringify(edge))
        const port = ports.find(p => JSON.stringify(p.edge) === JSON.stringify(edge))
        return (
          <Edge
            key={`edge-${index}`}
            edge={edge}
            onClick={onEdgeClick && !road && !port ? () => onEdgeClick(edge) : undefined}
            isOccupied={!!road}
            playerId={road?.playerId}
          />
        )
      })}

      {/* Render all hexes */}
      {hexes.map((hex) => (
        <Hex
          key={`${hex.coordinate.q}-${hex.coordinate.r}`}
          hex={hex}
          onClick={onHexClick ? () => onHexClick(hex) : undefined}
          isSelected={
            selectedHex?.coordinate.q === hex.coordinate.q &&
            selectedHex?.coordinate.r === hex.coordinate.r
          }
        />
      ))}

      {/* Render ports */}
      {ports.map((port, index) => (
        <Port key={`port-${index}`} port={port} />
      ))}

      {/* Render all vertices (settlements) */}
      {allVertices.map((vertex, index) => {
        const settlement = settlements.find(
          s => vertexToKey(s.vertex) === vertexToKey(vertex)
        )
        const isRecommended = recommendedVertices.some(
          rv => vertexToKey(rv) === vertexToKey(vertex)
        )
        const rank = recommendedVertices.findIndex(
          rv => vertexToKey(rv) === vertexToKey(vertex)
        )

        return (
          <Vertex
            key={`vertex-${index}`}
            vertex={vertex}
            onClick={onVertexClick ? () => onVertexClick(vertex) : undefined}
            isOccupied={!!settlement}
            playerId={settlement?.playerId}
            isRecommended={isRecommended}
            rank={rank >= 0 ? rank + 1 : undefined}
          />
        )
      })}
    </svg>
  )
}
