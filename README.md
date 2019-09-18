
### 1.1 环境 
- npm>4.0.0  
- node>8.0.0 

### 1.2 安装依赖
```
npm i
```
### 1.3 进入开发模式
```
npm run dev
```

### 1.4 打包
```
npm run build
```
### 1.6 项目目录
```
|- src	开发目录
 |- assets	资源目录
	|- img 	图片
 |- components	模块组件目录
 |- js	项目公共js文件
 |- libs	使用到的第三方库
 |- style	公共样式文件
 |- pages	多页面项目中存放页面
	|- index.html 一个页面
	|- index.js 当前页面的js
|- static	静态资源目录
```
### 1.8 配置文件
详见根目录下`webpack.cfg.js`

## 2、功能简介
### 2.1 开发模式
- 多页面开发，支持vue
- 支持无需引入即可全局使用的`global.scss`
- 支持px2rem
- `src/pages`中的html（或pug）文件和`src/pages`中的js（入口）文件,在同一个文件夹中并且名称相同
- 新增页面，需要重新运行`npm run dev`
- html，css，js 更改自动刷新
- scss，es6+，pug支持
- 支持代理配置

### 2.2 关于图片资源
- 图片不要放在`/static`文件下，而是放在`/assets`。
  - 因为html中img标签的`src`如果是绝对路径则会被定为到`src`目录下，无法引用到`static`目录下
  - css中图片如果以`/static`路径开头，会不经过`url-loader`所处理


- html中的img标签`src`对应图片可以被`url-loader`所处理
  - 第一种方式是`相对html路径`
  - 第二种方式以`/assets`开头的绝对路径，自动定位到`src/assets`目录下
  - 第三种种方式以`~@/assets`开头的绝对路径，自动定位到`src/assets`目录下

- csss中的背景图写法
  - 第一种方式是`相对css文件的相对路径`
  - 第二种种方式以`~@/assets`开头的绝对路径，自动定位到`src/assets`目录下

### 2.3 打包相关
- 为了css文件图片路径完美生成`相对路径`，会被打包成奇怪的图片路径`../../static/img/xxx.jpg`
- 打包cdn路径一键配置
- 静态文件目录`static`文件夹，打包会被拷贝到dist目录
- 支持打包文件版本hash，提取`vendor.js` `common.js` `[page].js`文件，只对模块更改的css，js文件版本hash进行更改
  - `vendor.js`是指`/node_modules`文件夹中引用的第三方插件
  - `common.js`是指被多个页面引用超过2次并且，大小超过20k时，才会生成
  - `[page.js]`对应着每个页面独自的js文件 
- css文件单独提取
- 小于8k图片文件和字体文件自动转base64代码
- pages多级目录支持（忽略下划线开头的文件和文件夹）
  - 当配置文件`webpack.cfg.js`中`build.assetsPublicPath === './' `，二级目录以上页面需要在页面中，增加`<base>`标签进行修正相对路径。如`src/pages/test/test-0.html`中的`<head>`中的`<base href="../" />`
  - 当配置文件`webpack.cfg.js`中`build.assetsPublicPath === '/' `, 则路径为绝对路径，无需修正路径
  - `__webp__.js` 处理兼容web图片

- 页面共有css文件入口支持
```
commonCss:{
    entry: path.resolve(path.resolve(__dirname, '../'),'src/js/common_entry.js'), // String 必填，入口文件，绝对地址
    exclude:['about'] // Arrary 排除页面，不填所有页面都引入common_css
    // ['about'] 代表about页面不引用 common_css
  },
```