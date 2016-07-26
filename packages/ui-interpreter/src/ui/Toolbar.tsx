import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'

function Toolbar({ store }: { store: Store }) {
  const style = {
    position: 'relative',
    paddingLeft: '7px',
    paddingRight: '7px'
  }
  return (
    <div style={style}>
    </div>
  )
}

export default observer(Toolbar)
