import { useState, useMemo } from 'react'
import HexBoard from '../board/HexBoard'
import HexConfigModal from '../config/HexConfigModal'
import RecommendationPanel from '../recommendations/RecommendationPanel'
import { Hex, ResourceType, Settlement, Road, BoardConfiguration } from '../../types/board'
import { VertexCoordinate } from '../../types/coordinates'
import { STANDARD_BOARD_LAYOUT, BEGINNER_BOARD } from '../../utils/constants'
import { generateRecommendations } from '../../engine/recommendations'
import { PlacementRecommendation } from '../../types/recommendations'

type AppMode = 'config' | 'placement'

function App() {
  // Board state
  const [hexes, setHexes] = useState<Hex[]>(() => {
    return STANDARD_BOARD_LAYOUT.map((coord, index) => ({
      coordinate: coord,
      resource: BEGINNER_BOARD[index].resource,
      number: BEGINNER_BOARD[index].number,
      hasRobber: BEGINNER_BOARD[index].resource === 'desert',
    }))
  })

  // UI state
  const [mode, setMode] = useState<AppMode>('config')
  const [selectedHex, setSelectedHex] = useState<Hex | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Game state
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [roads, setRoads] = useState<Road[]>([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [numPlayers] = useState(4)

  // Recommendation state
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    PlacementRecommendation | undefined
  >()

  // Calculate recommendations
  const recommendations = useMemo(() => {
    if (mode !== 'placement') return []

    const boardConfig: BoardConfiguration = {
      hexes,
      ports: [], // TODO: Add ports
    }

    const occupiedVertices = settlements.map(s => s.vertex)
    const firstPlacement = settlements.find(s => s.playerId === currentPlayer)?.vertex

    const recs = generateRecommendations(
      boardConfig,
      occupiedVertices,
      firstPlacement,
      5
    )

    return recs.recommendations
  }, [mode, hexes, settlements, currentPlayer])

  const handleHexClick = (hex: Hex) => {
    if (mode !== 'config') return
    setSelectedHex(hex)
    setIsModalOpen(true)
  }

  const handleSaveHex = (resource: ResourceType, number: number | null) => {
    if (!selectedHex) return

    setHexes(prev =>
      prev.map(hex =>
        hex.coordinate.q === selectedHex.coordinate.q &&
        hex.coordinate.r === selectedHex.coordinate.r
          ? {
              ...hex,
              resource,
              number,
              hasRobber: resource === 'desert',
            }
          : hex
      )
    )
  }

  const handleVertexClick = (vertex: VertexCoordinate) => {
    if (mode !== 'placement') return

    // Check if vertex is already occupied
    if (settlements.some(s => JSON.stringify(s.vertex) === JSON.stringify(vertex))) {
      return
    }

    // Place settlement
    setSettlements(prev => [...prev, { vertex, playerId: currentPlayer }])

    // TODO: Prompt for road placement

    // Move to next player (or next round)
    // For now, just increment
    setCurrentPlayer((prev) => (prev + 1) % numPlayers)
  }

  const handleStartPlacement = () => {
    setMode('placement')
  }

  const handleBackToConfig = () => {
    setMode('config')
    setSettlements([])
    setRoads([])
    setCurrentPlayer(0)
  }

  const PLAYER_NAMES = ['Red', 'Blue', 'Green', 'Orange']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Catan Commander
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Initial Placement Assistant
              </p>
            </div>

            {mode === 'placement' && (
              <button
                onClick={handleBackToConfig}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                ← Back to Config
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {mode === 'config' ? (
          // Configuration Mode
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Board Configuration
                </h2>
                <p className="text-sm text-gray-600">
                  Click on any hex to configure its resource and number token
                </p>
              </div>

              <div className="flex justify-center">
                <HexBoard
                  hexes={hexes}
                  onHexClick={handleHexClick}
                  selectedHex={selectedHex}
                />
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleStartPlacement}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                >
                  Start Placement Phase →
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Placement Mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Settlement Placement
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Current Player:</span>
                    <span className="font-semibold text-lg">
                      {PLAYER_NAMES[currentPlayer]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Click on a highlighted vertex to place your settlement
                  </p>
                </div>

                <div className="flex justify-center">
                  <HexBoard
                    hexes={hexes}
                    settlements={settlements}
                    roads={roads}
                    onVertexClick={handleVertexClick}
                    recommendedVertices={recommendations.map(r => r.vertex)}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <RecommendationPanel
                recommendations={recommendations}
                placementNumber={settlements.filter(s => s.playerId === currentPlayer).length === 0 ? 1 : 2}
                onSelectRecommendation={setSelectedRecommendation}
                selectedRec={selectedRecommendation}
              />
            </div>
          </div>
        )}

        <HexConfigModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveHex}
          currentResource={selectedHex?.resource}
          currentNumber={selectedHex?.number}
        />
      </main>
    </div>
  )
}

export default App
