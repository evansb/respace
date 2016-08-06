import * as React from 'react'
import * as uuid from 'uuid'
import * as rs from '@respace/common'
import { Tab } from 'react-bootstrap'
import Console from './Console'
import Store from '../store'
import { observer } from 'mobx-react'

export type Props = rs.IComponentProps<rs.documents.ISourceCode, Store>

function Interpreter({ component }: Props) {
  const store = component.state
  const onSelect = (key) => store.activeTab = key
  const TabContainer = Tab.Container
  const TabContent = Tab.Content
  const TabPane = Tab.Pane
  /* TODO
  const tabs = store.tabs.map((tab) => {
    if (tab === store.consoleTab) {
      return (
        <NavItem key={tab.key} eventKey={tab.key}>
          { tab.title }
        </NavItem>
      )
    } else {
      const iconStyle = {
        marginLeft: '5px',
        paddingBottom: '2px',
        color: 'gray'
      }
      const onClick = () => store.closeTab(tab)
      return (
        <NavItem key={tab.key} eventKey={tab.key}>
          { tab.title }
          <span onClick={onClick} className='close-button' href='#'>
            <CloseIcon style={iconStyle} />
          </span>
        </NavItem>
      )
    }
  })
  */
  const panes = store.tabs.map((tab) => {
    let content
    if (tab === store.consoleTab) {
      content = <Console store={store} />
    } else {
      content = <div>{tab.key}</div>
    }
    return <TabPane key={tab.key} eventKey={tab.key}>{content}</TabPane>
  })
  // E const tabs = <Nav bsStyle='tabs'> { tabs }</Nav>
  return (
    <TabContainer defaultActiveKey={store.consoleTab.key}
                  activeKey={store.activeTab.key}
                  generateChildId={uuid.v4}
                  onSelect={onSelect}>
      <div className='clearfix'>
        <TabContent>
          { panes }
        </TabContent>
      </div>
    </TabContainer>
  )
}

export default observer(Interpreter)
