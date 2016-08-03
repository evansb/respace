import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'
import { Button, Checkbox, Col, Row } from 'react-bootstrap'

function Toolbar({ store }: { store: Store }) {
  const style = {
    position: 'relative',
    backgroundColor: '#17181A',
    padding: '5px'
  }
  const handleCheckbox = () => {
    store.isAutorunEnabled = !store.isAutorunEnabled
  }
  const checkboxStyle = {
    marginLeft: '10px',
    marginRight: '10px'
  }
  return (
    <Row style={style}>
      <Col xs={6}>
        <Checkbox inline style={checkboxStyle}
            onChange={handleCheckbox} checked={store.isAutorunEnabled}>
          Autorun
        </Checkbox>
      </Col>
      <Col xs={6} style={{textAlign: 'right'}}>
        <Button bsStyle='danger'>Clear</Button>
      </Col>
    </Row>
  )
}

export default observer(Toolbar)
