// @flow
import { expect } from 'chai'

import type { ComplexityId } from '../complexities'
import type { GuessResult, MeasurementResult } from './guess-asymptotic-complexity'

// This function can be used to write expecations in performance unit tests.
// The `result` parameter is the result of the `guessAsymptoticComplexity` function.
// The parameter `complexityId` is the expected runtime complexity.
// If the given `result` doesn't match the expected complexity an assertion error will be thrown.
// If the given `result` matches the expected complexity,
// then the guessed parameters for this complexity are returned (e.g. the `factor` and `base` of
// an exponential runtime complexity). These parameters can be used to make further assertions, such
// as expecting a specific `base` of an exponential function.
function expectGuessedComplexity<ExpectedModelFunctionParameters>(
  expectedComplexityId: ComplexityId,
  result: GuessResult,
): ExpectedModelFunctionParameters {
  expect(result.guessedComplexityId, `Measurements: ${JSON.stringify(result.measurements)}`)
    .to.equal(expectedComplexityId)

  // eslint-disable-next-line max-len
  const measurement: MeasurementResult<ExpectedModelFunctionParameters> = (result.measurements[expectedComplexityId]: any)

  return measurement.parameters
}

export { expectGuessedComplexity }
