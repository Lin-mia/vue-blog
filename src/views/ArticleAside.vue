<template >
  <div class="container">
    <template v-if="loaded">
      <div v-if="articles.length === 0">您还没有发表过文章</div>
      <div v-else>
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
      </div>
    </template>
  </div>
</template>

<script>
import ArticleBox from '../components/ArticleBox'
import { articleList } from '../api/login'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loaded: false,
      articles: []
    }
  },
  created () {
    articleList(this.$root.$data.user._id, { page: 1 })
      .then((res) => {
        this.articles = res.articles
        this.pageSize = res.pagesize
        this.total = res.total
      })
      .finally(() => {
        this.loaded = true
      })
  },
  methods: {
    currentChange (currentPage) {
      articleList(this.$root.$data.user._id, { page: currentPage }).then((res) => {
        this.articles = res.articles
        this.pageSize = res.pagesize
        this.total = res.total
      })
    }
  },
  components: {
    ArticleBox
  }
}
</script>

<style scoped lang="scss">
div {
  text-align: center;
  margin: 20px 0;
}
</style>
