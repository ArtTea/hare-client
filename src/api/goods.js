import request from '@/utils/request.js'
/**
 * 获取商品详情数据
 */
export const findGoods = (id) => {
  return request('/goods', 'GET', { id })
}
/**
 * 获取商品详情数据(传入id为推荐商品，不传id为猜你喜欢)
 */
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'GET', { id, limit })
}
/**
 * 获取热榜数据 type类型，1为24小时，2为周榜，3为总榜，默认为1
 */
export const findHotGoods = ({ id, type, limit = 3 }) => {
  return request('/goods/hot', 'GET', { id, limit, type })
}
/**
 * 获取商品的评价统计信息
 *
 */
export const findCommentInfoByGoods = (id) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'GET')
}
/**
 * 获取商品的评价列表数据
 *
 */
export const findCommentInfoByList = (id, params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'GET', params)
}
