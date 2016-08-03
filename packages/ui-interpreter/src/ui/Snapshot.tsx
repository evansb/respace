import * as React from 'react'
import Store, { ISnapshotData } from '../store'
import { Snapshot } from 'the-source'
import SnapshotResult from './SnapshotResult'
import Editor from './Editor'

export interface ISnapshotProps {
  snapshot: Snapshot
  store: Store
}

function ChildSnapshot({ store, snapshot }: ISnapshotProps) {
  const editorStyle = { width: '100%' }
  const editorDidMount = (editor) => {
    editor.setValue(snapshot.code)
    editor.setOptions({ maxLines: 30, dragEnabled: false })
    editor.setReadOnly(true)
  }
  return (
    <div>
      <Editor store={store} didMount={editorDidMount} />
      <div style={editorStyle} ref='editor'></div>
      <SnapshotResult {...this.props} />
    </div>
  )
}

function SnapshotView(props: { store: Store, snapshotData: ISnapshotData }) {
  const snapshot = props.snapshotData.snapshot
  if (snapshot && !snapshot.parent) {
    return <SnapshotResult snapshot={snapshot} store={props.store} />
  } else {
    return <ChildSnapshot snapshot={snapshot} store={props.store} />
  }
}

export default SnapshotView
