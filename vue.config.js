/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const path = require('path')
// const defaultSettings = require('./src/settings.js')
// const webpack = require('webPack')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: process.env.DEPLOY_ENV === 'GH_PAGES'
    ? '/admin-one-vue-tailwind/'
    : '/',

  // Remove moment.js from chart.js
  configureWebpack: config => {
    return {
      externals: {
        moment: 'moment'
      },
      resolve: {
        alias: {
          '@': resolve('src')
        }
      }
    }
  }
}
