import { observable, action } from 'mobx'
import { ISnapshot, ISnapshotError,
    ILanguageService } from './language-service'

export default class SnapshotData<T extends ISnapshot,
                                  E extends ISnapshotError<T>> {
  snapshot: T
  @observable errors: E[] = []
  @observable logs: string[] = []
  @observable valueType: string = ''
  @observable valueString: string = ''
  @observable done: boolean = false
  @observable isCodeShown = true
  @observable isValueShown = true

  constructor(public id: string,
              code: string,
              public service: ILanguageService<T, E>) {
    this.snapshot = <T> { id, code, done: false }
  }

  @action('snapshot.setValue')
  setSnapshot(snapshot: T) {
    this.snapshot = snapshot
    this.done = snapshot.done
    if (this.done) {
      this.valueType = typeof snapshot.value.value
      this.valueString = this.service.valueToString(snapshot)
    }
  }
}
