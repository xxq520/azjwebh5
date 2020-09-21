var shareSeq = getQueryString("seq");

function upgradeNow(){
     setCookie("shareSeq",shareSeq,1);
    if(!isLogin()){
        location.href = "/upms/static/register.html";
        return;
    } else{
        location.href = "/localQuickPurchase/distributionVA/brandSquare/supplierCompanyInfo?shareSeq="+shareSeq;
    }
    // jumpToTheStationPage();
}

/**
 * 已有账号执行操作
 */
function existingAccount() {
    setCookie("shareSeq",shareSeq,1);
    /*有登录的时候退出登录再跳转登录页*/
    if(isLogin()) {
        loginOffByBack();
    }
    loginPage();
    // jumpToTheStationPage();
}
function jumpToTheStationPage() {
    $.ajax({
        type : "get",//定义提交的类型
        url : "/localQuickPurchase/brandSquare/queryEntityBySeq",
        dataType : "json",//设置返回值得类型
        data : {
            "seq": seq
        },
        async : false,//是否异步请求，false为同步
        success : function(data) {//成功返回值执行函数
            if(data.code == 200||data.code == 202){
                location.href = "/localQuickPurchase/distributionVA/brandSquare/supplierCompanyInfo?shareSeq="+shareSeq;
                return;
            }else{
                hui.toast("商家不能入驻");
                return;
            }
        },
    });
}
function goBack(obj) {
    try{
        // 调app原生返回
        window.action.app_back();
    }catch(e){
    }
    setTimeout(function(){
        if (document.referrer == "") {
            noLoginPage();
        } else {
            hui.back();
        }
    }, 200);
}