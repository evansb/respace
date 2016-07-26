import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'

function Console({ store }: { store: Store }) {
  const style = {
    paddingLeft: '7px',
    paddingRight: '7px'
  }
  return (
    <div style={style}>
      Console
    </div>
  )
}

export default observer(Console)
