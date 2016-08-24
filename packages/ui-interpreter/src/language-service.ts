import { Observable } from 'rxjs/Observable'
import { IPubSub } from '@respace/common'

export type SnapshotAction<T extends ISnapshot, E extends ISnapshotError<T>> =
    SnapshotRequest<T>
  | SnapshotError<E>
  | SnapshotReply<T>

export type SnapshotReply<T extends ISnapshot> = {
  type: 'snapshotReply'
  payload: T
}

export type SnapshotRequest<T extends ISnapshot> = {
  type: 'snapshotRequest'
  payload: T
}

export type SnapshotError<E> = {
  type: 'snapshotError'
  payload: E
}

export interface ILanguageService<T extends ISnapshot,
                                  E extends ISnapshotError<T>>
extends IPubSub<SnapshotAction<T, E>> {
  language: string
  outputSink: Observable<string>
  valueToString(snapshot: T): string
  errorToString(error: E): string
}

export interface ISnapshot {
  id: string
  done: boolean
  code: string
  parent?: this
  value?: any
  valueType?: any
}

export interface ISnapshotError<T extends ISnapshot> {
  severity: string
  message: string
  snapshot: T
}
