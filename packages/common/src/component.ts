import React from 'react'
import { IPubSub } from './action'
import { AnyDocument, Document } from './document'

/**
 * Concrete component created by [[ComponentFactory]]
 */
export interface IComponent<D extends Document<any, any>, S> {
  id: string
  isActive: boolean
  container: Element
  name: string
  displayName: string
  document: D
  store: S
}

/**
 * Props passed to component view
 */
export interface IComponentProps<D extends Document<any, any>, S> {
  id: string
  component: IComponent<D, S>
  uiStore: IPubSub<any>
}

/**
 * Component extension points
 */
export type ComponentExtensions<D extends Document<any, any>> = {
  [name: string]: ComponentFactory<D, any>
}

/**
 * Component view
 */
export type ComponentView<D extends Document<any, any>, S> =
    React.ComponentClass<IComponentProps<D, S>>
  | React.StatelessComponent<IComponentProps<D, S>>

/**
 * Creates component
 */
export abstract class ComponentFactory<D extends Document<any, any>, S> {
  name: string
  view: ComponentView<D, S>
  icon: __React.ComponentClass<void>
  displayName: string

  constructor(public extensions: ComponentExtensions<D> = {}) {
  }

  didRegister() {
    return
  }
  didUnregister() {
    return
  }

  abstract acceptDocument(document: AnyDocument): boolean
  abstract createStore(document: D): S
}

// Handy type aliases
export type AnyComponentFactory = ComponentFactory<any, any>
export type AnyComponentProps = IComponentProps<any, any>
export type AnyComponent = IComponent<any, any>
