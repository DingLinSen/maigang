<template>
  <FileUploader
    showTitle="产品方案"
    flag="mgPropertyRightsPlan"
    :tableObject="tableObject"
    auth="poduct"
    @get-list="getFileList"
    @set-search-params="setFileSearchParams"
  />
</template>
<script lang="ts" setup>
import { FileUploader } from '@/components/FileUploader'
import { getFilesListApi } from '@/api/school/product'
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
