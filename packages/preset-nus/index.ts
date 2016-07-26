import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import DocumentTree from '@respace/ui-document-tree'
import Editor from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import '@respace/theme-dark'

const saveHandler = function (action, document) {
  if (action === 'save') {
    console.log('Saved!')
    console.log(JSON.stringify(document))
    return Promise.resolve()
  } else {
    return Promise.resolve()
  }
}

const testDocuments = [
  {
    type: 'source-code',
    meta: {
      id: 'Test',
      title: 'Test'
    },
    data: {
      template: 'function bar() { return 3; }',
      value: 'function foo() { return 2; }'
    },
    handlers: [ saveHandler ]
  },
  {
    type: 'source-code',
    meta: {
      id: 'Test2',
      title: 'Test 2'
    },
    data: {
      template: 'function zap() { return 3; }',
      value: 'function zoo() { return 2; }'
    },
    handlers: [ saveHandler ]
  }
]

const workspace = Workspace.create({
  components: [DocumentTree, Editor, Interpreter],
  documents: testDocuments,
  layoutEngine: GoldenLayout
})

let container
if (container = document.getElementById('root')) {
  workspace.render(container)
}
