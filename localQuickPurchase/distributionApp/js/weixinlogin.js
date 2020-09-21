var weixinOpenId = $('#weixinOpenId').val();//微信openid
var weixinState = $('#weixinState').val();
var weixinUnionId = $('#weixinUnionId').val();//微信unionid
var weixinNickname = $('#weixinNickname').val();//微信昵称
var weixinHeadimgurl = $('#weixinHeadimgurl').val();//微信头像
function weixinlogin(weixinOpenId,weixinUnionId){
    loadingdate("正在跳转,请稍后!");
    $.ajax({
        type : "post",
        url : "/localQuickPurchase/authorize/wxstatus",
        dataType : "json",
        data : {
            weixinOpenid : weixinOpenId,
            weixinUnionid : weixinUnionId,
            weixinState : weixinState,
            weixinHeadimgurl : weixinHeadimgurl,
            weixinNickname : weixinNickname
        },
        async : true,
        success : function(data) {
            var code = data.code;
            if(code == 200){
                //用来验证是否新登录或者半年没有登录(此功能暂时不要)
                var validationSeq = getCookie("validationSeq");
                var seq = data.data.seq;

                var bindMsg = data.data.bindMsg;
                setCookie("validationSeq", seq, 180);

                var warrant = data.data.virtualShop.warrant;
                if(warrant == null){
                    warrant = 0;
                }
                var headImg = data.data.virtualShop.headImgUrl;
                if(headImg == null || headImg == ""){
                    headImg = data.data.virtualShop.weixinHeadimgurl;
                }
                var nickName = data.data.virtualShop.nickName;
                if(nickName == null || nickName == ""){
                    nickName  =  data.data.virtualShop.weixinNickname;
                }
                setCookie("headImg", headImg, 7);
                setCookie("nickName", nickName, 7);
                setCookie("warrant", warrant, 7);
                /** enterpriseAgent:企业用户的角色：2：企业网络店主，3：企业代理商 */
                setCookie("enterpriseAgent",data.data.enterpriseAgent,7);
                setCookie("popupDistriIndex","false",30);//网络店主弹窗控制(首页)
                setCookie("popupDistriOrder","false",30);//网络店主弹窗控制(订单)
                setCookie("bindingWindows","zero", 1);//用户绑定弹窗控制（一天弹窗三次）
                var distributorType = getCookie("distributorType");

                var consumer = getCookie("consumer");
                var userInfo = getCookie("userInfo");
                //iOS在后台设置Cookie失败

                if(distributorType == null || distributorType == "") {
                    setCookie("distributorType", data.data.distributorType, 180);
                }
                if(consumer == null || consumer == "") {
                    setCookie("consumer", data.data.consumer, 180);
                }
                if(userInfo == null || userInfo == "") {
                    setCookie("userInfo", data.data.userInfo, 180);
                }
                var mydSeq = getCookie("mydSeq");
                if(mydSeq == null || mydSeq == "") {
                    mydSeq = data.data.mydSeq;
                    if(mydSeq != null) {
                        setCookie("mydSeq", data.data.mydSeq, 180);
                    }
                }
                var userCookieSeq = getCookie("seq");
                if(userCookieSeq == null || userCookieSeq == "") {
                    setCookie("seq", data.data.seq, 180);
                }
                var userMobile = getCookie("mobile");
                if(userMobile == null || userMobile == "") {
                    setCookie("mobile", data.data.mobile, 180);
                }
                clearLoading();
                if(bindMsg != null && bindMsg != ""){
                    hui.alert(bindMsg,"确定",function(){
                        loginSkip(data);
                    });
                    return;
                }
                hui.iconToast('登录成功！');
                loginSkip(data);
            } else if(code == 404){
                if(investmentSeq != null && investmentSeq != ""){
                    var url = "";
                    hui.confirm('您还没有注册,请是否去注册', ['取消','确定'],function() {
                        url = "/localQuickPurchase/distributionVA/login/register";
                        window.location.href = url;
                    },function(){
                        url = getCookie("loginRetrunUrl");
                        window.location.href = url;
                    });
                }else{
                    hui.iconToast('用户不存在','error');


                }
            } else if(code == 201){
                hui.iconToast('参数不完整','error');
            }else{
                var userLoginState = data.data.userLoginState;//用户状态 0：正常 1:锁定
                var userLogin = data.data.userLogin;//用户状态 0：正常 1:锁定
                var stateTiem = fun_date(data.data.stateTiem,1);//用户状态更新时间
                var newDate = data.data.nowTime;
                var countdownTime = stateTiem-newDate;
                var errorNum = 5-userLogin;
                console.log(AccordingTime(countdownTime));
                if(userLoginState == 1){
                    hui.iconToast('您的账号已锁定,将在24小时后自动解锁,剩余'+AccordingTime(countdownTime),'error');
                }else{
                    if(errorNum == null || errorNum > 3 || errorNum < 0){
                        hui.iconToast('错误的用户名/密码','error');
                    }else{
                        hui.iconToast('错误的用户名/密码,您还有'+errorNum+'次输入机会','error');
                    }
                }

                //hui.iconToast('错误的用户名/密码','error');
            }
            clearLoading();
        }
    })
}
