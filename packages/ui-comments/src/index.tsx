/// <reference path='../typeshims/index.d.ts' />
/// <reference path='../typings/index.d.ts' />
import * as rs from '@respace/common'
import CommentsView from './ui/Comments'
import Store from './store'
import CommentsIcon from 'react-icons/fa/comments'

class Comments extends rs.ComponentFactory<rs.Annotations, Store> {
  name = 'ui-comments'
  displayName = 'Comments'
  icon = CommentsIcon
  view = CommentsView
  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'annotations'
  }
  createStore(annotations: rs.Annotations) {
    return new Store(annotations)
  }
}

export default Comments
