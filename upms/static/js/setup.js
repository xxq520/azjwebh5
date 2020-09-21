window.onpageshow = function (event) {
    if (event.persisted) {
        window.location.reload();
    }
};

if(!isLogin()) {
    loginPage();
}

/**
 * 获取用户信息
 */
function getUserInfo() {
    var getUserInfo = {
        url : '/upms/user/findPersonalData',
        type : 'GET',
        async : true,
        data :{},
        dataType : 'json',
        success : function(data) {
            var data = data.data;
            var imgUrl;
            var name;
            var userMobile ;
            var isBandWeiXin;
            if(data != null){
                isBandWeiXin = data.isBandWeiXin;
                name = data.userName;
                imgUrl = data.userHeadUrl;
                userMobile = data.userMobile;

                /*是否显示用户协议列表*/
                var judgeAgreement = data.judgeAgreement;
                if (judgeAgreement){
                    $('.agreement').show();
                }

                $("#userName").attr("value",(name == null ? "" : name));
                $("#mobile").attr("value",(userMobile == null ? "" : userMobile));
                if(imgUrl != "" &&  imgUrl != null && imgUrl != "null"){
                    $("#upload-pic").attr("src",imgUrl);
                }
                var superiorInfo =  data.superiorInfo;
                var superiorTypeName =  superiorInfo.roleType == "" ? "无上级" : superiorInfo.roleType;
                $("#superiorType").attr("value",superiorTypeName);
                if(superiorInfo.roleType != ''){
                    $("#superiorName").attr("value",superiorInfo.name);
                }
                $("#wechat").val((isBandWeiXin == '' || isBandWeiXin == null)?"未绑定":"已绑定");
            }

        },
        error : function(error) {
            hui.toast('网络错误!');
        }
    }
    refresh(getUserInfo);
}
getUserInfo();

/**
 * 退出登录操作
 */
function loginOut(){
    hui.confirm("确定退出登录么！",['取消','确定'],function(){
        loginOffByBack();
        noLoginPage();
    });
}

/**
 * 手机原生调用返回上一步
 * @param obj
 */
function goBack(obj) {
    try{
        // 调app原生返回
        window.action.android_back();
    }catch(e){
    }
    setTimeout(function(){
        hui.back();
    }, 200);
}

/**
 * 进入我的地址管理
 */
$(".address").click(function () {
    window.location.href = "/localQuickPurchase/generalStore/html/address.jsp?v=2";
});

/**
 * 跳转到个人资料页面
 */
$(".personal").click(function() {
    window.location.href = "/upms/static/personalinfo.html";
});

//修改密码
$(document).on("click","#password",function () {
    var userName = getUserName();
    window.location.href="../static/changePassword.html?userMobile="+userName;
});