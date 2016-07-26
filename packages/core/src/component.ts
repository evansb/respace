import { autorun, observable, action } from 'mobx'
import { IComponent, IDocument, IStorage } from '@respace/common'

export class Component<D, S> implements IComponent<D, S> {
  @observable isActive = false
  @observable displayName: string
  @observable title: string
  @observable width = 0
  @observable height = 0
  container: HTMLElement

  constructor(
    public id: string,
    public name: string,
    title: string,
    displayName: string,
    public document: IDocument<D>,
    public state: S
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

  @action('updateSize')
  updateSize() {
    if (this.container) {
      this.width = this.container.offsetWidth
      this.height = this.container.offsetHeight
    }
  }
}
