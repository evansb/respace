import * as rs from '@respace/common'
import * as React from 'react'
import { Button } from 'react-bootstrap'
import { EditorStore } from '@respace/ui-editor'

export type Props = rs.ComponentExtensionProps<rs.SourceCode, EditorStore>

export function SubmitButton({ document }: Props) {
  const handleSubmit = () => {
    document.publish({ type: 'submit', payload: document.value } as any)
  }
  return (<Button bsStyle='success' onClick={handleSubmit}>Submit</Button>)
}

export function SubmittedButton(props: Props) {
  return (<Button bsStyle='default' disabled>Submitted</Button>)
}

export function GradedButton(props: Props) {
  return (<Button bsStyle='warning' disabled>Graded</Button>)
}
