import { useState, createContext } from "react"

export const Context = createContext({
  user: undefined,
  setUser: () => {}
})

export const ContextProvider = props => {
  const [user, setUser] = useState(undefined)
  const value = { user, setUser }

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}
