<template>
  <div class="goods-image">
    <!-- 大图 -->
      <div class="large" v-if="show" :style="[{backgroundImage:`url(${images[currIndex]})`},largeposition] "></div>
      <!-- 中图 -->
    <div class="middle">
      <img :src="images[currIndex]" alt="" ref="target">
      <!-- 遮罩层 -->
      <div class="layer" :style="layerposition"></div>
    </div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { ref, reactive, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)
    // 控制大图显示隐藏
    const show = ref(false)
    // 控制遮罩层的位置
    const layerposition = reactive({
      left: 0,
      top: 0
    })
    // 控制大图得我背景位置
    const largeposition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 利用useMouseInElement方法获取鼠标在元素内的坐标位置
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    watch([elementX, elementY, isOutside], () => {
      // 根据获取的数据把数据赋值给新的值
      show.value = !isOutside.value
      const psosition = { x: 0, y: 0 }
      // 判断x的坐标
      if (elementX.value < 100) psosition.x = 0
      else if (elementX.value > 300) psosition.x = 200
      else psosition.x = elementX.value - 100
      // 判断y的坐标
      if (elementY.value < 100) psosition.y = 0
      else if (elementY.value > 300) psosition.y = 200
      else psosition.y = elementY.value - 100
      layerposition.left = psosition.x + 'px'
      layerposition.top = psosition.y + 'px'
      largeposition.backgroundPositionX = -2 * psosition.x + 'px'
      largeposition.backgroundPositionY = -2 * psosition.y + 'px'
    })
    return {
      currIndex,
      show,
      layerposition,
      largeposition,
      target
    }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0,0,0,.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
