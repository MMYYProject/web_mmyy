import request from '@/utils/request'

export function getShopInfo(userId) {
  return request({
    url: `/${userId}/gainShopInfo`,
    method: 'get'
  })
}

export function getShopCategory(params) {
  return request({
    url: '/gainShopCategory',
    method: 'post',
    data: params
  })
}

export function dealShopInfo(params) {
  return request({
    url: '/dealShopInfo',
    method: 'post',
    data: params
  })
}
