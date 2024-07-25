 <!-- /**
  * @description 代码生成-index
  * @author yxm
  * @date 2021-10-19
  */ -->
<template lang="html">
  <container class="full-container">
    <div slot="content" class="content-left-wrapper">
      <Tables ref="tables"
        v-if="tableColumnPugins != null"
        class="table-wrapper"
        :class="{'width-80': showConfigWrapper}"
        searchable
        search-place="top"
        v-model="listData"
        exportPath=""
        :exportParams="{}"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSave="canSave"
        :canDelete="canDelete"
        :canEdit="canEdit"
        @on-sort-change="onSortChange"
        @btnInsert="createDrawerChange"
        @btnUpdate="updateDrawerChange"
        @btnDelete="btnDeleteBallast"
        @btnSearch="reloadList"
        @handleReset="handleResearch"
        @on-selection-change="selectChange">
        <div slot="search">
          <Input v-model="searchParams.tableName" placeholder="根据表名查询" style="width: 200px; margin-right: 10px;" :clearable="false"/>
        </div>
        <div slot="btn-right">
          <Tooltip content="生成代码" placement="bottom">
            <Button type="error" class="search-btn" shape="circle" icon="md-archive" @click.stop="initGenerateCode()"></Button>
          </Tooltip>
          <Tooltip :content="showConfigWrapper ? '收起配置' : '生成器配置'" placement="bottom">
            <Button type="info" class="search-btn" shape="circle"
              :icon="showConfigWrapper ? 'ios-bulb-outline' : 'md-bulb'" @click.stop="changeWrapperStatus()"></Button>
          </Tooltip>
        </div>
        <page-wrapper slot="footer"
          :total="totolCount"
          :pageSize="searchParams.limit"
          :pageNo="searchParams.current"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></page-wrapper>
      </Tables>

      <div class="config-wrapper" v-if="showConfigWrapper">
        <div class="config-wrapper-content">
          <h2 class="mar-btm">代码生成器配置项</h2>
          <Form :model="formTop" label-position="top">
            <FormItem label="链接数据库">
              <Input v-model="formTop.input2" class="config-input"></Input>
            </FormItem>
            <FormItem label="数据库账户">
              <Input v-model="formTop.input3" class="config-input"></Input>
            </FormItem>
            <FormItem label="数据库密码">
              <Input v-model="formTop.input3" class="config-input"></Input>
            </FormItem>
            <FormItem label="模块名称">
              <Input v-model="formTop.input1" class="config-input"></Input>
            </FormItem>
            <FormItem label="表前缀(sys_)">
              <Input v-model="formTop.input3" class="config-input"></Input>
            </FormItem>
          </Form>

          <Button type="info">使用配置</Button>
          <Button type="error">重置配置</Button>
        </div>
      </div>

      <Modal v-model="deleteModel" title="确认删除操作" @on-ok="handleDelete">
        <p>确定删除选中的系统用户信息吗？</p>
      </Modal>
    </div>

    <div slot="drawer">

    </div>
  </container>
</template>

<script>
import { generateCode } from '@/api/api-base'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
export default {
  mixins: [ OPERATE_LIST ],
  components: {

  },
  data() {
    return {
      canSave: false,
      canEdit: false,
      canDelete: false,
      searchParams: { // 查询参数
        tableName: null, // 表名
        orderKey: null, //  字段名称
        orderType: null, //  排序方式
        orderNumber: null, // 排序序号
        limit: 10, // 每页数量
        current: 1 // 当前页数
      },
      showConfigWrapper: true,
      formTop: { // 配置项表单
        input1: '',
        input2: '',
        input3: ''
      }
    }
  },
  mounted() {
    this.tableColumnPugins = ColumnPugins(this)
    this.initListData()
  },
  methods: {
    changeWrapperStatus() {
      this.showConfigWrapper = !this.showConfigWrapper
    },
    // http://192.168.150.27/8199/sys/generator/code?tables=t_info_supplier,t_info_goods_type=supplier,goods&tablePrefix=t_info,t_info&author=yxm
    initGenerateCode() { // 生成代码
      if (this.chooseListData.length === 0) {
        this.$Message.error('请选择至少一条数据信息执行操作')
        return
      }

      let tableNameArray = []
      this.chooseListData.map(item => {
        tableNameArray.push(item.tableName)
      })
      generateCode(tableNameArray.join())
    },
    handleOperate(formData) { // 根据参数刷新当前表格(添加、编辑、上传、删除后执行)
      this.searchParams = {
        orderKey: null,
        orderType: null,
        orderNumber: null,
        limit: 10,
        current: 1
      }
      this.initListData()
    },
    handleExportParams() { },
    // 初始化数据表格信息
    initListData() {
      // this.loading = true
      // initGenerateList(this.searchParams).then(res => {
      //   if (res.status) {
      //     this.listData = res.data.page.list
      //     this.totolCount = res.data.page.totalCount

      //     this.$forceUpdate()
      //     this.$nextTick(() => {
      //       this.loading = false
      //     })
      //   }
      // // eslint-disable-next-line handle-callback-err
      // }).catch(err => {
      //   this.loading = false
      // })
    },
    handleResearch() { // 重置条件查询列表
      this.searchParams = {
        orderKey: null,
        orderType: null,
        orderNumber: null,
        limit: 10,
        current: 1
      }

      this.initListData()
    },
    async handleDelete() { // 确认删除列表信息

    }
  }
}
</script>
<style lang="scss" scoped>
.width-80 {
  width: 20%;
}
.config-wrapper {
  padding-right: 0;
  padding-left: 10px;
  width: 20%;

  h2 {
    margin-bottom: 20px;
  }
  button {
    width: 100%;
    margin-bottom: 20px;
  }
  .config-input {
    width: 100%;
  }
}
</style>
