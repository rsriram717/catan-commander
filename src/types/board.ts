import { HexCoordinate, VertexCoordinate, EdgeCoordinate } from './coordinates'

export type ResourceType = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore' | 'desert'

export type PortType = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore' | 'generic' | null

export interface Hex {
  coordinate: HexCoordinate
  resource: ResourceType | null
  number: number | null // 2-12, null for desert
  hasRobber: boolean
}

export interface Port {
  type: PortType
  // Edges where the port is located
  edge: EdgeCoordinate
  ratio: 2 | 3 // 2:1 for specific resources, 3:1 for generic
}

export interface BoardConfiguration {
  hexes: Hex[]
  ports: Port[]
}

export interface Settlement {
  vertex: VertexCoordinate
  playerId: number
}

export interface Road {
  edge: EdgeCoordinate
  playerId: number
}

export interface GameState {
  board: BoardConfiguration
  settlements: Settlement[]
  roads: Road[]
  currentPlayer: number
  numPlayers: number
  phase: 'config' | 'first-placement' | 'second-placement' | 'complete'
}
