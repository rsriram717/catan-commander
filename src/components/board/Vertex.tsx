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

const PLAYER_COLORS = ['#dc2626', '#2563eb', '#059669', '#ea580c']
const PLAYER_COLORS_LIGHT = ['#fca5a5', '#93c5fd', '#6ee7b7', '#fdba74']

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
          r={14}
          fill="transparent"
          className="hover:fill-blue-400 hover:fill-opacity-40 transition-all"
          stroke="transparent"
          strokeWidth={2}
        />
      )}

      {/* Recommendation highlight */}
      {isRecommended && !isOccupied && (
        <>
          <circle
            cx={pos.x}
            cy={pos.y}
            r={16}
            fill="#fbbf24"
            opacity={0.4}
            className="animate-pulse"
          />
          <circle
            cx={pos.x}
            cy={pos.y}
            r={13}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={2}
            opacity={0.8}
          />
          {rank !== undefined && (
            <text
              x={pos.x}
              y={pos.y - 22}
              textAnchor="middle"
              className="text-sm font-bold"
              fill="#ffffff"
              stroke="#92400e"
              strokeWidth={0.5}
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
            >
              #{rank}
            </text>
          )}
        </>
      )}

      {/* Settlement */}
      {isOccupied && playerId !== undefined && (
        <g style={{ filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.4))' }}>
          {/* Settlement base shadow */}
          <polygon
            points={`
              ${pos.x},${pos.y - 9}
              ${pos.x - 8},${pos.y - 2}
              ${pos.x - 8},${pos.y + 9}
              ${pos.x + 8},${pos.y + 9}
              ${pos.x + 8},${pos.y - 2}
            `}
            fill={PLAYER_COLORS[playerId]}
            opacity={0.3}
          />
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
            strokeWidth={2}
          />
          {/* Highlight on house */}
          <polygon
            points={`
              ${pos.x - 1},${pos.y - 9}
              ${pos.x - 7},${pos.y - 2}
              ${pos.x - 7},${pos.y + 4}
              ${pos.x - 1},${pos.y - 2}
            `}
            fill={PLAYER_COLORS_LIGHT[playerId]}
            opacity={0.5}
          />
          {/* Roof */}
          <polygon
            points={`
              ${pos.x},${pos.y - 16}
              ${pos.x - 10},${pos.y - 3}
              ${pos.x + 10},${pos.y - 3}
            `}
            fill={PLAYER_COLORS[playerId]}
            stroke="#1f2937"
            strokeWidth={2}
          />
          {/* Roof highlight */}
          <polygon
            points={`
              ${pos.x},${pos.y - 16}
              ${pos.x - 10},${pos.y - 3}
              ${pos.x - 3},${pos.y - 6}
            `}
            fill={PLAYER_COLORS_LIGHT[playerId]}
            opacity={0.4}
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
