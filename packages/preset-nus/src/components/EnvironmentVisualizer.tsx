import * as React from 'react'
import * as rs from '@respace/common'
import EnvironmentVisualizerIcon from 'react-icons/fa/image'

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

class EnvironmentVisualizerView extends React.Component<Props, void> {
  componentDidMount() {
    const load = () => {
      loadScript(KINETIC_URL, () => {
        loadScript(BASE_URL + '/environment-visualizer.js', () => {
          console.log('Environment visualizer loaded')
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
    const containerStyle = {
      backgroundColor: '#1E2124',
      width: '100%',
      height: '600px'
    }
    return (
      <div style={style}>
        <div id='visualizer' style={containerStyle}></div>
        <br />
        <small>Note: This is the first year this environment visualizer
          is used, if you encountered any bugs
          please inform your Avenger.</small>
      </div>
    )
  }
}

class EnvionmentVisualizer extends rs.ComponentFactory<rs.SourceCode, void> {
  name = 'ui-environment-visualizer'
  displayName = 'Environment Visualizer'
  icon = EnvironmentVisualizerIcon
  view = EnvironmentVisualizerView

  acceptDocument(document: rs.AnyDocument) {
    const language = (document as rs.SourceCode).language
    const onlineIDEWeek8 = (!!language)
      && (/source-week/.test(language))
      && (parseInt(language.split('-')[2], 10) >= 8)
    const coursemologyWeek8 = (window.interpreter)
      && window.interpreter >= 8
    return document.type === 'source-code'
      && (onlineIDEWeek8 || coursemologyWeek8)
  }

  createStore(document: rs.SourceCode) {
    return
  }
}

export default EnvionmentVisualizer
