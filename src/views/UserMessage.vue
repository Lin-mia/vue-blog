<template>
  <div class="container">
    <el-row>
      <el-col :span="16" :offset="4">
        <!-- 表单信息 -->

        <div id="avatar">
          <img :src="'http://127.0.0.1:3000/' + $root.$data.user.avatar" />
          <div id="tip" @click="triggerUpload">修改图片</div>
          <input
            id="file"
            type="file"
            @change="previewAvatar"
            accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
          />
        </div>
        <div id="avatarbox" v-show="isAvatar">
          <div class="box">
            <el-row>
              <el-col :span="16"
                ><img id="cropImg" ref="img" :src="dataURL"
              /></el-col>
              <el-col :span="6" :offset="2">
                <div class="previewBox"></div>
              </el-col>
            </el-row>

            <div>
              <br />
              <div class="centerbox">
                <el-button @click="cancleAvatar">取消</el-button>
                <el-button @click="uploadAvatar">确认修改</el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="isTable">
          <el-table :data="userData" style="width: 100%" :show-header="false">
            <el-table-column prop="title" width="180"> </el-table-column>
            <el-table-column prop="content"> </el-table-column>
          </el-table>
          <div class="centerbox">
            <el-button type="primary" @click="isTable = false">编辑</el-button>
          </div>
        </div>
        <!-- 修改信息 -->
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
          label-width="80px"
          v-else
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.birthday"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="自我介绍" prop="produce">
            <el-input type="textarea" v-model="form.produce"></el-input>
          </el-form-item>
          <div class="centerbox">
            <el-button type="primary" @click="onSubmit">确认修改</el-button>
            <el-button @click="cancleUpdate">取消</el-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dateFormat } from '../utils/dateFormat'
import { updateMessgae, uploadAvatar } from '../api/login'
export default {
  data () {
    return {
      isAvatar: false,
      isTable: true,
      dateFormat,
      form: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ],
        sex: [{ required: true, message: '请选择您的性别', trigger: 'change' }],
        birthday: [
          {
            required: true,
            message: '请选择您的生日',
            trigger: 'change'
          }
        ],
        produce: [
          { required: true, message: '请填写自我介绍', trigger: 'blur' }
        ]
      },
      dataURL: '',
      cropper: '',
      userData: []
    }
  },
  watch: {
    '$root.$data.user': {
      handler (v) {
        this.reset(v)
      },
      immediate: true
    }
  },
  mounted () {
    let img = document.querySelector('#cropImg')
    this.cropper = new Cropper(img, {
      aspectRatio: 8 / 8,
      viewMode: 0,
      minContainerWidth: 300,
      minContainerHeight: 300,
      dragMode: 'move',
      preview: [document.querySelector('.previewBox')]
    })
  },
  methods: {
    reset (user) {
      let state = ''
      switch (user.state) {
        case 0:
          state = '正常状态'
          break
        case 1:
          state = '不可写作'
          break
        case 2:
          state = '不可评论'
          break
        case 3:
          state = '仅可浏览'
          break
      }
      this.userData = [
        {
          title: '用户名',
          content: user.username
        },
        {
          title: '邮箱',
          content: user.email
        },
        {
          title: '注册时间',
          content: this.dateFormat(user.regDate, 'yyyy-MM-dd hh:mm:ss')
        },
        {
          title: '性别',
          content: user.sex === 0 ? '女' : '男'
        },
        {
          title: '生日',
          content:
            user.birthday === null ? '暂无数据' : dateFormat(user.birthday)
        },
        {
          title: '自我介绍',
          content: user.produce === null ? '暂无数据' : user.produce
        },
        {
          title: '权限',
          content: state
        }
      ]
      this.form = {
        username: user.username,
        sex: user.sex,
        birthday: user.birthday,
        produce: user.produce
      }
    },
    triggerUpload () {
      document.querySelector('#file').click()
    },
    cancleAvatar () {
      this.isAvatar = false
      if (this.cropper) {
        this.cropper.destroy()
      }
    },
    previewAvatar (eve) {
      this.isAvatar = true
      var reader = new FileReader()
      if (eve.target.files[0]) {
        reader.readAsDataURL(eve.target.files[0])
        reader.onload = (e) => {
          this.dataURL = reader.result
          this.cropper.replace(this.dataURL)
        }
      }
      eve.target.value = ''
    },
    uploadAvatar () {
      this.cropper
        .getCroppedCanvas({
          maxWidth: 500,
          maxHeight: 500,
          fillColor: '#fff',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        })
        .toBlob((blob) => {
          let formData = new FormData()
          formData.append('croppedImage', blob)
          uploadAvatar(formData).then((res) => {
            this.$message(res.message)
            localStorage.setItem('user', res.user)
            this.$root.$data.user = res.user
            this.isAvatar = false
          })
        })
    },
    cancleUpdate () {
      this.$refs.form.resetFields()
      this.isTable = true
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          updateMessgae(
            {
              data: this.form
            },
            this.$root.$data.user._id
          )
            .then((res) => {
              this.$message('更新成功')
              localStorage.setItem('user', JSON.stringify(res.user))
              this.$root.$data.user = res.user
              this.reset(this.$root.$data.user)
              this.isTable = true
            })
            .catch({})
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
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
#file {
  opacity: 0;
}
#avatar img {
  width: 100%;
}

#avatar:hover #tip {
  bottom: 0;
}

#tip {
  position: absolute;
  width: 120px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  color: #ccc;
  left: 50%;
  bottom: -99px;
  transition: all linear 0.2s;
  transform: translate(-50%, 0);
  background-color: rgba(0, 0, 0, 0.5);
}

#avatarbox {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

#avatarbox .box {
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  max-width: 685px;
  height: 400px;
  padding: 25px;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
}

#cropImg {
  width: 100%;
  max-height: 300px;
  box-shadow: 0 0 2px #adadad;
}
.previewBox {
  box-shadow: 0 0 5px #adadad;
  width: 150px;
  height: 150px;
  overflow: hidden;
}

#update {
  display: inline-block;
  position: absolute;
  right: 20px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #cc480a;
  font-size: 16px;
  cursor: pointer;
}
.centerbox {
  text-align: center;
}
</style>
