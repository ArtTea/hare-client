<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;"  v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form ref="formCom" class="form" :validation-schema="schema" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名或手机号" />
          </div>
          <div v-if="errors.account" class="error"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码"/>
          </div>
          <div v-if="errors.password" class="error"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.mobile}" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
           <div v-if="errors.mobile" class="error"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.code}" v-model="form.code" name="code" type=" " placeholder="请输入验证码"/>
            <span @click="send" class="code">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
          </div>
           <div v-if="errors.code" class="error"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
          <div v-if="errors.isAgree" class="error"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a @click="login" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import schema from '@/utils/validation-schema.js'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user.js'
import { Form, Field } from 'vee-validate'
import { ref, reactive, watch, onMounted } from 'vue'
import Message from '@/components/library/Message.js'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: {
    Form,
    Field
  },
  setup () {
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: false,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // vee-validate校验基本步骤
    // 导入From Feild组件，将from和input替换
    // Feild需要进行数据绑定，字段名最好和后台数据接口保持一致
    // 定义Feild的name属性指定校验规则，From的validation-schema接受定义好的校验规则
    const myschema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      isAgree: schema.isAgree
    }
    const formCom = ref(null)
    watch(isMsgLogin, () => {
    // 重置数据
      form.isAgree = false
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 重置表单
      formCom.value.resetForm()
    })
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const login = async () => {
      // Form提供了一个validate函数作为整体校验，返回的是一个promise函数
      const valid = await formCom.value.validate()
      if (valid) {
        try {
          let data = null
          if (isMsgLogin.value) {
            // 手机号码登录
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
            // 账户登录
            const { account, password } = form
            // 发送登录信息
            data = await userAccountLogin({ account, password })
          }
          // 发送请求后的后续操作
          const { id, account, avatar, mobile, nickname, token } = data.result
          // 存储个人信息
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 进行跳转
            router.push(route.query.redirectUrl || '/')
            // 消息提示
            Message({ type: 'success', text: '登录成功' })
          })
        } catch (e) {
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.massage || '登录失败' })
          }
        }
      }
    }
    const time = ref(0)
    // 设置定时器pause为暂停，resume为开始
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value === 0) {
        pause()
      }
    }, 1000, false)
    // 组件销毁时销毁定时器
    onMounted(() => {
      pause()
    })
    // 发送短信
    const send = async () => {
      const valid = myschema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
          // 倒计时结束可以发送
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 不通过
        formCom.value.setFieldError('mobile', valid)
      }
    }
    return { isMsgLogin, form, schema: myschema, formCom, login, send, time }
  }

}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
