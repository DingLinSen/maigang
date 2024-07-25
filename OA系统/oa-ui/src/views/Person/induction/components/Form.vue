<script setup lang="ts">
import { ElButton, ElMessage, ElForm, ElFormItem, ElDatePicker } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { ContentWrap } from '@/components/ContentWrap'
import { ref, reactive, nextTick, computed } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { getPersonalApi } from '@/api/person/dossier'
import {
  saveInductionApi,
  updateInductionApi,
  getInductionApi,
  getProvinceApi,
  getCityApi,
  getDistrictApi,
  updateStatusApi
} from '@/api/person/induction'
import moment from 'moment'
import {
  sexSelectData,
  withParentsLiveSelectData,
  maritalStatusSelectData,
  politicCountenanceSelectData
} from './Form'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
const { wsCache } = useCache()
const {
  notSpace,
  validateIPhone,
  validateEmail,
  validateIDcard,
  validateNumSearch,
  validateTextSearch
} = useValidator()

const provinceData = ref([])
const cityData = ref([])
const districtData = ref([])
const ruleForm = ref<any>({
  address: '',
  applyPost: '',
  belief: '',
  birth: '',
  city: '',
  cityName: '',
  createBy: 0,
  createTime: '',
  delStatus: '',
  deptId: 0,
  deptName: '',
  district: '',
  districtName: '',
  eeno: '',
  email: '',
  emergencyContactPerson: '',
  emergencyContactPhone: '',
  encodeFlag: 0,
  family: '',
  healthCondition: '',
  hobbies: '',
  id: 0,
  idcard: '',
  integratedSkill: '',
  liveAddress: '',
  maritalStatus: '',
  mobile: '',
  name: '',
  nation: '',
  parentsPhone: '',
  personalEmail: '',
  personalPhone: '',
  politicCountenance: '',
  province: '',
  provinceName: '',
  role: '',
  roleFlag: '',
  salaryExpectation: '',
  sex: '',
  sexName: '',
  status: 0,
  updateBy: 0,
  updateTime: '',
  userId: 0,
  withParentsLive: '',
  withParentsLiveName: ''
})

const getList = async () => {
  var inductionData = {
    data: null
  }

  try {
    let res = await getPersonalApi({ userId: wsCache.get('userInfo').userId })
    if (res.data) {
      ruleForm.value = res.data
    } else {
      ruleForm.value = {}
    }
  } catch (err) {
    ruleForm.value = {}
  }

  let res = await getProvinceApi()
  if (res) {
    provinceData.value = res.data
  }

  if (ruleForm.value.id) {
    inductionData = await getInductionApi({ id: ruleForm.value.id })
    ruleForm.value = inductionData.data

    if (
      inductionData.data?.province == 110000 ||
      inductionData.data?.province == 120000 ||
      inductionData.data?.province == 500000 ||
      inductionData.data?.province == 310000
    ) {
      cityData.value = []
      ruleForm.value.city = ''
      setFormHidden.value = false
      let districtArr: any = provinceData.value.filter((v) => {
        return inductionData.data?.province == v.code
      })
      let districtRes = await getDistrictApi(districtArr[0].id)
      districtData.value = districtRes.data
    } else {
      let cityArr: any = provinceData.value.filter((v) => {
        return inductionData.data?.province == v.code
      })
      let cityRes = await getCityApi(cityArr[0].id)
      cityData.value = cityRes.data

      let districtArr: any = cityData.value.filter((v) => {
        return inductionData.data?.city == v.code
      })
      let districtRes = await getDistrictApi(districtArr[0].id)
      districtData.value = districtRes.data
    }
  } else {
    ruleForm.value.name = wsCache.get('userInfo').nickName
  }
}

getList()

