<script setup lang="ts">
import { PropType, computed, unref, ref } from 'vue'
import { ElButton } from 'element-plus'
import { Form } from '@/components/Form'

import { propTypes } from '@/utils/propTypes'
import { findIndex } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { useEmitt } from '@/hooks/web/useEmitt'

import { cloneDeep } from 'lodash-es'
import { FormSchema } from '@/types/form'

const { t } = useI18n()
const { emitter } = useEmitt()

const props = defineProps({
  // 生成Form的布局结构数组
  schema: {
    type: Array as PropType<FormSchema[] | any>,
    default: () => []
  },
  // 跨页选择的数据
  chooseListAll: {
    type: Array,
    default: () => []
  },
  isShowSearch: {
    type: Boolean,
    default: true
  },
  isShowExpend: propTypes.bool.def(true),
  // 是否需要栅格布局
  isCol: propTypes.bool.def(false),
  // 表单label宽度
  labelWidth: propTypes.oneOfType([String, Number]).def('auto'),
  // 操作按钮风格位置
  layout: propTypes.string.validate((v: string) => ['inline', 'bottom'].includes(v)).def('inline'),
  // 底部按钮的对齐方式
  buttomPosition: propTypes.string
    .validate((v: string) => ['left', 'center', 'right'].includes(v))
    .def('center'),
  showSearch: propTypes.bool.def(true),
  showReset: propTypes.bool.def(true),
  // 是否显示伸缩
  expand: propTypes.bool.def(false),
  // 伸缩的界限字段
  expandField: propTypes.string.def(''),
  inline: propTypes.bool.def(true),
  model: {
    type: Object as PropType<Recordable>,
    default: () => ({})
  },
  widthList: {
    type: Array,
    default: () => []
  },
  widthData: {
    type: Object,
    default: () => {}
  },
  widthFlag: {
    type: String || Number,
    default: null
  },
  // 1-默认，2-原件
  widthType: propTypes.number.def(1),
  //是否显示筛选列
  isShowFilter: propTypes.bool.def(false),
  //是否换行显示
  isWrap: propTypes.bool.def(false),
  allColums: {
    type: Array as PropType<any>,
    default: () => []
  },
  pageName: {
    type: String,
    default: ''
  }
})
const emit = defineEmits([
  'search',
  'reset',
  'changeShowSearchCom',
  'widthSaveChange',
  'filterColumnsChange',
  'allColumnsChange'
])
const visible = ref(true)
const appStore = useAppStore()
const { wsCache } = useCache()
const userInfo = wsCache.get(appStore.getUserInfo)
const newSchema = computed(() => {
  let schema: FormSchema[] = cloneDeep(props.schema)
  if (props.expand && props.expandField && !unref(visible)) {
    const index = findIndex(schema, (v: FormSchema) => v.field === props.expandField)
    if (index > -1) {
      const length = schema.length
      schema.splice(index + 1, length)
    }
  }
  if (props.layout === 'inline') {
    schema = schema.concat([
      {
        field: 'action',
        formItemProps: {
          labelWidth: '0px'
        }
      }
    ])
  }
  return schema
})

const { register, elFormRef, methods } = useForm({
  model: props.model || {}
})

const search = async () => {
  await unref(elFormRef)?.validate(async (isValid) => {
    if (isValid) {
      const { getFormData } = methods
      const model = await getFormData()
      emit('search', model)
    }
  })
}

const reset = async () => {
  unref(elFormRef)?.resetFields()
  const { getFormData } = methods
  const model = await getFormData()
  emit('reset', model)
}

const bottonButtonStyle = computed(() => {
  return {
    textAlign: props.buttomPosition as unknown as 'left' | 'center' | 'right'
  }
})
const isShowSearchCom = ref(props.isShowSearch)
const setVisible = () => {
  unref(elFormRef)?.resetFields()
  visible.value = !unref(visible)
}

const setShowSearchCom = () => {
  isShowSearchCom.value = !isShowSearchCom.value
  emitter.emit('changeShowSearchCom', isShowSearchCom.value)
}
// 列宽保存
const widthSave = () => {
  emitter.emit('widthSaveChange', props.pageName)
}
const checkAll = ref(true)
const isIndeterminate = ref(false)
//所有表头集合
const selectColumns = ref<string[]>([])
//筛选列checkbox变化事件
const changeGroup = (value: string[]) => {
  selectColumns.value = value
  const checkedCount = value.length
  checkAll.value = checkedCount === selectColumns.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < selectColumns.value.length
  emitter.emit('filterColumnsChange', {
    columns: selectColumns.value,
    pageName: props.pageName
  })
}
// 筛选列全选
const handleCheckAllChange = (val) => {
  isIndeterminate.value = false
  if (val) {
    selectColumns.value = props.allColums.map((s) => s.label)
  } else {
    selectColumns.value = []
  }
  emitter.emit('allColumnsChange', {
    checked: val,
    pageName: props.pageName
  })
}
const { setSchema, setValues, getFormData } = methods

defineExpose({
  setSchema,
  setValues,
  getFormData
})
</script>

