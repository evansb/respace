import $ from 'jquery'
import { Observable } from 'rxjs/Observable'
import GoldenLayout from 'golden-layout'
import { autorun } from 'mobx'
import { Subscription } from 'rxjs/Subscription'

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
  private _subscriptions: Subscription[] = []

  constructor() {
    this._layout = new GoldenLayout(createConfig())
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
          this.listenToUIStore()
          this.updateSizeOnContentResize()
          resolve()
        })
        this._layout.init()
      } catch (e) {
        reject(e)
      }
    })
  }

  updateSize(width: number, height: number) {
    this._layout.updateSize(width, height)
  }

  destroy() {
    this._layout.destroy()
  }

  private listenToUIStore() {
    const subscription = this._uiStore.subscribe((e) => {
      if (e instanceof rs.events.ComponentAdded) {
        const { isNew, parent, item } = this.findComponent(e.id)
        if (isNew) {
          const newItem = {
            id: e.id,
            title: e.props.title,
            type: 'react-component',
            component: e.props.name,
            props: e.props
          }
          parent.addChild(newItem)

        } else if (item) {
          parent.setActiveContentItem(item)
        }
      }
    })
    this._subscriptions.push(subscription)
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

        if (maybeParent.config &&
              typeof maybeParent.config.content === 'array') {
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

  private updateSizeOnContentResize() {
    const dimension$ = Observable.create((observer) => {
      autorun(() => {
        if (this._uiStore.isSidebarAnimating) {
          $(this.container)
            .find('.lm_goldenlayout')
            .hide()
        } else {
          observer.next({
            width: this._uiStore.appWidth,
            height: this._uiStore.appHeight
          })
        }
      })
    })
    dimension$.debounceTime(100).subscribe(({ width, height }) => {
      $(this.container)
        .find('.lm_goldenlayout')
        .animate({ opacity: 'show', width, height }, 'fast', () => {
          this._layout.updateSize(width, height)
        })
    })
  }
}