const formRef = ref<any>()
const sureLoading = ref<boolean>(false)
const closeLoading = ref<boolean>(false)
const zancunLoading = ref<boolean>(false)

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  nation: [
    { required: true, message: '请输入民族', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateTextSearch(value, callback, '仅支持输入汉字'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  maritalStatus: [
    { required: true, message: '请选择婚姻状况', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  birth: [
    { required: true, message: '请选择出生日期', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  idcard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateIDcard(value, callback, '请输入正确的身份证号')
        } else {
          callback()
        }
      }
    }
  ],
  personalEmail: [
    { required: true, message: '请输入个人邮箱', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateEmail(value, callback, '请输入正确的邮箱号码')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  personalPhone: [
    { required: true, message: '请输入个人电话', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateIPhone(value, callback, '请输入正确的手机号')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  politicCountenance: [{ required: true, message: '请选择政治面貌', trigger: 'blur' }],
  family: [
    { required: true, message: '请输入家庭情况', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  emergencyContactPerson: [
    { required: true, message: '请输入紧急联系人', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  emergencyContactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateIPhone(value, callback, '请输入正确的手机号')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  withParentsLive: [{ required: true, message: '请选择是否与父母同住', trigger: 'blur' }],
  parentsPhone: [
    { required: true, message: '请输入父亲(或母亲)电话', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateIPhone(value, callback, '请输入正确的手机号')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  healthCondition: [
    { required: true, message: '请输入健康情况', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  hobbies: [
    { required: true, message: '请输入爱好特长', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  integratedSkill: [
    { required: true, message: '请输入综合技能', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  belief: [
    { required: true, message: '请输入个人信仰', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  liveAddress: [
    { required: true, message: '请输入现居住地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],

  province: [
    { required: true, message: '请选择籍贯所属省份', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  city: [
    { required: true, message: '请选择籍贯所属城市', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  district: [
    { required: true, message: '请选择籍贯所属地区', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  address: [
    { required: true, message: '请输入籍贯详细地址', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],

  applyPost: [
    { required: true, message: '请输入申请岗位', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  salaryExpectation: [
    { required: true, message: '请输入期望薪资', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持输入正整数'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const setFormHidden = ref(true)

const provinceChange = async (e) => {
  let value = ''
  ruleForm.value.city = null
  ruleForm.value.district = null
  if (e == 110000 || e == 120000 || e == 500000 || e == 310000) {
    setFormHidden.value = false
    ruleForm.value.city = ''
    provinceData.value.forEach((v) => {
      if (v.code === e) {
        value = v.id
      }
    })

    let res = await getDistrictApi(value)
    districtData.value = res.data
  } else {
    setFormHidden.value = true
    provinceData.value.forEach((v) => {
      if (v.code === e) {
        value = v.id
      }
    })
    let res = await getCityApi(value)
    districtData.value = []
    cityData.value = res.data
  }
}

const cityChange = async (e) => {
  let value = ''
  ruleForm.value.district = ''
  cityData.value.forEach((v) => {
    if (v.code === e) {
      value = v.id
    }
  })
  let res = await getDistrictApi(value)
  districtData.value = res.data
}

// 保存
const submitEvolve = async (type) => {
  if (!formRef.value) {
    return
  }
  await formRef.value?.validate(async (valid: any) => {
    if (valid) {
      // if (type >= 2) {
      sureLoading.value = true
      // } else if (type == 0) {
      closeLoading.value = true
      // } else if (type == 1) {
      zancunLoading.value = true
      // }

      ruleForm.value.birth = moment(ruleForm.value.birth).format('YYYY-MM-DD')
      ruleForm.value.userId = wsCache.get('userInfo').userId
      ruleForm.value.status = type
      if (ruleForm.value.id) {
        // 更新
        if (type) {
          const res = await updateInductionApi(ruleForm.value)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                sureLoading.value = false
                closeLoading.value = false
                zancunLoading.value = false
              }, 300)
            })
          if (res) {
            if (type === 2) {
              ElMessage.success('提交成功')
            } else if (type === 1) {
              ElMessage.success('暂存成功')
            }
            getList()
          }
        } else {
          const res = await updateStatusApi(ruleForm.value.id, ruleForm.value.status)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                sureLoading.value = false
                zancunLoading.value = false
                closeLoading.value = false
              }, 200)
            })
          if (res) {
            ElMessage.success('取消成功')
            getList()
          }
        }
      } else {
        // 新增
        const res = await saveInductionApi(ruleForm.value)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              sureLoading.value = false
              zancunLoading.value = false
              closeLoading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('新增成功')
          getList()
        }
      }
    } else {
      ElMessage.error('存在未填写的信息或信息格式不正确，请填写规范后再进行提交操作！')
    }
  })
}
const appStore = useAppStore()

//监听窗口高度变化
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      restFormHeight()
    }
  }
})

const formHeight = ref<string>('auto')
const restFormHeight = () => {
  setTimeout(() => {
    nextTick()
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout-content-scrollbar')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    let paddingH = 120
    const drawerBody = document.querySelector('.content-class')
    if (drawerBody) {
      let computedStyle = getComputedStyle(drawerBody, null)
      if (computedStyle) {
        paddingH = parseFloat(computedStyle.getPropertyValue('margin-top'))
        paddingH = paddingH + parseFloat(computedStyle.getPropertyValue('margin-bottom'))
      }
    }

    const appContent = document.getElementById('app-content')
    if (appContent) {
      let computedStyle = getComputedStyle(appContent, null)
      if (computedStyle) {
        paddingH = paddingH + parseFloat(computedStyle.getPropertyValue('padding-top'))
      }
    }
    formHeight.value = layoutContentH - paddingH - 10 + 'px'
  }, 500)
}
restFormHeight()
</script>

<template>
  <ContentWrap :isShowtitle="false" class="relative" id="induction-form">
    <div class="induction-title">入职申请</div>
    <div :style="{ height: formHeight }" class="content-class px-[5%] 2xl:px-[10%]">
      <div class="induction-main">
        <h3 class="mb-4 dossier-main-title">个人信息</h3>
        <el-form
          :model="ruleForm"
          :rules="rules"
          :disabled="ruleForm.status > 1 && ruleForm.status !== 4"
          ref="formRef"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="name">
                <el-Input
                  :disabled="true"
                  v-model="ruleForm.name"
                  maxlength="20"
                  placeholder="请输入姓名"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="民族" prop="nation">
                <el-Input v-model="ruleForm.nation" maxlength="20" placeholder="请输入民族" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="sex">
                <el-select
                  v-model="ruleForm.sex"
                  class="w-full"
                  maxlength="100"
                  placeholder="请选择性别"
                >
                  <el-option
                    v-for="item in sexSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="婚姻状况" prop="maritalStatus">
                <el-select
                  v-model="ruleForm.maritalStatus"
                  class="w-full"
                  maxlength="100"
                  placeholder="请选择婚姻状况"
                >
                  <el-option
                    v-for="item in maritalStatusSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期" prop="birth">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  class="date-picker"
                  v-model="ruleForm.birth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证号" prop="idcard">
                <el-Input v-model="ruleForm.idcard" maxlength="18" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="个人邮箱" prop="personalEmail">
                <el-Input
                  v-model="ruleForm.personalEmail"
                  maxlength="50"
                  placeholder="请输入个人邮箱"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="个人电话" prop="personalPhone">
                <el-Input
                  v-model="ruleForm.personalPhone"
                  maxlength="11"
                  placeholder="请输入个人电话"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政治面貌" prop="politicCountenance">
                <el-select
                  v-model="ruleForm.politicCountenance"
                  class="w-full"
                  maxlength="100"
                  placeholder="请选择政治面貌"
                >
                  <el-option
                    v-for="item in politicCountenanceSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="家庭情况" prop="family">
                <el-Input v-model="ruleForm.family" maxlength="100" placeholder="请输入家庭情况" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="紧急联系人" prop="emergencyContactPerson">
                <el-Input
                  v-model="ruleForm.emergencyContactPerson"
                  maxlength="20"
                  placeholder="请输入紧急联系人"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="emergencyContactPhone">
                <el-Input
                  v-model="ruleForm.emergencyContactPhone"
                  maxlength="11"
                  placeholder="请输入联系电话"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否与父母同住" prop="withParentsLive">
                <el-select
                  v-model="ruleForm.withParentsLive"
                  class="w-full"
                  maxlength="100"
                  placeholder="请选择是否与父母同住"
                >
                  <el-option
                    v-for="item in withParentsLiveSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="父亲（或母亲）电话" prop="parentsPhone">
                <el-Input
                  v-model="ruleForm.parentsPhone"
                  maxlength="11"
                  placeholder="请输入父亲（或母亲）电话"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="健康状况" prop="healthCondition">
                <el-Input
                  v-model="ruleForm.healthCondition"
                  maxlength="200"
                  placeholder="请输入健康状况"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="爱好特长" prop="hobbies">
                <el-Input v-model="ruleForm.hobbies" maxlength="200" placeholder="请输入爱好特长" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="综合技能" prop="integratedSkill">
                <el-Input
                  v-model="ruleForm.integratedSkill"
                  maxlength="200"
                  placeholder="请输入综合技能"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="个人信仰" prop="belief">
                <el-Input v-model="ruleForm.belief" maxlength="200" placeholder="请输入个人信仰" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="现居住地址" prop="liveAddress">
                <el-Input
                  v-model="ruleForm.liveAddress"
                  maxlength="200"
                  placeholder="请输入现居住地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="籍贯详细地址" prop="address">
                <el-Input
                  v-model="ruleForm.address"
                  maxlength="200"
                  placeholder="请输入籍贯详细地址"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-form-item label="籍贯所属省份" prop="province">
                <el-select
                  v-model="ruleForm.province"
                  class="w-full"
                  filterable
                  maxlength="100"
                  placeholder="请选择籍贯所属省份"
                  @change="provinceChange"
                >
                  <el-option
                    v-for="item in provinceData"
                    :key="item.code"
                    :label="item.province"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" v-if="setFormHidden">
              <el-form-item label="籍贯所属城市" prop="city">
                <el-select
                  v-model="ruleForm.city"
                  class="w-full"
                  filterable
                  maxlength="100"
                  placeholder="请选择籍贯所属城市"
                  @change="cityChange"
                >
                  <el-option
                    v-for="item in cityData"
                    :key="item.code"
                    :label="item.city"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="籍贯所属地区" prop="district">
                <el-select
                  v-model="ruleForm.district"
                  class="w-full"
                  filterable
                  maxlength="100"
                  placeholder="请选择籍贯所属地区"
                  @change="districtChange"
                >
                  <el-option
                    v-for="item in districtData"
                    :key="item.code"
                    :label="item.district"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <h3 class="mb-4 mt-10 dossier-main-title">岗位信息</h3>
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请岗位" prop="applyPost">
                <el-Input
                  v-model="ruleForm.applyPost"
                  maxlength="30"
                  placeholder="请输入申请岗位"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="期望薪资（元）" prop="salaryExpectation">
                <el-Input
                  v-model="ruleForm.salaryExpectation"
                  maxlength="6"
                  placeholder="请输入期望薪资"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div
      class="flex justify-end items-center mt-6 fixed w-[90%] bottom-[10px] h-[60px] bg-[#fff] pr-[10%]"
    >
      <ElButton
        type="primary"
        v-if="
          (ruleForm.status !== 2 && ruleForm.status < 3) ||
          ruleForm.status === 4 ||
          !ruleForm.status
        "
        :loading="sureLoading"
        :disabled="sureLoading"
        v-hasPermi="'person:induction:edit'"
        @click="submitEvolve(2)"
      >
        提交
      </ElButton>
      <ElButton
        v-if="ruleForm.status == 2"
        :loading="closeLoading"
        :disabled="closeLoading"
        v-hasPermi="'person:induction:edit'"
        @click="submitEvolve(0)"
        >取消</ElButton
      >
      <ElButton
        v-if="!ruleForm.status || ruleForm.status === 1 || ruleForm.status === 4"
        :loading="zancunLoading"
        :disabled="zancunLoading"
        v-hasPermi="'person:induction:edit'"
        @click="submitEvolve(1)"
        >暂存</ElButton
      ></div
    >
  </ContentWrap>
</template>
<style lang="less">
.date-picker,
.date-picker .el-input__wrapper {
  width: 100% !important;
}

.demo-ruleForm .el-form-item__label {
  //   margin-bottom: 5px !important;
}

#induction-form {
  background: #f9f9f9;
  .el-card__body {
    // position: relative;
    background: #f9f9f9;
    padding: 0 !important;
  }
}
.dossier-main-title {
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
.induction-title {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 54px;
  border-bottom: 1px solid #eef0f2;
  background: #fff;
  color: #333333;
  font-size: 16px;
  line-height: 54px;
  font-weight: 500;
  padding: 0 1.04vw;
}
.induction-main {
  padding: 18px 0.9375vw 40px;
  // width: 80%;
  // margin: 0px 10% 0px 10%;
  background: #ffffff;
}
.content-class {
  margin-top: 72px;
  margin-bottom: 80px;
  width: 100%;
  // padding: 0px 10% 0px 10%;
  overflow: auto;
}
</style>
