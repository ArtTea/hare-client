<template>
    {{currpage}}

  <div class="xtx-pagination">
    <a @click="changePage(currpage-1)" v-if="currpage>1" href="javascript:;" >上一页</a>
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pages.start>1">...</span>
    <a  @click="changePage(i)" v-for="i in pages.btnArr" :key="i" href="javascript:;" :class="{active:currpage===i}">{{i}}</a>
    <span v-if="pages.end<pages.pageCount">...</span>
    <a  @click="changePage(currpage+1)" v-if="currpage<pages.pageCount" href="javascript:;">下一页</a>
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    myCommentSize: {
      type: Number,
      default: 100
    },
    myCurrpage: {
      type: Number,
      default: 1
    },
    myPageSize: {
      type: Number,
      default: 10
    }
  },
  emits: ['currentchange'],
  setup (props, { emit }) {
    // 当前页
    const currpage = ref(1)
    // 数据的总条数
    const commentSize = ref(100)
    // 按钮个数
    const btnCount = 5
    // 每页显示几条数据
    const pageSize = ref(10)
    const pages = computed(() => {
      // 计算出评价的总页数
      const pageCount = Math.ceil(commentSize.value / pageSize.value)
      // 去除按钮个数的中间值
      const offset = Math.floor(btnCount / 2)
      // 按钮的起始页数
      let start = currpage.value - offset
      // 按钮的结束个数
      let end = start + btnCount - 1
      // 起始页码小于1的情况
      if (start < 1) {
        start = 1
        end = (start + btnCount - 1) > pageCount ? pageCount : start + btnCount - 1
      }
      // 结束页码大于总页数
      if (end > pageCount) {
        end = pageCount
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        btnArr,
        end,
        start,
        pageCount
      }
    })
    watch(props, () => {
      currpage.value = props.myCurrpage
      commentSize.value = props.myCommentSize
      pageSize.value = props.myPageSize
    }, { immediate: true })
    const changePage = (page) => {
      currpage.value = page
      emit('currentchange', page)
    }
    return {
      pages,
      currpage,
      changePage
    }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
