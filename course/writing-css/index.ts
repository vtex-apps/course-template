export default {
  tests: [
    {
      description: 'First test of SECOND step',
      failMsg: 'You can also throw custom error messages. This will be the default message sent.',
      test: async({ getFile }: any) => {
        const pdp = await getFile('store/blocks/product.jsonc') 
        return !!pdp
      }
    }
  ]
}
