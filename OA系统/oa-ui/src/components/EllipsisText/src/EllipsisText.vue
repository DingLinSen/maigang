<template>
  <div class="hello">
    <div class="detailed-introduce">
      <div class="intro-content" ref="content">
        <span class="merchant-desc" ref="desc">
          {{ introduce }}
        </span>
        <div class="unfold" @click="clickTotal" v-if="showExchangeButton">
          {{ showTotal ? '收起' : '展开' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps({
  showLine: {
    type: Number,
    default: 3
  },
  value: {
    type: String,
    default: ''
  }
})
const showTotal = ref<boolean>(false) // 是否展示所有文本内容
const showExchangeButton = ref<boolean>(false) // 是否显示展开收起按钮
const introduce = ref<string>('')

const desc = ref() // 文本组件

// onMounted(() => {
//   // 获取初始化数据
//   loadInfo()
// })

const txtDec = () => {
  if (props.value && desc.value) {
    // 对页面中的元素重新赋值，否则会采用之前裁剪过的文本
    introduce.value = props.value
    nextTick(() => {
      let rows = desc.value.getClientRects().length // 文本行数
      let txt = props.value // 文本
      // 文本为3行时的字数长度
      let tl = 0 // eslint-disable-line no-unused-vars
      if (rows < props.showLine) {
        // 未超出行数，返回
        introduce.value = props.value
        showExchangeButton.value = false
        // state.seriesInfo.introduction.length - props.introduce.length > 10
        //   ? (state.showExchangeButton = true)
        //   : (state.showExchangeButton = false) // html元素大于30个字符，显示展开按钮
        return
      } else {
        // 数据量大时速度太慢，需优化(二分法？)
        while (rows > props.showLine) {
          // 超出，遍历文字并进行截取，直到文本小于三行
          let step = 1 // 末尾扣除的字数
          if (/<br\/>$/.test(txt)) {
            // 回退的时候，如果碰到换行要整体替换
            step = 5
          }
          txt = txt.slice(
            0,
            rows > props.showLine + 2 ? -step * 20 : rows > props.showLine + 1 ? -step * 2 : -step
          ) // 截取
          // console.log('txt===>', txt)
          desc.value.innerHTML = txt
          introduce.value = txt
          nextTick()
          rows = desc.value.offsetHeight / 22
          tl += step
        }
        if (txt.charCodeAt(txt.length - 1) < 255) {
          // 文字末尾留三个字符的空并加省略号(中文字符和英文字符留空大小不同，中文-3，英文-8)
          introduce.value = txt.slice(0, txt.length - 8) + '...'
        } else {
          introduce.value = txt.slice(0, txt.length - 3) + '...'
        }
        showExchangeButton.value = true // 显示展开收起按钮
      }
    })
  }
}

const getLineLen = (arr: any) => {
  //获取当前文本真实的行数，如果是<br>符号getClientRects()方法也会变成一个区域
  var line = 0
  var bottom = 0
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].bottom != bottom) {
      bottom = arr[i].bottom
      line++
    }
  }
  return line
}

/** 防抖函数 */
const debounce = (fn: any, wait: number) => {
  let timer2: any = null
  return function () {
    if (timer2 !== null) {
      clearTimeout(timer2)
    }
    timer2 = setTimeout(fn, wait)
  }
}

/** 点击展开/收起按钮 */
const clickTotal = () => {
  showTotal.value = !showTotal.value
  // 页面数据过多时txtDec的循环块会运行一段时间，造成点击“收起”按钮时卡顿
  // 解决方法：在收起时为父元素增加max-height样式，达到隐藏效果
  // 解决失败：初步判断是vue的虚拟dom算法，不能立即更新元素样式，等到nextTick后才会更新s
  !showTotal.value
    ? (desc.value.parentNode.style['max-height'] = `${22 * props.showLine}px`)
    : (desc.value.parentNode.style['max-height'] = '')
  showTotal.value ? (desc.value.innerHTML = props.value) : txtDec()
}

/** 窗口尺寸改变时重新计算文本的显示长度：使用防抖函数实现 */
window.addEventListener('resize', debounce(txtDec, 200))

/** 数据初始化 */
const loadInfo = () => {
  introduce.value = ''
  showExchangeButton.value = false
  txtDec()
}

watch(
  () => props.value,
  (data: String) => {
    if (data) {
      loadInfo()
    } else {
      introduce.value = ''
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="less" scoped>
.detailed-introduce {
  width: 100%;
  font-size: 15px;
  color: var(--el-text-color-primary);
  position: relative;
  overflow: hidden;

  .intro-content {
    overflow: hidden;
    text-align: left;

    .merchant-desc {
      width: 100%;
      line-height: 22px;
    }

    .unfold {
      text-indent: 0;
      z-index: 11;
      height: 22px;
      line-height: 22px;
      position: absolute;
      right: 10px;
      bottom: 0px;
      background: #f5f6f7;
      opacity: 1;
      cursor: pointer;
      color: #2878ff;
    }
  }
}
</style>