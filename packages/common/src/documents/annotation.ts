import uuid from 'uuid'
import { computed, ObservableMap } from 'mobx'
import { IUser, User, createAnonymousUser } from './user'
import { Document, IDocumentJSON } from '../document'

export interface IAnnotation {
  author: IUser
  createdAt: Date
  value: string
}

export interface IAnnotations {
  annotations: {
    [id: string]: IAnnotation
  }
}

export namespace Actions {
  export type All = Create
  export type Create = {
    type: 'create'
    payload: {
      value: string
    }
  }
}

export class Annotations
extends Document<IAnnotations, Actions.All> {
  static type = 'annotations'

  author: User = createAnonymousUser()

  private _annotations = new ObservableMap<IAnnotation>()

  constructor(json: IDocumentJSON<IAnnotations>) {
    super(json)
    const annotations = json.data.annotations || {}
    for (let key of Object.keys(annotations)) {
      if (annotations.hasOwnProperty(key)) {
        this._annotations.set(key, annotations[key])
      }
    }
  }

  create(value: string) {
    const id = uuid.v4()
    this._annotations.set(id, {
      author: this.author,
      createdAt: new Date(),
      value
    })
  }

  @computed get all() {
    return this._annotations.values()
  }
}
