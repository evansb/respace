import * as rs from '@respace/common'
import { observable, computed, toJS,
  transaction, extendObservable } from 'mobx'

export class Document<D> implements rs.IDocument<D> {
  readonly type: string
  volatile: any
  @observable meta: rs.IDocumentMeta = { id: 'error' }
  @observable data: D

  private _handlers: rs.DocumentHandler<D>[] = []

  constructor(document: rs.IDocumentJSON<D>) {
    this.type = document.type
    this.volatile = document.volatile || {}
    extendObservable(this.meta, document.meta || {})
    this.data = observable(document.data)
    if (document.handlers instanceof Array) {
      this._handlers = document.handlers
    }
  }

  @computed get id() {
    return this.meta.id
  }

  @computed get title() {
    return this.meta.title || 'Untitled Document'
  }

  addHandler(handler: rs.DocumentHandler<D>) {
    let found = this._handlers.some(h => {
      return h === handler
    })
    if (!found) {
      this._handlers.push(handler)
    }
  }

  async dispatch(action: string, args?: any) {
    const snapshot = {
      type: this.type,
      meta: toJS(this.meta),
      data: toJS(this.data) as D
    }
    this._handlers.forEach(async (handler) => {
      await handler(action, snapshot, args)
    })
  }

  async rehydrate(storage: rs.IStorage) {
    await this.load(storage)
    this.addHandler((action, snapshot) => {
      if (action === 'save') {
        return this.save(storage)
      } else {
        return Promise.resolve()
      }
    })
    await this.save(storage)
  }

  private async load(storage: rs.IStorage) {
    const state = <this> (await storage.get('state'))
    if (state) {
      await transaction(() => {
        extendObservable(this.meta, state.meta || {})
        extendObservable(this.data, state.data || {})
        return Promise.resolve()
      })
      await this.dispatch('loaded')
    }
  }

  private save(storage: rs.IStorage) {
    return storage.put('state', {
      meta: toJS(this.meta),
      data: toJS(this.data)
    })
  }
}
