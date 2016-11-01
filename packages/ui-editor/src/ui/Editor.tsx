import * as React from 'react'
import { observer } from 'mobx-react'
import * as rs from '@respace/common'
import { Editor as AceEditor } from '@respace/helper-ace'
import EditorStore from '../store'
import Toolbar from './Toolbar'
import StatusBar from './StatusBar'
import RevertDialog from './RevertDialog'

export type Props = rs.IComponentProps<rs.SourceCode, EditorStore>

export default function Editor(props: Props) {
  const store = props.component.store
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
      editor.commands.addCommand({
        name: 'run',
        bindKey: {
          win: 'Ctrl-r',
          mac: 'Cmd-r'
        },
        exec: (editor: AceAjax.Editor) => {
          store.run()
        }
      })
      editor.commands.addCommand({
        name: 'save',
        bindKey: {
          win: 'Ctrl-s',
          mac: 'Cmd-s'
        },
        exec: (editor: AceAjax.Editor) => {
          store.save()
        }
      })
      editor.setOptions({ useWorker: false })
      store.setEditor(editor)
    }
  }
  return (
    <div>
      <Toolbar {...props} />
      { React.createElement(observer(AceEditor), editorProps) }
      <StatusBar {...props} />
      <RevertDialog store={props.component.store} />
    </div>
  )
}
