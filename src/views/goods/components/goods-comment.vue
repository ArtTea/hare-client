<template>
  <div class="goods-comment" v-if="commentInfo">
    <div class="head">
      <div class="data">
        <p><span>{{commentInfo.salesCount}}</span><span>人购买</span></p>
        <p><span>{{commentInfo.praisePercent}}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
          v-for="(item,i) in commentInfo.tags"
          :key="item.title"
          @click="changecomment(i)"
          href="javascript:;"
          :class="{active:commentIndex===i}"
          >{{item.title}}({{item.tagCount}})
          </a>
        </div>
      </div>
    </div>
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a @click="changeSort(null)" href="javascript:;" :class="{active:reqParams.sortField===null}">默认</a>
      <a @click="changeSort(praiseCount)" href="javascript:;" :class="{active:reqParams.sortField==='praiseCount'}">最新</a>
      <a @click="changeSort(createTime)" href="javascript:;" :class="{active:reqParams.sortField==='createTime'}">最热</a>
    </div>
  <!-- 列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{formatNickname(item.member.nickname)}}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i+ 's'" class="iconfont icon-wjx01"></i>

            <i v-for="i in 5-item.score" :key="i+ 'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{formatSpecs(item.orderInfo.specs)}}</span>
          </div>
          <div class="text">{{item.content}}</div>
          <!-- 评价图片组件 -->
          <GoodsCommentImage :pictures="item.pictures" v-if="item.pictures.length"/>
          <div class="time">
            <span>{{item.orderInfo.createTime}}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{item.praiseCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <XtxPagination v-if="commentSize" @currentchange="changePageFn" :myCommentSize="commentSize" :myCurrpage="reqParams.page" :myPageSize="reqParams.pageSize"/>
  </div>
</template>
<script>
import { findCommentInfoByGoods, findCommentInfoByList } from '@/api/goods.js'
import { inject, reactive, ref, watch } from 'vue'
import GoodsCommentImage from './goods-comment-image.vue'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage
  },
  setup () {
    // 获取goods数据
    const goods = inject('goods')
    // 创建存储数据变量
    const commentInfo = ref(null)

    findCommentInfoByGoods(goods.value.id).then(data => {
      // 往tags插入数据
      data.result.tags.unshift({ title: '有图', tagCount: data.result.hasPictureCount, tag: 'img' })
      data.result.tags.unshift({ title: '全部', tagCount: data.result.evaluateCount, tag: 'all' })
      commentInfo.value = data.result
    })
    // 创建选中数据变量
    const commentIndex = ref(0)
    // 创建cilck事件更改选中状态
    const changecomment = (i) => {
      commentIndex.value = i
      // 判断选中按钮，更改reqParams数据
      const tag = commentInfo.value.tags[i].tag
      if (tag === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag === 'img') {
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.hasPicture = null
        reqParams.tag = commentInfo.value.tags[i].title
      }
      // 重置页码值
      reqParams.page = 1
    }
    const changeSort = (sortField) => {
      reqParams.sortField = sortField
      // 重置页码值
      reqParams.page = 1
    }

    // 定义筛选条件
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 排序字段，可选值范围[praiseCount最热,createTime最新]
      sortField: null
    })
    const commentList = ref([])
    const commentSize = ref(0)
    watch(reqParams, () => {
      findCommentInfoByList(goods.value.id, reqParams).then(data => {
        commentList.value = data.result.items
        // 接收总评价条数
        commentSize.value = data.result.counts
      })
    }, { immediate: true })
    // 定义过滤规格的函数
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}:${c.nameValue}`, '').trim()
    }
    // 格式化名字的过滤器
    const formatNickname = (Nickname) => {
      return Nickname.substr(0, 1) + '****' + Nickname.substr(-1)
    }
    const changePageFn = (newPage) => {
      reqParams.page = newPage
    }
    return {
      goods,
      commentInfo,
      commentIndex,
      changecomment,
      reqParams,
      commentList,
      changeSort,
      formatSpecs,
      formatNickname,
      commentSize,
      changePageFn
    }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor,50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,&:hover {
        color: @xtxColor;
      }
    }
  }
}
 .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
</style>
