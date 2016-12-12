import $ from 'jquery'
window.$ = $
import initializeRespace from '../initialize'

declare interface WindowWithGlobals {
  GLOBALS: string[]
  mission_type: string
}

const codeHandler: rs.ActionHandler<rs.SourceCodeActions.All> = (action) => {
  for (var i = 0; i <= window.sourceCodes.length - 1; i++) {
    window.sourceCodes[i].saveLocal()
  }
  return undefined
}

declare var window: WindowWithGlobals

export default function initialize() {
  window.GLOBALS = window.GLOBALS || []
  if ($('.pe-question')) {
     const codes = $('.pe-question').map(function () {
       return $(this).text()
     })
     let sources = []
     codes.each(function (idx, code) {
       sources.push({
        title: 'Question ' + (idx + 1),
        language: window.mission_type,
        template: code,
        value: code,
        handlers: [codeHandler],
        context: window.CONTEXT,
        globals: window.GLOBALS
       })
     })
     initializeRespace(sources)
  } else {
    const source = {
      title: document.title || 'Untitled',
      language: window.mission_type,
      template: '',
      value: '',
      context: window.CONTEXT,
      globals: window.GLOBALS
    }
    initializeRespace([source])
  }
}
