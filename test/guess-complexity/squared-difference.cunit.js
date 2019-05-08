// @flow
import { expect } from 'chai'

import type { ModelFunction } from '../../src/complexities/complexity-api'
import type { Samples } from '../../src/run-performance-test'

import { squaredDifference } from '../../src/guess-complexity/squared-difference'

describe('squaredDifference', () => {
  it('should return zero for exact solution', () => {
    const samples: Samples = [
      { size: 1, time: 15 },
      { size: 2, time: 29 },
      { size: 5, time: 107 },
      { size: -3, time: 19 },
    ]
    const modelFunction: ModelFunction = size => (3 * size * size) + (5 * size) + 7

    const sd = squaredDifference(modelFunction, samples)

    expect(sd).to.be.closeTo(0, 0.01)
  })

  it('should return square difference between sample and model value', () => {
    const samples: Samples = [
      { size: 3, time: 37 },
    ]
    const modelFunction: ModelFunction = size => (size * size) + size + 1

    const sd = squaredDifference(modelFunction, samples)

    expect(sd).to.be.closeTo(576, 0.01)
  })
})
