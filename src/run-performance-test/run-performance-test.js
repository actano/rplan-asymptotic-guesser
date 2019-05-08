// @flow

import type { RuntimeInSeconds } from './performance-samples'

import { BenchWithoutBrowserSupport, createPromisifiedSuite } from './benchmark'

function runPerformanceTest(functionUnderTest: () => mixed): RuntimeInSeconds {
  const benchmark = new BenchWithoutBrowserSupport({ fn: functionUnderTest })

  const benchmarkResult = benchmark.run()
  const averageRuntime = benchmarkResult.stats.mean

  return averageRuntime
}

async function runPerformanceTestAsync(
  functionUnderTest: () => Promise<mixed>,
): Promise<RuntimeInSeconds> {
  const { addAsyncFn, runAsync } = createPromisifiedSuite()

  addAsyncFn('test', functionUnderTest)

  const results = await runAsync()
  const averageRuntime = results[0].stats.mean

  return averageRuntime
}

export {
  runPerformanceTest,
  runPerformanceTestAsync,
}
