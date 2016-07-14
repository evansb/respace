import { AnyComponent } from '../component'

export class ComponentEvent {}

/**
 * Fired when a component is registered.
 */
export class ComponentRegistered extends ComponentEvent {
  constructor (public component: AnyComponent) {
    super()
  }
}

/**
 * Fired when a component is unregistered.
 */
export class ComponentUnregistered extends ComponentEvent {
  constructor (public component: AnyComponent) {
    super()
  }
}
