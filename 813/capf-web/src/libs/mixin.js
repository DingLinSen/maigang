import { mapGetters } from 'vuex'
// import { formatDate } from '@/libs/tools'
import { downloadStreamByPath, exportFileWithName } from '@/api/api-base'
export const OPERATE_LIST = {
  data() {
    return {
      showComponent: null, // 子页面展示的组件对象
      isSee: false, // 查看状态
      addTree: false, // 三级菜单头部添加时
      isPassword: false, // 修改密码
      isOperate: false, // 修改、添加标识控制
      routerTitle: '', // 当前路由名称
      deleteModel: false, // 删除模态窗口控制
      loading: false, //  列表加载状态
      tableColumnPugins: null, // 列表列项
      listData: [], // 列表数据
      totolCount: 0, // 列表总数
      chooseListData: [], // 列表勾选项
      chooseDetailsId: null,
      percent: 0 // 下载进度条
    }
  },
  methods: {
    // 加载子页面异常处理
    error(info) {
      this.changeComponent(info)
    },
    // 加载详情弹窗等子界面  返回列表
    changeComponent(component) {
      this.chooseDetailsId = null
      this.showComponent = component
    },
    // 关闭子页面
    closeComponent() {
      this.changeComponent(null)
    },
    // 重新加载列表数据
    reloadList() {
      this.searchParams.limit = 10
      this.searchParams.current = 1
      this.chooseListData = []
      this.initListData()
    },
    // 每页显示数量变更
    pageSizeChange(pageSize) {
      this.searchParams.limit = pageSize
      this.searchParams.current = 1
      this.initListData()
    },
    // 页码变更
    pageChange(pageNo) {
      if (this.searchParams.current !== pageNo) {
        this.searchParams.current = pageNo
        this.initListData()
      }
    },
    // 列表排序
    onSortChange(sort) {
      if (sort.order !== 'normal') {
        this.searchParams.orderKey = sort.column.sortName
        this.searchParams.orderType = sort.order
        this.searchParams.orderNumber = sort.column.orderNumber
      } else {
        this.searchParams.orderKey = null
        this.searchParams.orderType = null
        this.searchParams.orderNumber = null
      }
      this.initListData()
    },
    selectChange(chooseListData) {
      // 列表选项勾选项
      this.chooseListData = chooseListData
    },
    // 上传侧滑
    openUploadModel() {
      this.$refs.uploadModel.openModel()
    },
    // 树table上边的添加
    addTreeDrawer() {
      this.isOperate = false
      this.addTree = true
      this.$forceUpdate()
      this.$nextTick(() => {
        this.changeComponent('FormInfo')
      })
    },
    // 删除信息 删除勾选信息, 弹出确认界面
    btnDeleteBallast() {
      if (this.chooseListData.length > 0) {
        this.deleteModel = true
      } else {
        this.$Message.error('请选择至少一条数据信息执行删除操作')
      }
    },
    //  添加（新增）信息
    createDrawerChange() {
      this.isPassword = false
      this.isOperate = false
      this.isSee = false
      this.addTree = false
      this.$forceUpdate()
      this.$nextTick(() => {
        // this.$refs.formModel.handleOpenModel()
        this.changeComponent('FormInfo')
      })
    },
    // 查看（详情）信息
    turnToDetails() {
      this.isPassword = false
      this.isSee = true
      this.addTree = false
      if (this.chooseListData.length === 1) {
        this.isOperate = true
        this.$forceUpdate()
        this.$nextTick(() => {
          this.changeComponent('FormInfo')
          // this.$refs.formModel.handleOpenModel()
        })
      } else {
        this.isOperate = false
        this.$forceUpdate()
        this.$Message.error('请选择至少一条数据信息执行查看操作')
      }
    },
    // 修改（编辑）信息
    updateDrawerChange() {
      this.isPassword = false
      this.isSee = false
      this.addTree = false
      if (this.chooseListData.length === 1) {
        this.isOperate = true
        this.$forceUpdate()
        this.$nextTick(() => {
          this.changeComponent('FormInfo')
          // this.$refs.formModel.handleOpenModel()
        })
      } else {
        this.isOperate = false
        this.$forceUpdate()
        this.$Message.error('请选择至少一条数据信息执行修改操作')
      }
    },
    // 用户管理修改密码
    btnChangePassword() {
      this.isOperate = false
      this.isPassword = true
      this.isSee = false
      if (this.chooseListData.length === 1) {
        this.isOperate = true
        this.$forceUpdate()
        this.$nextTick(() => {
          this.changeComponent('FormInfo')
        })
      } else {
        this.isOperate = false
        this.$forceUpdate()
        this.$Message.error('请选择至少一条数据信息执行修改操作')
      }
    },
    // 下载模版
    async downloadTemplate() {
      // eslint-disable-next-line no-undef
      await exportFile('tqiMaster/downExcel')
    },
    // 仅用于文件下载
    downloadFile(url, fileName, sysName, funType) {
      const _this = this
      _this.percent = 0
      _this.$Spin.show({
        render: h => {
          return h('div', [
            h(
              'Progress',
              {
                style: {
                  width: '300px'
                },
                props: {
                  percent: _this.percent
                }
              },
              fileName + '下载中...' + _this.percent + '%'
            )
          ])
        }
      })
      if (/\.pdf|\.PDF/.test(url)) {
        const interval = setInterval(() => {
          if (_this.percent === 10) {
            _this.downloadMethod(url, fileName, sysName, funType)
          }
          if (_this.percent >= 80) {
            clearInterval(interval)
            return
          }
          _this.percent += 10
        }, 500)
      } else {
        const interval = setInterval(() => {
          if (_this.percent === 50) {
            _this.downloadMethod(url, fileName, sysName, funType)
          }
          if (_this.percent >= 50) {
            clearInterval(interval)
            return
          }
          _this.percent += 10
        }, 100)
      }
    },
    downloadMethod(url, fileName, sysName, funType) {
      const _this = this
      url = url.replace(/\\/g, '/')
      if (
        /\.pdf|\.PDF|\.png|\.PNG|\.jpg|\.JPG|\.jpeg|\.JPEG|\.bmp|\.BMP/.test(
          url
        )
      ) {
        // 下载pdf
        let params = {
          path: url,
          sysName: sysName
        }
        downloadStreamByPath(params).then(res => {
          _this.closeProgress()
          let blob = new Blob([res.data], {
            type: 'application/pdf' // word文档为msword,pdf文档为pdf
          })
          let objectUrl = URL.createObjectURL(blob)
          let link = document.createElement('a')
          link.href = objectUrl
          link.setAttribute('download', fileName) // 下载文件的名字
          document.body.appendChild(link)
          link.style.display = 'none'
          link.click()
          document.body.removeChild(link)
        })
      } else if (url != null && url !== '' && url !== 'null') {
        _this.closeProgress()
        // 下载其他文件
        let link = document.createElement('a')
        link.href = window.SITE_CONFIG.fileShowURL + url
        link.setAttribute('download', fileName) // 下载文件的名字
        document.body.appendChild(link)
        link.style.display = 'none'
        link.click()
        document.body.removeChild(link)
      }
    },
    closeProgress() {
      const _this = this
      const interval = setInterval(() => {
        if (_this.percent >= 100) {
          clearInterval(interval)
          _this.$Message.success('文件下载成功')
          _this.$Spin.hide()
          return
        }
        _this.percent += 10
      }, 100)
    },
    // 仅用于文件流下载（用于导出）
    downloadFileStream(res, fileName, sysName, funType) {
      const _this = this
      _this.percent = 0
      _this.$Spin.show({
        render: h => {
          return h('div', [
            h(
              'Progress',
              {
                style: {
                  width: '300px'
                },
                props: {
                  percent: _this.percent
                }
              },
              fileName + '下载中...' + _this.percent + '%'
            )
          ])
        }
      })
      const interval = setInterval(() => {
        if (_this.percent === 50) {
          _this.downloadStreamMethod(res, fileName, sysName, funType)
        }
        if (_this.percent >= 50) {
          clearInterval(interval)
          return
        }
        _this.percent += 10
      }, 100)
    },
    downloadStreamMethod(res, fileName, sysName, funType) {
      const _this = this
      _this.closeProgress()
      let blob = new Blob([res.data], {
        type: res.data.type // word文档为msword,pdf文档为pdf
      })
      let objectUrl = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', fileName) // 下载文件的名字
      document.body.appendChild(link)
      link.style.display = 'none'
      link.click()
      document.body.removeChild(link)
    },
    isContain(value, array, key) {
      Object.keys(array).forEach((item, index) => {
      })
    },
    downLoadFileSub(params) {
      // 开始导出操作
      const _this = this
      _this.percent = 0
      const interval = setInterval(() => {
        if (this.percent >= 50) {
          clearInterval(interval)
          // 开始导出
          var exportPath = params.filePath
          if (exportPath === null) return
          exportFileWithName(exportPath, params.fileName)
          _this.fileClose()
          return
        }
        _this.percent += 10
      }, 100)
    },
    fileClose() {
      const _this = this
      const interval = setInterval(() => {
        if (_this.percent >= 100) {
          clearInterval(interval)
          _this.$Notice.success({
            title: '文件下载成功'
          })
          _this.$Spin.hide()
          return
        }

        _this.percent += 10
      }, 100)
    }
  }
}

