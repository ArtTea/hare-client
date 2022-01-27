import request from '@/utils/request.js'
// 获取收藏
export const findCollect = ({ page, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'GET', { page, pageSize, collectType })
}
