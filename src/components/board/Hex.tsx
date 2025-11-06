import { Hex as HexType } from '../../types/board'
import { hexToPixel, getHexPath } from '../../utils/hexMath'
import { RESOURCE_COLORS, RESOURCE_COLORS_LIGHT } from '../../utils/constants'

interface HexProps {
  hex: HexType
  onClick?: () => void
  isSelected?: boolean
}

export default function Hex({ hex, onClick, isSelected = false }: HexProps) {
  const center = hexToPixel(hex.coordinate)
  const path = getHexPath(center)

  // Get colors based on resource type
  const fillColor = hex.resource ? RESOURCE_COLORS[hex.resource] : '#e5e7eb'
  const lightColor = hex.resource ? RESOURCE_COLORS_LIGHT[hex.resource] : '#f3f4f6'

  // Unique gradient ID for this hex
  const gradientId = `hex-gradient-${hex.coordinate.q}-${hex.coordinate.r}`

  // Get pattern ID based on resource type
  const getPatternId = (resource: typeof hex.resource) => {
    const patternMap: Record<string, string> = {
      wood: 'wood-pattern',
      brick: 'brick-pattern',
      sheep: 'sheep-pattern',
      wheat: 'wheat-pattern',
      ore: 'ore-pattern',
      desert: 'desert-pattern',
    }
    return resource ? patternMap[resource] : null
  }

  const patternId = getPatternId(hex.resource)

  return (
    <g
      onClick={onClick}
      className={`cursor-pointer transition-all ${
        onClick ? 'hover:brightness-105' : ''
      }`}
      style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="100%" stopColor={fillColor} />
        </linearGradient>
      </defs>

      {/* Hex shape with gradient base */}
      <path
        d={path}
        fill={`url(#${gradientId})`}
        stroke="none"
      />

      {/* Terrain pattern overlay */}
      {patternId && (
        <path
          d={path}
          fill={`url(#${patternId})`}
          stroke="none"
        />
      )}

      {/* Wooden border frame */}
      <path
        d={path}
        fill="none"
        stroke={isSelected ? '#3b82f6' : '#d4a574'}
        strokeWidth={isSelected ? 4 : 3.5}
        className="transition-all"
      />
      {/* Inner border for depth */}
      <path
        d={path}
        fill="none"
        stroke={isSelected ? '#2563eb' : '#8b6f47'}
        strokeWidth={isSelected ? 2 : 1.5}
        opacity={0.6}
        className="transition-all"
      />

      {/* Number token */}
      {hex.number && (
        <g filter="drop-shadow(0 3px 5px rgba(0,0,0,0.4))">
          {/* Token shadow base */}
          <circle
            cx={center.x}
            cy={center.y + 1}
            r={25}
            fill="#000000"
            opacity={0.15}
          />
          {/* Token outer ring */}
          <circle
            cx={center.x}
            cy={center.y}
            r={24}
            fill={hex.number === 6 || hex.number === 8 ? '#a8573a' : '#c9b89a'}
            opacity={0.7}
          />
          {/* Token main circle - cream/beige */}
          <circle
            cx={center.x}
            cy={center.y}
            r={22}
            fill={hex.number === 6 || hex.number === 8 ? '#c85a54' : '#f5e6d3'}
            stroke={hex.number === 6 || hex.number === 8 ? '#8b3a2e' : '#a88f6f'}
            strokeWidth={2}
          />
          {/* Subtle texture on token */}
          <circle
            cx={center.x}
            cy={center.y}
            r={22}
            fill="url(#token-texture)"
            opacity={0.1}
          />
          {/* Number text */}
          <text
            x={center.x}
            y={center.y - 1}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-2xl font-bold select-none"
            fill={hex.number === 6 || hex.number === 8 ? '#ffffff' : '#2d1810'}
            style={{ fontFamily: 'Georgia, serif', textShadow: hex.number === 6 || hex.number === 8 ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}
          >
            {hex.number}
          </text>
          {/* Probability dots */}
          <text
            x={center.x}
            y={center.y + 13}
            textAnchor="middle"
            className="text-xs select-none"
            fill={hex.number === 6 || hex.number === 8 ? '#f5d5d5' : '#6b5847'}
            opacity={0.9}
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
