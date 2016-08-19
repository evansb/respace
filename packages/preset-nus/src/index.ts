import $ from 'jquery'
import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import Editor from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import Comments from '@respace/ui-comments'
import Mission from './Mission'
import Canvas from './Canvas'
import Grading from './Grading'
import '@respace/theme-dark'
import testDocuments from './testDocuments'
import './summernotePatch'

declare const window: any

const baseLib = 'https://source-academy-assets.s3.amazonaws.com/lib'

const isSourceAcademy = /sourceacademy.space/.test(window.location)

async function importForeignCoursemology(title: string) {
  title = title.toLowerCase().replace(' ', '-')
  let globals: string[] = []
  let context: {[name: string]: any} = { alert: window.alert,
    Math: window.Math }
  const json = await <any> $.getJSON(`${baseLib}/${title}.json`)
  if (json.libraries instanceof Array &&
        (<string[]> json.libraries).every(s => typeof s === 'string')) {
    await Promise.all(json.libraries.map(g => $.getScript(`${baseLib}/${g}`)))
  }
  window.export_symbol = (s, m) => {
    globals.push(s)
    context[s] = m
  }
  await <any> $.getScript(`${baseLib}/${title}.js`)
  return {globals, context}
}

function initializeOfflineZip() {
  const source = {
    type: 'source-code',
    meta: {
      id: document.title || 'Untitled',
      title: document.title || 'Untitled',
      submitted: false
    },
    data: {
      template: '',
      value: '',
    },
    handlers: [],
    volatile: {
      context: window,
      globals: window.GLOBALS
    }
  }
  initialize([source])
}

export async function initialize(documents?, extraComponents?) {
  const workspace = Workspace.create({
    components: [Editor, Interpreter, Canvas].concat(extraComponents || []),
    documents,
    layoutEngine: GoldenLayout,
  })
  let container
  if (container = document.getElementById('root')) {
    workspace.render(container)
  }
}

if (isSourceAcademy) {
  $(document).ready(async function() {
    const $data = $('#submissionData')
    if (!$data.get(0)) { return }
    const data = $.parseJSON($data.text())
    const submission = data.submission
    const isGraded = submission.workflow_state === 'graded'
    const isSubmitted = submission.workflow_state === 'submitted'
    const assessment = data.assessment
    const user = data.user
    const answer = data.answers[0]
    const question = data.questions[0]
    const $code = $('textarea.text.optional.form-control')
    const $saveButton = $('input[name="commit"]')
    const $submitButton = $('input[name="submission[finalise]"]')
    const url =
      'https://source-academy-assets.s3.amazonaws.com/markdown/mission-1.md'
    if (!assessment.description) {
      assessment.description = await new Promise((resolve, reject) => {
        $.get(url, (data) => resolve(data))
      })
    }
    const annotations = {}
    $('.posts').children()
      .filter(function() { return $(this).attr('class') === 'discussion_post' })
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

    const {globals, context} = await importForeignCoursemology(assessment.title)

    const source = {
      type: 'source-code',
      meta: {
        id: submission.id,
        title: assessment.title
      },
      data: {
        value: answer.answer_text || question.description,
      },
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
      handlers: [
        function(action, document) {
          return new Promise(function(resolve, reject) {
            if (action !== 'saveRemote') {
              resolve()
              return
            }
            try {
              const code = document.data.value
              $code.text(code)
              $saveButton.click()
              resolve()
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
        },
        function(action, document, annotation) {
          return new Promise(function(resolve, reject) {
            if (action !== 'annotationAdded') {
              resolve()
              return
            }
            try {
              const url = $('.answer-comment-form').attr('data-action')
              window.$.post(url, {
                discussion_post: {
                  text: annotation.value
                }
              }, () => {
                resolve()
              })
            } catch (e) {
              reject(e)
            }
          })
        }
      ]
    }
    const extraComponents = [Comments, Grading, Mission]
    $('<a class="btn btn-success" href="https://sourceacademy.space/courses/5/announcements">Wrist Device</a>').css({ // tslint:disable-line
       position: 'fixed',
       top: '10px',
       left: '5px'
     }).appendTo('body')
     $('<a class="btn btn-primary" href="https://sourceacademy.space/courses/5/assessments">Spaceship</a>').css({ // tslint:disable-line
       position: 'fixed',
       top: '10px',
       left: '100px'
     }).appendTo('body')
    initialize([source], extraComponents)
  })
} else if (window.GLOBALS) {
  initializeOfflineZip()
} else {
  initialize(testDocuments, [Mission])
}
