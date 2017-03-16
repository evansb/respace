import * as React from 'react'

import { mount, shallow, render } from 'enzyme'
import { SettingsDialog } from '../SettingsDialog'

describe('Settings Dialog', () => {
  const props = {
    isDarkMode: false,
    isOpen: true,
    toggleDarkMode: jest.fn(),
    toggleDialogOpen: jest.fn(),
  }

  it('toggles dark mode when requested', () => {
    const dialog = shallow(<SettingsDialog {...props} />)
    dialog.find('#rs-toggle-dark-mode').simulate('change', {
      target: {
        checked: true
      }
    })
    expect(props.toggleDarkMode.mock.calls.length).toBe(1)
  })
})
