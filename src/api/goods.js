import request from '@/utils/request.js'
/**
 * 获取商品详情数据
 */
export const findGoods = (id) => {
  return request('/goods', 'GET', { id })
}
