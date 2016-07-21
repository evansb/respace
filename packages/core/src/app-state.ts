import { observable, computed, action } from 'mobx'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/combineLatest'
import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/interval'
import 'rxjs/add/operator/throttleTime'

export default class AppState {
  static SIDEBAR_ACTIVE_WIDTH: number = 200
  static SIDEBAR_INACTIVE_WIDTH: number = 50
  @observable width: number
  @observable height: number
  @observable sidebarToggled: boolean = true
  container: HTMLElement

  constructor() {
    this.width = 0
    this.height = 0
  }

  @action('resize container') resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
  }

  listenToResize() {
    this.resize()
    Observable.combineLatest(
      Observable.fromEvent(window, 'resize').throttleTime(50),
      Observable.interval(1000)
    ).subscribe(() => {
      const width = this.container.offsetWidth
      const height = this.container.offsetHeight
      if (width !== this.width || height !== this.height) {
        this.resize()
      }
    })
  }

  @action('toggle sidebar') toggleSidebar() {
    this.sidebarToggled = !this.sidebarToggled
    window.resizeBy(1, 1)
  }

  @computed get mainContentWidth() {
    if (this.sidebarToggled) {
      return this.width - AppState.SIDEBAR_ACTIVE_WIDTH
    } else {
      return this.width - AppState.SIDEBAR_INACTIVE_WIDTH
    }
  }

  @computed get sidebarWidth() {
    if (this.sidebarToggled) {
      return AppState.SIDEBAR_ACTIVE_WIDTH
    } else {
      return AppState.SIDEBAR_INACTIVE_WIDTH
    }
  }
}
