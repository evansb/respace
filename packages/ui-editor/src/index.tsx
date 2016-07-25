import * as React from 'react'
import * as rs from '@respace/common'
import EditorView from './ui/Editor'

const icon: React.ComponentClass<void> = require('react-icons/fa/code').default

const Editor: rs.IComponentFactory<rs.IBasicProps, any> = {
  name: 'ui-editor',
  displayName: 'Source',
  icon,
  view: EditorView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
  },
  initialProps(document: rs.AnyDocument) {
    return { title: document.meta.title || 'Untitled Document' }
  }
}

export default Editor
