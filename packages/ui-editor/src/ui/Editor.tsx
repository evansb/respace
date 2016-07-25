import * as React from 'react'
import * as rs from '@respace/common'
import AceEditor from './AceEditor'
import EditorStore from '../store'

export type Props = rs.IComponentProps<rs.documents.ISourceCode, EditorStore>

export default class Editor extends React.Component<Props, void> {
  render() {
    return <div><AceEditor {...this.props} /></div>
  }
}
