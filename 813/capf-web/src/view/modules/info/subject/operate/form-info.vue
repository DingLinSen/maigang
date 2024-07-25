<!--
 * @description subjectmanagement- 课目管理表--新增/编辑查看/界面
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
      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="课目名称" label-position="top" prop="name">
              <Input
                type="text"
                v-model.trim="formData.name"
                placeholder="请输入课目名称"
                ref="name"
                :disabled="isSee"
                :maxlength="20"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="课目类型" label-position="top" prop="type">
              <Select
                v-model="formData.type"
                ref="type"
                disabled
                remote
                name="select"
                :clearable="false"
                placeholder="请选择课目类型"
                @on-change="subjectTypeChange"
              >
                <Option value="1" label="理论知识"></Option>
                <Option value="2" label="专业操作"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="课目简介" label-position="top" prop="introduction">
              <Input
                type="textarea"
                :row="3"
                v-model.trim="formData.introduction"
                placeholder="请输入课目简介"
                ref="introduction"
                :disabled="isSee"
                :maxlength="100"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32" v-if="canAddChapter">
          <Col span="24">
            <span>章节</span>
            <br />
            <div
              class="search-container-wrapper search-container-wrapper-top mar-btm"
              style="margin-left:20px;margin-right:20px;border-bottom: 1px solid #EEEEEE;border-radius:0px;"
              v-for="(item, index) in chapterArray"
              :key="index"
              :model="item"
            >
              <span style="margin-left:30px;"> {{ item.chapterTitle }} </span>
              <span style="margin-left:20px;"> {{ item.chapter }} </span>
              <span style="margin-right: auto !important;"></span>
              <div style="margin-right:30px;" v-if="!isSee">
                <span
                  class="c-primary"
                  style="cursor: pointer;"
                  @click="editChapter(index)"
                  >编辑</span
                >
                <span
                  class="c-error"
                  style="margin-left:20px;cursor: pointer;"
                  @click="deleteChapter(index)"
                  >删除</span
                >
              </div>
            </div>
            <div style="text-align: center; margin-top: 25px;" v-if="!isSee">
              <Button
                type="primary"
                style="width: 450px;margin-bottom:10px"
                @click="addMoreChapter"
                >添加章节</Button
              >
            </div>
          </Col>
        </Row>
      </Form>
      <div
        class="demo-drawer-footer"
        style="text-align: center;margin-top:30px;"
      >
        <Button type="primary" @click="handleValidate" v-if="!isSee"
          >确认{{ !isOperate ? '新增' : '编辑' }}</Button
        >
        <Button
          type="default"
          class="mar-lft-10"
          @click.stop="handleCancleModel"
          >取消操作</Button
        >
      </div>
    </div>
    <Modal
      v-model="addModel"
      :title="chapterTitle"
      :mask-closable="maskClosable"
    >
      <Form
        :model="chapter"
        ref="formValidate1"
        :rules="formValidate1"
        :label-width="80"
        style="margin-top:20px;"
      >
        <Row :gutter="32">
          <Col span="24">
            <FormItem label="章节" label-position="right" prop="chapterTitle">
              <Input
                type="text"
                v-model.trim="chapter.chapterTitle"
                placeholder="请输入章节"
                ref="chapterTitle"
                :disabled="isSee"
                :maxlength="10"
              />
            </FormItem>
            <FormItem label="章节名称" label-position="right" prop="chapter">
              <Input
                type="text"
                v-model.trim="chapter.chapter"
                placeholder="请输入章节名称"
                ref="chapter"
                :disabled="isSee"
                :maxlength="30"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>

      <div slot="footer">
        <Button @click="cancleModal">取消</Button>
        <Button type="primary" @click="handleChapter">确认</Button>
      </div>
    </Modal>
    <!-- 删除弹框 -->
    <Modal
      v-model="deleteChapterModel"
      :title="this.$store.state.base.deleteInfo.title"
      @on-ok="handleDelete"
    >
      <p>{{ this.$store.state.base.deleteInfo.msg }}</p>
    </Modal>
  </div>
</template>

