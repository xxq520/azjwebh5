/**
 * 此js用作微信登录，常规登录用token.js
 */

/**
 * 微信登录
 * @param code
 *          微信授权code
 * @returns {*}
 */
function weChatLogin(code){
    var result;
    loadingdate("正在跳转,请稍后!");
    $.ajax({
        type : "POST",
        url : "/upms/oauth/weChatOauthToken",
        dataType : "json",
        data : {
            code : code,
            clientId : clientId
        },
        async : false,
        success : function(data) {
            clearLoading();
            if(data.code == 1007) {
                window.location.href = "/upms/static/weChatBindTel.html?code="+ code;
                return;
            } else {
                setOauthToken(data);
                result =  true;
            }
        },
        error:function(res){
            if(res.status === 401) {
                var json = res.responseJSON;
                hui.alert(json.message);
            }
            result =  false;
        }
    });
    return result;
}


//公众号的唯一标识
var appid;
//微信授权回调地址
var weixinRedirectUrl;

//获取微信授权回调地址和APPID
function getWeChatOAuthRedirect() {
    $.ajax({
        type : "get",//定义提交的类型
        url : "/upms/basic/getWeChatAuthorize",
        dataType : "json",//设置返回值得类型
        data : {},
        async : false,//是否异步请求，false为同步
        success : function(data) {//成功返回值执行函数
            appid = data.data.appId;
            weixinRedirectUrl = data.data.redirectUrl;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {}
    });
}

$(".wxLog").on('click',function() {
    //微信授权地址
    var weixin_loginURL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=";
    //微信授权参数
    var weixin_param = "&response_type=code&scope=snsapi_userinfo&state=weixinToken#wechat_redirect";
    window.location.href = weixin_loginURL + weixinRedirectUrl + weixin_param;
});