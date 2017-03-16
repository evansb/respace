import { Button, Intent } from '@blueprintjs/core'
import * as classnames from 'classnames'
import * as React from 'react'

export interface INavbarProps {
  isDarkMode: boolean
  isSidebarToggled: boolean
  toggleSidebar: () => void
}

export function Navbar({
  isDarkMode, isSidebarToggled, toggleSidebar
}: INavbarProps) {

  const toggleSidebarButton =
    <Button
      id='rs-toggle-sidebar'
      className={classnames(
        isSidebarToggled ? 'pt-intent-primary' : 'pt-minimal')
      }
      onClick={toggleSidebar}
      iconName='list' />

  const submitButton =
    <Button id='rs-submit' iconName='upload'
            intent={Intent.PRIMARY}>
      Submit
    </Button>

  return (
    <nav
      id='rs-navbar'
      className={classnames('pt-navbar', 'pt-fixed-top', {
        'pt-dark': isDarkMode
      })}>
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