<!--
 * @description examinepoint- 网上考核-成绩管理--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container">
    <div class="details-title">
      <p>
        {{
          isSee
            ? '查看' + routerTitle + '信息'
            : !isOperate
            ? '新增' + routerTitle + '信息'
            : '编辑' + routerTitle + '信息'
        }}
      </p>
      <Icon type="md-close" @click.stop="handleCancleModel" />
    </div>
    <div class="details-content">
      <div class="titleName">
        {{ examineName }}
      </div>
      <Tables
        ref="tables"
        v-if="tableColumnPugins != null"
        :isTable="true"
        v-model="listData"
        :loading="loading"
        :border="true"
        :columnControl="true"
        :columns="tableColumnPugins"
      >
        <page-wrapper
          slot="footer"
          :total="totolCount"
          :pageSize="searchParams.limit"
          :pageNo="searchParams.current"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></page-wrapper>
      </Tables>
    </div>
  </div>
</template>

<script>
import { parentIdExaminePointByIds } from '@/api/online/achievement/api-modules-examinepoint'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
import ColumnPugins from './index-column'
import { supportNormal } from '@/utils'
export default {
  mixins: [OPERATE_PAGE],
  props: {
    examineName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showDrawer: false,
      listData: [],
      loading: false,
      totolCount: null,
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        parentId: this.detailsId
      },
      tableColumnPugins: ColumnPugins(this),
      formData: FormDataInfo(),
      formValidate: RulesValidate(this)
    }
  },
  computed: {},
  activated() {
    // console.log(this.detailsId)
    this.searchParams = {
      limit: 10, // 每页数量
      current: 1, // 当前页数
      parentId: this.detailsId
    }
    this.initListData()
  },
  methods: {
    // 初始化数据表格
    initListData() {
      // const reg = /^[A-Za-z\u4e00-\u9fa5]+$/gi
      // let name = this.searchParams.name
      // if (!reg.test(name) && (name || name === 0)) {
      //   this.$Message.error('名称项请输入汉字或字母')
      //   return
      // }
      var validation = supportNormal(this.searchParams)
      if (!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      } else {
        this.loading = true
        parentIdExaminePointByIds(this.searchParams)
          .then(res => {
            if (res.data.status) {
              this.totolCount = res.data.page.totalCount
              var data = res.data.page.list
              this.listData = data
              this.$nextTick(() => {
                this.loading = false
              })
            } else {
              this.loading = false
              this.listData = []
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    pageSizeChange(pageSize) {
      // 切换每页条数时的回调，返回切换后的每页条数
      this.searchParams.limit = pageSize
      this.$emit('page-size-change', pageSize)
      this.initListData()
    },
    pageChange(pageNo) {
      // 页码改变的回调，返回改变后的页码
      this.searchParams.current = pageNo
      this.$emit('page-change', pageNo)
      this.initListData()
    },
    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initListData()
    }
  }
}
</script>
<style lang="less" scoped>
.titleName {
  width: 30%;
  height: 7vh;
  margin-left: 35%;
  text-align: center;
  line-height: 7vh;
  font-weight: 400;
  font-size: 20px;
  // background-color: pink;
}
</style>
