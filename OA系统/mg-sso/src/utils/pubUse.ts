// 获取assets静态资源
const getAssetsFile = (url: string) => {
  console.log('url', url)

  return new URL(`../assets/imgs/${url}`, import.meta.url).href
}

export default getAssetsFile
