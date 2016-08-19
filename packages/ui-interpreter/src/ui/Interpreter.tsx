import * as rs from '@respace/common'
import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'
import SnapshotView from './Snapshot'
import Input from './Input'
import Toolbar from './Toolbar'

export type Props = rs.IComponentProps<rs.documents.ISourceCode, Store>

function Interpreter(props: Props) {
  const style = { position: 'relative' }
  const store = props.component.state
  const snapshots = store.snapshots.map((s, idx) =>
    <SnapshotView key={`snapshot-${idx}`} snapshotData={s} store={store} />
  )
  return (
    <div style={style}>
      <Toolbar store={store} />
      {snapshots}
      <Input store={store} />
    </div>
  )
}

export default observer(Interpreter)
