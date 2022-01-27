import Mock from 'mockjs'
import qs from 'qs'
// mock的配置
Mock.setup({
  // 随机延时500-1000毫秒
  timeout: '500-1000'
})
Mock.mock(/\/my\/text/, () => {
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr.push(Mock.mock({
      id: '@id',
      name: '@cname',
      image: '@Image(200x100)'
    }))
  }
  return {
    mag: '获取数据成功',
    data: arr
  }
})
// 模拟我的收藏
Mock.mock(/\/member\/collect/, config => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  const items = []
  for (let i = 0; i < +queryObject.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      picture: "@Image('160x160', '#4A7BF7', 'Hello')"
    }))
  }
  return {
    mag: '获取数据成功',
    result: {
      counts: 35,
      pageSize: +queryObject.pageSize,
      page: +queryObject.queryObject,
      items
    }
  }
})
