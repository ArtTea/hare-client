// 支付订单相关的接口数据
import request from '@/utils/request.js'
/*
*结算页面，生成订单（根据购物车）
*/
export const createOrder = () => {
  return request('/member/order/pre', 'GET')
}
/*
*结算页面，生成订单（根据订单ID）
*/
export const repurchaseOrder = (orderId) => {
  return request('/member/order/repurchase/' + orderId, 'GET')
}
/*
*结算页面，添加收货地址
*/
export const addAddress = (form) => {
  return request('/member/address', 'POST', form)
}

/*
*结算页面，修改收货地址
*/
export const editAddress = (form) => {
  return request(`/member/address/${form.id}`, 'PUT', form)
}
/*
*结算页面，提交订单
*/
export const submitOrder = (params) => {
  return request('/member/order', 'POST', params)
}

/*
*支付页面，获取订单信息
*/
export const findOrderDetail = (orderId) => {
  return request(`/member/order/${orderId}`, 'GET')
}
/*
*支付页面，获取订单列表
*/
export const findOrderList = ({ page, pageSize, orderState }) => {
  return request('/member/order', 'GET', { page, pageSize, orderState })
}
/*
*支付页面，取消订单
*/
export const cancelOrder = ({ id, cancelReason }) => {
  return request(`/member/order/${id}/cancel`, 'PUT', { cancelReason })
}
/*
*支付页面，删除订单
*/
export const deleteOrder = (orderId) => {
  return request('/member/order', 'DELETE', { ids: [orderId] })
}
/*
*支付页面，确认收货
*/
export const confirmOrder = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, 'PUT')
}
/*
*支付页面，查看物流
*/
export const logisticsOrder = (orderId) => {
  return request(`/member/order/${orderId}/logistics`, 'GET')
}
