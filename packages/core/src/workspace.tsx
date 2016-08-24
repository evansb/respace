import * as uuid from 'uuid'
import * as React from 'react'
import * as rs from '@respace/common'
import Dropzone from 'react-dropzone'
import localforage from 'localforage'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import MainLayout from './ui/main-layout'
import LayoutStore from './stores/layout-store'
import DocumentStore from './stores/document-store'
import UIStore from './stores/ui-store'
import App from './ui/app'
import { createStorage } from './storage'

export interface IWorkspaceInitializer {
  components: rs.AnyComponentFactory[]
  documents: rs.AnyDocument[]
}

export class Workspace {
  private readonly _layoutStore: LayoutStore
  private readonly _documentStore: DocumentStore
  private readonly _uiStore: UIStore
  private _storage: LocalForage
  private _sessionID: string

  static create(init: IWorkspaceInitializer) {
    init.components = init.components || []
    init.documents = init.documents || []
    return new Workspace(init)
  }

  async render(container: HTMLElement) {
    await this.renderApp(container)
    if (module.hot) {
      module.hot.accept('./ui/app', () => {
        const NewApp = require('./ui/app').default
        this.renderApp(container, NewApp)
      })
    }
  }

  async configureSession() {
    let href = location.href.replace(location.hash, '')
    if (href.endsWith('#')) {
      href = href.substr(0, href.length - 1)
    }
    const version: string[] = require('../package.json').version.split('.')
    version.pop()
    const majorVersion = version.join('.')
    const sessionKey = `${href}.${majorVersion}.session`
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
    this._documentStore.publish({
      type: 'drop',
      payload: files
    })
  }

  private createAppProps() {
    return {
      uiStore: this._uiStore,
      documentStore: this._documentStore,
      layoutManager: <MainLayout layoutStore={this._layoutStore} />,
      layoutStore: this._layoutStore
    }
  }

  private async renderApp(container: HTMLElement, AppView = App) {
    const appProps = this.createAppProps()
    const Redbox = __DEV__ ? require('redbox-react').default : null
    const dropzoneStyle = {
      width: '100%',
      height: '100%',
      border: 'none'
    }
    const application = (
      <Dropzone style={dropzoneStyle}
            onDrop={(files) => this.handleDrop(files)} disableClick>
        <AppContainer errorReporter={Redbox}>
          <AppView {...appProps} />
        </AppContainer>
      </Dropzone>
    )
    await new Promise((resolve, reject) => {
      try {
        render(application, container, async () => {
          this._uiStore.container = container
          await this.afterAppRender()
          resolve()
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  private async afterAppRender() {
    await this.configureSession()

    const documentStorage = createStorage(this._storage, 'document')
    const uiStorage = createStorage(this._storage, 'ui')
    const layoutStorage = createStorage(this._storage, 'layout')

    await this._uiStore.rehydrate(uiStorage)
    await this._layoutStore.rehydrate(layoutStorage)

    await this._uiStore.start(this._documentStore)
    await this._documentStore.start()
    await this._layoutStore.start(this._uiStore)

    await this._documentStore.rehydrate(documentStorage)
  }

  private constructor(initializer: IWorkspaceInitializer) {
    this._layoutStore = new LayoutStore()
    this._documentStore = new DocumentStore(initializer.documents)
    this._uiStore = new UIStore(initializer.components)
  }
}
