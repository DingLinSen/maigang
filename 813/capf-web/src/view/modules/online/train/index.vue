<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div :style="{ height: controlHight + 'px' }" class="control-container">
    <!--    <div class="waiting-certification" :style="{height: controlHight - 10+ 'px'}" v-if="beforeData.isAuth == 1 && beforeData.isLimitTime == 1">-->
    <!--      <div class="">-->
    <!--        <p class="center" v-if="beforeData.subjectName">-->
    <!--          <i class="el-icon-loading"></i>-->
    <!--        </p>-->
    <!--        <p class="title center">{{beforeData.subjectName ? '等待认证' : ''}}</p>-->
    <!--        <div class="waiting-content">-->
    <!--          <div class="top">-->
    <!--            <p class="center">-->
    <!--              <img src="@/assets/images/common/avatar_icon.png" alt="">-->
    <!--            </p>-->
    <!--            <p class="center">-->
    <!--              <span class="name ">{{name}}</span>&nbsp;<span class="icon-span">{{roleName}}</span>-->
    <!--            </p>-->
    <!--            <p class="dept center">-->
    <!--              {{deptName}}-->
    <!--            </p>-->
    <!--          </div>-->

    <!--          <div class="bottom" v-if="beforeData.subjectName" style="max-width: 60vw">-->
    <!--          <p><span class="sun">考核名称：</span>{{beforeData.examinationName || '&#45;&#45;'}}</p>-->
    <!--            <p>-->
    <!--            <span class="sub">考试课目：</span>{{beforeData.subjectName || '&#45;&#45;'}}-->
    <!--            </p>-->
    <!--            <p>-->
    <!--              <span class="sub">考试时长：</span>{{beforeData.paperTime || '&#45;&#45;'}}分钟-->
    <!--            </p>-->
    <!--            <p>-->
    <!--              <span class="sub">考试类型：</span>{{beforeData.type === '1' ? '结业考核初考' : (beforeData.type === '2' ? '结业考核补考' : (beforeData.type === '3' ? '季度考核' : (beforeData.type === '4' ? '抽考' : ('&#45;&#45;'))))}}-->
    <!--            </p>-->
    <!--            <p>-->
    <!--              <span class="sub">考试时间：</span>{{beforeData.startTime || '&#45;&#45;'}} ~ {{beforeData.endTime || '&#45;&#45;'}}-->
    <!--            </p>-->
    <!--          </div>-->
    <!--          <div class="bottom" v-else>-->
    <!--              <p style="min-width: 230px; padding: 20px 0; text-align: center;">用户无考核计划</p>-->
    <!--              &lt;!&ndash; <p style="width: 100%; text-align: center;">-->
    <!--                <Button type="error" @click="loginOut" >退出系统</Button>-->
    <!--              </p> &ndash;&gt;-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!-- 0无认证方式 1人脸 2指纹 3指纹和人脸 -->
    <div
      v-if="step === 2"
      :style="{ height: controlHight - 10 + 'px' }"
      class="certification"
    >
      <div class="">
        <p class="title center">进行认证</p>
        <div class="certification-content">
          <div
            v-if="certificationFlag === '2' || certificationFlag === '3'"
            class="left"
          >
            <div
              v-if="operating === 'Win32' || operating === 'Win64'"
              class="left-info"
            >
              <p class="center step">
                {{ certificationFlag === '3' ? '第一步：' : '' }}指纹识别
              </p>
              <div class="img-box" style="padding: 0">
                <div id="image">
                  <canvas id="fingerframe" height="300" width="320"></canvas>
                </div>
                <div id="resultLinks">
                  <a
                    id="resultLink"
                    href=""
                    media="application/octet-stream"
                    rel="external"
                  >
                  </a>
                </div>
                <p class="prompt">
                  <img
                    v-if="textResult === '识别成功'"
                    alt=""
                    src="@/assets/images/common/online_icon.png"
                  />
                  <img
                    v-if="textResult === '识别失败'"
                    alt=""
                    src="@/assets/images/common/downline_icon.png"
                  />{{ textResult }}
                </p>
              </div>
            </div>
            <div
              v-if="
                operating === 'Linux aarch32' || operating === 'Linux aarch64'
              "
              class="left-info"
            >
              <p class="center step">
                {{ certificationFlag === '3' ? '第一步：' : '' }}指纹识别
              </p>
              <div class="img-box" style="padding: 0">
                <div
                  id="image"
                  style="height: 300px; width: 5rem; text-align: center"
                >
                  <img
                    :src="fingerImgUrlLinux"
                    alt=""
                    style="height: 90%; margin: 5% 0 0 0"
                  />
                </div>
                <p class="prompt">
                  <img
                    v-if="textResult === '识别成功'"
                    alt=""
                    src="@/assets/images/common/online_icon.png"
                  />
                  <img
                    v-if="textResult === '识别失败'"
                    alt=""
                    src="@/assets/images/common/downline_icon.png"
                  />{{ textResult }}
                </p>
              </div>
            </div>

            <div class="center">
              <Button
                v-if="
                  operating === 'Linux aarch32' || operating === 'Linux aarch64'
                "
                style="margin-top: 10px"
                type="primary"
                @click="beginVerifyCapture"
                >&nbsp;&nbsp;点击进行验证&nbsp;&nbsp;
              </Button>
              <Button
                v-if="operating === 'Win32' || operating === 'Win64'"
                id="EnrollBtnANSI"
                disabled
                style="margin-top: 10px"
                type="primary"
                @click="beginOperation('enroll', 'ansisdk', false)"
                >&nbsp;&nbsp;点击进行验证&nbsp;&nbsp;
              </Button>
            </div>
          </div>
          <div
            v-if="certificationFlag === '1' || certificationFlag === '3'"
            class="right"
          >
            <div class="right-info">
              <p class="center step">
                {{ certificationFlag === '3' ? '第二步：' : '' }}人脸识别
              </p>
              <div class="camera_outer" style="height: 300px">
                <video v-if="!cameraUrl" id="videoCamera" autoplay></video>
                <img v-else :src="cameraUrl" alt="" class="cameraImg" />
                <canvas
                  id="canvasCamera"
                  :height="videoHeight"
                  :width="videoWidth"
                  style="display: none"
                ></canvas>
                <div style="margin-top: 0.1rem">
                  <p class="center" style="color: #333">请将脸正对摄像头</p>
                  <p v-if="cameraUrl" class="prompt">
                    <img
                      alt=""
                      src="@/assets/images/common/online_icon.png"
                    />认证成功
                  </p>
                  <!-- <Button size="small" type="primary" @click="getCompetence()">打开摄像头</Button> -->
                  <!-- <Button size="small" type="primary" @click="stopNavigator()">关闭摄像头</Button>
                       <Button size="small" type="primary" @click="setImage()" >拍照</Button> -->
                </div>
              </div>
            </div>

            <div class="center">
              <Button
                v-if="isCamera"
                style="margin-top: 10px"
                type="primary"
                @click="setImage"
                >&nbsp;&nbsp;点击进行验证&nbsp;&nbsp;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="step === 3"
      :style="{ height: controlHight - 10 + 'px' }"
      class="waiting-test"
    >
      <div class="">
        <p class="center">
          <i class="el-icon-loading"></i>
        </p>
        <p class="title center">等待考试</p>
        <div class="waiting-content">
          <p style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0">
            考试注意事项：
          </p>
          <div>
            <p>
              考试期间需放在指定区域的禁止携带物品:处于关闭状态下的手机、相机或任何其他电子产品。
            </p>
            <p>
              严禁考生有翻阅资料、拨打接听电话、交头接耳、互相商量、替他人考试等违反考场纪律的行为，违者取消考试成绩。
            </p>
            <p>考试员在考场内巡视，维护考场秩序，查纠作弊行为；</p>
            <p>
              监考科领导、考试监督岗通过计算机远程监控考场情况，发现以上作弊行为，拍照取证，并取消考试成绩。
            </p>
            <p>
              考试机显示屏设有自动关机，如考生发现显示器“黑屏”，随意敲击一下考试键盘，显示器就会立即开机。
            </p>
            <p>
              考生如有考试内容以外的问题，可举手向监考民警说明，不得向其他考生询问
            </p>
            <p>考生交卷或考试时间到，考试员会当场发布考试成绩。</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 试卷 -->
    <Exam
      v-if="step === 4 || step === 6"
      :assId="assId"
      :examData="examData"
      :examFlag="examFlag"
      :examQuestionInfo="examQuestionInfo"
      @handleSave="handleSave"
      @handleTime="handleTime"
    >
    </Exam>
    <!--    <div class="test-wrap" :style="{height: controlHight - 21 + 'px'}" v-if="step === 4 || step === 6">-->
    <!--      <div class="test-top">-->
    <!--        <div class="title">-->
    <!--          {{assessmentInfo.paperName}}<span class="time c-primary" v-if="countdown && step === 4">{{countdown}}</span><span v-if="step === 6 && checkPaparId" class="time c-primary">得分：{{theTotal || 0}} 分</span>-->
    <!--          &nbsp;&nbsp;<Button type="error" @click="loginOut" v-if="step === 6">退出</Button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="test-content" :style="{height: controlHight - 80 + 'px'}">-->
    <!--        <div class="summary" v-if="summaryList.length">-->
    <!--          <div v-for="(item, index) in summaryList" :key="index" :style="{width: (100/ summaryList.length + 1).toFixed(1) + '%'}">-->
    <!--            <p>{{item.name}}</p>-->
    <!--            <p>{{item.num}} 题</p>-->
    <!--            <p>{{item.point}} 分</p>-->
    <!--          </div>-->
    <!--          <div :style="{width: (100/ summaryList.length + 1).toFixed(1) + '%'}">-->
    <!--            <p>考试题</p>-->
    <!--            <p>共 {{totalNum || '&#45;&#45;'}} 题</p>-->
    <!--            <p>共 {{totalPoint || '&#45;&#45;'}} 分</p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        &lt;!&ndash; 单选、多选、判断、填空、简答  这个顺序吧 &ndash;&gt;-->
    <!--        <div class="form">-->
    <!--          <Form ref="questionInfo" :model="questionInfo" :label-width="0">-->
    <!--            <FormItem-->
    <!--              v-if="questionInfo.radioInfo && questionInfo.radioInfo.radioList && questionInfo.radioInfo.radioList.length"-->
    <!--              v-for="(item, index) in questionInfo.radioInfo.radioList"-->
    <!--              :key="index + '11'"-->
    <!--              :prop="'radioInfo.radioList.' + index + '.value'"-->
    <!--              :rules="{required: true, message: '请选择选项', trigger: 'change'}">-->
    <!--              <p v-if="index === 0" class="one-title">{{questionInfo.radioInfo.title}}</p>-->
    <!--              <p class="qst-title">{{index + 1 + '、'}}{{item.title}}{{item.point ? '（' + item.point + ' 分）' : '（ 2分）'}}</p>-->
    <!--              <div class="picture-box" v-if="item.picturePath">-->
    <!--                <p>请观看图片 {{item.pictureName}} 作答。</p>-->
    <!--                <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)" />-->
    <!--              </div>-->
    <!--              <div class="video-box" v-if="item.videoPath">-->
    <!--                <p v-if="!isSeePaper">请观看视频 {{item.videoName}} 作答。</p>-->
    <!--                <video-->
    <!--                  :src="uploadUrl + item.videoPath"-->
    <!--                  id="videoPlayer"-->
    <!--                  ref="movie"-->
    <!--                  style="object-fit:contain;position: relative;background: rgba(0,0,0);"-->
    <!--                  controlslist="nodownload noremoteplayback"-->
    <!--                  controls="controls"-->

    <!--                  :disablePictureInPicture="true"-->
    <!--                  oncontextmenu="return false"-->
    <!--                >-->
    <!--                  &lt;!&ndash; autoplay="autoplay" &ndash;&gt;-->
    <!--                  您的浏览器不支持 video 标签。-->
    <!--                </video>-->
    <!--              </div>-->
    <!--              <RadioGroup v-model="item.value">-->
    <!--                <Radio :label="subItme.name" v-for="(subItme, subIndex) in item.options" :key="subIndex + '11'" :disabled="isSeePaper" >{{subItme.name + ' ' +subItme.value}}</Radio>-->
    <!--              </RadioGroup>-->
    <!--              <p class="you-answer" :class="item.isRight ? 'you-answer green' : 'you-answer red'"  v-if="isSeePaper && step === 6">您的作答：<span>{{item.yourAnswer || '&#45;&#45;' }}</span></p>-->
    <!--            </FormItem>-->
    <!--           <FormItem-->
    <!--              v-if="questionInfo.chexkBoxsInfo && questionInfo.chexkBoxsInfo.chexkBoxsList && questionInfo.chexkBoxsInfo.chexkBoxsList.length"-->
    <!--              v-for="(item, index) in questionInfo.chexkBoxsInfo.chexkBoxsList"-->
    <!--              :key="index + '22'"-->
    <!--              :prop="'chexkBoxsInfo.chexkBoxsList.' + index + '.value'"-->
    <!--              :rules="{required: true, type: 'array', min: 1, message: '请选择选项', trigger: 'change'}">-->
    <!--              <p v-if="index === 0" class="one-title">{{questionInfo.chexkBoxsInfo.title}}</p>-->
    <!--              <p class="qst-title">{{index + 1 + '、'}}{{item.title}}{{item.point ? '（' + item.point + ' 分）' : '（2分）'}}</p>-->
    <!--              <div class="picture-box" v-if="item.picturePath">-->
    <!--                <p>请观看图片 {{item.pictureName}} 作答。</p>-->
    <!--                <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)"/>-->
    <!--              </div>-->
    <!--              <div class="video-box" v-if="item.videoPath">-->
    <!--                <p v-if="!isSeePaper">请观看视频 {{item.videoName}} 作答。</p>-->
    <!--                <video-->
    <!--                  :src="uploadUrl + item.videoPath"-->
    <!--                  id="videoPlayer"-->
    <!--                  ref="movie"-->
    <!--                  style="object-fit:contain;position: relative;background: rgba(0,0,0);"-->
    <!--                  controlslist="nodownload noremoteplayback"-->
    <!--                  controls="controls"-->

    <!--                  :disablePictureInPicture="true"-->
    <!--                  oncontextmenu="return false"-->
    <!--                >-->
    <!--                  &lt;!&ndash; autoplay="autoplay" &ndash;&gt;-->
    <!--                  您的浏览器不支持 video 标签。-->
    <!--                </video>-->
    <!--              </div>-->
    <!--              <CheckboxGroup v-model="item.value">-->
    <!--                <Checkbox :label="subItme.name" v-for="(subItme, subIndex) in item.options" :key="subIndex + '22'" :disabled="isSeePaper">{{subItme.name + ' ' +subItme.value}}</Checkbox>-->
    <!--              </CheckboxGroup>-->
    <!--              <p :class="item.isRight ? 'you-answer green' : 'you-answer red'" v-if="isSeePaper && step === 6">您的作答：<span>{{item.yourAnswer  || '&#45;&#45;' }}</span></p>-->
    <!--            </FormItem>-->
    <!--            <FormItem-->
    <!--              v-if="questionInfo.judgeInfo && questionInfo.judgeInfo.judgeList && questionInfo.judgeInfo.judgeList.length"-->
    <!--              v-for="(item, index) in questionInfo.judgeInfo.judgeList"-->
    <!--              :key="index + '33'"-->
    <!--              :prop="'judgeInfo.judgeList.' + index + '.value'"-->
    <!--              :rules="{required: true, message: '请选择选项', trigger: 'change'}">-->
    <!--              <p v-if="index === 0" class="one-title">{{questionInfo.judgeInfo.title}}</p>-->
    <!--              <p class="qst-title">{{index + 1 + '、'}}{{item.title}}{{item.point ? '（ ' + item.point + ' 分 ）' : '（1分）'}}</p>-->
    <!--              <div class="picture-box" v-if="item.picturePath">-->
    <!--                <p>请观看图片 {{item.pictureName}} 作答。</p>-->
    <!--                <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)"/>-->
    <!--              </div>-->
    <!--              <div class="video-box" v-if="item.videoPath">-->
    <!--                <p v-if="!isSeePaper">请观看视频 {{item.videoName}} 作答。</p>-->
    <!--                <video-->
    <!--                  :src="uploadUrl + item.videoPath"-->
    <!--                  id="videoPlayer"-->
    <!--                  ref="movie"-->
    <!--                  style="object-fit:contain;position: relative;background: rgba(0,0,0);"-->
    <!--                  controlslist="nodownload noremoteplayback"-->
    <!--                  controls="controls"-->

    <!--                  :disablePictureInPicture="true"-->
    <!--                  oncontextmenu="return false"-->
    <!--                >-->
    <!--                  &lt;!&ndash; autoplay="autoplay" &ndash;&gt;-->
    <!--                  您的浏览器不支持 video 标签。-->
    <!--                </video>-->
    <!--              </div>-->
    <!--              <RadioGroup v-model="item.value">-->
    <!--                <Radio :label="subItme.name" v-for="(subItme, subIndex) in item.options" :key="subIndex + '33'" :disabled="isSeePaper">{{subItme.name + ' ' +subItme.value}}</Radio>-->
    <!--              </RadioGroup>-->
    <!--              <p :class="item.isRight ? 'you-answer green' : 'you-answer red'" v-if="isSeePaper && step === 6">您的作答：<span>{{item.yourAnswer  || '&#45;&#45;' }}</span></p>-->
    <!--            </FormItem>-->
    <!--             <FormItem v-if="questionInfo.fillInfo && questionInfo.fillInfo.fillList && questionInfo.fillInfo.fillList.length">-->
    <!--              <div v-for="(item, index) in questionInfo.fillInfo.fillList" :key="index" class="fill-box">-->
    <!--                <p v-if="index === 0" class="one-title">{{questionInfo.fillInfo.title}}</p>-->
    <!--                <p class="qst-title" style="margin-bottom: 5px">{{index + 1 + '、'}}{{item.title}}{{item.point ? '（' + item.point + ' 分）' : '（2分）'}}</p>-->
    <!--                <div class="picture-box" v-if="item.picturePath">-->
    <!--                  <p>请观看图片 {{item.pictureName}} 作答。</p>-->
    <!--                  <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)"/>-->
    <!--                </div>-->
    <!--                <div class="video-box" v-if="item.videoPath">-->
    <!--                  <p v-if="!isSeePaper">请观看视频 {{item.videoName}} 作答。</p>-->
    <!--                  <video-->
    <!--                    :src="uploadUrl + item.videoPath"-->
    <!--                    id="videoPlayer"-->
    <!--                    ref="movie"-->
    <!--                    style="object-fit:contain;position: relative;background: rgba(0,0,0);"-->
    <!--                    controlslist="nodownload noremoteplayback"-->
    <!--                    controls="controls"-->

    <!--                    :disablePictureInPicture="true"-->
    <!--                    oncontextmenu="return false"-->
    <!--                  >-->
    <!--                    &lt;!&ndash; autoplay="autoplay" &ndash;&gt;-->
    <!--                    您的浏览器不支持 video 标签。-->
    <!--                  </video>-->
    <!--                </div>-->
    <!--                <FormItem-->
    <!--                  v-for="(subItem, subIndex) in item.options"-->
    <!--                  :key="subIndex + '4401'"-->
    <!--                  :prop="'fillInfo.fillList.' + index  + '.options.' + subIndex + '.value'"-->
    <!--                  :rules="{required: true, message: '请作答', transform: value => value ? value.trim() : '', trigger: 'blur'}">-->
    <!--                  <div style="display: flex;margin-left: 15px">-->
    <!--                    <div style="width: 15px">-->
    <!--                      {{subItem.name}}-->
    <!--                    </div>-->
    <!--                    <div style="width: calc(100% - 15px)">-->
    <!--                       <Input v-model.trim="subItem.value" type="textarea" :show-word-limit="true" :disabled="isSeePaper" style="margin-top: 3px; margin-bottom: 3px; width: calc(100% - 20px)" :maxlength="1000"></Input>-->
    <!--                    </div>-->
    <!--                  </div>-->
    <!--                </FormItem>-->
    <!--                <p :class="item.isRight ? 'you-answer green' : 'you-answer red'" v-if="isSeePaper && step === 6" style="margin-bottom: 10px">您的作答：<span>{{item.yourAnswer  || '&#45;&#45;' }}</span></p>-->
    <!--              </div>-->
    <!--            </FormItem>-->
    <!--             <FormItem-->
    <!--                v-if="questionInfo.shortInfo && questionInfo.shortInfo.shortList.length"-->
    <!--                v-for="(item, index) in questionInfo.shortInfo.shortList"-->
    <!--                :key="index + '44'"-->
    <!--                :prop="'shortInfo.shortList.' + index + '.value'"-->
    <!--                :rules="{required: true, message: '请作答', transform: value => value ? value.trim() : '', trigger: 'change'}">-->
    <!--                <p v-if="index === 0" class="one-title">{{questionInfo.shortInfo.title}}</p>-->
    <!--                <p class="qst-title">{{index + 1 + '、'}}{{item.title}}{{item.point ? '（ ' + item.point + ' 分 ）' : '（8分）'}}</p>-->
    <!--                <div class="picture-box" v-if="item.picturePath">-->
    <!--                  <p>请观看图片 {{item.pictureName}} 作答。</p>-->
    <!--                  <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)"/>-->
    <!--                </div>-->
    <!--                <div class="video-box" v-if="item.videoPath">-->
    <!--                  <p v-if="!isSeePaper">请观看视频 {{item.videoName}} 作答。</p>-->
    <!--                  <video-->
    <!--                    :src="uploadUrl + item.videoPath"-->
    <!--                    id="videoPlayer"-->
    <!--                    ref="movie"-->
    <!--                    style="object-fit:contain;position: relative;background: rgba(0,0,0);"-->
    <!--                    controlslist="nodownload noremoteplayback"-->
    <!--                    controls="controls"-->

    <!--                    :disablePictureInPicture="true"-->
    <!--                    oncontextmenu="return false"-->
    <!--                  >-->
    <!--                    &lt;!&ndash; autoplay="autoplay" &ndash;&gt;-->
    <!--                    您的浏览器不支持 video 标签。-->
    <!--                  </video>-->
    <!--                </div>-->
    <!--                <Input v-model.trim="item.value" type="textarea" :show-word-limit="true" :disabled="isSeePaper" style="margin-top: 8px;margin-bottom: 3px; width: calc(100% - 20px)" :maxlength="1000" ></Input>-->
    <!--                <p :class="item.isRight ? 'you-answer green' : 'you-answer red'" v-if="isSeePaper && step === 6" style="margin-top: 5px">您的作答：<span>{{item.yourAnswer || '&#45;&#45;' }}</span></p>-->
    <!--            </FormItem>-->
    <!--            <FormItem style="text-align: center;" v-if="!isSeePaper && !isLoading && step === 4">-->
    <!--              <Button type="primary" @click="handleSubmit('questionInfo')" >交卷</Button>-->
    <!--            </FormItem>-->
    <!--          </Form>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div
      v-if="step === 5"
      :style="{ height: controlHight - 10 + 'px' }"
      class="result-wrap"
    >
      <p>
        本次考核成绩：<span style="color: #29a387">{{ point }}</span>
        成绩：<span :class="isPass ? 'c-primary' : 'c-red'">{{
          isPass ? '合格' : '不合格'
        }}</span>
      </p>
      <!--      <p>-->
      <!--        本次考核成绩：<span style="color: #29A387;">{{ theTotal }}</span>-->
      <!--        成绩：<span :class="isQualified ? 'c-primary' : 'c-red'">{{-->
      <!--          isQualified ? '合格' : '不合格'-->
      <!--        }}</span>-->
      <!--      </p>-->
      <div class="bottom">
        <!--        <Button type="primary" @click="checkPapar">查看试卷</Button>-->
        <Button type="error" @click="loginOut">退出</Button>
      </div>
    </div>
    <div slot="drawer">
      <transition mode="in-out" name="center-show"></transition>
    </div>
    <div
      v-if="isLoading"
      class="mask"
      style="
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: calc(100% - 29px);
        top: 0;
      "
    >
      <div>
        <p class="center" style="margin-top: 20%">
          <i class="el-icon-loading"></i>
        </p>
        <p
          class="title center"
          style="font-size: 18px; margin-top: 10px; color: #fff"
        >
          加载中
        </p>
      </div>
    </div>
    <div v-if="step === 4" class="camera_outer" style="">
      <video id="videoCamera" autoplay style="height: 0"></video>
      <canvas
        id="canvasCamera"
        :height="videoHeight"
        :width="videoWidth"
        style="display: none"
      ></canvas>
    </div>
    <Modal
      v-model="imgModal"
      :closable="false"
      :footer-hide="true"
      width="80vw"
    >
      <img :src="previewUrl" alt="" @click="closePreview" />
    </Modal>
  </div>
