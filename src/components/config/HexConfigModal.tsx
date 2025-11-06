import { useState } from 'react'
import { ResourceType } from '../../types/board'

interface HexConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (resource: ResourceType, number: number | null) => void
  currentResource?: ResourceType | null
  currentNumber?: number | null
}

const RESOURCES: ResourceType[] = ['wood', 'brick', 'sheep', 'wheat', 'ore', 'desert']
const NUMBERS = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]

const RESOURCE_LABELS: Record<ResourceType, string> = {
  wood: '🌲 Wood',
  brick: '🧱 Brick',
  sheep: '🐑 Sheep',
  wheat: '🌾 Wheat',
  ore: '⛰️ Ore',
  desert: '🏜️ Desert',
}

export default function HexConfigModal({
  isOpen,
  onClose,
  onSave,
  currentResource,
  currentNumber,
}: HexConfigModalProps) {
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(
    currentResource || null
  )
  const [selectedNumber, setSelectedNumber] = useState<number | null>(
    currentNumber || null
  )

  if (!isOpen) return null

  const handleSave = () => {
    if (selectedResource) {
      onSave(
        selectedResource,
        selectedResource === 'desert' ? null : selectedNumber
      )
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Configure Hex</h2>

        {/* Resource Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resource Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {RESOURCES.map(resource => (
              <button
                key={resource}
                onClick={() => setSelectedResource(resource)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedResource === resource
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {RESOURCE_LABELS[resource]}
              </button>
            ))}
          </div>
        </div>

        {/* Number Selection */}
        {selectedResource && selectedResource !== 'desert' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number Token
            </label>
            <div className="grid grid-cols-5 gap-2">
              {NUMBERS.map(num => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(num)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedNumber === num
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${
                    num === 6 || num === 8
                      ? 'font-bold text-red-600'
                      : 'text-gray-900'
                  }`}
                >
                  {num}
                  <div className="text-xs text-gray-500">
                    {'•'.repeat(Math.min(5, Math.abs(7 - num)))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedResource || (selectedResource !== 'desert' && !selectedNumber)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
