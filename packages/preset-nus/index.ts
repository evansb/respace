import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import Editor from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import Comments from '@respace/ui-comments'
import Mission from './Mission'
import Canvas from './Canvas'
import '@respace/theme-dark'
import testDocuments from './testDocuments'

declare var window: any

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
