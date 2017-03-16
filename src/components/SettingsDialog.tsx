import { Button, Intent, Dialog } from '@blueprintjs/core'
import * as classnames from 'classnames'
import * as React from 'react'

export interface ISettingsDialogProps {
  isOpen: boolean
  isDarkMode: boolean
  toggleDialogOpen: () => void
  toggleDarkMode: () => void
}

export function SettingsDialog({
  isOpen, isDarkMode, toggleDarkMode,
  toggleDialogOpen
}: ISettingsDialogProps) {

  const darkModeToggle =
    <label className='pt-control pt-checkbox'>
        <input id='rs-toggle-dark-mode'
               type='checkbox' onChange={toggleDarkMode}
               checked={isDarkMode} />
        <span className='pt-control-indicator' />
        Dark Mode
    </label>

  return (
    <Dialog title='Settings' iconName='cog'
            canOutsideClickClose={false}
            isOpen={isOpen} onClose={toggleDialogOpen}>
      <div className='pt-dialog-body'>
        {darkModeToggle}
      </div>
    </Dialog>
  )
}
