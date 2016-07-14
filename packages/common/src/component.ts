import { ILayoutStore, IDocumentStore } from './store'
import { AnyDocument } from './document'

export interface BasicProps {
  title: string
}

export interface InjectedProps {
  document: AnyDocument
  layoutStore: ILayoutStore
  documentStore: IDocumentStore
  color: string
}

export interface IComponentLifecycle<P extends BasicProps> {
  /**
   * Called when the component is registered to a workspace.
   */
  rsComponentDidRegister?()

  /**
   * Returns whether a document
   */
  rsShouldProcessDocument(document: AnyDocument): boolean

  /**
   * Compute initial props from document
   */
  rsInitialComponentProps(document: AnyDocument): P

  /**
   * Called when the component is registered to a workspace.
   */
  rsComponentDidUnregister?()
}

export interface IComponent<P extends BasicProps>
extends IComponentLifecycle<P> {
  name: string

  component: __React.ComponentClass<P & InjectedProps>
}

export type AnyComponent = IComponent<any>
