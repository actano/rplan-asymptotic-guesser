// @flow

import flow from 'lodash/fp/flow'
import join from 'lodash/fp/join'
import _map from 'lodash/fp/map'
import childProcess from 'child_process'

import type { GuessResult } from '../guess-complexity/guess-asymptotic-complexity'
import type { Samples } from '../run-performance-test'
import { ComplexityVisualizationApis } from './visualization-api'

const map = _map.convert({ cap: false })

const guessResultToGnuplot = (samples: Samples, result: GuessResult) => {
  const plotData = samples
    .map(({ size, time }) => `${size} ${time}`)
    .join('\n')

  const plotFunctions = flow(
    map(
      (measurement, complexityId) =>
        ComplexityVisualizationApis[complexityId].getPlotFunctionDefinition(measurement.parameters),
    ),
    join('\n'),
  )(result.measurements)

  const plotFunctionNames = flow(
    map(
      (measurement, complexityId) =>
        ComplexityVisualizationApis[complexityId].getPlotFunctionName(),
    ),
    join(', '),
  )(result.measurements)

  const plotFile = `
${plotFunctions}
set offset graph 0.1, graph 0.1, graph 0.1, graph 0.1
plot "-" using 1:2 title "performance samples" with points, ${plotFunctionNames}
${plotData}
end
`
  const { stdout, stderr } = childProcess.spawnSync('gnuplot', ['--persist'], { input: plotFile })

  // This output is for manual debugging
  // $FlowFixMe
  console.log(stdout.toString('utf8'), stderr.toString('utf8')) // eslint-disable-line no-console
}

export { guessResultToGnuplot }
