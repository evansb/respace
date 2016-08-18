import * as uuid from 'uuid'
import * as React from 'react'
import localforage from 'localforage'
import * as rs from '@respace/common'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import DocumentStore from './stores/document-store'
import UIStore from './stores/ui-store'
import App from './ui/app'
import { createStorage } from './storage'
import Dropzone from 'react-dropzone'

export interface IWorkspaceInitializer {
  components: rs.AnyComponentFactory[]
  documents: rs.AnyDocumentJSON[]
  layoutEngine: rs.ILayoutEngine
}

export class Workspace {
  private readonly _layoutView: React.ComponentClass<any>
  private readonly _layoutStore: rs.ILayoutStore
  private readonly _documentStore: DocumentStore
  private readonly _uiStore: UIStore
  private _storage: LocalForage
  private _sessionID: string

  static create(initializer: IWorkspaceInitializer) {
    initializer.components = initializer.components || []
    initializer.documents = initializer.documents || []
    return new Workspace(initializer)
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
          }),
          layoutStore: this._layoutStore
        }
        const Redbox = __DEV__ ? require('redbox-react').default : null
        const dropzoneStyle = {
          width: '100%',
          height: '100%',
          border: 'none'
        }
        const root = (
          <Dropzone style={dropzoneStyle}
                onDrop={(files) => this.handleDrop(files)} disableClick>
            <AppContainer errorReporter={Redbox}>
              <App {...appProps} />
            </AppContainer>
          </Dropzone>
        )
        render(root, container, async () => {
          this._uiStore.container = container
          await this.configureSession()

          const documentStorage = createStorage(this._storage, 'document')
          const uiStorage = createStorage(this._storage, 'ui')
          const layoutStorage = createStorage(this._storage, 'layout')

          await this._documentStore.rehydrate(documentStorage)
          await this._uiStore.rehydrate(uiStorage)
          await this._layoutStore.rehydrate(layoutStorage)

          await this._uiStore.start(this._documentStore)
          await this._documentStore.start()
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

  async configureSession() {
    let href = location.href.replace(location.hash, '')
    if (href.endsWith('#')) {
      href = href.substr(0, href.length - 1)
    }
    const sessionKey = href + '_session'
    localforage.config({
      name: 'respace'
    })
    let sessionID: string
    const previousSessionID = await localforage.getItem<string>(sessionKey)
    if (typeof previousSessionID === 'string') {
      sessionID = previousSessionID
    } else {
      sessionID = uuid.v4()
    }
    this._sessionID = sessionID
    await localforage.setItem<string>(sessionKey, sessionID)
    this._storage = localforage.createInstance({
      name: sessionID
    })
  }

  async handleDrop(files: File[]) {
    this._documentStore.dispatchAll('drop', files)
  }

  private constructor(initializer: IWorkspaceInitializer) {
    this._layoutStore = initializer.layoutEngine.createStore()
    this._layoutView = initializer.layoutEngine.view
    this._documentStore = new DocumentStore(initializer.documents)
    this._uiStore = new UIStore(initializer.components)
  }
}
