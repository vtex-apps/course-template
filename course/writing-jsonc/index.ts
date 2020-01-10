export default {
  tests: [
    {
      description: 'First test of this step',
      failMsg: 'You can also throw custom error messages. This will be the default message sent.',
      test: async({ files, getFile, lib }) => {
        const pdp = await getFile('store/blocks/product.jsonc') 
        return !!pdp
      }
    }
  ]
}
