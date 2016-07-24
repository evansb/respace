import * as React from 'react'
import * as rs from '@respace/common'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import DocumentStore from './stores/document-store'
import UIStore from './stores/ui-store'
import App from './ui/app'

export class Workspace {
  private readonly _layoutView: React.ComponentClass<any>
  private readonly _layoutStore: rs.ILayoutStore
  private readonly _documentStore: DocumentStore
  private readonly _uiStore: UIStore

  static create(layoutEngine: rs.ILayoutEngine) {
    return new Workspace(layoutEngine)
  }

  use(...factories: rs.AnyComponentFactory[]) {
    factories.forEach(factory => {
      this._uiStore.registerFactory(factory)
    })
  }

  addDocument(...documents: rs.AnyDocument[]) {
    documents.forEach(document => {
      this._documentStore.addDocument(document)
    })
  }

  async render(container: HTMLElement) {
    return new Promise((resolve, reject) => {
      const renderApp = (App) => {
        const appProps = {
          uiStore: this._uiStore,
          documentStore: this._documentStore,
          layoutManager: React.createElement(this._layoutView, {
            layoutStore: this._layoutStore
          })
        }
        const Redbox = __DEV__ ? require('redbox-react').default : null
        const root = (
          <AppContainer errorReporter={Redbox}>
            <App {...appProps} />
          </AppContainer>
        )
        render(root, container, async () => {
          this._uiStore.container = container
          await this._documentStore.start()
          await this._uiStore.start(this._documentStore)
          await this._layoutStore.start(this._uiStore)
          resolve()
        })
      }

      try {
        renderApp(App)
        if (module.hot) {
          module.hot.accept('./ui/app', () => {
            const NewApp = require('./ui/app').default
            renderApp(NewApp)
          })
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  private constructor(layoutEngine: rs.ILayoutEngine) {
    this._layoutStore = layoutEngine.createStore()
    this._layoutView = layoutEngine.view
    this._documentStore = new DocumentStore()
    this._uiStore = new UIStore()
  }
}
