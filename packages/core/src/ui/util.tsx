import * as React from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

export function addTooltip(
  element: any,
  tooltip: string,
  condition: boolean = true,
  position: string = 'right'): React.ReactElement<any> {
  if (!condition) { return element }
  const tooltipEl = <Tooltip id='tooltip'>{tooltip}</Tooltip>
  return (
    <OverlayTrigger placement={position} overlay={tooltipEl} >
      {element}
    </OverlayTrigger>
  )
}
