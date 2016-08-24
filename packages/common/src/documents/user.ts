import uuid from 'uuid'
import { computed } from 'mobx'
import { Document } from '../document'

export interface IUser {
  name: string
  role?: string
  profilePicture?: string
  profileUrl?: string
}

export namespace Actions {
  export type All = Create
  export type Create = {
    type: 'create'
  }
}

export class User extends Document<IUser, Actions.All> {
  static type = 'user'
  constructor(data: { name: string, role?: string, profilePicture?: string,
      profileUrl?: string }) {
    super({ type: User.type, meta: { id: uuid.v4() }, data })
  }

  @computed get name() {
    return this.data.name
  }

  @computed get profilePicture() {
    return this.data.profilePicture || 'javascript:;'
  }

  @computed get profileUrl() {
    return this.data.profileUrl || 'javascript:;'
  }

  @computed get role() {
    return this.data.role || 'Unknown'
  }
}

export function createAnonymousUser(): User {
  return new User({ name: 'Anonymous' })
}
