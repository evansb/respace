import * as React from 'react'

import { Content } from './Content'
import { Sidebar } from './Sidebar'

export interface IPageProps {
  sidebarComponent: React.ReactElement<any>
  children?: React.ReactElement<any>
}

export function Page({ sidebarComponent, children }: IPageProps) {
  return (
    <div id="rs-root" className="row">
      <Sidebar>{sidebarComponent}</Sidebar>
      <Content>{children}</Content>
    </div>
  )
}