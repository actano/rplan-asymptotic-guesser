// @flow

import type { ExponentialParameters } from '../complexities'
import type { ComplexityVisualizationApi } from './visualization-api'

const api: ComplexityVisualizationApi<ExponentialParameters> = {
  getPlotFunctionDefinition: ({ factor, base }) => `exponential(x)=${factor} * exp(log(${base}) * x)\`,`,
  getPlotFunctionName: () => 'exponential(x)',
}

export { api }
