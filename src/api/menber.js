import request from '@/utils/request.js'
// θ·εζΆθ
export const findCollect = ({ page, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'GET', { page, pageSize, collectType })
}
