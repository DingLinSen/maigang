<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/no-dupe-keys -->
<template>
  <div class="widget-cate">{{ title }}</div>
  <draggable
    tag="ul"
    item-key="type"
    ghost-class="ghost"
    :group="{ name: 'people', pull: 'clone', put: false }"
    :sort="false"
    v-model="list"
  >
    <template #item="{ element }">
      <li
        v-if="fields.includes(element.type)"
        class="form-edit-widget-label"
        :class="{ 'no-put': element.type === 'divider' }"
      >
        <a>
          <Icon
            v-if="element.type === 'input'"
            style="vertical-align: middle; margin-right: 10px"
            icon="vaadin:input"
          />
          <Icon
            v-if="element.type === 'password'"
            style="vertical-align: middle; margin-right: 10px"
            icon="mdi:password-outline"
          />
          <Icon
            v-if="element.type === 'textarea'"
            style="vertical-align: middle; margin-right: 10px"
            icon="iconoir:input-field"
          />
          <Icon
            v-if="element.type === 'number'"
            style="vertical-align: middle; margin-right: 10px"
            icon="fluent-emoji-high-contrast:input-numbers"
          />
          <Icon
            v-if="element.type === 'radio'"
            style="vertical-align: middle; margin-right: 10px"
            icon="fluent-emoji-high-contrast:input-numbers"
          />
          <span>{{ element.label }}</span>
        </a>
      </li>
    </template>
  </draggable>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, unref, toRefs, reactive } from 'vue'
// import { VueDraggableNext } from 'vue-draggable-next'
import draggable from 'vuedraggable'
// import SvgIcon from './SvgIcon.vue'

export default defineComponent({
  name: 'ComponentGroup',
  components: {
    draggable
    // SvgIcon
  },
  props: {
    title: {
      type: String,
      required: true
    },
    fields: {
      type: Array as PropType<Array<string>>,
      required: true
    },
    // eslint-disable-next-line vue/require-prop-types
    list: {
      required: true
    }
  },
  setup(props) {
    // console.log(props.title)
    // const title =(props.title

    const data = reactive({
      drag: false,
      myArray: [
        { id: 1, name: 'Jenny' },
        { id: 2, name: 'kevin' },
        { id: 3, name: 'lili' }
      ]
    })
    return { ...toRefs(data) }

    // const list = 0(props.list
    // console.log(fields)
    // return {
    //   // eslint-disable-next-line vue/no-dupe-keys
    //   title,
    //   // eslint-disable-next-line vue/no-dupe-keys
    //   fields,
    //   // eslint-disable-next-line vue/no-dupe-keys
    //   list
    // }
  }
})
</script>
