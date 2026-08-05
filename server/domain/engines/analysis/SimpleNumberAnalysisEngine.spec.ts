import { describe, expect, it } from 'vitest'

import { SimpleNumberAnalysisEngine } from './SimpleNumberAnalysisEngine'
import { createPairKey } from '../statistics/calculators/pairFrequency/createPairKey'

describe('SimpleNumberAnalysisEngine', () => {
  it('returns analysis for a number', () => {
    const engine = new SimpleNumberAnalysisEngine()

    const analysis = engine.analyze(17, [], {
      frequency: new Map([[17, 142]]),
      currentGap: new Map([[17, 8]]),
      lastSeen: new Map([[17, 8]]),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(analysis.value).toBe(17)
  })

  it('includes frequency', () => {
    const engine = new SimpleNumberAnalysisEngine()

    const analysis = engine.analyze(17, [], {
      frequency: new Map([[17, 142]]),
      currentGap: new Map(),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(analysis.frequency).toBe(142)
  })

  it('includes current gap', () => {
    const engine = new SimpleNumberAnalysisEngine()

    const analysis = engine.analyze(17, [], {
      frequency: new Map(),
      currentGap: new Map([[17, 8]]),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(analysis.currentGap).toBe(8)
  })

  it('includes last seen', () => {
    const engine = new SimpleNumberAnalysisEngine()

    const analysis = engine.analyze(17, [], {
      frequency: new Map(),
      currentGap: new Map(),
      lastSeen: new Map([[17, 5]]),
      gap: new Map(),
      pairFrequency: new Map()
    })

    expect(analysis.lastSeen).toBe(5)
  })

  it('calculates pair score from selected numbers', () => {
    const engine = new SimpleNumberAnalysisEngine()

    const analysis = engine.analyze(17, [22, 37], {
      frequency: new Map(),
      currentGap: new Map(),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map([
        [createPairKey(17, 22), 10],
        [createPairKey(17, 37), 5]
      ])
    })

    expect(analysis.pairScore).toBe(15)
  })

  it('calculates recommendation score', () => {
    const engine = new SimpleNumberAnalysisEngine()

    const analysis = engine.analyze(17, [22], {
      frequency: new Map([[17, 100]]),
      currentGap: new Map([[17, 20]]),
      lastSeen: new Map(),
      gap: new Map(),
      pairFrequency: new Map([[createPairKey(17, 22), 10]])
    })

    expect(analysis.recommendationScore).toBe(130)
  })
})
