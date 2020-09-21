//没有登录的用户强制跳转至未登录个人中心页面
(function(){
    if (!isLogin()) {
        var urlVal = window.location.href;
        // sltHide();
        setCookie("loginRetrunUrl",urlVal);
        noLoginPage();
        return;
    }
})();

var deilverStatus = getQueryString("deilverStatus");//1 待发货 2 已发货

var pageIndex = 1; //页码（默认：第1页）
var isNoMore = false;//没有更多数据
var orderStatus = deilverStatus;//订单状态 1:待发货 2:已发货 3:待退款 4:审核中 5:审核完成
// var url = "http://192.168.1.84:10000";
$(function () {
    sendpder(orderStatus);//订单状态 1:待发货 2:已发货 3:待退款 4:审核中 5:审核完成
    var $p = $('.topBarsearch').find('h1')

    if (orderStatus == 1) {
        $p.text('待发货');
        $(".shareBotton").find('img').hide()
    } else if (orderStatus == 2) {
        $p.text('已发货')
    }
});




//搜索事件处理方法
$("#search-btn").click(function () {
    pageIndex = 1;
    var index = $(".endingRefund-con").find("input").val();
    // $("#orderlist").html('');
    $(".Pendingrefund .endingRefund-box").empty()
    sendpder(orderStatus,index);
});
$(".go-back").on('click',function () {
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1;
    // 如果不是app打开的  则返回首页
    if(isappwebview){
        try {
            //如果没有上一页尝试返回原生
            // 调app原生返回  webview
            window.action.app_back();
        } catch (e) {
        }
        try {
            var json = {'function':'goBack'};
            window.webkit.messageHandlers.goBack.postMessage(json);
        } catch (e) {
        }
    }else{
        if (orderStatus == 2) {//已发货
            window.location.href = '/upms/static/personalCenter.html'
        } else {
            window.history.go(-1);
        }
    }
});
//请求订单列表数据
function sendpder(orderStatus,searchParam,deliveryTime) {
    var datalis=[];
    var datalinfo = {
        "pageIndex":pageIndex,
        "pageSize" : 10,
        "supplierSeq" : seq,//getUserSeq()获取用户的seq
        "orderStatus" :orderStatus
    }
    if (searchParam) datalinfo.searchParam = searchParam;
    if (deliveryTime) datalinfo.deliveryTime = deliveryTime;
    $.ajax({
        type : "post",//定义提交的类型
        url : "/localQuickPurchase/business/order/list",
        dataType : "json",//设置返回值得类型,
        contentType: "application/json;charset=utf-8",
        data : JSON.stringify(datalinfo),
        async : false,//是否异步请求，false为同步
        success : function(data) {//成功返回值执行函数
            if(data.code==200){
                if(data.data.list.length){
                    datalis = datalis.concat(data.data.list);
                    var html = initNanlist(datalis);
                    pageIndex++;
                    hui.endLoadMore(false);
                    isNoMore = false;
                    $(".Pendingrefund .endingRefund-box").append(html);


                }else{
                    // hui.toast('没有更多数据了');
                    isNoMore = true;
                    hui.endLoadMore(true);
                    // $(".dropdown").show();
                }

                if (!!$(".endingRefund-box").html()) {
                    $(".dropdown").hide();
                } else {
                    $(".dropdown").show();
                }
            }else if(data.code==400){
                hui.toast('网络异常,请稍后再试!');
            }else{
                hui.toast('网络异常,请稍后再试!');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            hui.toast('网络异常,请稍后再试!');
            console.log('error');
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });

}
//页面渲染数据
function  initNanlist(orderList) {
    var html = "";
    for(var i=0;i<orderList.length;i++){



        html +=`<div class="order-good">
                                <div class="order-good-header">
                                    <span class="buy">买</span>
                                    订单号：<span class="order-num">${orderList[i].orderno}</span>
                                </div>
                                <div class="order-good-con flex ">
                                     <div class="left">
                                          <img src="${orderList[i].goodsImgUrl}" alt="">
                                         </div>
                                  
                                    <div class = "right">
                                     <div class="good-con">
                                        <div class="goods-title">${orderList[i].goodsName}</div>
                                       
                                       <div class="good-detail-price">￥${orderList[i].amount}</div>
                                    </div>
                                    <div class="good-con">
                                         <div class="goods-num">x${orderList[i].count}件</div>
                                        <div class="good-detail-guige">规格:${orderList[i].spec}</div>
                                    </div>
                                      <div class="good-con">
                                              <div class="goods-fktime">付款时间:${orderList[i].payTime}</div>
                                    </div>
                                      </div>
                              
                                </div>
                                <div class="order-good-edit flex">
                                    <span class="order-price-tit">付款金额</span>
                                    <span class="order-price">￥${orderList[i].totalAmount}</span>
                                                    <span class="order-exit" data-orderno="${orderList[i].orderno}" onclick=goOrderDetail(this)>${orderStatus == 1 ? '去发货' : "订单详情"}</span>

                                </div>
                            </div>`

    }

    return html

}


//订单详情按钮
function goOrderDetail(that) {
    var orderNo = $(that).data("orderno");

    window.location.href = "./deliverOrderDetail.html?orderno=" + orderNo + "&deliverStatus=" + deilverStatus;
        // window.location.href="./orderCustomerdetail.html?orderno=" + orderNo + "&deilver=" + 1;
}


//时间选择器
(function(mui) {
    mui.init({
        gestureConfig:{
            tap:false
        }
    });
    mui.init();
    var uBtdDate1 = $("#pickerck").get(0);
    var optionsJson = document.getElementById("pickerck").getAttribute('data-options') || '{}';
    var options = JSON.parse(optionsJson);
    var cancelBtn = document.getElementsByClassName('mui-dtpicker-title')[0];
    var addH2 = document.createElement("h2");
    addH2.setAttribute("class", "addTitle");
    $(cancelBtn).before(addH2);
    // console.log(uBtdDate1);
    uBtdDate1.onclick= function() {
        DatePicker  = new mui.DtPicker(options);
        DatePicker.show(function(rs) {
            var dinx=rs.y.value+"-"+rs.m.value+"-"+rs.d.value;
            pageIndex = 1;
            // $("#orderlist").html('');
            $(".Pendingrefund .endingRefund-box").empty()
            sendpder(orderStatus,null,dinx);
        });
    };
})(mui);
//上拉加载更多
if (!isNoMore) {
    hui.loadMore(function (){
        sendpder(orderStatus);
    });
}
