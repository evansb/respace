import * as React from 'react'
import { observer } from 'mobx-react'
import Store from '../store'
import { Button, Checkbox, Col, Row } from 'react-bootstrap'

function Toolbar({ store }: { store: Store }) {
  const style = {
    position: 'relative',
    backgroundColor: '#17181A',
    padding: '5px',
    marginTop: '1px'
  }

  const handleLineNumberToggle = () => {
    store.editor.showLineNumber = !store.editor.showLineNumber
  }

  const checkboxStyle = {
    marginRight: '10px'
  }
  return (
    <Row style={style}>
      <Col xs={6}>
        <Checkbox inline style={checkboxStyle}
            onChange={handleLineNumberToggle}
            checked={store.editor.showLineNumber}>
          Line Numbers
        </Checkbox>
      </Col>
      <Col xs={6} style={{textAlign: 'right'}}>
        <Button onClick={() => store.clear()} bsStyle='danger'>Clear</Button>
      </Col>

    </Row>
  )
}

export default observer(Toolbar)
