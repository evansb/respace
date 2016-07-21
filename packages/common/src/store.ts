import { Subscription } from 'rxjs/Subscription'
import * as events from './events'

export interface IDocumentStore extends IStore<events.DocumentEvent> {
}

export interface IComponentStore extends IStore<events.ComponentEvent> {
}

export interface IStore<E> {
  subscribe(next: (event: E) => any): Subscription
}
