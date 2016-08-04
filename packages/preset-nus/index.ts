import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import Editor from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import Comments from '@respace/ui-comments'
import Mission from './Mission'
import Canvas from './Canvas'
import '@respace/theme-dark'
import createMission2 from './createMission2'

declare var window: any

window.onload = () => {
  const { globals, context } = createMission2()

  const saveHandler = function (action, document) {
    if (action === 'save') {
      console.log('Saved!')
      console.log(JSON.stringify(document))
      return Promise.resolve()
    } else {
      return Promise.resolve()
    }
  }

  const submitHandler = function (action, document) {
    if (action === 'submit') {
      console.log('Submitted!')
      console.log(JSON.stringify(document))
      return Promise.resolve()
    } else {
      return Promise.resolve()
    }
  }
  const description = `
          # Mission Briefing
          Hello and thanks for trying the new IDE.
          A task can have a description, here is one example.

          It supports **rich** *text* styling using Markdown.

          Feel free to try the IDE, all Mission 2 (Rune 2D) functions are
          imported.

          # New Interpreter

          The interpreter you are using now is the new one.
          Previously the compiler passes are:

          \`\`\`
          Parse(Jediscript) -> Evaluate
          \`\`\`

          Now it is

          \`\`\`
          Parse(Javascript) -> Lint(Source) -> Sanitize-AST(Source) -> Evaluate
          \`\`\`

          Benefit: More helpful error message, especially if the user
          doesn't violate Javascript grammar.

          E.g try this
          \`\`\`
          if (true) {
            2;
          }
          \`\`\`

          and this
          \`\`\`
          x = 2
          \`\`\`

          Yes, the error message could be better for the latter but it's already
          far better than the old error message.

          Also the AST is ESTree compliant which works with
          lots of code analysis library.

          Checkout the new runtime source code at
          [Github](http://github.com/evansb/source-toolchain)
        `
  const lines: string[] = []
  description.split('\n').forEach(d => lines.push(d.trim()))
  const testDocuments = [
    {
      type: 'source-code',
      meta: {
        id: 'Task1',
        title: 'Task 1',
        submitted: false
      },
      data: {
        template: 'function bar() { return 3; }',
        description: lines.join('\n'),
        value: 'function foo() { return 2; }',
        annotations: {
          one: {
            createdAt: new Date(),
            posterName: 'Evan Sebastian',
            posterRole: 'Avenger',
            profileUrl: 'https://www.facebook.com/sbsevn',
            profilePicture: 'http://placekitten.com/200/300',
            value: 'Hello how are you'
          },
          two: {
            createdAt: new Date(),
            posterName: 'Some Dude',
            profileUrl: 'https://www.facebook.com/sbsevn',
            profilePicture: 'http://placekitten.com/200/300',
            value: 'Write comment *in* **markdown**'
          }
        }
      },
      handlers: [ saveHandler, submitHandler ],
      volatile: {
        context,
        globals
      }
    },
    {
      type: 'source-code',
      meta: {
        id: 'Task2',
        title: 'Task 2',
        submitted: false
      },
      data: {
        template: 'function zap() { return 3; }',
        value: 'function zoo() { return 2; }'
      },
      handlers: [ saveHandler, submitHandler ]
    }
  ]

  const workspace = Workspace.create({
    components: [Editor, Interpreter, Canvas, Comments, Mission],
    documents: testDocuments,
    layoutEngine: GoldenLayout
  })

  let container
  if (container = document.getElementById('root')) {
    workspace.render(container)
  }
}
