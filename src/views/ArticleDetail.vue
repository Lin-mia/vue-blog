<template>
  <div class="container">
    <el-row>
      <el-col :span="16" :offset="4">
        <div>
          <h1>{{ article.title }}</h1>
          <el-row>
            <el-col :span="4"><div class="astd">作者</div></el-col>
            <el-col :span="20"
              ><div>

                <router-link

                 :to="
                 article.author? article._id ===$root.$data.user._id
                 ? '/userMessage/' : '/otherMessage/' + article.author._id :''">
                  {{ article.author && article.author.username }}
                </router-link>
              </div></el-col
            >
          </el-row>
          <el-row>
            <el-col :span="4"><div class="astd">发布时间</div></el-col>
            <el-col :span="20">
              <div>
                {{
                  article.publishDate &&
                  dateFormat(article.publishDate, "yyyy-MM-dd hh:mm:ss")
                }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4"><div class="astd">内容</div></el-col>
            <el-col :span="20"
              ><div v-html="article.content" class="wrap"></div
            ></el-col>
          </el-row>

          <div class="center" v-if="article.author && article.author._id === $root.$data.user._id">
            <el-button type="primary" @click="goEdit">编辑</el-button>
            <el-button type="default" @click="deleteone(article._id)"
              >删除</el-button
            >
          </div>
        </div>
        <div class="addCommonBox">
          <el-card class="box-card">
            <el-image
              :src="'http://127.0.0.1:3000' + $root.$data.user.avatar"
              fit="contain"
            ></el-image>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="textarea"
              maxlength="1000"
            >
            </el-input>
            <span>{{ size }}/1000</span>
            <div class="buttonright">
              <el-button @click="cancleReply">清空内容</el-button>
              <el-button type="danger" @click="addComment">发表评论</el-button>
            </div>
          </el-card>
        </div>
        <div class="articleCommentBox">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>评论区</span>
            </div>
            <div class="center" v-if="comments.length === 0">
              还没有评论哦！快来抢占沙发吧！
            </div>
            <div v-else>
              <div
                v-for="comment in comments"
                :key="comment._id"
                class="text item"
              >
                <div class="content">
                  <div class="imageBox">
                    <el-image
                      :src="
                        comment.uid && comment.uid.avatar
                          ? 'http://127.0.0.1:3000' + comment.uid.avatar
                          : ''
                      "
                      fit="contain"
                    >
                    </el-image>
                    <span>
                      <router-link
                        :to="
                          comment.uid._id === $root.$data.user._id
                            ? '/userMessage'
                            : '/otherMessage/' + comment.uid._id
                        "
                        >{{ comment.uid.username }}</router-link>
                      </span>
                  </div>
                  <span>{{ comment && comment.content }}</span>
                  <el-divider content-position="right">{{
                    dateFormat(comment.time, "yyyy-MM-dd hh:mm:ss")
                  }}</el-divider>
                </div>
              </div>
               <el-pagination
                :hide-on-single-page="true"
                :page-size="pageSize"
                layout="prev, pager, next"
                @current-change="currentChange"
                :total="total"
                :current-page ="currentPage"
              >
              </el-pagination>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { articleDetail, addComment, deleteArticle, articleComment } from '../api/login'
import { dateFormat } from '../utils/dateFormat'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      article: {},
      comments: [],
      textarea: '',
      dateFormat
    }
  },
  created () {
    articleDetail(this.$route.params.id).then((res) => {
      this.article = res.article[0]
      this.comments = res.comments
      this.total = res.total
      this.pageSize = res.pagesize
      console.log(res.article)
      console.log(res)
    })
  },
  computed: {
    size: function () {
      return this.textarea.length
    }
  },
  methods: {
    cancleReply () {
      this.textarea = ''
    },
    addComment () {
      addComment({
        uid: this.$root.$data.user._id,
        aid: this.article._id,
        time: Date.now(),
        content: this.textarea
      }).then((res) => {
        this.$message('留言成功')
        articleComment({
          id: this.article._id,
          page: 1
        }).then(res => {
          console.log(res)
          this.comments = res.comments
          this.pageSize = res.pagesize
          this.total = res.total
        })
      }).finally(() => {
        this.textarea = ''
      })
    },
    deleteone (id) {
      deleteArticle(id).then((res) => {
        this.$message(res)
        this.$router.go(-1)
      })
    },
    goEdit () {
      this.$router.push({
        path: '/AddArticle',
        query: { id: this.article._id }
      })
    },
    currentChange (currentPage) {
      articleComment({
        id: this.article._id,
        page: currentPage
      }).then(res => {
        this.comments = res.comments
        this.pageSize = res.pagesize
        this.total = res.total
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  h1 {
    text-align: center;
  }
  .el-row {
    border-bottom: 1px solid #ddd;
    div {
      padding: 5px 0;
    }
  }
  .wrap {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
.addCommonBox {
  margin-top: 20px;
  .el-card {
    padding-left: 80px;
    position: relative;
    .el-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      position: absolute;
      left: 15px;
    }
    .buttonright {
      text-align: right;
      margin: 30px 10px 0;
    }
    span {
      font-size: 10px;
      color: #666;
      float: right;
      padding: 5px;
      .username {
        float: left;
      }
    }
  }
}
.articleCommentBox {
  margin-top: 20px;
  margin-bottom: 30px;
  .el-card {
    position: relative;
    .imageBox {
      position: absolute;
      left: 20px;
      text-align: center;
      a {
        color: #666;
        text-decoration: none;
      }
      .el-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
    .content {
      padding-left: 80px;
      span {
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        min-height: 60px;
      }
    }
  }
}
.center {
  margin-top: 20px;
  text-align: center;
}
</style>
