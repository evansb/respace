import '@respace/theme-dark'
import initializeOnlineDemo from './onlineDemo/initialize'
import initializeCoursemology from './coursemology/initialize'
import initializeOfflineZip from './offlineZip/initialize'

declare const window: any

const isCoursemology = /sourceacademy.space/.test(window.location)

if (isCoursemology) {
  console.log('Environment: Coursemology')
  initializeCoursemology()
} else if (window.GLOBALS) {
  console.log('Environment: Offline Zip')
  initializeOfflineZip()
} else {
  console.log('Environment: Online Demo')
  initializeOnlineDemo()
}
