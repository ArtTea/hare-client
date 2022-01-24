// 提供一个能显示xtx-message的容器
// 这个函数将来可以直接导入使用也可以挂载到vue实力上使用
import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'
// 创建装载Message的容器
const div = document.createElement('div')
let timer = null
// 给div添加class作为标识符
div.setAttribute('class', 'xtx-massgae-container')
document.body.appendChild(div)

export default ({ text, type }) => {
  // 渲染组件
  // 导入消息提示组件
  // 将消息提示组件编译成虚拟节点
  const vnode = createVNode(XtxMessage, { text, type })
  // 准备一个装载节点提示组件容器
  // 将虚拟节点渲染在容器中
  render(vnode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 2000)
}
