import { fetchApi } from '@/apis/apiCaller'

export type ReqUser = {
  id?: string
  name: string
  email: string
  image?: string
  provider: string
  providerAccountId: string
  accessToken?: string
}

export type ResUser = {
  user: ReqUser
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