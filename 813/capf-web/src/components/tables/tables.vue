<template>
  <div class="table-wrap">
    <div
      class="search-container-wrapper search-container-wrapper-top mar-btm"
      ref="searchWrapper"
      v-if="searchable && searchPlace === 'top'"
    >
      <span class="search-line"></span>
      <span class="search-span" v-if="canSearch">筛选搜索</span>
      <slot name="search"></slot>

      <!-- 条件筛选 -->
      <Button
        v-if="canSearch"
        type="primary"
        class="search-btn"
        @click.stop="btnSearch"
        >查询</Button
      >

      <!-- 重置查询 -->
      <Button
        v-if="canReset"
        class="search-btn"
        @click.stop="handleReset"
        type="primary"
        ghost
        >重置</Button
      >

      <!-- 高级查询 md-refresh -->
      <Button
        v-if="searchableInfo"
        type="warning"
        class="search-btn"
        :icon="higherSearchInfo.icon"
        @click.stop="higherSearch"
        style="border: none"
        >高级查询</Button
      >

      <slot name="btn-left"></slot>

      <span class="right-auto"></span>
      <div class="search-right-wrapper">
        <div>
          <Button
            v-if="canSave"
            class="search-btn save-btn"
            @click="btnInsert"
            type="primary"
            >新增</Button
          >
          <!-- </Tooltip> -->

          <!-- <Button
            v-if="canEdit"
            type="warning"
            class="search-btn"
            style="border:none"
            @click="btnUpdate"
            >编辑</Button -->
          <Button
            v-if="canDelete"
            type="error"
            class="search-btn"
            @click.stop="btnDelete"
            ghost
            >删除</Button
          >
        </div>

        <slot name="btn-right"></slot>

        <!-- ios-list md-list ios-keypad-outline -->
        <!-- <Poptip placement="bottom-end">
          <Tooltip content="字段筛选" placement="bottom">
            <Button type="warning" class="search-btn" icon="ios-keypad" shape="circle" v-if="columnControl"></Button>
          </Tooltip>
          <div slot="title">
            筛选字段（取消选中隐藏字段）
          </div>

          <div slot="content" style="max-height: 200px;">
            <CheckboxGroup v-model="controlCheckedColumns"
                @on-change="changeTableColumns">

              <Checkbox v-for="item in controlColumns"
                v-if="item && item.key && item.key !== 'position' && item.key !== 'handle' && item.key !== ''"
                :key="`col-checkbox-${item.key}`" :label="item.key">
                  <span>{{ item.title }}</span>
              </Checkbox>
            </CheckboxGroup>
          </div>
        </Poptip> -->

        <!-- 导出报表 -->
        <Button
          v-if="canExport"
          type="primary"
          class="search-btn"
          ghost
          @click="exportFileMethods()"
          :disabled="percent > 0 && percent !== 100"
          >导出
        </Button>
        <div
          v-show="percent > 0 && percent !== 100"
          style="height: 32px; display: inline-block"
        >
          <Progress vertical :percent="percent" />
        </div>
        <Button
          v-if="selfControl"
          type="warning"
          class="search-btn"
          icon="ios-search"
          ghost
          >自定义维度筛选</Button
        >
      </div>
    </div>

    <div
      v-if="searchableInfo"
      class="search-container-wrapper"
      style="padding-top: 0 !important"
      :class="{
        'show-searchable-info': showSearchableInfoDiv,
        'hide-searchable-info': !showSearchableInfoDiv
      }"
    >
      <div v-show="showSearchableInfoDiv">
        <slot name="searchInfo"></slot>
      </div>
    </div>

    <slot name="table-panel"></slot>
    <slot name="table-panel-container"></slot>
    <slot name="table-drawer"></slot>
    <div class="table-content" style="position: relative">
      <Table
        ref="tablesMain"
        row-key="id"
        :data="insideTableData"
        :columns="insideColumns"
        :stripe="stripe"
        :border="border"
        :show-header="showHeader"
        :width="width || '100%'"
        :height="height || defaultHeight"
        :loading="loading"
        :disabled-hover="disabledHover"
        :highlight-row="highlightRow"
        :row-class-name="rowClassName"
        :size="size"
        no-data-text=""
        :no-filtered-data-text="noFilteredDataText"
        @on-current-change="onCurrentChange"
        @on-select="onSelect"
        @on-select-cancel="onSelectCancel"
        @on-select-all="onSelectAll"
        @on-selection-change="onSelectionChange"
        @on-sort-change="onSortChange"
        @on-filter-change="onFilterChange"
        @on-row-click="onRowClick"
        @on-row-dblclick="onRowDblclick"
        @on-expand="onExpand"
        @on-expand-tree="onExpandChange"
      >
        <slot name="header" slot="header"></slot>
        <slot name="footer" slot="footer"></slot>
        <slot name="loading" slot="loading"></slot>
      </Table>
      <div
        style="position: absolute; left: 50%; top: 48%"
        v-if="!insideTableData.length"
      >
        暂无数据信息
      </div>
    </div>
  </div>
