import * as rs from '@respace/common'
import { observable, computed, toJSON,
  transaction, autorun, extendObservable } from 'mobx'

export class Document<D> implements rs.IDocument<D> {
  readonly type: string
  @observable meta: rs.IDocumentMeta = { id: 'error' }
  @observable data: D

  private _handlers: rs.DocumentHandler<D>[] = []

  constructor(document: rs.IDocumentJSON<D>, storage?: rs.IStorage) {
    this.type = document.type
    extendObservable(this.meta, document.meta || {})
    this.data = observable(document.data)
    if (document.handlers instanceof Array) {
      this._handlers = document.handlers
    }
    if (storage) {
      const s = storage
      this.addHandler((action, snapshot) => {
        if (action === 'save') {
          return this.save(s)
        } else {
          return Promise.resolve()
        }
      })
    }
  }

  @computed get id() {
    return this.meta.id
  }

  @computed get title() {
    return this.meta.title || 'Untitled Document'
  }

  addHandler(handler: rs.DocumentHandler<D>) {
    this._handlers.push(handler)
  }

  async dispatch(action: string) {
    const snapshot = {
      type: this.type,
      meta: toJSON(this.meta),
      data: toJSON(this.data) as D
    }
    this._handlers.forEach(async (handler) => {
      await handler(action, snapshot)
    })
  }

  async rehydrate(storage: rs.IStorage) {
    const state = <this> (await storage.get('state'))
    if (state) {
      transaction(() => {
        extendObservable(this.meta, state.meta || {})
        extendObservable(this.data, state.data || {})
      })
    }
    autorun(() => {
      this.save(storage)
    })
  }

  private save(storage: rs.IStorage) {
    return storage.put('state', {
      meta: toJSON(this.meta),
      data: toJSON(this.data)
    })
  }
}
