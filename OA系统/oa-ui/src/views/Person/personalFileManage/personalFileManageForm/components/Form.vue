<template>
  <div :style="{ height: formHeight }" class="relative">
    <div id="person-form" :class="props.type !== 'see' ? 'person-form-edit' : 'person-form-see'">
      <div class="dossier-main 2xl:w-[80%]">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="formRef"
          class="demo-ruleForm"
          label-position="top"
          :disabled="props.type !== 'edit' && props.type !== 'contract'"
        >
          <h3 class="mb-4 dossier-main-title">个人档案</h3>
          <el-row class="mb-4">
            <el-col :span="3">
              <headSculpture v-model="ruleForm.photo" :disabled="props.type !== 'edit'" />
            </el-col>
            <el-col :span="5" class="mt-4">
              <el-form-item label="姓名" prop="name">
                <el-Input
                  maxlength="20"
                  :disabled="true"
                  placeholder="请输入姓名"
                  v-model="ruleForm.name"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="mt-4">
              <el-form-item label="民族" prop="nation">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="20"
                  placeholder="请输入民族"
                  v-model="ruleForm.nation"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="mt-4">
              <el-form-item label="性别" prop="sex">
                <el-select
                  :disabled="props.type === 'contract'"
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
              <el-form-item label="出生日期" prop="birth">
                <el-date-picker
                  type="date"
                  :disabled="props.type === 'contract'"
                  placeholder="选择出生日期"
                  class="date-picker"
                  v-model="ruleForm.birth"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况" prop="maritalStatus">
                <el-select
                  :disabled="props.type === 'contract'"
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
              <el-form-item label="身份证号" prop="idcard">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="18"
                  placeholder="请输入身份证号"
                  v-model="ruleForm.idcard"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="个人电话" prop="personalPhone">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="11"
                  placeholder="请输入个人电话"
                  v-model="ruleForm.personalPhone"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :disabled="props.type === 'contract'"
                label="个人邮箱"
                prop="personalEmail"
              >
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="50"
                  placeholder="请输入个人邮箱"
                  v-model="ruleForm.personalEmail"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="政治面貌" prop="politicCountenance">
                <el-select
                  :disabled="props.type === 'contract'"
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
              <el-form-item label="毕业院校" prop="university">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="20"
                  placeholder="请输入毕业院校"
                  v-model="ruleForm.university"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专业" prop="industry">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="20"
                  placeholder="请输入专业"
                  v-model="ruleForm.industry"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学历" prop="education">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="5"
                  placeholder="请输入学历"
                  v-model="ruleForm.education"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="现居住地址" prop="liveAddress">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="200"
                  placeholder="请输入现居住地址"
                  v-model="ruleForm.liveAddress"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="籍贯详细地址" prop="address">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="200"
                  placeholder="请输入籍贯详细地址"
                  v-model="ruleForm.address"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="家庭情况" prop="family">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="100"
                  placeholder="请输入家庭情况"
                  v-model="ruleForm.family"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="紧急联系人" prop="emergencyContactPerson">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="20"
                  placeholder="请输入紧急联系人"
                  v-model="ruleForm.emergencyContactPerson"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="emergencyContactPhone">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="11"
                  placeholder="请输入联系电话"
                  v-model="ruleForm.emergencyContactPhone"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="mt-8">
            <el-col :span="8">
              <el-form-item label="体重（kg）" prop="weight">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="3"
                  placeholder="请输入体重（kg）"
                  v-model="ruleForm.weight"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身高（cm）" prop="height">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="3"
                  placeholder="请输入身高（cm）"
                  v-model="ruleForm.height"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="个人QQ" prop="personalQq">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="15"
                  placeholder="请输入个人QQ"
                  v-model="ruleForm.personalQq"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="个人微信" prop="personalWechat">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="20"
                  placeholder="请输入个人微信"
                  v-model="ruleForm.personalWechat"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="个人信仰" prop="belief">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="200"
                  placeholder="请输入个人信仰"
                  v-model="ruleForm.belief"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="人事档案存放地" prop="fileKeptLocation">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="100"
                  placeholder="请输入人事档案存放地"
                  v-model="ruleForm.fileKeptLocation"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="pb-8 border-b-1">
            <el-col :span="8">
              <el-form-item label="视力" prop="vision">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="4"
                  placeholder="请输入视力"
                  v-model="ruleForm.vision"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="爱好特长" prop="hobbies">
                <el-Input
                  :disabled="props.type === 'contract'"
                  maxlength="200"
                  placeholder="请输入爱好特长"
                  v-model="ruleForm.hobbies"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <h3 class="mb-4 mt-10 dossier-main-title">岗位信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工作状态" prop="jobStatus">
                <el-select
                  v-model="ruleForm.jobStatus"
                  :disabled="props.type === 'contract'"
                  class="w-full"
                  maxlength="100"
                  placeholder="请选择工作状态"
                >
                  <el-option
                    v-for="item in jobStatusSelectData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入职时间" prop="initiationTime">
                <el-date-picker
                  :disabled="props.type === 'contract'"
                  type="date"
                  placeholder="请选择入职时间"
                  class="date-picker"
                  v-model="ruleForm.initiationTime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工号" prop="eeno">
                <el-Input
                  maxlength="10"
                  :disabled="true"
                  placeholder="请输入工号"
                  v-model="ruleForm.eeno"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="props.type !== 'examine' || ruleForm.correctionTime">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  type="date"
                  :disabled="props.type === 'contract'"
                  placeholder="请选择转正时间"
                  class="date-picker"
                  v-model="ruleForm.correctionTime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="props.type !== 'examine' || ruleForm.correctionTime">
              <el-form-item label="合同到期时间" prop="contractExpirationTime">
                <el-date-picker
                  type="date"
                  :disabled="props.type !== 'contract' && props.type !== 'edit'"
                  placeholder="请选择合同到期时间"
                  class="date-picker"
                  v-model="ruleForm.contractExpirationTime"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="其他资料" prop="otherInformation">
                <el-Input
                  placeholder="请输入其他资料"
                  :disabled="props.type === 'contract'"
                  type="textarea"
                  maxlength="200"
                  rows="4"
                  v-model="ruleForm.otherInformation"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- v-hasPermi="'person:personalFileManage:examine'" -->
          <el-form :disabled="!isAuth('person:personalFileManage:edit')">
            <addForm
              :title="'综合技能'"
              v-model="integratedSkillDOList"
              :arrlist="{
                skillName: '',
                skillLevel: '',
                issuingAuthority: '',
                getTime: '',
                filePath: '',
                fileName: ''
              }"
            >
              <template #content="{ item, index }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="true"
                  :rules="integratedSkillDOListRules"
                >
                  <el-row>
                    <el-col :span="5">
                      <el-form-item
                        label="技能名称（没有此处填无）"
                        prop="skillName"
                        :rules="[{ required: true, message: '请输入技能名称', trigger: 'blur' }]"
                      >
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入技能名称"
                          v-model="item.skillName"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="技能级别" prop="skillLevel">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="10"
                          placeholder="请输入技能级别"
                          v-model="item.skillLevel"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="颁发机构" prop="issuingAuthority">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入颁发机构"
                          v-model="item.issuingAuthority"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="获取时间" prop="getTime">
                        <el-date-picker
                          :disabled="props.type === 'contract'"
                          type="date"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.getTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="证书（支持pdf和word格式）" prop="filePath">
                        <uploadFlie
                          :showUpload="false"
                          :disabled="props.type === 'contract'"
                          v-model="item.filePath"
                          v-model:fileName="item.fileName"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <addForm
              :title="'工作经历（公司内部）'"
              v-model="tjobExperienceDOListn"
              :arrlist="{
                startingTime: '',
                endingTime: '',
                dept: '',
                positionAndResponsibilities: '',
                salary: '',
                workUnit: '',
                reference: '',
                referencePhone: '',
                outOrInExperience: 0
              }"
            >
              <template #content="{ item, index }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="props.type !== 'edit'"
                  :rules="tjobExperienceDOListRules"
                >
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="起始时间" prop="startingTime">
                        <el-date-picker
                          type="date"
                          :disabled="props.type === 'contract'"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.startingTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="终止时间" prop="endingTime">
                        <el-date-picker
                          type="date"
                          :disabled="props.type === 'contract'"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.endingTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="部门" prop="dept">
                        <el-select v-model="item.dept" class="w-full" placeholder="请选择部门">
                          <el-option
                            v-for="i in deptList"
                            :key="i.deptId"
                            :label="i.deptName"
                            :value="i.deptId"
                          />
                        </el-select>
                        <!-- <el-Input maxlength="50" placeholder="请选择部门" v-model="item.workUnit" /> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="岗位" prop="positionAndResponsibilities">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="100"
                          placeholder="请输入岗位"
                          v-model="item.positionAndResponsibilities"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="月薪（元）" prop="salary">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="10"
                          placeholder="请输入月薪"
                          v-model="item.salary"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="直接上级负责人" prop="reference">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="10"
                          placeholder="请输入上级负责人"
                          v-model="item.reference"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <addForm
              :title="'奖惩经历（公司内部）'"
              v-model="infoBonuspenaltyDOListn"
              :arrlist="{
                pubTime: '',
                title: '',
                rewardsPunishmentsUnit: '',
                filePath: '',
                fileName: '',
                flag: 1
              }"
            >
              <template #content="{ item, index }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="true"
                  :rules="infoBonuspenaltyDOListRules"
                >
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="奖惩时间" prop="pubTime">
                        <el-date-picker
                          type="date"
                          :disabled="props.type === 'contract'"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.pubTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label="奖惩内容" prop="title">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入奖惩内容"
                          v-model="item.title"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="奖惩单位" prop="rewardsPunishmentsUnit">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入奖惩单位"
                          v-model="item.rewardsPunishmentsUnit"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="奖惩文件或来源（支持pdf和word格式）" prop="filePath">
                        <uploadFlie
                          :disabled="props.type === 'contract'"
                          v-model="item.filePath"
                          v-model:fileName="item.fileName"
                          :showUpload="false"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <addForm
              :title="'健康状况'"
              v-model="thealthInformationDOList"
              :arrlist="{
                healthYear: '',
                healthCondition: ''
              }"
            >
              <template #content="{ item, index }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="props.type !== 'edit'"
                  :rules="thealthInformationDOListRules"
                >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="体检年份" prop="healthYear">
                        <el-date-picker
                          type="year"
                          :disabled="props.type === 'contract'"
                          placeholder="请选择体检年份"
                          class="date-picker"
                          v-model="item.healthYear"
                        />
                        <!-- <el-Input maxlength="10" placeholder="请输入体检年份" v-model="item.healthYear" /> -->
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="体检结果" prop="healthCondition">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入体检结果"
                          v-model="item.healthCondition"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <addForm
              :title="'教育经历（不含高中）'"
              v-model="teducationExperienceDOList"
              :arrlist="{
                startingTime: '',
                endingTime: '',
                academy: '',
                industry: '',
                education: '',
                rewardAndPunishment: '',
                seniorHignSchool: 0
              }"
            >
              <template #content="{ item, index }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="true"
                  :rules="teducationExperienceDOListRules"
                >
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="起始时间" prop="startingTime">
                        <el-date-picker
                          :disabled="props.type === 'contract'"
                          type="date"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.startingTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="终止时间" prop="endingTime">
                        <el-date-picker
                          :disabled="props.type === 'contract'"
                          type="date"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.endingTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="院校" prop="academy">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入院校"
                          v-model="item.academy"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="专业" prop="industry">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="20"
                          placeholder="请输入专业"
                          v-model="item.industry"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="学历" prop="education">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="20"
                          placeholder="请输入学历"
                          v-model="item.education"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="证明（支持pdf和word格式）" prop="filePath">
                        <uploadFlie
                          v-model="item.filePath"
                          v-model:fileName="item.fileName"
                          :showUpload="false"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <addForm
              :title="'奖惩经历（教育经历）'"
              v-model="infoBonuspenaltyDOListj"
              :arrlist="{
                pubTime: '',
                title: '',
                rewardsPunishmentsUnit: '',
                filePath: '',
                fileName: '',
                flag: 2
              }"
            >
              <template #content="{ item, index }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="true"
                  :rules="infoBonuspenaltyDOListRules"
                >
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="奖惩时间" prop="pubTime">
                        <el-date-picker
                          type="date"
                          :disabled="props.type === 'contract'"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.pubTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label="奖惩内容" prop="title">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入奖惩内容"
                          v-model="item.title"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="奖惩单位" prop="rewardsPunishmentsUnit">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入奖惩单位"
                          v-model="item.rewardsPunishmentsUnit"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="奖惩文件或来源（支持pdf和word格式）" prop="filePath">
                        <uploadFlie
                          :disabled="props.type === 'contract'"
                          v-model="item.filePath"
                          v-model:fileName="item.fileName"
                          :showUpload="false"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <addForm
              :title="'工作经历（公司外部）'"
              v-model="tjobExperienceDOListw"
              :arrlist="{
                startingTime: '',
                endingTime: '',
                workUnit: '',
                positionAndResponsibilities: '',
                salary: '',
                reference: '',
                referencePhone: '',
                outOrInExperience: 1
              }"
            >
              <template #content="{ item }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="true"
                  :rules="tjobExperienceDOListRules"
                >
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="起始时间" prop="startingTime">
                        <el-date-picker
                          :disabled="props.type === 'contract'"
                          type="date"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.startingTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="终止时间" prop="endingTime">
                        <el-date-picker
                          :disabled="props.type === 'contract'"
                          type="date"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.endingTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="工作单位" prop="workUnit">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入单位"
                          v-model="item.workUnit"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="岗位及职责" prop="positionAndResponsibilities">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="100"
                          placeholder="请输入岗位及职责"
                          v-model="item.positionAndResponsibilities"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="月薪（元）" prop="salary">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="20"
                          placeholder="请输入月薪"
                          v-model="item.salary"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="证明人" prop="reference">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="20"
                          placeholder="请输入证明人"
                          v-model="item.reference"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label="电话" prop="referencePhone">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="11"
                          placeholder="请输入电话"
                          v-model="item.referencePhone"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <addForm
              class="border-0"
              :title="'奖惩经历（公司外部）'"
              v-model="infoBonuspenaltyDOListw"
              :arrlist="{
                pubTime: '',
                title: '',
                rewardsPunishmentsUnit: '',
                filePath: '',
                fileName: '',
                flag: 0
              }"
            >
              <template #content="{ item, index }">
                <el-form
                  :model="item"
                  :ref="(el) => (item.el = el)"
                  :disabled="true"
                  :rules="infoBonuspenaltyDOListRules"
                >
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="奖惩时间" prop="pubTime">
                        <el-date-picker
                          :disabled="props.type === 'contract'"
                          type="date"
                          placeholder="选择时间"
                          class="date-picker"
                          v-model="item.pubTime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="9">
                      <el-form-item label="奖惩内容" prop="title">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入奖惩内容"
                          v-model="item.title"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="奖惩单位" prop="rewardsPunishmentsUnit">
                        <el-Input
                          :disabled="props.type === 'contract'"
                          maxlength="50"
                          placeholder="请输入奖惩单位"
                          v-model="item.rewardsPunishmentsUnit"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item label="奖惩文件或来源（支持pdf和word格式）" prop="filePath">
                        <uploadFlie
                          :disabled="props.type === 'contract'"
                          v-model="item.filePath"
                          v-model:fileName="item.fileName"
                          :showUpload="false"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </template>
            </addForm>

            <div class="mt-[36px]">
              <pdfFlieUPload
                v-if="
                  props.type !== 'examine' || (props.type == 'examine' && ruleForm.employeePathSub)
                "
                :title="'劳动合同文件上传'"
                @open-file-preview="previewFile"
                v-model="ruleForm.employeePathSub"
                v-model:fileName="ruleForm.employeeNameSub"
              />

              <pdfFlieUPload
                v-if="
                  props.type !== 'examine' || (props.type == 'examine' && ruleForm.idcardPathSub)
                "
                :title="'身份证文件上传'"
                @open-file-preview="previewFile"
                v-model="ruleForm.idcardPathSub"
                v-model:fileName="ruleForm.idcardNameSub"
              />

              <pdfFlieUPload
                v-if="
                  props.type !== 'examine' || (props.type == 'examine' && ruleForm.educationPathSub)
                "
                :title="'学历证书文件上传'"
                @open-file-preview="previewFile"
                v-model="ruleForm.educationPathSub"
                v-model:fileName="ruleForm.educationNameSub"
              />

              <pdfFlieUPload
                class="other-pdf-flie"
                v-if="
                  props.type !== 'examine' || (props.type == 'examine' && ruleForm.otherPathSub)
                "
                :title="'其他文件上传'"
                @open-file-preview="previewFile"
                v-model="ruleForm.otherPathSub"
                v-model:fileName="ruleForm.otherNameSub"
              />
            </div>
          </el-form>
        </el-form>
      </div>
    </div>
    <div
      v-if="props.type !== 'see'"
      class="flex justify-end items-center absolute w-full bottom-[0px] left-0 h-60px bg-[#fff] pr-[12vw]"
    >
      <ElButton
        type="primary"
        v-if="ruleForm.status === 2 && props.type === 'examine'"
        :loading="sureLoading"
        v-hasPermi="'person:personalFileManage:examine'"
        @click="submitEvolve(3)"
      >
        通过
      </ElButton>
      <ElButton
        type="primary"
        v-if="ruleForm.status === 2 && props.type === 'examine'"
        :loading="sureLoading"
        v-hasPermi="'person:personalFileManage:examine'"
        @click="submitEvolve(4)"
      >
        驳回
      </ElButton>
      <ElButton
        type="primary"
        v-if="props.type === 'edit' || props.type === 'contract'"
        :loading="sureLoading"
        @click="submitEvolve(2)"
      >
        确认修改
      </ElButton>
      <ElButton
        v-if="props.type === 'edit' || props.type === 'contract'"
        :loading="closeLoading"
        class="mr-6"
        @click="close"
        >取消修改</ElButton
      >
    </div>
  </div>
  <FilePreview title="预览" ref="FilePreviewRef" />
