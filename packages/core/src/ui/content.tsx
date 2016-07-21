import * as React from 'react'
import { observer } from 'mobx-react'
import AppState from '../app-state'

export interface Props {
  layoutManager: React.ReactElement<any>
  appState: AppState
}

export default observer(({ layoutManager, appState }: Props) => {
  const style = {
    float: 'left',
    width: appState.mainContentWidth + 'px',
    height: appState.height
  }
  return (
    <div style={style}>
      { layoutManager }
    </div>
  )
})
