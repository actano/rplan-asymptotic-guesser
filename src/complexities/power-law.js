// @flow

import { pow, log, exp } from 'mathjs'

import type {
  ComplexityApi,
  ModelFunction,
  ParameterizedModelFunction,
  GuessParametersFromSamples,
} from './complexity-api'

import { sumAll } from '../math/sum-all'

type PowerLawParameters = {
  factor: number,
  power: number,
}

const parameterizedModelFunction: ParameterizedModelFunction<PowerLawParameters> = ({
  factor,
  power,
}) => {
  const modelFunction: ModelFunction = size => factor * pow(size, power)
  return modelFunction
}

// source: http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html
const guessParametersFromSamples: GuessParametersFromSamples<PowerLawParameters> = (samples) => {
  const t1 = sumAll(samples, ({ size, time }) => log(size) * log(time))
  const t2 = sumAll(samples, ({ size }) => log(size))
  const t3 = sumAll(samples, ({ time }) => log(time))
  const t4 = sumAll(samples, ({ size }) => log(size) * log(size))
  const n = samples.length

  const B = ((n * t1) - (t2 * t3)) / ((n * t4) - (t2 * t2))
  const A = (t3 - (B * t2)) / n

  const parameters: PowerLawParameters = {
    factor: exp(A),
    power: B,
  }

  return parameters
}

// Flow requires the parameter due to the function type (interface `ComplexityApi`)
// eslint-disable-next-line no-unused-vars
const areParametersValid = parameters => true

const api: ComplexityApi<PowerLawParameters> = {
  parameterizedModelFunction,
  guessParametersFromSamples,
  areParametersValid,
}

export type { PowerLawParameters }
export { api }
