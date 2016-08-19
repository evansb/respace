import * as React from 'react'
import * as rs from '@respace/common'
import { findDOMNode } from 'react-dom'
import { Button, ButtonGroup } from 'react-bootstrap'
import CanvasIcon from 'react-icons/fa/image'
import PlusIcon from 'react-icons/fa/plus'
import MinusIcon from 'react-icons/fa/minus'

interface ICoursemologyWindowWithCanvas extends Window {
  mission_type?: string
  vertices: any[]
  indices: any[]
  getReadyWebGLForCanvas(context: string, canvas: HTMLCanvasElement)
  initRuneBuffer(vertices: any[], indices: any[])
}

declare var window: ICoursemologyWindowWithCanvas

export type Props = rs.IComponentProps<rs.documents.ISourceCode, void>

class CanvasView extends React.Component<Props, { size: number }> {
  refs: { [index: string]: any, canvas: any }

  CANVAS_RENDER_SIZE = 512

  constructor(props) {
    super(props)
    this.state = { size: 256 }
  }

  componentDidMount() {
    const canvas = findDOMNode(this.refs.canvas) as HTMLCanvasElement
    const document = this.props.component.document
    const missionType = document.volatile.mission_type || window.mission_type
    const runeType: string = (typeof missionType === 'string') &&
      (missionType as string).split('_')[1]
    window.getReadyWebGLForCanvas(runeType || '2d', canvas)
    window.initRuneBuffer(window.vertices, window.indices);
  }

  handleIncrease = () => {
    if (this.state.size < 1024) {
      this.setState({ size: this.state.size * 2 })
    }
  }

  handleDecrease = () => {
    if (this.state.size > 64) {
      this.setState({ size: this.state.size / 2 })
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
      <div className='ui-canvas'>
        <ButtonGroup>
          <Button onClick={this.handleIncrease}><PlusIcon /></Button>
          <Button onClick={this.handleDecrease}><MinusIcon /></Button>
        </ButtonGroup>
        <div style={style}>
          <canvas ref='canvas'
            width={this.CANVAS_RENDER_SIZE}
            height={this.CANVAS_RENDER_SIZE}
            style={canvasStyle} />
        </div>
      </div>
    )
  }
}

const Canvas: rs.IComponentFactory<rs.documents.ISourceCode, void> = {
  name: 'ui-canvas',
  displayName: 'Canvas',
  icon: CanvasIcon,
  view: CanvasView,
  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
      && window.getReadyWebGLForCanvas
      && document.volatile.context
      && document.volatile.context.show
  },
  createStore(document: rs.IDocument<rs.documents.ISourceCode>) {
    return
  }
}

export default Canvas
