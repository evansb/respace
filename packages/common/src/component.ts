import { Subscription } from 'rxjs/Subscription'
import { AnyDocument, IDocument } from './document'
import * as events from './events'

export interface IBasicProps {
  id: string
  name: string
  title: string
}

export interface IInjectedProps<D> {
  document: IDocument<D>
  subscribeUIStore(cb: (e: events.UIEvent) => any): Subscription
  subscribeDocumentStore(cb: (e: events.DocumentEvent) => any): Subscription
}

export interface IComponentProps extends IBasicProps, IInjectedProps<any> {
}

export interface IComponentFactory<P extends IBasicProps, D> {
  name: string
  view?: __React.ComponentClass<P & IInjectedProps<D>>
  sidebarView?: __React.ComponentClass<P & IInjectedProps<D>>
  didRegister?()
  shouldProcessDocument(document: AnyDocument): boolean
  initialProps(document: IDocument<D>): P
  didUnregister?()
}

export type AnyComponentFactory = IComponentFactory<any, any>
