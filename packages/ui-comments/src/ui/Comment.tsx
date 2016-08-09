import * as React from 'react'
import * as rs from '@respace/common'
import { Media, Label, Button } from 'react-bootstrap'
import { observer } from 'mobx-react'
import Store from '../store'
import TextArea from 'react-textarea-autosize'
import marked from 'marked'

export type IProps = {
  isNew: boolean
  annotation: rs.documents.IAnnotation
  store: Store
}

function Comment({ annotation, isNew, store }: IProps) {
  const MediaLeft = Media.Left as any
  const MediaBody = Media.Body as any
  const MediaHeading = Media.Heading as any
  const src = annotation.profilePicture
  const style = {
    backgroundColor: '#25272F',
    paddingTop: '5px',
    paddingBottom: '5px'
  }
  const imageStyle = {
    paddingLeft: '10px',
    verticalAlign: 'middle'
  }
  const bodyStyle = {
    paddingLeft: '10px',
    paddingRight: '10px'
  }
  const headingStyle = {
    fontSize: '0.9em',
    fontWeight: 'bold'
  }
  const labelStyle = {
    marginLeft: '5px'
  }
  const textareaStyle = {
    minHeight: '100px',
    fontFamily: 'monospace',
    padding: '10px',
    resize: 'none',
    width: '95%',
    color: 'white',
    backgroundColor: '#1D1F21'
  }
  const label = (annotation.posterRole === 'staff') &&
    <Label style={labelStyle}>Avenger</Label>
  let body
  if (isNew) {
    let newComment
    if (store.isEditMode) {
      newComment = <TextArea
        placeholder='Add a comment...'
        defaultValue={store.newAnnotationValue}
        onChange={e => { store.newCommentChange(e.target.value) }}
        style={textareaStyle} rows={3} />
    } else {
      newComment = <div dangerouslySetInnerHTML={{
        __html: marked(store.newAnnotationValue)
      }} />
    }

    body = (
      <MediaBody>
        { newComment }
        <div style={{textAlign: 'right', marginRight: '10px'}}>
          <Button style={{marginRight: '10px'}}
            onClick={() => { store.isEditMode = !store.isEditMode }}>
            { store.isEditMode ? 'Preview' : 'Edit' }
          </Button>
          <Button onClick={() => { store.addAnnotation() }} bsStyle='success'>
            Post
          </Button>
        </div>
      </MediaBody>
    )
  } else {
    body = (
      <MediaBody style={bodyStyle}>
        <MediaHeading style={headingStyle}>
          <a href={annotation.profileUrl || 'javascript:;'}>
            {annotation.posterName}
          </a>
          {label}
        </MediaHeading>
         <div dangerouslySetInnerHTML={{
            __html: marked(annotation.value)
          }} />
      </MediaBody>
    )
  }
  return (
    <Media style={style}>
      <MediaLeft style={imageStyle}>
        { src && <img width={24} height={24} src={src} /> }
      </MediaLeft>
      { body }
    </Media>
  )
}

export default observer(Comment)
