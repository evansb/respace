import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable'

export interface IAction<T> {
  type: string
  payload?: T
}

export type AnyAction = IAction<any>

export type ActionHandler<A extends IAction<any>> =
  (action: A) => Observable<A> | undefined

export interface IPubSub<A extends IAction<any>> {
  publish(action: A)
  subscribe(handler: ActionHandler<A>): Subscription
}
