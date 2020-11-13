<template>
  <div>
    <el-menu
      :default-active="this.$route.path"
      class="el-menu-demo"
      mode="horizontal"
      :router="true"
      select="index"
    >
      <el-menu-item>个人博客</el-menu-item>
      <el-menu-item index="/">首页</el-menu-item>
      <el-submenu index="user">
        <template slot="title">个人中心</template>
        <el-menu-item index="/userCenter/myComment">我的评论</el-menu-item>
        <el-menu-item index="/userCenter/myArticle">我的文章</el-menu-item>
      </el-submenu>
      <el-menu-item index="/addArticle">写文章</el-menu-item>
      <div class="right">
        <div v-if="isLogin">
          <el-menu-item
            v-text="$root.$data.user.username"
            index="/userMessage"
          ></el-menu-item>
          <el-menu-item @click="logout">退出</el-menu-item>
        </div>
        <div v-else>
          <el-menu-item @click="login">登录</el-menu-item>
          <el-menu-item @click="register">注册</el-menu-item>
        </div>
      </div>
    </el-menu>
    <LoginBox @userMessage="userMessage" :boxVisable="boxVisable"></LoginBox>
  </div>
</template>

<script>
import { logout } from '../api/login'
import LoginBox from './LoginBox1'
import bus from '../utils/bus'
export default {
  name: 'Navbar',
  components: { LoginBox },
  data () {
    return {
      isLogin: '',
      boxVisable: {
        show: false,
        active: ''
      }
    }
  },
  created () {
    bus.$on('showLoginBox', () => {
      this.login()
    })
    if (this.$root.$data.user) {
      this.isLogin = true
      this.boxVisable.show = false
    }
  },
  methods: {
    login () {
      this.boxVisable.show = true
      this.boxVisable.active = 'login'
    },
    register () {
      this.boxVisable.show = true
      this.boxVisable.active = 'register'
    },
    userMessage (user) {
      this.isLogin = true
      console.log(user)
      this.$root.$data.user = user
      localStorage.setItem('user', JSON.stringify(user))
      // location.reload()
    },
    logout () {
      logout().then(
        (res) => {
          this.$message(res.message)
          localStorage.removeItem('user')
          this.isLogin = false
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.right {
  float: right;
  height: 100%;
  .el-menu-item {
    float: left;
    height: 100%;
    padding-top: 4px;
  }
}
a {
  text-decoration: none;
}
.el-menu-demo {
  > .el-menu-item {
    &:first-child {
      font-size: 18px;
      color: #303133;
    }
  }
}
</style>
