// @flow
import Benchmark from 'benchmark'
import type { Suite } from 'benchmark'

const BenchWithoutBrowserSupport = Benchmark.runInContext({
  // suppress browser support, because cunit-tests run in node
  document: null,
})

type PromisifiedSuite = {
  suite: Suite,
  addAsyncFn: (
    name: string | number,
    fn: (() => Promise<*>),
  ) => void,
  runAsync: () => Promise<Suite>,
}

function createPromisifiedSuite(): PromisifiedSuite {
  const suite = new BenchWithoutBrowserSupport.Suite()

  const promise = new Promise((resolve, reject) => {
    suite.on('complete', () => { resolve() })
    suite.on('error', (err) => { reject(err) })
  })

  const addAsyncFn = (name, fn) => {
    suite.add(
      name,
      (deferred) => {
        fn().then(() => {
          deferred.resolve()
        })
      },
      { defer: true },
    )
  }

  const runAsync = async () => {
    suite.run()
    await promise
    return suite
  }

  return {
    suite,
    addAsyncFn,
    runAsync,
  }
}

export type { PromisifiedSuite }
export {
  BenchWithoutBrowserSupport,
  createPromisifiedSuite,
}
