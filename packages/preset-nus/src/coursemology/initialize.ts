import * as rs from '@respace/common'
import Comments from '@respace/ui-comments'
import Mission, { MissionDescription } from '../components/Mission'
import Grading, { GradingModel } from '../components/Grading'
import initializeRespace from '../initialize'
import loadLibraries from '../loadLibraries'

declare var window: any

const SUBMISSION_DATA_ID = '#submissionData'
const CODE = 'textarea.text.optional.form-control'
const SAVE_BUTTON = 'input[name="commit"]'
const SUBMIT_BUTTON = 'input[name="submission[finalise]"]'

interface IQuestion {
  description: string
}

interface IAssessment {
  status: string
}

interface ISubmissionData {
  submission: ISubmission
  assessment: IAssessment
  questions: IQuestion[]
}

interface ISubmission {
  workflow_state: 'graded' | 'submitted' | 'attempting'
}

function addLinkToWristDevice() {
  const $wristDevice = $(`
    <a class="btn btn-success"
       href="https://sourceacademy.space/courses/5/announcements">
      Wrist Device
    </a>`
  )
  $wristDevice.css({
    position: 'fixed',
    top: '10px',
    left: '5px'
  })
  $wristDevice.appendTo('body')
}

function addLinkToSpaceship() {
  const $spaceship = $(`
    <a class="btn btn-primary"
       href="https://sourceacademy.space/courses/5/assessments">
      Close Source IDE
    </a>`
  )
  $spaceship.css({
    position: 'fixed',
    top: '10px',
    left: '100px'
  })
  $spaceship.appendTo('body')
}

function addLinks() {
  addLinkToWristDevice()
  addLinkToSpaceship()
}

function loadAnnotations() {
  const annotations = {}
  $('.posts').children()
    .filter(function() {
      return $(this).attr('class') === 'discussion_post'
    })
    .map(function() {
      const $this = $(this)
      const createdAt = new Date($this.find('.timestamp').text())
      const value = $this.find('.content').text()
      const posterName = $this.find('h5 a').text()
      const profileUrl = $this.find('h5 a').attr('href')
      const id = $(this).attr('data-post-id')
      annotations[id] = {
        id, createdAt, posterName, profileUrl, value
      }
      return true
    })
  return annotations
}

async function handle(action, document, payload) {
  return new Promise((resolve, reject) => {
    const $code = $(CODE)
    const $saveButton = $(SAVE_BUTTON)
    const $submitButton = $(SUBMIT_BUTTON)
    const code = document.data.value
    switch (action) {
      case 'saveRemote':
        $code.text(code)
        $saveButton.click()
        resolve()
        break

      case 'submit':
        $code.text(code)
        $submitButton.click()
        resolve()
        break

      case 'annotationAdded':
        const url = $('.answer-comment-form').attr('data-action')
        $.post(url, { discussion_post: { text: payload.value } })
          .then((data, status) => {
            if (status === '200') {
              resolve()
            } else {
              reject()
            }
          })
        break
      default: resolve()
    }
  })
}

export default function initialize() {

  $(document).ready(async function() {
    const $data = $(SUBMISSION_DATA_ID)
    if (!$data.get(0)) { return }

    addLinks()

    const { answers, assessment,
      submission, questions, user } = $.parseJSON($data.text())
    const isGraded = submission.workflow_state === 'graded'
    const isSubmitted = submission.workflow_state === 'submitted'
    const answer = answers[0]
    const question = questions[0]

    const { globals, context } = await loadLibraries(assessment.title)

    const sourceCode = {
      value: answer.answer_text || question.description,
      template: question.description,
      language: window.mission_type || 'source-week-3',
      title: assessment.title,
      globals,
      context
    }

    const mission = new MissionDescription({
      type: 'mission',
      meta: {
        id: submission.id + '-mission',
        title: assessment.title,
        group: assessment.title
      },
      data: { description: assessment.description }
    })

    const annotations = new rs.Annotations({
      type: 'annotations',
      meta: {
        id: submission.id + '-annotations',
        title: assessment.title,
        group: assessment.title
      },
      data: {
        annotations: loadAnnotations()
      }
    })

    annotations.author = new rs.User({
      name: user.name,
      profilePicture: user.profile_photo.medium.url
    })

    const extraComponents: rs.AnyComponentFactory[] = [
      new Comments,
      new Mission
    ]

    const extraDocuments: rs.AnyDocument[] = [mission, annotations]

    if (isSubmitted) {
      const grading = new GradingModel({
        type: 'grading',
        meta: {
          id: submission.id + '-grading',
          title: assessment.title,
          group: assessment.title
        },
        data: {
          assessment,
          isSubmitted: isSubmitted || isGraded,
          isGraded
        }
      })
      extraDocuments.push(grading)
      extraComponents.push(new Grading)
    }

    initializeRespace([sourceCode], extraDocuments, extraComponents)
  })
}

