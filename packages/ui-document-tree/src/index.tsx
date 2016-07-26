/**
 * This component simply render the document as a JSON Tree.
 * Useful for debugging and testing layout engine.
 */
/// <reference path='../typeshims/index.d.ts' />
import * as React from 'react'
import * as rs from '@respace/common'
import JSONTree from 'react-json-tree'
import { Row, Grid } from 'react-bootstrap'

const icon: React.ComponentClass<void> = require('react-icons/fa/tree').default

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

const DocumentTree: rs.IComponentFactory<any, void> = {
  name: 'ui-document-tree',
  displayName: 'JSON Tree',
  icon,
  view: DocumentTreeView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return true
  },
  initialState(document: rs.AnyDocument) {
    return {}
  }
}

export default DocumentTree
