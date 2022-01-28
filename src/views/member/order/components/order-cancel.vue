<template>
  <XtxDialog title="取消订单"  v-model:visible="visibleDialog">
    <!-- 组件内容 -->
    <div class="cancel-info">
        <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
        <p class="tip">请选择取消订单的原因（必选）：</p>
        <div  class="btn">
          <a
            @click="curText = item"
            v-for="item in cancelReason"
            :key="item"
            href="javascript:;"
            :class="{ active: curText === item }"
          >
            {{ item }}
          </a>
        </div>
    </div>
    <!-- 按钮操作 -->
    <template #footer>
      <XtxButton type="gray" @click="visibleDialog=false" style="margin-right:20px">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { cancelReason } from '@/api/constants.js'
import { ref } from '@vue/reactivity'
import Message from '@/components/library/Message'
import { cancelOrder } from '@/api/order.js'
export default {
  name: 'OrderCancel',
  setup () {
    const curText = ref('')
    const visibleDialog = ref(false)
    const currorder = ref(null)
    const open = (order) => {
      visibleDialog.value = true
      console.log(visibleDialog.value)
      currorder.value = order
      curText.value = ''
    }
    const submit = () => {
      if (!curText.value) {
        return Message({ text: '请至少选中一项理由' })
      } else {
        cancelOrder({ id: currorder.value.id, cancelReason: curText.value }).then(() => {
          visibleDialog.value = false
          currorder.value.orderState = 6
          return Message({ type: 'success', text: '订单取消成功' })
        })
      }
    }
    return {
      cancelReason,
      curText,
      visibleDialog,
      open,
      submit
    }
  }
}
</script>
<style scoped lang="less">
 .xtx-dialog ::v-deep .wrapper {
  width: 620px;
}
.cancel-info {
  p {
    font-size: 16px;
    line-height: 35px;
    &.tip {
      color: #999;
    }
  }
  .btn {
    padding-top: 21px;
    display: flex;
    flex-wrap: wrap;
    a {
      width: 256px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 20px;
      color: #666;
      &:nth-child(2n){
        margin-right: 0;
      }
      &:hover,&.active {
        background-color: #e3f9f4;
        border-color: @xtxColor;
      }
    }
  }
}
</style>
