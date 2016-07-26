import * as React from 'react'
import { observer } from 'mobx-react'
import { Modal, Button } from 'react-bootstrap'
import EditorStore from '../store'

function RevertDialog({ store }: { store: EditorStore }) {
  const cancel = () => { store.isRevertConfirmationShown = false }
  const { Header, Title, Body, Footer } = Modal
  return (
    <Modal show={store.isRevertConfirmationShown} onHide={cancel} >
      <Header closeButton>
        <Title>Confirm Start Over</Title>
      </Header>
      <Body>
        <p>Are you sure you want to revert all progress of this document to its
        initial template?</p>
      </Body>
      <Footer>
        <Button onClick={() => store.revert()}>Yes</Button>
        <Button onClick={cancel}>No</Button>
      </Footer>
    </Modal>
  )
}

export default observer(RevertDialog)
