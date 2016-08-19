/// <reference path='../typeshims/index.d.ts' />
/// <reference path='../typings/index.d.ts' />
import * as rs from '@respace/common'
import CommentsView from './ui/Comments'
import Store from './store'

const icon = require('react-icons/fa/comments').default

const Comments: rs.IComponentFactory<rs.documents.ISourceCode, Store> = {
  name: 'ui-comments',
  displayName: 'Comments',
  icon,
  view: CommentsView,
  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'source-code'
  },
  initialState(document: rs.IDocument<rs.documents.ISourceCode>) {
    return new Store(document)
  }
}

export default Comments
