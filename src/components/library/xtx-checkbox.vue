<template>
  <div class="xtx-checkbox" @click="changechecked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot/></span>
  </div>
</template>

<script>
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 第一种方式
    // const checked = ref(false)
    // const changechecked = () => {
    //   checked.value = !checked.value
    //   emit('update:modelValue', checked.value)
    // }
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // }, { immediate: true })
    // 第二种使用vueuse
    const checked = useVModel(props, 'modelValue', emit)
    const changechecked = () => {
      const newVal = !checked.value
      // 通知父组件
      checked.value = newVal
      // 让组件支持change事件
      emit('change', newVal)
    }
    return {
      checked,
      changechecked
    }
  }
}
</script>

<style lang="less" scoped>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
