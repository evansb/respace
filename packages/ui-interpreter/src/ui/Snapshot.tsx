import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'
import SnapshotItem from './SnapshotItem'

function Snapshot({ store }: { store: Store }) {
  const snapshots = store.snapshots.map(sd => {
    return <SnapshotItem snapshotData={sd} />
  })
  return (
    <div>
      { snapshots }
    </div>
  )
}

export default observer(Snapshot)