</template>
<script setup lang="ts">
import addForm from './addForm.vue'
import { useRouter } from 'vue-router'
import headSculpture from './headSculpture.vue'
import uploadFlie from './uploadFlie.vue'
import pdfFlieUPload from './pdfFlieUPload.vue'
import { putExpireListApi } from '@/api/person/expirationReminder'
import { ElMessage } from 'element-plus'
import { getdeptListApi } from '@/api/user'
import { ref, inject, watch, onMounted, provide, computed, nextTick } from 'vue'
import {
  rules,
  integratedSkillDOListRules,
  tjobExperienceDOListRules,
  infoBonuspenaltyDOListRules,
  teducationExperienceDOListRules,
  thealthInformationDOListRules
} from './rules'
import {
  saveInfoEmployeefileApi,
  updateInfoEmployeefileApi,
  updateStatusApi,
  getInfoEmployeefileApi
} from '@/api/person/dossier'
import moment from 'moment'

import {
  sexSelectData,
  maritalStatusSelectData,
  politicCountenanceSelectData,
  jobStatusSelectData
} from './Form'
import { useCache } from '@/hooks/web/useCache'
import { ElRow, ElCol, ElInput, ElButton } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { isAuth } from '@/utils/is'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { useEmitt } from '@/hooks/web/useEmitt'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  reminderId: {
    type: String,
    default: ''
  },
  timer: {
    type: String,
    default: ''
  }
})

