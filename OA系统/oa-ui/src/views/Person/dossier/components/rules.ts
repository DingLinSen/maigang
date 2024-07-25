import { ref, unref, reactive, onMounted, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
const {
  required,
  notSpace,
  validateIPhone,
  validateEmail,
  validateIDcard,
  validateNumSearch,
  validateTextSearch
} = useValidator()

export const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  photo: [{ required: true, message: '请上传头像', trigger: 'blur' }],
  nation: [
    { required: true, message: '请输入民族', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' },
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
  maritalStatus: [
    { required: true, message: '请选择婚状况', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  height: [
    { message: '请输入身高（cm）', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持输入数字'),
      trigger: 'blur'
    }
  ],

  weight: [
    { message: '请输入体重', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持输入数字'),
      trigger: 'blur'
    }
  ],
  idcard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
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
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
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
  personalQq: [{ message: '请输入个人QQ', trigger: 'blur' }],
  personalWechat: [{ message: '请输入个人微信', trigger: 'blur' }],
  personalPhone: [
    { required: true, message: '请输入个人电话', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
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

  university: [
    { required: true, message: '请输入毕业院校', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  industry: [
    { required: true, message: '请输入专业', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  education: [
    { required: true, message: '请输入学历', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
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
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
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

  politicCountenance: [
    { required: true, message: '请选择政治面貌', trigger: 'blur' },
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
  vision: [{ message: '请输入视力', trigger: 'blur' }],
  hobbies: [
    { required: true, message: '请输入爱好特长', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  fileKeptLocation: [{ message: '请输入人事档案存放地', trigger: 'blur' }],
  liveAddress: [
    { required: true, message: '请输入现居住地址', trigger: 'blur' },
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
  // jobStatus: [{ message: '请选择工作状态', trigger: 'blur' }],
  initiationTime: [
    { required: true, message: '请输入入职时间', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  otherInformation: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  referencePhone: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
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
  eeno: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  skillName: [
    { required: true, message: '请输入技能名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

export const integratedSkillDOListRules = reactive({
  skillName: [
    { required: true, message: '请输入技能名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  skillLevel: [
    { message: '请输入技能级别', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  issuingAuthority: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

export const tjobExperienceDOListRules = reactive({
  workUnit: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  positionAndResponsibilities: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  salary: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  reference: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  referencePhone: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
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
  ]
})

export const infoBonuspenaltyDOListRules = reactive({
  title: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  rewardsPunishmentsUnit: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

export const thealthInformationDOListRules = reactive({
  healthYear: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  healthCondition: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

export const teducationExperienceDOListRules = reactive({
  academy: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  industry: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  education: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  rewardAndPunishment: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})
