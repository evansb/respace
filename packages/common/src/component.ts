import { AnyDocument, IDocument } from './document'

export interface IBasicProps {
  title: string
}

export interface IComponentProps<D> extends IBasicProps {
  id: string
  isActive: boolean
  name: string
  displayName: string
  document: IDocument<D>
}

export interface IComponentFactory<P extends IBasicProps, D> {
  name: string
  displayName: string
  icon?: __React.ComponentClass<void>
  view?: __React.ComponentClass<P & IComponentProps<D>>
    |  __React.StatelessComponent<P & IComponentProps<D>>
  sidebarView?: __React.ComponentClass<P & IComponentProps<D>>
  didRegister?()
  shouldProcessDocument(document: AnyDocument): boolean
  initialProps(document: IDocument<D>): P
  didUnregister?()
}

export type AnyComponentFactory = IComponentFactory<any, any>
export type AnyComponentProps = IComponentProps<any>
