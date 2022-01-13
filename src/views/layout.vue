<template>
  <!-- 顶部区域 -->
  <appNarbar></appNarbar>
  <!-- 头部区域 -->
  <appHeader></appHeader>
  <!-- 吸顶头部区域 -->
  <appHeaderSticky></appHeaderSticky>
  <!-- 内容区域 -->
  <div class="app-body">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>
  <!-- 尾部区域 -->
  <appFooter></appFooter>
</template>

<script>
import appNarbar from '@/components/app-topnav.vue'
import appHeader from '@/components/app-header.vue'
import appFooter from '@/components/app-footer.vue'
import appHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    appNarbar,
    appHeader,
    appFooter,
    appHeaderSticky
  },
  setup () {
    const sotre = useStore()
    sotre.dispatch('category/getCategory')
  }
}
</script>

<style lang='less' scoped>
.app-body{
  min-height: 600px;
}
</style>
