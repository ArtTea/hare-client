import request from '@/utils/request.js'
// 获取商品的最新价格、库存、是否有效等信息
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'GET')
}
// 获取商品的sku，specs等信息
export const getGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'GET')
}

// 合并购物车信息
export const mergeCart = (cartList) => {
  return request('/member/cart/merge', 'POST', cartList)
}
// 获取购物车列表
export const findCart = () => {
  return request('/member/cart', 'GET')
}
// 加入购物车
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'POST', { skuId, count })
}
// 删除购物车商品：ids是所有要删除商品的集合
export const deleteCart = (ids) => {
  return request('/member/cart', 'DELETE', { ids })
}
// 修改购物车商品的状态和数量
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'PUT', { selected, count })
}
// 全选和取消全选购物车商品：ids是所有要删除商品的集合
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'PUT', { selected, ids })
}
