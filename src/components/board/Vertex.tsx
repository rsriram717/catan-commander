import { VertexCoordinate } from '../../types/coordinates'
import { vertexToPixel } from '../../utils/geometry'

interface VertexProps {
  vertex: VertexCoordinate
  onClick?: () => void
  isOccupied?: boolean
  isRecommended?: boolean
  playerId?: number
  rank?: number
}

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b']

export default function Vertex({
  vertex,
  onClick,
  isOccupied = false,
  isRecommended = false,
  playerId,
  rank,
}: VertexProps) {
  const pos = vertexToPixel(vertex)

  return (
    <g
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer' : ''} ${
        isRecommended ? 'animate-pulse' : ''
      }`}
    >
      {/* Hover/clickable area */}
      {onClick && !isOccupied && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={12}
          fill="transparent"
          className="hover:fill-blue-200 hover:fill-opacity-50 transition-all"
        />
      )}

      {/* Recommendation highlight */}
      {isRecommended && !isOccupied && (
        <>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={15}
            fill="#fbbf24"
            opacity={0.3}
            className="animate-pulse"
          />
          {rank !== undefined && (
            <text
              x={pos.x}
              y={pos.y - 20}
              textAnchor="middle"
              className="text-sm font-bold"
              fill="#d97706"
            >
              #{rank}
            </text>
          )}
        </>
      )}

      {/* Settlement */}
      {isOccupied && playerId !== undefined && (
        <g>
          {/* Settlement house shape */}
          <polygon
            points={`
              ${pos.x},${pos.y - 10}
              ${pos.x - 8},${pos.y - 3}
              ${pos.x - 8},${pos.y + 8}
              ${pos.x + 8},${pos.y + 8}
              ${pos.x + 8},${pos.y - 3}
            `}
            fill={PLAYER_COLORS[playerId]}
            stroke="#1f2937"
            strokeWidth={1.5}
          />
          {/* Roof */}
          <polygon
            points={`
              ${pos.x},${pos.y - 15}
              ${pos.x - 10},${pos.y - 3}
              ${pos.x + 10},${pos.y - 3}
            `}
            fill={PLAYER_COLORS[playerId]}
            stroke="#1f2937"
            strokeWidth={1.5}
          />
        </g>
      )}

      {/* Empty vertex marker (for debugging) */}
      {!isOccupied && !isRecommended && process.env.NODE_ENV === 'development' && (
        <circle cx={pos.x} cy={pos.y} r={3} fill="#9ca3af" opacity={0.5} />
      )}
    </g>
  )
}
