//普通用户
//判断用户是否登录
if(!isLogin()){
    hui.confirm('请先登录！！！', ['暂不登录','马上登录'], function(){
        loginPage();
    });
}
//信息盒子进来默认进入通知页面
$(function(){
    systemMessageClick();
});

var userType = getRoleType();//用户类型
var seq = seq;//用户类型
var html = '';
var informTime = '';//系统通知时间
//系统通知信息
function systemMessageClick(){
    $('.logisticsInformationContent').empty();//从被选元素中删除子元素
    $(".systemMessageContent").empty();
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/systematicNotification/findSysByMessageType",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"seq" : seq,"pageIndex" : 1,"pageSize" : 100, "messageType":1}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            var code = data.code;
            if(code == 200 || code == 404){
                var systemMessage = data.data.list;
                if(systemMessage == null || systemMessage.length == 0){
                    html = '<p class="positionContent">暂时没有爱之家通知!</p>';
                    $('.systemMessageContent').append(html);
                    return false;
                }
                for(var i = 0; i<systemMessage.length;i++){
                    var id = systemMessage[i].id; //信息状态
                    var state = systemMessage[i].state; //信息状态
                    var informTitle = systemMessage[i].informTitle;//信息标题
                    var informType = systemMessage[i].informType;//信息标题
                    var informContent = systemMessage[i].informContent;//信息内容
                    var informImgUrl = systemMessage[i].informImgUrl;//信息图片路径
                    if(informImgUrl == null || informImgUrl == ""){
                        informImgUrl = "../distributionApp/images/img_03.png";
                    }
                    informTime = systemMessage[i].informTime;//通知时间
                    var date = formatDate(informTime);//转换时间格式
                    html = '';
                    html += '<div class="notice-item"  data-id="'+id+'" >';
                    if(state == 0) {//未阅读
                        html += '<div class="notice-block unLook"><span class="point point_list">&nbsp</span> ';
                    }
                    html += '<span class="hui-badge hui-danger font-sm">'+informType+'</span>';
                    html += '<span class="font-md over_test">'+informTitle+'</span>';
                    html += '<span class="pull-right">'+date+'</span>';
                    html += '</div>';
                    html += '<div class="notice_detail" id="notice-message" data-id="'+id+'" >';
                    html += '<span class="notice_text" >'+informContent+'</span>';
                    html += '<span class="notice_img"><img src="'+informImgUrl+'" height="158" width="144"/></span>';
                    html += '</div>';
                    html += '</div>';
                    $('.systemMessageContent').append(html);
                    html = '';
                }
            }
        },
        error:function(){

        }
    });
};

//物流信息
var deliverStatus = "";//发货状态
var pageIndex = 1;
function logisticsInformationClick(){
    $('.logisticsInformationContent').empty();//从被选元素中删除子元素(物流)
    //seq = 3751621.0;
    $('.systemMessageContent').empty();//从被选元素中删除子元素
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/systematicNotification/findSysByMessageType",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"seq" : seq,"pageIndex" : pageIndex,"messageType":0}),
        dataType: "json",	//设置返回值得类型
        success: function(data){
            if(data.code == 404){
                html = '<p class="positionContent">暂时没有物流信息！</p>';
                $(".logisticsInformationContent").append(html);
                //hui.toast("暂时没有物流信息！");
                return;
            }
            if(data.code == 200){
                var logisticsInformation = data.data.list;
                if(logisticsInformation.length == 0){
                    tml = '<p class="positionContent">暂时没有物流信息！</p>';
                    $(".logisticsInformationContent").append(html);
                    //hui.toast("暂时没有物流信息！");
                    return;
                }
                for(var i = 0;i<logisticsInformation.length;i++){
                    html = getDataList(logisticsInformation,i);
                    $(".logisticsInformationContent").append(html);
                }
            }

        },
        error: function(){

        }
    });
};

function getDataList(logistics,i){
    var html = '';
    var deliverTime = logistics[i].informTime;//发货时间
    var date = formatDate(deliverTime);//转换时间格式
    var orderno = logistics[i].informContent;//订单号
    var state = logistics[i].state;//当state状态为0时，该订单信息为未读状态
    var informTitle = logistics[i ].informTitle;//标题
    var id = logistics[i].id;

    if (state == 0) {//未读
        //判断分销该订单是买还是卖
        html += '<div class="notice-block" onclick=lineItem("'+state+'","'+orderno+'","'+id+'")>';
        html += '<span class="font-md posre unLook"><span class="point point_list"></span>'+informTitle+'</span>';
    } else {
        html += '<div class="notice-block" onclick=lineItem("'+state+'","'+orderno+'","'+id+'")>';
        html += '<span class="font-md posre unLook"></span>'+informTitle+'</span>';
    }
    html += '<span class="pull-right">'+date+'</span>';

    var listOrderDetails = logistics[i].listOrderDetails;//商品详情
    for (var j = 0; j < listOrderDetails.length; j++) {
        var goodsName = listOrderDetails[j].goodsName;//商品名称
        var goodsImgUrl = listOrderDetails[j].goodsImgUrl;//商品图片
        html += '<div class="notice_detail">';
        html += '<span class="logistics_detail">'+goodsName+'</span>';
        html += '<span class="notice_img"><img src="'+goodsImgUrl+'"/></span>';
        html += '<span class="logistics_detail color_gray margin-t-3">订单号：'+orderno+'</span>';
        html += '</div>';
    }
    return html;
}

//跳转到订单详情并修改状态
function lineItem(state,orderno,id){
    if(state == 0){
        updateSysState(id);
    }
    orderMessage(orderno);
};

//跳转订单详情
function orderMessage(orderno){
    window.location.href = "/localQuickPurchase/distributionVA/order/orderDetail?orderNo="+orderno+"&seq="+seq+"&userType="+userType+"&buyAndSellStatus="+1;

};

//店主私信
function privateMessageClick(){
    $('.systemMessageContent').empty();//从被选元素中删除子元素(系统通知)privateChat
    $('.logisticsInformationContent').empty();//从被选元素中删除子元素(物流)
    html = '<p class="positionContent">暂时没有信息!</p>';
    $(".privateChat").append(html);
    //hui.toast("暂无消息！");
};

//点击取消系统通知小红点
$("body").on("click",".notice-item",function(){
    $(this).find(".notice-block").removeClass("unLook");
    //删除红点
    $(this).find(".point").remove();
});

$("body").on("click","#notice-message",function(){
    var id = $(this).attr("data-id");
    updateSysState(id);
    /*跳转详情*/
    window.location.href = "/localQuickPurchase/distributionVA/informationContent?id="+id;
});

$("body").on("click",".logisticsInformationContent .notice-block",function(){
    $(this).find(".font-md").removeClass("unLook");
});




