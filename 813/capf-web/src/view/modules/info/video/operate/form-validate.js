/**
 * 验证 datamanagement - ${comments} - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
 import { supportNormal } from '@/utils/validate'
 module.exports = function(_this) {
   return {
     title: [
       {
         required: true,
         message: '请输入视频标题',
         transform: value => (value ? value.trim() : ''),
         trigger: 'blur'
       },
       {
         validator: (rule, value, callback) =>
         supportNormal(rule, value, callback, '请不要输入特殊字符'),
         trigger: 'blur'
       }
     ],
     type: [
       { required: true, message: '请选择课目类型', trigger: 'change' },
       { required: true, message: '请选择课目类型', trigger: 'blur' }
     ],
     subjectId: [
       { required: true, message: '请选择课目名称', trigger: 'change' },
       { required: true, message: '请选择课目名称', trigger: 'blur' }
     ],
     chapterId: [
       { required: true, message: '请选择章节', trigger: 'change' },
       { required: true, message: '请选择章节', trigger: 'blur' }
     ],
     introduction: [
       {
         required: true,
         message: '请输入视频简介',
         transform: value => (value ? value.trim() : ''),
         trigger: 'blur'
       }
     ],
     filePath: [
       {
         required: true,
         message: '请选择上传文件',
         trigger: 'change'
       }
     ]
   }
 }
 