import * as React from 'react'
import Store from '../store'
import { observer } from 'mobx-react'
import Editor from './Editor'

export interface IConsoleInputProps { store: Store }

function ConsoleInput({ store }: IConsoleInputProps) {
  const editorStyle = {
    overflow: 'auto',
    width: '100%',
    height: '100px'
  }
  const infoStyle = {
    textAlign: 'center',
    color: '#A2A4AA'
  }
  const editorDidMount = (editor: AceAjax.Editor) => {
    editor.commands.addCommand({
      name: 'run',
      bindKey: {
        win: 'Shift-Enter',
        mac: 'Shift-Enter'
      },
      exec: (editor: AceAjax.Editor) => {
        store.addCode(editor.getValue())
        editor.setValue('')
      }
    })
  }
  return (
    <div style={{ position: 'relative' }}>
      <Editor style={editorStyle} store={store} didMount={editorDidMount} />
      <div style={infoStyle}>
        <small>Press Shift+Enter to evaluate</small>
      </div>
    </div>
  )
}

export default observer(ConsoleInput)
