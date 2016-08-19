import * as React from 'react'
import Store from '../store'
import { autorun } from 'mobx'
import { observer } from 'mobx-react'
import { Editor } from '@respace/helper-ace'
import { Button, ButtonGroup, FormControl } from 'react-bootstrap'
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
    color: '#A2A4AA',
    marginLeft: '10px'
  }
  const editorDidMount = (editor: AceAjax.Editor) => {
    const oldValue = store.inputEditorValue
    if (oldValue) {
      editor.setValue(oldValue)
    }
    store.inputEditor = editor
    store.setupEditor(editor)
    autorun(() => {
      editor.commands.addCommand({
        name: 'run',
        bindKey: {
          win: store.executeShortcut,
          mac: store.executeShortcut
        },
        exec: (editor: AceAjax.Editor) => {
          store.addCodeFromInput()
          editor.setValue('')
        }
      })
    })
  }
  const editorWillUnmount = (editor: AceAjax.Editor) => {
    store.inputEditorValue = editor.getValue()
  }
  let editor = <Editor style={editorStyle}
                      willUnmount={editorWillUnmount}
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

  const shortcutSelectStyle = {
    display: 'inline',
    width: 'auto',
    padding: '0',
    fontSize: '1em',
    border: 'none',
    borderRadius: '0',
    height: 'auto',
    marginLeft: '5px',
    marginRight: '5px',
    backgroundColor: 'black',
    color: 'white'
  }
  const shortcutSelect = (
    <FormControl componentClass='select' placeholder={store.executeShortcut}
        style={shortcutSelectStyle}
        onChange={(e) => store.executeShortcut = e.target.value}>
      {
        store.availableShortcuts.map((s, idx) => {
          return <option key={idx} value={s}>{s}</option>
        })
      }
    </FormControl>
  )

  return (
    <div style={{ position: 'relative' }}>
      { editor }
      <div style={infoStyle}>
        <small>
          Press {shortcutSelect} to evaluate.&nbsp;&nbsp;
          Limit {store.timeout}ms/{store.stackSize}&nbsp;&nbsp;
        </small>
      </div>
    </div>
  )
}

export default observer(ConsoleInput)
