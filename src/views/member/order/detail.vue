<template>
<div class="member-order-detail"  v-if="order">
    <!-- 头部 -->
    <DetailAction :order="order"/>
    <!-- 进度 -->
    <DetailStep :order="order"/>
    <!-- 信息 -->
    <DetailLogistics v-if="[3,4,5].includes(order.orderState)" :order="order"/>
    <!-- 物流 -->
    <OrderInfo :order="order"/>
</div>

</template>

<script>
import DetailStep from './components/detail-step.vue'
import DetailLogistics from './components/detail-logistics.vue'
import { ref } from '@vue/reactivity'
import DetailAction from './components/detail-action.vue'
import { findOrderDetail } from '@/api/order.js'
import { useRoute } from 'vue-router'
import OrderInfo from './components/detail-info.vue'
export default {
  name: 'MemberOrderDetail',
  components: {
    DetailAction,
    DetailStep,
    DetailLogistics,
    OrderInfo
  },
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then((data) => {
      order.value = data.result
    })
    return {
      order
    }
  }
}
</script>

<style lang="less" scoped>
.member-order-detail{
  background-color: #fff;
  height: 100%;
}
</style>
