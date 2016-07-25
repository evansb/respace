import { autorun, observable } from 'mobx'
import { IComponentProps, IDocument, IStorage } from '@respace/common'

export class ComponentProps<D> implements IComponentProps<D> {
  @observable isActive = false
  @observable displayName: string
  @observable title: string

  constructor(
    public id: string,
    public name: string,
    title: string,
    displayName: string,
    public document: IDocument<D>
   ) {
    this.displayName = displayName
    this.title = title
  }

  async rehydrate(storage: IStorage) {
    const state = <this> (await storage.get('state'))
    if (state) {
      this.isActive = state.isActive || this.isActive
      this.title = state.title || this.title
      this.displayName = state.displayName || this.displayName
    }
    autorun(() => {
      this.save(storage)
    })
  }

  save(storage: IStorage) {
    storage.put('state', {
      title: this.title,
      displayName: this.displayName,
      isActive: this.isActive
    })
  }
}
