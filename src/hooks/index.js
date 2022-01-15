import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
/*
*[element]target DOM元素
*[funtion]apiFn api函数
*/
// 在useLazyData需要的api函数，单数如果需要传参需要我们自己写函数在调用api函数进行传参
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)

  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项
    {
      // 相交比例多少开始加载
      threshold: 0
    }
  )
  return { target, result }
}
