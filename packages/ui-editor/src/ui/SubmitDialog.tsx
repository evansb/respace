import * as React from 'react'
import { observer } from 'mobx-react'
import { Modal, Button } from 'react-bootstrap'
import EditorStore from '../store'

function SubmitDialog({ store }: { store: EditorStore }) {
  const cancel = () => { store.isSubmitConfirmationShown = false }
  const { Header, Title, Body, Footer } = Modal
  return (
    <Modal show={store.isSubmitConfirmationShown} onHide={cancel} >
      <Header closeButton>
        <Title>Confirm Submission</Title>
      </Header>
      <Body>
        <p>Are you sure you want to submit and lock any further changes?</p>
      </Body>
      <Footer>
        <Button onClick={() => store.submit()}>Yes</Button>
        <Button onClick={cancel}>No</Button>
      </Footer>
    </Modal>
  )
}

export default observer(SubmitDialog)
