import { DICE_PROBABILITIES } from '../utils/constants'

/**
 * Get probability of rolling a specific number
 */
export function getNumberProbability(number: number): number {
  return DICE_PROBABILITIES[number] || 0
}

/**
 * Calculate expected resources per 36 rolls for a number
 * (36 rolls is one complete cycle of all possible outcomes)
 */
export function getExpectedYield(number: number): number {
  const prob = getNumberProbability(number)
  return prob * 36 // Expected times this number appears in 36 rolls
}

/**
 * Get quality score for a number (0-1)
 * 6 and 8 are best (score 1.0)
 * 2 and 12 are worst (score ~0.08)
 */
export function getNumberQuality(number: number): number {
  const expected = getExpectedYield(number)
  const maxExpected = getExpectedYield(6) // 6 and 8 are the best
  return expected / maxExpected
}

/**
 * Calculate average number quality for an array of numbers
 */
export function getAverageNumberQuality(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((acc, num) => acc + getNumberQuality(num), 0)
  return sum / numbers.length
}
