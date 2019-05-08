// @flow

import Bluebird from 'bluebird'
import { expect } from 'chai'

import type { RuntimeInSeconds } from '../../src/run-performance-test'
import { runPerformanceTestAsync } from '../../src/run-performance-test'

async function functionUnderTest(n) {
  await Bluebird.delay(n)
}

describe('runPerformanceTestAsync', function () {
  this.timeout(60000)

  it('should return a runtime', async () => {
    const runtime: RuntimeInSeconds = await runPerformanceTestAsync(() => functionUnderTest(100))

    expect(runtime).to.be.a('number')
    expect(runtime).to.be.above(0)
    expect(runtime).to.be.below(1)
  })

  it('should return increasing runtime if "function under test" takes longer', async () => {
    const firstRuntime: RuntimeInSeconds = await runPerformanceTestAsync(() =>
      functionUnderTest(1 * 10),
    )
    const secondRuntime: RuntimeInSeconds = await runPerformanceTestAsync(() =>
      functionUnderTest(10 * 10),
    )

    const expectedRuntime = 10 * firstRuntime
    const epsilon = expectedRuntime * 0.3
    expect(secondRuntime).to.be.above(firstRuntime)
    expect(secondRuntime).to.be.closeTo(expectedRuntime, epsilon)
  })
})
