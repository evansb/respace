import { Button, Intent } from '@blueprintjs/core'
import * as classnames from 'classnames'
import * as React from 'react'

export interface INavbarProps {
  isSidebarToggled: boolean
  toggleSidebar: () => void
}

export function Navbar({
  isSidebarToggled, toggleSidebar
}: INavbarProps) {

  const toggleSidebarButton =
    <Button
      id='rs-toggle-sidebar'
      className='pt-minimal'
      onClick={toggleSidebar}
      iconName={isSidebarToggled ? 'one-column' : 'two-columns'} />

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