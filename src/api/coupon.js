import request from '@/utils/request'
export function updateCoupon(params) {
  return request({
    url: '/updateCoupon',
    method: 'post',
    data: params
  })
}
