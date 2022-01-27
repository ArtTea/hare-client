<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" >
      <span v-if="fullLocation" class="value">{{fullLocation}}</span>
      <span v-else class="placeholder">{{placeholder}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-show="visble" >
      <div v-if="loading" class="loading">
      </div>
      <template v-else>
       <span @click="changeCity(city)" class="ellipsis" v-for="city in cityList" :key="city.code">{{city.name}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 显示隐藏数据
    const visble = ref(false)
    // 所有的省市区数据
    const allCity = ref([])
    // 加载状态
    const loading = ref(false)
    // 打开关闭按钮
    const open = () => {
      visble.value = true
      loading.value = true
      getCityData().then(data => {
        allCity.value = data
        loading.value = false
      })
      // 清空之前的选择
      for (const k in changeResult) {
        changeResult[k] = ''
      }
    }
    const close = () => {
      visble.value = false
    }
    // 提供切换功能
    const toggle = () => {
      visble.value ? close() : open()
    }
    const target = ref(null)

    onClickOutside(target, () => {
      close()
    })
    // 通过计算属性获取当前显示数组
    const cityList = computed(() => {
      // 默认省一级
      let list = allCity.value
      // 默认市一级
      if (changeResult.provinceCode) {
        list = list.find(city => city.code === changeResult.provinceCode).areaList
      }
      // 默认区一级
      if (changeResult.cityCode) {
        list = list.find(county => county.code === changeResult.cityCode).areaList
      }
      return list
    })
    // 获取选择地址数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 点击按钮获取数据
    const changeCity = (city) => {
      // 省
      if (city.level === 0) {
        changeResult.provinceCode = city.code
        changeResult.provinceName = city.name
      }
      // 市
      if (city.level === 1) {
        changeResult.cityCode = city.code
        changeResult.cityName = city.name
      }
      // 区
      if (city.level === 2) {
        changeResult.countyCode = city.code
        changeResult.countyName = city.name
        // 最后一级
        close()
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        emit('change', changeResult)
      }
    }
    return {
      visble,
      toggle,
      target,
      cityList,
      loading,
      changeCity
    }
  }
}
const getCityData = () => {
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(~@/assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
