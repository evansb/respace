
declare module 'uuid' {
  namespace _uuid {
    export function v4(): string
  }
  export = _uuid
}

declare module 'react-icons/*' {
  import React from 'react'
  const reactClass: React.ComponentClass<void>
  export default reactClass
}
