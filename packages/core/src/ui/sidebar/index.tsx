import * as React from 'react'
import { observer } from 'mobx-react'
import { Button, ButtonGroup } from 'react-bootstrap'
import ComponentPicker from './component-picker'
import { addTooltip } from '../util'
import UIStore from '../../stores/ui-store'
import DocumentStore from '../../stores/document-store'
import LayoutStore from '../../stores/layout-store'
import ToggleIcon from 'react-icons/fa/arrows-h'

export interface ISidebarProps {
  layoutStore: LayoutStore,
  documentStore: DocumentStore,
  uiStore: UIStore
}

const Sidebar = ({ documentStore, uiStore, layoutStore }: ISidebarProps) => {
  const handleExpand = () => uiStore.toggleSidebar()

  const toggleSidebarButton = (
    <Button onClick={handleExpand} bsStyle='success'>
      <ToggleIcon />
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
    height: uiStore.appHeight + 'px',
    overflow: 'auto'
  }
  return (
    <div className='sidebar' style={style}>
      { header }
      <ComponentPicker {...{ uiStore, layoutStore }} />
    </div>
  )
}

export default observer(Sidebar)
