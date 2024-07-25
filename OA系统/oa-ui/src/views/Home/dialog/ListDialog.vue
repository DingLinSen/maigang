<template>
  <WhiteDialog
    v-model="showModel"
    class="dialog-bg-class"
    title="重要通知"
    width="50%"
    title-align="center"
    @closed="handleClose"
  >
    <div class="content-wrap">
      <ul class="announUl">
        <li v-for="item in listDatas" :key="item.id" @click="announceClick(item)">
          <a>
            <span class="over-w" :style="{ color: item.flag == 0 ? '#222222' : '#999999' }"
              ><span
                :class="
                  item.type == 'a'
                    ? 'fwzx-icon'
                    : item.type == 'b'
                    ? 'agriculture-tag-class'
                    : item.type == 'c'
                    ? 'product-tag-class'
                    : item.type == 'd'
                    ? 'war-industry-tag-class'
                    : 'other-tag-class'
                "
                >{{
                  item.type == 'a'
                    ? '公司公告'
                    : item.type == 'b'
                    ? '公司制度'
                    : item.type == 'c'
                    ? '课程考核'
                    : item.type == 'd'
                    ? '项目管理'
                    : '置顶'
                }}</span
              >{{ item.title }}</span
            >
            <span class="fl-r">{{ item.editTime.substring(0, 10) }}</span>
          </a>
        </li>
      </ul>
    </div>
  </WhiteDialog>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { onMounted, ref, nextTick, watch } from 'vue'
import { WhiteDialog } from '@/components/WhiteDialog'

const props = defineProps({
  listDatas: propTypes.array.def([]),
  modelValue: propTypes.bool.def(false)
})

const showModel = ref<boolean>(false)
// 监听窗口变化
watch(
  () => props.modelValue,
  (value: boolean) => {
    showModel.value = value
  },
  {
    immediate: true
  }
)

const emit = defineEmits(['showAnnouncement', 'update:modelValue'])

const announceClick = (item: any) => {
  item.flag = 1 // 已读标识 不入库
  emit('showAnnouncement', item)
}

const dialogVisible = ref(false)
//关闭后重置信息
const handleClose = () => {
  emit('update:modelValue', false)
}

//打开
const openDialog = (data: any[]) => {
  dialogVisible.value = true
}

defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
.content-wrap {
  overflow-y: auto;
  padding-left: 8px;
  padding-right: 8px;
}
.announUl {
  padding: 0;
  li {
    list-style: none;
    color: #999999;
    font-size: 12px;
    padding: 6px 0 1px 0;
    border-bottom: 1px dotted #dddddd;
    cursor: pointer;
    a {
      color: #555555;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      .over-w {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 14px;
        max-width: 80%;
        display: inline-block;
      }
    }
    .fl-r {
      float: right;
      margin-top: 1px;
      font-size: 14px;
      color: #999999;
    }
    &:hover {
      a,
      span {
        color: #1c75cf;
        text-decoration: underline;
      }
      .fwzx-icon {
        color: #ffffff;
        // background-color: #D2E3F5;
        text-decoration: none;
      }
      .product-tag-class {
        color: #ffffff;
        text-decoration: none;
      }
      .agriculture-tag-class {
        color: #ffffff;
        text-decoration: none;
      }
      .railway-tag-class {
        color: #ffffff;
        text-decoration: none;
      }
      .war-industry-tag-class {
        color: #ffffff;
        text-decoration: none;
      }
      .other-tag-class {
        color: #ffffff;
        text-decoration: none;
      }
    }
  }
}
.fwzx-icon {
  width: 70px;
  height: 24px;
  padding: 3px 7px;
  background: #1c75cf;
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  margin-right: 10px;
  text-align: center;
  display: inline-block;
}
.product-tag-class {
  width: 70px;
  height: 24px;
  padding: 3px 7px;
  background: #e9852d;
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  margin-right: 10px;
  text-align: center;
  display: inline-block;
}
.agriculture-tag-class {
  width: 70px;
  height: 24px;
  padding: 3px 7px;
  background: #52c181;
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  margin-right: 10px;
  text-align: center;
  display: inline-block;
}
.railway-tag-class {
  width: 70px;
  height: 24px;
  padding: 3px 7px;
  background: #c5ab86;
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  margin-right: 10px;
  text-align: center;
  display: inline-block;
}
.war-industry-tag-class {
  width: 70px;
  height: 24px;
  padding: 3px 7px;
  background: #97afc5;
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  margin-right: 10px;
  text-align: center;
  display: inline-block;
}
.other-tag-class {
  width: 70px;
  height: 24px;
  padding: 3px 7px;
  background: #ff5252;
  border-radius: 2px;
  font-size: 14px;
  color: #ffffff;
  margin-right: 10px;
  text-align: center;
  display: inline-block;
}
</style>
<style lang="less">
.dialog-bg-class {
  border-radius: 4px !important;
}
</style>