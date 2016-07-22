import { AnyComponentFactory, IComponentProps } from '../component'

export class UIEvent {}

export class FactoryRegistered extends UIEvent {
  constructor (public factory: AnyComponentFactory) {
    super()
  }
}

export class FactoryUnregistered extends UIEvent {
  constructor (public factory: AnyComponentFactory) {
    super()
  }
}

export class ComponentAdded extends UIEvent {
  constructor (public id: string, public props: IComponentProps) {
    super()
  }
}

