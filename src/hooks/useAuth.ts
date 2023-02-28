import { useContext } from 'react'
import { AuthStateContext, AuthStateContextType } from '@/contexts/AuthProvider'

const useAuth = (): AuthStateContextType => {
  const state = useContext(AuthStateContext)
  return state
}

export default useAuth
