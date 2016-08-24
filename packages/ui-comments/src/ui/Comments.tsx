import * as React from 'react'
import * as rs from '@respace/common'
import Store from '../store'
import Comment from './Comment'
import { observer } from 'mobx-react'

export type IProps = rs.IComponentProps<rs.SourceCode, Store>

function Comments(props: IProps) {
  const store: Store = props.component.store
  const annotations = store.allAnnotations
    .map((a, idx) => {
      return <Comment key={idx} isNew={false} annotation={a} store={store}/>
    })
  const style = {
    paddingTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px'
  }
  const newAnnotation = {
    posterName: store.posterName,
    posterRole: store.posterRole,
    profileUrl: store.profileUrl,
    profilePicture: store.profilePicture,
    value: store.newAnnotationValue,
  }
  return (
    <div style={style}>
      {annotations}
      <Comment isNew annotation={newAnnotation} store={store}/>
    </div>
  )
}

export default observer(Comments)
