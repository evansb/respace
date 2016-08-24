import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { AnyComponentProps, IUIStore, ComponentView } from '@respace/common'
import { observer } from 'mobx-react'

export default function wrapComponent<P extends AnyComponentProps, S>(
  uiStore: IUIStore,
  ComponentView: ComponentView<any, any>
): React.ComponentClass<P> {
  class Wrapped extends React.Component<P, S> {
    componentDidUpdate() {
      const component = uiStore.getComponent(this.props.id)
      if (component && !component.container) {
        component.container = findDOMNode(this)
      }
    }
    render() {
      const component = uiStore.getComponent(this.props.id)
      if (!component) {
        return <div>Loading...</div>
      } else {
        const injectedProps = { component, uiStore }
        return <ComponentView {...injectedProps} {...this.props} />
      }
    }
  }
  return observer(Wrapped)
}
