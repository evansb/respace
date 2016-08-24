import initializeRespace from '../initialize'

declare interface WindowWithGlobals {
  GLOBALS: string[]
  mission_type: string
}

declare var window: WindowWithGlobals

export default function initialize() {
  window.GLOBALS = window.GLOBALS || []
  const source = {
    title: document.title || 'Untitled',
    language: window.mission_type,
    template: '',
    value: '',
    context: window,
    globals: window.GLOBALS
  }
  initializeRespace([source])
}
