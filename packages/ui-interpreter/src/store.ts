import * as rs from '@respace/common'
import * as uuid from 'uuid'
import { createServer, ISnapshotError,
  createRequestStream, IRequest, Snapshot  } from 'the-source'
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

export interface ISnapshotData {
  snapshot: Snapshot,
  errors: ISnapshotError[]
}

export default class InterpreterStore {
  // Console toolbar
  toolbarHeight = '20px'

  // Shared Editor config
  @observable editor = {
    theme: 'tomorrow_night',
    mode: 'javascript',
    fontSize: 12,
    showPrintMargin: true,
    printMarginColumn: 80
  }

  @observable isAutorunEnabled = false

  // Tabbing
  @observable snapshots: ISnapshotData[] = []
  @observable activeTab: ITab

  @observable week: number

  consoleTab: ITab = {
    key: 'console',
    title: 'Console'
  }

  private _tabs: ObservableMap<ITab> = new ObservableMap<ITab>()
  private _subscriptions: Subscription[] = []
  private _request$: Subject<IRequest> = new Subject<IRequest>()

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
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

  addCode(code: string) {
    const parent: Snapshot = this.snapshots[0] && this.snapshots[0].snapshot
    if (parent) {
      this._request$.next({ code, week: parent.week, parent })
    } else {
      this._request$.next({ code, week: this.week })
    }
  }

  setupEditor(editor: AceAjax.Editor) {
    editor.$blockScrolling = 1000
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

  private handleNewSnapshot(snapshot: Snapshot) {
    transaction(() => {
      if (!this.isAutorunEnabled) {
        this.snapshots = []
      }
      this.snapshots.push({ snapshot, errors: [] })
    })
  }

  private handleChildSnapshot(snapshot: Snapshot) {
    return
  }

  private handleSnapshot(snapshot: Snapshot) {
    if (!snapshot.parent) {
      return this.handleNewSnapshot(snapshot)
    } else {
      return this.handleChildSnapshot(snapshot)
    }
  }

  private setupTabs() {
    transaction(() => {
      this.activeTab = this.consoleTab
      this._tabs.set(this.consoleTab.key, this.consoleTab)
    })
  }

  private handleError(err: ISnapshotError) {
    return
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
          observer.next({ code: document.data.value, week: 3 })
        }
        return Promise.resolve()
      })
    })
    run$.share().subscribe(r => this._request$.next(r))
  }
}
