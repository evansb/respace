/// <reference path='../typeshims/golden-layout.d.ts' />
import * as React from 'react'
import $ from 'jquery'
import { findDOMNode } from 'react-dom'
import { autorun } from 'mobx'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import GoldenLayout from 'golden-layout'

import 'rxjs/add/operator/debounceTime'
import 'golden-layout/src/css/goldenlayout-base.css'

import * as rs from '@respace/common'
import config from './config'


export interface IState {
  layout: GoldenLayout
}

export interface IProps {
  uiStore: rs.IUIStore
}

type FindComponentResult = {
  isNew: boolean
  parent: GoldenLayout.ContentItem
  item?: GoldenLayout.ContentItem
}

class GoldenLayoutWrapper extends React.Component<IProps, IState> {
  private _subscriptions: Subscription[] = []

  constructor(props, context) {
    super(props, context)
    this.state = {
      layout: new GoldenLayout(config())
    }
  }

  componentDidMount() {
    this.initializeGoldenLayoutInstance()
    this.listenToComponentStore()
  }

  componentWillUnmount() {
    this.state.layout.destroy()
    this._subscriptions.forEach((s) => s.unsubscribe())
  }

  render() {
    const style = {
      height: '100%'
    }
    return <div style={style}></div>
  }

  private listenToComponentStore() {
    const subscription = this.props.uiStore.subscribe((e) => {
      if (e instanceof rs.events.FactoryRegistered) {
        if (e.factory.view) {
          this.state.layout.registerComponent(
            e.factory.name,
            e.factory.view)
        }
      } else if (e instanceof rs.events.ComponentAdded) {
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

  private updateSizeOnContentResize() {
    const layout = this.state.layout

    const dimension$ = Observable.create((observer) => {
      autorun(() => {
        const width = this.props.uiStore.mainContentWidth
        const height = this.props.uiStore.appHeight
        if (this.props.uiStore.isSidebarAnimating) {
          $(findDOMNode(this))
            .find('.lm_goldenlayout')
            .hide()
        } else {
          observer.next({ width, height })
        }
      })
    })

    dimension$.debounceTime(100).subscribe(({ width, height }) => {
      $(findDOMNode(this))
        .find('.lm_goldenlayout')
        .width(width)
        .height(height)
        .show()
      layout.updateSize(width, height)
    })
  }

  private initializeGoldenLayoutInstance() {
    const layout = this.state.layout
    layout.container = $(findDOMNode(this))
    layout.on('initialised', this.updateSizeOnContentResize.bind(this))
    layout.init()
  }

  private findComponent(id: string): FindComponentResult {
    const layout = this.state.layout

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
}

export default GoldenLayoutWrapper
