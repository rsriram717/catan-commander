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
      <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {placementNumber === 1 ? 'First' : 'Second'} Settlement Recommendations
        </h2>
        <p className="text-gray-800">
          Configure your board to see placement recommendations
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        {placementNumber === 1 ? '🥇 First' : '🥈 Second'} Settlement Recommendations
      </h2>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            onClick={() => onSelectRecommendation?.(rec)}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all shadow-md hover:shadow-lg ${
              selectedRec === rec
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100'
                : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md text-lg">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    Score: {rec.score.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-800">
                    {rec.resourceYield && Object.entries(rec.resourceYield)
                      .filter(([_, amount]) => amount > 0)
                      .map(([resource]) => RESOURCE_EMOJI[resource])
                      .join(' ')}
                  </div>
                </div>
              </div>

              {rec.portAccess && (
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                  🚢 {rec.portAccess}
                </div>
              )}
            </div>

            {/* Expected Yield */}
            <div className="mb-3">
              <div className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Expected Yield (per 36 rolls)
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(rec.resourceYield || {})
                  .filter(([_, amount]) => amount > 0)
                  .map(([resource, amount]) => (
                    <div
                      key={resource}
                      className="flex items-center gap-1 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-lg text-sm border border-gray-200 shadow-sm"
                    >
                      <span className="text-lg">{RESOURCE_EMOJI[resource]}</span>
                      <span className="font-bold text-gray-800">{amount.toFixed(1)}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Yield:</span>
                <span className="ml-1 font-bold text-blue-600">
                  {(rec.breakdown.expectedYield * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Diversity:</span>
                <span className="ml-1 font-bold text-green-600">
                  {(rec.breakdown.resourceDiversity * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Numbers:</span>
                <span className="ml-1 font-bold text-orange-600">
                  {(rec.breakdown.numberQuality * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Port:</span>
                <span className="ml-1 font-bold text-purple-600">
                  {(rec.breakdown.portAccess * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Numbers */}
            {rec.adjacentNumbers && rec.adjacentNumbers.length > 0 && (
              <div className="mt-2 text-xs">
                <span className="text-gray-700 font-medium">Numbers: </span>
                <span className="font-semibold text-gray-900">
                  {rec.adjacentNumbers.join(', ')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
