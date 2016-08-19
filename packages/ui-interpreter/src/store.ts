import * as rs from '@respace/common'
import * as uuid from 'uuid'
import { createServer, ISnapshotError, printValueToString,
  createRequestStream, IRequest, Snapshot } from 'the-source'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import { observable, action, computed, autorun,
  transaction, ObservableMap } from 'mobx'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/share'
import 'brace/mode/javascript'
import 'brace/theme/tomorrow_night'

export interface ITab {
  key: string
  title: string
  snapshotID?: string
}

export class SnapshotData {
  @observable errors: ISnapshotError[] = []
  @observable valueType: string = ''
  @observable valueString: string = ''
  @observable isDone: boolean = false

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

  inputEditor: AceAjax.Editor

  @observable isAutorunEnabled = false
  @observable isControlsEnabled = false

  timeout: number
  stackSize: number

  // Tabbing
  @observable snapshots: SnapshotData[] = []
  @observable activeTab: ITab

  @observable week: number = 3

  consoleTab: ITab = {
    key: 'console',
    title: 'Console'
  }

  inputEditorValue = ''

  system: any

  private _tabs: ObservableMap<ITab> = new ObservableMap<ITab>()
  private _subscriptions: Subscription[] = []
  private _request$: Subject<IRequest> = new Subject<IRequest>()

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
    this.week = (<any> _document.meta).week || this.week
    _document.volatile = _document.volatile || {}
    _document.volatile.context = _document.volatile.context || {}
    _document.volatile.globals = _document.volatile.globals || []
    _document.volatile.context.system = this.system
    _document.volatile.globals.push('system')
    this.createRequestFromDocument()
    this.createServer()
    this.setupTabs()

    this.timeout = 10000
    this.stackSize = 65536
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
        console.log(this)
        this.timeout = timeout
      }
    }
    this.system = { runtime_limit }
    this.addCode('')
  }

  @computed get tabs() {
    const ts: ITab[] = []
    for (const tab of this._tabs.values()) {
      ts.push(tab)
    }
    return ts
  }

  @action('interp:selectTab')
  selectTab(key: string) {
    for (const tab of this._tabs.values()) {
      if (tab.key === key) {
        this.activeTab = tab
        return
      }
    }
  }

  @action('interp:closeTab')
  closeTab(tab: ITab) {
    this._tabs.delete(tab.key)
  }

  @action('interp:addTab')
  addTab(title: string, snapshotID?: string) {
    const key = uuid.v4()
    this._tabs.set(key, { key, title, snapshotID })
  }

  @action('interp:clear')
  clearAll() {
    transaction(() => {
      this.timeout = 10000
      this.stackSize = 65536
      while (this.snapshots.length > 0) {
        this.snapshots.pop()
      }
    })
  }

  @action('interp:clearNew')
  clearNew() {
    transaction(() => {
      let idx = this.snapshots.length - 1
      while (this.snapshots.length > 0) {
        if (this.snapshots[idx].snapshot.parent) {
          this.snapshots.pop()
        } else {
          break
        }
        idx--
      }
    })
  }

  addCodeFromInput() {
    if (this.inputEditor) {
      this.addCode(this.inputEditor.getValue())
    }
  }

  addCode(code: string) {
    const parentData: SnapshotData = this.snapshots[this.snapshots.length - 1]
    const parent = parentData && parentData.snapshot
    this.timeout = 1000;
    if (parent) {
      this._request$.next({ id: uuid.v4(), code, parent,
        timeout: this.timeout, maxCallStack: this.stackSize,
        week: parent.week })
    } else {
      const parent = new Snapshot({
        id: uuid.v4(),
        week: this.week,
        maxCallStack: this.stackSize,
        timeout: this.timeout,
        code: '',
        globals: (this._document.volatile.globals || []).concat(['Math',
          'alert']),
        context: this._document.volatile.context || {}
      })
      this.snapshots.push(new SnapshotData(parent))
      this.addCode(code)
    }
  }

  setupEditor(editor: AceAjax.Editor) {
    editor.$blockScrolling = 1000
    editor.setOption('useWorker', false);
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
    transaction(() => {
      const found = this.snapshots.some(s => {
        let same = s.snapshot.id === snapshot.id
        if (same) { s.snapshot = snapshot; s.setSnapshot(snapshot) }
        return same
      })
      if (!found) {
        const data = new SnapshotData(snapshot)
        this.snapshots.push(data)
      }
    })
  }

  private setupTabs() {
    transaction(() => {
      this.activeTab = this.consoleTab
      this._tabs.set(this.consoleTab.key, this.consoleTab)
    })
  }

  private handleError(err: ISnapshotError) {
    // Find snapshots
    const found = this.snapshots.some(s => {
      let same = s.snapshot === err.snapshot
      if (same) {
        if (!(s.errors.find(e => e.message === err.message))) {
          s.errors.push(err)
        }
      }
      return same
    })
    if (!found && err.snapshot) {
      this.snapshots.push(new SnapshotData(err.snapshot, [err]))
    }
  }

  private createServer() {
    const request$ = createRequestStream(observer => {
      this._request$.subscribe(i => observer.next(i))
    })
    const sink = createServer(<any> request$)
    sink.subscribe(s => {
      if (s instanceof Snapshot) {
        this.handleSnapshot(<Snapshot> s)
      } else {
        this.handleError(<ISnapshotError> s)
      }
    })
  }

  private createRequestFromDocument() {
    const run$: Observable<IRequest> = Observable.create(observer => {
      this._document.addHandler((action, document) => {
        if (action === 'run') {
          this.clearAll()
          observer.next({
            id: uuid.v4(),
            globals: this._document.volatile.globals || [],
            context: this._document.volatile.context || {},
            maxCallStack: this.stackSize,
            timeout: this.timeout,
            code: document.data.value,
            week: this.week,
          })
        }
        return Promise.resolve()
      })
    })
    run$.share().subscribe(r => this._request$.next(r))
  }
}
