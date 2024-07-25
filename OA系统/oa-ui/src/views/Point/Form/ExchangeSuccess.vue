<template>
  <Dialog
    ref="elDialogRef"
    class="exchange-dialog"
    v-model="dialogFlag"
    width="400px"
    title="温馨提示"
    :maxHeight="'auto'"
  >
    <div>
      <div class="right-close-class">
        <div style="margin: auto"> </div>
        <div class="pl-[5px] pr-[5px] cursor-pointer" @click="closeDialog">
          <Icon class="is-hover z-10 mt-5px" icon="svg-icon:close_icon_dialog" :size="14" />
        </div>
      </div>
      <div class="center-class mt-[10px]"
        ><img class="img-title" src="@/assets/imgs/icon/success_icon.png"
      /></div>
      <p class="title-class">兑换成功</p>
      <p class="desc-class">请前往积分兑换查看兑换进度</p>
    </div>
    <template #footer>
      <div class="footer">
        <el-button type="primary" class="dialog-btn-sure" @click="toRecord"> 去查看 </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, reactive, computed } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Dialog } from '@/components/Dialog'

const emit = defineEmits(['cancelClick', 'sureClick'])
//弹窗
const elDialogRef = ref()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)

//打开drawer并初始化
const openDrawer = (id: string) => {
  dialogFlag.value = true
  elDialogRef.value.isFullscreen = false
}
//关闭
const closeDialog = () => {
  dialogFlag.value = false
  emit('cancelClick')
}

//去查看
const toRecord = () => {
  dialogFlag.value = false
  emit('sureClick')
}

defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
.right-close-class {
  margin-top: 20px;
  margin-right: 20px;
  display: flex;
}
.img-title {
  width: 48px;
  height: 48px;
}
.center-class {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title-class {
  margin-top: 15px;
  width: 100%;
  font-size: 18px;
  font-weight: 500;
  color: #444444;
  text-align: center;
}
.desc-class {
  margin-top: 8px;
  width: 100%;
  font-size: 14px;
  color: #888888;
  text-align: center;
}
</style>

<style lang="less">
.exchange-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    background: white !important;
    padding: 0px !important;
  }
  .el-dialog__footer {
    margin: 0px 45px;
    padding-top: 3vh;
    padding-bottom: 4vh;
    text-align: center;
    border-top: 0px solid var(--tags-view-border-color);
  }
}
</style>