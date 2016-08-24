import { IPubSub } from './action'
import { AnyComponent, AnyComponentFactory } from './component'

export interface IUIStore extends IPubSub<any> {
  getComponent(id: string): AnyComponent | undefined
  getFactory(name: string): AnyComponentFactory | undefined
}
