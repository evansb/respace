/// <reference path='../typings/index.d.ts' />
import * as schema from './schema'
export * from './document'
export * from './component'
export * from './store'
import * as events from './events'

export { schema, events }

export interface IAppState {
  width: number
  height: number
  sidebarToggled: boolean
  mainContentWidth: number
  sidebarWidth: number
  toggleSidebar(): void
}

