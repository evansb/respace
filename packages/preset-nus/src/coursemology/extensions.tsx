import * as rs from '@respace/common'
import * as React from 'react'
import { tokenize } from 'esprima'
import { Button } from 'react-bootstrap'
import { EditorStore } from '@respace/ui-editor'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/do'

export type Props = rs.ComponentExtensionProps<rs.SourceCode, EditorStore>

export function SubmitButton({ document, store }: Props) {
  const handleSubmit = () => {
    const value = store.getEditorValue()
    console.log(value)
    document.publish({ type: 'submit', payload: value } as any)
  }
  return (<Button bsStyle='success' onClick={handleSubmit}>Submit</Button>)
}

export function SubmittedButton(props: Props) {
  return (<Button bsStyle='default' disabled>Submitted</Button>)
}

export function GradedButton(props: Props) {
  return (<Button bsStyle='warning' disabled>Graded</Button>)
}

export interface ITokenCounterState {
  isSelectionActive: boolean
  tokenCount: number
}

export class TokenCounter extends React.Component<Props, ITokenCounterState> {

  constructor(props, ctx) {
    super(props, ctx)
    this.state = {
      tokenCount: 0,
      isSelectionActive: false
    }
  }

  componentDidMount() {
    const editor = this.props.store.getActiveEditor()
    const countToken = () => {
      if (editor.getSelection().isEmpty()) {
        const tokenCount = tokenize(editor.getValue()).length
        this.setState({ tokenCount, isSelectionActive: false })
      } else {
        const value =
          editor.getSession().doc.getTextRange(editor.selection.getRange())
        const tokenCount = tokenize(value).length
        this.setState({ tokenCount, isSelectionActive: true })
      }
    }
    Observable.interval(200).subscribe(() => {
     countToken()
    })
  }

  render() {
    const { isSelectionActive, tokenCount } = this.state
    return (
      <p>{isSelectionActive ? 'Selection' : 'All'}: {tokenCount} tokens</p>
    )
  }
}
