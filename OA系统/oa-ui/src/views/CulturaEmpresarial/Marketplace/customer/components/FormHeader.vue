<template>
  <div>
    <div v-if="line" class="line"></div>
    <header class="flex itesms-end justify-between">
      <h3 class="relative flex items-center font-bold text-base title-clas pl-8px text-[#333]">{{
        title
      }}</h3>

      <div class="flex itesms-center" v-if="addFlag">
        <p class="add-btn-class" @click="add()">
          <img class="mr-7px" src="@/assets/imgs/icon/add_bar_icon.png" />
          <span>添加</span>
        </p>
      </div>
    </header>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  line: {
    type: Boolean,
    default: false
  },
  addFlag: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['addClick'])

const add = () => {
  emit('addClick')
}
</script>
<style lang="less" scoped>
.title-clas::after {
  content: '';
  width: 3px;
  height: 15px;
  position: absolute;
  top: 50%;
  background: #00a0e9;
  left: 0px;
  transform: translateY(-50%);
  border-radius: 1.5px;
}
.line {
  margin-top: 22px;
  margin-bottom: 28px;
  background: #eef0f2;
  height: 1px;
}
.add-btn-class {
  align-items: flex-end;
  display: flex;
  cursor: pointer;
  img {
    width: 17px;
    height: 17px;
  }
  span {
    height: 17px;
    line-height: 17px;
    color: #00a0e9;
    font-size: 15px;
  }
}
</style>

