import * as React from 'react'
import * as rs from '@respace/common'
import AceEditor from './AceEditor'
import EditorStore from '../store'
import Toolbar from './Toolbar'
import StatusBar from './StatusBar'

export type Props = rs.IComponentProps<rs.documents.ISourceCode, EditorStore>

export default function Editor(props: Props) {
  return (
    <div>
      <Toolbar {...props} />
      <AceEditor {...props} />
      <StatusBar {...props} />
    </div>
  )
}
