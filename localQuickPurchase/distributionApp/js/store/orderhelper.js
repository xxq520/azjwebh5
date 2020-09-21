//获取ModelAndView的值
var seq = $("#method1").val();
var deliverStatus = $("#method2").val();
//登录的用户类型（1 普通用户，2 网络店主，3 线下服务中心，4 成为网络店主的线下服务中心）
var userType = getCookie("distributorType");

hui.refresh('.main_container', downMove);
hui.loadMore(goodsList);

var idArray = new Array();
var display = false;

var isLoading = false;
var first = true;
var messageType = '';
var pageIndex = 1;

//加载订单助手信息
function goodsList(){
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/systematicNotification/findSysByMessageType",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"seq" : seq,"pageIndex" : pageIndex,"messageType":0}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            var logistics = data.data.list;
            var html = '';
            if(logistics.length > 0) {
                html = getDataList(logistics);
                $(".main_container #list").append(html);
                pageIndex++;
                hui.endLoadMore(false);
                isLoading = false;
                if(display){
                    accomplish();
                }
            }else{
                hui.endLoadMore(true, '');
                html = '<p class="positionContentEnd">已经到头了...</p>';
                $('.main_container').append(html);
                $("#hui-load-more").html("");
                $("#hui-load-more").css('position','inherit');
                //hui.endLoadMore(true, '已经到头了...');
                return false;
            }
        },
        error: function(){
            //hui.toast(error);
        }

    });
};
//下拉刷新
function downMove(){
    /*  hui.loading('加载中...'); */
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/systematicNotification/findSysByMessageType",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"seq" : seq,"pageIndex" : 1, "messageType":0}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            var html = '';
            var logistics = data.data.list;
            if(logistics == null || logistics.length == 0){
                html = '<p class="positionContent">暂时没有完成的订单!</p>';
                $(".main_container #list").append(html);
                return false;
            }
            if(logistics != null && logistics.length > 0){
                html = getDataList(logistics);
                pageIndex = 2;
                setTimeout(function(){
                    $(".main_container #list").empty();
                    $(html).appendTo('.main_container #list');
                    //结束刷新
                    hui.endRefresh();
                    //重置加载更多状态
                    hui.resetLoadMore();
                    hui.loading('加载中...', true);
                    if(!first){
                        compile();
                        hui.toast("下拉刷新成功");
                    }
                    first = false;
                },500)
            } else {
                //结束刷新
                hui.endRefresh();
                hui.loading('加载中...', true);
                hui.toast("暂时没有更多订单...");
            }
        }
    });
};

function getDataList(logistics){
    var html = '';
    for(var i = 0;i<logistics.length;i++) {
        var buyAndSellStatus = 1; //买单为1，卖单为2
        var deliverTime = logistics[i].informTime;//发货时间
        var date = formatDateTime(deliverTime);//转换时间格式
        var orderno = logistics[i].informContent;//订单号
        var informType = logistics[i].informType;//买/卖
        if (informType == "卖") {
            buyAndSellStatus = 2;
        }
        var informTitle = logistics[i].informTitle;//标题
        var state = logistics[i].state;//当state状态为0时，该订单信息为未读状态
        var id = logistics[i].id;
        //state = 0;
        //判断分销该订单是买还是卖
        html += '<div class="notice_list_2 margin-t-3 " ><span class="check" data-id="' + id + '" state="0"><img src="/localQuickPurchase/distributionApp/images/store/icon-2@3x.png"></span>';
        if (state == 0) {//未读
            html += '<div class="notice-block"><span class="point point_list"></span>';
            html += '<span class="font-lg"><span class="point point_list"></span>';
        } else {
            html += '<div class="notice-block">';
            html += '<span class="font-lg">';
        }
        html += '<span class="order-budge-sell font-sm">' + informType + '</span>' + informTitle + '</span>';
        html += '<span class="pull-right color_gray">' + date + '<span style="margin: 0 3px;"></span>';
        html += '</div>';

        var listOrderDetails = logistics[i].listOrderDetails;//商品详情

        if (listOrderDetails) {
            for (var j = 0; j < listOrderDetails.length; j++) {

                var goodsName = listOrderDetails[j].goodsName;//商品名称
                var goodsImgUrl = listOrderDetails[j].goodsImgUrl;//商品图片
                html += '<div class="notice_detail" data-orderno="' + orderno + '" data-state="' + state + '" data-id="' + id + '" data-buyAndSellStatus="' + buyAndSellStatus + '">';
                html += '<div class="notice_text font-md">';
                html += '<p>' + goodsName + '</p>';
                //html += '<p class="margin-t-3">新增收益：<span class="color_darkred">￥</span></p>';
                html += '<p class="color_gray font-sm margin-t-5">订单号：' + orderno + '</p>';
                html += '</div>';
                html += '<span class="notice_img helper_img"><img src="' + goodsImgUrl + '" height="158" width="14"></span>';
                html += '</div>';
            }
            html += '<div class="operation"><span class="orderDetail" data-orderno="' + orderno + '" data-state="' + state + '" data-id="' + id + '" data-buyAndSellStatus="' + buyAndSellStatus + '"></span></div></div>';
        }
    }
    return html;
}
$("body").on('click','.notice_list_2',function(){
    if($(this).find('.operation').is('.operationOpen')){
        $(this).find('.operation').removeClass('operationOpen');
    }else{
        $(this).find('.operation').addClass('operationOpen');
    }
})

