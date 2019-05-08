// @flow
import { expect } from 'chai'

import type { ExponentialParameters, PolynomialParameters } from '../../src/complexities'

import { runPerformanceTestSequence } from '../../src/run-performance-test'
import { expectGuessedComplexity, guessAsymptoticComplexity } from '../../src/guess-complexity'

const cubicAlgorithm = (n) => {
  let result = 0
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      for (let k = 0; k < n; k += 1) {
        result += i + j + k
      }
    }
  }
  return result
}

const expAlgorithm = (n) => {
  if (n === 0) { return 0 }
  for (let i = 0; i < 2; i += 1) {
    expAlgorithm(n - 1)
  }
  return 0
}

const generateTestData = size => ({ actualSize: size, testData: size })

describe('runPerfromanceTest and guessAsymptoticComplexity integration', function () {
  this.timeout(50000)

  it('should return complexity for exponential algorithm', () => {
    const samples = runPerformanceTestSequence(
      expAlgorithm, [9, 10, 11, 12, 13, 14], generateTestData,
    )

    const result = guessAsymptoticComplexity(samples)

    const parameters = expectGuessedComplexity<ExponentialParameters>('exponential', result)
    expect(parameters.base).to.be.closeTo(2, 0.4)
  })

  it('should return complexity for polynomial algorithm', () => {
    const samples = runPerformanceTestSequence(cubicAlgorithm, [10, 20, 50, 100], generateTestData)

    const result = guessAsymptoticComplexity(samples)

    const parameters = expectGuessedComplexity<PolynomialParameters>('polynomial', result)
    expect(parameters.guessedMaximumPower).to.equal(3)
  })
})
