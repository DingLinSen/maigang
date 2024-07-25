// https://github.com/michael-ciniawsky/postcss-load-config

// module.exports = {
//   'plugins': {
//     'postcss-import': {},
//     'postcss-url': {},
//     // to edit target browsers: use 'browserslist' field in package.json
//     'autoprefixer': {
//       browsers: ['Android >= 4.0', 'iOS >= 7']
//     },
//     'postcss-pxtorem': {
//       rootValue: 75, //结果为：设计稿元素尺寸/75，比如元素宽750px,最终页面会换算成 10rem
//       propList: ['*'],
//       selectorBlackList: [ // 对css选择器进行过滤的数组
//         '.el-',
//         '.ivu-',
//         '.vux-',
//         '.weui-',
//         '.scroller-',
//         '.dp-',
//         '.mt-',
//         '.mint-'
//       ],
//       replace: true,
//       mediaQuery: false,
//       minPixelValue: 16 // 所有小于12px的样式都不被转换
//     }
//   }
// }

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
