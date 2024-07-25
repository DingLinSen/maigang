/**
 * 开发环境
 */
;(function() {
  window.SITE_CONFIG = {}
  window.SITE_CONFIG['baseUrl'] = 'http://localhost:8888/' // 本地模块服务访问路径
  // window.SITE_CONFIG['baseUrl'] = 'https://192.168.150.100:8888/' // 本地模块服务访问路径
  // window.SITE_CONFIG['baseUrl'] = 'https://192.168.150.66:8888/' // 测试环境服务访问路径
  window.SITE_CONFIG['uploadImage'] = 'https://192.168.150.38:8099/static/' // 图片地址
  window.SITE_CONFIG['downFileUrl'] = 'https://192.168.150.66:80/static/'
  window.SITE_CONFIG['downFileUrlSub'] = 'https://192.168.150.66:80' // 注意与上边相比较
  window.SITE_CONFIG['fpHTTSrvOpEP'] = 'http://127.0.0.1:15170/fpoperation' // windows指纹机地址
  window.SITE_CONFIG['fpHTTSrvOpEPLinux'] = 'http://127.0.0.1' // 指纹机地址linux

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] =
    window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
