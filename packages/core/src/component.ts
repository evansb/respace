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
    public document: IDocument<D>) {
    this.displayName = displayName
    this.title = title
  }

  async rehydrate(storage: IStorage) {
    this.isActive = await storage.get('isActive', this.isActive)
    this.title = await storage.get('title', this.title)
    autorun(() => {
      this.save(storage)
    })
  }

  save(storage: IStorage) {
    storage.put('displayName', this.displayName)
    storage.put('isActive', this.isActive)
    storage.put('title', this.title)
  }
}
