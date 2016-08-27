import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { ObservableMap, map, observable, computed, action } from 'mobx'

import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/startWith'
import * as rs from '@respace/common'
import { Component } from '../component'
import wrapComponent from './wrapComponent'
import DocumentStore from './document-store'

export default class UIStore implements rs.IUIStore {
  SIDEBAR_MIN_WIDTH: number = 29
  SIDEBAR_MAX_WIDTH: number = 200

  @observable appWidth: number = 0
  @observable appHeight: number = 0
  @observable isSidebarToggled: boolean = true

  public container: HTMLElement
  private _events$: Subject<rs.IAction<any>>
  private _components: ObservableMap<rs.AnyComponent>
  private _sidebarComponents: ObservableMap<rs.AnyComponent>
  private _subscription: Subscription[] = []
  private _disposables: any[] = []
  private _registry: Map<string, rs.AnyComponentFactory>
  private _started: boolean = false
  private _documentStore: DocumentStore
  private _storage: rs.IStorage

  constructor(initialFactories: rs.AnyComponentFactory[]) {
    this._components = map<rs.AnyComponent>()
    this._sidebarComponents = map<rs.AnyComponent>()
    this._registry = new Map<string, rs.AnyComponentFactory>()
    initialFactories.forEach((f) => this.registerFactory(f))
  }

  registerFactory(factory: rs.AnyComponentFactory) {
    if (factory.view) {
      factory.view = wrapComponent(this, factory.view) as any
    }
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

  @computed get components(): rs.AnyComponent[] {
    return this._components.values()
  }

  @computed get sidebarComponents(): rs.AnyComponent[] {
    return this._sidebarComponents.values()
  }

  getComponent(id: string): rs.AnyComponent | undefined {
    return this._components.get(id)
  }

  getFactory(name: string): rs.AnyComponentFactory | undefined {
    return this._registry.get(name)
  }

  @action('ui.fitToContainer')
  fitToContainer() {
    this.appWidth = this.container.offsetWidth
    this.appHeight = this.container.offsetHeight
  }

  @action('ui.toggleSidebar')
  async toggleSidebar() {
    this.isSidebarToggled = !this.isSidebarToggled
    await this._storage.put('isSidebarToggled', this.isSidebarToggled)
  }

  publish(action: rs.IAction<any>) {
    this._events$.next(action)
  }

  subscribe(handler: rs.ActionHandler<any>) {
    return this._events$.subscribe((e) => {
      const reply = handler(e)
      if (reply) {
        reply.subscribe((r) => this._events$.next(r))
      }
    })
  }

  async rehydrate(storage: rs.IStorage) {
    this._storage = storage
    this.isSidebarToggled = await storage.get('isSidebarToggled',
      this.isSidebarToggled)
  }

  start(documentStore: DocumentStore) {
    if (this._started) { return }
    this._documentStore = documentStore
    this._events$ = new Subject<any>()
    this.startEmittingViewModelsEvents()
    this.startListeningDocumentStore()
    this.startListeningToDimensionChange()
    this._started = true
    this.fitToContainer()
  }

  onDocumentAdded(document: rs.AnyDocument, isInitial: boolean = false) {
    this._registry.forEach((factory) => {
      if (factory.acceptDocument(document)) {
        this.addComponent(factory, document, isInitial)
      }
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

  private startEmittingViewModelsEvents() {
    this._disposables.push(this._components.observe((changes) => {
      switch (changes.type) {
        case 'add':
          this._events$.next({
            type: 'componentCreated',
            payload: changes.newValue
          })
          break
        default:
      }
    }))
  }

  private startListeningDocumentStore() {
    const documentCreatedHandler: rs.ActionHandler<any> = (e) => {
      if (e.type === 'documentCreated') {
        const document = e.payload
        this.onDocumentAdded(document)
      }
      return undefined
    }
    const subscription = this._documentStore.subscribe(documentCreatedHandler)
    this._subscription.push(subscription)
  }

  private async addComponent<D extends rs.AnyDocument, S>(
    factory: rs.ComponentFactory<D, S>,
    document: D,
    isInitial: boolean
  ) {
    const id = document.meta.id + '.' + factory.name
    const storage = this._storage.createStorage(id)
    const component = new Component(
      id,
      factory.name,
      'Untitled',
      factory.displayName,
      document,
      factory.createStore(document),
      factory.extensions
    )

    await component.rehydrate(storage)

    if (factory.view) {
      this._components.set(id, component)
    }
  }
}
