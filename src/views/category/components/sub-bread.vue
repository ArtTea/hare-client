<template>
  <div class='sub-bread'>
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem v-if="category.top" :key="category.top.id" :to="`/category/${category.top.id}`">{{category.top.name}}</XtxBreadItem>
        </transition>
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem v-if="category.sub" :key="category.sub.id">{{category.sub.name}}</XtxBreadItem>
        </transition>
      </XtxBread>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup () {
    const route = useRoute()
    const store = useStore()
    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => sub.id === route.params.id)
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return { category }
  }

}
</script>
<style lang="less" scoped>
// 样式的过渡
.fade-right-enter-from,
.fade-right-leave-from{
  transform: translateX(20px);
  opacity: 0;
}
.fade-right-enter-active,
.fade-right-leave-active{
  transition: all .5s;
}
.fade-right-enter-to,
.fade-right-leave-to{
  transform: none;
  opacity: 1;
}

</style>
