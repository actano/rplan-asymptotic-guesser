// @flow
import _reduce from 'lodash/fp/reduce'

const reduce = _reduce.convert({ cap: false })

function sumAll<T>(values: T[], fn: (T, number) => number) {
  return reduce(
    (sum, value, index) => sum + fn(value, index),
    0,
    values,
  )
}

export { sumAll }
