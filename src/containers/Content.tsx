import { Button } from '@blueprintjs/core'
import * as classnames from 'classnames'
import * as React from 'react'

import { Comments } from '../components/Comments'
import { Interpreter } from '../components/Interpreter'

export interface IContentProps {
  activeWidget: string
  isDarkMode: boolean
  children?: React.ReactElement<any>
  setActiveWidget: (widget: ('comments' | 'none' | 'interpreter')) => void
}

export function Content({
  activeWidget,
  children,
  setActiveWidget,
  isDarkMode
}: IContentProps) {
  const childClassName = activeWidget === 'none' ? 'col-xs' : 'col-xs-7'

  let widget = null

  if (activeWidget === 'interpreter') {
    widget = <Interpreter />
  } else if (activeWidget === 'comments') {
    widget = <Comments />
  }

  return (
    <div id="rs-content" className={classnames('row', {
           'pt-dark': isDarkMode
         })}>
      <div className={childClassName}>
        { children }
      </div>
      { activeWidget !== 'none' &&
        <div className='col-xs'>
          <div className='rs-task-widgets'>
            <Button className='rs-widget-close pt-minimal pt-large'
                    iconName='cross' onClick={() => setActiveWidget('none')} />
            { widget }
          </div>
        </div>
      }
    </div>
  )
}
