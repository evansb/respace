import * as React from 'react'

import { shallow } from 'enzyme'
import { Interpreter } from '../../components/Interpreter'
import { Content } from '../Content'

describe('Content container', () => {
  const setActiveWidget = jest.fn()

  let content = shallow(<Content
    isDarkMode={false}
    setActiveWidget={setActiveWidget}
    activeWidget='none'
  >Dummy Child</Content>)

  it('renders with correct id', () => {
    expect(content.find('#rs-content').length).toBe(1)
  })

  it('does not render widget if the type is none', () => {
    expect(content.find('#rs-task-widgets').length).toBe(0)
  })

  it('does not render widget if the type is none', () => {
    expect(content.find('#rs-task-widgets').length).toBe(0)
  })

  content = shallow(<Content
    isDarkMode={false}
    setActiveWidget={setActiveWidget}
    activeWidget='interpreter'
  >Dummy Child</Content>)

  it('will render a widget if set active', () => {
    expect(content.find('.rs-task-widgets').length).toBe(1)
    expect(content.find(Interpreter).length).toBe(1)
  })

  it('will close the widget if the button is clicked set active', () => {
    content.find('.rs-widget-close').simulate('click')
    expect(setActiveWidget).toHaveBeenCalledWith('none')
  })
})
