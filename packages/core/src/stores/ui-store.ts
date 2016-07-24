import * as uuid from 'uuid'
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable'
import { ObservableMap, map, observable, computed, action } from 'mobx'
import { observer } from 'mobx-react'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/startWith'

import * as rs from '@respace/common'

export default class UIStore implements rs.IUIStore {
  SIDEBAR_MIN_WIDTH: number = 29
  SIDEBAR_MAX_WIDTH: number = 200

  @observable appWidth: number = 0
  @observable appHeight: number = 0
  @observable isSidebarToggled: boolean = true
  @observable isSidebarAnimating: boolean = true

  public container: HTMLElement
  private _events$: Observable<rs.events.UIEvent>
  private _components: ObservableMap<rs.IComponentProps>
  private _sidebarComponents: ObservableMap<rs.IComponentProps>
  private _subscription: Subscription[] = []
  private _disposables: any[] = []
  private _registry: Map<string, rs.AnyComponentFactory>
  private _started: boolean = false
  private _documentStore: rs.IDocumentStore

  constructor() {
    this._components = map<rs.IComponentProps>()
    this._sidebarComponents = map<rs.IComponentProps>()
    this._registry = new Map<string, rs.AnyComponentFactory>()
  }

  registerFactory(factory: rs.AnyComponentFactory) {
    this._registry.set(factory.name, factory)
    if (factory.view) {
      factory.view = observer(factory.view as __React.StatelessComponent<any>)
    }
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

  get factories(): rs.AnyComponentFactory[] {
    const result: rs.AnyComponentFactory[] = []
    for (const value of this._registry.values()) {
      result.push(value)
    }
    return result
  }

  @computed get mainContentWidth() {
    return this.appWidth - this.sidebarWidth
  }

  @computed get sidebarWidth() {
    if (this.isSidebarToggled) {
      return this.SIDEBAR_MAX_WIDTH
    } else {
      return this.SIDEBAR_MIN_WIDTH
    }
  }

  @computed get components(): rs.IComponentProps[] {
    return this._components.values()
  }

  @computed get sidebarComponents(): rs.IComponentProps[] {
    return this._sidebarComponents.values()
  }

  @action('ui:fitToContainer')
  fitToContainer() {
    this.appWidth = this.container.offsetWidth
    this.appHeight = this.container.offsetHeight
  }

  @action('ui:toggleSidebar')
  toggleSidebar() {
    this.isSidebarAnimating = true
    this.isSidebarToggled = !this.isSidebarToggled
  }

  subscribe(cb: (e: rs.events.UIEvent) => any): Subscription {
    return this._events$.subscribe(cb)
  }

  start(documentStore: rs.IDocumentStore) {
    return new Promise((resolve, reject) => {
      if (this._started) { resolve() }
      this._documentStore = documentStore
      this._events$ = Observable.create((observer) => {
        const dispose1 = this.startEmittingViewModelsEvents(observer)
        const subscription1 = this.startListeningDocumentStore(observer)
        const subscription2 = this.startListeningToDimensionChange(observer)
        this._disposables.push(dispose1)
        this._subscription.push(subscription1, subscription2)
      })
      this._started = true
      this.fitToContainer()
      resolve()
    })
  }

  destroy() {
    this._subscription.forEach((s) => s.unsubscribe())
  }

  private startListeningToDimensionChange(observer) {
    const resize$ = Observable.combineLatest(
      Observable.fromEvent(window, 'resize').debounceTime(100),
      Observable.interval(1000)
    )

    return resize$.subscribe(() => {
      const width = this.container.offsetWidth
      const height = this.container.offsetHeight
      if (width !== this.appWidth || height !== this.appHeight) {
        this.fitToContainer()
      }
    })
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

    const id = uuid.v4()

    const injectedProps: rs.IInjectedProps<D> = {
      id,
      name: factory.name,
      document: document as rs.IDocument<D>,
      subscribeDocumentStore: this._documentStore.subscribe.bind(
        this._documentStore),
      subscribeUIStore: this.subscribe.bind(this),
    }

    const componentProps = <rs.IComponentProps> Object.assign(
      injectedProps,
      factory.initialProps(document)
    )

    if (factory.view) {
      this._components.set(id, componentProps)
    } else if (factory.sidebarView) {
      this._sidebarComponents.set(id, componentProps)
    }
  }
}