<script>
import {
  operateSubjectManagementInfo,
  initSubjectManagementDetailsById
} from '@/api/info/subject/api-modules-subjectmanagement'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import FormChapterInfo from './form-chapter'
import RulesValidate from './form-validate'
import RulesValidateSub from './form-validate-sub'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      chapterArray: [],
      formValidate1: RulesValidateSub(this),
      addModel: false,
      chapterTitle: '新增章节',
      deleteChapterModel: false,
      chapter: FormChapterInfo(),
      isChapterEdit: false,
      chapterEditIndex: 0,
      maskClosable: false,
      canAddChapter: true
    }
  },
  computed: {},
  activated() {
    this.initFormData()
    this.canAddChapter = true
    this.chapterArray = []
    this.formData.type = '1'
  },
  methods: {
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        if (this.isOperate) {
          this.formData = FormDataInfo()
          this.formData.type = '1'
          initSubjectManagementDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData = res.data.subjectManagementDO
                this.formData.type = String(this.formData.type)
                if (this.formData.type === '2') {
                  this.canAddChapter = false
                } else {
                  this.canAddChapter = true
                }
                this.chapterArray = []
                if (
                  this.formData.subjectChapterDOS &&
                  this.formData.subjectChapterDOS.length > 0
                ) {
                  this.chapterArray = this.formData.subjectChapterDOS
                }
              } else {
                this.formData = FormDataInfo()
                this.formData.type = '1'
                // this.$Message.error('获取信息详情时异常，请联系管理员')
              }
            })
            .catch(() => {})
        }
      })
    },
    // 保存信息 （添加和编辑）
    handleSubmit() {
      let params = Object.assign(
        { ...this.formData },
        {
          isOperate: this.isOperate
        }
      )
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          if (this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      if (this.chapterArray && this.chapterArray.length > 0) {
        var tempArray = []
        this.chapterArray.forEach((item, index) => {
          tempArray.push({
            id: item.id ? item.id : null,
            chapter: item.chapter,
            chapterTitle: item.chapterTitle,
            sort: index + 1
          })
        })
        params['subjectChapterDOS'] = tempArray
      }
      operateSubjectManagementInfo(params)
        .then(({ data }) => {
          this.$Spin.hide()
          if (data.status) {
            this.$Message.success('成功保存信息')
            this.handleCancleModel()
            this.$nextTick(() => {
              this.$emit('operateSuccess', params)
            })
          } else {
            // this.$Message.error('保存信息时系统异常')
          }
        })
        .catch(() => {})
    },

    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      // this.initFormData()
    },
    // 编辑章节
    editChapter(index) {
      this.isChapterEdit = true
      var chapterObject = this.chapterArray[index]
      this.chapterEditIndex = index
      this.chapter = {
        chapter: chapterObject.chapter,
        chapterTitle: chapterObject.chapterTitle
      }
      this.chapterTitle = '编辑章节'
      this.addModel = true
    },
    // 删除章节
    deleteChapter(index) {
      this.chapterEditIndex = index
      this.deleteChapterModel = true
    },
    handleDelete() {
      this.chapterArray.splice(this.chapterEditIndex, 1)
    },
    // 添加章节
    addMoreChapter() {
      this.isChapterEdit = false
      this.chapter = FormChapterInfo()
      this.chapterTitle = '新增章节'
      this.addModel = true
    },
    // 检查章节添加时字段验证
    handleChapter() {
      this.$handleValidate('formValidate1', this).then(valid => {
        if (valid) {
          if (this.isChapterEdit) {
            var chapterObject = this.chapterArray[this.chapterEditIndex]
            chapterObject.chapter = this.chapter.chapter
            chapterObject.chapterTitle = this.chapter.chapterTitle
          } else {
            this.chapterArray.push(this.chapter)
          }
          this.chapterArray.forEach((item, index) => {
            item.sort = String(index + 1)
          })
          this.$Spin.hide()
          this.addModel = false
        }
      })
    },
    // 关闭添加章节框
    cancleModal() {
      this.addModel = false
    },
    // 选择课目类型
    subjectTypeChange(val) {
      if (this.formData.type === '2') {
        this.canAddChapter = false
      } else {
        this.canAddChapter = true
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
