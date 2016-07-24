import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import DocumentTree from '@respace/ui-document-tree'
import '@respace/theme-dark'

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
    }
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
    }
  }
]

const workspace = Workspace.create({
  components: [DocumentTree],
  documents: testDocuments,
  layoutEngine: GoldenLayout
})

let container
if (container = document.getElementById('root')) {
  workspace.render(container)
}
