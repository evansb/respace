import * as rs from '@respace/common'
import * as uuid from 'uuid'
import { createServer, ISnapshotError,
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

  constructor(public snapshot: Snapshot,
              errors?: ISnapshotError[]) {
    if (errors instanceof Array) {
      errors.forEach(e => {
        this.errors.push(e)
      })
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

  @observable isAutorunEnabled = false

  // Tabbing
  @observable snapshots: SnapshotData[] = []
  @observable activeTab: ITab

  @observable week: number = 3

  consoleTab: ITab = {
    key: 'console',
    title: 'Console'
  }

  private _tabs: ObservableMap<ITab> = new ObservableMap<ITab>()
  private _subscriptions: Subscription[] = []
  private _request$: Subject<IRequest> = new Subject<IRequest>()

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
    this.week = (<any> _document.meta).week || this.week
    this.context = _document.volatile.context || {}
    this.createRequestFromDocument()
    this.createServer()
    this.setupTabs()
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

  addCode(code: string) {
    const parentData: SnapshotData = this.snapshots[this.snapshots.length - 1]
    const parent = parentData && parentData.snapshot
    if (parent) {
      this._request$.next({
        code,
        globals: parent.globals,
        context: parent.context,
        week: parent.week,
        parent
      })
    } else {
      const newParent = new Snapshot({ code: ';' })
      this._request$.next({
        globals: this._document.volatile.globals || [],
        context: this._document.volatile.context || {},
        code,
        week: this.week,
        parent: newParent
      })
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
      const data = new SnapshotData(snapshot)
      this.snapshots.push(data)
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
    console.log(err)
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
            globals: this._document.volatile.globals || [],
            context: this._document.volatile.context || {},
            code: document.data.value,
            week: this.week
          })
        }
        return Promise.resolve()
      })
    })
    run$.share().subscribe(r => this._request$.next(r))
  }
}
