/**
 * 注册js
 * Created by admin on 2018/12/20.
 */

function registerf() {
    var referrer = document.referrer;
    if (referrer.indexOf("jump.html") > -1){
        setCookie("referrer",referrer,365);
    }
    var masterSeq = GetRequest().rdSeq;
    var mobile = $("#mobile").val();
    var pwdmatches = /^[0-9a-zA-Z]+$/;
    $(".msgtips").hide();
    //验证
    var res = huiFormCheck('#register');
    if ($("#mobile").val().length == 0) {
        hui.toast("请输入电话号码");
        $("#mobile").focus();
        return false;
    }
    if ($("#pwd").val().length == 0) {
        hui.toast("请输入密码");
        $("#pwd").focus();
        return false;
    }
    if ($("#pwd").val() != null && !pwdmatches.test($("#pwd").val())) {
        hui.toast('密码只能包含数字与字母');
        return false;
    }
    var userpw = $("input[name=userpw]").val();
    if (userpw.length < 6 || userpw.length > 18) {
        hui.toast("密码长度为6-18位");
        return;
    }
    if ($("#pwd1").val().length == 0) {
        hui.toast("请输入确认密码");
        $("#pwd1").focus();
        return false;
    } else {
        if ($("#pwd1").val() != $("#pwd").val()) {
            hui.toast('两次密码不一致！');
            $("#pwd1").focus();
            return false;
        }
    }
    if ($("#captcha").val().length == 0) {
        hui.toast("请输入验证码");
        $("#pwd1").focus();
        return false;
    }
    if ($("#referrerMobile").val().length > 0) {
        if($("#referrerMobile").attr("disabled") != 'disabled') {
            if (!isPoneAvailable($("#referrerMobile").val())) {
                hui.toast('邀请人手机号码格式不正确');
                $("#referrerMobile").focus();
                return false;
            }
        }
    }
    //提交
    if (res) {
        //没添加推荐人的时候弹窗提示，否则直接注册
        if (getAffirmRegisterType()) {
            hui.toast('请输入邀请人手机号码');
            /*hui.confirm("您还未输入邀请人手机号码，注册后默认绑定至爱之家平台，是否提交注册", ['返回', '确认提交'], function () {
                addUser();
            }, function () {
                //console.log('取消后执行...');
            });*/
        } else {
            addUser();
        }
    } else {
        $(".msgtips").show().addClass("shake");
        setTimeout(function () {
            $(".msgtips").removeClass("shake");
        }, 500)
    }
}

//注册
function addUser() {
    var referrer = document.referrer;
    if (referrer.indexOf("jump.html") > -1){
        setCookie("referrer",referrer,365);
    }
    var mobile = $("#mobile").val().trim();
    var pwd = $("#pwd").val().trim();
    var captcha = $("#captcha").val().trim();

    var referrerMobile = "";
    if($("#referrerMobile").attr("disabled") !='disabled'){
        referrerMobile = $("#referrerMobile").val();
    }
    referrerMobile = referrerMobile.trim();

    var data = {};
    data.mobile = mobile;
    data.password = pwd;
    data.captcha = captcha;
    data.email = "";
    data.code = getQueryString("code");
    data.shareSeq = getShareId();
    data.comeFrom = "1001"; //爱之家
    data.referrerMobile = referrerMobile; //爱之家
    loadingdate("注册登录中,请稍等!");
    $.ajax({
        type: "post",	//定义提交的类型9
        url: "/upms/user/registration",
        dataType: "json",	//设置返回值得类型
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        async: true, //是否异步请求，false为同步
        success: function (data) {
            var code = data.code;
            var message = data.data;
            clearLoading();
            if (code == 1000) {
                hui.alert(message, "确定", function () {
                    //登录
                    login(mobile, pwd);
                });
            } else if (code == 1001) {
                //号码已注册
                hui.alert(message);
            } else if (code == 1004) {
                //推荐人不满足条件
                hui.alert(message);
            } else if (code == 1002) {
                // 因为注册接口有时候请求会失败，所以这里进行判断，如果返回的错误信息是请求失败，则在重新调用一次注册接口
                if (message.indexOf("请求失败") > 0) {
                    addUser();
                } else {
                    hui.iconToast(message, "error");
                }
            } else if(code == 1003) {
                hui.iconToast("请求超时，请稍后再试", "error");
            }

        },
        error:function(res){
            clearLoading();
            if(res.status === 500) {
                hui.iconToast("请求超时，请稍后再试", "error");
            }
        }
    });
}
