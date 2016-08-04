import * as React from 'react'
import { observer } from 'mobx-react'
import { IUIStore, IDocumentStore, ILayoutStore } from '@respace/common'
import { Button, ButtonGroup } from 'react-bootstrap'
import FaExpand from 'react-icons/fa/expand'
import ComponentPicker from './component-picker'
import { addTooltip } from '../util'

export interface ISidebarProps {
  layoutStore: ILayoutStore,
  documentStore: IDocumentStore,
  uiStore: IUIStore
}

const Sidebar = ({ documentStore, uiStore, layoutStore }: ISidebarProps) => {
  const handleExpand = () => uiStore.toggleSidebar()

  const toggleSidebarButton = (
    <Button onClick={handleExpand} bsStyle='success'>
      <FaExpand />
    </Button>
  )

  const header = (
    <ButtonGroup>
      { addTooltip(toggleSidebarButton, 'Toggle Sidebar', true, 'bottom') }
    </ButtonGroup>
  )

  const style = {
    float: 'left',
    width: uiStore.sidebarWidth + 'px',
    height: uiStore.appHeight + 'px'
  }
  return (
    <div className='sidebar' style={style}>
      { header }
      <ComponentPicker {...{ uiStore, layoutStore }} />
    </div>
  )
}

export default observer(Sidebar)
