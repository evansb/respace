import { Button, Intent } from '@blueprintjs/core'
import * as React from 'react'

export function Navbar() {

  const toggleSidebarButton =
    <Button id='rs-toggle-sidebar' className='pt-minimal pt-active'
            iconName='one-column' />

  const submitButton =
    <Button id='rs-submit' iconName='upload'
            intent={Intent.PRIMARY}>
      Submit
    </Button>

  return (
    <nav id='rs-navbar' className='pt-navbar pt-fixed-top'>
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