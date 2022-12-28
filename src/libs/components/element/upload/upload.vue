<template>
  <div>
    <el-upload
      ref="upload"
      :action="upload.url"
      :headers="upload.headers"
      :fileList="upload.fileList"
      :beforeUpload="beforeUpload"
      :onProgress="handleFileUploadProgress"
      :onSuccess="handleFileSuccess"
      multiple
      :onPreview="handlePictureCardPreview"
      :onRemove="handleRemove"
      :onChange="handleChange"
      :listType="listType"
      :autoUpload="autoUpload"
    >
      <i
        class="el-icon-plus"
        v-if="listType === 'picture-card'"
      />
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      <el-button
        slot="trigger"
        size="small"
        type="primary"
        v-if="listType !== 'picture-card'"
      >
        选取文件
      </el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        v-if="listType !== 'picture-card' && !autoUpload"
        :loading="upload.isUploading"
        @click="submitUpload"
      >
        上传到服务器
      </el-button>
    </el-upload>
    <el-button
      v-if="listType === 'picture-card' && !autoUpload"
      style="margin-left: 10px"
      size="small"
      type="success"
      :loading="upload.isUploading"
      @click="submitUpload"
    >
      上传到服务器
    </el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      appendToBody
    >
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    autoUpload: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Array,
      default () {
        return []
      }
    },
    onDel: {
      type: Function,
      default: () => { return }
    },
    beforeUpload: {
      type: Function,
      default: () => {
        return true
      }
    },
    afterUpload: {
      type: Function,
      default: () => { return }
    },
    type: {
      type: String,
      default: ''
    },
    listType: {
      type: String,
      default () {
        return 'text'
      }
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 上传参数
      upload: { // 若依框架特有用法
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/common/upload',
        // 上传的文件列表
        fileList: []
      },
    }
  },
  created () {
    this.upload.fileList = JSON.parse(JSON.stringify(this.dataList))
  },
  computed: {},
  watch: {
    dataList: {
      handler: function () {
        this.upload.fileList = JSON.parse(JSON.stringify(this.dataList))
      },
      deep: true
    },
  },
  methods: {
    handleRemove (file, fileList) {
      this.onDel(file.id)
    },
    handleChange (file, fileList) {
      //   console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.response.url
      this.dialogVisible = true
    },
    // 文件提交处理
    async submitUpload () {
      if (!(await this.beforeUpload())) return
      this.$refs.upload.submit()
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true
      //   console.log('文件上传中处理', event, file, fileList)
    },
    // 文件上传成功处理
    async handleFileSuccess (response, file, fileList) {
      this.upload.isUploading = false
      if (this.autoUpload) await this.afterUpload(file, file.response, this.type)
      //  console.log('文件上传成功处理', response, file, fileList)
      this.msgSuccess(response.msg)
    },
  }
}
</script>
