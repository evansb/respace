import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import { ObservableMap, map } from 'mobx'
import { events, IComponentStore, AnyComponent } from '@respace/common'

type ComponentEvent = events.ComponentEvent

export default class ComponentStore implements IComponentStore {
  private _events$: Subject<ComponentEvent>
  private _components: ObservableMap<AnyComponent>

  constructor() {
    this._components = map<AnyComponent>()
    this._events$ = Subject.create((observer) => {
      this._components.observe((changes) => {
        switch (changes.type) {
          case 'add':
            observer.next(new events.ComponentRegistered(changes.newValue))
            break
          case 'delete':
            observer.next(new events.ComponentUnregistered(changes.newValue))
            break
          default:
        }
      })
    })
  }

  register(component: AnyComponent) {
    this._components.set(component.name, component)
  }

  unregister(component: AnyComponent) {
    this._components.delete(component.name)
  }

  subscribe(callback: (event: ComponentEvent) => any): Subscription {
    return this._events$.subscribe(callback)
  }
}
