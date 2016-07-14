import * as React from 'react'
import DocumentStore from '../stores/document-store'
import ComponentStore from '../stores/component-store'
import LayoutStore from '../stores/layout-store'

export interface Props {
  layoutStore: LayoutStore
  documentStore: DocumentStore,
  componentStore: ComponentStore
}

export default class App extends React.Component<Props, void> {
  render() {
    return <div>Hello everynyan!</div>
  }
}
