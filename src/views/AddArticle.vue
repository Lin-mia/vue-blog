<template>
  <div class="container">
    <el-row>
      <el-col :span="16" :offset="4">
        <el-form
          :label-position="labelPosition"
          :model="formLabelAlign"
          :rules="rules"
        >
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="formLabelAlign.title"
              placeholder="请输入标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input
              v-model="formLabelAlign.author.username"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" id="editor"></el-input>
          </el-form-item>
          <el-form-item label="上传封面">
            <el-upload
              ref="cover"
              action="http://127.0.0.1:3000/cover"
              list-type="picture-card"
              :limit="1"
              :on-change="handleChange"
              :file-list="imgs"
              :class="{ hide: hideUpload }"
              :on-success="handleSuccess"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="imgs[0].url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>

          <el-button type="primary" @click="update" v-if="isUpdate">更新</el-button>
          <el-button type="primary" @click="add" v-else>发布</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { addArticle, article, updateArticle } from '../api/login'
export default {
  data () {
    return {
      hideUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      imgs: [],
      labelPosition: 'top',
      formLabelAlign: {
        title: '',
        author: '',
        cover: ''
      },
      editor: null,
      user: this.$root.$data.user,
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20个字符', trigger: 'blur' }
        ]
      },
      id: this.$route.query.id
    }
  },
  computed: {
    isUpdate: function () {
      return !!this.$route.query.id
    }
  },
  created () {
    if (this.isUpdate) {
      article(this.id).then((res) => {
        console.log(res)
        this.formLabelAlign.title = res.title
        this.editor.setData(res.content)
        this.formLabelAlign.cover = res.cover
        if (res.cover) {
          this.imgs = [
            {
              name: '',
              url: 'http://127.0.0.1:3000' + res.cover
            }
          ]
        }
      })
    }
  },
  mounted () {
    this.formLabelAlign.author = {
      id: this.user._id,
      username: this.user.username
    }
    ClassicEditor.create(document.querySelector('#editor'), {
      toolbar: [
        'bold',
        'italic',
        'blockQuote',
        'bulletedList',
        'numberedList',
        'link',
        'imageUpload',
        'undo',
        'redo'
      ],
      ckfinder: {
        uploadUrl: 'http://127.0.0.1:3000/upload'
      }
    })
      .then((newEditor) => {
        this.editor = newEditor
      })
      .catch((error) => {
        console.error(error)
      })
  },
  methods: {
    handleRemove (file, fileList) {
      this.hideUpload = false
      this.imgs = []
    },
    handlePictureCardPreview (file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange (file, fileList) {
      this.hideUpload = true
      this.imgs = fileList
      console.log(this.imgs)
    },
    handleSuccess (response, file, fileList) {
      if (response.err === 0) {
        this.formLabelAlign.cover = response.url
      }
    },
    add () {
      this.$refs.cover.submit()
      var content = this.editor
        .getData()
        .replace(/<[^>]*>/gi, '')
        .replace(/&nbsp;/g, '')
      if (content.length === 0) {
        this.$message('请输入内容')
        return
      }
      addArticle({
        data: Object.assign(this.formLabelAlign, {
          content: this.editor.getData(),
          publishDate: Date.now()

        })
      }).then((res) => {
        console.log(res)
        this.$message('发布成功')
        this.formLabelAlign.title = ''
        this.formLabelAlign.cover = ''
        this.editor.setData('')
        this.imgs = []
        this.hideUpload = false
        this.$router.push('/articleDetail/' + res)
      })
    },
    update () {
      updateArticle({
        data: Object.assign(this.formLabelAlign, {
          content: this.editor.getData(),
          publishDate: Date.now()
        })
      }, this.id).then((res) => {
        this.$message(res.message)
        this.formLabelAlign.title = ''
        this.formLabelAlign.cover = ''
        this.editor.setData('')
        this.imgs = []
        this.hideUpload = false
        this.$router.push('/articleDetail/' + this.id)
      })
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-form-item {
  margin: 0;
  .el-form-item__label {
    padding: 0;
  }
}
/deep/ .el-form {
  .el-button--primary {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}
/deep/ .ck-editor__main .ck-content {
  min-height: 400px;
}
/deep/ .hide {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
