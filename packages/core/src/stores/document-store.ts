import { ObservableMap, map } from 'mobx'
import * as uuid from 'uuid'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import { events, IDocumentStore, AnyDocument } from '@respace/common'

export default class DocumentStore implements IDocumentStore {
  private _events$: Subject<events.DocumentEvent>
  private _documents: ObservableMap<AnyDocument>

  static create(documents: AnyDocument[] = []): DocumentStore {
    return new DocumentStore(documents)
  }

  addDocument(document: AnyDocument) {
    const [id, _document] = this.assignID(document)
    this._documents.set(id, _document)
  }

  removeDocument(document: AnyDocument) {
    if (document.meta.id) {
      this._documents.delete(document.meta.id)
    }
  }

  subscribe(callback: (event: events.DocumentEvent) => any): Subscription {
    return this._events$.subscribe(callback)
  }

  private constructor(documents: AnyDocument[]) {
    this._documents = map(documents.map(this.assignID))
    this._events$ = Subject.create((observer) => {
      this._documents.observe((changes) => {
        switch (changes.type) {
          case 'add':
            observer.next(new events.DocumentAdded(changes.newValue))
            break
          case 'update':
            observer.next(new events.DocumentChanged(changes.newValue))
            break
          case 'delete':
            observer.next(new events.DocumentRemoved(changes.newValue))
            break
          default:
        }
      })
    })
  }

  private assignID(document: AnyDocument): [string, AnyDocument] {
    if (document.meta.id) {
      return [document.meta.id, document]
    } else {
      const id = uuid.v4()
      document.meta.id = id
      return [document.meta.id, document]
    }
  }
}
