module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 14,
      propList: ['*'],
      minPixelValue: 2 // (Number) 设置要替换的最小像素值.
    }
  }
}
