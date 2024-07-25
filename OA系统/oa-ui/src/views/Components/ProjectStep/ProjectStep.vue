<template>
  <section>
    <div class="project-step">
      <div class="step-item" v-for="(item, index) in steps" :key="index">
        <div class="left-item">
          <div
            class="item-line"
            v-show="index !== steps.length - 1"
            :style="{ 'background-color': index >= active ? '#d5d5d5' : '#21A974' }"
          ></div>
          <div class="flex" v-show="index < active">
            <img src="@/assets/imgs/icon/checked.png" class="right-icon-status-class" />
          </div>
          <div class="flex" v-show="index >= active">
            <span :class="index == active ? 'item-index-active' : 'item-index'"
              >{{ index + 1 }}
            </span>
          </div>
        </div>
        <div class="right-item">
          <div class="w-full flex ml-[5px]">
            <p class="w-full">
              <span
                class="text-info-class"
                :style="{
                  color: index == active ? '#00A0E9' : index > active ? '#999999' : '#21A974'
                }"
              >
                {{ item.createByName ? item.createByName : item.title }}
              </span>
              <span
                class="text-info-class ml-[5px]"
                :style="{
                  color: index > active ? '#999999' : '#444444'
                }"
              >
                {{ item.content }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { PropType, ref } from 'vue'

const props = defineProps({
  steps: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  active: {
    type: Number,
    default: () => -1
  }
})
</script>
<style lang="less" scoped>
.project-step {
  height: 100%;
  flex-flow: column;
  display: flex;
}
.step-item {
  display: flex;
  position: relative;
  flex-shrink: 1;
  flex-basis: 45px;
}
.item-line {
  width: 1px;
  top: 0;
  bottom: 0;
  left: 10.5px;
  position: absolute;
  background-color: #d5d5d5;
}

.left-item {
  flex-grow: 0;
  width: 22px;
  position: relative;
}

.right-icon-status-class {
  width: 22px;
  height: 22px;
  background-color: white;
  position: relative;
  z-index: 1;
}

.item-index {
  border-radius: 50%;
  border: 2px solid #a5a5a5;
  color: #a5a5a5;
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  font-weight: 700;
  font-size: 14px;
  box-sizing: border-box;
  background: var(--el-bg-color);
  transition: 0.15s ease-out;
}

.item-index-active {
  border-radius: 50%;
  border: 2px solid #00a0e9;
  color: #00a0e9;
  position: relative;
  z-index: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  font-size: 14px;
  box-sizing: border-box;
  background: var(--el-bg-color);
  transition: 0.15s ease-out;
}
.right-item {
  padding-left: 5px;
  flex-grow: 1;
  width: 100%;
  word-wrap: break-word;
  margin-bottom: 20px;
  white-space: normal;
  text-align: left;
}
.right-left-class {
  width: 22px;
  display: table-cell;
  height: 0px;
}

.right-line-class {
  width: 1px;
  background: #d5d5d5;
  height: calc(100% + 20px);
  margin-left: 9.5px;
}

.index-number-class {
  width: 22px;
  height: 22px;
  background: #ffffff;
  border: 2px solid #a5a5a5;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  font-size: 14px;
  color: #a5a5a5;
}

.index-active-class {
  width: 22px;
  height: 22px;
  background: #ffffff;
  border: 2px solid #00a0e9;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  font-size: 14px;
  color: #00a0e9;
}

.text-info-class {
  font-size: 14px;
  color: #999999;
  line-height: 22px;
}
</style>