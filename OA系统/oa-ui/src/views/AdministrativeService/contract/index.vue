<template>
  <FileUploader
    showTitle="合同管理"
    flag="mgCooperationAgreement"
    :tableObject="tableObject"
    auth="contract"
    @get-list="getFileList"
    @set-search-params="setFileSearchParams"
  />
</template>
<script lang="ts" setup>
import { FileUploader } from '@/components/FileUploader'
import { getFilesListApi } from '@/api/AdministrativeService/contract'
import { InductionData } from '@/api/person/employManage/types'
import { useTable } from '@/hooks/web/useTable'
const { tableObject, methods } = useTable<InductionData>({
  getListApi: getFilesListApi,
  response: {
    list: 'data',
    total: 'total'
  },
  defaultParams: {
    id: '0'
  }
})
tableObject.pageSize = 9999
const { getList, setSearchParams } = methods
const getFileList = () => {
  getList()
}
const setFileSearchParams = (data) => {
  setSearchParams(data)
}
</script>
