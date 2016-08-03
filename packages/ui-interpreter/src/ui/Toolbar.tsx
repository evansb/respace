import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'
import { Button } from 'react-bootstrap'

function Toolbar({ store }: { store: Store }) {
  const style = {
    position: 'relative',
    backgroundColor: '#17181A',
    padding: '5px'
  }
  return (
    <div style={style}>
      <Button bsStyle='danger'>Clear</Button>
    </div>
  )
}

export default observer(Toolbar)
