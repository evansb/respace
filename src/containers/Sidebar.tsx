import * as React from 'react'
import {UserStatus} from '../components/UserStatus'

export interface ISidebarProps {
  children?: React.ReactElement<any>
}

export function Sidebar({ children }: ISidebarProps) {
  return (
    <div id="rs-sidebar" className="col-sidebar">
      <UserStatus />
      {children}
    </div>
  )
}
