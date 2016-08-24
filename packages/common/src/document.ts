import { IAction, IPubSub, ActionHandler } from './action'
import { observable, extendObservable, computed, toJS } from 'mobx'
import { Subject } from 'rxjs/Subject'
import { IStorage } from './storage'

export interface IDocumentMeta {
  id: string
  title?: string
  isPersisted?: boolean
  group?: string
  [other: string]: any
}

export interface IDocumentJSON<T> {
  type: string
  meta: IDocumentMeta
  data: T
  volatile?: any
}

export const SAVE_DOCUMENT = 'saveDocument'
export const LOAD_DOCUMENT = 'loadDocument'
export const DOCUMENT_CREATED = 'documentCreated'

export type DocumentAction<D, P> = IAction<IDocumentJSON<D>> | P

export abstract class Document<D, P extends IAction<any>>
implements IPubSub<DocumentAction<D, P>> {
  readonly type: string
  @observable meta: IDocumentMeta = {
    id: 'error',
    isPersisted: true
  }
  @observable data: D

  protected subject = new Subject<DocumentAction<D, P>>()
  private _storage: IStorage

  constructor(document: IDocumentJSON<D>) {
    this.type = document.type
    extendObservable(this.meta, document.meta || {})
    this.data = <any> observable(document.data)
  }

  get id() {
    return this.meta.id
  }

  set id(newID) {
    this.meta.id = newID
  }

  @computed get title() {
    return this.meta.title || 'Untitled Document'
  }

  setStorage(storage: IStorage) {
    this._storage = storage
  }

  setGroup(group) {
    this.meta.group = group
  }

  publish(action: DocumentAction<D, P>) {
    this.subject.next(action)
  }

  serialize(): IDocumentJSON<D> {
    return {
      type: this.type,
      meta: toJS(this.meta),
      data: toJS(this.data)
    }
  }

  async saveLocal() {
    if (!this.meta.isPersisted || !this._storage) { return }
    await this._storage.put('state', this.serialize())
  }

  async rehydrate() {
    if (!this.meta.isPersisted || !this._storage) { return }
    const state = await <any> this._storage.get('state')
    if (state) {
      extendObservable(this.meta, state.meta || {})
      extendObservable(this.data, state.data || {})
    }
    this.publish({ type: 'rehydrated' })
  }

  subscribe(handler: ActionHandler<DocumentAction<D, P>>) {
    return this.subject.subscribe((action) => {
      const observable = handler(action)
      if (observable) {
        observable.subscribe((action) => {
          this.publish(action)
        })
      }
    })
  }
}

export type AnyDocument = Document<any, any>
export type AnyDocumentJSON = IDocumentJSON<any>
