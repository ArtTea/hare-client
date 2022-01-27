// 支付订单相关的接口数据
import request from '@/utils/request.js'
/*
*结算页面，生成订单
*/
export const createOrder = () => {
  return request('/member/order/pre', 'GET')
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
