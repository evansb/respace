import { IStorage } from '@respace/common'

export function createStorage(parent: LocalForage, baseKey: string): IStorage {
  return {
    createStorage(key: string): IStorage {
      return createStorage(parent, key)
    },
    async get<T>(key: string, defaultValue?: T) {
      try {
        const item = await parent.getItem<T>(baseKey + '.' + key)
        return item || defaultValue
      } catch (e) {
        return null
      }
    },
    async put<T>(key: string, item: T) {
      await parent.setItem<T>(baseKey + '.' + key, item)
    }
  }
}
