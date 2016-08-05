import * as React from 'react'
import { findDOMNode } from 'react-dom'
import Store from '../store'
import 'brace'

export interface IEditorProps {
  style?: any
  store: Store
  didMount?: (editor: AceAjax.Editor) => any
}

export default class Editor extends React.Component<IEditorProps, void> {
  private _editor: AceAjax.Editor

  componentDidMount() {
    this._editor = ace.edit(findDOMNode(this) as HTMLElement)
    this.props.store.setupEditor(this._editor)
    if (typeof this.props.didMount === 'function') {
      this.props.didMount(this._editor)
    }
  }

  componentWillUnmount() {
    this.props.store.inputEditorValue = this._editor.getValue()
    this._editor.destroy()
  }

  render() {
    return <div style={this.props.style}></div>
  }
}
