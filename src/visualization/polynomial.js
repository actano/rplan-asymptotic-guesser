// @flow

import type { PolynomialParameters } from '../complexities'
import type { ComplexityVisualizationApi } from './type'

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
