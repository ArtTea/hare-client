/* eslint-disable no-useless-return */
<template>
  <div class='xtx-carousel' @mouseenter="stop" @mouseleave="star">
    <ul class="carousel-body">
      <li class="carousel-item" v-for="(item,i) in sliders " :key="item.id" :class="{fade:index===i}"  >
        <RouterLink :to="item.hrefUrl"  v-if="item.imgUrl">
          <img :src="item.imgUrl" alt="">
        </RouterLink>
        <div v-else class="slider">
          <RouterLink v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"><i class="iconfont icon-angle-left"></i></a>
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span @click="index=i" v-for="(item,i) in sliders " :key="i" :class="{active:index===i}"></span>
    </div>
  </div>

</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    // 是否是的轮播
    autoPlay: {
      type: Boolean,
      default: false
    },
    // 轮播间隔时长
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    const index = ref(0)
    // 自动轮播的逻辑
    let timer = null
    const autoPalyFn = () => {
      // 每次开启前先清除上一个定时器
      clearInterval(timer)
      // 自动播放，间隔一定时间切换定时器
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    // 监听轮播图数据的变化
    watch(() => props.sliders, (newval) => {
      if (newval.length && props.autoPlay) {
        autoPalyFn()
      }
    }, { immediate: true })
    // 鼠标经过停止定时器
    const stop = () => {
      if (timer)clearInterval(timer)
    }
    // 鼠标离开开启定时器
    const star = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPalyFn()
      }
    }
    // 点击左右切换轮播图
    const toggle = (step) => {
      const newIndex = index.value + step
      // 如果newindex大于数组长度
      if (newIndex > (props.sliders.length - 1)) {
        index.value = 0
        return
      }
      // 如果newindexx小于0
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      index.value = newIndex
    }
    // 组件销毁时，清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      index,
      stop,
      star,
      toggle
    }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel{
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel{
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background:  #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0,0,0,.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev{
        left: 20px;
      }
      &.next{
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
// 轮播商品
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px!important;
      height: 230px!important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
