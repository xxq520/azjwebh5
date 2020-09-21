//没有登录的用户强制跳转至未登录个人中心页面
(function(){
    if (!isLogin()) {
        var urlVal = window.location.href;
        setCookie("loginRetrunUrl",urlVal);
        noLoginPage();
        return;
    }
})();



var pageIndex = 1; //页码（默认：第1页）
var isNoMore = false;//没有更多数据
var orderStatus = 3;//订单状态 1:待发货 2:已发货 3:待退款 4:审核中 5:审核完成
var $searchBox = $('.endingRefund-con');


$('.tabbar-nav').each(function (index) {
    $(this).on('click',function () {
        $(this).addClass("order-statusActive").siblings().removeClass("order-statusActive");

        if (index === 0) {
            orderStatus = 3;
            initFirst()

        } else if (index === 1) {
            orderStatus = 4
            initFirst()
        } else if (index === 2) {
            orderStatus = 5
            initFirst()

        }

        $(".Pendingrefund .endingRefund-box").empty()
       
        getRefundOrder(orderStatus);
    })
})


function  initFirst() {
    pageIndex = 1;
    isNoMore = false;
    // hui.endRefresh();
    hui.resetLoadMore();
    hui.loadMore(function () {
        getRefundOrder(orderStatus)
    })
    $searchBox.find('input').val('');
}

//第一次获取待退款订单
getRefundOrder(orderStatus);



/**
 * * 获取退款订单信息
 * @param orderStatus //订单状态 1:待发货 2:已发货 3:待退款 4:审核中 5:审核完成
 * @param searchParam 搜索关键字 非必传
 */
function getRefundOrder(orderNum,searchParam) {
    var orderList = [];
    // var url = 'http://fxyhjts.520shq.com/localQuickPurchase/business/order/list';
    var obj={
        "pageIndex": pageIndex,
        "pageSize" : 5,
        // "supplierSeq" : "4595736",
        supplierSeq:seq,
        "orderStatus" : orderNum
    };

    if (searchParam) obj.searchParam = searchParam;

    $.ajax({
        type : 'POST',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : "/localQuickPurchase/business/order/list",
        // url,
        data : JSON.stringify(obj),
        async : false,
        success : function(res) {
            if(res.code === 200){
                if (res.data.list.length) {

                    orderList = orderList.concat(res.data.list);

                    var html = buildHtml(orderNum,orderList);
                    pageIndex++;

                    hui.endLoadMore(false);

                    isNoMore = false;

                    if (!res.data.hasNextPage) {
                        isNoMore = true;
                    }
                } else {
                    // hui.toast('没有更多数据了');
                    isNoMore = true;
                    hui.endLoadMore(true);
                }

                $(".Pendingrefund .endingRefund-box").append(html);

                if (!$(".Pendingrefund .endingRefund-box").html()) {//没有数据
                    $('.dropdown').show();
                } else {
                    $('.dropdown').hide();
                }

                if (orderNum === 3) {
                    //点击退款审核跳转至退款审核详情页面
                    var $exits = $(".order-exit");
                    $exits.each(function (index) {
                        var $this = $(this);
                        $this.on('click', function () {
                            var orderno = $this.data('orderno');
                            window.location.href = `./orderCustomerdetail.html?orderno=${orderno}`
                        })
                    })
                }

            }



        },
    });
}


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
        window.history.go(-1);
    }
});

//搜索
$searchBox.on('click','button',function () {
    var keyword = $searchBox.find('input').val().trim();
    pageIndex = 1;
    //清空数据
    $(".Pendingrefund .endingRefund-box").empty();
    //重新填充新数据
    getRefundOrder(orderStatus,keyword);
})



// console.log(isNoMore);
//上拉加载更多
if (!isNoMore) {
    hui.loadMore(function (){
        getRefundOrder(orderStatus);
    });
}


function buildHtml(type,orderList) {
    var html = ''
    switch (type) {
        case 3:
            for(var i=0;i<orderList.length;i++){
                html+=`<div class="order-good">
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
                                    <span class="order-exit" data-orderno="${orderList[i].orderno}">退款审核</span>
                                </div>
                            </div>`
            }
            return html;
            break;
        case 4:
            for(var i=0;i<orderList.length;i++){



                html+=`<div class="order-good">
                                <div class="order-good-header">
                                    <span class="buy">买</span>
                                    订单号：<span class="order-num">${orderList[i].orderno}</span>
                                    <span class="good-order-status">审核中</span>

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
                                </div>
                            </div>`





           /*     html+=`<div class="order-good">
                                <div class="order-good-header">
                                    <span class="buy">买</span>
                                    订单号：<span class="order-num">${orderList[i].orderno}</span>
                                    <span class="good-order-status">审核中</span>
                                </div>
                                <div class="order-good-con flex ">
                                    <img src="${orderList[i].goodsImgUrl}" alt="">
                                    <div class="good-detail">
                                        <div class="goods-title">${orderList[i].goodsName}</div>
                                        <div class="goods-num">x${orderList[i].count}件</div>
                                        <div class="goods-fktime">付款时间:${orderList[i].payTime}</div>
                                    </div>
                                    <div class="good-con-right">
                                        <div class="good-detail-price">￥${orderList[i].amount}</div>
                                        <div class="good-detail-guige">规格:${orderList[i].spec}</div>
                                    </div>
                                </div>
                                <div class="order-good-edit flex">
                                    <span class="order-price-tit">付款金额</span>
                                    <span class="order-price">￥${orderList[i].totalAmount}</span>
                                </div>
                            </div>`*/
            }
            return html;
            break;
        case 5:
            for(var i=0;i<orderList.length;i++){
                var reviewStatus="退款成功";
                switch (orderList[i].reviewStatus) {
                    case 4:
                        reviewStatus="退款成功";
                        break;
                    default:
                        reviewStatus="审核不通过"
                }


                html+=`<div class="order-good">
                                <div class="order-good-header">
                                    <span class="buy">买</span>
                                    订单号：<span class="order-num">${orderList[i].orderno}</span>
                                    <span class="good-order-status">${reviewStatus}</span>
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
                                </div>
                            </div>`

            }
            return html;
            break;
        default:
            return html
            break
    }
}









