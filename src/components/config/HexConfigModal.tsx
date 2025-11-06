import { useState } from 'react'
import { ResourceType, PortType, Port } from '../../types/board'

interface HexConfigModalProps {
  isOpen: boolean
  onClose: () => void
  configMode: 'hex' | 'port'
  onSaveHex: (resource: ResourceType, number: number | null) => void
  onSavePort: (portType: PortType, ratio: 2 | 3) => void
  currentResource?: ResourceType | null
  currentNumber?: number | null
  currentPort?: Port
}

const RESOURCES: ResourceType[] = ['wood', 'brick', 'sheep', 'wheat', 'ore', 'desert']
const NUMBERS = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]
const PORT_TYPES: PortType[] = ['generic', 'wood', 'brick', 'sheep', 'wheat', 'ore']

const RESOURCE_LABELS: Record<ResourceType, string> = {
  wood: '🌲 Wood',
  brick: '🧱 Brick',
  sheep: '🐑 Sheep',
  wheat: '🌾 Wheat',
  ore: '⛰️ Ore',
  desert: '🏜️ Desert',
}

const PORT_LABELS: Record<Exclude<PortType, null>, string> = {
  generic: '❓ Any',
  wood: '🌲 Wood',
  brick: '🧱 Brick',
  sheep: '🐑 Sheep',
  wheat: '🌾 Wheat',
  ore: '⛰️ Ore',
}

export default function HexConfigModal({
  isOpen,
  onClose,
  configMode,
  onSaveHex,
  onSavePort,
  currentResource,
  currentNumber,
  currentPort,
}: HexConfigModalProps) {
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(
    currentResource || null
  )
  const [selectedNumber, setSelectedNumber] = useState<number | null>(
    currentNumber || null
  )
  const [selectedPortType, setSelectedPortType] = useState<PortType>(
    currentPort?.type || null
  )
  const [selectedPortRatio, setSelectedPortRatio] = useState<2 | 3>(
    currentPort?.ratio || 3
  )

  if (!isOpen) return null

  const handleSaveHex = () => {
    if (selectedResource) {
      onSaveHex(
        selectedResource,
        selectedResource === 'desert' ? null : selectedNumber
      )
      // Don't close - let user configure multiple hexes
    }
  }

  const handleSavePort = () => {
    onSavePort(selectedPortType, selectedPortRatio)
    // Don't close - let user configure multiple ports
  }

  const handleRemovePort = () => {
    onSavePort(null, 3)
  }

  return (
    <>
      {/* Side panel */}
      <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 border-l-2 border-gray-300 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {configMode === 'hex' ? '⚙️ Configure Hex' : '🚢 Configure Port'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

        {configMode === 'hex' ? (
          // Hex Configuration
          <>

        {/* Resource Selection */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
            Resource Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {RESOURCES.map(resource => (
              <button
                key={resource}
                onClick={() => setSelectedResource(resource)}
                className={`p-2 rounded-lg border-2 transition-all font-semibold text-sm ${
                  selectedResource === resource
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                {RESOURCE_LABELS[resource]}
              </button>
            ))}
          </div>
        </div>

        {/* Number Selection */}
        {selectedResource && selectedResource !== 'desert' && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
              Number Token
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {NUMBERS.map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  className={`p-2 rounded-lg border-2 transition-all text-sm ${
                    selectedNumber === num
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  } ${
                    num === 6 || num === 8
                      ? 'font-bold text-red-600'
                      : 'font-semibold text-gray-900'
                  }`}
                >
                  {num}
                  <div className="text-xs text-gray-500 mt-0.5">
                    {'•'.repeat(Math.min(5, Math.abs(7 - num)))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hex Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSaveHex}
            disabled={!selectedResource || (selectedResource !== 'desert' && !selectedNumber)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-sm disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
          >
            Save Hex
          </button>
        </div>
        </>
        ) : (
          // Port Configuration
          <>
        {/* Port Type Selection */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
            Port Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PORT_TYPES.map(portType => (
              <button
                key={portType}
                onClick={() => setSelectedPortType(portType)}
                className={`p-2 rounded-lg border-2 transition-all font-semibold text-sm ${
                  selectedPortType === portType
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                {PORT_LABELS[portType as Exclude<PortType, null>]}
              </button>
            ))}
          </div>
        </div>

        {/* Port Ratio Selection */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
            Trade Ratio
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedPortRatio(2)}
              className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                selectedPortRatio === 2
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              2:1
              <div className="text-xs text-gray-600 mt-1">Specific Resource</div>
            </button>
            <button
              onClick={() => setSelectedPortRatio(3)}
              className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                selectedPortRatio === 3
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              3:1
              <div className="text-xs text-gray-600 mt-1">Any Resource</div>
            </button>
          </div>
        </div>

        {/* Port Actions */}
        <div className="flex justify-end gap-2 mt-4">
          {currentPort && (
            <button
              onClick={handleRemovePort}
              className="px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all font-semibold text-sm"
            >
              Remove Port
            </button>
          )}
          <button
            onClick={handleSavePort}
            disabled={!selectedPortType}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-sm disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
          >
            Save Port
          </button>
        </div>
        </>
        )}
      </div>
      </div>
    </>
  )
}
