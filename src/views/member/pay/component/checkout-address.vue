<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress" >
        <li><span>收<i/>货<i/>人：</span>{{showAddress.receiver}}</li>
        <li><span>联系方式：</span>{{showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/,'$1***$2')}}</li>
      <li><span>收货地址：</span>{{showAddress.fullLocation}}{{showAddress.address}}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
    <!-- 切换收货地址 -->
    <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
      <div @click="selectedAddress=item" class="text item" :class="{active:selectedAddress && selectedAddress.id===item.id}" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i/>货<i/>人：</span>{{item.receiver}}</li>
          <li><span>联系方式：</span>{{item.contact}}</li>
          <li><span>收货地址：</span>{{item.fullLocation.replace(/ /g,'')+item.address}}</li>
        </ul>
      </div>
      <template #footer>
        <XtxButton @click="visibleDialog=false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
      <!-- 收货地址的添加编辑 -->
    <AddressEdit @on-success="successHeandler" ref='AddressEditCom'/>
  </div>
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit.vue'
export default {
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    AddressEdit
  },
  // vue3.0中建议我们在使用自定义事件的时候都在emits中声明
  emits: ['change'],
  setup (props, { emit }) {
    const showAddress = ref(null)
    const defaultAddress = props.list.find(item => item.isDefault)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.list.length) {
        // 让eslint忽略下行代码检查
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }
    // 默认通知父组件地址的id值
    emit('change', showAddress.value && showAddress.value.id)
    // 组件之前的双向数据绑定
    const visibleDialog = ref(false)
    // 记录当前选择的地址id
    const selectedAddress = ref(null)
    const confirmAddressFn = () => {
      showAddress.value = selectedAddress.value
      // 把选中的地址的id传递给父组件
      emit('change', showAddress.value?.id)
      // 关闭选项框
      visibleDialog.value = false
    }
    const openDialog = () => {
      // 清空选项框
      selectedAddress.value = null
      // 打开选项框
      visibleDialog.value = true
    }
    // 打开添加地址组件
    const AddressEditCom = ref(null)
    const openAddressEdit = (address) => {
      AddressEditCom.value.open(address)
    }
    // 添加收货地址后，往list中添加数据
    const successHeandler = (fromData) => {
      const address = props.list.find(item => item.id === fromData.id)
      if (address) {
        for (const key in fromData) {
          address[key] = fromData[key]
        }
      } else {
        // 因为在完成后需要清空formData但是应为是复杂数据类型，引用的是同一个地址，所有需要克隆
        const jsonstr = JSON.stringify(fromData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonstr))
      }
    }
    return {
      showAddress,
      visibleDialog,
      confirmAddressFn,
      selectedAddress,
      openDialog,
      AddressEditCom,
      openAddressEdit,
      successHeandler
    }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,&:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor,50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
