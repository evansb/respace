import * as React from 'react'
import { observer } from 'mobx-react'
import { Panel, Row, Col, ListGroup } from 'react-bootstrap'
import * as rs from '@respace/common'
import { addTooltip } from '../util'
import GroupIcon from 'react-icons/md/label'

export interface IComponentGroupProps {
  uiStore: rs.IUIStore
  document: rs.AnyDocument
  children: React.ReactElement<any>[]
}

function ComponentGroup({ uiStore, document, children }: IComponentGroupProps) {
  const documentTitle = document.meta.title || 'Untitled'

  const icon = addTooltip(<Col xs={2}><GroupIcon /></Col>, documentTitle,
          !uiStore.isSidebarToggled)
  const title = <Col xs={10}><b>{ documentTitle}</b></Col>
  const header = (
    <Row>
      { icon }
      { uiStore.isSidebarToggled && title }
    </Row>
  )
  return (
    <Panel header={header} bsStyle='default' defaultExpanded collapsible>
      <ListGroup fill>
        { children }
      </ListGroup>
    </Panel>
  )
}

export default observer(ComponentGroup)
