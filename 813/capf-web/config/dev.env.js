'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})

// 开发环境开启mock
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOCK: 'true',
})