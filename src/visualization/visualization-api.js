// @flow

import type { ComplexityId } from '../complexities'
import type { ComplexityVisualizationApi } from './type'

import { api as exponentialApi } from './exponential'
import { api as polynomialApi } from './polynomial'

const ComplexityVisualizationApis: { [ComplexityId]: ComplexityVisualizationApi<any> } = {
  exponential: exponentialApi,
  polynomial: polynomialApi,
}

export { ComplexityVisualizationApis }
