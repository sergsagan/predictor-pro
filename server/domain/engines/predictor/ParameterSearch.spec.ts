import { describe, expect, it } from 'vitest'

import { generateParameterConfigurations } from './ParameterSearch'

describe('generateParameterConfigurations', () => {
  it('generates all combinations of parameter values', () => {
    const configurations = generateParameterConfigurations({
      strategy: 'simple',
      frequency: [1, 2],
      currentGap: [1, 2],
      pairScore: [1, 2]
    })

    expect(configurations).toEqual([
      {
        strategy: 'simple',
        weights: {
          frequency: 1,
          currentGap: 1,
          pairScore: 1
        }
      },
      {
        strategy: 'simple',
        weights: {
          frequency: 1,
          currentGap: 1,
          pairScore: 2
        }
      },
      {
        strategy: 'simple',
        weights: {
          frequency: 1,
          currentGap: 2,
          pairScore: 1
        }
      },
      {
        strategy: 'simple',
        weights: {
          frequency: 1,
          currentGap: 2,
          pairScore: 2
        }
      },
      {
        strategy: 'simple',
        weights: {
          frequency: 2,
          currentGap: 1,
          pairScore: 1
        }
      },
      {
        strategy: 'simple',
        weights: {
          frequency: 2,
          currentGap: 1,
          pairScore: 2
        }
      },
      {
        strategy: 'simple',
        weights: {
          frequency: 2,
          currentGap: 2,
          pairScore: 1
        }
      },
      {
        strategy: 'simple',
        weights: {
          frequency: 2,
          currentGap: 2,
          pairScore: 2
        }
      }
    ])
  })
})
