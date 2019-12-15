import { USER_STORAGE_KEY } from '@/settings'

export function setUserInfo(userInfo) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo))
}

export function removeUserInfo(userInfo) {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem(USER_STORAGE_KEY))
}
