import { createStore } from 'vuex'
export default createStore({
  state: {
    username: 'zs'
  },
  getters: {
    updateName (state) {
      return state.username + '....'
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
