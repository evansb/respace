
declare var __DEV__: boolean

declare module 'react-hot-loader' {
  import * as React from 'react'
  export const AppContainer: React.ComponentClass<any>
}

interface NodeModule {
  hot: {
    accept(modules: string | string[], callback: Function)
  }
}

declare module 'react-icons/fa/expand'
declare module 'react-icons/fa/cogs'
declare module 'react-icons/fa/info-circle'
declare module 'react-icons/fa/code'
declare module 'react-icons/md/label'
