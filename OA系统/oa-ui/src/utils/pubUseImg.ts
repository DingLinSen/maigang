// 获取assets静态资源
const getAssetsFile = (url: string) => {
  return new URL(`../assets/homeImgs/个人档案审批.png`, import.meta.url).href
}

export default getAssetsFile
