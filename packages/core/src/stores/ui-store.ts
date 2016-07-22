import * as uuid from 'uuid'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable'
import { ObservableMap, map, observable, computed, action } from 'mobx'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/operator/debounceTime'

import * as rs from '@respace/common'

export default class UIStore implements rs.IUIStore {
  static SIDEBAR_ACTIVE_WIDTH: number = 200
  static SIDEBAR_INACTIVE_WIDTH: number = 47

  @observable appWidth: number = 0
  @observable appHeight: number = 0
  @observable isSidebarToggled: boolean = true

  private _events$: Observable<rs.events.UIEvent>
  private _components: ObservableMap<rs.IComponentProps>
  private _sidebarComponents: ObservableMap<rs.IComponentProps>
  private _subscription: Subscription[] = []
  private _disposables: any[] = []
  private _registry: ObservableMap<rs.AnyComponentFactory>
  private _started: boolean = false

  static create(documentStore: rs.IDocumentStore) {
    const store = new UIStore(documentStore)
    return store
  }

  registerFactory(factory: rs.AnyComponentFactory) {
    this._registry.set(factory.name, factory)
    if (typeof factory.didRegister === 'function') {
      factory.didRegister()
    }
  }

  unregisterFactory(factory: rs.AnyComponentFactory) {
    this._registry.delete(factory.name)
    if (typeof factory.didUnregister === 'function') {
      factory.didUnregister()
    }
  }

  @computed get mainContentWidth() {
    if (this.isSidebarToggled) {
      return this.appWidth - UIStore.SIDEBAR_ACTIVE_WIDTH
    } else {
      return this.appWidth - UIStore.SIDEBAR_INACTIVE_WIDTH
    }
  }

  @computed get sidebarWidth() {
    if (this.isSidebarToggled) {
      return UIStore.SIDEBAR_ACTIVE_WIDTH
    } else {
      return UIStore.SIDEBAR_INACTIVE_WIDTH
    }
  }

  @computed get components(): rs.IComponentProps[] {
    return this._components.values()
  }

  @computed get sidebarComponents(): rs.IComponentProps[] {
    return this._sidebarComponents.values()
  }

  @action('ui:fitToContainer')
  fitTo(container: HTMLElement) {
    const width = container.offsetWidth
    const height = container.offsetHeight
    if (width !== this.appWidth || height !== this.appHeight) {
      this.appWidth = container.offsetWidth
      this.appHeight = container.offsetHeight
    }
  }

  @action('ui:toggleSidebar')
  toggleSidebar() {
    this.isSidebarToggled = !this.isSidebarToggled
  }

  subscribe(cb: (e: rs.events.UIEvent) => any): Subscription {
    return this._events$.subscribe(cb)
  }

  start(container: HTMLElement) {
    if (this._started) { return }
    const resize$ = Observable.fromEvent(window, 'resize').debounceTime(50)
    const subscription = resize$.subscribe(() => { this.fitTo(container) })
    this._subscription.push(subscription)
    this._started = true
    this.fitTo(container)
  }

  destroy() {
    this._subscription.forEach((s) => s.unsubscribe())
  }

  private startEmittingViewModelsEvents(observer) {
    return this._components.observe((changes) => {
      switch (changes.type) {
        case 'add':
          observer.next(new rs.events.ComponentAdded(
            changes.name,
            changes.newValue
          ))
          break
        default:
      }
    })
  }

  private startEmittingRegistryEvents(observer) {
    return this._registry.observe((changes) => {
      switch (changes.type) {
        case 'add':
          observer.next(new rs.events.FactoryRegistered(changes.newValue))
          break
        case 'delete':
          observer.next(new rs.events.FactoryUnregistered(changes.newValue))
          break
        default:
      }
    })
  }

  private startListeningDocumentStore(observer) {
    return this._documentStore.subscribe((e) => {
      if (e instanceof rs.events.DocumentAdded) {
        const document = e.document
        this._registry.forEach((factory) => {
          if (factory.shouldProcessDocument(document)) {
            this.addComponent(factory, document)
          }
        })
      }
    })
  }

  private addComponent<P extends rs.IBasicProps, D>(
    factory: rs.IComponentFactory<P, D>,
    document: rs.AnyDocument) {

    const injectedProps: rs.IInjectedProps<D> = {
      document: document as rs.IDocument<D>,
      subscribeDocumentStore: this._documentStore.subscribe.bind(
        this._documentStore),
      subscribeUIStore: this.subscribe.bind(this),
    }

    const componentProps = <rs.IComponentProps> Object.assign(
      injectedProps,
      factory.initialProps(document)
    )

    const id = uuid.v4()
    if (factory.view) {
      this._components.set(id, componentProps)
    } else if (factory.sidebarView) {
      this._sidebarComponents.set(id, componentProps)
    }
  }

  private constructor(private _documentStore: rs.IDocumentStore) {
    this._components = map<rs.IComponentProps>()
    this._sidebarComponents = map<rs.IComponentProps>()
    this._registry = map<rs.AnyComponentFactory>()
    this._events$ = Observable.create((observer) => {
      const dispose1 = this.startEmittingViewModelsEvents(observer)
      const dispose2 = this.startEmittingRegistryEvents(observer)
      const subscription = this.startListeningDocumentStore(observer)
      this._disposables.push(dispose1, dispose2)
      this._subscription.push(subscription)
    })
  }
}
