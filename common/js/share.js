
/**
 * 微信自带分享 样式优化
 * @param title  标题
 * @param desc   描述
 * @param link   分享链接
 * @param thumbnail  缩略图
 */
function initConfig(title,desc,link,thumbnail){
    $.ajax({
        type : "get",// 定义提交的类型
        url : "/localQuickPurchase/shareQRCode/getShareStr",
        //traditional :true,
        //contentType : "application/json;charset=utf-8",
        dataType : "json",// 设置返回值得类型
        data : {
            url:encodeURI(link)
        },
        async : true,// 是否异步请求，false为同步
        success : function(respone) {// 成功返回值执行函数
            if (respone.code == 200) {
                wx.config({
                    debug: false,
                    appId: respone.data.appId,
                    timestamp: respone.data.timestamp,
                    nonceStr: respone.data.noncestr,
                    signature: respone.data.signature,
                    jsApiList: [
                        'updateAppMessageShareData',
                        'updateTimelineShareData',
                        'onMenuShareTimeline',//分享朋友圈接口
                        'onMenuShareAppMessage',//分享给朋友接口
                        'onMenuShareQQ',//分享QQ
                        'onMenuShareWeibo',//分享腾讯微博
                        'onMenuShareQZone',//分享QQ空间
                    ]
                });
                var shareObj = {
                    'title': title, // 分享标题
                    'desc': desc, // 分享描述
                    'link': link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    'imgUrl': thumbnail, // 分享图标
                    success: function (res) {
                        // 设置成功
                        console.log("微信设置成功回调打印:"+res);
                    },
                    error:function(res){
                        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                        console.log("微信错误回调打印:"+res);
                    }
                }
                wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                    wx.updateAppMessageShareData(shareObj);
                    wx.updateTimelineShareData(shareObj);
                    wx.onMenuShareTimeline(shareObj);
                    wx.onMenuShareAppMessage(shareObj);
                    wx.onMenuShareQQ(shareObj);
                    wx.onMenuShareWeibo(shareObj);
                    wx.onMenuShareQZone(shareObj);
                });
            }
        }
    });
}

function is_weixin2() {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger"||ua.match(/WeiBo/i) == "weibo") {
        return true;
    }else if(ua.indexOf('mobile mqqbrowser')>-1){
        return true;
    }else if(ua.match(/QQ/i) == "qq"){
        return true;
    }
    return false
}