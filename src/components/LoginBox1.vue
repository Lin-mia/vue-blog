<template>
  <el-dialog :visible.sync="boxVisable.show" @close="handleClose" ref="loginBox">
    <el-tabs v-model="boxVisable.active">
      <el-tab-pane label="登录" name="login">
        <el-form :model="loginForm" ref="loginForm" :rules="loginRule">
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="password"
          >
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="register">
        <el-form :model="registerForm" ref="registerForm" :rules="registerRule">
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="password"
          >
            <el-input
              v-model="registerForm.password"
              placeholder="请输入密码"
              show-password
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            :label-width="formLabelWidth"
            prop="passwordSecond"
          >
            <el-input
              v-model="registerForm.passwordSecond"
              placeholder="请确认密码"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="register">注册</el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { register, login } from '../api/login'

export default {
  props: {
    boxVisable: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮件地址'))
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.boxVisable.active === 'register') {
          if (this.registerForm.passwordSecond !== '') {
            this.$refs.registerForm.validateField('passwordSecond')
          }
          callback()
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        email: '',
        password: '',
        passwordSecond: ''
      },
      loginRule: {
        email: [{ validator: validateEmail, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }]
      },
      registerRule: {
        email: [{ validator: validateEmail, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        passwordSecond: [{ validator: validatePass2, trigger: 'blur' }]
      },
      formLabelWidth: '100px'
    }
  },
  components: {},
  methods: {
    handleClose () {},
    login () {
      login({ data: this.loginForm }).then(res => {
        this.$message(res.message)
        this.$refs.loginForm.resetFields()
        this.boxVisable.show = false
        this.$emit('userMessage', res.user)
      }).catch(() => {
        this.$refs.loginForm.resetFields()
      })
    },
    register () {
      register({
        data: this.registerForm
      }).then(res => {
        this.$message(res.message)
        this.boxVisable.active = 'login'
        this.loginForm.email = this.registerForm.email
        this.registerForm.password = ''
      })
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-tabs {
  .el-tabs__nav {
    text-align: center;
    left: 50%;
    margin-left: -50px;
  }
  .el-tab-pane {
    margin: 0 100px 0 70px;
    .el-button {
      left: 50%;
      position: relative;
      transform: translateX(-50%);
    }
  }
}
</style>
