<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <div class="form-head">
        <img src="@/assets/logo_index.png" alt="黑马头条号">
      </div>
      <!-- 配置校验规则：rules 规则对象配置到 el-form 上，prop 校验字段配置到 el-form-item 上。javascript 触发验证：给 el-form 添加 ref 调用this.$refs['refs名字'].validate(valid => {}) -->
      <el-form class="login-form" ref="form" :model="form" :rules="rules">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-col 栅格布局，一共 24 列，:span 用来指定占用的大小，:offset 用来指定偏移量 -->
          <el-col :span="16">
            <el-input v-model="form.code" placeholder="验证码"></el-input>
          </el-col>
          <el-col :offset="1" :span="7">
            <!-- <el-button @click="handleSendCode">获取验证码</el-button> -->
            <el-button @click="handleSendCode" :disabled="!!codeTimer" :loading="codeLoading">{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码'}}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
          <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="handleLogin" :loading="loginLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/vendor/gt' // 引入极验 javascript SDK 文件， 通过 window.initGeetest 使用
import { saveUser } from '@/utils/auth'
const initCodeTimeSeconds = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据对象
        mobile: '',
        code: '',
        agree: ''
      },
      rules: { // 验证数据对象
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { len: 11, message: '长度必须为11位', trigger: 'blur' }
          { pattern: /\d{11}/, message: '请输入有效的手机号码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          // { len: 6, message: '长度必须为6位', trigger: 'blur' }
          { pattern: /\d{6}/, message: '请输入有效的验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' },
          { pattern: /true/, message: '请同意用户协议' }
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeSeconds,
      loginLoading: false,
      codeLoading: false
    }
  },
  methods: {
    handleLogin () {
      // 使用 form 组件的 validate 放法触发校验，获取校验的状态
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过提交请求
        this.submitLogin()
      })
    },
    async submitLogin () {
      this.loginLoading = true
      try {
        const res = await this.$http({
          method: 'POST',
          url: '/authorizations',
          data: this.form
        })
        const userInfo = res
        // window.localStorage.setItem('user_info', JSON.stringify(userInfo))
        saveUser(userInfo)
        this.$message({
          message: '登录成功！',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        this.$message.error('登录失败，手机号或验证码错误')
      }
      this.loginLoading = false
    },
    handleSendCode () {
      // 验证手机号是否有效
      this.$refs['form'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        // 验证通过，初始化显示验证码
        this.showGeetest()
      })
    },
    // 验证通过，初始化显示人机交互验证码
    async showGeetest () {
      try {
        this.codeLoading = true
        const { mobile } = this.form
        const res = await this.$http({
          method: 'GET',
          url: `/authorizations/${mobile}`
        })
        const { data } = res.data
        window.initGeetest(
          {
            // 以下配置参数来自服务端 SDK
            gt: data.gt,
            challenge: data.challenge,
            offline: !data.success,
            new_captcha: data.new_captcha,
            product: 'bind' // 隐藏式
          },
          captchaObj => {
            captchaObj
              .onReady(() => {
                this.codeLoading = false
                // 验证码ready之后才能调用verify方法显示验证码
                captchaObj.verify() // 弹出验证码框
              })
              .onSuccess(async () => {
                // your code
                try {
                  const {
                    geetest_challenge: challenge,
                    geetest_seccode: seccode,
                    geetest_validate: validate
                  } = captchaObj.getValidate()
                  // 发送短信
                  await this.$http({
                    method: 'GET',
                    url: `/authorizations/${mobile}`,
                    params: {
                      challenge,
                      seccode,
                      validate
                    }
                  })
                } catch (error) {
                  this.$message.error('获取验证码失败')
                  this.codeLoading = false
                }
                // 发送短信成功，开始倒计时
                this.codeCodeDown()
              })
              .onError(function () {
                // your code
              })

            // 在这里注册 “发送验证码” 按钮点击事件，然后验证用户是否输入手机号以及手机号是否正确，
            // captchaObj.verify
          }
        )
      } catch (err) {
        this.$message.error('获取验证码失败')
        this.codeLoading = false
      }
    },
    // 验证码倒计时
    codeCodeDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          // 清除定时器
          window.clearInterval(this.codeTimer)
          // 让倒计时的时间回归初始状态
          this.codeTimeSeconds = initCodeTimeSeconds
          this.codeTimer = null // 将存储定时器引用的变量重新赋值为 null
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.login-wrap {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(../../assets/login_bg.jpg);
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 400px;
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    .btn-login {
      width: 100%;
    }
  }
  .agree-text {
    font-size: 15px;
    a {
      color: aqua;
      text-decoration: none;
    }
  }
}
</style>
