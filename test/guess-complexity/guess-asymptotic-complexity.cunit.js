// @flow
import { expect } from 'chai'

import type {
  ExponentialParameters,
  PolynomialParameters,
} from '../../src/complexities'
import type { Samples } from '../../src/run-performance-test'

import { expectGuessedComplexity, guessAsymptoticComplexity } from '../../src/guess-complexity'

describe('guessAsymptoticComplexity', () => {
  context('polynomial', () => {
    it('should guess complexity for perfectly polynomial samples', () => {
      // time = 1 * x ^ 2
      const samples: Samples = [
        { size: 1, time: 1 },
        { size: 2, time: 4 },
        { size: 3, time: 9 },
        { size: 5, time: 25 },
      ]

      const result = guessAsymptoticComplexity(samples)

      const parameters = expectGuessedComplexity<PolynomialParameters>('polynomial', result)
      expect(parameters.guessedMaximumPower).to.equal(2)
    })
  })

  context('exponential', () => {
    it('should guess complexity for perfectly exponential samples', () => {
      // time = 2 * (4 ^ size)
      const samples = [
        { size: 1.0, time: 8 },
        { size: 2.0, time: 32 },
        { size: 3.0, time: 128 },
        { size: 4.0, time: 512 },
        { size: 5.0, time: 2048 },
        { size: 6.0, time: 8192 },
        { size: 7.0, time: 32768 },
      ]

      const result = guessAsymptoticComplexity(samples)

      const parameters = expectGuessedComplexity<ExponentialParameters>('exponential', result)
      expect(parameters.factor).to.be.closeTo(2, 0.01)
      expect(parameters.base).to.be.closeTo(4, 0.01)
    })

    it('should guess complexity for almost exponential samples', () => {
      // approximately time = 2 * (4 ^ size)
      const samples = [
        { size: 1.0, time: 8.1 },
        { size: 2.0, time: 32.2 },
        { size: 3.0, time: 120 },
        { size: 4.0, time: 510 },
        { size: 5.0, time: 2060 },
        { size: 6.0, time: 8191.5 },
        { size: 7.0, time: 32768.5 },
      ]

      const result = guessAsymptoticComplexity(samples)

      expectGuessedComplexity<ExponentialParameters>('exponential', result)
    })
  })
})
