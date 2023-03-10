import { fetchApi } from '@/apis/apiCaller'

export type ReqUser = {
  provider: string
  accessToken: string
  idToken?: string
}

export type ResUser = {
  user: UserInfo
  accessToken: string
}

export type UserInfo = {
  id: string
  name: string
  image: string
  email: string
  xp: number
  coin: number
  isAdmin: boolean
  provider: string
  isActive: boolean
}

export const signIn = async (payload: ReqUser) => {
  return fetchApi<ResUser>(`/auth/signIn`, 'POST', payload)
}

export const getMe = async () => {
  return fetchApi<UserInfo>(`/auth/me`, 'GET')
}
