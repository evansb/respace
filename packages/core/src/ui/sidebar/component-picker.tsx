import * as React from 'react'
import { observer } from 'mobx-react'
import { Panel, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap'
import * as rs from '@respace/common'
import { addTooltip } from '../util'
import { groupBy, forOwn } from 'lodash'
import MdLabel from 'react-icons/md/label'
import FaCode from 'react-icons/fa/code'
import classnames from 'classnames'

export interface IComponentPickerProps {
  uiStore: rs.IUIStore
  layoutStore: rs.ILayoutStore
}

export interface IComponentItemProps {
  uiStore: rs.IUIStore
  component: rs.AnyComponentProps
  layoutStore: rs.ILayoutStore
}

const ComponentItem = observer(({
  uiStore, layoutStore, component }: IComponentItemProps) => {
  const handleClick = () => {
    layoutStore.addComponent(component)
  }
  const classes = classnames('list-group-item', 'item', {
    'item-active': component.isActive
  })
  return (
    <ListGroupItem href='#' bsClass={classes}>
      <Row onClick={handleClick}>
        <Col xs={2}>
          <FaCode />
        </Col>
        { uiStore.isSidebarToggled &&
          <Col xs={10}>
            { component.displayName}
          </Col>
        }
      </Row>
    </ListGroupItem>
  )
})

const DocumentGroup = observer(({ uiStore, document, children }) => {
  const documentTitle = document.meta.title || 'Untitled'
  const title = (
    <Row>
      { addTooltip(
          <Col xs={2}><MdLabel /></Col>,
          documentTitle,
          !uiStore.isSidebarToggled) }
      { uiStore.isSidebarToggled &&
        <Col xs={10}>
          <b>{ documentTitle}</b>
        </Col>
      }
    </Row>
  )
  return (
    <Panel header={title} bsStyle='default' defaultExpanded collapsible>
      <ListGroup fill>
        { children }
      </ListGroup>
    </Panel>
  )
})

const ComponentPicker = ({ uiStore, layoutStore }: IComponentPickerProps) => {
  const activeDocuments: { [id: string]: rs.AnyDocument } = {}
  uiStore.components.forEach((comp) => {
    activeDocuments[comp.document.meta.id] = comp.document
  })
  const componentsGroupedByDocuments = groupBy(
    uiStore.components,
    (comp) => comp.document.meta.id
  )
  const documents: React.ReactElement<any>[] = []
  forOwn(componentsGroupedByDocuments, (components, id) => {
    if (id) {
      const document = activeDocuments[id]
      const documentTitle = document.meta.title || 'Untitled'
      const children = components.map((component, idx) => {
        const key = document.meta.id + idx
        const props = { uiStore, component, key, layoutStore }
        const item = <ComponentItem {...props} />
        const tooltipText = `${documentTitle} (${component.displayName})`
        const itemWithTooltip = addTooltip(item, tooltipText,
          !uiStore.isSidebarToggled)
        return itemWithTooltip
      })
      const props = { uiStore, document }
      const documentGroup = (
        <DocumentGroup key={document.meta.id} {...props}>
          { children }
        </DocumentGroup>
      )
      documents.push(documentGroup)
    }
  })
  return (
    <div className='component-picker'>
      { documents }
    </div>
  )
}

export default ComponentPicker
