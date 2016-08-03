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
  return (
    <div style={{ position: 'relative', marginTop: '10px' }}>
      <Editor style={editorStyle} store={store} />
      <div style={infoStyle}>
        <small>Press Shift+Enter to evaluate</small>
      </div>
    </div>
  )
}

export default observer(ConsoleInput)
