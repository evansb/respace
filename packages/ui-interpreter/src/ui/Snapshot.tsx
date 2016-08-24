import * as React from 'react'
import Store from '../store'
import SnapshotData from '../snapshot-data'
import SnapshotResult from './SnapshotResult'
import { Editor } from '@respace/helper-ace'

export interface ISnapshotProps {
  snapshotData: SnapshotData<any, any>
  store: Store<any, any>
}

function SnapshotView({ store, snapshotData }: ISnapshotProps) {
  const editorDidMount = (editor) => {
    store.setupEditor(editor)
    editor.getSession().setMode('ace/mode/javascript')
    editor.setValue(snapshotData.snapshot.code)
    editor.setOptions({
      maxLines: 30,
      readOnly: true,
      highlightActiveLine: false,
      highlightGutterLine: false
    })
    editor.renderer.$cursorLayer.element.style.opacity = 0
    editor.clearSelection()
    editor.blur()
  }
  return (
    <div>
      { snapshotData.isCodeShown && <Editor didMount={editorDidMount} /> }
      { snapshotData.isValueShown &&
          <SnapshotResult store={store} snapshotData={snapshotData} /> }
    </div>
  )
}

export default SnapshotView
