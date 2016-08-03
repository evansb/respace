import * as rs from '@respace/common'
import * as uuid from 'uuid'
import { createServer, ISnapshotError,
  createRequestStream, IRequest, Snapshot,
  printValueToString, printErrorToString } from 'the-source'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/share'
import { observable, action, computed, autorun,
  transaction, ObservableMap } from 'mobx'

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

  // Console Input
  @observable consoleInput = {
    leftPadding: '5px',
    rightPadding: '5px',
    height: '100px',
    theme: 'ace/theme/tomorrow_night',
    mode: 'javascript',
    fontSize: 12,
    showPrintMargin: true,
    printMarginColumn: 80
  }

  // Tabbing
  @observable snapshots: ISnapshotData[] = []
  @observable activeTab: ITab

  consoleTab: ITab = {
    key: 'console',
    title: 'Console'
  }

  private _tabs: ObservableMap<ITab> = new ObservableMap<ITab>()
  private _subscriptions: Subscription[] = []
  private _request$: Subject<IRequest> = new Subject<IRequest>()
  private _editor: AceAjax.Editor

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

  setEditor(editor: AceAjax.Editor) {
    this._editor = editor
    this._editor.$blockScrolling = 1000
    this._editor.getSession().setValue('')
    autorun(() => {
      this._editor.setTheme(this.consoleInput.theme)
    })
    autorun(() => {
      this._editor.getSession().setMode(`ace/mode/${this.consoleInput.mode}`)
    })
    autorun(() => {
      this._editor.getSession().setMode(`ace/mode/${this.consoleInput.mode}`)
    })
    autorun(() => {
      this._editor.setShowPrintMargin(this.consoleInput.showPrintMargin)
    })
    autorun(() => {
      this._editor.setPrintMarginColumn(this.consoleInput.printMarginColumn)
    })
  }

  destroy() {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  private handleNewSnapshot(snapshot: Snapshot) {
    console.log(printValueToString(snapshot.value))
    return
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
    console.log(printErrorToString(err))
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
