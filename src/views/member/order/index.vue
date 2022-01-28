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
    <div v-if="loading" class="loading"></div>
    <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
    <OrderItem
    @on-delete='handlerDelete'
    @on-cancel='handlerCanel'
    @on-confirm='handlerConfirm'
    @on-logistics='handlerLogistics'
    v-for="item in orderList"
    :key="item.id"
    :order='item'/>
  </div>
  <!-- 取消订单 -->
  <OrderCancel ref="orderCancel"/>
  <!-- 查看物流 -->
  <OrderLogistics ref="orderLogisticsCom" />
  <!-- 分页按钮 -->
  <XtxPagination
  v-if="total>0"
  :myCurrpage='reParams.page'
  :myPageSize='reParams.pageSize'
  :myCommentSize='total'
  @currentchange='reParams.page=$event'
  />
</div>
</template>

<script>
import OrderCancel from './components/order-cancel.vue'
import OrderItem from './components/order-item.vue'
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import Confirm from '@/components/library/Confirm'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order.js'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics.vue'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },
  setup () {
    const activeName = ref('all')
    const changeTab = ({ index }) => {
      reParams.page = 1
      reParams.orderState = index
    }
    const reParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const total = ref(0)
    const orderList = ref([])
    const loading = ref(false)

    const getOrderList = () => {
      loading.value = true
      findOrderList(reParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    watch(reParams, () => {
      getOrderList()
    }, { immediate: true })

    const handlerDelete = (order) => {
      Confirm({ text: '亲您确定要删除订单吗？' }).then(() => {
        deleteOrder(order.id).then(() => {
          getOrderList()
          Message({ type: 'success', text: '删除订单成功' })
        })
      }).catch(() => {})
    }
    return {
      activeName,
      changeTab,
      orderStatus,
      orderList,
      total,
      loading,
      reParams,
      handlerDelete,
      ...useCanel(),
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
// 取消订单
export const useCanel = () => {
  const orderCancel = ref(null)
  const handlerCanel = (order) => {
    orderCancel.value.open(order)
  }
  return {
    handlerCanel,
    orderCancel
  }
}
// 确认收货
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '亲您确定要收货吗？' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ type: 'success', text: '确认收货成功' })
        order.orderStatus = 4
      })
    })
  }
  return {
    handlerConfirm
  }
}
// 查看物流
const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return {
    handlerLogistics,
    orderLogisticsCom
  }
}
</script>

<style lang="less" scoped>
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
    background-color: #fff;

}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255,255,255,.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
