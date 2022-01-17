import request from '@/utils/request.js'
// 获取全部分类数据
export const findAllCategory = () => {
  return request('/home/category/head', 'GET')
}
// 获取顶级分类数据
export const findTopCategory = (id) => {
  return request('/category', 'GET', { id })
}
// 获取二级分类筛选条件数据
export const findSubCategoryFilter = (id) => {
  return request('/category/sub/filter', 'GET', { id })
}
// 获取二级分类商品数据
export const findSubCategoryGoods = (params) => {
  return request('/category/goods/temporary', 'POST', params)
}
