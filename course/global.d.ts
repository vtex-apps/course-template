import * as ramda from 'ramda'

export {} 

declare global {
  interface TestContext {
    getFile: (path: string) => Promise<string>
    parseCss: (content: string) => object
    parseJsonc: (content: string) => object
    ramda: typeof ramda
    [key: string]: any
  }

  interface TestFunctionParameters {
    ctx: TestContext
  }

  interface TestCase {
    tests: {
      description: string
      failMsg: string
      test: (param: TestFunctionParameters) => Promise<boolean> | boolean
    }[]
  }
}
