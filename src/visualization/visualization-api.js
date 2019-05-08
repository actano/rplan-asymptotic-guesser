// @flow

import type { ComplexityId } from '../complexities'

import { api as exponentialApi } from './exponential'
import { api as polynomialApi } from './polynomial'

interface ComplexityVisualizationApi<ModelFunctionParameters> {
  getPlotFunctionDefinition: ModelFunctionParameters => string,
  getPlotFunctionName: () => string,
}

const ComplexityVisualizationApis: { [ComplexityId]: ComplexityVisualizationApi<any> } = {
  exponential: exponentialApi,
  polynomial: polynomialApi,
}

export { ComplexityVisualizationApis }
