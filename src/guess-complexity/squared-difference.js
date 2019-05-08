// @flow

import type { ModelFunction } from '../complexities/complexity-api'
import type { Samples } from '../run-performance-test/performance-samples'

const squaredDifference = (
  modelFunction: ModelFunction,
  samples: Samples,
): number =>
  samples
    .map(({ size, time }) => {
      const diff = time - modelFunction(size)
      return diff * diff
    })
    .reduce((sum, value) => sum + value, 0)

export { squaredDifference }
