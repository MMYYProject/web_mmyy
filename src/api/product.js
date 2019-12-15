import request from '@/utils/request'

export function addGood(params) {
  return request({
    url: `/insertGoods`,
    method: 'post',
    data: params
  })
}

export function updateGood(params) {
  return request({
    url: '/updateGoods',
    method: 'post',
    data: params
  })
}

export function delGood(id) {
  return request({
    url: `/delGoods/${id}`,
    method: 'get'
  })
}

export function getGood(id) {
  return request({
    url: `/gainGoods/${id}`,
    method: 'get'
  })
}

export function getProductList(searchText = '', page = 0, pageSize = 10) {
  let url = `/name=${searchText}/${page}/${pageSize}/gainGoodsListByNameList`
  if (/^\d+$/.test(searchText)) {
    url = `/gainGoods/${searchText}`
  } else if (!searchText) {
    url = `/${page}/${pageSize}/gainGoodsList`
  }
  return request({
    url: url,
    method: 'get'
  })
}
