<template>
<div class="container">
    <div v-for="article in articles" :key="article.id">
      <el-card class="box-card">
        <el-image
          style="width: 200px; height: 120px"
          :src="article.cover? 'http://127.0.0.1:3000/'+article.cover:'http://127.0.0.1:3000/uploads/default.jpg'"
          fit="contain"
        ></el-image>
        <div class="contentbox">
          <h1>
            <router-link :to="'/articleDetail/'+article._id" class="ell">{{article.title}}</router-link>
          </h1>
          <p class="addell">{{ article.content }}</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    articles: {
      type: Array,
      default: function () {
        return []
      }
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-card__body {
  padding: 5px 20px;
  &::after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
}

.container {
  .el-image {
    float: left;
    padding-right:20px;
  }
  .contentbox {
    float: left;
    width: 200px;
    h1 {
      font-size: 18px;
      a {
        text-decoration: none;
        color: #40aaff;
      }
    }
    p {
      color: #333;
    }
  }
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
