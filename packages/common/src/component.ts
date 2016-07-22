import { Observable } from 'rxjs/Observable'
import { AnyDocument } from './document'
import * as events from './events'

export interface IBasicProps {
  id: string
  name: string
  title: string
}

export interface IInjectedProps {
  uiEvents$: Observable<events.UIEvent>
  documentEvents$: Observable<events.DocumentEvent>
  document: AnyDocument
}

export interface IComponentProps extends IBasicProps, IInjectedProps {
}

export interface IComponentFactory<P extends IBasicProps> {
  name: string
  view?: __React.ComponentClass<P & IInjectedProps>
  sidebarView?: __React.ComponentClass<P & IInjectedProps>
  didRegister?()
  shouldProcessDocument(document: AnyDocument): boolean
  initialProps(document: AnyDocument): P
  didUnregister?()
}

export type AnyComponentFactory = IComponentFactory<any>
