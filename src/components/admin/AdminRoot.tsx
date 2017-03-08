import * as React from 'react'

import {Page} from '../../containers/Page'

export interface IAdminRootProps {
  children: React.ReactElement<any>
}

export function AdminRoot({children}: IAdminRootProps) {
  return (
    <Page sidebarComponent={<h4>Admin Sidebar</h4>}> 
      {children}
    </Page>
  )
}