const { wsCache } = useCache()
const { required, notSpace, validatePhoneNumber, validateEmail, validateIDcard } = useValidator()
const closeDrawer = inject<any>('closeDrawer')
const getList = inject<any>('getList')

const infoBonuspenaltyDOListn = ref<any>([])
const infoBonuspenaltyDOListj = ref<any>([])
const infoBonuspenaltyDOListw = ref<any>([])

const tjobExperienceDOListn = ref<any>([])
const tjobExperienceDOListw = ref<any>([])

const teducationExperienceDOList = ref<any>([])
const thealthInformationDOList = ref<any>([])
const integratedSkillDOList = ref<any>([])

const disabled = ref(false)
const ruleForm = ref<any>({})
const formRef = ref<any>()
const sureLoading = ref<boolean>(false)
const closeLoading = ref<boolean>(false)

const router = useRouter()

const deptList = ref()
const deptinit = async () => {
  let res = await getdeptListApi({ pageSize: 99999 })
  deptList.value = res.data
}

deptinit()
// 获取年月日
const getMonthLast = (timestamp: any) => {
  let date: any = timestamp ? timestamp : new Date()
  return moment(date).format('YYYY-MM-DD')
}
// 所有新增区域数组初始化

const otherinit = () => {
  if (Object.keys(ruleForm.value).length) {
    infoBonuspenaltyDOListn.value = ruleForm.value.infoBonuspenaltyDOList.filter((v) => {
      return v.flag === 1
    })
    infoBonuspenaltyDOListj.value = ruleForm.value.infoBonuspenaltyDOList.filter((v) => {
      return v.flag === 2
    })
    infoBonuspenaltyDOListw.value = ruleForm.value.infoBonuspenaltyDOList.filter((v) => {
      return v.flag === 0
    })

    tjobExperienceDOListn.value = ruleForm.value.tjobExperienceDOList.filter((v) => {
      return v.outOrInExperience === 0
    })
    tjobExperienceDOListw.value = ruleForm.value.tjobExperienceDOList.filter((v) => {
      return v.outOrInExperience === 1
    })

    teducationExperienceDOList.value = ruleForm.value.teducationExperienceDOList
    thealthInformationDOList.value = ruleForm.value.thealthInformationDOList
    integratedSkillDOList.value = ruleForm.value.integratedSkillDOList

    checkEmptyData()
  }
}

