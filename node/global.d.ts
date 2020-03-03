declare module 'postcss-js' {
  import { Root } from 'postcss'

  interface PostCssJs {
    objectify: (Root) => object
  }

  const postcssJs: PostCssJs

  export default postcssJs
}
