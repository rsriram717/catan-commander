import { useState, useMemo } from 'react'
import HexBoard from '../board/HexBoard'
import HexConfigModal from '../config/HexConfigModal'
import RecommendationPanel from '../recommendations/RecommendationPanel'
import { Hex, ResourceType, Settlement, Road, BoardConfiguration, Port, PortType } from '../../types/board'
import { VertexCoordinate, EdgeCoordinate } from '../../types/coordinates'
import { STANDARD_BOARD_LAYOUT, BEGINNER_BOARD } from '../../utils/constants'
import { generateRecommendations } from '../../engine/recommendations'
import { PlacementRecommendation } from '../../types/recommendations'

type AppMode = 'config' | 'placement'
type ConfigMode = 'hex' | 'port'

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

  // Ports state
  const [ports, setPorts] = useState<Port[]>([])

  // UI state
  const [mode, setMode] = useState<AppMode>('config')
  const [configMode, setConfigMode] = useState<ConfigMode>('hex')
  const [selectedHex, setSelectedHex] = useState<Hex | undefined>()
  const [selectedEdge, setSelectedEdge] = useState<EdgeCoordinate | undefined>()
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
      ports,
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
    setConfigMode('hex')
    setSelectedHex(hex)
    setSelectedEdge(undefined)
    setIsModalOpen(true)
  }

  const handleEdgeClick = (edge: EdgeCoordinate) => {
    if (mode !== 'config') return
    setConfigMode('port')
    setSelectedEdge(edge)
    setSelectedHex(undefined)
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

  const handleSavePort = (portType: PortType, ratio: 2 | 3) => {
    if (!selectedEdge) return

    // Remove existing port on this edge if any
    setPorts(prev =>
      prev.filter(p => JSON.stringify(p.edge) !== JSON.stringify(selectedEdge))
    )

    // Add new port if type is not null
    if (portType) {
      setPorts(prev => [...prev, {
        type: portType,
        edge: selectedEdge,
        ratio
      }])
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-green-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                🎲 Catan Commander
              </h1>
              <p className="mt-1 text-sm text-blue-200">
                Initial Placement Assistant
              </p>
            </div>

            {mode === 'placement' && (
              <button
                onClick={handleBackToConfig}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors shadow-md"
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
            <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Board Configuration
                </h2>
                <p className="text-sm text-gray-800">
                  <strong>Click hexes</strong> to configure resources and numbers. <strong>Click edges</strong> (blue lines between hexes) to add ports.
                </p>
              </div>

              <div className="flex justify-center">
                <HexBoard
                  hexes={hexes}
                  ports={ports}
                  onHexClick={handleHexClick}
                  onEdgeClick={handleEdgeClick}
                  selectedHex={selectedHex}
                />
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleStartPlacement}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
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
              <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Settlement Placement
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-800 font-medium">Current Player:</span>
                    <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-full shadow-md text-lg">
                      {PLAYER_NAMES[currentPlayer]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 mt-3 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                    💡 Click on a highlighted vertex to place your settlement
                  </p>
                </div>

                <div className="flex justify-center">
                  <HexBoard
                    hexes={hexes}
                    ports={ports}
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
          configMode={configMode}
          onSaveHex={handleSaveHex}
          onSavePort={handleSavePort}
          currentResource={selectedHex?.resource}
          currentNumber={selectedHex?.number}
          currentPort={selectedEdge ? ports.find(p => JSON.stringify(p.edge) === JSON.stringify(selectedEdge)) : undefined}
        />
      </main>
    </div>
  )
}

export default App
