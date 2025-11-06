import { VertexCoordinate, EdgeCoordinate } from './coordinates'
import { ResourceType, PortType } from './board'

export interface ResourceYield {
  wood: number
  brick: number
  sheep: number
  wheat: number
  ore: number
}

export interface SettlementScoreBreakdown {
  expectedYield: number // Total expected resources per 36 rolls
  resourceDiversity: number // 0-1 score based on # of different resources
  numberQuality: number // 0-1 score based on number probabilities
  portAccess: number // 0-1 score for port proximity/access
  expansionPotential: number // 0-1 score for future settlement opportunities
}

export interface PlacementRecommendation {
  vertex: VertexCoordinate
  score: number // 0-100 weighted total score
  breakdown: SettlementScoreBreakdown
  resourceYield: ResourceYield // Expected resources per 36 rolls
  adjacentResources: ResourceType[] // Unique resources this settlement touches
  adjacentNumbers: number[] // Number tokens on adjacent hexes
  portAccess: PortType | null
  recommendedRoads: EdgeCoordinate[] // Best road placements from this settlement
}

export interface RecommendationSet {
  recommendations: PlacementRecommendation[]
  placementNumber: 1 | 2 // First or second settlement
  consideringPlacements: VertexCoordinate[] // Already placed settlements to avoid
}
