import { ObservableMap, map } from 'mobx'
import * as uuid from 'uuid'
import { Observable } from 'rxjs/Observable'
import * as rs from '@respace/common'

export default class DocumentStore implements rs.IDocumentStore {
  public events$: Observable<rs.events.DocumentEvent>
  private _documents: ObservableMap<rs.AnyDocument> = map<rs.AnyDocument>()

  static create(): DocumentStore {
    return new DocumentStore()
  }

  start() {
    return
  }

  addDocument(document: rs.AnyDocument) {
    const _document = this.assignID(document)
    if (document.meta.id) {
      this._documents.set(document.meta.id, _document)
    }
  }

  removeDocument(document: rs.AnyDocument) {
    if (document.meta.id) {
      this._documents.delete(document.meta.id)
    }
  }

  private constructor() {
    this.events$ = Observable.create((observer) => {
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

  private assignID(document: rs.AnyDocument): rs.AnyDocument {
    if (document.meta.id) {
      return document
    } else {
      const id = uuid.v4()
      document.meta.id = id
      return document
    }
  }
}