//点击商品时跳转到订单详情页面
$("body").on('click','.notice_detail',function(){
    $(this).find(".point").remove();
    var orderno = $(this).attr("data-orderno");
    var state = $(this).attr("data-state");
    var buyAndSellStatus = $(this).attr("data-buyAndSellStatus");
    var _id = $(this).attr("data-id");
    //修改状态
    if (state == 0) {//未读状态
        $.ajax({
            type: "post",
            url: "/localQuickPurchase/systematicNotification/updateSystematicNotificationState",
            data: {
                id: _id
            },
            dataType: "json",	//设置返回值得类型
            success: function (data) {
                if (data.code == 200) {
                    //alert("更新成功!");
                }
            },
            error: function () {

            }
        });
    }
    orderMessage(orderno,buyAndSellStatus);
});
/*删除*/
$('body').on('click','.delete-btn',function(){
    if(idArray.length < 1){
        hui.toast("请选择要删除的订单!")
        return;
    }
    //$(this).parent().parent().remove();
    var code;
    $.ajax({
        type: "post",
        url: "/localQuickPurchase/systematicNotification/deleteArrSys",
        contentType: "application/json;charset=utf-8",
        data :JSON.stringify({"idArray":idArray}),
        dataType: "json",	//设置返回值得类型
        success: function (data) {
            code = data.code;
            if (code == 200) {
                hui.toast("删除成功!");
            }
            location.reload();
        },
        error: function () {

        }
    });
    downMove();
})
$('body').on('click','.edit',function () {
    var state = $(this).attr("state");
    if(state == 1){
        compile();
    }else{
        accomplish();
    }
})
$("body").on('click','.check',function () {
    var state = $(this).attr("state");
    var _id = $(this).attr("data-id");
    if(state == "0"){ //选中
        idArray.push(_id);
        $('.count').html(idArray.length);
        $(this).find('img').css('display','block');
        $(this).attr("state","1");
    }else if(state == "1"){//取消
        idArray.remove(_id);
        $('.count').html(idArray.length);
        $(this).find('img').css('display','none');
        $(this).attr("state","0");
    }
    var idArrays = countTag();
    if(idArray.length == idArrays.length){
        $('.check-btn img').css('display','block');
    }else{
        $('.check-btn img').css('display','none');
    }
})
//全选
$("body").on('click','.check-btn',function () {
    var state = $(this).attr("state");
    if(state == "0"){ //选中
        idArray = countTag();
        $('.count').html(idArray.length);
        $(this).find('img').css('display','block');
        $('.check img').css('display','block');
        $(this).attr("state","1");
        $('.check').attr("state","1");
    }else if(state == "1"){//取消
        idArray.splice(0,idArray.length);
        $('.count').html(idArray.length);
        $(this).find('img').css('display','none');
        $('.check img').css('display','none');
        $(this).attr("state","0");
        $('.check').attr("state","0");
    }
})
function compile (){
    display = false;
    $('.edit').html('编辑');
    $('.edit').attr("state","0");
    $('.Deletefooter').css('display','none');
    $('.check-btn img').css('display','none');
    $('.notice_list_2').css('padding-left','0rem');
    $('.check').css('display','none');
    $('.check img').css('display','none');
    /*清空数组*/
    idArray.splice(0,idArray.length);
    $('.count').html(idArray.length);
}
function accomplish(){
    display = true;
    $('.edit').html('完成');
    $('.edit').attr("state","1");
    $('.notice_list_2').css('padding-left','1.5555rem');
    //$('.notice_list_2').css('width','100%')
    $('.Deletefooter').css('display','block');
    $('.check').css('display','block');
}

function countTag() {
    var tags = document.getElementsByClassName("check");
    var idAllArray = new Array();
    for (var i = 0; i < tags.length; i++) {
        idAllArray.push(tags[i].getAttribute("data-id"));
    }
    return idAllArray;
}
//跳转订单详情
function orderMessage(orderno,buyAndSellStatus){
    //http://192.168.1.191/localQuickPurchase/distributionVA/order/orderDetail?orderNo=3201810131658530003&seq=5757774&userType=3&buyAndSellStatus=2
    window.location.href = "/localQuickPurchase/distributionVA/order/orderDetail?orderNo="+orderno+"&seq="+seq+"&userType="+userType+"&buyAndSellStatus="+buyAndSellStatus;

};

//转化时间格式margin-t-3
function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    /* var h = date.getHours();
     h = h < 10 ? ('0' + h) : h;  */
    /*var minute = date.getMinutes();   
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    return y + '-' + m + '-' + d+'  '+h+':'+minute+':'+second;*/
    //return y + '-' + m + '-' + d+' &nbsp;'+h+':'+minute;  
    return y + '-' + m + '-' + d;
};


