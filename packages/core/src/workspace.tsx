import * as React from 'react'
import { AppContainer } from 'react-hot-loader'
import { render } from 'react-dom'
import DocumentStore from './stores/document-store'
import LayoutStore from './stores/layout-store'
import ComponentStore from './stores/component-store'
import Root from './ui/root'
import { AnyComponent } from '@respace/common'

/**
 * Respace workspace.
 */
export class Workspace {
  private readonly _layoutStore: LayoutStore
  private readonly _documentStore: DocumentStore
  private readonly _componentStore: ComponentStore

  /**
   * Create a workspace instance.
   *
   * @param components array of components used, default to []
   * @param initialDocuments array of initial documents, default to [].
   * @returns {Workspace} a new workspace instance
   */
  static create(components: AnyComponent[] = [], documents: any[] = []) {
    return new Workspace(components, documents)
  }

  private constructor(components: AnyComponent[] = [], documents: any[] = []) {
    this._layoutStore = new LayoutStore()
    this._componentStore = new ComponentStore()
    this._documentStore = DocumentStore.create(documents)
  }

  /**
   * TODO Sync workspace store with persistence storage.
   * @returns {Promise<boolean>} A workspace with
   *  its store restored from localstorage, or the original if fails.
   */
  rehydrate(): this {
    return this
  }

  /**
   * TODO Destroy a workspace, umounting all rendered instance.
   * @returns {Promise<void>} A promise that resolve when
   *  the destroy is complete
   */
  async destroy() {
    return Promise.resolve()
  }

  /**
   * Render a workspace to an HTML container.
   * @param workspace
   * @param container
   * @returns {Promise<void>} promise that resolve when
   *  the render succeeded
   */
  async render(container: HTMLElement) {
    return new Promise((resolve, reject) => {
      try {
        const props = {
          componentStore: this._componentStore,
          documentStore: this._documentStore,
          layoutStore: this._layoutStore
        }
        const doRender = (Root) => {
          const root = <AppContainer><Root {...props} /></AppContainer>
          render(root, container, () => {
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
}
