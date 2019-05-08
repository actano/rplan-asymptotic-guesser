// @flow

export type ProblemSize = number

export type RuntimeInSeconds = number

export type Sample = {size: ProblemSize, time: RuntimeInSeconds}

export type Samples = Sample[]

export type GeneratedTestData<TestData> = {
  actualSize: ProblemSize,
  testData: TestData,
}
