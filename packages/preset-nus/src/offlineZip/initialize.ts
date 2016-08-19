import initializeRespace from '../initialize'

declare interface WindowWithGlobals {
  GLOBALS: string[]
}

declare var window: WindowWithGlobals

export default function initialize() {
  window.GLOBALS = window.GLOBALS || []
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
  initializeRespace([source])
}
