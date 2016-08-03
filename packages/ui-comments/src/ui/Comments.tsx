import * as React from 'react'
import * as rs from '@respace/common'
import Store from '../store'
import Comment from './Comment'
import { observer } from 'mobx-react'

export type IProps = rs.IComponentProps<rs.documents.ISourceCode, Store>

function Comments(props: IProps) {
  const store: Store = props.component.state
  const annotations = store.allAnnotations
    .map((a, idx) => {
      return <Comment key={idx} isNew={false} annotation={a} store={store}/>
    })
  const style = {
    paddingTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px'
  }
  return (
    <div style={style}>
      {annotations}
      <Comment isNew annotation={store.newAnnotation} store={store}/>
    </div>
  )
}

export default observer(Comments)
