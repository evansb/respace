import * as React from 'react'
import { findDOMNode } from 'react-dom'
import 'brace'

export interface IEditorProps {
  style?: any
  didMount?: (editor: AceAjax.Editor) => any
  willUnmount?: (editor: AceAjax.Editor) => any
}

export class Editor extends React.Component<IEditorProps, void> {
  private _editor: AceAjax.Editor

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    this._editor = ace.edit(findDOMNode(this) as HTMLElement)
    this._editor.setOptions({ useWorker: false })
    if (typeof this.props.didMount === 'function') {
      this.props.didMount(this._editor)
    }
  }

  componentWillUnmount() {
    if (typeof this.props.willUnmount === 'function') {
      this.props.willUnmount(this._editor)
    }
    this._editor.destroy()
  }

  render() {
    const style = this.props.style || {}
    return <div style={style}></div>
  }
}
