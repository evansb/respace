import * as rs from '@respace/common'
import { Workspace } from '@respace/core'
import GoldenLayout from '@respace/layout-golden'
import Editor from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import Canvas from './components/Canvas'

import '@respace/theme-dark'

export default function initialize(
  documents: rs.AnyDocumentJSON[] = [],
  extraComponents: rs.AnyComponentFactory[] = [],
  container: HTMLElement = document.getElementById('root') || document.body
) {
  const basicComponents = [Editor, Interpreter, Canvas]
  const workspace = Workspace.create({
    components: basicComponents.concat(extraComponents),
    documents,
    layoutEngine: GoldenLayout,
  })
  workspace.render(container)
}
