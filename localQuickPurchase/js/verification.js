/**
 * 该js用于验证登录
 */
var identifying = getQueryString("identifying");
var userName = getQueryString("userName");
var pwd = getQueryString("pwd");

/*百业联盟跳转爱之家百业专区*/
if (identifying == "baiye"){
    register();
}

function register() {
    if (userName == null || userName == "" || pwd == null || pwd == ""){
        console.log("账号或者密码不能为空");
        return;
    }
    $.ajax({
        type:'GET',
        dataType:'json',
        url:"/localQuickPurchase/shopMongo/api/register",
        data:{
            "userName":userName,
            "pwd":pwd
        },
        async : false,
        success:function (data) {
            var code = data.code;
            if(code == 200) {
                setOauthToken(data.data);
            }
        }
    })
}

