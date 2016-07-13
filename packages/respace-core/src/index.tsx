/// <reference path='../definitions/shims/index.d.ts' />

import { render } from 'react-dom'
import App from './App'

export default {
  render(container: HTMLElement) {
    render(App, container)
  }
}
