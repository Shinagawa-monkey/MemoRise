import { useEffect, useState } from "react"

// Either generic type T or we pass the fn which returns generic type T
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {

  // check if value is saved in local starage json format
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue == null) {
      if (typeof initialValue === "function") {
        // will return initialValue types of T and then we'll call that fn
        return (initialValue as () => T)()
      } else {
        return initialValue
      }
    } else {
      return JSON.parse(jsonValue)
    }
  })

  // saves data in local storage any time data changed
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  // array will have 1st value of T and 2nd is whatever type setValue is
  return [value, setValue] as [T, typeof setValue]
}