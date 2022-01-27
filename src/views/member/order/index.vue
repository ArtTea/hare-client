<template>
<div class="member-oeder">
  <XtxTabs v-model="activeName" @tab-click='changeTab'>
    <XtxTabsPanel
      v-for="item in orderStatus"
      :key="item"
      :label="item.label"
      :name="item.name">{{item.naem}}
    </XtxTabsPanel>
  </XtxTabs>
  <!-- 页面内容 -->
  <div class="order-list">
    <OrderItem v-for="item in orderList" :key="item.id" :order='item'/>
  </div>

  <!-- 分页按钮 -->
  <XtxPagination/>
</div>
</template>

<script>
import OrderItem from './components/order-item.vue'
import { reactive, ref } from 'vue'
import { orderStatus } from '@/api/constants'
import { findOrderList } from '@/api/order.js'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem
  },
  setup () {
    const activeName = ref('all')
    const changeTab = (tab) => {
      console.log(tab)
    }
    const reParams = reactive({
      page: 1,
      pageSize: 10,
      orderState: 0
    })
    const orderList = ref([])
    findOrderList(reParams).then(data => {
      console.log(data.result.items)
      orderList.value = data.result.items
    })
    return {
      activeName,
      changeTab,
      orderStatus,
      orderList
    }
  }
}
</script>

<style lang="less" scoped>
.order-list {
  background: #fff;
  padding: 20px;
}

</style>
