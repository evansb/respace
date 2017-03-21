import { Button, Intent } from '@blueprintjs/core'
import * as classnames from 'classnames'
import * as React from 'react'

export interface INavbarProps {
  activeWidget: string
  isDarkMode: boolean
  isSidebarToggled: boolean
  toggleSidebar: () => void
  setActiveWidget: (widget: ('comments' | 'none' | 'interpreter')) => void
}

export function Navbar({
  activeWidget,
  isDarkMode, isSidebarToggled, toggleSidebar,
  setActiveWidget
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

  const interpreterToggleButton =
    <Button id='rs-toggle-interpreter' iconName='application'
            onClick={() => setActiveWidget('interpreter')}
            intent={activeWidget === 'interpreter' ? Intent.PRIMARY : Intent.NONE}>
      Interpreter
    </Button>

  const commentsToggleButton =
    <Button id='rs-toggle-comments' iconName='comment'
            onClick={() => setActiveWidget('comments')}
            intent={activeWidget === 'comments' ? Intent.PRIMARY : Intent.NONE}>
      Comments
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
        {commentsToggleButton}
        {interpreterToggleButton}
        {submitButton}
      </div>
    </nav>
  )
}
