import * as React from 'react'
import { observer } from 'mobx-react'
import { ISnapshotError, ILanguageService } from '../language-service'
import { Tab, Button } from 'react-bootstrap'

import SnapshotData from '../snapshot-data'
import Store from '../store'

export interface IProps {
  snapshotData: SnapshotData<any, any>
  store: Store<any, any>
}

export interface IErrorProps {
  style: any
  service: ILanguageService<any, any>
  error: ISnapshotError<any>
}

export interface IErrorState {
  detailed: boolean
}

function LogView({ log, style }) {
  return <pre style={style}>{log}</pre>
}

class ErrorView extends React.Component<IErrorProps, IErrorState> {
  constructor(props) {
    super(props)
    this.state = { detailed: false }
  }
  handleClick() {
    this.setState({ detailed: !this.state.detailed })
  }
  render() {
    const { error, style } = this.props
    const lines = this.props.service.errorToString(error).split('\n')
    const rest = this.state.detailed ? '\n' + lines.slice(1).join('\n') : ''
    lines[0] = (error.severity === 'warning' ?
      'Warning: ' : 'Error: ') + lines[0]
    const showMore = lines.length > 1 && (
      <Button bsStyle='link' onClick={this.handleClick.bind(this)}>
        { this.state.detailed ? 'Show Less' : 'Show More'}
      </Button>
    )
    return <pre style={style}>{lines[0]}{showMore}{rest}</pre>
  }
}

function SnapshotResult({ snapshotData, store }: IProps) {
  const errors = this.props.snapshotData.errors
  const logs = this.props.snapshotData.logs
  const Container = Tab.Container
  const Content = Tab.Content
  const Pane = Tab.Pane
  const paneStyle = { position: 'relative' }
  const dropdownStyle = {
    position: 'absolute',
    top: '0px',
    right: '10px'
  }
  const valueStyle = {
    margin: 0,
    whiteSpace: 'pre-wrap',
    position: 'relative',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '10px',
    fontSize: '12px',
    backgroundColor: '#17181A',
    borderColor: '#1E2124'
  }
  const valueString = snapshotData.valueString
  const selectButton = <a>{snapshotData.valueType}</a>
  const valueView = snapshotData.done && (
    <pre style={valueStyle}>
      {valueString}
      { <div style={dropdownStyle}>{ selectButton }</div> }
    </pre>
  )
  let errorsView: JSX.Element | undefined
  if (errors.length > 0) {
    errorsView = errors.map((e, idx) => {
      let color
      if (e.severity === 'warning') {
        color = 'yellow'
      } else  {
        color = 'red'
      }
      const errorStyle = Object.assign({}, valueStyle, { color })
      return <ErrorView service={snapshotData.service}
                  key={idx} error={e} style={errorStyle} />
    })
  }
  let logsView: JSX.Element | undefined
  if (logs.length > 0) {
    const logStyle = Object.assign({}, valueStyle, {
      color: 'cyan'
    })
    logsView = logs.map((log, idx) =>
      <LogView key={idx} log={log} style={logStyle} />
    )
  }
  return (
    <Container defaultActiveKey='raw' id='result'>
      <Content animation>
        <Pane style={paneStyle} eventKey='raw'>
          { errorsView || null }
          { logsView || null }
          { valueView || null }
        </Pane>
        <Pane eventKey='special'>
        </Pane>
      </Content>
    </Container>
  )
}

export default observer(SnapshotResult)
