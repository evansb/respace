/// <reference path='../typings/index.d.ts' />
import * as React from 'react'
import * as rs from '@respace/common'
import EditorView from './ui/Editor'
import EditorStore from './store'

const icon: React.ComponentClass<void> = require('react-icons/fa/code').default

const Editor: rs.IComponentFactory<rs.documents.ISourceCode, EditorStore> = {
  name: 'ui-editor',
  displayName: 'Source',
  icon,
  view: EditorView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
  },
  initialState(document: rs.IDocument<rs.documents.ISourceCode>) {
    return new EditorStore(document)
  }
}

export default Editor
