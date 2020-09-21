var shareSeq = getQueryString("shareSeq");
var seq = getUserSeq();
if (seq == null || seq == undefined || seq == ""){
    seq = 0;
}

var userName = getUserName();
var mobile = "";

if(shareSeq == null || shareSeq == ""){
    shareSeq = 0;
}

var comeFrom  = getQueryString("comeFrom");

if(comeFrom != '' && comeFrom == 0){
    headHide();
}
$("#consent").click(function(){
    var type = $(this).attr("type");
    if(type == 1) {
        return;
    }
    addUserBind();
});


function addUserBind() {
    $.ajax({
        type : "POST",
        url : "/localQuickPurchase/dApplicationAction/addUserBindingByShare",
        dataType : "json", //设置返回值得类型
        data : {
            "seq" : seq ,
            "shareSeq" : shareSeq
        },
        async : false, //是否异步请求，false为同步
        success : function(data) {
            var code = data.code;
            if (code == 200) {
                window.location.href = "/localQuickPurchase/distributionVA/agentInformation?distributorSeq="+seq+"&upgradeType=2"+"&shareSeq="+shareSeq;
            } else {
                hui.toast(data.message);
            }
        }
    })
}

function headHide(){
    $(".hui-header").addClass("hasNone");
    $(".toplen").addClass("hasNone");
}

if (isLogin()) {
    if(isRoleDealer()) {
        $("#consent").attr("type","1");
        $("#consent").html("<a>您已经是经销商了</a>");
    } else {
        findUserMessage();
    }

    if(isRoleConsumer() && shareSeq != 0) {
        getMobileBySeq(shareSeq);
        binding();
    }
}


function findUserMessage() {
    $.ajax({
        type : "GET",//定义提交的类型
        url : "/localQuickPurchase/dApplicationAction/findEnterpriseLevelState",
        dataType : "json",//设置返回值得类型
        data : {"seq" : seq},
        async : false,//是否异步请求，false为同步
        success : function(data) {//成功返回值执行函数
            if (data.code == 200) {
                var data = data.data;
                var upgradeApplyState = data.upgradeApplyState;
                if(upgradeApplyState == 4) {
                    $("#consent").attr("type","1");
                    $("#consent").html("<a>升级资料已经提交~</a>");
                }
                if(upgradeApplyState == 10) {
                    $("#consent").html("<a>申请被驳回,点击重新申请~</a>");
                }
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
    setTimeout(function() {
        if (document.referrer == "") {
            personalCenter();
        } else {
            hui.back();
        }
        // window.location.href = "/localQuickPurchase/distributionVA/personal/index";
    }, 200);
}

function binding() {
    $.ajax({
        type : "POST",//定义提交的类型
        url : "/localQuickPurchase/dOrders/bindingRelation",
        dataType : "json",
        data : {
            "agentMobile" : mobile,
            "userMobile" : userName
        },
        async : false,//是否异步请求，false为同步
        success : function(data) {
            if (data.code == 200) {

            }
        }
    });
}

//查找用户是否有购买成功记录
function findSucOrder(){
    var bool = false;//是否有购买记录
    $.ajax({
        type : "post",
        url  : "/localQuickPurchase/dOrders/findSucOrder",
        dataType : "json",
        data : {
            "seq" : seq
        },
        async : false,//是否异步请求，false为同步
        success : function(data) {//成功返回值执行函数
            if(data.code == 200){
                bool = true;
            }
        },
        error: function () {
        }
    });
    return bool;
}

function getMobileBySeq(shareSeq) {
    $.ajax({
        type : "GET",//定义提交的类型
        contentType: "application/json;charset=utf-8",
        url : "/localQuickPurchase/dApplicationAction/getMobileBySeq",
        dataType : "json",
        data : {"seq" : shareSeq },
        async : false,//是否异步请求，false为同步
        success : function(data) {
            if (data.code == 200) {
                mobile = data.data.mobile;
            }
        },
    });
}