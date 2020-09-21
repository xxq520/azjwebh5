/*倒计时*/
function countdown(obj,mobile,imgCode){
    if($(obj).attr("state")=="sent"){
        //var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(mobile==""){
            hui.toast('请输入手机号码');
            return false;
        }
        if(!isPoneAvailable(mobile)){
            hui.toast('请输入正确的手机号码');
            return false;
        }
        sendCode(mobile,imgCode,obj);
    }
}
/*倒计时*/

$(function(){
    //$(".J-code-but").html(code);
    if($(".generalform").length>0){
        hui.formInit();
    }
    $(".J-code-but").click(function() {
        var obj = $(this);
        var mobile = $("#mobile").val();
        var imgCode = $("#imgCodeInput").val();
        //change(obj);
        countdown(obj,mobile,imgCode);
    });

    /*密码登录*/
    $("#wordLogin").on("click",".J-submit-but",function() {
        $(".msgtips").hide();
        //验证
        var res = huiFormCheck('#wordLogin');
        //提交
        if(res){
            var userName = $("#userName").val();
            var pwd = $("#pwd").val();
            login(userName,pwd);
        }else{
            //$(".msgtips").show().addClass("shake");
            setTimeout(function() {
                //$(".msgtips").removeClass("shake");
            },500)
        }
    })
    /*短信登录*/
    $("#smsLogin").on("click",".J-submit-but",function() {
        $(".msgtips").hide();
        //验证
        var res = huiFormCheck('#smsLogin');
        //提交
        if(res){
            hui.iconToast('验证通过！');
        }else{
            $(".msgtips").show().addClass("shake");
            setTimeout(function() {
                $(".msgtips").removeClass("shake");
            },500)
        }
    })
    /*找回密码*/
    $("#findBack").on("click",".J-submit-next",function() {
        $(".msgtips").hide();
        //验证
        var res = huiFormCheck('#findBack');
        //下一步
        if(res){
            hui.iconToast('验证通过！');
        }else{
            $(".msgtips").show().addClass("shake");
            setTimeout(function() {
                $(".msgtips").removeClass("shake");
            },500)
        }
    })
    $("#resetpw").on("click",".J-submit-but",function() {
        $(".msgtips").hide();
        //验证
        var res = huiFormCheck('#resetpw');
        //确定修改密码
        if(res){
            hui.iconToast('验证通过！');
        }else{
            $(".msgtips").show().addClass("shake");
            setTimeout(function() {
                $(".msgtips").removeClass("shake");
            },500)
        }
    })

    /*帮助反馈折叠列表*/
    if($("#accordionList").length>0){
        hui.accordion(true, true);
    }
    $("#feedback textarea").keyup(function() {
        var textlength = parseInt($("#feedback textarea").val().length);
        var remainlength = 200-textlength;
        $("#feedback .areatips i").html(textlength);
        $("#feedback .areatips b").html(remainlength);
    })
    $("#feedback").on("click",".J-submit-but",function() {
        $(".msgtips").hide();
        //验证
        var res = huiFormCheck('#feedback');
        var message = $("#message").val();
        var contactWay = $(".contactWay").val();
        //提交
        if(res){
            insertFeedbank(contactWay,message);
            var tipslayer="<div style='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);background:#fff;width: 75%;padding: 2rem 0;z-index:999;'><p style='text-align:center;margin: 0 0 .25rem;font-size: 1.25rem;color: #e23030;'>恭喜你</p><p style='text-align:center;font-size: .75rem;color: #212121;'>提交成功</p></div>";
            hui.dialogBase();
            $("body").append(tipslayer);
        }else{
            $(".msgtips").show().addClass("shake");
            setTimeout(function() {
                $(".msgtips").removeClass("shake");
            },500)
        }
    });
});

//反馈
function insertFeedbank(contactWay,message){
    $.ajax({
        type : 'GET',
        url : '/localQuickPurchase/feedbackAction/insert',
        data : {
            seq : seq,
            contactWay : contactWay,
            message : message
        },
        async : true,
        success : function(data) {

        }
    })
};

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


//发送验证码
function sendCode(mobile,code,obj){
    $.ajax({
        type : "post",	//定义提交的类型9
        url : "/upms/basic/sendCode",
        dataType : "json",	//设置返回值得类型
        data : {mobile:mobile,code:code,state:1},
        async : true,	//是否异步请求，false为同步
        success : function(data) {
            var code = data.code;
            if(code == 1010){
                $(".img-code-con").show();
                var  random = Math.random()
                $("#imgCode img").attr("src","/upms/basic/validateCode?mobile="+mobile+"&random="+ random);
                refreshImgCode(mobile);
                hui.toast("请输入正确的图形验证码");
            } else if (code == 1001) {
                //用户已注册
                hui.toast(data.data);
            } else if(code == 1004) {
                //发送失败
                hui.toast(data.data);
            }else if(code == 1000){
                hui.toast(data.data);
                var countdown = 60;
                var smsTime;
                $(obj).attr("state", "ban");
                $(obj).css("color","#262626");
                var smsTime = setInterval(function() {
                    --countdown;
                    if (countdown == 0) {
                        clearInterval(smsTime);
                        $(obj).css("color","#f35f5f");
                        $(obj).html("重发验证码");
                        $(obj).attr("state", "sent");
                    } else {
                        $(obj).html(countdown + "秒后重发");
                    }
                }, 1000);
            }else{
                hui.toast("系统繁忙,清稍后重试");
            }
        }
    });
}

//刷新图片验证码
function refreshImgCode(mobile){
    $("#imgCode").on("click",function(){
        $(this).find('img').attr("src","/upms/basic/validateCode?mobile="+mobile+"&time="+ new Date().toLocaleTimeString())
    })
}

function verificationCode(obj){
    var userName = $("#userName").val();
    validation = 1;
    countdown(obj,userName);
}