import Comments from '@respace/ui-comments'
import Mission from '../components/Mission'
import Grading from '../components/Grading'
import initializeRespace from '../initialize'
import loadLibraries from '../loadLibraries'

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
      Spaceship
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
  require('./summernotePatch')

  $(document).ready(async function() {
    const $data = $(SUBMISSION_DATA_ID)
    if (!$data.get(0)) { return }

    addLinks()

    const { user, answers,
      assessment, submission, questions } = $.parseJSON($data.text())
    const isGraded = submission.workflow_state === 'graded'
    const isSubmitted = submission.workflow_state === 'submitted'
    const answer = answers[0]
    const question = questions[0]
    const annotations = loadAnnotations()

    const { globals, context } = await loadLibraries(assessment.title)

    const meta = {
      id: submission.id,
      title: assessment.title
    }

    const data = { value: answer.answer_text || question.description }
    const source = {
      type: 'source-code',
      meta,
      data,
      volatile: {
        annotations,
        template: question.description,
        description: assessment.description,
        isSubmitted: isSubmitted || isGraded,
        isRemote: true,
        isGraded: isGraded,
        user,
        globals: ['alert'].concat(globals),
        context,
        assessment,
        answer,
        question
      },
      handlers: [handle]
    }
    const extraComponents = [Comments, Grading, Mission]
    initializeRespace([source], extraComponents)
  })
}

