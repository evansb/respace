import { Button, ITreeNode, Tree } from '@blueprintjs/core'
import * as classnames from 'classnames'
import * as React from 'react'
import { SettingsDialog } from '../components/SettingsDialog'

export interface ISidebarProps {
  isSettingsDialogOpen: boolean
  isDarkMode: boolean

  toggleDarkMode: () => void
  toggleSettingsDialogOpen: () => void
}

export function Sidebar({
  isSettingsDialogOpen, isDarkMode,
  toggleDarkMode, toggleSettingsDialogOpen
}: ISidebarProps) {

  const extraButtons = (
    <div className='row end-xs sidebar-extra-button'>
      <div className='col-xs-5'>
        <Button
          id='rs-open-settings-dialog'
          iconName='cog'
          onClick={toggleSettingsDialogOpen}
          className='pt-minimal'/>
        <Button iconName='help' className='pt-minimal' />
      </div>
    </div>
  )

  const assignmentRootNode: ITreeNode = {
    iconName: 'manual',
    id: 'assignment-briefing',
    isExpanded: true,
    isSelected: true,
    label: 'Mission Briefing'
  }

  const tasksRootNode: ITreeNode = {
    iconName: 'circle',
    id: 'tasks-root',
    isExpanded: true,
    label: 'Values and Statements'
  }

  const treeContents = [
    assignmentRootNode,
    tasksRootNode
  ]

  const settingsDialog = (
    <SettingsDialog
      isOpen={isSettingsDialogOpen}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      toggleDialogOpen={toggleSettingsDialogOpen}
    />
  )

  return (
    <div id='rs-sidebar'
         className={classnames({
           'pt-dark': isDarkMode
         })}>
       {extraButtons}
       <Tree contents={treeContents} />
       {settingsDialog}
    </div>
  )
}
