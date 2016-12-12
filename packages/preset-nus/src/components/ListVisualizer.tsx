import * as React from 'react'
import * as rs from '@respace/common'
import ListVisualizerIcon from 'react-icons/fa/image'
import { Button } from 'react-bootstrap'

declare var window, currentid, show, layerList, updateButtons, clear_list: any

export type Props = rs.IComponentProps<rs.SourceCode, void>

function loadScript(url, callback) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = callback
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script)
}

const BASE_URL = 'https://source-academy-assets.s3.amazonaws.com/lib'
const KINETIC_URL = BASE_URL + '/KineticJS.js'
const JQUERY_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'

class ListVisualizerView extends React.Component<Props, void> {

  handlePrev = () => {
    if (currentid > 0) { currentid-- }
    show(currentid)
    updateButtons()
  }

  handleNext = () => {
    if (currentid + 1 < layerList.length) { currentid++ }
    show(currentid)
    updateButtons()
  }

  handleClear = () => {
    clear_list()
  }

  componentDidMount() {
    const load = () => {
      loadScript(KINETIC_URL, () => {
        window.stage = new window.Kinetic.Stage({
          width: 1000,
          height: 1000,
          container: 'visualiser-container'
        })
        loadScript(BASE_URL + '/visualizer.js', () => {
          updateButtons()
          console.log('List visualizer loaded')
        })
      })
    }
    if (!window.$) {
      loadScript(JQUERY_URL, load)
    } else {
      load()
    }
  }

  render() {
    const style = {
      padding: '10px'
    }
    return (
      <div style={style}>
        <p>For values such as "*1" in a box, please refer to console
          for output.</p>
        <Button id='prevBtn' onClick={this.handlePrev}>Previous</Button>
        <Button id='nextBtn' onClick={this.handleNext}>Next</Button>
        <Button onClick={this.handleClear}>Clear</Button>
        <div id='visualiser-container' />
      </div>
    )
  }
}

class ListVisualizer extends rs.ComponentFactory<rs.SourceCode, void> {
  name = 'ui-list-visualizer'
  displayName = 'List Visualizer'
  icon = ListVisualizerIcon
  view = ListVisualizerView

  acceptDocument(document: rs.AnyDocument) {
    const language = (document as rs.SourceCode).language
    const onlineIDEWeek5 = (!!language)
      && (/source-week/.test(language))
      && (parseInt(language.split('-')[2], 10) >= 5)
    const coursemologyWeek5 = (window.interpreter)
      && window.interpreter >= 5
    return document.type === 'source-code'
      && (onlineIDEWeek5 || coursemologyWeek5)
  }

  createStore(document: rs.SourceCode) {
    return
  }
}

export default ListVisualizer
