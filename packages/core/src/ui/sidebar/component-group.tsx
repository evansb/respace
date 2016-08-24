import * as React from 'react'
import { observer } from 'mobx-react'
import { Panel, Row, Col, ListGroup } from 'react-bootstrap'
import * as rs from '@respace/common'
import { addTooltip } from '../util'
import GroupIcon from 'react-icons/md/label'
import UIStore from '../../stores/ui-store'

export interface IComponentGroupProps {
  uiStore: UIStore
  group: string
  children: React.ReactElement<any>[]
}

function ComponentGroup({ uiStore, group, children }: IComponentGroupProps) {
  group = group || 'Untitled'

  const icon = addTooltip(<Col xs={2}><GroupIcon /></Col>, group,
          !uiStore.isSidebarToggled)
  const title = <Col xs={10}><b>{group}</b></Col>
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
