import * as React from 'react'
import {Navbar} from '../components/Navbar'

export function Content({ children = undefined }) {
  return (
    <div id="rs-content" className="col-xs">
      <Navbar></Navbar>
      {children}
    </div>
  )
}
