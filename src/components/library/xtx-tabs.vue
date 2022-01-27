<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    const tabCilck = (name, i) => {
      activeName.value = name
      emit('tab-click', { name, i })
    }
    provide('activeName', activeName)
    return {
      activeName,
      tabCilck
    }
  },
  render () {
    // 获取插槽的内容
    const panel = this.$slots.default()
    const dynamicPanel = []
    panel.map((item, i) => {
      if (item.type.name === 'XtxTabsPanel') {
        // 静态
        dynamicPanel.push(item)
      } else {
        // v-for动态
        item.children.forEach(item => {
          dynamicPanel.push(item)
        })
      }
    })
    const nav = <nav>{
      dynamicPanel.map((item, i) => {
        return <a onClick={() => this.tabCilck(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href="javascript:;" >{item.props.label}</a>
      })
    }</nav>

    return <div class="xtx-tabs">{[nav, panel]}</div>
  }
}
</script>

<style lang="less" scoped>
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
