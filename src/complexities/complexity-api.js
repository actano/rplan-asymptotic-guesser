// @flow

import type { ProblemSize, RuntimeInSeconds, Samples } from '../run-performance-test'

// A model function is supposed to predict the runtime an algorithm takes for a given problem size.
// For instance a specific exponential function is such a model function:
// e.g. f(x) = 4 * 5^x
export type ModelFunction = ProblemSize => RuntimeInSeconds

// A parameterized model function is a function that takes several parameters
// and returns a specific model function. For instance a generic exponential function
// that takes a factor and a base as parameters is such a function:
// e.g. f_a_b(X) = a * b^x
export type ParameterizedModelFunction<ModelFunctionParameters> =
  ModelFunctionParameters => ModelFunction

// This function takes a list of measured runtimes of an algorithm for different problem sizes
// and returns a specific model function. The returned function is supposed to produce results
// as close as possible to the given samples. Therefore the function is supposed to describe the
// runtime of the measured algorithm.
export type GuessParametersFromSamples<ModelFunctionParameters> =
  Samples => ModelFunctionParameters

// This function takes specific parameters of a parameterized model function and
// returns a boolean indicating if these parameters are valid for this type of model function.
// For instance an exponential function is not actually exponential if the base is `1`.
// In this case the exponential function becomes a constant function.
// For such situations this function should return `false`.
export type ParameterValidator<ModelFunctionParameters> =
  ModelFunctionParameters => boolean

// This interface describes the API of a specific "asymptotic complexity guesser".
// The api is used to convert a list of given measured runtimes to a specific model function
// that predicts the asymptotic behavior of the measured algorithm.
// For instance there is an exponential and a polynomial guesser API.
export interface ComplexityApi<ModelFunctionParameters> {
  parameterizedModelFunction: ParameterizedModelFunction<ModelFunctionParameters>,
  guessParametersFromSamples: GuessParametersFromSamples<ModelFunctionParameters>,
  areParametersValid: ParameterValidator<ModelFunctionParameters>,
}
