import * as React from 'react'
import Store, { SnapshotData } from '../store'
import { observer } from 'mobx-react'
import { printErrorToString, ISnapshotError } from 'the-source'
import { Tab, Button } from 'react-bootstrap'

export interface IProps {
  snapshotData: SnapshotData
  store: Store
}

export interface IErrorProps {
  style: any
  error: ISnapshotError
}

export interface IErrorState {
  detailed: boolean
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
    const lines = printErrorToString(error).split('\n')
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
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '10px',
    fontSize: '12px',
    backgroundColor: '#17181A',
    borderColor: '#1E2124'
  }
  const valueString = snapshotData.valueString
  const valueView = snapshotData.isDone && (
    <pre style={valueStyle}>{valueString}</pre>
  )
  let errorsView: JSX.Element | undefined
  if (errors.length > 0) {
    errorsView = errors.map((e, idx) => {
      const errorStyle = Object.assign({}, valueStyle, {
        color: e.severity === 'warning' ? 'yellow' : 'red'
      })
      return <ErrorView key={idx} error={e} style={errorStyle} />
    })
  }
  const selectButton = <a>{snapshotData.valueType}</a>
  return (
    <Container defaultActiveKey='raw' id='result'>
      <Content animation>
        <Pane style={paneStyle} eventKey='raw'>
          { errorsView || null }
          { valueView || null }
          { !errorsView && <div style={dropdownStyle}>{ selectButton }</div> }
        </Pane>
        <Pane eventKey='special'>
        </Pane>
      </Content>
    </Container>
  )
}

export default observer(SnapshotResult)
