import * as React from 'react'
import * as rs from '@respace/common'
import { observer } from 'mobx-react'
import EditorStore from '../store'
import { Col } from 'react-bootstrap'

const ModifiedIcon = require('react-icons/fa/exclamation').default
const SavedIcon = require('react-icons/fa/check').default

export type Props = rs.IComponentProps<rs.documents.ISourceCode, EditorStore>

function ModifiedStatus_({ component }: Props) {
  const store = component.state
  const iconStyle = { marginRight: '5px' }
  const Icon = store.isDirty ? ModifiedIcon : SavedIcon
  return (
    <Col xs={8}>
      <Icon style={iconStyle} />
      { store.isDirty ? 'Modified' : 'Saved' }
    </Col>
  )
}

function StatusBar({ component }: Props) {
  const ModifiedStatus = observer(ModifiedStatus_) // tslint:disable-line

  const store = component.state
  const style = {
    position: 'absolute',
    paddingTop: '2px',
    fontSize: '0.9em',
    left: '0px',
    right: '0px',
    bottom: '0px',
    color: '#CDCED1',
    height: store.statusBarHeight
  }

  return (
    <div style={style}>
      <Col xs={4}>{store.mode}</Col>
    </div>
  )
}

export default observer(StatusBar)
