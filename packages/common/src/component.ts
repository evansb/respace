import { Subscription } from 'rxjs/Subscription'
import { AnyDocument, IDocument } from './document'
import * as events from './events'

export interface IBasicProps {
  title: string
}

export interface IInjectedProps<D> {
  id: string
  name: string
  displayName: string
  document: IDocument<D>
  subscribeUIStore(cb: (e: events.UIEvent) => any): Subscription
  subscribeDocumentStore(cb: (e: events.DocumentEvent) => any): Subscription
}

export interface IComponentProps extends IBasicProps, IInjectedProps<any> {
}

export interface IComponentFactory<P extends IBasicProps, D> {
  name: string
  displayName: string
  view?: __React.ComponentClass<P & IInjectedProps<D>>
    |  __React.StatelessComponent<P & IInjectedProps<D>>
  sidebarView?: __React.ComponentClass<P & IInjectedProps<D>>
  didRegister?()
  shouldProcessDocument(document: AnyDocument): boolean
  initialProps(document: IDocument<D>): P
  didUnregister?()
}

export type AnyComponentFactory = IComponentFactory<any, any>
