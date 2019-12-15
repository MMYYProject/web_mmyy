import request from '@/utils/request'

export function login(mobile) {
  return request({
    url: `/${mobile}/loginCode`,
    method: 'get'
  })
}

export function sendCode(mobile) {
  return request({
    url: `/${mobile}/sendCode`,
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  // to do change
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
