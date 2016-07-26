import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'
import Toolbar from './Toolbar'

function Console({ store }: { store: Store }) {
  const style = {
    position: 'relative',
    paddingLeft: '7px',
    paddingRight: '7px'
  }
  return (
    <div style={style}>
      <Toolbar />
    </div>
  )
}

export default observer(Console)
