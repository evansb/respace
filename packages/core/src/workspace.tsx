import * as React from 'react'
import { observer } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import AppState from './app-state'
import DocumentStore from './stores/document-store'
import ComponentStore from './stores/component-store'
import Root from './ui/root'

/**
 * Respace workspace.
 */
export class Workspace {
  private _layout: React.ComponentClass<any>
  private _appState: AppState
  private readonly _documentStore: DocumentStore
  private readonly _componentStore: ComponentStore

  static create({ components, documents, layout }) {
    return new Workspace({ components, documents, layout })
  }

  rehydrate(): this {
    return this
  }

  async destroy() {
    return Promise.resolve()
  }

  async render(container: HTMLElement) {
    const props = {
      appState: this._appState,
      componentStore: this._componentStore,
      documentStore: this._documentStore,
    }
    const layoutManager = React.createElement(this._layout, props)
    this._appState.container = container
    return new Promise((resolve, reject) => {
      try {
        const doRender = (Root) => {
          const Redbox = __DEV__ ? require('redbox-react').default : null
          const root = (
            <AppContainer errorReporter={Redbox}>
              <Root layoutManager={layoutManager} {...props} />
            </AppContainer>
          )
          render(root, container, () => {
            this._documentStore.start()
            this._appState.listenToResize()
            resolve()
          })
        }
        doRender(Root)
        if (module.hot) {
          module.hot.accept('./ui/root', () => {
            const NewRoot = require('./ui/root').default
            doRender(NewRoot)
          })
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  private constructor({ components, documents, layout }) {
    this._layout = observer(layout)
    this._appState = new AppState()
    this._documentStore = DocumentStore.create(documents || [])
    this._componentStore = ComponentStore.create(components || [],
      this._documentStore)
  }
}
