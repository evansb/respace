import { AnyComponentFactory, AnyComponentProps } from '../component'

export class UIEvent {}

export class DimensionChanged extends UIEvent {
  constructor(public width: number, public height: number) {
    super()
  }
}

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
  constructor (public id: string, public props: AnyComponentProps) {
    super()
  }
}

