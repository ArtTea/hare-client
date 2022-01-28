<template>
  <div class="detail-logistics" v-if="logistics">
    <p>
      <span>{{logistics.list[0].time}}</span>
      <span>{{logistics.list[0].text}}</span>
    </p>
    <a  @click="handlerLogistics(order)" href="javascript:;">查看物流</a>
  <orderLogistics ref="orderLogisticsCom" />
  </div>
</template>
<script>
import { ref } from 'vue'
import { logisticsOrder } from '@/api/order.js'
import orderLogistics from './order-logistics.vue'

export default {
  name: 'DetailLogistics',
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    orderLogistics
  },
  setup (props) {
    const logistics = ref(null)
    logisticsOrder(props.order.id).then((data) => {
      logistics.value = data.result
    })
    const orderLogisticsCom = ref(null)
    const handlerLogistics = (order) => {
      orderLogisticsCom.value.open(order)
    }

    return {
      handlerLogistics,
      orderLogisticsCom,
      logistics
    }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
