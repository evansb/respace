import * as React from 'react'
import * as rs from '@respace/common'
import marked from 'marked'
import $ from 'jquery'

const icon: React.ComponentClass<void> =
  require('react-icons/fa/map').default

type Props = rs.IComponentProps<rs.documents.ISourceCode, void>

function MissionView({ component }: Props) {
  const document = component.document
  const renderer = new marked.Renderer()
  renderer.image = function(href) {
    return `<img class="img-responsive" src="https://source-academy-assets.s3.amazonaws.com/markdown/${href}"/>` // tslint:disable-line
  }
  renderer.table = function(header, body) {
    return `<table class="table">${header}${body}</table>`
  }
  const html = {
    __html: marked($(document.volatile.description).text(), {
       gfm: true,
       tables: true,
       renderer
    })
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
