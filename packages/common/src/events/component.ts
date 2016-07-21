import { AnyComponent, BasicProps, InjectedProps } from '../component'

export class ComponentEvent {}

export class ComponentRegistered extends ComponentEvent {
  constructor (public component: AnyComponent) {
    super()
  }
}

export class ComponentUnregistered extends ComponentEvent {
  constructor (public component: AnyComponent) {
    super()
  }
}

export class ViewModelAdded<P extends BasicProps> extends ComponentEvent {
  constructor (public id: string, public props: P & InjectedProps) {
    super()
  }
}

