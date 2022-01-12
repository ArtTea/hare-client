// 用户模块数据

export default {
  namespaced: true,
  state () {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      }
    }
  },
  mutations: {
    // 修改用户信息，payLoad就是用户信息对象
    setUser (state, payLoad) {
      state.proflie = payLoad
    }
  }
}
