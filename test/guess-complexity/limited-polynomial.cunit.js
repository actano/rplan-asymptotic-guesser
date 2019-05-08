// @flow
import { expect } from 'chai'

import { api } from '../../src/complexities/polynomial'
import type { PolynomialParameters } from '../../src/complexities/polynomial'
import type { Samples } from '../../src/run-performance-test'

describe('limited polynomial complexity', () => {
  it('should return parameters for quadratic function', () => {
    // y = 1 + 0*x + 3*x^2
    const samples: Samples = [
      { size: 1, time: 4 },
      { size: 2, time: 13 },
      { size: 3, time: 28 },
      { size: 4, time: 49 },
    ]

    const parameters: PolynomialParameters = api.guessParametersFromSamples(samples)

    expect(parameters.guessedMaximumPower).to.equal(2) // should be quadratic
    expect(parameters.coefficients[0]).to.be.closeTo(1, 0.01)
    expect(parameters.coefficients[1]).to.be.closeTo(0, 0.01)
    expect(parameters.coefficients[2]).to.be.closeTo(3, 0.01)
  })
})
