
declare module 'webpack-merge' {
  import { Configuration } from 'webpack'
  function merge(config1: Configuration, config2: Configuration): Configuration
  export = merge  
}

declare module 'extract-text-webpack-plugin'
declare module 'awesome-typescript-loader'
declare module 'html-webpack-plugin'