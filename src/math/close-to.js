// @flow

import { abs } from 'mathjs'

const closeTo = (a: number, b: number, eps: number): boolean =>
  abs(a - b) < eps

export { closeTo }
