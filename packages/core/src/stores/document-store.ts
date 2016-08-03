import { ObservableMap, map } from 'mobx'
import * as uuid from 'uuid'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable'
import { Document } from '../document'
import * as rs from '@respace/common'

export default class DocumentStore implements rs.IDocumentStore {
  private _events$: Observable<rs.events.DocumentEvent>
  private _documents: ObservableMap<rs.AnyDocument> = map<rs.AnyDocument>()
  private _storage: rs.IStorage

  constructor(private _initialDocuments: rs.AnyDocumentJSON[]) {
    this._events$ = Observable.create((observer) => {
      this._documents.observe((changes) => {
        switch (changes.type) {
          case 'add':
            observer.next(new rs.events.DocumentAdded(changes.newValue))
            break
          case 'update':
            observer.next(new rs.events.DocumentChanged(changes.newValue))
            break
          case 'delete':
            observer.next(new rs.events.DocumentRemoved(changes.newValue))
            break
          default:
        }
      })
    })
  }

  start() {
    return Promise.all([
      this._initialDocuments.map(d => this.addDocument(d))
    ])
  }

  async rehydrate(storage: rs.IStorage) {
    this._storage = storage
    await this._documents.forEach(async (document) => {
      const id = document.meta.id
      this._documents.set(id, await storage.get(id, document))
    })
  }

  async addDocument(documentJSON: rs.AnyDocumentJSON) {
    const _document = this.assignID(documentJSON)
    const document = new Document(_document)
    this._documents.set(document.meta.id, document)
    await document.rehydrate(this._storage.createStorage(document.meta.id))
    return document
  }

  removeDocument(document: rs.AnyDocument) {
    if (document.meta.id) {
      this._documents.delete(document.meta.id)
    }
  }

  destroy() { // tslint:disable-line
  }

  subscribe(cb: (e: rs.events.DocumentEvent) => any): Subscription {
    return this._events$.subscribe(cb)
  }

  private assignID(document: rs.AnyDocumentJSON): rs.AnyDocumentJSON {
    if (document.meta.id) {
      return document
    } else {
      const id = uuid.v4()
      document.meta.id = id
      return document
    }
  }
}
