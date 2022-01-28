<template>
  <XtxSteps :active="order.orderState===6?1:order.orderState" style="padding:20px" >
    <XtxStepsItem title="提交订单" :desc="order.createTime" />
    <XtxStepsItem title="付款成功" :desc="order.payTime" />
    <XtxStepsItem title="商品发货" :desc="order.consignTime" />
    <XtxStepsItem title="确认收货" :desc="order.endTime" />
    <XtxStepsItem title="订单完成" :desc="order.evaluationTime" />
  </XtxSteps>
</template>

<script>
export default {
  name: 'DetailStep',
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>

</style>
