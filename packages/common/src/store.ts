import { AnyComponentFactory, IComponentProps } from './component'
import * as events from './events'

export interface IStore<E> {
  subscribe(callback: (event: E) => any)
}

export interface IDocumentStore extends IStore<events.DocumentEvent> {
}

export interface IUIStore extends IStore<events.UIEvent> {
  // Dimension
  appWidth: number
  appHeight: number
  mainContentWidth: number
  sidebarWidth: number

  // Sidebar
  isSidebarToggled: boolean

  // Business Logic
  components: IComponentProps[]
  sidebarComponents: IComponentProps[]

  toggleSidebar(): void
  registerFactory(factory: AnyComponentFactory)
}
