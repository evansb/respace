import * as rs from '@respace/common'
import * as uuid from 'uuid'
import { createServer, ISnapshotError, printValueToString,
  createRequestStream, IRequest, Snapshot } from 'the-source'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import { observable, action, autorun, transaction } from 'mobx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/share'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow_night'

const DEFAULT_TIMEOUT = 10000
const DEFAULT_STACK_SIZE = 65536

export class SnapshotData {
  @observable errors: ISnapshotError[] = []
  @observable valueType: string = ''
  @observable valueString: string = ''
  @observable isDone: boolean = false
  @observable showCode = true
  @observable showValue = true

  constructor(public snapshot: Snapshot, errors?: ISnapshotError[]) {
    this.setSnapshot(snapshot)
    if (errors instanceof Array) {
      errors.forEach(e => {
        this.errors.push(e)
      })
    }
  }

  @action('snapshot.setValue')
  setSnapshot(snapshot: Snapshot) {
    this.snapshot = snapshot
    this.isDone = snapshot.done
    if (this.isDone) {
      this.valueType = typeof snapshot.value.value
      this.valueString = printValueToString(
        snapshot.value, this.snapshot.context)
    }
  }
}

export default class InterpreterStore {
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

  @observable snapshots: SnapshotData[] = []
  @observable week: number
  @observable isAutorunEnabled = false
  @observable isControlsEnabled = false
  @observable timeout: number = DEFAULT_TIMEOUT
  @observable stackSize: number = DEFAULT_STACK_SIZE
  @observable executeShortcut = 'Shift-Enter'

  availableShortcuts = [
    'Shift-Enter',
    'Ctrl-Enter',
    'Ctrl-E',
    'Ctrl-R'
  ]

  inputEditor: AceAjax.Editor
  inputEditorValue = ''

  private _subscriptions: Subscription[] = []
  private _request$: Subject<IRequest> = new Subject<IRequest>()

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
    _document.volatile = _document.volatile || {}
    _document.volatile.context = _document.volatile.context || {}
    _document.volatile.globals = _document.volatile.globals || []
    this.week = _document.volatile.week || 3
    this.pipeRunToRequest()
    this.connectToService()
    this.injectSystemToRuntime()
  }

  @action('interpreter.clear')
  clearAll() {
    this.timeout = DEFAULT_TIMEOUT
    this.stackSize = DEFAULT_STACK_SIZE
    while (this.snapshots.length > 0) {
      this.snapshots.pop()
    }
  }

  @action('interpreter.clearNew')
  clearNew() {
    let idx = this.snapshots.length - 1
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
    if (parent) {
      this._request$.next(this.createRequest(code, parent))
    } else {
      this._request$.next(this.createRequest(''))
      this.snapshots[0].showCode = false
      this.snapshots[0].showValue = false
      console.log(this.snapshots)
      this.addCode(code)
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

  destroy() {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  private handleSnapshot(snapshot: Snapshot) {
    const found = this.snapshots.some(s => {
      let same = s.snapshot.id === snapshot.id
      if (same) {
        s.setSnapshot(snapshot)
      }
      return same
    })
    if (!found) {
      this.snapshots.push(new SnapshotData(snapshot))
    }
  }

  private handleError(err: ISnapshotError) {
    // Find snapshots
    const found = this.snapshots.some(s => {
      let same = s.snapshot === err.snapshot
      if (same && !(s.errors.find(e => e.message === err.message))) {
        s.errors.push(err)
      }
      return same
    })
    if (!found && err.snapshot) {
      this.snapshots.push(new SnapshotData(err.snapshot, [err]))
    }
  }

  private connectToService() {
    const request$ = createRequestStream(observer => {
      this._request$.subscribe(i => observer.next(i))
    })
    createServer(<any> request$).subscribe(s => {
      if (s instanceof Snapshot) {
        this.handleSnapshot(<Snapshot> s)
      } else {
        this.handleError(<ISnapshotError> s)
      }
    })
  }

  private createRequest(code: string, parent?: Snapshot): IRequest {
    const request: IRequest = {
      id: uuid.v4(),
      maxCallStack: this.stackSize,
      timeout: this.timeout,
      code,
      week: this.week,
    }
    if (!parent) {
      request.globals = this._document.volatile.globals
      request.context = this._document.volatile.context
    } else {
      request.parent = parent
      request.week = parent.week
    }
    return request
  }

  private injectSystemToRuntime() {
    const runtime_limit = {
      set_stack_size: (stackSize) => {
        this.stackSize = stackSize
      },
      get_stack_size: () => {
        return this.stackSize
      },
      get_timeout: () => {
        return this.timeout
      },
      set_timeout: (timeout) => {
        this.timeout = timeout
      }
    }
    const system = { runtime_limit }
    this._document.volatile.context.system = system
    this._document.volatile.globals.push('system')
  }

  private pipeRunToRequest() {
    const run$: Observable<IRequest> = Observable.create(observer => {
      this._document.addHandler(async (action, document) => {
        if (action === 'run') {
          this.clearAll()
          transaction(() => {
            observer.next(this.createRequest(document.data.value))
            this.snapshots[0].showCode = false
          })
        }
      })
    })
    run$.share().subscribe(r => this._request$.next(r))
  }
}
