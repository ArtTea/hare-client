<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.name">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img @click="changSku(item, val)" :class="{selected:val.selected,disabled:val.disabled}" v-if="val.picture" :src="val.picture" :alt="val.name">
          <span @click="changSku(item,val)" :class="{selected:val.selected,disabled:val.disabled}" v-else>{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set.js'
// 初始化选中数据
const initselectedVal = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(vals => vals.name === sku.specs[i].valueName)
    val.selected = true
  })
}

const spliter = '☆'
const getPathMap = (skus) => {
  const pathMap = {}
  // 循环筛选sku下所有的数据
  skus.forEach(sku => {
    // 判断是否有库存
    if (sku.inventory > 0) {
      // 查找可选数组的值
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选数组的子集
      const valueArrpowerSet = powerSet(valueArr)
      valueArrpowerSet.forEach(arr => {
        const key = arr.join(spliter)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
const getSlectedValues = (specs) => {
  const arr = []
  // 遍历每一个属性
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    // 判断值按钮是否被选中
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, i) => {
    const slectedValues = getSlectedValues(specs)
    item.values.forEach(val => {
      // 如果当前值已被选中
      if (val.selected) return
      // 把值push给slectedValues
      slectedValues[i] = val.name
      // 去除undefined,有☆拼接字符串
      const key = slectedValues.filter(value => value).join(spliter)
      // 根据在pathMap中是否有值，判断是否禁用
      val.disabled = !pathMap[key]
    })
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 初始化选中数据
    if (props.skuId) {
      initselectedVal(props.goods, props.skuId)
    }
    const pathMap = getPathMap(props.goods.skus)
    // 组件初始化更新状态
    updateDisabledStatus(props.goods.specs, pathMap)
    const changSku = (item, val) => {
      // 判断是否为禁用
      if (val.disabled) return
      // 当选项选中时
      if (val.selected) {
        val.selected = false
      } else {
      // 当选项为未选中时
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将数据提交给父组件
      const avlidSlectedValues = getSlectedValues(props.goods.specs).filter(v => v)
      // 判断数组长度是否等于属性规格的长度
      if (avlidSlectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[avlidSlectedValues.join(spliter)]
        const sku = props.goods.skus.find(item => item.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}:${c.valueName}`, '').trim()
        })
      } else {
        emit('change', {})
      }
    }

    return {
      changSku
    }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        margin-top: 5px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-top: 5px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
