import * as React from 'react'
import * as rs from '@respace/common'

export interface IProps extends rs.IComponentProps<rs.documents.ISourceCode> {
}

export default class Editor extends React.Component<IProps, void> {
  render() {
    return <div>{this.props.document.data.value}</div>
  }
}
