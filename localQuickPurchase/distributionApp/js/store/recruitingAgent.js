//升级进度提示语
var recruitMsg ="";
//手机号搜索条件
var searchMobile = "";
//查询代理商升级招募的代理商列表
var bool = true;
function getRecruitingAgent(){
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : '/localQuickPurchase/dApplicationAction/findDisInfo',
        data : {
            "seq" : seq ,
            "mobile" : searchMobile
        },
        async : true,	//是否异步请求，false为同步
        success : function(result){
            if(result.code != 200){
                console.info(result);
                return;
            }
            //渲染页面
            initInfo(result);
        },
        error : function(result){
            hui.toast(result.message);
        }
    });
}

//渲染页面
function initInfo(result){
    //升级进度标题
    $("#upgradeProgress").html(result.data.titleMsg);
    //点击提示语
    recruitMsg = result.data.recruitMsg;
    //代理商列表信息
    var list = result.data.list;
    var _html="";
    if(bool){
        addDisPlayClass(list.length);
    }
    bool = false;
    for(var i = 0 ;i < list.length ; i++ ){
        _html += initHtml(list[i]);
    }

    $("#hasMessage").append(_html);
}

function addDisPlayClass(length){
    if(length == 0){
        $("#hintMsg").removeClass("hasDisplay");
        return false;
    }
    $("#hintMsg").addClass("hasDisplay");

}

//拼接数据
function initHtml(voData){
    var _html ="";
    _html+= '<div class="msg-container">';
    //头像
    _html+= '<div class="pull-left notice-img"><img src="'+ voData.headImg +'" onerror="this.src=\'/localQuickPurchase/distributionApp/images/head.png\'"></div>';
    if(!( voData.userName ==null || voData.userName == "null" || voData.userName.trim() == "" )){
        _html+= '<div class="msg_date pull-left">';
        //用户名
        _html+= '<span class="pull-left font-lg">'+ voData.userName +'</span>';
        _html+= '</div>';
    }
    _html+= '<div class="padding-t-2 msg-detail">';
    //绑定时间
    _html+= '<p>绑定日期：<span>'+formatTime(voData.bindingTime)+'</span>';
    //电话号码
    var mobile = voData.mobile;
    var newMobile = mobile.substr(0,3) + "****" + mobile.substr(7);
    _html+= '<p>手机号码：<span>'+newMobile+'</span></p>';
    _html+='</p>';
    _html+= '</div></div>';
    return _html;
}


//点击显示升级进度
$("#showMsg").click(function(){
    if(recruitMsg == ""){
        reutrn;
    }
    hui.confirm(recruitMsg, ['取消','确定'], function() {
        window.location.href="/localQuickPurchase/distributionVA/index";
    },function(){
        //console.log('取消后执行...');
    });
    
});


//按手机号查询
function searchFromMobile(){
    var searchMobileValue = $("#mobile").val();
    searchMobile = searchMobileValue;
    $("#hasMessage").html("");
    getRecruitingAgent();
}

//时间戳转换
function formatTime(date) {
    var date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d ;
}
// 分页显示
// var mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
//         //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
//         //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
//         down: {
//             callback: downCallback, //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
//             isBounce: false
//         },
//         up: {
//             callback: upCallback , //上拉加载的回调
//             isBounce: false //如果您的项目是在iOS的微信,QQ,Safari等浏览器访问的,建议配置此项.解析(必读)
//         }
//     });

//     //4. 处理回调 :
//     var tMothod = "5";

//     //下拉刷新的回调
//     function downCallback() {
//         $("#hasMessage").html("");
//         pageIndex = 1;
//         relation_hasNext = true;
//         dis_hasNext = true;
//         searchMobile = $("#mobile").val();
//         if(operationType == 0 ){
//             initRelation();//加载vip数据
//         }else if(operationType == 2){
//             enterpriseAgent();//加载企业级经销商
//         }else{
//             initDis();//加载分销商数据
//         }

//         mescroll.endSuccess(); //无参
//         mescroll.endErr();
//     }

//     //上拉加载的回调 page = {num:1, size:10}; num:当前页 默认从1开始, size:每页数据条数,默认10
//     function upCallback(page) {
//         //$(".mescroll-hardware").css("visibility","hidden");
//         if(operationType == 0 ){
//             if(relation_hasNext){
//                 if(!isFrist)
//                     initRelation();//加载vip数据
//             }else{
//                 //alert("relation_hasNext is false");
//             }
//         }else if(operationType == 2){//加载企业级经销商
//             if(dis_hasNext){
//                 if(!isFrist)
//                     enterpriseAgent();//加载分销商数据
//             }else{
//                 //alert("dis_hasNext is false");
//             }
//         }else{
//             if(dis_hasNext){
//                 if(!isFrist)
//                     initDis();//加载分销商数据
//             }else{
//                 //alert("dis_hasNext is false");
//             }
//         }
//         isFristPage();
//         mescroll.endErr();
//         mescroll.endSuccess(); //无参
//     }

//  //返回上一页
//  $(".til").css("display","block");
//  var pageIndex = 1;
//  var pageSize = 10;
//  var operationType= 0;//操作VIP  1 操作分销商 2 操作企业级经销商
//  var relation_hasNext = true;//vip数据是否有下一页
//  var dis_hasNext = true;//分销商数据是否有下一页
//  var searchMobile = "";
//  var isFrist = false;
//  var frist = true;