/**
 * This component simply render the document as a JSON Tree.
 * Useful for debugging and testing layout engine.
 */
/// <reference path='../typeshims/index.d.ts' />
import * as React from 'react'
import * as rs from '@respace/common'
import JSONTree from 'react-json-tree'

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
}

class DocumentTreeView extends React.Component<rs.IComponentProps, void> {
  render() {
    const props = { data: this.props.document, theme, isLightTheme: false }
    return <JSONTree {...props} />
  }
}

const DocumentTree: rs.IComponentFactory<rs.IBasicProps, any> = {
  name: 'ui-document-tree',
  displayName: 'JSON Tree',
  view: DocumentTreeView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return true
  },
  initialProps(document: rs.AnyDocument) {
    return { title: document.meta.title || 'Untitled Document' }
  }
}

export default DocumentTree
