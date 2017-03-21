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
  activeResource: string
  activeResourceId: number

  toggleDarkMode: () => void
  toggleSettingsDialogOpen: () => void
  setActiveResource: (resource: string, id: number) => void
}

export function Sidebar({
  activeResource, activeResourceId,
  isSettingsDialogOpen, isDarkMode, tasks,
  setActiveResource,
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
      </div>
    </div>
  )

  const briefingNode: ITreeNode = {
    iconName: 'manual',
    id: 'briefing-0',
    isExpanded: true,
    isSelected: activeResource === 'briefing',
    label: 'Mission Briefing'
  }

  const tasksNode = tasks.map((task: ITask) => ({
    iconName: 'circle',
    id: `task-${task.id}`,
    isExpanded: true,
    isSelected: activeResource === 'task' && activeResourceId === task.id,
    label: task.title
  })).toJS()

  const treeContents = [briefingNode].concat(tasksNode)

  const settingsDialog = (
    <SettingsDialog
      isOpen={isSettingsDialogOpen}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
      toggleDialogOpen={toggleSettingsDialogOpen}
    />
  )

  const handleClickNode = (node: ITreeNode) => {
    const resource = node.id.toString().split('-')[0]
    const id = node.id.toString().split('-')[1]
    if (resource === 'briefing') {
      setActiveResource('briefing', 0)
    } else if (resource === 'task') {
      setActiveResource('task', parseInt(id, 10))
    }
  }

  return (
    <div id='rs-sidebar'
         className={classnames({
           'pt-dark': isDarkMode
         })}>
       {extraButtons}
       <Tree
          onNodeClick={handleClickNode}
          contents={treeContents} />
       {settingsDialog}
    </div>
  )
}
