import * as React from 'react'
import { observer } from 'mobx-react'
import { IComponentStore, IDocumentStore } from '@respace/common'
import { Button } from 'react-bootstrap'
import AppState from '../app-state'
import FaExpand from 'react-icons/fa/expand'

export interface Props {
  appState: AppState,
  documentStore: IDocumentStore,
  componentStore: IComponentStore
}

const Sidebar = observer(({ appState,
  documentStore, componentStore }: Props) => {
  const style = {
    float: 'left',
    width: appState.sidebarWidth + 'px',
    height: appState.height
  }
  const handleExpand = appState.toggleSidebar.bind(appState)
  return (
    <div className='sidebar' style={style}>
      <Button onClick={handleExpand} bsStyle='primary'>
        <FaExpand />
      </Button>
    </div>
  )
})

export default Sidebar
