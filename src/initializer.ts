import { ITask } from './types'

export interface ITaskApi {
  fetch(): Promise<ITask[]>
}

export interface IInitializer {
  api: {
    tasks: ITaskApi
  }
}
