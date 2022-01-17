<template>
  <div class='sub-sort'>
    <div class="sort">
      <a @click="ChangStor(null)" :class="{active:sortParams.sortField===null}" href="javascript:;">默认排序</a>
      <a @click="ChangStor('publishTime')" :class="{active:sortParams.sortField==='publishTime'}" href="javascript:;">最新商品</a>
      <a @click="ChangStor('orderNum')" :class="{active:sortParams.sortField==='orderNum'}" href="javascript:;">最高人气</a>
      <a @click="ChangStor('evaluateNum')" :class="{active:sortParams.sortField==='evaluateNum'}" href="javascript:;">评论最多</a>
      <a href="javascript:;" @click="ChangStor('price')">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortMethod==='asc'}" />
        <i class="arrow down" :class="{active:sortParams.sortMethod==='desc'}"/>
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @click="changeCheck" v-model="sortParams.inventory" >仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @click="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup (props, { emit }) {
    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null,
      sortMethod: null
    })
    const ChangStor = (sortField) => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      // 触发sort-Change事件
      emit('sort-Change', sortParams)
    }
    const changeCheck = () => {
      // 触发sort-Change事件
      emit('sort-Change', sortParams)
    }
    return {
      sortParams,
      ChangStor,
      changeCheck
    }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