<template>
  <div :class="isShowExpend ? 'search-container' : 'hidden-line'">
    <div v-show="isShowSearchCom" :class="props.isWrap ? '' : 'flex justify-content-between'">
      <Form
        class="searchWrapper"
        :is-custom="false"
        :label-width="labelWidth"
        hide-required-asterisk
        :inline="inline"
        :is-col="isCol"
        :labelPosition="'right'"
        :schema="newSchema"
        @register="register"
      >
        <template #action>
          <div v-if="layout === 'inline'">
            <ElButton v-if="showSearch" type="primary" @click="search">
              <Icon icon="ep:search" class="mr-5px" />
              {{ t('common.query') }}
            </ElButton>
            <ElButton v-if="showReset" @click="reset" class="btn-default">
              <Icon icon="ep:refresh-right" class="mr-5px" />
              {{ t('common.reset') }}
            </ElButton>
            <ElButton v-if="expand" text @click="setVisible">
              {{ t(visible ? 'common.shrink' : 'common.expand') }}
              <Icon :icon="visible ? 'ant-design:up-outlined' : 'ant-design:down-outlined'" />
            </ElButton>
          </div>
        </template>
      </Form>
      <!-- <div v-if="props.isWrap">
        <slot name="table-btns"></slot>
        <el-button v-if="props.widthFlag && userInfo.admin" @click="widthSave()">
          列宽保存
        </el-button>
        <el-popover
          placement="bottom"
          title=" "
          popper-class="filter-popover"
          width="200"
          trigger="click"
          v-if="isShowFilter"
        >
          <template #reference>
            <el-button type="warning" circle>
              <el-tooltip content="筛选列">
                <Icon icon="ep:filter" />
              </el-tooltip>
            </el-button>
          </template>
          <template #default>
            <div style="max-height: 45vh; overflow-y: auto">
              <ElCheckbox
                class="mb-10px"
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                全选
              </ElCheckbox>
              <ElCheckboxGroup
                :model-value="selectColumns"
                @change="changeGroup"
                :min="0"
                class="mb-10px"
              >
                <ElCheckbox
                  v-for="(item, index) in allColums"
                  :key="index"
                  :model-value="item.field"
                  :checked="item.checked"
                  :label="item.label"
                />
              </ElCheckboxGroup>
            </div>
          </template>
        </el-popover>
      </div> -->
      <span :class="props.isWrap ? 'block' : 'inline'">
        <slot name="table-btns"></slot>
        <el-button v-if="props.widthFlag && userInfo.admin" v-preventReClick @click="widthSave()">
          列宽保存
        </el-button>
        <el-popover
          placement="bottom"
          title=" "
          popper-class="filter-popover"
          width="200"
          trigger="click"
          v-if="isShowFilter"
        >
          <template #reference>
            <el-button type="warning" circle>
              <el-tooltip content="筛选列">
                <Icon icon="ep:filter" />
              </el-tooltip>
            </el-button>
          </template>
          <template #default>
            <div style="max-height: 45vh; overflow-y: auto">
              <ElCheckbox
                class="mb-10px"
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              >
                全选
              </ElCheckbox>
              <ElCheckboxGroup
                :model-value="selectColumns"
                @change="changeGroup"
                :min="0"
                class="mb-10px"
              >
                <ElCheckbox
                  v-for="(item, index) in allColums"
                  :key="index"
                  :model-value="item.field"
                  :checked="item.checked"
                  :label="item.label"
                />
              </ElCheckboxGroup>
            </div>
          </template>
        </el-popover>
      </span>
      <template v-if="layout === 'bottom'">
        <div :style="bottonButtonStyle">
          <ElButton v-if="showSearch" type="primary" @click="search">
            <Icon icon="ep:search" class="mr-5px" />
            {{ t('common.query') }}
          </ElButton>
          <ElButton v-if="showReset" @click="reset" class="btn-default">
            <Icon icon="ep:refresh-right" class="mr-5px" />
            {{ t('common.reset') }}
          </ElButton>
          <ElButton v-if="expand" text @click="setVisible">
            {{ t(visible ? 'common.shrink' : 'common.expand') }}
            <Icon :icon="visible ? 'ant-design:up-outlined' : 'ant-design:down-outlined'" />
          </ElButton>
        </div>
      </template>
    </div>
    <div class="expend-tb" v-if="isShowExpend" @click="setShowSearchCom()">
      <span class="text">
        {{ isShowSearchCom ? '收起' : '展开' }}
      </span>
      <Icon
        icon="ep:caret-top"
        class="mr-5px"
        color="var(--el-color-primary)"
        v-if="isShowSearchCom"
      />
      <Icon icon="ep:caret-bottom" color="var(--el-color-primary)" class="mr-5px" v-else />
    </div>
  </div>
</template>

<style lang="less" scoped>
.searchWrapper {
}
.block {
  display: block;
  text-align: right;
  padding-bottom: 10px;
}
.inline {
  display: flex;
}
.search-container {
  position: relative;
  width: 100%;

  // margin-bottom: 10px;
  // border-bottom: 1px solid #ccc;
  &::before {
    content: '';
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: calc(50% - 35px);
    height: 1px;
    background: #eff0f7;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0px;
    bottom: 0px;
    width: calc(50% - 25px);
    height: 1px;
    background: #eff0f7;
  }
}

.expend-tb {
  text-align: center;
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translate(-50%, -50%);
  // background: #ccc;
  display: flex;
  align-items: center;
  cursor: pointer;

  &::after {
    z-index: -1;
    content: '';
    position: absolute;
    left: -10px;
    bottom: 0px;
    width: 60px;
    height: 13px;
    background: #fff;
    border: 1px solid #eff0f7;
    border-top: none;
  }

  .text {
    font-size: 14px;
    color: var(--el-color-primary);
  }
}
</style>
