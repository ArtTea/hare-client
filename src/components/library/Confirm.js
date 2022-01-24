// 提供一个能显示xtx-confirm的容器
// 这个函数将来可以直接导入使用也可以挂载到vue实力上使用
import { createVNode, render } from 'vue'
import XtxConfirm from './xtx-confirm.vue'
// 创建装载XtxComfirm的容器
const div = document.createElement('div')
// 给div添加class作为标识符
div.setAttribute('class', 'xtx-comfirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    // 渲染组件
    // 将消息提示组件编译成虚拟节点
    const vnode = createVNode(XtxConfirm, { text, title, cancelCallback, submitCallback })
    // 准备一个装载节点提示组件容器
    // 将虚拟节点渲染在容器中
    render(vnode, div)
  })
}
