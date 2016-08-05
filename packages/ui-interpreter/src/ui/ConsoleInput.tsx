import * as React from 'react'
import Store from '../store'
import { observer } from 'mobx-react'
import Editor from './Editor'
import { Button, ButtonGroup } from 'react-bootstrap'
const RunIcon = require('react-icons/fa/play').default

export interface IConsoleInputProps { store: Store }

function ConsoleInput({ store }: IConsoleInputProps) {
  const editorStyle = {
    paddingTop: '4px',
    paddingBottom: '4px',
    width: '100%',
    height: '100px'
  }
  const infoStyle = {
    textAlign: 'center',
    color: '#A2A4AA'
  }
  const editorDidMount = (editor: AceAjax.Editor) => {
    const oldValue = store.inputEditorValue
    if (oldValue) {
      editor.setValue(oldValue)
    }
    store.inputEditor = editor
    editor.commands.addCommand({
      name: 'run',
      bindKey: {
        win: 'Shift-Enter',
        mac: 'Shift-Enter'
      },
      exec: (editor: AceAjax.Editor) => {
        store.addCodeFromInput()
        editor.setValue('')
      }
    })
  }
  let editor = <Editor style={editorStyle} store={store}
    didMount={editorDidMount} />
  if (store.isControlsEnabled) {
    editor = (
      <div className='clearfix'>
        <div style={{position: 'absolute', left: '0px', top: '0px'}}>
          <ButtonGroup vertical>
            <Button bsStyle='success'
                    onClick={() => store.addCodeFromInput()}>
              <RunIcon />
            </Button>
          </ButtonGroup>
        </div>
        <div style={{float: 'left', width: '100%',
            paddingLeft: '30px'}}>{editor}</div>
      </div>
    )
  }
  return (
    <div style={{ position: 'relative' }}>
      { editor }
      <div style={infoStyle}>
        <small>Press Shift+Enter to evaluate</small>
      </div>
    </div>
  )
}

export default observer(ConsoleInput)
