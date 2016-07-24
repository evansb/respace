import { AnyComponentFactory, AnyComponentProps } from './component'
import * as events from './events'

export interface IStore<E> {
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
  isSidebarAnimating: boolean

  // Business Logic
  factories: AnyComponentFactory[]
  components: AnyComponentProps[]
  sidebarComponents: AnyComponentProps[]

  toggleSidebar(): void
  registerFactory(factory: AnyComponentFactory)
  start(documentStore: IDocumentStore): Promise<{}>
  destroy()
}

export interface ILayoutStore {
  start(uiStore: IUIStore): Promise<{}>
  addComponent(component: AnyComponentProps): void
  destroy()
}
