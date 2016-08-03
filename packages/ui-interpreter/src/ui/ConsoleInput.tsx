import * as React from 'react'
import Store from '../store'
import { findDOMNode } from 'react-dom'
import { observer } from 'mobx-react'

require('brace')
require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

export interface IConsoleInputProps {
  store: Store
}

@observer
export default class ConsoleInput
extends React.Component<IConsoleInputProps, void> {
  refs: { [index: string]: any, editor: any }
  private _editor: AceAjax.Editor

  componentDidMount() {
    this._editor = ace.edit(findDOMNode(this.refs.editor) as HTMLElement)
    this.props.store.setEditor(this._editor)
  }

  componentWillUnmount() {
    this._editor.destroy()
  }

  render(): React.ReactElement<any> {
    const { height } = this.props.store.consoleInput
    const editorStyle = {
      overflow: 'auto',
      width: '100%',
      height,
      borderLeft: 'solid 5px #17181A'
    }
    const infoStyle = {
      color: '#A2A4AA'
    }
    return (
      <div style={{ position: 'relative' }}>
        <div ref='editor' style={editorStyle} />
        <div style={infoStyle}>
          <small>Press Shift+Enter to evaluate</small>
        </div>
      </div>
    )
  }
}
