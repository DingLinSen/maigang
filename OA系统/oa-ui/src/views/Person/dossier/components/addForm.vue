<script setup lang="ts">
import { ref, onMounted, nextTick, watch, inject } from 'vue'
import { ElButton, ElMessage, ElForm, ElFormItem, ElDatePicker } from 'element-plus'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  title: propTypes.string.def(''),
  modelValue: {
    type: Array,
    default: []
  },
  arrlist: {
    type: Object,
    default: null
  },
  delFlag: {
    type: Boolean,
    default: true
  }
})
const dom = ref<any>()

const emit = defineEmits(['update:modelValue'])
const array = ref<any>([])
onMounted(() => {
  nextTick(() => {
    array.value = props.modelValue
  })
})
const forbidden = inject('forbidden')

watch(
  props.modelValue,
  (value) => {
    nextTick(() => {
      array.value = props.modelValue
    })
  },
  { immediate: true }
)

const add = () => {
  array.value = props.modelValue
  if (props.arrlist) {
    let obj = {}
    for (var key in props.arrlist) {
      obj[key] = props.arrlist[key]
    }
    array.value.push(obj)
  }
  emit('update:modelValue', array.value)
}

const del = (e) => {
  array.value = props.modelValue
  array.value.splice(e, 1)
  emit('update:modelValue', array.value)
}
</script>

<template>
  <section class="pr-2 bg-white addform">
    <div class="flex justify-between pb-[11px]">
      <p class="font-2xl addform-title">{{ title }}</p>
      <div
        class="text-15px text-[#00A0E9] flex items-end"
        v-if="
          !(
            props.title === '工作经历（公司内部）' ||
            props.title === '健康状况' ||
            props.title === '奖惩经历（公司内部）'
          ) && !forbidden
        "
      >
        <p class="flex items-end cursor-pointer" @click="add()" v-if="modelValue.length">
          <img class="mr-7px" src="@/assets/imgs/icon/add_bar_icon.png" />
          <span>新增</span>
        </p>
        <!-- <el-button type="primary" @click="add()">新增</el-button> -->
      </div>
    </div>
    <div class="addform-content">
      <div v-if="modelValue.length">
        <div ref="dom" v-for="(item, index) in modelValue" :key="index">
          <el-row>
            <el-col :span="22">
              <div class="overflow-hidden">
                <slot name="content" :item="item" :index="index"></slot>
              </div>
            </el-col>
            <el-col :span="2" class="flex mt-[30px] justify-center">
              <el-button
                class="add-form-btn"
                @click="del(index)"
                v-if="
                  !(
                    props.title === '工作经历（公司内部）' ||
                    props.title === '健康状况' ||
                    props.title === '奖惩经历（公司内部）'
                  ) && !forbidden
                "
                ><Icon icon="ep:delete" class="mr-5px" />删除</el-button
              >
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else class="new-add-form bg-[#f5fbfe] h-[50px]">
        <div
          class="cursor-pointer justify-center flex items-center h-full text-[#00a0e9]"
          v-if="
            !(
              props.title === '工作经历（公司内部）' ||
              props.title === '健康状况' ||
              props.title === '奖惩经历（公司内部）'
            ) && !forbidden
          "
          @click="add()"
        >
          <img class="mr-5px" src="@/assets/imgs/icon/add_bar_icon1.png" />
          <span>请添加{{ props.title }}</span>
        </div>
        <div class="justify-center flex items-center h-full text-[#00a0e9]" v-else>
          <span>暂无数据</span>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="less" scoped>
.addform-content {
  overflow: hidden;
  border-radius: 2px;
  // background: #f9f9f9 !important;
}

.addform-title {
  padding-left: 8px;
  font-size: 16px;
  color: #333333;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 3px;
    height: 15px;
    background: #00a0e9;
    border-radius: 2px;
    position: absolute;
    left: 0;
    top: 5px;
  }
}
.new-add-form {
  border-top: 1px dashed #99d9f6;
  border-bottom: 1px dashed #99d9f6;
  border-left: 1px solid #99d9f6;
  border-right: 1px solid #99d9f6;
}
</style>

<style>
.add-form-btn {
  height: 32px !important;
}
</style>