const getContent = async () => {
  var inductionData = {
    data: null
  }

  if (props.id) {
    inductionData = await getInfoEmployeefileApi(props.id)
    ruleForm.value = inductionData.data
    otherinit()
    // ruleForm.value.employeePathSub = ruleForm.value.employeePath ? ruleForm.value.employeePath : ''
    // ruleForm.value.idcardPathSub = ruleForm.value.idcardPath ? ruleForm.value.idcardPath : ''
    // ruleForm.value.educationPathSub = ruleForm.value.educationPath
    //   ? ruleForm.value.educationPath
    //   : ''
    // ruleForm.value.otherPathSub = ruleForm.value.otherPath ? ruleForm.value.otherPath : ''
    ruleForm.value.employeePathSub = ''
    ruleForm.value.idcardPathSub = ''
    ruleForm.value.educationPathSub = ''
    ruleForm.value.otherPathSub = ''
    if (ruleForm.value.files && ruleForm.value.files.length) {
      ruleForm.value.files.map((item: any) => {
        if (item.type == '1' && !ruleForm.value.employeePathSub.includes(item.fileUrl)) {
          ruleForm.value.employeePathSub = ruleForm.value.employeePathSub
            ? ruleForm.value.employeePathSub + ',' + item.fileUrl
            : item.fileUrl
        } else if (item.type == '2' && !ruleForm.value.idcardPathSub.includes(item.fileUrl)) {
          ruleForm.value.idcardPathSub = ruleForm.value.idcardPathSub
            ? ruleForm.value.idcardPathSub + ',' + item.fileUrl
            : item.fileUrl
        } else if (item.type == '3' && !ruleForm.value.educationPathSub.includes(item.fileUrl)) {
          ruleForm.value.educationPathSub = ruleForm.value.educationPathSub
            ? ruleForm.value.educationPathSub + ',' + item.fileUrl
            : item.fileUrl
        } else if (item.type == '4' && !ruleForm.value.otherPathSub.includes(item.fileUrl)) {
          ruleForm.value.otherPathSub = ruleForm.value.otherPathSub
            ? ruleForm.value.otherPathSub + ',' + item.fileUrl
            : item.fileUrl
        }
      })
    }
  }
}
const formHeight = ref<string>('auto')
const restFormHeight = () => {
  setTimeout(() => {
    nextTick()
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout-content-scrollbar')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    let drawerHeaderH = 0
    const drawerHeader = document.querySelector('.el-drawer__header')
    if (drawerHeader) {
      drawerHeaderH = drawerHeader.clientHeight
    }
    let paddingH = 20
    const drawerBody = document.querySelector('.el-drawer__body')
    if (drawerBody) {
      let computedStyle = getComputedStyle(drawerBody, null)
      if (computedStyle) {
        paddingH = parseFloat(computedStyle.getPropertyValue('padding-top'))
      }
    }
    const appContent = document.getElementById('app-content')
    if (appContent) {
      let computedStyle = getComputedStyle(appContent, null)
      if (computedStyle) {
        paddingH =  paddingH + parseFloat(computedStyle.getPropertyValue('padding-top'))
      }
    }
    formHeight.value = layoutContentH - drawerHeaderH - paddingH + 'px'
  }, 500)
}
watch(
  props,
  (value) => {
    getContent()
    restFormHeight()
  },
  { immediate: true }
)
var forbidden = computed(() => {
  return props.type !== 'edit'
})

