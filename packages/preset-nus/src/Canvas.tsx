import * as React from 'react'
import { findDOMNode } from 'react-dom'
import * as rs from '@respace/common'
import { Button, ButtonGroup } from 'react-bootstrap'

declare var window: any

export type Props = rs.IComponentProps<rs.documents.ISourceCode, void>

const Plus = require('react-icons/fa/plus').default
const Minus = require('react-icons/fa/minus').default

class CanvasView extends React.Component<Props, { size: number }> {
  refs: { [index: string]: any, canvas: any }

  constructor(props) {
    super(props)
    this.state = { size: 256 }
  }

  componentDidMount() {
    const canvas = findDOMNode(this.refs.canvas) as HTMLCanvasElement
    let runeType
    const document = this.props.component.document
    const missionType = document.volatile.mission_type || window.mission_type
    if (typeof missionType === 'string') {
      runeType = (missionType as string).split('_')[1]
    }
    window.getReadyWebGLForCanvas(runeType || '2d', canvas)
    window.initRuneBuffer(window.vertices, window.indices);
  }

  handleIncrease = () => {
    if (this.state.size < 1024) {
      this.setState({
        size: this.state.size * 2
      })
    }
  }

  handleDecrease = () => {
    if (this.state.size > 64) {
      this.setState({
        size: this.state.size / 2
      })
    }
  }

  render() {
    const style = {
      padding: '10px',
      textAlign: 'center'
    }
    const canvasStyle = {
      backgroundColor: 'white',
      width: this.state.size,
      height: this.state.size
    }
    return (
      <div>
        <ButtonGroup>
          <Button onClick={this.handleIncrease}><Plus /></Button>
          <Button onClick={this.handleDecrease}><Minus /></Button>
        </ButtonGroup>
        <div style={style}>
          <canvas ref='canvas' width={512} height={512} style={canvasStyle} />
        </div>
      </div>
    )
  }
}

const icon: React.ComponentClass<void> = require('react-icons/fa/image').default

const Canvas: rs.IComponentFactory<rs.documents.ISourceCode, void> = {
  name: 'ui-canvas',
  displayName: 'Canvas',
  icon,
  view: CanvasView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
      && window.getReadyWebGLForCanvas
      && document.volatile.context
      && document.volatile.context.show
  },
  initialState(document: rs.IDocument<rs.documents.ISourceCode>) {
    return
  }
}

export default Canvas
