import { reactive, unref } from 'vue'
// 状态
const projectStatus = reactive<any>([
    {
        label: '未审核',
        value: '1'
    },
    {
        label: '已通过',
        value: '2'
    },
    {
        label: '已驳回',
        value: '3'
    }
])
//获取项目状态
const getProjectStatusLabel = (status: string) => {
    let statusLabel = ''
    unref(projectStatus).map((item: any) => {
        if (status === item.value) {
            statusLabel = item.label
        }
    })
    return statusLabel
}

export {
    projectStatus, getProjectStatusLabel
}



