// @flow

import type { ComplexityApi } from './complexity-api'
import { api as exponentialApi } from './exponential'
import { api as polynomialApi } from './polynomial'

const ComplexityApis: { [string]: ComplexityApi<any> } = {
  exponential: exponentialApi,
  polynomial: polynomialApi,
}

type ComplexityId = $Keys<typeof ComplexityApis>

// map of all complexity ids for non-flow javascript
const COMPLEXITY_IDS : { [string]: ComplexityId } = {
  EXPONENTIAL: 'exponential',
  POLYNOMIAL: 'polynomial',
}

export type { ComplexityApi } from './complexity-api'
export type { ExponentialParameters } from './exponential'
export type { PolynomialParameters } from './polynomial'
export type { ComplexityId }
export { ComplexityApis, COMPLEXITY_IDS }
