import * as React from 'react'
import * as tv4 from 'tv4'
import { observer } from 'mobx-react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import DocumentStore from './stores/document-store'
import UIStore from './stores/ui-store'
import App from './ui/app'

export class Workspace {
  private _layoutManager: React.ComponentClass<any>
  private readonly _documentStore: DocumentStore
  private readonly _uiStore: UIStore

  static create({ layoutManager }) {
    return new Workspace({ layoutManager })
  }

  async render(container: HTMLElement) {
    return new Promise((resolve, reject) => {
      const renderApp = (App) => {
        const appProps = {
          uiStore: this._uiStore,
          documentStore: this._documentStore,
          layoutManager: React.createElement(this._layoutManager)
        }
        const Redbox = __DEV__ ? require('redbox-react').default : null
        const root = (
          <AppContainer errorReporter={Redbox}>
            <App {...appProps} />
          </AppContainer>
        )
        render(root, container, () => {
          this._uiStore.start(container)
          this._documentStore.start()
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

  private constructor({ layoutManager }) {
    this._layoutManager = observer(layoutManager)
    this._documentStore = DocumentStore.create()
    this._uiStore = UIStore.create(this._documentStore)
  }
}
