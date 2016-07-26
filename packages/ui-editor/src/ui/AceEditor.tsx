import * as React from 'react'
import * as rs from '@respace/common'
import { findDOMNode } from 'react-dom'
import { observer } from 'mobx-react'
import EditorStore from '../store'

require('brace')
require('brace/mode/javascript')
require('brace/theme/tomorrow_night')

export type Props = rs.IComponentProps<rs.documents.ISourceCode, EditorStore>

@observer
export default class AceEditor extends React.Component<Props, void> {
  private _editor: AceAjax.Editor

  componentDidMount() {
    this._editor = ace.edit(findDOMNode(this) as HTMLElement)
    const store = this.props.component.state
    store.setEditor(this._editor)
  }

  componentWillUnmount() {
    this._editor.destroy()
  }

  render(): React.ReactElement<any> {
    const store = this.props.component.state
    const style = {
      position: 'absolute',
      left: '0px',
      overflow: 'scroll',
      top: store.toolbarHeight,
      bottom: store.statusBarHeight,
      width: '100%'
    }
    return <div style={style}></div>
  }
}
