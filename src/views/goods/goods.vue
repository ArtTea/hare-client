<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem :to="`/`">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem >{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images='goods.mainPictures'/>
          <GoodsSales/>
        </div>
         <div class="spec">
           <GoodName :goods="goods"/>
           <GoodsSku :goods="goods" @change="changeSku"/>
           <XtxNumbox v-model="num" :max="goods.inventory" label="数量"/>
           <XtxButton @click="inseerCart" type="primary"  style="margin-top:20px">加入购物车</XtxButton>
         </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTab/>
          <!-- 注意事项 -->
          <GoodsWarn/>
        </div>
        <!-- 24热榜+周热榜 -->
        <div class="goods-aside">
          <GoodsHot/>
          <GoodsHot :type="2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTab from './components/goods-tab.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import Message from '@/components/library/Message.js'
import { findGoods } from '@/api/goods.js'
import { useRoute } from 'vue-router'
import { ref, watch, provide } from 'vue'
import XtxButton from '../../components/library/xtx-button.vue'
import { useStore } from 'vuex'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodName,
    GoodsSku,
    GoodsWarn,
    GoodsHot,
    XtxButton,
    GoodsTab
  },
  setup () {
    const goods = useGoods()
    const changeSku = (sku) => {
      // 修改商品的现价原价库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录当前选择的sku可能有，可能没有
      currSku.value = sku
    }
    const num = ref(1)
    // 提供给Detail数据
    provide('goods', goods)

    // 加入购物车
    const store = useStore()
    const currSku = ref(null)
    const inseerCart = () => {
      console.log(currSku.value && currSku.value.skuId)
      // 需要：skuId,name,attrsText,picture,price,nowPrice,selected,stock,count,isEffective,id
      if (currSku.value && currSku.value.skuId) {
        const { skuId, specsText: attrsText, inventory: stock } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart', {
          skuId,
          attrsText,
          stock,
          id,
          name,
          price,
          nowPrice: price,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        })
        Message({ type: 'success', text: '加入购物车成功' })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }
    return {
      goods,
      changeSku,
      num,
      inseerCart
    }
  }
}
const useGoods = () => {
  // 获得商品详情数据
  const route = useRoute()
  const goods = ref(null)
  // 出现路由地址发生变化，但是不会重新初始化组件
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        goods.value = data.result
      })
    }
  }, { immediate: true })

  return goods
}

</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
