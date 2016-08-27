import * as React from 'react'
import { Button, Tab, Nav, NavItem, Row, Col } from 'react-bootstrap'
import { Editor } from '@respace/helper-ace'
import { observer } from 'mobx-react'
import Store from '../store'
import marked from 'marked'

type Props = {
  store: Store
}

const editorStyle = {
  minHeight: '100px'
}

const previewStyle = {
  minHeight: '100px',
  padding: '10px',
  backgroundColor: '#25272F'
}

function NewComment({ store }: Props) {
  const TabContainer = Tab.Container
  const TabContent = Tab.Content
  const TabPane = Tab.Pane
  const editorDidMount = (editor: AceAjax.Editor) => {
    store.setCommentEditor(editor)
  }

  const editor = <Editor style={editorStyle} didMount={editorDidMount} />

  return (
    <TabContainer defaultActiveKey={1} id='new-comment-tab'>
    <div style={{paddingTop: '10px'}}>
        <TabContent animation>
          <TabPane eventKey={1}>{editor}</TabPane>
          <TabPane eventKey={2}>
            <div style={previewStyle} dangerouslySetInnerHTML={{
              __html: marked(store.newAnnotationValue)
            }} />
          </TabPane>
        </TabContent>
        <Row>
          <Col xs={8}>
            <Nav bsStyle='tabs'>
              <NavItem eventKey={1}>Edit</NavItem>
              <NavItem eventKey={2}>Preview</NavItem>
            </Nav>
          </Col>
          <Col xs={4} style={{textAlign: 'right'}}>
            <Button onClick={() => { store.addAnnotation() }} bsStyle='success'>
              Post
            </Button>
          </Col>
      </Row>
    </div>
  </TabContainer>
  )
}

export default observer(NewComment)
