import { AnyDocument, IDocument } from './document'
import { IStorage } from './storage'
import * as events from './events'

export interface IStore<E> {
  rehydrate(storage: IStorage): Promise<{}>
  subscribe(callback: (event: E) => any)
}

export interface IDocumentStore extends IStore<events.DocumentEvent> {
  start(): Promise<void>
  destroy()
}

export interface ILayoutEngine {
  createStore: () => ILayoutStore
  view: __React.ComponentClass<any>
}

export interface IUIStore extends IStore<events.UIEvent> {
  // Constants
  SIDEBAR_MAX_WIDTH: number
  SIDEBAR_MIN_WIDTH: number

  // Dimension
  appWidth: number
  appHeight: number
  mainContentWidth: number
  sidebarWidth: number

  // Sidebar
  isSidebarToggled: boolean

  // Business Logic
  factories: AnyComponentFactory[]
  components: AnyComponent[]
  sidebarComponents: AnyComponent[]

  toggleSidebar(): void
  registerFactory(factory: AnyComponentFactory)
  start(documentStore: IDocumentStore): Promise<{}>
  getComponent(id: string): AnyComponent | undefined
  getFactory(name: string): AnyComponentFactory | undefined
  destroy()
}

export interface ILayoutStore {
  start(uiStore: IUIStore): Promise<{}>
  rehydrate(storage: IStorage): Promise<{}>
  addComponent(component: AnyComponent): void
  destroy()
}

export interface IComponent<D, S> {
  id: string
  isActive: boolean
  width: number
  height: number
  container: Element
  name: string
  displayName: string
  document: IDocument<D>
  state: S

  updateSize()
}

export interface IComponentProps<D, S> {
  id: string
  component: IComponent<D, S>
  uiStore: IUIStore
}

export interface IComponentFactory<D, S> {
  name: string
  displayName: string
  icon?: __React.ComponentClass<void>
  view?: __React.ComponentClass<IComponentProps<D, S>>
    |  __React.StatelessComponent<IComponentProps<D, S>>
  sidebarView?: __React.ComponentClass<IComponentProps<D, S>>
  didRegister?()
  didUnregister?()
  acceptDocument(document: AnyDocument): boolean
  createStore(document: IDocument<D>): S
}

export type AnyComponentFactory = IComponentFactory<any, any>

export type AnyComponentProps = IComponentProps<any, any>

export type AnyComponent = IComponent<any, any>
