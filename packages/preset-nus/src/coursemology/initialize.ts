import * as rs from '@respace/common'
import Comments from '@respace/ui-comments'
import Mission, { MissionDescription } from '../components/Mission'
import Grading, { GradingModel } from '../components/Grading'
import initializeRespace from '../initialize'
import loadLibraries from '../loadLibraries'
import { SubmitButton, GradedButton, TokenCounter,
  SubmittedButton } from './extensions'

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
      const author: rs.IUser = {
        name: posterName,
        profileUrl
      }
      annotations[id] = {
        id, createdAt,
        author,
        value
      }
      return true
    })
  return annotations
}

const codeHandler: rs.ActionHandler<rs.SourceCodeActions.All> = (action) => {
  const code = (<rs.SourceCodeActions.Save> action).payload
  const $saveButton = $(SAVE_BUTTON)
  const $submitButton = $(SUBMIT_BUTTON)
  const $code = $(CODE)
  switch (action.type) {
    case 'save':
      $code.text(code)
      $saveButton.click()
      break
    case 'submit':
      $code.text(code)
      $submitButton.click()
      break
    default: return undefined
  }
  return undefined
}


const annotationHandler: rs.ActionHandler<rs.AnnotationActions.All> =
  (action) => {
    const url = $('.answer-comment-form').attr('data-action')
    const $comment = $('textarea.comment')
    const annotation = (<rs.AnnotationActions.Create> action).payload
    switch (action.type) {
      case 'create':
        $comment.text(annotation.value)
        $.post(url, {
          discussion_post: {
            text: annotation.value
          }
        })
        break
      default: return undefined
    }
    return undefined
  }


export default function initialize() {
  require('./summernotePatch')

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
      readonly: isGraded || isSubmitted,
      globals,
      handlers: [codeHandler],
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

    annotations.subscribe(annotationHandler)

    const extraComponents: rs.AnyComponentFactory[] = [
      new Comments,
      new Mission,
      new Grading
    ]

    const extraDocuments: rs.AnyDocument[] = [mission, annotations]

    if (isSubmitted || isGraded) {
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
    }

    let toolbarButton
    if (isGraded) {
      toolbarButton = GradedButton
    } else if (isSubmitted) {
      toolbarButton = SubmittedButton
    } else {
      toolbarButton = SubmitButton
    }

    let statusbarExts: any[] = []
    if (window.displayTokenCounter) {
      statusbarExts.push(TokenCounter)
    }

    initializeRespace([sourceCode], extraDocuments, extraComponents, {
      toolbar: [toolbarButton],
      statusbar: statusbarExts
    })
  })
}

