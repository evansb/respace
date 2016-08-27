/// <reference path='../typings/index.d.ts' />
import * as rs from '@respace/common'
import EditorView from './ui/Editor'
import EditorStore from './store'
import EditorIcon from 'react-icons/fa/code'

class Editor extends rs.ComponentFactory<rs.SourceCode, EditorStore> {
  name = 'ui-editor'
  displayName = 'Source'
  icon = EditorIcon
  view = EditorView
  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
  }
  createStore(document: rs.SourceCode) {
    return new EditorStore(document)
  }
}

export { EditorStore, EditorView }

export default Editor
