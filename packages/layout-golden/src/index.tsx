/// <reference path='../typeshims/golden-layout.d.ts' />
import * as React from 'react'
import $ from 'jquery'
import { findDOMNode } from 'react-dom'
import { IDocumentStore, IComponentStore, events,
  InjectedProps, BasicProps, IAppState } from '@respace/common'
import { autorun } from 'mobx'
import config from './config'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/debounceTime'
import 'golden-layout/src/css/goldenlayout-base.css'

const GoldenLayout: GoldenLayout = require('golden-layout')

export interface IState {
  layout: GoldenLayout
}

export interface IProps {
  documentStore: IDocumentStore
  componentStore: IComponentStore
  appState: IAppState
}

function newContentConfig(id: string, props: InjectedProps & BasicProps) {
  return {
    id,
    title: props.title,
    type: 'react-component',
    component: props.name,
    props
  }
}

class GoldenLayoutWrapper extends React.Component<IProps, IState> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      layout: new GoldenLayout(config())
    }
  }

  get style() {
    return {
      width: this.props.appState.mainContentWidth,
      height: '100%'
    }
  }

  componentDidMount() {
    const layout = this.state.layout
    layout.container = findDOMNode(this)
    layout.on('initialised', () => {
      const obs = Observable.create((observer) => {
        autorun(() => {
          const width = this.props.appState.mainContentWidth
          const height = this.props.appState.height
          observer.next({ width, height })
        })
      })
      obs.debounceTime(1000).subscribe(({ width, height }) =>
        $('.lm_goldenlayout').animate({ width, height },
          () => layout.updateSize())
      )
    })
    layout.init()
    this.props.componentStore.subscribe((e: events.ComponentEvent) => {
      if (e instanceof events.ComponentRegistered) {
        if (e.component.component) {
          this.state.layout.registerComponent(
            e.component.name,
            e.component.component)
        }
      } else if (e instanceof events.ViewModelAdded) {
        this.addComponent(e.id, e.props)
      }
    })
  }

  addComponent(id: string, props: InjectedProps & BasicProps): void {
    const { isNew, parent, item } = this.findComponent(id)
    if (isNew) {
      parent.addChild(newContentConfig(id, props))
    } else if (item) {
      parent.setActiveContentItem(item)
    }
  }

  componentWillUnmount() {
    this.state.layout.destroy()
  }

  render() {
    return <div style={this.style}></div>
  }

  private findComponent(id: string): {
    isNew: boolean,
    parent: GoldenLayout.ContentItem, item?: GoldenLayout.ContentItem
  } {
    const layout = this.state.layout
    // If the root is empty, create a new stack
    if (layout.root.contentItems.length === 0) {
      layout.root.addChild({ type: 'stack', content: [] })
    }

    // Search for existing component
    const allStacks = layout.root.getItemsByType('stack')

    for (let i = 0; i < allStacks.length; i += 1) {
      const parent: GoldenLayout.ContentItem = allStacks[i]
      for (let j = 0; j < parent.contentItems.length; j += 1) {
        let comp = parent.contentItems[j]
        if (parent.config && typeof parent.config.content === 'array') {
          let compCfg = parent.config.content[j]
          if (comp.isComponent && compCfg && compCfg.id === id) {
            return { isNew: false, parent, item: comp }
          }
        }
      }
    }

    return { isNew: true, parent: layout.root.getItemsByType('stack')[0] }
  }
}

export default GoldenLayoutWrapper
