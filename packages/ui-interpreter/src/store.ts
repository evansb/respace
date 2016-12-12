import * as rs from '@respace/common'
import * as uuid from 'uuid'
import { observable, action, autorun, toJS } from 'mobx'
import { ILanguageService, ISnapshot, ISnapshotError,
  SnapshotRequest } from './language-service'
import SnapshotData from './snapshot-data'

declare var window: any

export default class InterpreterStore<T extends ISnapshot,
                                      E extends ISnapshotError<T>> {
  context: any

  // Console toolbar
  toolbarHeight = '20px'

  // Shared Editor config
  @observable editor = {
    theme: 'tomorrow_night',
    mode: 'javascript',
    fontSize: 12,
    showPrintMargin: true,
    showLineNumber: true,
    printMarginColumn: 80
  }

  @observable snapshots: SnapshotData<T, E>[] = []
  @observable isAutorunEnabled = false
  @observable isControlsEnabled = false
  @observable executeShortcut = 'Shift-Enter'

  availableShortcuts = [
    'Shift-Enter',
    'Ctrl-Enter',
    'Ctrl-E',
    'Ctrl-R'
  ]

  inputEditor: AceAjax.Editor
  inputEditorValue = ''

  private _hideCode: {[id: string]: boolean} = {}
  private _cycleHistoryN = 0

  constructor(private _document: rs.SourceCode,
              private _service: ILanguageService<T, E>) {
    this.pipeRunToRequest()
  }

  @action('interpreter.clear')
  clearAll() {
    this._hideCode = {}
    while (this.snapshots.length > 0) {
      this.snapshots.pop()
    }
    this._cycleHistoryN = 0
  }

  @action('interpreter.clearNew')
  clearNew() {
    let idx = this.snapshots.length - 1
    this._cycleHistoryN = 1
    while (this.snapshots.length > 0) {
      if (this.snapshots[idx].snapshot.parent) {
        this.snapshots.pop()
      } else {
        break
      }
      idx--
    }
  }

  addCodeFromInput() {
    if (this.inputEditor) {
      this.addCode(this.inputEditor.getValue())
    }
  }

  @action('interpreter.addCode')
  addCode(code: string) {
    const parentData = this.snapshots[this.snapshots.length - 1]
    const parent = parentData && parentData.snapshot
    let result
    if (parent) {
      result = this._service.publish(this.createRequest(code, parent), this)
    } else {
      result = this._service.publish(this.createRequest(code), this)
    }
    if (result['code']) {
      this.handleSnapshot(result as T)
    } else {
      this.handleError(result as E)
    }
  }

  cycleHistory() {
    const snapshotData = this.snapshots[this._cycleHistoryN]
    if (snapshotData && snapshotData.isCodeShown) {
      this.inputEditor.setValue(snapshotData.snapshot.code)
      this._cycleHistoryN--
      if (this._cycleHistoryN < 0) {
        this._cycleHistoryN = this.snapshots.length - 1
      }
    }
  }

  setupEditor(editor: AceAjax.Editor) {
    editor.$blockScrolling = 1000
    autorun(() => {
      editor.renderer.setShowGutter(this.editor.showLineNumber)
    })
    autorun(() => {
      editor.setTheme(`ace/theme/${this.editor.theme}`)
    })
    autorun(() => {
      editor.getSession().setMode(`ace/mode/${this.editor.mode}`)
    })
    autorun(() => {
      editor.setShowPrintMargin(this.editor.showPrintMargin)
    })
    autorun(() => {
      editor.setPrintMarginColumn(this.editor.printMarginColumn)
    })
  }

  private handleSnapshot(snapshot: T) {
    this.snapshots.some(s => {
      let same = s.id === snapshot.id
      if (same) {
        s.setSnapshot(snapshot)
      }
      return same
    })
  }

  private handleError(err: E) {
    this.snapshots.some(s => {
      let same = s.id === err.snapshot.id
      if (same && !(s.errors.find(e => e.message === err.message))) {
        s.setSnapshot(err.snapshot)
        s.errors.push(err)
      }
      return same
    })
  }

  private handleLog(log: string) {
    setTimeout(() => {
      this.snapshots[this.snapshots.length - 1].logs.push(log)
    }, 1)
  }

  private createRequest(code: string, parent?: T,
                        showCode: boolean = true): SnapshotRequest<T> {
    const id = uuid.v4()
    if (!showCode) {
      this._hideCode[id] = true
    }
    const request: SnapshotRequest<T> = {
      type: 'snapshotRequest',
      payload: <T> ({ id, done: false, code, })
    }
    if (parent) {
      request.payload.parent = parent
    }
    let data = new SnapshotData(id, code, this._service)
    data.isCodeShown = !this._hideCode[id]
    this.snapshots.push(data)
    this._cycleHistoryN = (this.snapshots.length - 1)
    return request
  }

  private pipeRunToRequest() {
    this._document.subscribe(action => {
      if (action.type === 'run') {
        this.clearAll()
        const request = this.createRequest(
          this._document.value, undefined, false)
        const result = this._service.publish(request, this)
        if (result['code']) {
          this.handleSnapshot(result as T)
        } else {
          this.handleError(result as E)
        }
      }
      return undefined
    })
  }
}
