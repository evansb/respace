import * as React from 'react'

export interface ISidebarProps {
  children?: React.ReactElement<any>
}

export function Sidebar({ children }: ISidebarProps) {
  return (
    <div id="rs-sidebar" className="col-sidebar">
      {children}
    </div>
  )
}
