// @flow

import { expect } from 'chai'

import type { Samples } from '../../src/run-performance-test'
import { runPerformanceTestSequence } from '../../src/run-performance-test'

function functionUnderTest(n) {
  let sum = 0
  for (let i = 0; i < n; i += 1) {
    sum += i
  }
  return sum
}

describe('runPerformanceTestSequence', function () {
  this.timeout(1200000)

  it('should return an array of samples with increasing runtimes', () => {
    const samples: Samples = runPerformanceTestSequence(
      functionUnderTest,
      [100, 1000 * 100],
      desiredSize => ({
        actualSize: desiredSize + 2,
        testData: desiredSize,
      }),
    )

    expect(samples).to.have.length(2)

    const firstRuntime = samples[0].time

    expect(samples[0].time).to.be.a('number')
    expect(samples[0].time).to.be.above(0)

    expect(samples[0].size).to.be.a('number')
    expect(samples[0].size).to.equal(102)

    expect(samples[1].time).to.be.above(0.5 * 1000 * firstRuntime)
  })
})
