import { Hex as HexType, Settlement, Road, Port as PortType } from '../../types/board'
import { VertexCoordinate } from '../../types/coordinates'
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
      {/* Water/ocean background */}
      <rect
        x={minX}
        y={minY}
        width={width}
        height={height}
        fill="#4299e1"
        opacity={0.2}
      />

      {/* Render all edges (roads) */}
      {allEdges.map((edge, index) => {
        const road = roads.find(r => JSON.stringify(r.edge) === JSON.stringify(edge))
        return (
          <Edge
            key={`edge-${index}`}
            edge={edge}
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
