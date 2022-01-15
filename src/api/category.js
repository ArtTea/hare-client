import request from '@/utils/request.js'
// 获取全部分类数据
export const findAllCategory = () => {
  return request('/home/category/head', 'GET')
}
