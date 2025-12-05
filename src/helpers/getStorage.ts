export default function getStorage<T>(storageKey: string) {
  const storage = window.localStorage

  return {
    save: (value: T) => {
      if (typeof value === 'string') {
        storage.setItem(storageKey, value)
      }

      storage.setItem(storageKey, JSON.stringify(value))
    },
    get: ({ isStringify = false }) => {
      const value = storage.getItem(storageKey)

      if (value && isStringify) {
        try {
          return JSON.parse(value) as T
        } catch (error) {
          console.warn(error)
          storage.removeItem(storageKey)
          return null
        }
      } else {
        return null
      }
    }
  }
}
