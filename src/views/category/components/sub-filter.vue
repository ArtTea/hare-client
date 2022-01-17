<template>
   <div class="sub-filter"  v-if="filterData && !filterLoading">
     <div class="item">
       <div class="head">品牌：</div>
       <div class="body">
         <a @click="changeBrand(item.id)" :class="{active:item.id=== filterData.selectedBrand}" href="javascript:;"  v-for="item in filterData.brands" :key="item.id">{{item.name}}</a>
       </div>
     </div>
     <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
       <div class="head">{{item.name}}：</div>
       <div class="body">
         <a @click="changeAttr(item,attr.id)" :class="{active:attr.id=== item.selectedAttr}" href="javascript:;" v-for="attr in item.properties" :key="attr.id">{{attr.name}}</a>
       </div>
     </div>
   </div>
   <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="800px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
    <XtxSkeleton class="item" width="600px" height="40px"  />
  </div>
</template>
<script>
import { findSubCategoryFilter } from '@/api/category.js'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    const filterData = ref(null)
    const filterLoading = ref(false)
    watch(() => route.params.id, (newVal) => {
      // 判断新路由地址是否正确
      filterLoading.value = true
      if (newVal && `/category/sub/${newVal}` === route.path) {
        // 遍历品牌
        findSubCategoryFilter(route.params.id).then(data => {
          // 为品牌添加全部属性
          // 给每一组数据加上唯一标识
          data.result.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          // 遍历产品
          data.result.saleProperties.forEach(item => {
          // 为产品分类添加全部属性
            item.selectedAttr = null
            item.properties.unshift({ id: null, name: '全部' })
          })
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })
    // 获取筛选参数的函数
    const getFlierParams = () => {
      const obj = { brandId: null, attrs: [] }
      obj.brandId = filterData.value.selectedBrand
      // 遍历每一个分类
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedAttr) {
          const attr = item.properties.find((attr) => attr.id === item.selectedAttr)
          obj.attrs.push({ groupName: item.name, propertyName: attr.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }
    // 记录当前品牌id
    const changeBrand = (id) => {
      if (filterData.value.selectedBrand === id) return
      filterData.value.selectedBrand = id
      emit('flier-change', getFlierParams())
    }
    const changeAttr = (item, id) => {
      if (item.selectedAttr === id) return
      item.selectedAttr = id
      emit('flier-change', getFlierParams())
    }
    return {
      filterData,
      filterLoading,
      changeBrand,
      changeAttr
    }
  }
}
</script>
<style scoped lang='less'>
  // 筛选区
  .sub-filter {
    background: #fff;
    padding: 25px;
    .item {
      display: flex;
      line-height: 40px;
      .head {
        width: 80px;
        color: #999;
      }
      .body {
        flex: 1;
        a {
          margin-right: 36px;
          transition: all .3s;
          display: inline-block;
          &.active,
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .xtx-skeleton {
      padding: 10px 0;
    }
</style>
