import $ from 'jquery'
import { Observable } from 'rxjs/Observable'
import GoldenLayout from 'golden-layout'
import { autorun } from 'mobx'

import 'rxjs/add/operator/debounceTime'
import 'golden-layout/src/css/goldenlayout-base.css'

import * as rs from '@respace/common'
import createConfig from './config'

type FindComponentResult = {
  isNew: boolean
  parent: GoldenLayout.ContentItem
  item?: GoldenLayout.ContentItem
}

export default class GoldenLayoutStore implements rs.ILayoutStore {
  public container: HTMLElement
  private _uiStore: rs.IUIStore
  private _layout: GoldenLayout
  private _storage: rs.IStorage
  private _itemConfig: Map<string, GoldenLayout.ReactComponentConfig>

  constructor() {
    this._layout = new GoldenLayout(createConfig())
    this._itemConfig = new Map<string, GoldenLayout.ReactComponentConfig>()
  }

  start(uiStore: rs.IUIStore) {
    return new Promise((resolve, reject) => {
      try {
        this._uiStore = uiStore
        this._uiStore.factories.forEach((factory) => {
          this._layout.registerComponent(factory.name, factory.view)
        })
        this._layout.container = this.container as any

        this._layout.on('initialised', () => {
          this.collectItemConfig()
          this.addItemDestroyedHandler()
          this.addContentResizeHandler()
          resolve()
        })

        this._layout.on('stateChanged', () => {
          if (this._layout.isInitialised) {
            this._uiStore.components.forEach((component) => {
              if (component.isActive) {
                component.updateSize()
              }
            })
            this._storage.put('config', this._layout.toConfig())
          }
        })

        this._layout.init()
      } catch (e) {
        reject(e)
      }
    })
  }

  async rehydrate(storage: rs.IStorage) {
    this._storage = storage
    const existingConfig = <GoldenLayout.Config> (await storage.get('config'))
    if (existingConfig) {
      this._layout = new GoldenLayout(existingConfig)
    }
  }

  updateSize(width: number, height: number) {
    this._layout.updateSize(width, height)
  }

  destroy() {
    this._layout.destroy()
  }

  addComponent(component: rs.AnyComponent) {
    const { isNew, parent, item } = this.findComponent(component.id)
    if (isNew) {
      component.isActive = true
      const newItem = {
        id: component.id,
        title: `${component.displayName}-${component.document.title}`,
        type: 'react-component',
        component: component.name,
        props: { id: component.id }
      }
      parent.addChild(newItem)
    } else if (item) {
      parent.setActiveContentItem(item)
    }
  }

  private addItemDestroyedHandler() {
    const anyRoot = <any> this._layout.root
    anyRoot.on('itemDestroyed', (e) => {
      const item = e.origin
      if (item.isComponent && item.config.props && item.config.props.id) {
        const component = this._uiStore.getComponent(item.config.props.id)
        if (component) {
          component.isActive = false
        }
      }
    })
  }

  private collectItemConfig() {
    const components = this._layout.root.getItemsByType('component')
    components.forEach((item) => {
      const config = <GoldenLayout.ReactComponentConfig> item.config
      if (typeof config.id === 'string') {
        this._itemConfig.set(config.id, config)
      }
    })
  }

  private findComponent(id: string): FindComponentResult {
    const layout = this._layout

    // Sometimes the root is empty. Create a new stack
    const rootIsEmpty = layout.root.contentItems.length === 0

    if (rootIsEmpty) {
      layout.root.addChild({ type: 'stack', content: [] })
    }

    // Search for existing component
    const allStacks = layout.root.getItemsByType('stack')
    const anyParent = allStacks[0]

    for (let i = 0; i < allStacks.length; i += 1) {
      const maybeParent: GoldenLayout.ContentItem = allStacks[i]

      for (let j = 0; j < maybeParent.contentItems.length; j += 1) {
        const item = maybeParent.contentItems[j]

        if (maybeParent.config && maybeParent.config.content instanceof Array) {
          const itemConfig = maybeParent.config.content[j]
          if (item.isComponent && itemConfig && itemConfig.id === id) {
            return { isNew: false, parent: maybeParent, item }
          }
        }
      }
    }

    // Component not found.
    return { isNew: true, parent: anyParent }
  }

  private addContentResizeHandler() {
    const dimension$ = Observable.create((observer) => {
      autorun(() => {
        observer.next({
          width: this._uiStore.mainContentWidth,
          height: this._uiStore.appHeight
        })
      })
    })
    dimension$.debounceTime(100).subscribe(({ width, height }) => {
      $(this.container)
        .find('.lm_goldenlayout')
        .animate({ width, height }, 'fast', () => {
          this._layout.updateSize(width, height)
        })
    })
  }
}