provide('forbidden', forbidden)

// 保存
const submitEvolve = async (type) => {
  let res = []
  integratedSkillDOList.value.forEach((item, index) => {
    res.push(integratedSkillDOList.value[index].el.validate())
  })

  tjobExperienceDOListn.value.forEach((item, index) => {
    res.push(tjobExperienceDOListn.value[index].el.validate())
  })

  infoBonuspenaltyDOListn.value.forEach((item, index) => {
    res.push(infoBonuspenaltyDOListn.value[index].el.validate())
  })

  thealthInformationDOList.value.forEach((item, index) => {
    res.push(thealthInformationDOList.value[index].el.validate())
  })

  teducationExperienceDOList.value.forEach((item, index) => {
    res.push(teducationExperienceDOList.value[index].el.validate())
  })

  infoBonuspenaltyDOListj.value.forEach((item, index) => {
    res.push(infoBonuspenaltyDOListj.value[index].el.validate())
  })

  tjobExperienceDOListw.value.forEach((item, index) => {
    res.push(tjobExperienceDOListw.value[index].el.validate())
  })

  infoBonuspenaltyDOListw.value.forEach((item, index) => {
    res.push(infoBonuspenaltyDOListw.value[index].el.validate())
  })

  res.push(formRef.value?.validate())

  Promise.all(res)
    .then(async () => {
      if (type >= 2) {
        sureLoading.value = true
      } else {
        closeLoading.value = true
      }
      checkEmptyData()

      ruleForm.value.status = type
      ruleForm.value.teducationExperienceDOList = teducationExperienceDOList.value
      ruleForm.value.thealthInformationDOList = thealthInformationDOList.value
      ruleForm.value.integratedSkillDOList = integratedSkillDOList.value

      ruleForm.value.birth = ruleForm.value.birth
        ? moment(getMonthLast(ruleForm.value.birth)).format('YYYY-MM-DD')
        : ''
      ruleForm.value.initiationTime = ruleForm.value.initiationTime
        ? moment(getMonthLast(ruleForm.value.initiationTime)).format('YYYY-MM-DD')
        : ''
      ruleForm.value.correctionTime = ruleForm.value.correctionTime
        ? moment(getMonthLast(ruleForm.value.correctionTime)).format('YYYY-MM-DD')
        : ''
      ruleForm.value.contractExpirationTime = ruleForm.value.contractExpirationTime
        ? moment(getMonthLast(ruleForm.value.contractExpirationTime)).format('YYYY-MM-DD')
        : ''

      ruleForm.value.infoBonuspenaltyDOList = [
        ...infoBonuspenaltyDOListn.value,
        ...infoBonuspenaltyDOListj.value,
        ...infoBonuspenaltyDOListw.value
      ]
      ruleForm.value.tjobExperienceDOList = [
        ...tjobExperienceDOListn.value,
        ...tjobExperienceDOListw.value
      ]

      if (ruleForm.value.thealthInformationDOList) {
        ruleForm.value.thealthInformationDOList.forEach((item) => {
          item.healthYear = item.healthYear ? moment(getMonthLast(item.pubTime)).format('YYYY') : ''
        })
      }

      if (ruleForm.value.infoBonuspenaltyDOList) {
        ruleForm.value.infoBonuspenaltyDOList.forEach((item) => {
          item.pubTime = item.pubTime ? moment(getMonthLast(item.pubTime)).format('YYYY-MM-DD') : ''
        })
      }

      if (ruleForm.value.tjobExperienceDOList) {
        ruleForm.value.tjobExperienceDOList.forEach((item) => {
          item.startingTime = item.startingTime
            ? moment(getMonthLast(item.startingTime)).format('YYYY-MM-DD')
            : ''
          item.endingTime = item.endingTime
            ? moment(getMonthLast(item.endingTime)).format('YYYY-MM-DD')
            : ''
        })
      }

      if (ruleForm.value.integratedSkillDOList) {
        ruleForm.value.integratedSkillDOList.forEach((item) => {
          item.getTime = item.getTime ? moment(getMonthLast(item.getTime)).format('YYYY-MM-DD') : ''
        })
      }

      if (ruleForm.value.teducationExperienceDOList) {
        ruleForm.value.teducationExperienceDOList.forEach((item) => {
          item.startingTime = item.startingTime
            ? moment(getMonthLast(item.startingTime)).format('YYYY-MM-DD')
            : ''
          item.endingTime = item.endingTime
            ? moment(getMonthLast(item.endingTime)).format('YYYY-MM-DD')
            : ''
        })
      }

      let files: any = []
      if (ruleForm.value.employeePathSub) {
        let employ = ruleForm.value.employeePathSub.split(',')
        employ.map((item: any) => {
          files.push({ fileUrl: item, type: '1' })
        })
      }
      if (ruleForm.value.idcardPathSub) {
        let employ = ruleForm.value.idcardPathSub.split(',')
        employ.map((item: any) => {
          files.push({ fileUrl: item, type: '2' })
        })
      }
      if (ruleForm.value.educationPathSub) {
        let employ = ruleForm.value.educationPathSub.split(',')
        employ.map((item: any) => {
          files.push({ fileUrl: item, type: '3' })
        })
      }
      if (ruleForm.value.otherPathSub) {
        let employ = ruleForm.value.otherPathSub.split(',')
        employ.map((item: any) => {
          files.push({ fileUrl: item, type: '4' })
        })
      }

      ruleForm.value.employeePath = ruleForm.value.employeePathSub
      if (!ruleForm.value.employeePath) {
        ruleForm.value.employeeName = ''
      }
      ruleForm.value.idcardPath = ruleForm.value.idcardPathSub
      if (!ruleForm.value.idcardPath) {
        ruleForm.value.idcardName = ''
      }
      ruleForm.value.educationPath = ruleForm.value.educationPathSub
      if (!ruleForm.value.educationPath) {
        ruleForm.value.educationName = ''
      }
      ruleForm.value.otherPath = ruleForm.value.otherPathSub
      if (!ruleForm.value.otherPath) {
        ruleForm.value.otherName = ''
      }
      ruleForm.value.files = files

      console.log(ruleForm.value, 99)
      if (ruleForm.value.id) {
        if (props.type === 'examine') {
          const res = await updateStatusApi(ruleForm.value.id, ruleForm.value.status)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                sureLoading.value = false
                closeLoading.value = false
              }, 200)
            })
          if (res) {
            ElMessage.success('审核成功')
            getContent()
            getList()
            closeDrawer()
          }
        } else {
          // 更新
          const res = await updateInfoEmployeefileApi(ruleForm.value)
            .catch(() => {})
            .finally(() => {
              setTimeout(() => {
                sureLoading.value = false
                closeLoading.value = false
              }, 200)
            })
          if (res) {
            ElMessage.success('修改成功')

            if (props.type === 'contract') {
              fileDO()
            }
            getContent()
            getList()
            closeDrawer()
          }
        }
      } else {
        // 新增
        const res = await saveInfoEmployeefileApi(ruleForm.value)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              sureLoading.value = false
              closeLoading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('新增成功')

          if (props.type === 'contract') {
            fileDO()
          }
          getContent()
          getList()
        }
      }
    })
    .catch(() => {
      ElMessage.error('存在未填写的信息或信息格式不正确，请填写规范后再进行提交操作！')
    })
}