</template>

<script>
import { OPERATE_LIST } from '@/libs/mixin'
import {
  initAccessPaperDetails,
  initAccessPaperDetailsById,
  operateAccessControlPaperInfo,
  initAssessmentManagementDetailsById,
  operatePointInfoSub,
  offlineControlByIds,
  initBeforeAuthById,
  validationFingerprint
} from '@/api/online/control/api-modules-control.js'
import { operateSubjectlearnPhotoInfo } from '@/api/learn/api-modules-subjectlearn.js'
import webSocket from '@/libs/websocket.js'
import { clearLoginInfo } from '@/utils'
import { userLogout } from '@/api/api-base'
import axios from 'axios'
import Exam from './components/exam.vue'

export default {
  mixins: [OPERATE_LIST],
  components: {
    Exam
  },
  data() {
    return {
      controlHight: 0,
      listData: [],
      isLoading: false,
      step: null, // 1等待认证 2认证 3等待考试 4开始 5交卷6查看试卷
      cameraUrl: null,
      videoWidth: 400,
      videoHeight: 255,
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      timeNum: 0,
      countdown: 0,
      countdownInterval: null,
      summaryList: [],
      index: 1,
      isSeePaper: false,
      examQuestionInfo: {
        radioInfo: {
          radioList: []
        },
        chexkBoxsInfo: {
          chexkBoxsList: []
        },
        judgeInfo: {
          judgeList: []
        },
        fillInfo: {
          fillList: []
        },
        shortInfo: {
          shortList: []
        }
      },
      questionInfo: {
        radioInfo: {
          radioList: []
        },
        chexkBoxsInfo: {
          chexkBoxsList: []
        },
        judgeInfo: {
          judgeList: []
        },
        fillInfo: {
          fillList: []
        },
        shortInfo: {
          shortList: []
        }
      },
      theTotal: 0, // 本次考试成绩
      isQualified: false, // 是否合格
      isPass: false, // 是否合格
      totalNum: null,
      totalPoint: null,
      paperId: null,
      controlData: {},
      assessmentInfo: {}, // 本次考核信息
      nowDate: null,
      timeInterval: null,
      checkPaparId: null, // 查看考试完试卷的id
      // 指纹机
      fpHTTSrvOpEP: '',
      textResult: '点击进行验证，开始录入指纹',
      btnEnrollAnsi: null,
      // btnEnrollFTR: null,
      // btnEnrollFTRIdn: null,
      // btnCapture: null,
      // btnCancel: null,
      // checkBoxConvToISO: null,
      sampleNumList: null,
      testUserNa: null,
      resultL: null,
      fingerFra: null,
      lastInitOp: null,
      resultLink: null,
      testUserName: null,
      fingerprint: null, // 指纹识别数据
      beforeData: {
        endTime: '',
        paperTime: '',
        startTime: '',
        subjectName: '',
        type: '',
        examinationName: ''
      },
      documentClientHeight: null,
      userId: null,
      name: null,
      roleName: null,
      deptName: null,
      isNotAssessToday: null,
      assId: null,
      terminalId: null,
      uploadUrl: null,
      loginModal: false,
      certificationFlag: null, // 0无认证方式 1人脸 2指纹 3指纹、人脸
      operating: null,
      hostIpLinux: 'http://127.0.0.1',
      fingerImgUrlLinux: '',
      isCamera: false,
      imgModal: false, // 预览图片
      previewUrl: '',
      day: null,
      honur: null,
      min: null,
      sen: null,
      isLimitTime: null,
      isAuth: null,
      examData: {
        examinationName: '',
        paperName: '',
        testDuration: '',
        endTime: '',
        startTime: '',
        isAuth: '',
        passScore: ''
      },
      point: 0,
      examFlag: false,
      testStepFlag: 1,
      passScore: 0
    }
  },
  watch: {
    websocketFlag: function () {
      let data = this.websocketFlag
      // 1 认证 2 考试 3 拍照 4评判试卷 5 发布成绩  6下线 7交卷 8认证
      if (!data) {
        return
      }
      if (data.type === 6) {
        this.$Message.error('您将会被强制下线')
        setTimeout(() => {
          let params = {
            userId: this.userId,
            token: data.token,
            delAssId: this.assId
          }
          offlineControlByIds(params)
            .then(res => {
              if (res.data.status) {
                sessionStorage.removeItem('store')
                sessionStorage.setItem('menuList', '[]')
                sessionStorage.setItem('permissions', '[]')
                this.$store.dispatch('user/handleLogOut')
                this.$router.options.isAddDynamicMenuRoutes = false
                this.$cookie.set('loginUserInfo', [])
                // 关闭websocket
                webSocket.closeSocket()
                clearLoginInfo()
                this.$router.push('/login')
              }
            })
            .catch(() => {})
        }, 500)
      }
      if (data.type === 1) {
        if (this.step === 1) {
          this.controlData = data.messageContent
          sessionStorage.setItem(
            'controlData',
            JSON.stringify(data.messageContent)
          )
          this.step = data.type + 1
        }
      } else if (data.type === 3) {
        if (this.step === 4) {
          this.nonInductive() // 无感拍照
        }
      } else if (data.type < 7) {
        this.step = data.type + 1
      } else {
      }
    },
    certificationFlag: function () {
      if (this.certificationFlag === '0') {
        this.step = 3
      }
      if (this.step === 2) {
        if (this.certificationFlag === '2' || this.certificationFlag === '3') {
          setTimeout(() => {
            if (this.operating === 'Win32' || this.operating === 'Win64') {
              this.onBodyLoad()
            } else {
              this.cancelCapture()
            }
          }, 100)
        } else if (this.certificationFlag === '1') {
          setTimeout(() => {
            this.getCompetence()
          }, 1000)
        } else if (this.certificationFlag === '0') {
          this.step = 3
        }
      }
    },
    step: function () {
      this.imgModal = false
      if (this.step > 1) {
        sessionStorage.setItem('testStep', this.step)
      }
      if (this.step === 1) {
        this.initBefore()
      } else if (this.step === 2) {
        // 0无认证方式 1人脸 2指纹 3指纹和人脸
        if (!this.certificationFlag) {
          this.initBefore()
        } else {
          if (
            this.certificationFlag === '2' ||
            this.certificationFlag === '3'
          ) {
            setTimeout(() => {
              if (this.operating === 'Win32' || this.operating === 'Win64') {
                this.onBodyLoad()
              } else {
                this.cancelCapture()
              }
            }, 100)
          } else if (this.certificationFlag === '1') {
            setTimeout(() => {
              this.getCompetence()
            }, 1000)
          } else if (this.certificationFlag === '0') {
            this.step = 3
          }
        }
      } else if (this.step === 3) {
        let params = {
          id: this.assId
        }
        initAssessmentManagementDetailsById(params)
          .then(res => {
            if (res.data.status) {
              var data = res.data.assessmentManagementDO
              this.assessmentInfo = data
              this.examData.examinationName = data.examinationName
              this.examData.endTime = data.endTime
              this.examData.paperName = data.paperName
              this.examData.testDuration = data.testDuration
              this.examData.startTime = data.startTime
              this.examData.passScore = data.passScore
              this.examData.isAuth = data.isAuth
              this.examData.isLimitTime = data.isLimitTime
              let nowDate = new Date().getTime()
              let startTime = new Date(this.assessmentInfo.startTime).getTime()
              if (nowDate > startTime) {
                // 如果已经考试考试直接考试
                this.step = 4
              } else {
                // 等待考试
                this.timeInterval = setInterval(() => {
                  this.nowDate = new Date().getTime()
                  if (this.nowDate >= startTime) {
                    this.step = 4
                    window.clearInterval(this.timeInterval)
                  }
                }, 1000)
              }
            } else {
            }
          })
          .catch(() => {})
      } else if (this.step === 4) {
        if (!this.assessmentInfo.paperName) {
          let params = {
            id: this.assId
          }
          initAssessmentManagementDetailsById(params)
            .then(res => {
              if (res.data.status) {
                var data = res.data.assessmentManagementDO
                this.examData.examinationName = data.examinationName
                this.examData.endTime = data.endTime
                this.examData.paperName = data.paperName
                this.examData.testDuration = data.testDuration
                this.examData.startTime = data.startTime
                this.examData.passScore = data.passScore
                this.examData.isAuth = data.isAuth
                this.examData.isLimitTime = data.isLimitTime
                this.assessmentInfo = data
                this.initPaperData()
                let nowDate = new Date().getTime()
                let startTime = new Date(
                  this.assessmentInfo.startTime
                ).getTime()
                let endTime = new Date(this.assessmentInfo.endTime).getTime()
                // 如果过了考试时间直接交卷
                if (nowDate >= endTime) {
                  this.timeNum = 1
                } else if (nowDate > startTime) {
                  // 过了考试开始时间倒计时要减去
                  this.timeNum = (
                    this.assessmentInfo.paperTime * 60 -
                    (nowDate - startTime).toFixed(0) / 1000
                  ).toFixed(0)
                } else {
                  this.timeNum = (this.assessmentInfo.paperTime * 60).toFixed(0)
                }
                this.countdown = this.getTime(this.timeNum)
                this.countdownInterval = setInterval(() => {
                  if (this.timeNum > 0) {
                    this.timeNum-- // 递减
                    this.countdown = this.getTime(this.timeNum)
                  } else {
                    this.countdown = 0
                  }
                }, 1000) // 1000毫秒后执行
              } else {
              }
            })
            .catch(() => {})
        } else {
          this.initPaperData()
          let nowDate = new Date().getTime()
          let startTime = new Date(this.assessmentInfo.startTime).getTime()
          let endTime = new Date(this.assessmentInfo.endTime).getTime()
          // 如果过了考试时间直接交卷
          if (nowDate >= endTime) {
            this.timeNum = 1
          } else if (nowDate > startTime) {
            // 过了考试开始时间倒计时要减去
            this.timeNum = (
              this.assessmentInfo.paperTime * 60 -
              (nowDate - startTime).toFixed(0) / 1000
            ).toFixed(0)
          } else {
            this.timeNum = (this.assessmentInfo.paperTime * 60).toFixed(0)
          }
          this.countdown = this.getTime(this.timeNum)
          this.countdownInterval = setInterval(() => {
            if (this.timeNum > 0) {
              this.timeNum-- // 递减
              this.countdown = this.getTime(this.timeNum)
            } else {
              this.countdown = 0
            }
          }, 1000) // 1000毫秒后执行
        }
      } else if (this.step === 5) {
        if (String(this.checkPaparId) === 'null' || !this.checkPaparId) {
          if (
            !sessionStorage.getItem('checkPaparId') ||
            sessionStorage.getItem('checkPaparId') === 'null'
          ) {
            this.isLoading = false
          } else {
            this.checkPaparId = sessionStorage.getItem('checkPaparId')
            this.isSeePaper = true
            let params = {
              // 试卷保存成功返回的id
              id: this.checkPaparId
            }
            initAccessPaperDetailsById(params)
              .then(res => {
                if (res.data.status) {
                  var data = res.data.data
                  let content = JSON.parse(data.content)
                  this.totalPoint = content.totalPoint

                  this.theTotal = data.point
                  this.point = data.point
                  if (this.point >= this.examData.passScore) {
                    this.isPass = true
                  } else {
                    this.isPass = false
                  }
                  if (this.theTotal / this.totalPoint > 0.6) {
                    this.isQualified = true
                  } else {
                    this.isQualified = false
                  }
                } else {
                }
              })
              .catch(() => {})
          }
        }
      } else if (this.step === 6) {
        this.checkPapar()
      }
    },
    timeNum: function () {
      // if (this.timeNum === 180) {
      //   this.$Message.warning('考试时间剩余三分钟，请及时提交试卷')
      // }
      // let nowDate = new Date().getTime()
      // let endTime = new Date(this.assessmentInfo.endTime).getTime()
      // if (this.timeNum === 30) {
      //   this.$Message.error('考试时间剩余30秒，即将自动交卷。')
      // }
      // if (this.timeNum < 2 || endTime <= nowDate) {
      //   this.$Message.error('考试时间已到，即将自动交卷。')
      //   this.step = 5
      //   window.clearInterval(this.countdownInterval)
      //   setTimeout(() => {
      //     window.clearInterval(this.countdownInterval)
      //     this.isSeePaper = true
      //     let questionInfo = {
      //       radioInfo: this.calculateRadio(this.questionInfo.radioInfo),
      //       chexkBoxsInfo: this.calculateChexkBoxs(
      //         this.questionInfo.chexkBoxsInfo
      //       ),
      //       judgeInfo: this.calculateJudgeInfo(this.questionInfo.judgeInfo),
      //       fillInfo: this.calculateFillInfo(this.questionInfo.fillInfo),
      //       shortInfo: this.calculateShortInfo(this.questionInfo.shortInfo)
      //     }
      //     let total =
      //       questionInfo.radioInfo.totalPoint +
      //       questionInfo.chexkBoxsInfo.totalPoint +
      //       questionInfo.judgeInfo.totalPoint +
      //       questionInfo.fillInfo.totalPoint +
      //       questionInfo.shortInfo.totalPoint
      //     this.theTotal = this.interception(total, 1)
      //     if (this.theTotal / this.totalPoint > 0.6) {
      //       this.isQualified = true
      //     } else {
      //       this.isQualified = false
      //     }
      //     let params = {
      //       userId: this.userId,
      //       examinePointId: this.controlData.examinePointId, // 成绩管理的id
      //       point: this.theTotal,
      //       content: JSON.stringify({
      //         totalNum: this.totalNum,
      //         totalPoint: this.totalPoint,
      //         questionInfo: questionInfo,
      //         summaryList: this.summaryList
      //       })
      //     }
      //     operateAccessControlPaperInfo(params)
      //       .then(res => {
      //         this.$Spin.hide()
      //         this.imgModal = false
      //         if (res.data.status) {
      //           this.$Message.success('提交成功')
      //           this.checkPaparId = res.data.data.id
      //           sessionStorage.setItem('checkPaparId', res.data.data.id)
      //           let params = {
      //             type: 7,
      //             messageContent: '交卷了',
      //             toWho: this.controlData.userId
      //           }
      //           webSocket.sendMessage(JSON.stringify(params))
      //         } else {
      //         }
      //       })
      //       .catch(() => {})
      //     let subparams = {
      //       assessmentId: this.assId, // 考核id
      //       examinePointId: this.controlData.examinePointId, // 成绩管理id
      //       paperId: this.assessmentInfo.paperId,
      //       paperName: this.assessmentInfo.paperName,
      //       point: this.theTotal,
      //       userId: this.userId
      //     }
      //     operatePointInfoSub(subparams)
      //       .then(res => {
      //         this.$Spin.hide()
      //         if (res.data.status) {
      //         } else {
      //         }
      //       })
      //       .catch(() => {})
      //   }, 2000)
      // }
    }
  },
  computed: {
    websocketFlag: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.websocketFlag
        }
      }
    }
  },
  created() {
    // 禁止右键
    document.oncontextmenu = function () {
      return false
    }
  },
  mounted() {
    this.testStepFlag = this.$route.query.testStepFlag
    if (this.testStepFlag == 1) {
      this.certificationFlag = '2'
      this.step = 2
    }
    if (this.testStepFlag == 0) {
      // this.certificationFlag = '2'
      this.step = 4
    }
    this.examData.testDuration = this.$route.query.testDuration
    this.assId = this.$route.query.assId
    this.examData.passScore = this.$route.query.passScore
    setInterval(this.showTime, 1000)
    this.$nextTick(() => {
      document.onmousedown = function () {
        if (event.button === 2) {
          event.returnValue = false
        }
      }
      document.onkeydown = function (event) {
        if (window.event && window.event.keyCode === 123) {
          // event.keyCode = 0;
          event.returnValue = false
        } else if (window.event && window.event.keyCode === 122) {
          // event.keyCode = 0;
          event.returnValue = false
        } else if (window.event && window.event.keyCode === 27) {
          // event.keyCode = 0;
          event.returnValue = false
        }
      }
    })
    if (!this.$cookie.get('token')) {
      this.$Message.error('请重新登录')
      this.$router.push('login')
    }
    const loginUserInfo = JSON.parse(
      this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
    )
    this.isNotAssessToday = loginUserInfo.isNotAssessToday
    const _this = this
    this.step = null
    // if (this.isNotAssessToday) {
    this.assId = this.$route.query.assId
      ? this.$route.query.assId
      : loginUserInfo.assId
    this.terminalId = loginUserInfo.terminalId
    this.userId = loginUserInfo.userId
    this.name = loginUserInfo.name
    this.roleName = loginUserInfo.roleName
    this.deptName = loginUserInfo.deptName
    this.isLoginOut()
    // if (
    //   this.terminalId &&
    //   this.terminalId !== 'undefined' &&
    //   this.terminalId !== 'null'
    // ) {
    let socketUrl =
      window.SITE_CONFIG.baseUrl +
      'socketServer/' +
      this.userId +
      '/' +
      this.assId
    webSocket.openSocket(socketUrl, _this)
    // }
    this.step = sessionStorage.getItem('testStep')
      ? Number(sessionStorage.getItem('testStep'))
      : 1
    this.controlData = sessionStorage.getItem('controlData')
      ? JSON.parse(sessionStorage.getItem('controlData'))
      : {}
    // }
    this.operating = navigator.platform
    this.fpHTTSrvOpEP = window.SITE_CONFIG.fpHTTSrvOpEP
    this.hostIpLinux = window.SITE_CONFIG.fpHTTSrvOpEPLinux
    this.uploadUrl = window.SITE_CONFIG.downFileUrl
    window.addEventListener('resize', this.resetClientHeight)
    this.resetClientHeight()
  },
  methods: {
    // 保留n位小数不进位
    interception(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
      } else {
        num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    },
    // 考试期间无感拍照
    nonInductive() {
      this.getCompetence()
      setTimeout(() => {
        this.setImage(1)
        console.log('paizhaole')
        this.stopNavigator()
      }, 1000)
    },
    resetClientHeight() {
      this.documentClientHeight = document.documentElement['clientHeight']
      this.controlHight = this.documentClientHeight
    },
    isLoginOut() {
      let params = {
        userId: this.userId,
        assId: this.assId
      }
      initBeforeAuthById(params)
        .then(res => {
          if (res.data.status) {
            if(res.data.data.list[0].assStatus == 1 && res.data.data.list[0].isLimitTime == 0) {
              this.$router.push('/online-exam')
            }else if(res.data.data.list[0].assStatus == 1 && res.data.data.list[0].isLimitTime == 1) {
              userLogout()
                .then(res => {
                  if (res.data.status) {
                    clearLoginInfo()
                    sessionStorage.removeItem('store')
                    sessionStorage.setItem('menuList', '[]')
                    sessionStorage.setItem('permissions', '[]')
                    this.$store.dispatch('user/handleLogOut')
                    this.$router.options.isAddDynamicMenuRoutes = false
                    this.$cookie.set('loginUserInfo', [])
                    this.$router.push('/login')
                    webSocket.closeSocket()
                  // this.$Message.success('退出登录成功')
                  } else {
                  }
                })
                .catch(() => {})
            }
          }
        })
    },
    initBefore() {
      this.isLoading = true
      let params = {
        userId: this.userId,
        assId: this.assId
      }
      initBeforeAuthById(params)
        .then(res => {
          if (res.data.status) {
            this.isLoading = false
            this.beforeData = res.data.data.list[0]
            this.certificationFlag = res.data.data.flag
            if (res.data.data.flag == 2) {
              this.step = 2
              // this.testStepFlag = 1
            }
            if (res.data.data.flag == 0) {
              this.step = 4
              // this.testStepFlag = 0
            }
            this.isAuth = res.data.list[0].isAuth
            this.isLimitTime = res.data.list[0].isLimitTime
            this.examData.startTime = res.data.list[0].startTime
            this.examData.passScore = res.data.list[0].passScore
          } else {
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    // 获取试卷信息
    initPaperData() {
      this.isLoading = true
      let params = {
        assId: this.assId
        // assId: '19f7c6dd1aecf58e5fb65774aa6a00dd'
      }
      initAccessPaperDetails(params)
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            this.summaryList = data.summaryList
            this.totalNum = data.totalNum
            this.totalPoint = data.totalPoint
            this.questionInfo.radioInfo = data.questionInfo.radioInfo
              ? data.questionInfo.radioInfo
              : {
                radioList: []
              }
            this.questionInfo.chexkBoxsInfo = data.questionInfo.chexkBoxsInfo
              ? data.questionInfo.chexkBoxsInfo
              : {
                chexkBoxsList: []
              }
            this.questionInfo.judgeInfo = data.questionInfo.judgeInfo
              ? data.questionInfo.judgeInfo
              : {
                judgeList: []
              }
            this.questionInfo.fillInfo = data.questionInfo.fillInfo
              ? data.questionInfo.fillInfo
              : {
                fillList: []
              }
            this.questionInfo.shortInfo = data.questionInfo.shortInfo
              ? data.questionInfo.shortInfo
              : {
                shortList: []
              }
            this.isLoading = false
          } else {
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    handleSave(data) {
      // this.testStepFlag = 1
      this.point = data.point
      let params = {
        type: 7,
        messageContent: '交卷了',
        toWho: this.controlData.userId
      }
      webSocket.sendMessage(JSON.stringify(params))
      this.step = 5
      if (this.point >= this.examData.passScore) {
        this.isPass = true
      } else {
        this.isPass = false
      }
    },
    handleTime() {
      this.timeNum = 1
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          window.clearInterval(this.countdownInterval)
          this.isSeePaper = true
          let questionInfo = {
            radioInfo: this.calculateRadio(this.questionInfo.radioInfo),
            chexkBoxsInfo: this.calculateChexkBoxs(
              this.questionInfo.chexkBoxsInfo
            ),
            judgeInfo: this.calculateJudgeInfo(this.questionInfo.judgeInfo),
            fillInfo: this.calculateFillInfo(this.questionInfo.fillInfo),
            shortInfo: this.calculateShortInfo(this.questionInfo.shortInfo)
          }
          let total =
            questionInfo.radioInfo.totalPoint +
            questionInfo.chexkBoxsInfo.totalPoint +
            questionInfo.judgeInfo.totalPoint +
            questionInfo.fillInfo.totalPoint +
            questionInfo.shortInfo.totalPoint
          this.theTotal = this.interception(total, 1)
          if (this.theTotal / this.totalPoint > 0.6) {
            this.isQualified = true
          } else {
            this.isQualified = false
          }
          this.step = 5
          let params = {
            userId: this.userId,
            examinePointId: this.controlData.examinePointId, // 成绩管理的id
            point: this.theTotal,
            content: JSON.stringify({
              totalNum: this.totalNum,
              totalPoint: this.totalPoint,
              questionInfo: questionInfo,
              summaryList: this.summaryList
            })
          }
          operateAccessControlPaperInfo(params)
            .then(res => {
              this.$Spin.hide()
              this.imgModal = false
              if (res.data.status) {
                this.$Message.success('提交成功')
                this.checkPaparId = res.data.data.id
                sessionStorage.setItem('checkPaparId', res.data.data.id)
                let params = {
                  type: 7,
                  messageContent: '交卷了',
                  toWho: this.controlData.userId
                }
                webSocket.sendMessage(JSON.stringify(params))
              } else {
              }
            })
            .catch(() => {})
          let subparams = {
            assessmentId: this.assId, // 考核id
            examinePointId: this.controlData.examinePointId, // 成绩管理id
            paperId: this.assessmentInfo.paperId,
            paperName: this.assessmentInfo.paperName,
            point: this.theTotal,
            userId: this.userId
          }
          operatePointInfoSub(subparams)
            .then(res => {
              this.$Spin.hide()
              if (res.data.status) {
              } else {
              }
            })
            .catch(() => {})
        } else {
          this.$Message.error('请检查是否有题目未作答')
        }
      })
    },
    // 查看试卷
    checkPapar() {
      this.examFlag = true
      this.checkPaparId = sessionStorage.getItem('checkPaparId')
      this.isLoading = true
      this.step = 6
      this.questionInfo = {
        radioInfo: {
          radioList: []
        },
        chexkBoxsInfo: {
          chexkBoxsList: []
        },
        judgeInfo: {
          judgeList: []
        },
        fillInfo: {
          fillList: []
        },
        shortInfo: {
          shortList: []
        }
      }
      if (String(this.checkPaparId) === 'null' || !this.checkPaparId) {
        if (
          !sessionStorage.getItem('checkPaparId') ||
          sessionStorage.getItem('checkPaparId') === 'null'
        ) {
          this.$Message.error('查询失败，请前往“成绩管理”模块查看')
          this.isLoading = false
        } else {
          this.checkPaparId = sessionStorage.getItem('checkPaparId')
          this.isSeePaper = true
          let params = {
            // 试卷保存成功返回的id
            id: this.checkPaparId
          }
          initAccessPaperDetailsById(params)
            .then(res => {
              if (res.data.status) {
                var data = res.data.data
                let content = JSON.parse(data.content)
                this.questionInfo.radioInfo = content.questionInfo.radioInfo
                  ? content.questionInfo.radioInfo
                  : {
                    radioList: []
                  }
                this.questionInfo.chexkBoxsInfo = content.questionInfo
                  .chexkBoxsInfo
                  ? content.questionInfo.chexkBoxsInfo
                  : {
                    chexkBoxsList: []
                  }
                this.questionInfo.judgeInfo = content.questionInfo.judgeInfo
                  ? content.questionInfo.judgeInfo
                  : {
                    judgeList: []
                  }
                this.questionInfo.fillInfo = content.questionInfo.fillInfo
                  ? content.questionInfo.fillInfo
                  : {
                    fillList: []
                  }
                this.questionInfo.shortInfo = content.questionInfo.shortInfo
                  ? content.questionInfo.shortInfo
                  : {
                    shortList: []
                  }
                this.summaryList = content.summaryList
                this.totalNum = content.totalNum
                this.totalPoint = content.totalPoint
                this.theTotal = data.point
                this.isLoading = false
              } else {
              }
            })
            .catch(() => {})
        }
      } else {
        this.isSeePaper = true
        let params = {
          // 试卷保存成功返回的id
          id: this.checkPaparId
        }
        initAccessPaperDetailsById(params)
          .then(res => {
            if (res.data.status) {
              this.isLoading = false
              var data = res.data.data
              let content = JSON.parse(data.content)
              this.questionInfo.radioInfo = content.questionInfo.radioInfo
                ? content.questionInfo.radioInfo
                : {
                  radioList: []
                }
              this.questionInfo.chexkBoxsInfo = content.questionInfo
                .chexkBoxsInfo
                ? content.questionInfo.chexkBoxsInfo
                : {
                  chexkBoxsList: []
                }
              this.questionInfo.judgeInfo = content.questionInfo.judgeInfo
                ? content.questionInfo.judgeInfo
                : {
                  judgeList: []
                }
              this.questionInfo.fillInfo = content.questionInfo.fillInfo
                ? content.questionInfo.fillInfo
                : {
                  fillList: []
                }
              this.questionInfo.shortInfo = content.questionInfo.shortInfo
                ? content.questionInfo.shortInfo
                : {
                  shortList: []
                }
              this.summaryList = content.summaryList
              this.theTotal = data.point
            } else {
            }
          })
          .catch(() => {})
      }
    },
    // 转换为式分秒
    getTime(time) {
      let h = parseInt((time / 60 / 60) % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt((time / 60) % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      // if(!h || h === '00') {
      //   return m + ':' + s
      // }else{
      return h + '时' + m + '分' + s + '秒'
      // }
    },
    // 调用权限（打开摄像头功能）
    getCompetence() {
      setTimeout(() => {
        var _this = this
        this.thisCancas = document.getElementById('canvasCamera')
        this.thisContext = this.thisCancas.getContext('2d')
        this.thisVideo = document.getElementById('videoCamera')
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {}
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            var getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              // _this.$Message.error('摄像设备获取失败')
              _this.isCamera = false
              return Promise.reject(
                new Error('getUserMedia is not implemented in this browser')
              )
            } else {
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject)
            })
          }
        }
        var constraints = {
          audio: false,
          video: {
            width: this.videoWidth,
            height: this.videoHeight,
            transform: 'scaleX(-1)'
          }
        }
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ('srcObject' in _this.thisVideo) {
              _this.thisVideo.srcObject = stream
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this.thisVideo.src = window.URL.createObjectURL(stream)
            }
            _this.thisVideo.onloadedmetadata = function (_e) {
              _this.thisVideo.play()
              _this.isCamera = true
            }
          })
          .catch(_err => {
            if (_err) {
              _this.isCamera = false
              _this.$Message.error('请检查摄像设备是否连接正常')
            }
          })
      }, 10)
    },
    //  绘制图片（拍照功能）
    setImage(value) {
      // conosle.log(this.thisVideo)
      var _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(
        _this.thisVideo,
        0,
        0,
        _this.videoWidth,
        _this.videoHeight
      )
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL('image/png')
      this.$nextTick(() => {
        this.cameraUrl = image
        _this.stopNavigator() // 拍完关闭摄像头
        let pparams = {
          fileName: this.name + '训练考核照片',
          filePath: this.cameraUrl,
          userId: this.userId,
          subjectLearnId: this.assId,
          flag: 2 // 1 学习拍照 2 考试照片
        }
        operateSubjectlearnPhotoInfo(pparams)
          .then(({ data }) => {
            this.$Spin.hide()
            if (data.status) {
              if (value !== 1) {
                this.step = 3
                let params = {
                  type: 8,
                  messageContent: '认证完毕',
                  toWho: this.controlData.userId
                }
                webSocket.sendMessage(JSON.stringify(params))
              }
            } else {
            }
          })
          .catch(() => {})
      })
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 关闭摄像头
    stopNavigator() {
      if (this.thisVideo) {
        this.thisVideo.srcObject.getTracks()[0].stop()
      }
    },
    loginOut() {
      if (this.$route.query.assId) {
        this.$router.push('/online-exam')
      } else {
        userLogout()
          .then(res => {
            if (res.data.status) {
              clearLoginInfo()
              sessionStorage.removeItem('store')
              sessionStorage.setItem('menuList', '[]')
              sessionStorage.setItem('permissions', '[]')
              this.$store.dispatch('user/handleLogOut')
              this.$router.options.isAddDynamicMenuRoutes = false
              this.$cookie.set('loginUserInfo', [])
              this.$router.push('/login')
              webSocket.closeSocket()
              this.$Message.success('退出登录成功')
            } else {
            }
          })
          .catch(() => {})
      }
    },
    // 计算单选题
    calculateRadio(data) {
      let params = {}
      let radioList = []
      let totalPoint = 0
      if (data.radioList.length) {
        data.radioList.forEach(item => {
          let actualPoint = 0
          if (item.value === item.answer) {
            actualPoint = item.point || 2
          }
          totalPoint = totalPoint + actualPoint
          radioList.push({
            ...item,
            actualPoint: actualPoint,
            yourAnswer: item.value || '--',
            value: item.answer,
            isRight: actualPoint === item.point
          })
        })
        params = {
          radioList: radioList,
          totalPoint: totalPoint,
          title: data.title
        }
        return params
      } else {
        return {
          ...data,
          totalPoint: 0
        }
      }
    },
    // 计算多选
    calculateChexkBoxs(data) {
      let params = {}
      let chexkBoxsList = []
      let totalPoint = 0
      if (data.chexkBoxsList.length) {
        data.chexkBoxsList.forEach(item => {
          let actualPoint = 0
          let subValue = item.value.sort().join(';')
          if (subValue === item.answer) {
            actualPoint = item.point || 2
          }
          totalPoint = totalPoint + actualPoint
          chexkBoxsList.push({
            ...item,
            actualPoint: actualPoint,
            isRight: actualPoint === item.point,
            yourAnswer: item.value.length ? item.value.sort().join(';') : '--',
            value: item.answer ? item.answer.split(';') : []
          })
        })
        params = {
          chexkBoxsList: chexkBoxsList,
          totalPoint: totalPoint,
          title: data.title
        }
        return params
      } else {
        return {
          ...data,
          totalPoint: 0
        }
      }
    },
    // 计算判断题
    calculateJudgeInfo(data) {
      let params = {}
      let judgeList = []
      let totalPoint = 0
      if (data.judgeList.length) {
        data.judgeList.forEach(item => {
          let actualPoint = 0
          if (item.value === item.answer) {
            actualPoint = item.point || 1
          }
          totalPoint = totalPoint + actualPoint
          judgeList.push({
            ...item,
            isRight: actualPoint === item.point,
            actualPoint: actualPoint,
            yourAnswer: item.value || '--',
            value: item.answer
          })
        })
        params = {
          judgeList: judgeList,
          totalPoint: totalPoint,
          title: data.title
        }
        return params
      } else {
        return {
          ...data,
          totalPoint: 0
        }
      }
    },
    // 计算填空题
    calculateFillInfo(data) {
      let params = {}
      let fillList = []
      let totalPoint = 0
      if (data.fillList.length) {
        data.fillList.forEach(item => {
          let actualPoint = 0
          let answer = item.answer ? item.answer.split(';') : []
          let rightNum = 0
          let a = ''
          let options = []
          item.options.forEach((subItem, subIndex) => {
            if (subItem.value === answer[subIndex]) {
              rightNum++
            }
            a = a ? a + ';' + subItem.value : a + subItem.value
            options.push({
              ...item,
              value: answer[subIndex]
            })
          })
          let num = (rightNum / answer.length) * item.point
          actualPoint = Math.round(num * 10) / 10
          totalPoint = totalPoint + actualPoint
          fillList.push({
            ...item,
            isRight: actualPoint === item.point,
            actualPoint: actualPoint,
            yourAnswer: a || '--',
            value: item.answer,
            options: options
          })
        })
        params = {
          fillList: fillList,
          totalPoint: totalPoint,
          title: data.title
        }
        return params
      } else {
        return {
          ...data,
          totalPoint: 0
        }
      }
    },
    // 计算简答题
    calculateShortInfo(data) {
      let params = {}
      let shortList = []
      let totalPoint = 0
      if (data.shortList.length) {
        data.shortList.forEach(item => {
          let actualPoint = 0
          let answer = item.answer ? item.answer.split(';') : []
          let rightNum = 0
          answer.forEach((subItem, subIndex) => {
            if (item.value.includes(subItem)) {
              rightNum++
            }
          })
          let num = (rightNum / answer.length) * item.point
          actualPoint = Math.round(num * 10) / 10
          // actualPoint = num.toFixed(2).slice(0, -1)
          totalPoint = totalPoint + actualPoint
          shortList.push({
            ...item,
            actualPoint: actualPoint,
            yourAnswer: item.value || '--',
            isRight: actualPoint === item.point,
            value: item.answer
          })
        })
        params = {
          shortList: shortList,
          totalPoint: totalPoint,
          title: data.title
        }
        return params
      } else {
        return {
          ...data,
          totalPoint: 0
        }
      }
    },
    // ======================录入指纹 Windows======================
    // 将数据转换为base64格式
    arrayBufferToBase64(buf) {
      var binary = ''
      var bytes = buf
      var len = bytes.byteLength
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    },

    // 显示字符穿
    submitForm(data) {
      var templateBase64 = this.arrayBufferToBase64(data)
      validationFingerprint({ finger: templateBase64 })
        .then(res => {
          if (res.data.status) {
            // 0无认证方式 1人脸 2指纹 3指纹、人脸
            if (this.certificationFlag === '3') {
              this.getCompetence()
            }
            if (this.certificationFlag === '2') {
              let params = {
                type: 8,
                messageContent: '认证完毕',
                toWho: this.controlData.userId
              }
              webSocket.sendMessage(JSON.stringify(params))
              this.step = 3
            }
            // this.fingerprint = templateBase64
            this.textResult = '识别成功'
          } else {
            this.textResult = '识别失败'
          }
        })
        .catch(() => {})
    },

    // 开始录入指纹
    beginOperation(opName, libName, sendSampleNum) {
      this.fingerprint = null
      var _this = this
      var sampleNum = '1'
      if (sendSampleNum) {
        sampleNum = this.sampleNumList.value

        var checkNum = parseInt(sampleNum)

        if (checkNum < 1 || checkNum > 10 || sampleNum === '') {
          this.$Message.error('录入失败')
          return
        }
      }

      var json = JSON.stringify({
        operation: opName,
        username: '',
        usedlib: libName,
        isoconv: '0',
        samplenum: sampleNum
      })
      this.enableControlsForOp(true)
      this.resultLink.innerHTML = ''

      var req = new XMLHttpRequest()
      req.open('POST', this.fpHTTSrvOpEP)
      req.setRequestHeader('Content-type', 'application/json; charset=utf-8')

      req.onload = function () {
        if (req.status === 200) {
          _this.textResult = '开始录入...'
          _this.parseOperationDsc(JSON.parse(req.response))
        } else {
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function () {
        _this.enableControlsForOp(false)
      }
      req.send(json)
    },

    // 开始
    getOperationState(opId) {
      var _this = this
      var url = this.fpHTTSrvOpEP + '/' + opId
      var req = new XMLHttpRequest()
      req.open('GET', url)
      req.onload = function () {
        if (req.status === 200) {
          if (req.readyState === 4) {
            _this.parseOperationDsc(JSON.parse(req.response))
          }
        } else {
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function () {
        _this.enableControlsForOp(false)
      }
      req.send()
    },

    getOperationImg(opId, frameWidth, frameHeight) {
      var _this = this
      var url = this.fpHTTSrvOpEP + '/' + opId + '/image'
      var req = new XMLHttpRequest()
      req.open('GET', url)
      req.onload = function () {
        if (req.status === 200) {
          _this.drawFingerFrame(
            new Uint8Array(req.response),
            opId,
            frameWidth,
            frameHeight
          )
          // submitForm(new Uint8Array(req.response));//指纹图像RAW数据转化为BASE64字符 传送给服务器端保存原始指纹数据,如果保存BMP文件需要加入头文件
        } else {
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function () {
        _this.enableControlsForOp(false)
      }
      req.send()
      req.responseType = 'arraybuffer'
    },
    linkOperationTemplate(opId, operationName) {
      var _this = this
      var target = '/template'
      var url = this.fpHTTSrvOpEP + '/' + opId + target
      var req = new XMLHttpRequest()
      req.open('GET', url)
      req.onload = function () {
        if (req.status === 200) {
          if (req.readyState === 4) {
            _this.submitForm(new Uint8Array(req.response)) // 特征码转化为BASE64字符 传送给服务器端比对
          }
        } else {
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function () {
        _this.enableControlsForOp(false)
      }
      req.send()
      req.responseType = 'arraybuffer'
    },

    deleteOperation(opId) {
      var url = this.fpHTTSrvOpEP + '/' + opId
      this.deleteVerb(url)
    },

    parseOperationDsc(opDsc) {
      var res = true
      var _this = this
      if (opDsc.state === 'done') {
        _this.enableControlsForOp(false)
        if (opDsc.status === 'success') {
          _this.linkOperationTemplate(opDsc.id, opDsc.operation)
        }

        if (opDsc.status === 'fail') {
          _this.$Message.error('指纹机识别失败')
          _this.textResult = '指纹机识别失败'
          res = false

          if (parseInt(opDsc.errornum) !== -1) {
            _this.deleteOperation(opDsc.id)
          }
        }
      } else if (opDsc.state === 'init') {
        _this.lastInitOp = opDsc.id
        setTimeout(_this.getOperationState, 1000, opDsc.id)
        setTimeout(
          _this.getOperationImg,
          1000,
          opDsc.id,
          parseInt(opDsc.devwidth),
          parseInt(opDsc.devheight)
        )
      } else if (opDsc.state === 'inprogress') {
        if (opDsc.fingercmd === 'puton') {
          _this.textResult = '请按压机器指纹感应区'
        }
        if (opDsc.fingercmd === 'takeoff') {
          _this.textResult = '请将手指移出指纹感应区'
        }

        setTimeout(_this.getOperationState, 1000, opDsc.id)
        setTimeout(
          _this.getOperationImg,
          1000,
          opDsc.id,
          parseInt(opDsc.devwidth),
          parseInt(opDsc.devheight)
        )
      }

      return res
    },

    drawFingerFrame(frameBytes, opId, frameWidth, frameHeight) {
      var _this = this
      var ctx = _this.fingerFrame.getContext('2d')
      var imgData = ctx.createImageData(
        _this.fingerFrame.width,
        _this.fingerFrame.height
      )

      for (var i = 0; i < frameBytes.length; i++) {
        // red
        imgData.data[4 * i] = 255 - frameBytes[i]
        // green
        imgData.data[4 * i + 1] = 255 - frameBytes[i]
        // blue
        imgData.data[4 * i + 2] = 255 - frameBytes[i]
        // alpha
        imgData.data[4 * i + 3] = 255
      }

      ctx.putImageData(
        imgData,
        0,
        0,
        0,
        0,
        _this.fingerFrame.width,
        _this.fingerFrame.height
      )
    },

    deleteVerb(url) {
      var req = new XMLHttpRequest()
      req.open('DELETE', url)
      req.onload = function () {
        if (req.status === 200) {
        } else {
          this.$Message.error('指纹录入设备连接失败')
        }
      }
      req.onerror = function () {}
      req.send()
    },

    put(url) {
      var req = new XMLHttpRequest()
      req.open('PUT', url)
      req.onload = function () {
        if (req.status !== 200) {
        }
      }
      req.onerror = function () {}
      req.send()
    },

    // 控制按钮显示
    enableControls() {
      this.btnEnrollAnsi.disabled = false
    },

    // 控制按钮显示或者隐藏
    enableControlsForOp(opBegin) {
      this.btnEnrollAnsi.disabled = opBegin
    },

    CheckFPHttpSrvConnection() {
      var _this = this
      var req = new XMLHttpRequest()
      req.open('GET', this.fpHTTSrvOpEP)
      req.onload = function () {
        if (req.status === 200) {
          _this.enableControls()
        } else {
          // _this.fixError(req.statusText, 'Server response')
        }
      }
      req.onerror = function () {
        setTimeout(this.CheckFPHttpSrvConnection, 1000)
      }
      req.send()
    },
    // 准备工作
    onBodyLoad() {
      this.btnEnrollAnsi = document.getElementById('EnrollBtnANSI')
      // this.btnEnrollFTR = document.getElementById('EnrollBtnFTRAPI')
      // this.btnCapture = document.getElementById('CaptureBtn')
      // this.btnCancel = document.getElementById('CancelBtn')
      // this.btnEnrollFTRIdn = document.getElementById('EnrollIdnBtnFTRAPI')
      // this.textResult = document.getElementById('result') // 提示信息
      this.testUserName = document.getElementById('txtUserName')
      this.fingerFrame = document.getElementById('fingerframe')
      this.resultLink = document.getElementById('resultLink')
      // this.checkBoxConvToISO = document.getElementById('ConvIsoCheckBox')
      this.sampleNumList = document.getElementById('sampleNumList')
      var defImg = new Image()
      defImg.onload = function () {
        var context = this.fingerFrame.getContext('2d')
        context.drawImage(defImg, 0, 0)
      }
      defImg.src = 'defframe.png'

      this.CheckFPHttpSrvConnection()
    },
    // ==========================录入指纹linux系统================
    // 取消指纹采集
    cancelCapture() {
      var url =
        this.hostIpLinux + ':15871/BTbioonline/fingerprint/cancelCapture'
      this.cancelDoHttpGetOperation(url)
    },
    // 获取指纹
    cancelDoHttpGetOperation(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url, {
            headers: {
              token: this.$cookie.get('token'),
              'Content-Type': 'json',
              async: false
            }
          })
          .then(res => {})
      })
    },
    // 获取指纹
    doHttpGetOperation(url) {
      return new Promise((resolve, reject) => {
        axios
          .get(url, {
            headers: {
              token: this.$cookie.get('token'),
              'Content-Type': 'json',
              //   dataType: 'json',
              async: false
            }
          })
          .then(res => {
            if (res.data.error) {
              this.$Message.error('指纹录入设备连接失败')
              this.textResult = '指纹录入设备连接失败'
              return
            } else {
              this.textResult = '请按压机器指纹感应区'
              this.fingerImgUrlLinux =
                'data:image/jpeg;base64,' + res.data.data.jpg_base64
            }
            setTimeout(() => {
              this.getTemplate()
            }, 1000)
            // this.getTemplate()
          })
          .catch(error => {
            if (error) {
              this.textResult = '指纹录入设备连接失败'
              this.$Message.error('指纹录入设备连接失败，请检查')
            }
          })
      })
    },
    // 点击按钮开始采集指纹
    beginVerifyCapture() {
      var url =
        this.hostIpLinux + ':15871/BTbioonline/fingerprint/beginCapture?type=0'
      this.textResult = '开始录入...'

      this.doHttpGetOperation(url) // 获取指纹信息返回的是base64 图片格式
    },
    // 转换为前后台校验的
    getTemplate() {
      var url = this.hostIpLinux + ':15871/BTbioonline/fingerprint/getTemplate'
      this.doHttpGetOperationTemplate(url).then(res => {
        // var base64Data = res.data.jpg_base64
      })
    },
    doHttpGetOperationTemplate(url) {
      let _this = this
      return new Promise((resolve, reject) => {
        axios
          .get(url, {
            headers: {
              token: this.$cookie.get('token'),
              'Content-Type': 'json',
              //   dataType: 'json',
              async: false
            }
          })
          .then(res => {
            let templateBase64 = res.data.data.jpg_base64
            if (templateBase64) {
              // this.$Message.success('指纹录入成功')
            } else {
              this.$Message.error('指纹录入失败')
              return
            }
            validationFingerprint({ finger: templateBase64 })
              .then(res => {
                if (res.data.status) {
                  // 0无认证方式 1人脸 2指纹 3指纹、人脸
                  if (this.certificationFlag === '3') {
                    setTimeout(() => {
                      _this.getCompetence()
                    }, 500)
                    this.getCompetence()
                  }
                  if (this.certificationFlag === '2') {
                    let params = {
                      type: 8,
                      messageContent: '认证完毕',
                      toWho: this.controlData.userId
                    }
                    webSocket.sendMessage(JSON.stringify(params))
                    this.step = 3
                  }
                  this.textResult = '识别成功'
                } else {
                  this.textResult = '识别失败'
                }
              })
              .catch(() => {})
          })
      })
    },

    // 将base64转换为blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    previewImg(value) {
      this.imgModal = true
      this.previewUrl = this.uploadUrl + value
    },
    closePreview() {
      this.imgModal = false
    }
  },
  beforeDestroy() {
    webSocket.closeSocket()
    if (this.thisVideo) {
      this.thisVideo.srcObject.getTracks()[0].stop()
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';

/deep/ .ivu-form-item {
  margin-bottom: 20px !important;
}

/deep/ .ivu-form-item-error-tip {
  padding-top: 0 !important;
}

/deep/ .ivu-radio-wrapper {
  margin-right: 20px !important;
  margin-left: 15px;
}

/deep/ .ivu-checkbox-wrapper {
  margin-right: 20px !important;
  margin-left: 15px;
}

/deep/ .ivu-input-wrapper {
  margin-left: 15px !important;
}

/deep/ .ivu-modal-content {
  background-color: rgba(0, 0, 0, 0) !important;
  text-align: center;
  box-shadow: none !important;

  img {
    margin-top: 5vh;
    max-height: 70vh;
  }

  .ivu-icon-ios-close {
    color: #fff;
  }
}
</style>
