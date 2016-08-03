import * as React from 'react'
import { printValueToString } from 'the-source'
import Store from '../store'
import { Snapshot } from 'the-source'
import { Tab, DropdownButton, MenuItem } from 'react-bootstrap'

export interface IProps {
  snapshot: Snapshot
  store: Store
}

class SnapshotResult extends React.Component<IProps, void> {
  render() {
    const Container = Tab.Container
    const Content = Tab.Content
    const Pane = Tab.Pane
    const valueStr = printValueToString(this.props.snapshot.value)
    const paneStyle = { position: 'relative' }
    const dropdownStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '80px'
    }
    const preStyle = {
      color: 'white',
      fontSize: '14px',
      paddingLeft: '85px',
      backgroundColor: '#1D1F21',
      borderColor: '#1E2124'
    }
    const valueType = this.props.snapshot.value.type
    const selectButton = (
      <DropdownButton title={valueType} bsStyle='link' id='result'>
        <MenuItem eventKey='raw'>Raw</MenuItem>
        <MenuItem eventKey='special'>Special</MenuItem>
      </DropdownButton>
    )
    return (
      <Container defaultActiveKey='raw' id='result'>
        <Content animation>
          <Pane style={paneStyle} eventKey='raw'>
            <pre style={preStyle} >{valueStr}</pre>
            <div style={dropdownStyle}>
              {selectButton}
            </div>
          </Pane>
          <Pane eventKey='special'>
            <pre>Special {valueStr}</pre>
          </Pane>
        </Content>
      </Container>
    )
  }
}

export default SnapshotResult
