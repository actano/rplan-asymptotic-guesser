// @flow

import Bluebird from 'bluebird'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import type { Samples } from '../../src/run-performance-test'
import { runPerformanceTestSequenceAsync } from '../../src/run-performance-test'

chai.use(sinonChai)
const { expect } = chai

describe('runPerformanceTestSequenceAsync', function () {
  this.timeout(1200000)

  it('should return an array of samples with increasing runtimes', async () => {
    async function functionUnderTest(n) {
      await Bluebird.delay(n)
    }

    const samples: Samples = await runPerformanceTestSequenceAsync(
      functionUnderTest,
      [1 * 10, 10 * 10],
      async desiredSize => ({
        actualSize: desiredSize + 2,
        testData: desiredSize,
      }),
    )

    expect(samples).to.have.length(2)

    const firstRuntime = samples[0].time

    expect(samples[0].time).to.be.a('number')
    expect(samples[0].time).to.be.above(0)

    expect(samples[0].size).to.be.a('number')
    expect(samples[0].size).to.equal(12)

    expect(samples[1].time).to.be.closeTo(10 * firstRuntime, 0.3 * 10 * firstRuntime)
  })

  it('should pass test data to function under test', async () => {
    const functionUnderTest = sinon.stub().returns(Promise.resolve())
    await runPerformanceTestSequenceAsync(
      functionUnderTest,
      [1, 2, 4],
      async desiredSize => ({
        actualSize: desiredSize,
        testData: desiredSize * 2,
      }),
    )

    expect(functionUnderTest).to.have.been.calledWith(2)
    expect(functionUnderTest).to.have.been.calledWith(4)
    expect(functionUnderTest).to.have.been.calledWith(8)
  })
})
