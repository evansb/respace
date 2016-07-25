import * as rs from '@respace/common'
import { observable, computed, toJSON,
  transaction, autorun, extendObservable } from 'mobx'

export class Document<D> implements rs.IDocument<D> {
  type: string
  @observable meta: rs.IDocumentMeta = { id: 'error' }
  @observable data: D

  constructor(document: rs.IDocumentJSON<D>) {
    this.type = document.type
    extendObservable(this.meta, document.meta || {})
    this.data = observable(document.data)
  }

  @computed get id() {
    return this.meta.id
  }

  @computed get title() {
    return this.meta.title || 'Untitled Document'
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

  save(storage: rs.IStorage) {
    storage.put('state', {
      meta: toJSON(this.meta),
      data: toJSON(this.data)
    })
  }
}
