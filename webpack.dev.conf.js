const webpack = require('webpack');
const path = require("path");
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin  = require('html-webpack-plugin');
const copyWebpackPlugin  = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

//css单独打包处理
const MiniCssExtractPlugin = require('mini-css-extract-plugin');



//动态添加入口
function getEntry(){
    var entry = {};
    //读取src目录所有pages入口
    glob.sync('./src/pages/**/*.js').forEach(function(name){
        var start = name.indexOf('src/') + 4;
        var end = name.length - 3;
        var eArr = [];
        var n = name.slice(start,end);
        n= n.split('/')[1];
        eArr.push(name);
        //eArr.push('babel-polyfill');//引入这个，是为了用async await，一些IE不支持的属性能够受支持，兼容IE浏览器用的
        entry[n] = eArr;
    })
    return entry;
}



//动态生成html
//获取html-webpack-plugin参数的方法
const getHtmlConfig = function(name,chunks,template){
    return {
        template:template,
        filename:`pages/${name}.html`,
        hash:false,
        chunks:[name],
        inject:true,//脚本写在那个标签里,默认是true(在body结束后
    }
}


module.exports = {
    // 配置入口
    entry: getEntry(),
    // 配置出口
    output:{
        publicPath:'/',
        path:path.resolve(__dirname,'./build'),
        filename:'js/[name]-bundle.js',
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),//热更新
        new copyWebpackPlugin([{ from: 'localQuickPurchase/**', to: './' },{ from: 'static/favicon.ico', to: './', toType: 'dir' },
            { from: 'job-admin/**', to: './' },{ from: 'cart/**', to: './' },{ from: 'upms/**', to: './' },{ from:'goods/**', to:'./' },{ from:'common/**', to:'./' }]),
        new webpack.ProvidePlugin({//全局可以拿到$ 直接用
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        //时时清理更新后上一次文件
        new CleanWebpackPlugin(),
        //css单独打包处理
        new MiniCssExtractPlugin({
            filename:'css/[name].css',
            // chunkFilename: '[id].css'
        }),
        // 压缩输出的 JS 代码
        new UglifyJsPlugin()
    ],
    module: {
        rules:[
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                // issuer: { test, include, exclude },
                loader: "babel-loader",//es6 to es5
            },

            //{test: /.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader',use: 'css-loader'})},/*解析css, 并把css变成文件通过link标签引入*/
            {test: /\.css$/, use: ['style-loader', {loader: MiniCssExtractPlugin.loader,},{ loader: 'css-loader', options: { importLoaders: 1 } }, {loader: "postcss-loader",options:{plugins:[autoprefixer({browsers: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']})]}}]},
            {test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader']},/*解析less, 把less解析成浏览器可以识别的css语言*/
            {test: /\.vue$/, loader: 'vue-loader'  },
            {
                test: /\.(png|jpg|gif|jpeg|ttf|woff2|woff|eot|svg)\??.*$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/fonts/[name].[hash:7].[ext]'
                    }
                }]
            }
        ]
    },
    resolve:{
        //省略后缀
        extensions: ['.js', '.vue', '.json'],
        //配置别名
        alias:{
            'vue$':path.resolve(__dirname,'node_modules/vue/dist/vue.esm.js')
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "./build"),
        publicPath:'/',
        host: "192.168.1.145",//服务运行地址
        port: "8081",//设置端口号
        watchOptions: {
            aggregateTimeout: 300
        },

        lazy: false, //不启动懒加载
        overlay: true, // 浏览器页面上显示错误
        open: true, // 开启自动打开浏览器
        stats: "errors-only", //stats: "errors-only"表示只打印错误：
        hot: true, // 开启热更新
        inline: true , // 实时刷新
        compress:true ,//压缩
        disableHostCheck: true,
        //跨域请求
        proxy: [{
            context: [
                '/localQuickPurchase/([0-9A-Za-z/\-]+)',
                '/localQuickPurchase/([0-9A-Za-z/\-]+).jsp',
                '/cart/([0-9A-Za-z/\-]+)',
                '/upms/([0-9A-Za-z/\-]+)',
                '/goods/([0-9A-Za-z/\-]+)',
                '/search/([0-9A-Za-z/\-]+)'
            ],
            target: 'fxyhjts.520shq.com',
            // target: 'http://192.168.1.223:10006' ,
            // pathRewrite: {'^/api' : ''},
            changeOrigin: true,
            secure: false
        }],
    }

};


//配置页面
var entryObj = getEntry();
var htmlArray = [];
Object.keys(entryObj).forEach(function(element){
    let templateStr = entryObj[element][0];
    templateStr = templateStr.replace('js','html');
    htmlArray.push({
        _html:element,
        title:'',
        chunks:[element],
        template:templateStr
    })
});


//自动生成html模板
htmlArray.forEach(function(element){
    module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html,element.chunks,element.template)));
})