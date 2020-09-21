
## 项目启动
In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br />
运行在自己本地ip<br />
Open [http://localhost:3002](http://localhost:3002) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## 线上打包发布

### `npm run prod`
 所有文件都打包到build目录下

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## 爱之家前端项目
####历史项目 本地需要启动后台四个模块    
  EurekaApplication 注册中心<br />
  GatewayApplication 网关<br />
  OldApplication 主要业务<br />
  UpmsApplication 用户模块 用户登录
  
    1. 历史原因
        1). 首页
            地址 /localQuickPurchase/distributionVA/index
        2). 分类
            地址 /localQuickPurchase/distributionVA/classify/classify
        3). 发圈 
            地址 /localQuickPurchase/distributionVA/propagandaCircle/propagandaCircleHomePage
    这些模块都放融合在后端jsp 服务端渲染，
    jquery 一把梭    哈哈 
    
    2. 老项目启动可不用webpack起本地
        需要后台项目启动本地服务 并且需要配置nginx代理转发
          

## 前端项目结构说明
    1). cart
        对应后端cloud-cart模块
    2). common
         font -> 第三方font字体
         images -> 静态资源图片
         js 第三方工具类
         lib 第三方js库 包括jq hui swiper 
    3). config
        webpack4.0可以全部配置在 根目录下webpack.dev.congig.js内
        如果你想分开配置 可以用得到 先留着这个config也行
    4). goods
        商品模块 不多说
    5). job-admin
        有一些   404 500页面
        但是又有引入了一些第三方库 比如jq 增加了打包体积
    6). localQuickPurchase
        后期新增的页面基本都放在了此文件夹
        技术栈 基本都是jq一把梭
        还有部分页面 引入了vue 也是在HTML里 静态引入 
    7). upms
        用户模块/包括登录               

## multi-pages vue多页面开发
 
 
###划重点敲黑板 以上都是介绍项目历史结构的废话 
###a).后续新增业务开发 可使用vue multi-pages 开发
###b).项目采用webpack打包 已配置Es6转Es5 babel 可使用最新语法糖
###c).每一个页面引入promise阿里cdn 支持async await
    <script src="https://as.alipayobjects.com/g/component/fastclick/1.0.6/fastclick.js"></script>
    <script>
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {//防止移动端 点击延迟
                FastClick.attach(document.body);
            }, false);
        }
        if(!window.Promise) {
            document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"'+'>'+'<'+'/'+'script>');
        }
    </script>
###d). src多页面结构
        cloudweb
          |---src
            |--- api  对axios二次封装  并统一做失败code处理
            |---assets 资源
            |---components组件
            |---utils 常用工具类（封装一个类并导出 后续新增只需在原型链上新加方法即可）
            |---filters 常用过滤器 
            |---pages各个模块 一个页面对应一个模块
              |---index    index模块
                |---index.html
                |---index.js
                |---index.vue
                |---index.less
              |---info       info模块
                |---info.html
                |---info.js
                |---info.vue  
                |---info.less      
#####e) npm run dev启动项目后 http://localhost:3002/pages/demo.html   对应src/pages下demo模块页面                