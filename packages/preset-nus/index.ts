import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import Editor from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import Comments from '@respace/ui-comments'
import Mission from './Mission'
import Canvas from './Canvas'
import '@respace/theme-dark'
import testDocuments from './testDocuments'

declare const window: any

export function initialize(documents) {

  const workspace = Workspace.create({
    components: [Editor, Interpreter, Canvas, Comments, Mission],
    documents: documents || testDocuments,
    layoutEngine: GoldenLayout
  })

  let container
  if (container = document.getElementById('root')) {
    workspace.render(container)
  }
}

$(document).ready(function() {
  const $data = $('#submissionData')
  if (!$data.get(0)) { return }
  const data = $.parseJSON($data.text())
  const submission = data.submission
  const assessment = data.assessment
  const answer = data.answers[0]
  const question = data.questions[0]
  const $code =
    $('textarea#submission_answers_attributes_0_actable_attributes_answer_text')
  const $saveButton = $('input[name="commit"]')
  const $submitButton = $('input[name="submission[finalise]"]')

  const source = {
      type: 'source-code',
    meta: {
      id: submission.id,
      title: assessment.title
    },
    data: {
      value: answer.answer_text || question.description,
      template: question.description,
      description: assessment.description
    },
    volatile: {
      isSubmitted: (submission.workflow_state === 'submitted')
    },
    handlers: [
      function(action, document) {
        return new Promise(function(resolve, reject) {
          if (action !== 'save') {
            resolve()
            return
          }
          try {
            const code = document.data.value
            $code.text(code)
            $saveButton.click(function() {
              resolve()
            })
          } catch (e) {
            reject(e)
          }
        })
      },
      function(action, document) {
        return new Promise(function(resolve, reject) {
          if (action !== 'submit') {
            resolve()
            return
          }
          try {
            const code = document.data.value
            $code.text(code)
            $submitButton.click()
          } catch (e) {
            reject(e)
          }
        })
      }
    ]
  }
  initialize([source])
})