const fileDO = async () => {
  let res = await putExpireListApi({ id: props.reminderId })
}
// 取消

const close = () => {
  closeDrawer()
}

const checkEmptyData = () => {
  checkJobExperienceInside()
  checkBonuspenaltyInside()
  checkHealthInfo()
  checkTeducationExperience()
  checkBonuspenaltyExperience()
  checkJobExperienceOutside()
  checkBonuspenaltyOutside()
}

//去除工作经历（公司内部）的空数据
const checkJobExperienceInside = () => {
  if (tjobExperienceDOListn.value.length) {
    tjobExperienceDOListn.value = tjobExperienceDOListn.value.filter((item: any) => {
      return !(
        !item.startingTime &&
        !item.endingTime &&
        !item.dept &&
        !item.positionAndResponsibilities &&
        !item.salary &&
        !item.reference &&
        !item.referencePhone
      )
    })
  }
}

//去除奖惩经历（公司内部）的空数据
const checkBonuspenaltyInside = () => {
  if (infoBonuspenaltyDOListn.value.length) {
    infoBonuspenaltyDOListn.value = infoBonuspenaltyDOListn.value.filter((item: any) => {
      return !(
        !item.pubTime &&
        !item.title &&
        !item.rewardsPunishmentsUnit &&
        !item.filePath &&
        !item.fileName
      )
    })
  }
}

