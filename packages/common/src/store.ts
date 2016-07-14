import { Subscription } from 'rxjs/Subscription'
import * as events from './events'

export type ILayoutStore = IStore<events.LayoutEvent>
export type IDocumentStore = IStore<events.DocumentEvent>
export type IComponentStore = IStore<events.ComponentEvent>

export interface IStore<E> {
  subscribe(next: (event: E) => any): Subscription
}
