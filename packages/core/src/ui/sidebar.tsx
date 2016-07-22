import * as React from 'react'
import { observer } from 'mobx-react'
import { IUIStore, IDocumentStore } from '@respace/common'
import { Row, Button } from 'react-bootstrap'
import FaExpand from 'react-icons/fa/expand'

export interface ISidebarProps {
  documentStore: IDocumentStore,
  uiStore: IUIStore
}

const Sidebar = ({ documentStore, uiStore }: ISidebarProps) => {
  const style = {
    float: 'left',
    width: uiStore.sidebarWidth + 'px',
    height: uiStore.appHeight + 'px'
  }
  const handleExpand = uiStore.toggleSidebar.bind(uiStore)
  const components = uiStore.sidebarComponents.map(() => {
    return <Row></Row>
  })
  return (
    <div className='sidebar' style={style}>
      <Button onClick={handleExpand} bsStyle='primary'>
        <FaExpand />
        { components }
      </Button>
    </div>
  )
}

export default observer(Sidebar)
