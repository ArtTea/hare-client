<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 二级类目筛选条件 -->
      <SubFilter @flier-change='flierChange'/>
      <!-- 结果区域 -->
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort  @sort-Change="sortChange"/>
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id" >
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <XtxInfiniteLoading :loading="loading" :finished="finished" @infinte='getData'/>
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category.js'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    const loading = ref(false)
    const finished = ref(false)
    const route = useRoute()
    // 商品列表
    const goodsList = ref([])
    let reqParams = {
      page: 1,
      pagsize: 20
    }
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          finished.value = true
          loading.value = true
        }
        loading.value = false
      })
    }
    watch(() => route.params.id, (newVal) => {
      if (newVal && `/category/sub/${newVal}` === route.path) {
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pagsize: 20
        }
      }
    })
    // 更改排序组件筛选数据条件
    const sortChange = (sortParams) => {
      reqParams = { ...reqParams, ...sortParams }
      finished.value = false
      goodsList.value = []
      reqParams.page = 1
    }
    // 更改分类组件筛选数据条件
    const flierChange = (flierParams) => {
      reqParams = { ...reqParams, ...flierParams }
      finished.value = false
      goodsList.value = []
      reqParams.page = 1
    }
    return {
      loading,
      finished,
      getData,
      goodsList,
      sortChange,
      flierChange
    }
  }
}
</script>
<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
   ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
