// @flow

import { log, exp } from 'mathjs'

import { closeTo } from '../math/close-to'
import type { Samples } from '../run-performance-test'
import type {
  ComplexityApi,
  ModelFunction,
  ParameterizedModelFunction,
  GuessParametersFromSamples,
} from './complexity-api'

import { sumAll } from '../math/sum-all'

type ExponentialParameters = {
  factor: number,
  base: number,
}

const parameterizedModelFunction :
  ParameterizedModelFunction<ExponentialParameters> = ({ factor, base }) => {
    const modelFunction: ModelFunction = x => factor * exp(log(base) * x)
    return modelFunction
  }

const calcA: Samples => number = (samples) => {
  const t1 = sumAll(samples, ({ time }) => log(time))
  const t2 = sumAll(samples, ({ size }) => (size * size))
  const t3 = sumAll(samples, ({ size }) => size)
  const t4 = sumAll(samples, ({ size, time }) => (size * log(time)))
  const n = samples.length

  return ((t1 * t2) - (t3 * t4)) / ((n * t2) - (t3 * t3))
}

const calcB: Samples => number = (samples) => {
  const t1 = sumAll(samples, ({ size, time }) => (size * log(time)))
  const t2 = sumAll(samples, ({ size }) => size)
  const t3 = sumAll(samples, ({ time }) => log(time))
  const t4 = sumAll(samples, ({ size }) => (size * size))
  const n = samples.length

  return ((n * t1) - (t2 * t3)) / ((n * t4) - (t2 * t2))
}

// source: http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
const guessParametersFromSamples
  : GuessParametersFromSamples<ExponentialParameters> = (samples) => {
    const A = calcA(samples)
    const B = calcB(samples)

    const parameters: ExponentialParameters = {
      factor: exp(A),
      base: exp(B),
    }

    return parameters
  }

const areParametersValid = (parameters) => {
  const isAlmostConstantFunction = closeTo(parameters.base, 1.0, 0.1)

  if (isAlmostConstantFunction) {
    return false
  }

  return true
}

const api: ComplexityApi<ExponentialParameters> = {
  parameterizedModelFunction,
  guessParametersFromSamples,
  areParametersValid,
}

export type { ExponentialParameters }
export { api }
