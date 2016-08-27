import * as rs from '@respace/common'
import { Workspace } from '@respace/core'
import Editor, { EditorStore } from '@respace/ui-editor'
import Interpreter from '@respace/ui-interpreter'
import Canvas from './components/Canvas'
import createSourceService from './createSourceService'

import '@respace/theme-dark'

export default function initialize(
  sourceCodes: {
    title: string
    value: string
    template: string
    language: string
    globals: string[]
    readonly?: boolean
    disablePersistence?: boolean
    handlers?: rs.ActionHandler<rs.SourceCodeActions.All>[]
    context: any
  }[],
  extraDocuments: rs.AnyDocument[] = [],
  extraComponents: rs.AnyComponentFactory[] = [],
  editorExtensions: rs.ComponentExtensions<rs.SourceCode, EditorStore> = {}
) {
  const container = document.getElementById('root') || document.body
  const interpreters: rs.AnyComponentFactory[] = sourceCodes.map(sc => {
    const service = createSourceService({
      language: sc.language || 'source-week-3',
      globals: sc.globals,
      context: sc.context
    })
    return new Interpreter({}, service)
  })
  const basicComponents: rs.ComponentFactory<any, any>[] = [
    new Editor(editorExtensions),
    new Canvas
  ]
  const components = basicComponents
    .concat(extraComponents)
    .concat(interpreters)
  const documents: rs.AnyDocument[] =
    extraDocuments.concat(sourceCodes.map(sc => {
      const code = new rs.SourceCode(sc.value, sc.template,
        sc.language, sc.title)
      code.id = sc.title
      if (sc.disablePersistence) {
        code.setPersistence(false)
      }
      if (sc.readonly) {
        code.setReadOnly(true)
      }
      if (sc.handlers instanceof Array) {
        sc.handlers.forEach(h => { code.subscribe(h) })
      }
      return code
    }))
  const workspace = Workspace.create({ components, documents })
  workspace.render(container)
}
