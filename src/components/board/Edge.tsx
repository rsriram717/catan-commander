import { EdgeCoordinate } from '../../types/coordinates'
import { vertexToPixel } from '../../utils/geometry'

interface EdgeProps {
  edge: EdgeCoordinate
  onClick?: () => void
  isOccupied?: boolean
  playerId?: number
}

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b']

export default function Edge({
  edge,
  onClick,
  isOccupied = false,
  playerId,
}: EdgeProps) {
  const v1 = vertexToPixel(edge.vertices[0])
  const v2 = vertexToPixel(edge.vertices[1])

  return (
    <g onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      {/* Clickable area (wider than visual) */}
      {onClick && !isOccupied && (
        <line
          x1={v1.x}
          y1={v1.y}
          x2={v2.x}
          y2={v2.y}
          stroke="transparent"
          strokeWidth={10}
          className="hover:stroke-blue-200 hover:stroke-opacity-50 transition-all"
        />
      )}

      {/* Road */}
      {isOccupied && playerId !== undefined ? (
        <line
          x1={v1.x}
          y1={v1.y}
          x2={v2.x}
          y2={v2.y}
          stroke={PLAYER_COLORS[playerId]}
          strokeWidth={5}
          strokeLinecap="round"
        />
      ) : (
        /* Empty edge marker (for debugging) */
        process.env.NODE_ENV === 'development' && (
          <line
            x1={v1.x}
            y1={v1.y}
            x2={v2.x}
            y2={v2.y}
            stroke="#d1d5db"
            strokeWidth={1}
            opacity={0.3}
          />
        )
      )}
    </g>
  )
}
