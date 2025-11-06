import { Port as PortType } from '../../types/board'
import { edgeToPixel } from '../../utils/geometry'

interface PortProps {
  port: PortType
}

export default function Port({ port }: PortProps) {
  if (!port.type) return null

  const pos = edgeToPixel(port.edge)

  const label = port.ratio === 2 ? `2:1` : `3:1`
  const resourceLabel =
    port.type === 'generic' ? '?' : port.type.charAt(0).toUpperCase()

  return (
    <g>
      {/* Port background */}
      <circle cx={pos.x} cy={pos.y} r={18} fill="white" stroke="#374151" strokeWidth={2} />

      {/* Port icon */}
      <text
        x={pos.x}
        y={pos.y - 3}
        textAnchor="middle"
        className="text-sm font-bold"
        fill="#1f2937"
      >
        {resourceLabel}
      </text>
      <text
        x={pos.x}
        y={pos.y + 10}
        textAnchor="middle"
        className="text-xs"
        fill="#6b7280"
      >
        {label}
      </text>
    </g>
  )
}
