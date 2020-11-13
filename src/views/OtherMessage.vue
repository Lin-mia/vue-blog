<template>
  <div class="container">
    <el-row class="tac" :gutter="40">
      <template v-if="loaded">
        <el-col :span="6" :offset="2">
          <div id="avatar">
            <img :src="avatar ? 'http://127.0.0.1:3000/' + avatar : ''" />
          </div>
          <el-table :data="userData" style="width: 100%" :show-header="false">
            <el-table-column prop="title"> </el-table-column>
            <el-table-column prop="content"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <h1>TA的文章</h1>
          <div v-if="articles.length === 0" style="text-align: center">
            TA还没有发布文章T^T
          </div>
          <template v-else>
            <ArticleBox :articles="articles"></ArticleBox>
            <el-pagination
              :hide-on-single-page="true"
              :page-size="pageSize"
              layout="prev, pager, next"
              @current-change="currentChange"
              :total="total"
              :current-page="currentPage"
            >
            </el-pagination>
          </template>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import ArticleBox from '../components/ArticleBox'
import { othermessage, articleList } from '../api/login'
import { dateFormat } from '../utils/dateFormat'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loaded: false,
      userData: [],
      articles: [],
      avatar: '',
      dateFormat
    }
  },
  created () {
    othermessage(this.$route.params.id)
      .then((res) => {
        this.total = res.total
        this.articles = res.articles
        let user = res.user
        this.avatar = user.avatar
        this.userData = [
          {
            title: '用户名',
            content: user.username
          },
          {
            title: '性别',
            content: user.sex === 0 ? '女' : '男'
          },
          {
            title: '生日',
            content: user.birthday ? dateFormat(user.birthday) : '暂无数据'
          },
          {
            title: '自我介绍',
            content: user.produce ? user.produce : '暂无数据'
          }
        ]
      })
      .finally(() => {
        this.loaded = true
      })
  },
  methods: {
    currentChange (currentPage) {
      articleList(this.$route.params.id, { page: currentPage }).then(
        (res) => {
          this.articles = res.articles
          this.pageSize = res.pagesize
          this.total = res.total
        }
      )
    }
  },
  components: {
    ArticleBox
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-row {
  margin: 0 !important;
}
#avatar {
  text-align: center;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  margin-bottom: 10px;
}
#avatar img {
  width: 100%;
}
.el-col {
  h1 {
    text-align: center;
    font-size: 20px;
    font-weight: normal;
    padding: 20px;
  }
}
</style>
