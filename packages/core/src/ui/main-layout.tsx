import * as React from 'react'
import { findDOMNode } from 'react-dom'
import 'rxjs/add/operator/debounceTime'
import 'golden-layout/src/css/goldenlayout-base.css'
import LayoutStore from '../stores/layout-store'

export interface IProps {
  layoutStore: LayoutStore
}

export default class MainLayout extends React.Component<IProps, void> {

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    this.props.layoutStore.container = findDOMNode(this) as HTMLElement
  }

  componentWillUnmount() {
    this.props.layoutStore.destroy()
  }

  render() {
    const style = {
      height: '100%'
    }
    return <div style={style}></div>
  }
}