export const OPERATE_PAGE = {
  data() {
    return {
      imageBaseURL: null
    }
  },
  mounted() {
    this.imageBaseURL = window.SITE_CONFIG.uploadImage
  },
  computed: {
    ...mapGetters({})
  },
  props: {
    isSee: {
      default: false,
      type: Boolean
    },
    isOperate: {
      default: false,
      type: Boolean
    },
    detailsId: {
      default: null,
      type: String
    },
    // 用户管理修改密码
    isPassword: {
      default: false,
      type: Boolean
    },
    // 当前页面路由名称
    routerTitle: {
      default: '',
      type: String
    }
  },
  methods: {
    // 格式化返回对象
    transFormData(data) {
      Object.keys(this.formData).forEach((item, index) => {
        this.formData[item] = ((data[item] || '') + '').trim()
      })

      this.formdataId = this.detailsId
      this.$forceUpdate()
    },
    // 重置信息按钮事件
    handleReset() {
      if (this.$refs['formValidate']) {
        this.$refs['formValidate'].resetFields()
      }
      this.$forceUpdate()
      this.chooseListData = []
    },
    // 取消创建
    handleCancleModel() {
      this.showDrawer = false
      Object.keys(this.$refs).forEach(item => {
        if (this.$refs[item] && this.$refs[item].name === 'select') {
          this.$refs[item].reset()
        }
      })
      this.$emit('close')
      this.handleReset()
    },
    // 打开弹框
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    },
    openModel() {
      this.showDrawer = true
      this.initFormData()
    },
    // 保存按钮事件, 校验form表单是否合法
    // 选在两种校验方式时
    async handleValidate(val) {
      if (val && val === true) {
        await this.$handleValidate('formValidate1', this).then(valid => {
          if (valid) {
            this.handleSubmit()
          }
        })
      } else {
        await this.$handleValidate('formValidate', this).then(valid => {
          if (valid) {
            this.handleSubmit()
          }
        })
      }
    }
  },
  watch: {
    showDrawer: function() {
      if (!this.showDrawer) {
        this.handleReset()
      }
    }
  }
}
