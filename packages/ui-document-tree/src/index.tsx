/**
 * This component simply render the document as a JSON Tree.
 * Useful for debugging and testing layout engine.
 */
/// <reference path='../typeshims/index.d.ts' />
import * as React from 'react'
import * as rs from '@respace/common'
import JSONTree from 'react-json-tree'
import { Row, Grid } from 'react-bootstrap'
import DocumentTreeIcon from 'react-icons/fa/tree'

class DocumentTreeView extends React.Component<rs.AnyComponentProps, void> {
  render() {
    const component = this.props.component
    const document = component.document
    return (
      <Grid>
        <Row><h3>{document.meta.title}</h3></Row>
        <Row><JSONTree data={document} /></Row>
      </Grid>
    )
  }
}

class DocumentTree extends rs.ComponentFactory<any, void> {
  name = 'ui-document-tree'
  displayName = 'JSON Tree'
  icon = DocumentTreeIcon
  view = DocumentTreeView
  acceptDocument(document: rs.AnyDocument) {
    return true
  }
  createStore(document: rs.AnyDocument) {
    return {}
  }
}

export default DocumentTree
