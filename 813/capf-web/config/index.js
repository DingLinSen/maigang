"use strict";
const path = require("path");

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    proxyTable: {},
    host: "0.0.0.0",
    port: 8088,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,

    /**
     * Source Maps
     */
    devtool: "cheap-module-eval-source-map",
    useEslint: true,
    cacheBusting: false,
    cssSourceMap: false
  },
  build: {
    index: path.resolve(__dirname, "../dist/index.html"),
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "static",
    assetsPublicPath: "",

    /**
     * Source Maps
     */
    // 屏蔽后成功打包
    productionSourceMap: false,
    productionGzipExtensions: ["js", "css"],
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
