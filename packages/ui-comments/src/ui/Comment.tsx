import * as React from 'react'
import * as rs from '@respace/common'
import { Media, Label } from 'react-bootstrap'
import { observer } from 'mobx-react'
import Store from '../store'
import marked from 'marked'

export type IProps = {
  isNew: boolean
  annotation: rs.IAnnotation
  store: Store
}

const styles = {
  main: {
    backgroundColor: '#25272F',
    paddingTop: '5px',
    paddingBottom: '5px'
  },
  image: {
    paddingLeft: '10px',
    verticalAlign: 'middle'
  },
  body: {
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  heading: {
    fontSize: '0.9em',
    fontWeight: 'bold'
  },
  label: {
    marginLeft: '5px'
  }
}

function Comment({ annotation, isNew, store }: IProps) {
  const MediaBody = Media.Body as any
  const MediaHeading = Media.Heading as any
  const label = (annotation.author.role === 'special') &&
    <Label style={styles.label}>Staff</Label>
  const body = (
    <MediaBody style={styles.body}>
      <MediaHeading style={styles.heading}>
        <a href={annotation.author.profileUrl || 'javascript:;'}>
          {annotation.author.name}
        </a>
        {label}
      </MediaHeading>
      <div dangerouslySetInnerHTML={{ __html: marked(annotation.value) }} />
    </MediaBody>
  )
  return (
    <Media style={styles.main}>
      { body }
    </Media>
  )
}

export default observer(Comment)
