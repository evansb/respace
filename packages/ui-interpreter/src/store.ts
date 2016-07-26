import * as rs from '@respace/common'
import * as uuid from 'uuid'
import { observable, action, computed, transaction, ObservableMap } from 'mobx'

export interface ITab {
  key: string
  title: string
  snapshotID?: string
}

export default class InterpreterStore {
  @observable activeTab: ITab
  _tabs: ObservableMap<ITab> = new ObservableMap<ITab>()

  consoleTab: ITab = {
    key: 'console',
    title: 'Console'
  }

  constructor(private _document: rs.IDocument<rs.documents.ISourceCode>) {
    this._document.addHandler((action, document) => {
      if (action === 'run') {
        console.log('Code will run')
      }
      return Promise.resolve()
    })
    transaction(() => {
      const key = uuid.v4()
      const key2 = uuid.v4()
      this.activeTab = this.consoleTab
      this._tabs.set(this.consoleTab.key, this.consoleTab)
      this._tabs.set(key, { key, title: 'Test' })
      this._tabs.set(key2, { key: key2, title: 'Test2' })
    })
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
}
