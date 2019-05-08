// @flow

import type { PolynomialParameters } from '../complexities'
import type { ComplexityVisualizationApi } from './visualization-api'

const api: ComplexityVisualizationApi<PolynomialParameters> = {
  getPlotFunctionDefinition: ({ coefficients }) => {
    const polynom = coefficients
      .map((coefficient, power) => `${coefficient}*exp(log(x)*${power})`)
      .join(' + ')
    return `polynomial(x)=${polynom}`
  },
  getPlotFunctionName: () => 'polynomial(x)',
}

export { api }
