import { Button, Intent } from '@blueprintjs/core'
import * as React from 'react'

export function Navbar() {

  const toggleSidebarButton =
    <Button className='pt-minimal pt-active' iconName='one-column' />

  const submitButton =
    <Button iconName='upload'
            intent={Intent.PRIMARY}>
      Submit
    </Button>

  return (
    <nav className='pt-navbar pt-fixed-top'>
      <div className="pt-navbar-group pt-align-left">
        {toggleSidebarButton}
        <div className="pt-navbar-heading">
           Respace
        </div>
      </div>
      <div className="pt-navbar-group pt-align-right">
        {submitButton}
      </div>
    </nav>
  )

}