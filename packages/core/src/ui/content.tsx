import * as React from 'react'
import { observer } from 'mobx-react'
import * as rs from '@respace/common'

export interface IContentProps {
  layoutManager: React.ReactElement<any>
  uiStore: rs.IUIStore
}

const Content = (({ layoutManager, uiStore }: IContentProps) => {
  const style = {
    float: 'left',
    width: uiStore.mainContentWidth + 'px',
    height: uiStore.appHeight
  }
  return (
    <div className='content' style={style}>
      { React.cloneElement(layoutManager, { uiStore }) }
    </div>
  )
})

export default observer(Content)
