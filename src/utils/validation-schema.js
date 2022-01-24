export default {
  // 校验规则：返回true为真返回字符串为假
  account (value) {
    if (!value) return '账户不能为空'
    // 校验规则
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '账户必须以字母开头且在6-20之间'
    return true
  },
  // 密码校验
  password (value) {
    if (!value) return '密码不能为空'
    if (!/\S{6,24}/.test(value)) return '密码必须在6-24之间'
    return true
  },
  // 手机号
  mobile (value) {
    if (!value) return '手机号不能为空'
    if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式不正确'
    return true
  },
  // 验证码
  code (value) {
    if (!value) return '验证不能为空'
    if (!/^\d{6}$/.test(value)) return '验证码格式不正确'
    return true
  },
  // 用户协议
  isAgree (value) {
    if (!value) return '请勾选用户协议'
    return true
  }
}
