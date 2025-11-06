import { EdgeCoordinate } from '../../types/coordinates'
import { vertexToPixel } from '../../utils/geometry'

interface EdgeProps {
  edge: EdgeCoordinate
  onClick?: () => void
  isOccupied?: boolean
  playerId?: number
}

const PLAYER_COLORS = ['#dc2626', '#2563eb', '#059669', '#ea580c']
const PLAYER_COLORS_DARK = ['#991b1b', '#1e40af', '#047857', '#c2410c']

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
          stroke="#3b82f6"
          strokeWidth={8}
          opacity={0.2}
          className="hover:opacity-50 transition-all"
        />
      )}

      {/* Road */}
      {isOccupied && playerId !== undefined ? (
        <g style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))' }}>
          {/* Road shadow/outline */}
          <line
            x1={v1.x}
            y1={v1.y}
            x2={v2.x}
            y2={v2.y}
            stroke={PLAYER_COLORS_DARK[playerId]}
            strokeWidth={7}
            strokeLinecap="round"
          />
          {/* Road main color */}
          <line
            x1={v1.x}
            y1={v1.y}
            x2={v2.x}
            y2={v2.y}
            stroke={PLAYER_COLORS[playerId]}
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>
      ) : (
        /* Empty edge marker (for debugging) */
        process.env.NODE_ENV === 'development' && (
          <line
            x1={v1.x}
            y1={v1.y}
            x2={v2.x}
            y2={v2.y}
            stroke="#cbd5e1"
            strokeWidth={1}
            opacity={0.2}
          />
        )
      )}
    </g>
  )
}
