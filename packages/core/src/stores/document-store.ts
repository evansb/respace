import { ObservableMap, map } from 'mobx'
import * as uuid from 'uuid'
import { Subject } from 'rxjs/Subject'
import * as rs from '@respace/common'

export default class DocumentStore {
  private _events$: Subject<rs.IAction<any>>
  private _documents: ObservableMap<rs.AnyDocument> = map<rs.AnyDocument>()
  private _storage: rs.IStorage

  constructor(private _initialDocuments: rs.AnyDocument[]) {
    this._events$ = new Subject<any>()
    this._documents.observe((changes) => {
      switch (changes.type) {
        case 'add':
          this._events$.next({
            type: 'documentCreated',
            payload: changes.newValue
          })
          break
        default:
      }
    })
  }

  async start() {
    await this._initialDocuments.map(d => this.addDocument(d))
  }

  async rehydrate(storage: rs.IStorage) {
    this._storage = storage
    await Promise.all(this._documents.values().map((document) => {
      document.setStorage(this._storage.createStorage(document.id))
      return document.rehydrate()
    }))
  }

  publish(action: rs.IAction<any>) {
    this._documents.values().forEach(d => d.publish(action))
  }

  subscribe(handler: rs.ActionHandler<any>) {
    return this._events$.subscribe((e) => {
      const reply = handler(e)
      if (reply) {
        reply.subscribe((r) => this._events$.next(r))
      }
    })
  }

  async addDocument(document: rs.AnyDocument) {
    this.assignID(document)
    this._documents.set(document.meta.id, document)
    return document
  }

  removeDocument(document: rs.AnyDocument) {
    if (document.meta.id) {
      this._documents.delete(document.meta.id)
    }
  }

  private assignID(document: rs.AnyDocument) {
    if (!document.meta.id) {
      const id = uuid.v4()
      document.meta.id = id
    }
  }
}
