import * as React from 'react'
import * as rs from '@respace/common'
import ToneMatrixIcon from 'react-icons/fa/music'
import { Button } from 'react-bootstrap'

declare var initialise_matrix: any
declare var clear_matrix: any
declare var matrix: any
declare var color_on, color_off, set_color: any
declare var window: any

export type Props = rs.IComponentProps<rs.SourceCode, void>

function loadScript(url, callback) {
  var script = document.createElement('script')
  script.type = 'text/javascript'
  script.onload = callback
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script)
}

const JQUERY_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'

class ToneMatrixView extends React.Component<Props, void> {
  refs: { [index: string]: any, matrix: any }
  randomiseMatrix() {
    let on: boolean
    clear_matrix()
    for (var i = 15; i >= 0; i--) {
      for (var j = 15; j >= 0; j--) {
        on = Math.random() > 0.9
        if (on) {
          set_color(i, j, color_on)
          matrix[i][j] = true
        } else {
          set_color(i, j, color_off)
          matrix[i][j] = false
        }
      }
    }
  }
  componentDidMount() {
    const callback = () =>
      setTimeout(() => {
        initialise_matrix()
      }, 100)
    if (!window.$) {
      loadScript(JQUERY_URL, callback)
    } else {
      callback()
    }
  }

  render() {
    const style = { padding: '20px' }
    const canvasStyle = { backgroundColor: 'grey' }
    return (
      <div style={style}>
        <canvas id='tone-matrix' style={canvasStyle} width='420' height='420'>
          Loading Tone Matrix...
          If this took more than 5s your browser does not support it.
        </canvas>
        <br />
        <Button id='clear-matrix' bsStyle='danger'
          onClick={() => clear_matrix()}
          type='button'>Clear</Button>
        <Button id='clear-matrix' bsStyle='primary'
          onClick={this.randomiseMatrix.bind(this)}
          type='button'>Randomise</Button>
      </div>
    )
  }
}

class ToneMatrix extends rs.ComponentFactory<rs.SourceCode, void> {
  name = 'ui-tone-matrix'
  displayName = 'Tone Matrix'
  icon = ToneMatrixIcon
  view = ToneMatrixView

  acceptDocument(document: rs.AnyDocument) {
    const language = (document as rs.SourceCode).language
    return document.type === 'source-code'
      && (language === 'sound_tone_matrix')
  }

  createStore(document: rs.SourceCode) {
    return
  }
}

export default ToneMatrix
