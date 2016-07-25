import * as React from 'react'
import * as rs from '@respace/common'
import { observer } from 'mobx-react'
import { groupBy, forOwn } from 'lodash'
import { addTooltip } from '../util'
import ComponentGroup from './component-group'
import ComponentItem from './component-item'

export interface IComponentPickerProps {
  uiStore: rs.IUIStore
  layoutStore: rs.ILayoutStore
}

function ComponentPicker({ uiStore, layoutStore }: IComponentPickerProps) {
  // Collect documents from all active components.
  const activeDocuments: { [id: string]: rs.AnyDocument } = {}
  uiStore.components.forEach((comp) => {
    activeDocuments[comp.document.meta.id] = comp.document
  })

  const componentsGroupedByDocuments = groupBy(
    uiStore.components,
    (comp) => comp.document.meta.id
  )

  // Build the view
  const componentGroups: React.ReactElement<any>[] = []

  forOwn(componentsGroupedByDocuments, (components, id) => {
    if (!id) { return }
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
    const componentGroup = (
      <ComponentGroup key={document.meta.id} {...props}>
        { children }
      </ComponentGroup>
    )
    componentGroups.push(componentGroup)
  })
  return (
    <div className='component-picker'>
      { componentGroups }
    </div>
  )
}

export default observer(ComponentPicker)
