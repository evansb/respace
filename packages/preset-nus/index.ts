import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import DocumentTree from '@respace/ui-document-tree'
import '@respace/theme-dark'

const testDocuments = [
  {
    type: 'source-code',
    meta: {
      title: 'Test'
    },
    data: {
      template: 'function bar() { return 3; }',
      value: 'function foo() { return 2; }'
    }
  },
  {
    type: 'source-code',
    meta: {
      title: 'Test 2'
    },
    data: {
      template: 'function zap() { return 3; }',
      value: 'function zoo() { return 2; }'
    }
  }
]

const workspace = Workspace.create(GoldenLayout)

let container
if (container = document.getElementById('root')) {
  workspace.use(DocumentTree)
  workspace.render(container).then(() => {
    workspace.addDocument.apply(workspace, testDocuments)
  })
}
