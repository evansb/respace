import * as React from 'react'
import { findDOMNode } from 'react-dom'
import { Row } from 'react-bootstrap'
import * as rs from '@respace/common'
import GradingIcon from 'react-icons/fa/map'

declare const $: JQueryStatic

type Props = rs.IComponentProps<GradingModel, void>

interface IGrading {
  assessment: any
  isSubmitted: boolean
  isGraded: boolean
}

export class GradingModel extends rs.Document<IGrading, any> {
  get assessment() {
    return this.data.assessment
  }
  get isSubmitted() {
    return this.data.isSubmitted
  }

  get isGraded() {
    return this.data.isGraded
  }
}

class GradingView extends React.Component<Props, void> {
  refs: { [name: string]: any, form: any }
  $form: JQuery

  componentDidMount() {
    const $this = findDOMNode(this.refs.form)
    const $form = $('.simple_form.edit_submission').clone()
    $form.find('h2').hide()
    $form.find('h3').hide()
    $form.find('table').first().hide()
    $form.find('.comments').hide()
    $form.find('.panel-danger').hide()
    $form.find('.submission_answers_actable_answer_text').hide()
    const $stats = $form.find('.statistics table')
    $stats.show()
    const $rows = $stats.find('tr')
    $($rows[$rows.length - 1]).hide()
    $($rows[$rows.length - 2]).hide()
    $form.contents().filter(
      function() { return this.nodeType === 3 }).remove()
    $form.appendTo($this).css('display', 'block')
    this.$form = $form
  }

  componentWillUnmount() {
    this.$form.detach()
  }

  render() {
    const document = this.props.component.document
    const assessment = document.assessment || {}
    const baseXp = assessment.base_exp
    return <div>
      { document.isSubmitted && !(document.isGraded) &&
          <h3 style={{padding: '10px'}} >
            Your submission has not been graded.
            Please wait for your Avenger to grade your submission.<br/>
            If your submission is not graded within 24 hours,
            you may want send a reminder to your avenger
            </h3> }
      { baseXp && <h3>Max XP: {baseXp}</h3> }
      <Row ref='form' style={{ position: 'relative', padding: '20px' }} />
    </div>
  }
}

class Grading extends rs.ComponentFactory<any, void> {
  name = 'ui-grading'
  displayName = 'Grading'
  icon = GradingIcon
  view = GradingView

  acceptDocument(document: rs.AnyDocument) {
    return document.type === 'grading'
  }

  createStore(document) {
    return
  }
}

export default Grading
