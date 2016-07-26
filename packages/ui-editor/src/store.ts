import * as rs from '@respace/common'
import { observable, autorun, transaction, action } from 'mobx'
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'

export default class EditorStore {
  MIN_FONT_SIZE = 8
  MAX_FONT_SIZE = 64

  @observable theme = 'ace/theme/tomorrow_night'
  @observable mode = 'javascript'
  @observable fontSize = 12
  @observable showPrintMargin = true
  @observable printMarginColumn = 80
  @observable isDirty = false
  @observable isAutorunEnabled = false
  @observable isRevertConfirmationShown = false
  @observable isSubmitConfirmationShown = false

  statusBarHeight = 20
  toolbarHeight = 30

  private _editor: AceAjax.Editor

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
  }

  setEditor(editor: AceAjax.Editor) {
    this._editor = editor
    editor.getSession().setValue(this._document.data.value)
    this.addChangeHandler()
    autorun(() => { this._editor.setTheme(this.theme) })
    autorun(() => { this._editor.setFontSize(this.fontSize + 'px') })
    autorun(() => { this._editor.getSession().setMode(`ace/mode/${this.mode}`)})
    autorun(() => { this._editor.setShowPrintMargin(this.showPrintMargin) })
    autorun(() => { this._editor.setPrintMarginColumn(this.printMarginColumn) })
  }

  @action('ui-editor:save')
  save() {
    this.isDirty = false
  }

  submit() {
    if (!this.isSubmitConfirmationShown) {
      this.isSubmitConfirmationShown = !this.isSubmitConfirmationShown
    } else {
      console.log('Submit!')
    }
  }

  @action('ui-editor:revert')
  revert() {
    console.log(this.isRevertConfirmationShown)
    if (!this.isRevertConfirmationShown) {
      this.isRevertConfirmationShown = !this.isRevertConfirmationShown
    } else {
      this._editor.getSession().setValue(this._document.data.template)
      this._document.data.value = this._document.data.template
    }
  }

  @action('ui-editor:increaseFontSize')
  increaseFontSize() {
    if (this.fontSize <= (this.MAX_FONT_SIZE - 2)) {
      this.fontSize += 2
    }
  }

  @action('ui-editor:decreaseFontSize')
  decreaseFontSize() {
    if (this.fontSize >= (this.MIN_FONT_SIZE + 2)) {
      this.fontSize -= 2
    }
  }

  run() {
    console.log('run!')
  }

  private addChangeHandler() {
    const session = this._editor.getSession()
    Observable.fromEvent(<any> session, 'change')
      .debounceTime(100)
      .subscribe(() => {
        transaction(() => {
          this.isDirty = true
          this._document.data.value = session.getValue()
        })
      })
  }
}
