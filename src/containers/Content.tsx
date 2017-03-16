import * as classnames from 'classnames'
import * as React from 'react'

export interface IContentProps {
  isDarkMode: boolean
  children?: React.ReactElement<any>
}

export function Content({ children, isDarkMode }: IContentProps) {
  return (
    <div id="rs-content"
         className={classnames('col-xs', {
           'pt-dark': isDarkMode
         })}>
      {children}
    </div>
  )
}
