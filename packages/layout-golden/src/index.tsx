/// <reference path='../typeshims/golden-layout.d.ts' />
import * as rs from '@respace/common'
import GoldenLayoutStore from './store'
import GoldenLayoutWrapper from './view'

const GoldenLayoutEngine: rs.ILayoutEngine = {
  view: GoldenLayoutWrapper,
  createStore() {
    return new GoldenLayoutStore()
  },
}

export default GoldenLayoutEngine
