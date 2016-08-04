import * as React from 'react'
import { printValueToString } from 'the-source'
import Store, { SnapshotData } from '../store'
import { observer } from 'mobx-react'
import { printErrorToString, ISnapshotError, unbox } from 'the-source'
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
    const showMore = (
      <Button bsStyle='link' onClick={this.handleClick.bind(this)}>
        { this.state.detailed ? 'Show Less' : 'Show More'}
      </Button>
    )
    return <pre style={style}>{lines[0]}{showMore}{rest}</pre>
  }
}
function SnapshotResult({ snapshotData, store }: IProps) {
  const snapshot = this.props.snapshotData.snapshot
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
  let valueType = 'Error'
  const value = snapshot.done && snapshot.value && (
    <pre style={valueStyle}>{printValueToString(snapshot.value,
      store.context)}</pre>
  )
  let errorsView: JSX.Element | undefined
  if (errors.length > 0) {
    const errorStyle = Object.assign({}, valueStyle, { color: 'red' })
    errorsView = errors.map((e, idx) =>
      <ErrorView key={idx} error={e} style={errorStyle} />)
  }
  if (snapshot.done && snapshot.value) {
    if (snapshot.value.type === 'foreign') {
      valueType =
        (typeof unbox(snapshot.value, snapshot.context)) + ' (foreign)'
    } else {
      valueType = snapshot.value.type
    }
  }
  const selectButton = <a>{valueType}</a>
  return (
    <Container defaultActiveKey='raw' id='result'>
      <Content animation>
        <Pane style={paneStyle} eventKey='raw'>
          { value || null }
          { errorsView || null }
          { !errorsView && <div style={dropdownStyle}>{ selectButton }</div> }
        </Pane>
        <Pane eventKey='special'>
        </Pane>
      </Content>
    </Container>
  )
}

export default observer(SnapshotResult)
