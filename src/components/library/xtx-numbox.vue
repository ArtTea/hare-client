<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{label}}</div>
    <div class="numbox">
      <a @click="changeNUm(-1)" href="javascript:;">-</a>
      <input type="text" readonly :value="modelValue">
      <a @click="changeNUm(1)" href="javascript:;">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // shiyong1cueuse的useVmodel做数据绑定修改count通知父组件改值
    const count = useVModel(props, 'modelValue', emit)
    const changeNUm = (step) => {
      const newval = count.value + step
      // 判断得到的值是否大于最小值大于最大值

      if (newval < props.min || newval > props.max) return

      count.value = newval

      emit('change', newval)
    }
    return {
      changeNUm
    }
  }

}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right:1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left:1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
