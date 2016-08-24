import * as rs from '@respace/common'
import InterpreterView from './ui/Interpreter'
import Store from './store'
import InterpreterIcon from 'react-icons/fa/terminal'
import { ILanguageService, ISnapshot, ISnapshotError } from './language-service'

import * as service from './language-service'
export { service }

export default class Interpreter<L extends ISnapshot,
                                 E extends ISnapshotError<L>>
extends rs.ComponentFactory<rs.SourceCode, Store<L, E>> {
  name = 'ui-interpreter'
  displayName = 'Interpreter'
  icon = InterpreterIcon
  view = InterpreterView

  constructor(extensions: rs.ComponentExtensions<rs.SourceCode>,
              private _service: ILanguageService<L, E>) {
    super(extensions)
    this.name = `ui-interpreter-${this._service.language}`
  }

  acceptDocument(document: rs.AnyDocument) {
    const language = (document as rs.SourceCode).language
    return document.type === 'source-code'
      && language === this._service.language
  }

  createStore(document: rs.SourceCode) {
    return new Store(document, this._service)
  }
}
