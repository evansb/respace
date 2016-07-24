import * as React from 'react'
import { findDOMNode } from 'react-dom'
import 'rxjs/add/operator/debounceTime'
import 'golden-layout/src/css/goldenlayout-base.css'
import GoldenLayoutStore from './store'

export interface IProps {
  layoutStore: GoldenLayoutStore
}

class GoldenLayoutWrapper extends React.Component<IProps, void> {
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

export default GoldenLayoutWrapper
