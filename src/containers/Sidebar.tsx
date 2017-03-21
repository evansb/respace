import { Button, ITreeNode, Tree } from '@blueprintjs/core'
import * as classnames from 'classnames'
import { List } from 'immutable'
import * as React from 'react'
import { SettingsDialog } from '../components/SettingsDialog'
import { ITask } from '../types'

export interface ISidebarProps {
  tasks: List<ITask>
  isSettingsDialogOpen: boolean
  isDarkMode: boolean

  toggleDarkMode: () => void
  toggleSettingsDialogOpen: () => void
}

export function Sidebar({
  isSettingsDialogOpen, isDarkMode, tasks,
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

  const tasksNode = tasks.map((task: ITask) => ({
    iconName: 'circle',
    id: `tasks-${task.id}`,
    isExpanded: true,
    label: task.title
  })).toJS()

  const treeContents = [
    assignmentRootNode
  ].concat(tasksNode)


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
