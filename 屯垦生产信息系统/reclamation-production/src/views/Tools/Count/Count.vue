<script setup lang="ts">
import { h, reactive, ref, nextTick, unref, onMounted } from 'vue'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { ContentWrap } from '@/components/ContentWrap'

defineOptions({
  name: 'Count'
})
const formCountRef = ref<FormExpose>()
const schemaCount = reactive<FormSchema[]>([
  {
    field: 'ton',
    label: '种子重量数值',
    component: 'Input',
    colProps: {
      span: 5
    }
  },
  {
    field: 'zl',
    label: '重量类型',
    component: 'Select',
    colProps: {
      span: 4
    },
    value: 1,
    componentProps: {
      options: [
        {
          label: '吨',
          value: 1
        }
      ]
    },
    formItemProps: {
      labelWidth: 70
    }
  },
  {
    field: 'pz',
    label: '品种类型',
    component: 'Select',
    colProps: {
      span: 4
    },
    value: 2,
    componentProps: {
      options: [
        {
          label: '品种一号',
          value: 2
        }
      ]
    },
    formItemProps: {
      labelWidth: 70
    }
  },
  {
    field: 'conversion',
    colProps: {
      span: 2
    }
  },
  {
    field: 'ton',
    label: '晌',
    component: 'Input',
    colProps: {
      span: 3
    },
    formItemProps: {
      labelWidth: 25
    }
  },
  {
    field: 'ton',
    label: '亩',
    component: 'Input',
    colProps: {
      span: 3
    },
    formItemProps: {
      labelWidth: 25
    }
  },
  {
    field: 'ton',
    label: '袋',
    component: 'Input',
    colProps: {
      span: 3
    },
    formItemProps: {
      labelWidth: 25
    }
  }
])
const schema = reactive<FormSchema[]>([
  {
    field: 'ton',
    label: '吨(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'kg',
    label: '千克(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'jin',
    label: '斤(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'weight',
    colProps: {
      span: 6
    }
  },
  {
    field: 'hectare',
    label: '晌/公顷(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'muUnit',
    label: '亩(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'squareMeter',
    label: '平方米(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'square',
    colProps: {
      span: 6
    }
  },
  {
    field: 'noonPlant',
    label: '晌/株(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'muPlant',
    label: '亩/株(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'squareMeterPlant',
    label: '平方米/株(单位)',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'density',
    colProps: {
      span: 6
    }
  },
  {
    field: 'grainDryWeight',
    label: '籽粒干重',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'earOfGrainWeight',
    label: '÷果穗干重',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'seedYieldWeight',
    label: '×100%=出籽率',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'seedYield',
    colProps: {
      span: 6
    }
  },
  {
    field: 'germinateNumber',
    label: '发芽种粒数',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'tryNumber',
    label: '÷供试种粒数',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'germinationRate',
    label: '×100%=发芽率',
    component: 'Input',
    colProps: {
      span: 6
    }
  },
  {
    field: 'germinationPercentage',
    colProps: {
      span: 6
    }
  }
])
const formRef = ref<FormExpose>()

const resetWeight = () => {
  unref(formRef)?.setValues({
    ton: '',
    kg: '',
    jin: ''
  })
}
const resetSquare = () => {
  unref(formRef)?.setValues({
    hectare: '',
    muUnit: '',
    squareMeter: ''
  })
}
const resetDensity = () => {
  unref(formRef)?.setValues({
    noonPlant: '',
    muPlant: '',
    squareMeterPlant: ''
  })
}
const resetSeedYield = () => {
  unref(formRef)?.setValues({
    grainDryWeight: '',
    earOfGrainWeight: '',
    seedYieldWeight: ''
  })
}
const resetGerminationPercentage = () => {
  unref(formRef)?.setValues({
    germinateNumber: '',
    tryNumber: '',
    germinationRate: ''
  })
}
</script>

<template>
  <ContentWrap class="mt-7px mb-10px h-85vh">
    <div class="count_title"> 欢迎进入通用计算工具 </div>
    <Form :schema="schema" ref="formRef" class="form-content" :labelPosition="'left'">
      <template #weight>
        <ElButton
          :loading="delLoading"
          v-hasPermi="'system:dict:remove'"
          @click="resetWeight"
          class="btn-default"
        >
          清空
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          进行换算
        </ElButton>
      </template>
      <template #square>
        <ElButton
          :loading="delLoading"
          v-hasPermi="'system:dict:remove'"
          @click="resetSquare"
          class="btn-default"
        >
          清空
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          进行换算
        </ElButton>
      </template>
      <template #density>
        <ElButton
          :loading="delLoading"
          v-hasPermi="'system:dict:remove'"
          @click="resetDensity"
          class="btn-default"
        >
          清空
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          密度换算
        </ElButton>
      </template>
      <template #seedYield>
        <ElButton
          :loading="delLoading"
          v-hasPermi="'system:dict:remove'"
          @click="resetSeedYield"
          class="btn-default"
        >
          清空
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          籽率计算
        </ElButton>
      </template>
      <template #germinationPercentage>
        <ElButton
          :loading="delLoading"
          v-hasPermi="'system:dict:remove'"
          @click="resetGerminationPercentage"
          class="btn-default"
        >
          清空
        </ElButton>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          芽率计算
        </ElButton>
      </template>
    </Form>
    <!-- <div class="count_title"> 欢迎进入某某计算工具 </div>
    <Form :schema="schemaCount" ref="formCountRef" class="form-content" :labelPosition="'left'">
      <template #conversion>
        <ElButton
          :loading="exLoading"
          type="primary"
          @click="exportForm()"
          plain
          v-hasPermi="'system:dict:export'"
        >
          换算
        </ElButton>
      </template>
    </Form> -->
  </ContentWrap>
</template>
<style lang="less" scoped>
.count_title {
  text-align: center;
}
</style>
