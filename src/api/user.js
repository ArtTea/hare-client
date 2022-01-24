import request from '@/utils/request.js'
/**
 * 用户登录请求
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'POST', { account, password })
}
/**
 * 发送验证码
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'GET', { mobile })
}
/**
 * 用手机登录
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'POST', { mobile, code })
}
