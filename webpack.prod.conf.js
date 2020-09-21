const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin  = require('html-webpack-plugin');
const copyWebpackPlugin  = require('copy-webpack-plugin');

const path = require("path");

module.exports = {
    // 配置入口
    entry: {
        index: './src/page/goods/index.js',
        login: './src/page/upms/login.js', 
        cutprice: './src/page/view/main.js'
    },
    // 配置出口
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/[name].js'
    },
    plugins: [
       new CleanWebpackPlugin(['build']),
       new webpack.HotModuleReplacementPlugin(),
       new copyWebpackPlugin([{ from: 'localQuickPurchase/**', to: './' },{ from: 'static/favicon.ico', to: './', toType: 'dir' },]),
        new htmlWebpackPlugin ({ 
            template: './src/page/goods/index.html',
            filename: 'index.html',
            inject: 'head',
            // minify: {//压缩html
            //     collapseWhitespace: true,//去除空格
            //     removeComments: true //去除注释
            // },
            chunks: ['index']
        }),
		new htmlWebpackPlugin({
            template: './src/page/view/cutprice.html',
            filename: 'cutprice.html',
            inject: 'body',
            // minify: {//压缩html
            //     collapseWhitespace: true,//去除空格
            //     removeComments: true //去除注释
            // },
            chunks: ['cutprice']
        })
    ],
    
    module: {
        rules:[
            { 
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src")
                  ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
               // issuer: { test, include, exclude },
                loader: "babel-loader",
                options: {
                    presets: ["latest"]
                  }
            
            },
           
             //{test: /.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader',use: 'css-loader'})},/*解析css, 并把css变成文件通过link标签引入*/
            {test: /\.css$/, use: ['style-loader', { loader: 'css-loader', options: { importLoaders: 1 } }, 'postcss-loader']},
            {test: /\.(jpg|png|gif|svg)$/i, use: [  { loader:'url-loader', options: {limit: 8192 , name: 'assets/img/[name]-[hash:5].[ext]'}},'image-webpack-loader'] },/*解析图片*/
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},/*解析less, 把less解析成浏览器可以识别的css语言*/
            {test: /\.vue$/, loader: 'vue'},
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "build"),
        publicPath:'/',
        host: "0.0.0.0",//服务运行地址
        port: "80",//设置端口号
        watchOptions: {
            aggregateTimeout: 300
        },
        lazy: false, //不启动懒加载
        overlay: true, // 浏览器页面上显示错误
       // open: true, // 开启自动打开浏览器
        stats: "errors-only", //stats: "errors-only"表示只打印错误：
        hot: true, // 开启热更新
        inline: true ,
         compress:true ,//压缩
         proxy: {
             '/localQuickPurchase/([0-9A-Za-z/\-]+)': {
                 target: 'http://192.168.1.191:8003',
                // pathRewrite: {'^/api' : ''},
                 changeOrigin: true,
                 secure: false
               },
               '/upms/([0-9A-Za-z/\-]+)': {
                target: 'http://192.168.1.191:8003',
               // pathRewrite: {'^/api' : ''},
                changeOrigin: true,
                secure: false
              },
              '/goods/([0-9A-Za-z/\-]+)': {
               target: 'http://192.168.1.191:8003',
              // pathRewrite: {'^/api' : ''},
               changeOrigin: true,
               secure: false
             },
             '/search/([0-9A-Za-z/\-]+)': {
              target: 'http://192.168.1.191:8003',
             // pathRewrite: {'^/api' : ''},
              changeOrigin: true,
              secure: false
            }
               
         }
    } 

};



