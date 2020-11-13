<template>
  <div class="container">
    <el-row class="tac" :gutter="40">
      <el-col :span="4" :offset="4">
        <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          :router="true"
        >
          <el-menu-item index="/userCenter/myArticle">
            <i class="el-icon-tickets"></i>
            <span slot="title">我的文章</span>
          </el-menu-item>
          <el-menu-item index="/userCenter/myComment">
            <i class="el-icon-chat-line-round"></i>
            <span slot="title">我的评论</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="12">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uid: this.$root.$data.user._id,
      contents: []
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-row {
  margin: 0 !important;
}
</style>
