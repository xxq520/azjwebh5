// 个人中心页面

window.onpageshow = function (event) {
    if (event.persisted) {
        window.location.reload();
    }
};


//个人中心头像、姓名、手机号码初始化
if (isLogin()) {

    var access_token = getStorageValue("access_token");
    if(access_token != null && access_token !== "") {
        console.info("access_token");
        var initUser = {
            type : "GET",//定义提交的类型
            url : "/upms/user/findUserInfoCenter",
            dataType : "json",//设置返回值得类型
            data : { },
            async : true,//是否异步请求，false为同步
            success : function(data) {//成功返回值执行函数
                if (data.code == 1000) {
                    let userData = data.data;
                    $("#personal_userName").html(userData.userName);
                    $(".mobile").html(userData.userType);
                    var headUrl = userData.userHeadUrl;
                    if(headUrl != null && headUrl != "") {
                        setCookie("headImg", headUrl);
                        $("#personal_img").attr("src", headUrl);
                    }
                    $("#balance").text(userData.availableBalance)
                }else {
                    hui.toast("加载失败！");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        };
        refresh(initUser);
    }
}