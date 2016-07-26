import * as React from 'react'
import * as rs from '@respace/common'
import { observer } from 'mobx-react'
import { ButtonToolbar, ButtonGroup, Button, Row, Col,
  OverlayTrigger, Tooltip } from 'react-bootstrap'
import EditorStore from '../store'

export type Props = rs.IComponentProps<rs.documents.ISourceCode, EditorStore>

function addTooltip(element: any, tooltip: string): React.ReactElement<any> {
  const tooltipEl = <Tooltip id='tooltip'>{tooltip}</Tooltip>
  return (
    <OverlayTrigger placement='bottom' overlay={tooltipEl} >
      {element}
    </OverlayTrigger>
  )
}

const RunIcon = require('react-icons/fa/play').default
const SaveIcon = require('react-icons/fa/floppy-o').default
const RevertIcon = require('react-icons/fa/ban').default
const SubmitIcon = require('react-icons/fa/check').default
const ZoomInIcon = require('react-icons/fa/plus').default
const ZoomOutIcon = require('react-icons/fa/minus').default

function Toolbar({ component }: Props) {
  const store = component.state
  const style = {
    paddingTop: '2px',
    paddingLeft: '5px',
    backgroundColor: '#17181A',
    height: store.toolbarHeight
  }
  const runButton = (
    <Button onClick={() => store.run() } bsStyle='success'>
      <RunIcon />
    </Button>
  )
  const submitButton = (
    <Button bsSize='small' bsStyle='primary'>
      <SubmitIcon style={{ marginRight: '5px' }}/>
      <b>SUBMIT</b>
    </Button>
  )
  const revertButton = (
    <Button onClick={() => store.revert() }>
      <RevertIcon />
   </Button>
  )
  const saveButton = (
    <Button onClick={() => store.save() }>
      <SaveIcon />
    </Button>
  )
  const zoomInButton = (
    <Button onClick={() => store.increaseFontSize() }>
      <ZoomInIcon />
    </Button>
  )
  const zoomOutButton = (
    <Button onClick={() => store.decreaseFontSize()}>
      <ZoomOutIcon />
    </Button>
  )

  return (
    <div style={style}>
      <Row>
        <Col xs={8}>
          <ButtonToolbar>
            <ButtonGroup bsSize='small'>
              { addTooltip(runButton, 'Run') }
              { addTooltip(saveButton, 'Save') }
              { addTooltip(revertButton, 'Start Over') }
            </ButtonGroup>
            <ButtonGroup bsSize='small'>
              { addTooltip(zoomInButton, 'Incr. Font Size') }
              { addTooltip(zoomOutButton, 'Decr. Font Size') }
            </ButtonGroup>
          </ButtonToolbar>
        </Col>
        <Col style={{textAlign: 'right'}} xs={4}>
          { submitButton }
        </Col>
      </Row>
    </div>
   )
}

export default observer(Toolbar)
