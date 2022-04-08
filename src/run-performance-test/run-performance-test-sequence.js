// @flow

import type { Benchmark } from 'benchmark'

import type {
  GeneratedTestData,
  ProblemSize,
  Sample,
  Samples,
} from './performance-samples'

import { BenchWithoutBrowserSupport, createPromisifiedSuite } from './benchmark'

const benchmarkResultToSample = (result: Benchmark): Sample =>
  ({
    size: Number(result.name),
    time: result.stats.mean,
  })

// This function runs the `functionUnderTest` multiple times for growing problem sizes and
// measures the runtime that the `functionUnderTest` takes to terminate for the given problem.
// `testDataSizes` is an array of the different problem sizes.
// `generateTestData` takes a given problem size and generates test-data (of that size) that is then
// passed-in to the `functionUnderTest`.
function runPerformanceTestSequence<TestData>(
  functionUnderTest: TestData => mixed,
  testDataSizes: ProblemSize[],
  generateTestData: ProblemSize => GeneratedTestData<TestData>,
): Samples {
  const suite = new BenchWithoutBrowserSupport.Suite()

  // eslint-disable-next-line no-unused-vars
  for (const size of testDataSizes) {
    const { testData, actualSize } = generateTestData(size)
    suite.add(actualSize, functionUnderTest.bind(null, testData))
  }

  const results = suite.run()
  const samples: Samples = results.map(benchmarkResultToSample)

  return samples
}

async function runPerformanceTestSequenceAsync<TestData>(
  functionUnderTest: TestData => Promise<mixed>,
  testDataSizes: ProblemSize[],
  generateTestData: ProblemSize => Promise<GeneratedTestData<TestData>>,
): Promise<Samples> {
  const { runAsync, addAsyncFn } = createPromisifiedSuite()

  // eslint-disable-next-line no-unused-vars
  for (const size of testDataSizes) {
    // Run this intentionally in sequence instead of parallel.
    // eslint-disable-next-line no-await-in-loop
    const { testData, actualSize } = await generateTestData(size)
    addAsyncFn(actualSize, functionUnderTest.bind(null, testData))
  }

  const results = await runAsync()
  const samples: Samples = results.map(benchmarkResultToSample)

  return samples
}

export { runPerformanceTestSequence, runPerformanceTestSequenceAsync }
