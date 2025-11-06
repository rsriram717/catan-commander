import { PlacementRecommendation } from '../../types/recommendations'

interface RecommendationPanelProps {
  recommendations: PlacementRecommendation[]
  placementNumber: 1 | 2
  onSelectRecommendation?: (rec: PlacementRecommendation) => void
  selectedRec?: PlacementRecommendation
}

const RESOURCE_EMOJI: Record<string, string> = {
  wood: '🌲',
  brick: '🧱',
  sheep: '🐑',
  wheat: '🌾',
  ore: '⛰️',
}

export default function RecommendationPanel({
  recommendations,
  placementNumber,
  onSelectRecommendation,
  selectedRec,
}: RecommendationPanelProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {placementNumber === 1 ? 'First' : 'Second'} Settlement Recommendations
        </h2>
        <p className="text-gray-600">
          Configure your board to see placement recommendations
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">
        {placementNumber === 1 ? 'First' : 'Second'} Settlement Recommendations
      </h2>

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            onClick={() => onSelectRecommendation?.(rec)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedRec === rec
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    Score: {rec.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {rec.resourceYield && Object.entries(rec.resourceYield)
                      .filter(([_, amount]) => amount > 0)
                      .map(([resource]) => RESOURCE_EMOJI[resource])
                      .join(' ')}
                  </div>
                </div>
              </div>

              {rec.portAccess && (
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                  {rec.portAccess} port
                </div>
              )}
            </div>

            {/* Expected Yield */}
            <div className="mb-2">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Expected Yield (per 36 rolls)
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(rec.resourceYield || {})
                  .filter(([_, amount]) => amount > 0)
                  .map(([resource, amount]) => (
                    <div
                      key={resource}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      <span>{RESOURCE_EMOJI[resource]}</span>
                      <span className="font-semibold">{amount.toFixed(1)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Yield:</span>
                <span className="ml-1 font-semibold">
                  {(rec.breakdown.expectedYield * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Diversity:</span>
                <span className="ml-1 font-semibold">
                  {(rec.breakdown.resourceDiversity * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Numbers:</span>
                <span className="ml-1 font-semibold">
                  {(rec.breakdown.numberQuality * 100).toFixed(0)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Port:</span>
                <span className="ml-1 font-semibold">
                  {(rec.breakdown.portAccess * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Numbers */}
            {rec.adjacentNumbers && rec.adjacentNumbers.length > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Numbers: {rec.adjacentNumbers.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
