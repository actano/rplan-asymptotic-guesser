// @flow

import {
  pow,
  range,
  inv,
  multiply,
  transpose,
} from 'mathjs'
import minBy from 'lodash/fp/minBy'

import { squaredDifference } from '../guess-complexity/squared-difference'
import { sumAll } from '../math/sum-all'
import type { Samples } from '../run-performance-test'

import { api as powerLawApi } from './power-law'

import type {
  ComplexityApi,
  ModelFunction,
  ParameterizedModelFunction,
  GuessParametersFromSamples,
} from './complexity-api'

type PolynomialParameters = {
  guessedMaximumPower: number,
  coefficients: number[],
}

const parameterizedModelFunction: ParameterizedModelFunction<PolynomialParameters> = ({
  coefficients,
}) => {
  const modelFunction: ModelFunction = size => sumAll(coefficients,
    (coefficient, i) => coefficient * pow(size, i))
  return modelFunction
}

const createPolynomialMatrixRow = (x, maxPower) =>
  range(0, maxPower, true)
    .map(power => pow(x, power))
    .toArray()

const guessParameterForPower = (maximumPower: number, samples: Samples) => {
  const X = samples.map(({ size }) => createPolynomialMatrixRow(size, maximumPower))
  const y = samples.map(({ time }) => time)

  const Xt = transpose(X)
  const M = multiply(inv(multiply(Xt, X)), Xt)
  const coefficients = multiply(M, y)

  const parameters = {
    coefficients,
    guessedMaximumPower: maximumPower,
  }

  const modelFunction = parameterizedModelFunction(parameters)
  const deviation = squaredDifference(modelFunction, samples)

  return {
    parameters,
    deviation,
  }
}

// source: http://mathworld.wolfram.com/LeastSquaresFittingPolynomial.html
const guessParametersFromSamples: GuessParametersFromSamples<PolynomialParameters> = (samples) => {
  const powerLawParams = powerLawApi.guessParametersFromSamples(samples)
  // Include smaller exponents to ensure that the guessed power is not too big
  const guessedMaximumPower = Math.trunc(powerLawParams.power)
  const potentialPowers = [
    Math.max(0, guessedMaximumPower - 1),
    guessedMaximumPower,
    guessedMaximumPower + 1,
  ]
  const potentialResults = potentialPowers
    .map(power => guessParameterForPower(power, samples))

  const bestResult = minBy(({ deviation }) => deviation, potentialResults)

  return bestResult.parameters
}

// Flow requires the parameter due to the function type (interface `ComplexityApi`)
// eslint-disable-next-line no-unused-vars
const areParametersValid = parameters => true

const api: ComplexityApi<PolynomialParameters> = {
  parameterizedModelFunction,
  guessParametersFromSamples,
  areParametersValid,
}

export type { PolynomialParameters }
export { api }
