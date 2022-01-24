// 购物车模块数据
import { getNewCartGoods, mergeCart, findCart, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart.js'
export default {
  namespaced: true,
  state () {
    return {
      // 购物车信息
      list: []
    }
  },
  getters: {
    // 有效商品列表，库存大于0，商品有效标识为true
    vaildList (state) {
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品件数
    vaildTotal (state, getters) {
      return getters.vaildList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品金额
    vaildAmount (state, getters) {
      return getters.vaildList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    invaildList (state) {
      return state.list.filter(goods => goods.stock < 0 && !goods.isEffective)
    },
    // 已选择商品列表
    selectedList (state, getters) {
      return getters.vaildList.filter(goods => goods.selected)
    },
    // 已选择商品件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选择商品金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll (state, getters) {
      return (getters.vaildList.length !== 0 && getters.selectedList.length === getters.vaildList.length)
    }
  },
  mutations: {
    // 添加商品
    insertCart (state, payload) {
      // 约定加入购物车所需的字段必须要后端提供的数据保持一致
      // 需要：skuId,name,attrsText,picture,price,nowPrice,selected,stock,count,isEffective,id
      // 插入数据规则：
      // 1.查询是否有相同的商品
      // 2.如果有相同的商品查询商品的数量，累加到payload中，保持添加到最新的位置
      // 3.如果没有相同商品，直接进行添加
      // 查找是否有相同数据，有取出索引
      const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (sameIndex > -1) {
        // 记录之前商品的数量
        const count = state.list[sameIndex].count
        // 合并商品数量
        payload.count += count
        // 删除原来的商品
        state.list.splice(sameIndex, 1)
      }
      // 追加商品
      state.list.unshift(payload)
    },
    // 更新购物车信息
    updateCart (state, goods) {
      // goods里面存在商品信息：nowPrice，stock，isEffective
      // goods里面信息字段不固定但是必须有skuId
      const uodateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        // 判断字段是否为空
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          // 遍历更新字段
          uodateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车
    deleteCart (state, skuId) {
      const index = state.list.findIndex(goods => goods.skuId === skuId)
      // 根据索引删除原来的商品
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart (state, payload) {
      state.list = payload
    }
  },
  actions: {
    // 合并购物车
    async mergeCart (ctx) {
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // 合并购物车，并清空本地购物车
      ctx.commit('setCart', [])
    },
    // 修改商品的sku信息
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 找出旧商品
          // 删除旧商品
          // 通过上传skuId和count合并商品
          // 添加新商品
          // 从newSkuId中解构出需要的变量并重新跟改变量名
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 找出旧商品
          // 删除旧商品
          // 根据新skuId信息合并旧商品数据
          // 添加新商品
          // 从newSkuId中解构出需要的变量并重新跟改变量名
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, stock, attrsText }
          ctx.commit('inseerCart', newGoods)
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters[isClear ? 'invaildList' : 'selectedList'].map(goods => goods.skuId)
          deleteCart(ids).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters[isClear ? 'invaildList' : 'selectedList'].forEach(goods => {
            ctx.commit('deleteCart', { skuId: goods.skuId })
          })
          resolve()
        }
      })
    },
    // 全选和取消全选
    allCheckCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          const ids = ctx.getters.vaildList.map(goods => goods.skuId)
          checkAllCart({ ids, selected }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.getters.vaildList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    updateCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        // 必须要传的参数skuId，记你要改的数据字段和值
        if (ctx.rootState.user.profile.token) {
          // 已登录
          updateCart(payload).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 以登录
          findCart().then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          const PromiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList是更新成功的集合，他的顺序和PromiseArr的顺序保持一致,而PromiseArr，有事根据state.list来的，所以他的索引顺序应该和list保持一致
          Promise.all(PromiseArr).then((dataList) => {
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            // 更新成功
            resolve()
          })
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          deleteCart([payload]).then(() => {
            return findCart()
          }).then(data => {
            ctx.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录 skuId就是payload
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    }
  }
}
