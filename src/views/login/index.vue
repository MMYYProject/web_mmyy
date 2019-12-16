<template>
  <div class="login-container">
    <div class="login-wrap">
      <div class="login-logo-wrap">
        <img src="@/assets/login_images/login.png" alt="">
      </div>
      <div class="login-form-wrap">
        <el-form ref="loginForm" :model="loginForm" class="login-form" autocomplete="on" label-position="left">
          <div class="logo">
            <img src="@/assets/login_images/logo.png" alt="">
          </div>
          <h3>亲子年货节商户后台</h3>
          <el-form-item prop="username" class="login_form_phone">
            <el-input
              ref="mobile"
              v-model="loginForm.mobile"
              placeholder="请输入手机号"
              name="mobile"
              type="text"
              tabindex="1"
              autocomplete="false"
            />
          </el-form-item>

          <el-form-item class="login_form_password">
            <el-input
              ref="vcode"
              v-model="loginForm.vcode"
              placeholder="请输入验证码"
              name="vcode"
              type="text"
              tabindex="1"
              autocomplete="false"
            />
          </el-form-item>

          <el-form-item class="login_form_send_vcode">
            <el-button
              v-if="allowSendVcode"
              type="primary"
              class="login_form_vcode_button"
              @click="sendVcode"
            >点击发送验证码</el-button>
            <el-button
              v-else
              disabled
              type="primary"
              class="login_form_vcode_button"
            >{{ countDownTime }} 秒后可重新发送</el-button>
          </el-form-item>
          <el-button
            class="login_button"
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="login"
          >登录</el-button>

          <div class="tips">
            温馨提示：登录后请尽快移步至店铺装修处装修您的店铺。
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { sendCode } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: undefined,
        vcode: undefined
      },
      allowSendVcode: true,
      countDownTime: 60,
      mobile_rule: /^1\d{10}$/,
      mobile_error: '请输入正确的手机号',
      vcode_error: '请输入正确的验证码',
      curVcode: '1111',
      loading: false,
      redirect: this.$route.query.redirect
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
        // const query = route.query
        // if (query) {
        //   this.redirect = query.redirect
        // }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.mobile === '') {
      this.$refs.mobile.focus()
    } else if (this.loginForm.vcode === '') {
      this.$refs.vcode.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    sendVcode() {
      const { mobile } = this.loginForm
      if (this.mobile_rule.test(mobile)) {
        sendCode(mobile)
          .then(res => {
            this.$message.success(res.msg)
            this.curVcode = res.obj
            this.allowSendVcode = false
            this.countDown()
          })
          .catch(() => {
            this.$message.error('发送验证码失败')
          })
      } else {
        this.$message.error(this.mobile_error)
      }
    },
    countDown() {
      if (this.countDownTime > 0) {
        this.countDownTime -= 1
        setTimeout(() => {
          this.countDown()
        }, 1000)
      } else {
        this.allowSendVcode = true
        this.countDownTime = 60
      }
    },
    login() {
      const { mobile, vcode } = this.loginForm
      if (!this.mobile_rule.test(mobile)) {
        this.$message.error(this.mobile_error)
        return
      } else if (vcode !== this.curVcode) {
        this.$message.error(this.vcode_error)
        return
      }
      this.loading = true
      this.$store.dispatch('user/login', mobile).then(res => {
        this.$router.push({ path: this.redirect || '/' })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$font_color: #333;
$link_color: #04A7F9;
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@mixin font($size: 18px, $color: $font_color, $weight: 400) {
  font-size: $size;
  font-weight: $weight;
  color: $color;
}

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position: relative;
  background: url('../../assets/login_images/bg.png');
  .login-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -380px;
    margin-left: -690px;
    width: 1380px;
    height: 760px;
    .login-logo-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      float: left;
      width: 760px;
      height: 100%;
      border-radius: 10px 0px 0px 10px;
      overflow: hidden;
      .img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
    .login-form-wrap {
      float: left;
      padding: 0 150px;
      width: 620px;
      height: 100%;
      background: #fff;
      border-radius: 0px 10px 10px 0px;

      .logo {
        margin: 97px auto 30px;
        width: 82px;
        height: 95px;
        text-align: center;
        img {
          width: 100%;
          height: 100%;
        }
      }

      h3 {
        font-size: 28px;
        font-weight: 500;
        text-align: center;
      }

      .el-form-item {
        margin-bottom: 24px;
        width: 320px;
        height: 45px;
        @include font;
        border-radius: 5px;

        .el-input {
          height: 45px;
          line-height: 45px;
          background: rgba(5, 44, 101, .2);
          border-radius: 4px;
          input {
            padding: 0px;
            height: 45px;
            line-height: 45px;
            text-indent: 21px;
            background: transparent;
            border: none;
            @include font;
            &::-webkit-input-placeholder {
              color: $font_color;
            }
            &::-moz-input-placeholder {
              color: $font_color;
            }
            &::-ms-input-placeholder {
              color: $font_color;
            }

          }
        }

      }

      .vcode-form-item {
        .el-input {
          width: 220px;
          float: left;
          & + div {
            float: right;
            width: 100px;
            height: 45px;
            line-height: 45px;
            text-align: right;
            @include font;
          }
        }
      }

      .login_form_password {
        margin-bottom: 24px;
      }
      .login_form_send_vcode {
        text-align: right;
        margin-bottom: 32px;
      }

      .login-button {
        margin-bottom: 16px!important;
        width: 317px!important;
        height: 54px;
        line-height: 54px;
        padding: 0px;
        background: linear-gradient(90deg,rgba(4,172,251,1) 0%,rgba(1,130,232,1) 100%);
        border-radius: 4px;
        @include font(28px, #fff);
      }

      .tips {
        @include font;
        a {
          margin-left: 12px;
          color: $link_color;
        }
      }

    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
