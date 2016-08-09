import $ from 'jquery'
import * as React from 'react'
import { findDOMNode } from 'react-dom'
import * as rs from '@respace/common'

const icon: React.ComponentClass<void> =
  require('react-icons/fa/map').default

type IGrading = {}
type Props = rs.IComponentProps<IGrading, void>

class GradingView extends React.Component<Props, void> {
  $form: JQuery

  componentDidMount() {
    const $this = findDOMNode(this)
    const $form = $('.simple_form.edit_submission').clone()
    $form.find('h2').hide()
    $form.find('h3').hide()
    $form.find('table').first().hide()
    $form.find('.comments').hide()
    $form.find('.panel-danger').hide()
    $form.find('.submission_answers_actable_answer_text').hide()
    $form.find('input[name="commit"]').hide()
    $form.find('.statistics table').show()
    $form.contents().filter(
      function() { return this.nodeType === 3 }).remove()
    $form.appendTo($this).css('display', 'block')
    this.$form = $form
  }

  componentWillUnmount() {
    this.$form.detach()
  }

  render() {
    return <div style={{ position: 'relative', padding: '20px' }}></div>
  }
}

const Grading: rs.IComponentFactory<IGrading, void> = {
  name: 'ui-grading',
  displayName: 'Grading',
  icon,
  view: GradingView,
  shouldProcessDocument(document: rs.AnyDocument) {
    return document.type === 'source-code' && document.volatile.isSubmitted
  },
  initialState(document: rs.IDocument<IGrading>) {
    return
  }
}

export default Grading
