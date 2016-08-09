import * as React from 'react'
import * as rs from '@respace/common'
import marked from 'marked'

const icon: React.ComponentClass<void> =
  require('react-icons/fa/map').default

type Props = rs.IComponentProps<rs.documents.ISourceCode, void>

function MissionView({ component }: Props) {
  const document = component.document
  const html = {
    __html: marked(document.volatile.description)
  }
  const style = {
    padding: '10px'
  }
  return <div style={style} dangerouslySetInnerHTML={html} />
}

const Mission: rs.IComponentFactory<rs.documents.ISourceCode, void> = {
  name: 'ui-markdown-view',
  displayName: 'Briefing',
  icon,
  view: MissionView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return document.type === 'source-code' &&
      (typeof document.volatile.description === 'string')
  },
  initialState(document: rs.IDocument<rs.documents.ISourceCode>) {
    return
  }
}

export default Mission
