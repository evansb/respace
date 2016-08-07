import * as React from 'react'
import * as rs from '@respace/common'
import { observer } from 'mobx-react'
import { Row, Col, ListGroupItem } from 'react-bootstrap'
import FaCode from 'react-icons/fa/code'
import classnames from 'classnames'
import { addTooltip } from '../util'

export interface IComponentItemProps {
  uiStore: rs.IUIStore
  component: rs.AnyComponent
  layoutStore: rs.ILayoutStore
}

function ComponentItem({ uiStore,
  layoutStore, component }: IComponentItemProps) {
  const factory = uiStore.getFactory(component.name)
  let icon
  if (factory && factory.icon)  {
    icon = React.createElement(factory.icon)
  } else {
    icon = <FaCode />
  }
  const iconWithTooltip = addTooltip(icon,
    component.displayName, !uiStore.isSidebarToggled)
  const handleClick = () => {
    layoutStore.addComponent(component)
  }
  const classes = classnames('list-group-item', 'item', {
    'item-active': component.isActive
  })
  return (
    <ListGroupItem bsClass={classes}>
      <Row onClick={handleClick}>
        <Col xs={2}>{ iconWithTooltip }</Col>
        { uiStore.isSidebarToggled &&
          <Col xs={10}>
            { component.displayName}
          </Col>
        }
      </Row>
    </ListGroupItem>
  )
}

export default observer(ComponentItem)
