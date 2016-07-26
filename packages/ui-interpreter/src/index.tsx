import * as React from 'react'
import * as rs from '@respace/common'
import InterpreterView from './ui/Interpreter'
import InterpreterStore from './store'

const icon: React.ComponentClass<void> =
  require('react-icons/fa/terminal').default

const Interpreter: rs.IComponentFactory<rs.documents.ISourceCode, InterpreterStore> = { // tslint:disable-line
  name: 'ui-interpreter',
  displayName: 'Interpreter',
  icon,
  view: InterpreterView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
  },
  initialState(document: rs.IDocument<rs.documents.ISourceCode>) {
    return new InterpreterStore(document)
  }
}

export default Interpreter
