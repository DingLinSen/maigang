<template>
  <div class="widget-item-container">
    <ElFormItem
      class="widget-view"
      v-if="element"
      :key="element.key"
      :class="{ active: selectWidget?.key === element.key }"
      :label="element.label"
      :rules="element.options.rules"
    >
      <template v-if="element.type === 'input'">
        <ElInput
          readonly
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
        >
          <template #prefix v-if="element.options.prefix">
            {{ element.options.prefix }}
          </template>
          <template #suffix v-if="element.options.suffix">
            {{ element.options.suffix }}
          </template>
          <template #prepend v-if="element.options.prepend">
            {{ element.options.prepend }}
          </template>
          <template #append v-if="element.options.append">
            {{ element.options.append }}
          </template>
        </ElInput>
      </template>

      <template v-if="element.type === 'password'">
        <ElInput
          readonly
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
          :show-password="element.options.showPassword"
        >
          <template #prefix v-if="element.options.prefix">
            {{ element.options.prefix }}
          </template>
          <template #suffix v-if="element.options.suffix">
            {{ element.options.suffix }}
          </template>
          <template #prepend v-if="element.options.prepend">
            {{ element.options.prepend }}
          </template>
          <template #append v-if="element.options.append">
            {{ element.options.append }}
          </template>
        </ElInput>
      </template>

      <template v-if="element.type === 'textarea'">
        <ElInput
          type="textarea"
          resize="none"
          readonly
          :rows="element.options.rows"
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :show-word-limit="element.options.showWordLimit"
          :autosize="element.options.autosize"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'number'">
        <ElInputNumber
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :max="element.options.max"
          :min="element.options.min"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'radio'">
        <ElRadioGroup
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :disabled="element.options.disabled"
        >
          <ElRadio
            v-for="item of element.options.options"
            :key="item.value"
            :label="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block'
            }"
            >{{ element.options.showLabel ? item.label : item.value }}</ElRadio
          >
        </ElRadioGroup>
      </template>

      <template v-if="element.type === 'checkbox'">
        <ElCheckboxGroup
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :disabled="element.options.disabled"
        >
          <ElCheckbox
            v-for="item of element.options.options"
            :key="item.value"
            :label="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block'
            }"
            >{{ element.options.showLabel ? item.label : item.value }}
          </ElCheckbox>
        </ElCheckboxGroup>
      </template>

      <template v-if="element.type === 'time'">
        <ElTimePicker
          :modelValue="element.options.defaultValue"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :format="element.options.format"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'date'">
        <ElDatePicker
          :modelValue="element.options.defaultValue"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :format="element.options.format"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'rate'">
        <ElRate
          :modelValue="element.options.defaultValue"
          :max="element.options.max"
          :allowHalf="element.options.allowHalf"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'select'">
        <ElSelect
          :modelValue="element.options.defaultValue"
          :multiple="element.options.multiple"
          :placeholder="element.options.placeholder"
          :clearable="element.options.clearable"
          :filterable="element.options.filterable"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        >
          <ElOption
            v-for="item of element.options.options"
            :key="item.value"
            :value="item.value"
            :label="element.options.showLabel ? item.label : item.value"
          />
        </ElSelect>
      </template>

      <template v-if="element.type === 'switch'">
        <ElSwitch
          :modelValue="element.options.defaultValue"
          :active-text="element.options.activeText"
          :inactive-text="element.options.inactiveText"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'slider'">
        <ElSlider
          :modelValue="element.options.defaultValue"
          :min="element.options.min"
          :max="element.options.max"
          :step="element.options.step"
          :range="element.options.range"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type == 'text'">
        <span>{{ element.options.defaultValue }}</span>
      </template>

      <template v-if="element.type === 'img-upload'">
        <ElUpload
          :name="element.options.file"
          :action="element.options.action"
          :accept="element.options.accept"
          :file-list="element.options.defaultValue"
          :listType="element.options.listType"
          :multiple="element.options.multiple"
          :limit="element.options.limit"
          :disabled="element.options.disabled"
        >
          111
          <!-- <SvgIcon v-if="element.options.listType === 'picture-card'" iconClass="insert" /> -->
          <!-- <ElButton v-else>
            <SvgIcon iconClass="img-upload" style="margin-right: 10px" />
            点击上传
          </ElButton> -->
        </ElUpload>
      </template>

      <template v-if="element.type === 'richtext-editor'">
        <RichTextEditor
          :value="element.options.defaultValue"
          :disable="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'cascader'">
        <ElCascader
          :modelValue="element.options.defaultValue"
          :options="element.options.remoteOptions"
          :placeholder="element.options.placeholder"
          :filterable="element.options.filterable"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>
    </ElFormItem>
    <div class="widget-view-action" v-if="selectWidget?.key === element.key">
      <!-- <SvgIcon iconClass="copy" @click.stop="$emit('copy')" />
      <SvgIcon iconClass="delete" @click.stop="$emit('delete')" /> -->
    </div>

    <div class="widget-view-drag" v-if="selectWidget?.key === element.key">
      <!-- <SvgIcon iconClass="move" className="drag-widget" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRadio,
  ElCheckboxGroup,
  ElCheckbox,
  ElTimePicker,
  ElDatePicker,
  ElRate,
  ElOption,
  ElSwitch,
  ElSlider,
  ElUpload,
  ElButton,
  ElCascader
} from 'element-plus'
// import SvgIcon from '@/components/SvgIcon.vue'
import RichTextEditor from './component/RichTextEditor.vue'
import { WidgetForm } from '@/config/element/element'

export default defineComponent({
  name: 'ElWidgetFormItem',
  components: {
    // SvgIcon,
    RichTextEditor
  },
  props: {
    config: {
      type: Object as PropType<WidgetForm['config']>,
      required: true
    },
    element: {
      type: Object,
      required: true
    },
    selectWidget: {
      type: Object
    }
  },
  emits: ['copy', 'delete'],
  setup() {
    return {
      ElFormItem,
      ElInput,
      ElInputNumber,
      ElRadioGroup,
      ElRadio,
      ElCheckboxGroup,
      ElCheckbox,
      ElTimePicker,
      ElDatePicker,
      ElRate,
      ElOption,
      ElSwitch,
      ElSlider,
      ElUpload,
      ElButton,
      ElCascader
    }
  }
})
</script>
