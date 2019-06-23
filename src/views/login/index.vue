<template>
    <div class="login-wrap">
        <el-form class="login-form" ref="form" :model="form" >
            <div><img src="../../assets/logo_index.png" alt=""></div>
            <el-form-item>
                <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-col :offset="1" :span="13">
                    <el-input v-model="form.code" placeholder="验证码"></el-input>
                </el-col>
                <el-col :offset="1" :span="9">
                    <el-button @click="handleSendCode">获取验证码</el-button>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handelLogin">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios'
import '@/vendor/gt'
export default {
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    handelLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      })
        .then(res => {
          console.log(res.data)
          this.$message({
            message: '恭喜你，登录成功',
            type: 'success'
          })
          this.$router.push({
            name: 'home'
          })
        })
        .catch((e) => {
          this.$message.error('登录失败，手机号或验证码错误')
        })
    },
    handleSendCode () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest({
          // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隐藏，直接弹出式
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          captchaObj.onReady(function () {
            // 验证码ready之后才能调用verify方法显示验证码
            captchaObj.verify()
          }).onSuccess(function () {
            // 人机交互验证通过
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
                            captchaObj.getValidate()

            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {

            })
          }).onError(function () {
            // your code
          })
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login-wrap {
        height: 100%;
        background: url(../../assets/login_bg.jpg);
        display: flex;
        justify-content: center;
        align-items: center;
        .login-form {
            background-color: #fff;
            padding: 20px;
            border-radius: 20px;
        }
    }
</style>
