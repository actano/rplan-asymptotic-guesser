// @flow

import minBy from 'lodash/fp/minBy'
import mapValues from 'lodash/fp/mapValues'

import type { ComplexityApi, ComplexityId } from '../complexities'
import type { Samples } from '../run-performance-test/performance-samples'

import { ComplexityApis } from '../complexities'
import { squaredDifference } from './squared-difference'

type MeasurementResult<ModelFunctionParameters> = {
  parameters: ModelFunctionParameters,
  deviation: number,
  areParametersValid: boolean,
}

type MeasurementResults = {
  [ComplexityId]: MeasurementResult<*>,
}

type GuessResult = {
  guessedComplexityId: ComplexityId,
  measurements: MeasurementResults,
}

function guessParametersFromSamples<ModelFunctionParameters>(
  api: ComplexityApi<ModelFunctionParameters>,
  samples,
): MeasurementResult<ModelFunctionParameters> {
  const parameters = api.guessParametersFromSamples(samples)
  const modelFunction = api.parameterizedModelFunction(parameters)
  const deviation = squaredDifference(modelFunction, samples)
  const areParametersValid = api.areParametersValid(parameters)

  return {
    parameters,
    deviation,
    areParametersValid,
  }
}

// This function takes a set of measured runtimes (for different problem sizes) of an algorithm.
// Guesses the asymptotic runtime complexity of that algorithm (e.g. exponential).
// The result contains the `complexityId` of the guessed runtime complexity as well as the
// guessed parameters for the corresponding parameterized model function (e.g. the guessed
// `factor` and `base` of an exponential function).
// The result also contains the guessed parameters of all other known runtime complexities,
// that were less accurately predicting the given set of samples.
function guessAsymptoticComplexity(samples: Samples): GuessResult {
  const measurements: MeasurementResults = mapValues(
    api => guessParametersFromSamples(api, samples),
    ComplexityApis,
  )

  const validComplexityIds = Object.keys(measurements)
    .filter(complexityId => measurements[complexityId].areParametersValid)

  const guessedComplexityId: ComplexityId = minBy(
    complexityId => measurements[complexityId].deviation,
    validComplexityIds,
  )

  return {
    guessedComplexityId,
    measurements,
  }
}

export type {
  MeasurementResult,
  MeasurementResults,
  GuessResult,
}
export { guessAsymptoticComplexity }
