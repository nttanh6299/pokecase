import { useState, createContext, Dispatch, SetStateAction, PropsWithChildren } from 'react'
import { UserInfo } from '@/apis/auth'

export type AuthStateContextType = {
  user: UserInfo
  setUser: Dispatch<SetStateAction<UserInfo>>
  clearUser: () => void
}

export const AuthStateContext = createContext<AuthStateContextType>({
  user: null,
  setUser: () => {
    console.log()
  },
  clearUser: () => {
    console.log()
  },
})

const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [user, setUser] = useState<UserInfo>()

  const clearUser = () => setUser(null)

  const value = { user, setUser, clearUser }

  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>
}

export default AuthProvider
