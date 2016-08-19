import * as React from 'react'
import * as rs from '@respace/common'
import InterpreterView from './ui/Interpreter'
import Store from './store'

const icon: React.ComponentClass<void> =
  require('react-icons/fa/terminal').default

const Interpreter: rs.IComponentFactory<rs.documents.ISourceCode, Store> = {
  name: 'ui-interpreter',
  displayName: 'Interpreter',
  icon,
  view: InterpreterView,
  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
  },
  initialState(document: rs.IDocument<rs.documents.ISourceCode>) {
    return new Store(document)
  }
}

export default Interpreter
