import * as React from 'react'
import * as rs from '@respace/common'
import Store from '../store'
import Comment from './Comment'
import NewComment from './NewComment'
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
    paddingRight: '10px',
    marginBottom: '20px'
  }
  return (
    <div style={style}>
      {annotations}
      <NewComment store={store}/>
    </div>
  )
}

export default observer(Comments)
