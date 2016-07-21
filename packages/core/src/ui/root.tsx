import * as React from 'react'
import { observer } from 'mobx-react'
import DocumentStore from '../stores/document-store'
import ComponentStore from '../stores/component-store'
import Sidebar from './sidebar'
import Content from './content'
import AppState from '../app-state'

export interface Props {
  layoutManager: React.ReactElement<any>
  documentStore: DocumentStore,
  componentStore: ComponentStore
  appState: AppState
}

const Root = (props: Props) => {
  const style = {
    height: '100%',
    minWidth: props.appState.width
  }
  let DevTools
  if (__DEV__) {
    DevTools = require('mobx-react-devtools').default
  }
  return (
    <div className='respace' style={style}>
      <Sidebar {...props} />
      <Content {...props} />
      {  __DEV__ && <DevTools /> }
    </div>
  )
}

export default observer(Root)

