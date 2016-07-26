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
    const editor = ace.edit(findDOMNode(this) as HTMLElement)
    const store = this.props.component.state
    editor.$blockScrolling = 100
    store.setEditor(editor)
  }

  render(): React.ReactElement<any> {
    const store = this.props.component.state
    const style = {
      position: 'absolute',
      left: '0px',
      top: store.toolbarHeight,
      bottom: store.statusBarHeight,
      width: '650px',
      maxHeight: '1000px'
    }
    return <div style={style}></div>
  }
}
