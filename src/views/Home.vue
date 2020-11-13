<template>
  <div class="container">
    <el-row class="row" :gutter="40">
      <div>
        <el-col :span="18" class="">
          <div class="mycover">开始你的创作吧</div>
          <el-row>
            <el-col :span="24">
              <template v-if="loaded">
                <div v-if="articles.length === 0">
                  <el-card style="text-align: center">没有文章数据</el-card>
                </div>
                <el-card
                  v-for="(article, index) in articles"
                  :key="index"
                  v-else
                >
                  <el-row class="imgbox">
                    <img
                      :src="
                        article.cover
                          ? 'http://127.0.0.1:3000/' + article.cover
                          : 'http://127.0.0.1:3000/uploads/default.jpg'
                      "
                    />
                  </el-row>
                  <div class="caption">
                    <a :href="'/articleDetail/' + article._id">
                      <h3 class="ell">{{ article.title }}</h3>
                    </a>
                    <p class="addell">{{ article.content }}</p>
                  </div>
                </el-card>
              </template>
              <el-pagination
                :hide-on-single-page="true"
                :page-size="pageSize"
                layout="prev, pager, next"
                @current-change="currentChange"
                :total="total"
                :current-page ="currentPage"
              >
              </el-pagination>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="input" clearable>
            <template slot="append"
              ><el-button
                type="primary"
                icon="el-icon-search"
                @click="byKeywords(1)"
                >搜索</el-button
              ></template
            >
          </el-input>
          <el-collapse v-model="activeName">
            <el-collapse-item title="点击查看" name="1">
              <div class="text item">
                <el-link type="info" @click="getAll(1)">所有文章</el-link>
              </div>
              <div class="text item">
                <el-link type="primary" @click="byTime('week',1)"
                  >最近一周内发布的</el-link
                >
              </div>
              <div class="text item">
                <el-link type="success" @click="byTime('month',1)"
                  >最近一月内发布的</el-link
                >
              </div>
              <div class="text item">
                <el-link type="warning" @click="byTime('halfy',1)"
                  >最近半年内发布的</el-link
                >
              </div>
              <div class="text item">
                <el-link type="danger" @click="byTime('year',1)"
                  >最近一年内发布的</el-link
                >
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import { getAllArticle, articleKey, articleTime } from '../api/login'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loaded: false,
      input: '',
      activeName: '1',
      articles: [],
      type: 'all'
    }
  },
  created () {
    this.getAll(1)
  },
  methods: {
    getAll (page) {
      this.currentPage = page
      this.type = 'all'
      getAllArticle(page)
        .then((res) => {
          console.log(res)
          this.articles = res.articles
          this.pageSize = res.pagesize
          this.total = res.total
        })
        .finally(() => {
          this.loaded = true
        })
    },
    byKeywords (page) {
      this.currentPage = page
      this.type = 'key'
      articleKey({
        key: this.input,
        page
      }).then((res) => {
        console.log(res)
        this.articles = res.articles
        this.pageSize = res.pagesize
        this.total = res.total
      })
    },
    byTime (time, page) {
      this.currentPage = page
      this.type = time
      articleTime({
        time,
        page
      }).then((res) => {
        console.log(res)
        this.articles = res.articles
        this.pageSize = res.pagesize
        this.total = res.total
      })
    },
    currentChange (currentPage) {
      if (this.type === 'all') {
        this.getAll(currentPage)
      } else if (this.type === 'key') {
        this.byKeywords(currentPage)
      } else {
        this.byTime(this.type, currentPage)
      }
    }
  }
}
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
.row {
  padding: 20px 20px;
  margin: 0 !important;
  .el-collapse {
    padding: 20px;
    border-bottom: none;
  }
}

.imgbox {
  img {
    width: 100%;
    height: 200px;
    object-fit: contain;
  }
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 10px;
}

a {
  color: #333;
}

.mycover {
  width: 100%;
  height: 250px;
  margin-bottom: 20px;
  position: relative;
  background-image: url("../../public/static/cover.gif");
  background-size: cover;
  background-position: 0px -48px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  line-height: 80px;
  font-size: 20px;
}

.mycover .mytext {
  position: absolute;
  top: 0;
  right: 0;
}

.ell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.addell {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.addell:after {
  display: inline;
  content: "...";
  font-size: 16px;
}
</style>
