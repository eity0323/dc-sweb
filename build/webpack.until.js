/**
 * 自动生成文件路径
 */


const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const md5 = require('md5')
const resolve = function (_path) {
  return  path.resolve(path.resolve( __dirname, '../'), _path)
}
const cfg = require('./webpack.cfg')
// 判断当前页面是否包含CommonJsChunk
function getCommonJsChunk(chunkName) {
  if (!cfg.commonJs) return []
  // 无commonCss.exclude，所有页面包含
  if(!cfg.commonJs.exclude) return  'commonJs'
  //  有commonCss.exclude，不包含在该数组的页面引用
  if(cfg.commonJs.exclude && !cfg.commonJs.exclude.includes(chunkName)) return 'commonJs'
  // 其他
  return []
}

let until = {
  resolve,
  // 检索文件
  getFileList(targetPath) {
    let fileList = []
    const _getFileList = function (targetPath) {
      let dirFileList = fs.readdirSync(targetPath)
      return dirFileList.forEach(filename => {
        // 排除下划线开头的所有文件和文件夹
        if (/^_/.test(filename)) return
        let _path = path.resolve(targetPath, filename)
        if (fs.statSync(_path).isDirectory()) {
          _getFileList(_path)
        } else {
          fileList.push({ filepath: _path, filename })
        }
      })
    }
    _getFileList(targetPath)
    return fileList
  },
  // 样式文件配置
  styleLoader: [
    'css-loader?sourceMap', // 将 CSS 转化成 CommonJS 模块
    // 添加浏览器前缀
    'postcss-loader?sourceMap'].concat(
      cfg.px2rem ? {
        loader: 'px2rem-loader',
        options: cfg.px2rem
      } : [],
      {
        loader: 'sass-loader',
        // options: {
          // sourceMap: true,
          // data: '@import "src/style/global.scss";'// 默认添加的scss样式
        // }
      }
    ),
  // 检索入口文件
  getEntries(argv) {
    let targetPath = resolve('./src/pages')
    let entries = until.getFileList(targetPath)
    let entry = {}
    let key
    entries.forEach((file) => {
      if (/.js$/.test(file.filename)) {
        key = file.filepath.replace(targetPath, '').replace(/.js$/, '')
        key = md5(key+'.')
        entry[key] = file.filepath
      }else if(/.ts$/.test(file.filename)) {
        key = file.filepath.replace(targetPath, '').replace(/.ts$/, '')
        key = md5(key+'.')
        entry[key] = file.filepath
      }
    })
    // console.log('【入口文件】')
    // console.log(entry)
    return entry
  },
  // 检索html页面
  getHtmlWebpackPlugins(argv) {
    let targetPath = resolve('./src/pages')
    let htmls = until.getFileList(targetPath)
    let HtmlWebpackPlugins = []
    htmls.forEach((file) => {
      let chunkName
      var reg = /\.[^.]+$/
      const reg1 = /(?:html|pug)$/ // 过滤非html文件
      if (reg.test(file.filename)&&reg1.test(file.filename)) {
        // console.log('1515f15e1fe-----------',file.filename)
        chunkName = file.filepath.replace(targetPath, '').replace(reg1, '')
        chunkName = md5(chunkName)
        // console.log(chunkName)
        // console.log('.' + file.filepath.replace(targetPath, '').replace(reg, '.html'))
        HtmlWebpackPlugins.push(
          new HtmlWebpackPlugin({
            baseTagUrl: '../',
            template: file.filepath,
            filename: '.' + file.filepath.replace(targetPath, '').replace(reg, '.html'),
            chunks: [chunkName].concat(getCommonJsChunk(chunkName)).concat(argv.mode === 'production' ? ['vendor', 'commons', 'manifest'] : []),
            inject: true,
            minify: argv.mode !== 'production' ? undefined : {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true,
              minifyCSS: true,
              minifyJS: true,
              // more options:
              // https://github.com/kangax/html-minifier#options-quick-reference
            },
          })
        )
      }
    })
    return HtmlWebpackPlugins
  }
}


module.exports = until

