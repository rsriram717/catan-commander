import { Hex as HexType } from '../../types/board'
import { hexToPixel, getHexPath } from '../../utils/hexMath'
import { RESOURCE_COLORS } from '../../utils/constants'

interface HexProps {
  hex: HexType
  onClick?: () => void
  isSelected?: boolean
}

export default function Hex({ hex, onClick, isSelected = false }: HexProps) {
  const center = hexToPixel(hex.coordinate)
  const path = getHexPath(center)

  // Get fill color based on resource type
  const fillColor = hex.resource ? RESOURCE_COLORS[hex.resource] : '#e5e7eb'

  return (
    <g
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        onClick ? 'hover:opacity-80' : ''
      }`}
    >
      {/* Hex shape */}
      <path
        d={path}
        fill={fillColor}
        stroke={isSelected ? '#3b82f6' : '#374151'}
        strokeWidth={isSelected ? 3 : 1.5}
        className="transition-all"
      />

      {/* Number token */}
      {hex.number && (
        <g>
          {/* Token background circle */}
          <circle
            cx={center.x}
            cy={center.y}
            r={20}
            fill={hex.number === 6 || hex.number === 8 ? '#dc2626' : '#f3f4f6'}
            stroke="#1f2937"
            strokeWidth={1.5}
          />
          {/* Number text */}
          <text
            x={center.x}
            y={center.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xl font-bold select-none"
            fill={hex.number === 6 || hex.number === 8 ? 'white' : '#1f2937'}
          >
            {hex.number}
          </text>
          {/* Probability dots */}
          <text
            x={center.x}
            y={center.y + 12}
            textAnchor="middle"
            className="text-xs select-none"
            fill={hex.number === 6 || hex.number === 8 ? 'white' : '#4b5563'}
          >
            {'•'.repeat(Math.min(5, Math.abs(7 - hex.number)))}
          </text>
        </g>
      )}

      {/* Desert indicator */}
      {hex.resource === 'desert' && (
        <text
          x={center.x}
          y={center.y}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-sm font-semibold select-none"
          fill="#92400e"
        >
          DESERT
        </text>
      )}

      {/* Robber */}
      {hex.hasRobber && (
        <g>
          <circle cx={center.x} cy={center.y - 35} r={8} fill="#1f2937" />
          <rect
            x={center.x - 6}
            y={center.y - 27}
            width={12}
            height={18}
            fill="#1f2937"
            rx={2}
          />
        </g>
      )}

      {/* Coordinate label (for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <text
          x={center.x}
          y={center.y + 35}
          textAnchor="middle"
          className="text-xs select-none"
          fill="#6b7280"
        >
          ({hex.coordinate.q},{hex.coordinate.r})
        </text>
      )}
    </g>
  )
}
