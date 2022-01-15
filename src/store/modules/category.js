// 分类模块数据
import { findAllCategory } from '@/api/category.js'
import { topCategory } from '@/api/constants.js'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息,依赖于topCategory重新设置，保证初始化就要有数据，不至于白屏
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 修改分类的数据
  mutations: {
    // payload是获取到的分类数据
    setCategory (state, payload) {
      state.list = payload
    },
    show (state, id) {
      const currCategory = state.list.find((item) => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find((item) => item.id === id)
      currCategory.open = false
    }
  },
  actions: {
    async getCategory ({ commit }) {
      // 获取分类的数据
      const data = await findAllCategory()
      data.result.forEach(top => {
        top.open = false
      })
      // 修改分类的数据
      commit('setCategory', data.result)
    }
  }
}
