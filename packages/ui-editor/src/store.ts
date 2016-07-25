import * as rs from '@respace/common'
import { observable, autorun } from 'mobx'
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'

export default class EditorStore {
  @observable public theme = 'ace/theme/tomorrow_night'
  @observable public mode = 'ace/mode/javascript'
  @observable public fontSize = '12px'
  @observable public showPrintMargin = true
  @observable public printMarginColumn = 80

  private _editor: AceAjax.Editor

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
  }

  setEditor(editor: AceAjax.Editor) {
    this._editor = editor
    editor.getSession().setValue(this._document.data.value)
    this.addChangeHandler()
    autorun(() => { this._editor.setTheme(this.theme) })
    autorun(() => { this._editor.setFontSize(this.fontSize) })
    autorun(() => { this._editor.getSession().setMode(this.mode) })
    autorun(() => { this._editor.setShowPrintMargin(this.showPrintMargin) })
    autorun(() => { this._editor.setPrintMarginColumn(this.printMarginColumn) })
  }

  private addChangeHandler() {
    const session = this._editor.getSession()
    Observable.fromEvent(<any> session, 'change')
      .debounceTime(500)
      .subscribe(() => {
        this._document.data.value = session.getValue()
      })
  }

}
