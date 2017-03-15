import * as React from 'react'

export interface IContentProps {
  children?: React.ReactElement<any>
}

export function Content({ children }: IContentProps) {
  return (
    <div id="rs-content" className="col-xs">
      {children}
    </div>
  )
}
