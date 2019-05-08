// @flow

import { expect } from 'chai'

import type { RuntimeInSeconds } from '../../src/run-performance-test'
import { runPerformanceTest } from '../../src/run-performance-test'

function functionUnderTest(n) {
  let sum = 0
  for (let i = 0; i < n; i += 1) {
    sum += i
  }
  return sum
}

describe('runPerformanceTest', function () {
  this.timeout(60000)

  it('should return a runtime', () => {
    const runtime: RuntimeInSeconds = runPerformanceTest(() => functionUnderTest(100))
    expect(runtime).to.be.a('number')
    expect(runtime).to.be.above(0)
    expect(runtime).to.be.below(1)
  })

  it('should return increasing runtime if "function under test" takes longer', () => {
    const firstRuntime: RuntimeInSeconds = runPerformanceTest(() => functionUnderTest(1 * 1000000))
    const secondRuntime: RuntimeInSeconds = runPerformanceTest(() =>
      functionUnderTest(100 * 1000000),
    )

    const expectedRuntime = 100 * firstRuntime
    const epsilon = expectedRuntime * 0.4
    expect(secondRuntime).to.be.above(firstRuntime)
    expect(secondRuntime).to.be.closeTo(expectedRuntime, epsilon)
  })
})
