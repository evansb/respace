import { observable } from 'mobx'
import { IComponentProps, IDocument } from '@respace/common'

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
}
