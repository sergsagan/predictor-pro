import { describe, expect, it } from 'vitest'

import { SimpleNumberExplanationEngine } from './SimpleNumberExplanationEngine'

describe('SimpleNumberExplanationEngine', () => {
  it('returns explanation for a number', () => {
    const engine = new SimpleNumberExplanationEngine()

    const explanation = engine.explain({
      value: 17,
      frequency: 142,
      currentGap: 8,
      lastSeen: 8,
      pairScore: 14,
      recommendationScore: 164
    })

    expect(explanation.value).toBe(17)
  })

  it('includes frequency explanation', () => {
    const engine = new SimpleNumberExplanationEngine()

    const explanation = engine.explain({
      value: 17,
      frequency: 142,
      currentGap: 8,
      lastSeen: 8,
      pairScore: 14,
      recommendationScore: 164
    })

    expect(explanation.lines).toContain('Appeared 142 times.')
  })

  it('includes last seen explanation', () => {
    const engine = new SimpleNumberExplanationEngine()

    const explanation = engine.explain({
      value: 17,
      frequency: 142,
      currentGap: 8,
      lastSeen: 8,
      pairScore: 14,
      recommendationScore: 164
    })

    expect(explanation.lines).toContain('Last appeared 8 draws ago.')
  })

  it('includes pair score explanation', () => {
    const engine = new SimpleNumberExplanationEngine()

    const explanation = engine.explain({
      value: 17,
      frequency: 142,
      currentGap: 8,
      lastSeen: 8,
      pairScore: 14,
      recommendationScore: 164
    })

    expect(explanation.lines).toContain('Pair score: 14.')
  })

  it('includes recommendation score explanation', () => {
    const engine = new SimpleNumberExplanationEngine()

    const explanation = engine.explain({
      value: 17,
      frequency: 142,
      currentGap: 8,
      lastSeen: 8,
      pairScore: 14,
      recommendationScore: 164
    })

    expect(explanation.lines).toContain('Recommendation score: 164.')
  })
})
