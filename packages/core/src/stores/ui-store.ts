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
import { ComponentProps } from '../component'

export default class UIStore implements rs.IUIStore {
  SIDEBAR_MIN_WIDTH: number = 29
  SIDEBAR_MAX_WIDTH: number = 200

  @observable appWidth: number = 0
  @observable appHeight: number = 0
  @observable isSidebarToggled: boolean = true
  @observable isSidebarAnimating: boolean = true

  public container: HTMLElement
  private _events$: Observable<rs.events.UIEvent>
  private _components: ObservableMap<rs.AnyComponentProps>
  private _sidebarComponents: ObservableMap<rs.AnyComponentProps>
  private _subscription: Subscription[] = []
  private _disposables: any[] = []
  private _registry: Map<string, rs.AnyComponentFactory>
  private _started: boolean = false
  private _documentStore: rs.IDocumentStore
  private _storage: rs.IStorage

  constructor(private _initialFactories: rs.AnyComponentFactory[]) {
    this._components = map<rs.AnyComponentProps>()
    this._sidebarComponents = map<rs.AnyComponentProps>()
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

  @computed get components(): rs.AnyComponentProps[] {
    return this._components.values()
  }

  @computed get sidebarComponents(): rs.AnyComponentProps[] {
    return this._sidebarComponents.values()
  }

  @action('ui:fitToContainer')
  fitToContainer() {
    this.appWidth = this.container.offsetWidth
    this.appHeight = this.container.offsetHeight
  }

  @action('ui:toggleSidebar')
  async toggleSidebar() {
    this.isSidebarAnimating = true
    this.isSidebarToggled = !this.isSidebarToggled
    await this._storage.put('isSidebarToggled', this.isSidebarToggled)
  }

  subscribe(cb: (e: rs.events.UIEvent) => any): Subscription {
    return this._events$.subscribe(cb)
  }

  async rehydrate(storage: rs.IStorage) {
    this._storage = storage
    this.isSidebarToggled = await storage.get('isSidebarToggled',
      this.isSidebarToggled)
  }

  start(documentStore: rs.IDocumentStore) {
    return new Promise((resolve, reject) => {
      if (this._started) { resolve() }
      this._documentStore = documentStore
      this._events$ = Observable.create((observer) => {
        const dispose1 = this.startEmittingViewModelsEvents(observer)
        this._disposables.push(dispose1)
      })
      this.startListeningDocumentStore()
      this.startListeningToDimensionChange()
      this._started = true
      this.fitToContainer()
      this._initialFactories.forEach((f) => this.registerFactory(f))
      resolve()
    })
  }

  destroy() {
    this._subscription.forEach((s) => s.unsubscribe())
  }

  private startListeningToDimensionChange() {
    const resize$ = Observable.combineLatest(
      Observable.fromEvent(window, 'resize').debounceTime(100),
      Observable.interval(1000)
    )

    this._subscription.push(resize$.subscribe(() => {
      const width = this.container.offsetWidth
      const height = this.container.offsetHeight
      if (width !== this.appWidth || height !== this.appHeight) {
        this.fitToContainer()
      }
    }))
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

  private startListeningDocumentStore() {
    this._subscription.push(this._documentStore.subscribe((e) => {
      if (e instanceof rs.events.DocumentAdded) {
        const document = e.document
        this._registry.forEach((factory) => {
          if (factory.shouldProcessDocument(document)) {
            this.addComponent(factory, document)
            console.log('here')
          }
        })
      }
    }))
  }

  private async addComponent<P extends rs.IBasicProps, D>(
    factory: rs.IComponentFactory<P, D>,
    document: rs.AnyDocument) {

    const id = document.meta.id + '.' + factory.name

    const props = factory.initialProps(document)

    const storage = this._storage.createStorage(id)

    const componentProps = new ComponentProps(
      id,
      factory.name,
      props.title,
      factory.displayName,
      document as rs.IDocument<D>,
    )

    await componentProps.rehydrate(storage)

    const finalProps = <rs.IComponentProps<D> & P> Object.assign(
      componentProps, props
    )

    if (factory.view) {
      this._components.set(id, finalProps)
    } else if (factory.sidebarView) {
      this._sidebarComponents.set(id, finalProps)
    }
  }
}
