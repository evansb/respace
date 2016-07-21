import { IDocumentStore, IComponentStore } from './store'
import { AnyDocument, DocumentColor } from './document'

export interface BasicProps {
  id: string
  name: string
  title: string
}

export interface InjectedProps {
  document: AnyDocument
  componentStore: IComponentStore
  documentStore: IDocumentStore
  color: DocumentColor
}

export interface IComponent<P extends BasicProps> {
  name: string
  component?: __React.ComponentClass<P & InjectedProps>
  sidebarComponent?: __React.ComponentClass<P & InjectedProps>
  componentDidRegister?()
  shouldProcessDocument(document: AnyDocument): boolean
  getInitialProps(document: AnyDocument): P
  componentDidUnregister?()
}

export type AnyComponent = IComponent<any>
