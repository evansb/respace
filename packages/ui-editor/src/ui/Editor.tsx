import * as React from 'react'
import { observer } from 'mobx-react'
import * as rs from '@respace/common'
import { Editor as AceEditor } from '@respace/helper-ace'
import EditorStore from '../store'
import Toolbar from './Toolbar'
import StatusBar from './StatusBar'
import RevertDialog from './RevertDialog'
import SubmitDialog from './SubmitDialog'

export type Props = rs.IComponentProps<rs.documents.ISourceCode, EditorStore>

export default function Editor(props: Props) {
  const store = props.component.state
  const editorProps = {
    style: {
      position: 'absolute',
      left: '0px',
      right: '0px',
      overflow: 'auto',
      top: store.toolbarHeight,
      bottom: store.statusBarHeight,
    },
    didMount(editor: AceAjax.Editor) {
      editor.setOptions({ useWorker: false })
      store.setEditor(editor)
    }
  }
  return (
    <div>
      <Toolbar {...props} />
      { React.createElement(observer(AceEditor), editorProps) }
      <StatusBar {...props} />
      <RevertDialog store={props.component.state} />
      <SubmitDialog store={props.component.state} />
    </div>
  )
}
