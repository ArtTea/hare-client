<template>
  <div class="home-new">
    <!-- 新鲜好物 -->
    <HomePanel title="新鲜好物" subTitle="新鲜出炉 品质靠谱">
      <template #right>
        <XtxMore></XtxMore>
      </template>
      <div ref="target" style="position: relative;height: 406px;">

      <!-- 面板内容 -->
        <transition name="fade">
          <ul v-if="goods.length" class="goods-list">
            <li v-for="item in goods" :key="item.id">
              <RouterLink :to="`/product/${item.id}`">
                <img v-lazy="item.picture" alt="">
                <p class="name ellipsis">{{item.name}}</p>
                <p class="price">&yen;{{item.price}}</p>
              </RouterLink>
            </li>
          </ul>
          <HomeSkeleton v-else :bg="'#f0f9f4'"></HomeSkeleton>
        </transition>
      </div>
    </HomePanel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import { findNew } from '@/api/home.js'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  name: 'homeNew',
  components: {
    HomePanel,
    HomeSkeleton
  },
  setup () {
    // const goods = ref([])
    // findNew().then(data => {
    //   goods.value = data.result
    // })
    const { result, target } = useLazyData(findNew)
    return { goods: result, target }
  }
}
</script>

<style lang='less' scoped>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li{
    width:306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img{
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
