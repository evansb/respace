import { Workspace } from '@respace/core'
import '@respace/theme-light'

const workspace = Workspace.create()

let container
if (container = document.getElementById('root')) {
  workspace.render(container)
}
