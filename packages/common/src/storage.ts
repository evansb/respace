
export interface IStorage {
  createStorage(key: string): IStorage
  get<T>(key: string, defaultValue?: T): Promise<T>
  put<T>(key: string, item: T): Promise<T>
}