//去除健康状况的空数据
const checkHealthInfo = () => {
  if (thealthInformationDOList.value.length) {
    thealthInformationDOList.value = thealthInformationDOList.value.filter((item: any) => {
      return !(!item.healthYear && !item.healthCondition)
    })
  }
}

//去除教育经历的空数据
const checkTeducationExperience = () => {
  if (teducationExperienceDOList.value.length) {
    teducationExperienceDOList.value = teducationExperienceDOList.value.filter((item: any) => {
      return !(
        !item.startingTime &&
        !item.endingTime &&
        !item.academy &&
        !item.industry &&
        !item.education &&
        !item.rewardAndPunishment &&
        !item.filePath &&
        !item.fileName
      )
    })
  }
}

//去除奖惩经历（教育经历）的空数据
const checkBonuspenaltyExperience = () => {
  if (infoBonuspenaltyDOListj.value.length) {
    infoBonuspenaltyDOListj.value = infoBonuspenaltyDOListj.value.filter((item: any) => {
      return !(
        !item.pubTime &&
        !item.title &&
        !item.rewardsPunishmentsUnit &&
        !item.filePath &&
        !item.fileName
      )
    })
  }
}

//去除工作经历（公司外部）的空数据
const checkJobExperienceOutside = () => {
  if (tjobExperienceDOListw.value.length) {
    tjobExperienceDOListw.value = tjobExperienceDOListw.value.filter((item: any) => {
      return !(
        !item.startingTime &&
        !item.endingTime &&
        !item.dept &&
        !item.positionAndResponsibilities &&
        !item.salary &&
        !item.reference &&
        !item.referencePhone
      )
    })
  }
}

