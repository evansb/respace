import * as React from 'react'
import { observer } from 'mobx-react'
import { Panel, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap'
import { IUIStore } from '@respace/common'
import { addTooltip } from '../util'
import MdLabel from 'react-icons/md/label'
import FaCode from 'react-icons/fa/code'

export interface IComponentPickerProps {
  uiStore: IUIStore
}

const DocumentGroup = observer(({ uiStore }) => {
  const title = (
    <Row>
      { addTooltip(<Col xs={2}><MdLabel /></Col>,
        'Documents', !uiStore.isSidebarToggled) }
      { uiStore.isSidebarToggled &&
        <Col xs={10}>
          <b>Mission Task</b>
        </Col>
      }
    </Row>
  )

  const item = (
    <ListGroupItem href='#' bsClass='list-group-item item'>
      <Row>
        <Col xs={2}>
          <FaCode />
        </Col>
        { uiStore.isSidebarToggled &&
          <Col xs={10}>
            Item 1
          </Col>
        }
      </Row>
    </ListGroupItem>
  )
  const itemWithTooltip = addTooltip(item, 'Item1', !uiStore.isSidebarToggled)
  return (
    <Panel header={title} bsStyle='primary' defaultExpanded collapsible>
      <ListGroup fill>
        { itemWithTooltip }
        { itemWithTooltip }
      </ListGroup>
    </Panel>
  )
})

const ComponentPicker = ({ uiStore }: IComponentPickerProps) => {
  return (
    <div className='component-picker'>
      <DocumentGroup uiStore={uiStore} />
      <DocumentGroup uiStore={uiStore} />
    </div>
  )
}

export default ComponentPicker
