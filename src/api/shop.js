import request from '@/utils/request'

export function getShopInfo(userId) {
  return request({
    url: `/${userId}/gainShopInfo`,
    method: 'get'
  })
}

export function getShopCategory() {
  return request({
    url: '/gainShopCategory',
    method: 'post'
  })
}

export function dealShopInfo(params) {
  return request({
    url: '/dealShopInfo',
    method: 'post',
    data: params
  })
}
