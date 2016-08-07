import * as React from 'react'
import Store from '../store'
import Snapshot from './Snapshot'
import { observer } from 'mobx-react'
import ConsoleInput from './ConsoleInput'
import Toolbar from './Toolbar'

function Console({ store }: { store: Store }) {
  const style = { position: 'relative' }
  const snapshots = store.snapshots.map((s, idx) =>
    <Snapshot key={`snapshot-${idx}`} snapshotData={s} store={store} />
  )
  return (
    <div style={style}>
      <Toolbar store={store} />
      {snapshots}
      <ConsoleInput store={store} />
    </div>
  )
}

export default observer(Console)
