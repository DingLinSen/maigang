<template>
  <ContentWrap :isShowtitle="false">
    <template #list>
      <ul class="content_ul">
        <li @click="todoNavClick(0)" :class="todoNav == 0 ? 'active' : ''"
          >标签分类
          <b v-if="tagLength" class="bubble">{{ tagLength > 99 ? '99+' : tagLength }}</b>
        </li>
        <li @click="todoNavClick(1)" :class="todoNav == 1 ? 'active' : ''"
          >知识分类
          <b v-if="knowledgeLength" class="bubble">{{
            knowledgeLength > 99 ? '99+' : knowledgeLength
          }}</b>
        </li>
      </ul>
    </template>
    <div class="conent">
      <TagTodo v-show="todoNav == 0" v-model="tagLength" />
      <KnowledgeTodo v-show="todoNav == 1" v-model="knowledgeLength" />
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import KnowledgeTodo from './KnowledgeTodo.vue'
import TagTodo from './TagTodo.vue'
import { ref } from 'vue'
const todoNav = ref(0)

const tagLength = ref<number>(0)
const knowledgeLength = ref<number>(0)

const todoNavClick = (index: number) => {
  todoNav.value = index
}
</script>

<style lang="less" scoped>
:deep(.content_ul) {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  li {
    position: relative;
    cursor: pointer;
    &:first-child {
      margin-right: 20px;
    }
  }
  li.active {
    color: #00a0e9;
  }
}

.bubble {
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 14px;
  height: 14px;
  background: #ff5967;
  border-radius: 7px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 10px;
  color: #ffffff;
  line-height: 80px;
  position: absolute;
  right: -10px;
  top: -4px;
}
</style>
