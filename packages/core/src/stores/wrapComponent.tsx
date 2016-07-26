import * as React from 'react'
import * as rs from '@respace/common'
import { observer } from 'mobx-react'

export default function wrapComponent<P extends rs.AnyComponentProps, S>(
  uiStore: rs.IUIStore,
  Component: React.ComponentClass<any> | React.StatelessComponent<any>
) {
  class Wrapped extends React.Component<P, S> {
    render() {
      const component = uiStore.getComponent(this.props.id)
      if (!component) {
        return <div> Loading...</div>
      } else {
        const injectedProps = { component, uiStore }
        return <Component {...injectedProps} {...this.props} />
      }
    }
  }
  return observer(Wrapped)
}
