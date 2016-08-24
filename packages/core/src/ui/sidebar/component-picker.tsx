import * as React from 'react'
import { observer } from 'mobx-react'
import { groupBy, forOwn } from 'lodash'
import { addTooltip } from '../util'
import ComponentGroup from './component-group'
import ComponentItem from './component-item'
import UIStore from '../../stores/ui-store'
import LayoutStore from '../../stores/layout-store'

export interface IComponentPickerProps {
  uiStore: UIStore
  layoutStore: LayoutStore
}

function ComponentPicker({ uiStore, layoutStore }: IComponentPickerProps) {
  const componentsGrouped = groupBy(
    uiStore.components,
    (comp) => comp.document.meta.group
  )

  // Build the view
  const componentGroups: React.ReactElement<any>[] = []

  forOwn(componentsGrouped, (components, group) => {
    group = group || 'Ungrouped'
    const children = components.map((component, idx) => {
      const key = group + '-' + idx
      const props = { uiStore, component, key, layoutStore }
      const item = <ComponentItem {...props} />
      const tooltipText = `${group} (${component.displayName})`
      const itemWithTooltip = addTooltip(item, tooltipText,
        !uiStore.isSidebarToggled)
      return itemWithTooltip
    })
    const props = { uiStore, group }
    const componentGroup = (
      <ComponentGroup key={group} {...props}>
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
