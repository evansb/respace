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
  @observable isSubmitted = false
  @observable isGraded = false

  statusBarHeight = 20
  toolbarHeight = 30

  private _editor: AceAjax.Editor

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
    this.isSubmitted = _document.volatile.isSubmitted
    this.isGraded = _document.volatile.isGraded
  }

  get isRemote(): boolean {
    return this._document.volatile.isRemote
  }

  setEditor(editor: AceAjax.Editor) {
    this._editor = editor
    this.addChangeHandler()
    if (this.isSubmitted) {
      this._editor.setReadOnly(true)
    }
    this._editor.$blockScrolling = 1000
    this._editor.getSession().setValue(this._document.data.value)
    this._document.addHandler((action, document) => {
      if (action === 'loaded') {
        this._editor.getSession().setValue(document.data.value)
      }
      return Promise.resolve()
    })
    autorun(() => { this._editor.setTheme(this.theme) })
    autorun(() => { this._editor.setFontSize(this.fontSize + 'px') })
    autorun(() => { this._editor.getSession().setMode(`ace/mode/${this.mode}`)})
    autorun(() => { this._editor.setShowPrintMargin(this.showPrintMargin) })
    autorun(() => { this._editor.setPrintMarginColumn(this.printMarginColumn) })
  }

  @action('ui-editor:save')
  async save() {
    this._document.dispatch('save')
    if (this._document.volatile.isRemote) {
      this._document.dispatch('saveRemote')
    }
    this.isDirty = false
  }

  @action('ui-editor:submit')
  async submit() {
    if (!this.isSubmitConfirmationShown) {
      this.isSubmitConfirmationShown = !this.isSubmitConfirmationShown
    } else {
      this._document.data.value = this._editor.getValue()
      await this._document.dispatch('submit')
      this.isSubmitConfirmationShown = false
    }
  }

  @action('ui-editor:revert')
  async revert() {
    if (!this.isRevertConfirmationShown) {
      this.isRevertConfirmationShown = !this.isRevertConfirmationShown
    } else {
      this._editor.getSession().setValue(this._document.volatile.template)
      this._document.data.value = this._document.data.template
      await this._document.dispatch('revert')
      this.isRevertConfirmationShown = false
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

  @action('ui-editor:run')
  async run() {
    await this._document.dispatch('run')
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
