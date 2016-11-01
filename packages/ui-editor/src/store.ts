import * as rs from '@respace/common'
import { observable, autorun, action } from 'mobx'
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'

declare var window: any

export default class EditorStore {
  MIN_FONT_SIZE = 8
  MAX_FONT_SIZE = 64
  idx: number

  @observable theme = 'ace/theme/tomorrow_night'
  @observable mode = 'javascript'
  @observable fontSize = 12
  @observable showPrintMargin = true
  @observable printMarginColumn = 80
  @observable isDirty = false
  @observable isAutorunEnabled = false
  @observable isRevertConfirmationShown = false

  statusBarHeight = 20
  toolbarHeight = 30

  private _editor: AceAjax.Editor

  constructor(public sourceCode: rs.SourceCode) {
    this.idx = parseInt(this.sourceCode.title.split(' ')[1], 10)
    this.sourceCode.subscribe(a => {
      if (a.type === 'rehydrated' && this._editor) {
        this._editor.setValue(sourceCode.value)
        this.isDirty = false
      }
      return undefined
    })
  }

  setEditor(editor: AceAjax.Editor) {
    this._editor = editor
    this.addChangeHandler()
    this._editor.$blockScrolling = 1000
    this._editor.getSession().setValue(this.sourceCode.value)
    this.isDirty = false
    autorun(() => { this._editor.setTheme(this.theme) })
    autorun(() => { this._editor.setFontSize(this.fontSize + 'px') })
    autorun(() => { this._editor.getSession().setMode(`ace/mode/${this.mode}`)})
    autorun(() => { this._editor.setShowPrintMargin(this.showPrintMargin) })
    autorun(() => { this._editor.setPrintMarginColumn(this.printMarginColumn) })
  }

  @action('ui-editor:save')
  save() {
    this.sourceCode.publish(<rs.SourceCodeActions.Save> {
      type: 'save',
      payload: this._editor.getValue()
    })
    this.isDirty = false
  }

  @action('editor:revert')
  revert() {
    if (!this.isRevertConfirmationShown) {
      this.isRevertConfirmationShown = !this.isRevertConfirmationShown
    } else {
      this._editor.getSession().setValue(this.sourceCode.template)
      this.sourceCode.publish({ type: 'revert' })
      this.isRevertConfirmationShown = false
    }
  }

  @action('editor.increaseFontSize')
  increaseFontSize() {
    if (this.fontSize <= (this.MAX_FONT_SIZE - 2)) {
      this.fontSize += 2
    }
  }

  @action('editor.decreaseFontSize')
  decreaseFontSize() {
    if (this.fontSize >= (this.MIN_FONT_SIZE + 2)) {
      this.fontSize -= 2
    }
  }

  @action('editor.run')
  run() {
    this.sourceCode.publish(<rs.SourceCodeActions.Run> {
      type: 'run',
      payload: this._editor.getValue()
    })
  }

  getEditorValue() {
    return this._editor.getValue()
  }

  getActiveEditor() {
    return this._editor
  }

  private addChangeHandler() {
    const session = this._editor.getSession()
    Observable.fromEvent(<any> session, 'change')
      .debounceTime(100)
      .subscribe(() => {
        this.isDirty = true
        if (window.SOURCE_CODES) {
          window.SOURCE_CODES[this.idx - 1] = this._editor.getValue()
        }
        this.sourceCode.setValue(this._editor.getValue())
      })
  }
}
