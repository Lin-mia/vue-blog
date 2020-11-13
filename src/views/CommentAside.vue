<template>
  <div class="container">
    <template v-if="loaded">
      <div v-if="comments.length === 0" style="text-align: center">
        您还没有发表评论
      </div>
      <template v-else>
        <div v-for="(comment, index) in comments" :key="index">
          <div class="commentbox">
            <span class="wrap">{{ comment && comment.content }}</span>
            <el-button type="text" @click="deleteOne(comment._id, index)"
              ><i class="el-icon-close"></i
            ></el-button>
            <el-divider content-position="left">
              <router-link
                v-if="comment.aid"
                :to="'/articleDetail/' + comment.aid._id"
                class="margin"
              >
                {{ comment && comment.aid.title }}
              </router-link>
              <span v-else> 文章已删除！ </span>
              {{ comment && comment.time | dateFormat("yyyy-mm-dd hh:mm:ss") }}
            </el-divider>
          </div>
        </div>
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
    </template>
  </div>
</template>

<script>
import { getComment, deleteComment } from '../api/login'
import { dateFormat } from '../utils/dateFormat'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      comments: [],
      loaded: false
    }
  },
  created () {
    getComment({ page: 1 })
      .then((res) => {
        this.comments = res.comments
        this.pageSize = res.pagesize
        this.total = res.total
      })
      .finally(() => {
        this.loaded = true
      })
  },
  methods: {
    deleteOne (id, index) {
      this.$confirm('您确定要删除这条评论吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteComment(id).then((res) => {
            getComment({ page: 1 }).then((res) => {
              this.comments = res.comments
              this.pageSize = res.pagesize
              this.total = res.total
            })
            this.$message(
              {
                type: 'success',
                message: res.message
              },
              () => {
                this.$message({
                  type: 'info',
                  message: res.message
                })
              }
            )
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    currentChange (currentPage) {
      getComment({ page: currentPage }).then((res) => {
        this.comments = res.comments
        this.pageSize = res.pagesize
        this.total = res.total
      })
    }
  },
  filters: {
    dateFormat
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 20px 0;
  .commentbox {
    position: relative;
    .el-icon-close {
      position: absolute;
      right: 0;
      bottom: 0;
      font-size: 18px;
      color: #333;
      cursor: pointer;
    }
    .wrap {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .margin {
      margin-right: 15px;
    }
  }
}
</style>