</template>

<script>
import { exportFile } from '@/api/api-base'
import TablesEdit from './edit.vue'
import handleBtns from './handle-btns'
import './index.less'
export default {
  name: 'Tables',
  props: {
    isTable: {
      type: Boolean,
      default: false
    },
    searchInfo: {
      type: Boolean,
      default: true
    },
    selfControl: {
      type: Boolean,
      default: false
    },
    exportParams: {
      type: Object,
      default: null
    },
    exportPath: {
      type: String,
      default: null
    },
    columnControl: {
      type: Boolean,
      default: true
    },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: [Object, Array],
      default() {
        return []
      }
    },
    size: String,
    width: {
      type: [Number, String]
    },
    height: {
      type: [Number, String]
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightRow: {
      type: Boolean,
      default: true
    },
    rowClassName: {
      type: Function,
      default() {
        return '11111111111111111'
      }
    },
    context: {
      type: Object
    },
    noDataText: {
      type: String
    },
    noFilteredDataText: {
      type: String
    },
    disabledHover: {
      type: Boolean
    },
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @description 全局设置是否可编辑
     */
    editable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可查询
     */
    canSearch: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可重置
     */
    canReset: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否可高级搜索
     */
    searchable: {
      type: Boolean,
      default: false
    },
    searchableInfo: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否是小表格
     */
    minTable: {
      type: Boolean,
      default: false
    },
    treeTable: {
      type: Boolean,
      default: false
    },
    /**
     * @description 搜索控件所在位置，'top' / 'bottom'
     */
    searchPlace: {
      type: String,
      default: 'top'
    },
    /**
     * @description 是否具备添加权限
     */
    canSave: {
      type: Boolean,
      default: false
    },
    canExport: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否具备修改权限
     */
    canEdit: {
      type: Boolean,
      default: false
    },
    /**
     * @description 是否具备删除权限
     */
    canDelete: {
      type: Boolean,
      default: false
    },
    /**
     * @description table表格区域的高度
     */
    tableHight: {
      type: Number,
      default: 0
    }
  },
  /**
   * Events
   * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
   * @on-cancel-edit 返回值 {Object} 同上
   * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
   */
  data() {
    return {
      higherSearchInfo: {
        info: '展开高级筛选',
        icon: 'md-shuffle'
      },
      showSearchableInfoDiv: false,
      trackInfo: null,
      lineInfo: null,
      lineBusiness: null,
      insideColumns: [],
      controlColumns: [],
      controlCheckedColumns: [],
      insideTableData: [],
      edittingCellId: '',
      edittingText: '',
      searchValue: '',
      searchKey: '',
      trackValue: [],
      percent: 0,
      hasHeight: false,
      lineRemoteLoading: false,
      lineInfoListData: [],
      lineTrackLoading: false,
      lineTrackListData: [],
      defaultHeight: 0
    }
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight
      },
      set(val) {
        this.$store.commit('common/updateDocumentClientHeight', val)
      }
    }
  },
  methods: {
    resetTableHeight() {
      // 重置窗口可视高度
      let topH = 0
      if (this.$refs.searchWrapper) {
        topH = this.$refs.searchWrapper.offsetHeight // 获取查询区域的高度
      }
      var footerHeight = 0
      if (document.querySelector('.ivu-table-footer')) {
        footerHeight = document.querySelector('.ivu-table-footer').offsetHeight
      }
      if (this.tableHight) {
        this.defaultHeight = this.tableHight
      } else if (this.treeTable) {
        // 树状table
        this.defaultHeight =
          this.documentClientHeight - 60 - 90 - 3 - topH - footerHeight
      } else if (this.isTable) {
        // 树状table
        this.defaultHeight =
          this.documentClientHeight - 60 - 100 - 3 - topH - footerHeight
      } else {
        this.defaultHeight =
          this.documentClientHeight - 106 - topH - footerHeight
      }
    },
    lineRemote(query) {
      if (query !== '' && query !== null) {
        this.lineRemoteLoading = true
        setTimeout(() => {
          this.lineRemoteLoading = false
          this.lineInfoListData = this.lineInfoList.filter(
            item =>
              item.line_abbr.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        }, 200)
      } else {
        this.lineInfoListData = this.lineInfoList
      }
    },
    lineTrack(query) {
      if (query !== '' && query !== null) {
        this.lineTrackLoading = true
        setTimeout(() => {
          this.lineTrackLoading = false
          this.lineTrackListData = this.trackInfoList.filter(
            item =>
              item.track_name.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        }, 200)
      } else {
        this.lineTrackListData = this.trackInfoList
      }
    },
    exportFileMethods() {
      // 导出文件前奏动画
      // 无数据不开启导入
      if (this.insideTableData.length === 0) {
        this.$Message.warning('查询无数据, 无需导出数据')
        return
      }

      const _this = this
      _this.percent = 0
      const interval = setInterval(() => {
        if (_this.percent >= 50) {
          clearInterval(interval)
          // 开始导出
          _this.finishExport()
          return
        }

        _this.percent += 10
      }, 100)
    },
    async finishExport() {
      // 开始导出操作
      if (this.exportPath === null) return

      let params = ''
      if (this.exportParams !== null) {
        const exportParams = this.exportParams
        params = '?'

        Object.keys(exportParams).forEach(function (key) {
          const value = exportParams[key]
          if (value != null && value !== '') {
            params += key + '=' + value + '&'
          }
        })

        params = params.substring(0, params.length - 1)
      }

      await exportFile(this.exportPath + params)
      await this.close()
    },
    close() {
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
    },
    suportEdit(item, index) {
      item.render = (h, params) => {
        return h(TablesEdit, {
          props: {
            params: params,
            value: this.insideTableData[params.index][params.column.key],
            edittingCellId: this.edittingCellId,
            editable: this.editable
          },
          on: {
            input: val => {
              this.edittingText = val
            },
            'on-start-edit': params => {
              this.edittingCellId = `editting-${params.index}-${params.column.key}`
              this.$emit('on-start-edit', params)
            },
            'on-cancel-edit': params => {
              this.edittingCellId = ''
              this.$emit('on-cancel-edit', params)
            },
            'on-save-edit': params => {
              this.value[params.index][params.column.key] = this.edittingText
              this.$emit('input', this.value)
              this.$emit(
                'on-save-edit',
                Object.assign(params, { value: this.edittingText })
              )
              this.edittingCellId = ''
            }
          }
        })
      }
      return item
    },
    surportHandle(item) {
      let options = item.options || []
      let insideBtns = []
      options.forEach(item => {
        if (handleBtns[item]) insideBtns.push(handleBtns[item])
      })
      let btns = item.button ? [].concat(insideBtns, item.button) : insideBtns
      item.render = (h, params) => {
        params.tableData = this.value
        return h(
          'div',
          btns.map(item => item(h, params, this))
        )
      }
      return item
    },
    handleColumns(columns) {
      this.insideColumns = columns.map((item, index) => {
        let res = item
        if (res.editable) res = this.suportEdit(res, index)
        if (res.key === 'handle') res = this.surportHandle(res)
        return res
      })
    },
    changeTableColumns() {
      // 显示/隐藏列
      let tableColumns = []

      // 排序
      // let sortColumns = ['handle', 'GUIXIANG', 'GAODI', 'TQI']
      let sortColumns = ['handle']
      for (var i = 0; i < this.controlColumns.length; i++) {
        for (var j = 0; j < this.controlCheckedColumns.length; j++) {
          if (this.controlColumns[i].key === this.controlCheckedColumns[j]) {
            sortColumns.push(this.controlCheckedColumns[j])
          }
        }
      }

      // 遍历重组
      sortColumns.forEach(col => {
        tableColumns.push(this.columns[col])
      })
      this.handleColumns(tableColumns)
    },
    initColumns(columns) {
      // 初始化表格
      let tableColumns = []
      Object.keys(columns).forEach(col => {
        tableColumns.push(columns[col])
      })

      this.controlColumns = tableColumns
      this.controlColumns.forEach((item, index) => {
        if (item.key && item.key !== 'handle' && item.key !== '') {
          this.controlCheckedColumns.push(item.key)
        }
      })

      this.handleColumns(tableColumns)
    },
    setDefaultSearchKey() {
      this.searchKey =
        this.insideColumns[0].key !== 'handle'
          ? this.insideColumns[0].key
          : this.insideColumns.length > 1
            ? this.insideColumns[1].key
            : ''
    },
    handleClear(e) {
      if (e.target.value === '') this.insideTableData = this.value
    },
    handleSearch() {
      // 按条件搜索
      // if (typeof(this.searchKey) === 'undefined' || this.searchKey == null) {
      //   return
      // }
      // this.insideTableData = this.value.filter(item => item[this.searchKey].indexOf(this.searchValue) > -1)
      // this.$emit('handleSearch')
    },
    higherSearch() {
      // 高级查询筛选
      if (this.showSearchableInfoDiv) {
        this.higherSearchInfo.info = '展开高级筛选'
        this.higherSearchInfo.icon = 'md-shuffle'
      } else {
        this.higherSearchInfo.info = '收起高级筛选'
        this.higherSearchInfo.icon = 'ios-shuffle'
      }
      this.showSearchableInfoDiv = !this.showSearchableInfoDiv
    },
    btnSearch() {
      this.$emit('btnSearch')
    },
    btnDelete() {
      this.$emit('btnDelete')
    },
    btnInsert() {
      this.$emit('btnInsert')
    },
    btnUpdate() {
      this.$emit('btnUpdate')
    },
    handleReset() {
      // 重置条件
      this.trackValue = []
      if (this.searchInfo) {
        // this.$refs.refLineInfo.clearSingleSelect()
        // this.$refs.refTrackInfo.clearSingleSelect()
        // this.$refs.refLineBusiness.clearSingleSelect()
      }

      this.$emit('handleReset')
    },
    handleTableData() {
      this.insideTableData = this.value.map((item, index) => {
        let res = item
        res.initRowIndex = index
        return res
      })
    },
    exportCsv(params) {
      this.$refs.tablesMain.exportCsv(params)
    },
    clearCurrentRow() {
      this.$refs.talbesMain.clearCurrentRow()
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('on-current-change', currentRow, oldCurrentRow)
    },
    onSelect(selection, row) {
      this.$emit('on-select', selection, row)
    },
    onSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    onSelectionChange(selection) {
      this.$emit('on-selection-change', selection)
    },
    onSortChange(column, key, order) {
      this.$emit('on-sort-change', column, key, order)
    },
    onFilterChange(row) {
      this.$emit('on-filter-change', row)
    },
    onRowClick(row, index) {
      this.$emit('on-row-click', row, index)
    },
    onRowDblclick(row, index) {
      this.$emit('on-row-dblclick', row, index)
    },
    onExpand(row, status) {
      this.$emit('on-expand', row, status)
    },
    onExpandChange(row, status) {
      this.$emit('on-expand-tree', row, status)
    }
  },
  watch: {
    documentClientHeight: function () {
      this.resetTableHeight()
    },
    columns(columns) {
      this.handleColumns(columns)
      this.setDefaultSearchKey()
    },
    value(val) {
      this.handleTableData()
      this.handleSearch()
    }
  },
  mounted() {
    if (this.columnControl) {
      // 是否有列表显隐
      this.initColumns(this.columns)
    } else {
      this.handleColumns(this.columns)
    }

    this.setDefaultSearchKey()
    this.handleTableData()

    this.lineInfoListData = this.lineInfoList
    this.lineTrackListData = this.trackInfoList
    const _this = this
    if (_this.hasHeight) {
      return
    }
    this.resetTableHeight()
  }
}
</script>
<style media="screen" lang="less">
.right-auto {
  margin-right: auto !important;
}
</style>
