// @flow

export interface ComplexityVisualizationApi<ModelFunctionParameters> {
  getPlotFunctionDefinition: ModelFunctionParameters => string,
  getPlotFunctionName: () => string,
}
