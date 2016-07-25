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
  componentDidMount() {
    const store = this.props.getComponent().state
    const editor = ace.edit(findDOMNode(this) as HTMLElement)
    editor.$blockScrolling = 100
    store.setEditor(editor)
  }
  render(): React.ReactElement<any> {
    const style = {
      width: '640px',
      height: '400px'
    }
    return <div style={style}></div>
  }
}
