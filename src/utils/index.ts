import { COOKIE_NAME } from '@/constants/auth'
import { eraseCookie, getCookie, setCookie } from './cookie'

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return getCookie(COOKIE_NAME)
  }
  return null
}

export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    setCookie(COOKIE_NAME, token, 365)
  }
}

export const clearAccessToken = () => {
  if (typeof window !== 'undefined') {
    eraseCookie(COOKIE_NAME)
  }
}

export const formatName = (value: string) => {
  const trimedValue = value.trim()
  const replacedValue = trimedValue.replace(/[_-]/g, ' ')
  const lowercaseValue = replacedValue.toLowerCase()
  return lowercaseValue
    .split(' ')
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ')
}

export const convertHgToPound = (hg: number, round = 1) => {
  const result = Number((hg * 0.2204622622).toFixed(round))
  return isNaN(result) ? 0 : result
}

export const formatCategory = (category: string) => {
  if (!category) return ''
  return category.replace('Pokémon', '').trim()?.toLowerCase()
}