//去除奖惩经历（公司外部）的空数据
const checkBonuspenaltyOutside = () => {
  if (infoBonuspenaltyDOListw.value.length) {
    infoBonuspenaltyDOListw.value = infoBonuspenaltyDOListw.value.filter((item: any) => {
      return !(
        !item.pubTime &&
        !item.title &&
        !item.rewardsPunishmentsUnit &&
        !item.filePath &&
        !item.fileName
      )
    })
  }
}

onMounted(() => {
  // var personForm = document.getElementById('person-form')
  // console.log(personForm.style, 907)
})

//文件预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
//文件预览
const FilePreviewRef = ref()

//监听窗口高度变化
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      restFormHeight()
    }
  }
})
</script>
<style lang="less" scoped>
.person-form-edit {
  background: #f9f9f9;
  padding-bottom: 60px;
  overflow-y: auto;
  height: 100%;
}

.person-form-see {
  background: #f9f9f9;
  padding-bottom: 10px;
  overflow-y: auto;
  height: 100%;
}

.dossier-main {
  padding: 18px 0.9375vw 60px;
  margin: 0 auto 0;
  background: #ffffff;
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
}
.other-pdf-flie {
  border: 0 !important;
}
</style>

<style lang="less">
.date-picker,
.date-picker .el-input__wrapper {
  width: 100% !important;
}

.demo-ruleForm .el-form-item__label {
  //   margin-bottom: 5px !important;
}
</style>
