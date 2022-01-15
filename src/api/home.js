// 首页相关的接口数据
import request from '@/utils/request.js'
/*
*获取品牌数据,默认获取6个品牌
*/
export const findbrands = (limit = 6) => {
  return request('/home/brand', 'GET', { limit })
}
/*
*获取轮播图的数据
*/
export const findBanner = () => {
  return request('/home/banner/', 'GET')
}
/*
*获取新鲜好物的数据
*/
export const findNew = () => {
  return request('/home/new', 'GET')
}
/*
*获取人气推荐数据
*/
export const findHot = () => {
  return request('/home/hot', 'GET')
}
/*
*获取商品列表数据
*/
export const findGoods = () => {
  return request('/home/goods', 'GET')
}
/*
*获取商品列表数据
*/
export const findSpecial = () => {
  return request('/home/special', 'GET')
}
