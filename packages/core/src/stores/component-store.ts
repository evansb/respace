import * as uuid from 'uuid'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import { ObservableMap, map } from 'mobx'
import { events, IComponentStore,
  DocumentColor, InjectedProps, BasicProps, AnyDocument, IComponent,
  IDocumentStore, AnyComponent } from '@respace/common'

type ComponentEvent = events.ComponentEvent

export default class ComponentStore implements IComponentStore {
  viewModels: ObservableMap<InjectedProps & BasicProps>
  registry: ObservableMap<AnyComponent>
  private _events$: Subject<ComponentEvent>

  static create(components: AnyComponent[],
                documentStore: IDocumentStore) {
    const store = new ComponentStore(documentStore)
    components.forEach((c) => { store.register(c) })
    return store
  }

  register(component: AnyComponent) {
    this.registry.set(component.name, component)
  }

  unregister(component: AnyComponent) {
    this.registry.delete(component.name)
  }

  destroy() {
    this._events$.complete()
  }

  createViewModel<P extends BasicProps>(
    component: IComponent<P>,
    document: AnyDocument): void {
    const injected: InjectedProps = {
      document: document,
      color: document.meta.color || DocumentColor.Blue,
      componentStore: this,
      documentStore: this._documentStore
    }
    const props = <P & InjectedProps> Object.assign(injected,
      component.getInitialProps(document))
    if (component.component) {
      const id = uuid.v4()
      this.viewModels.set(id, props)
    }
  }

  subscribe(callback: (event: ComponentEvent) => any): Subscription {
    return this._events$.subscribe(callback)
  }

  private startEmittingViewModelsEvents(observer) {
    return this.viewModels.observe((changes) => {
      switch (changes.type) {
        case 'add':
          observer.next(new events.ViewModelAdded(
            changes.name,
            changes.newValue
          ))
          break
        default:
      }
    })
  }

  private startEmittingRegistryEvents(observer) {
    this.registry.observe((changes) => {
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
  }

  private startListeningDocumentStore(observer) {
    this._documentStore.subscribe((e: events.DocumentEvent) => {
      if (e instanceof events.DocumentAdded) {
        const document = e.document
        this.registry.forEach((component) => {
          if (component.shouldProcessDocument(document)) {
            this.createViewModel(component, document)
          }
        })
      }
    })
  }

  private constructor(private _documentStore: IDocumentStore) {
    this.viewModels = map<InjectedProps & BasicProps>()
    this.registry = map<AnyComponent>()
    this._events$ = Subject.create((observer) => {
      const dispose1 = this.startEmittingViewModelsEvents(observer)
      const dispose2 = this.startEmittingRegistryEvents(observer)
      const dispose3 = this.startListeningDocumentStore(observer)
      return () => dispose1() && dispose2() && dispose3()
    })
  }
}
