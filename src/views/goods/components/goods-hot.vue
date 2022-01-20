<template>
  <div class="goods-hot">
    <h3>{{title}}</h3>
    <div >
      <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item"/>
    </div>
  </div>
</template>
<script>
import GoodsItem from '@/views/category/components/goods-item.vue'
import { computed, ref } from 'vue'
import { findHotGoods } from '@/api/goods.js'
import { useRoute } from 'vue-router'
export default {
  name: 'GoodsHot',
  components: {
    GoodsItem
  },
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  setup (props) {
    const route = useRoute()
    const goodsList = ref([])
    const types = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const title = computed(() => {
      return types[props.type]
    })
    findHotGoods({ id: route.params.id, type: props.type }).then(data => {
      goodsList.value = data.result
    })
    return {
      title,
      goodsList
    }
  }
}
</script>
<style scoped lang="less"></style>
