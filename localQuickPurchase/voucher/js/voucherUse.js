
/*优惠券类型 1：满减；2：立减；3：折扣；4：代金券；5：抵扣券*/
var couponType = 5;

hui.refresh('#refreshContainer', downMove);
hui.loadMore(goodsList);
var isLoading = false;
var first = true;
var pageIndex = 1;

//下拉刷新
function downMove(){
    $(".order_details .positionContent").empty();
    loadingdate("加载中...");
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/dOrders/findUserVoucherOrder",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"userSeq" : userSeq,"couponType":couponType}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            clearLoading();
            var html = '';
            var code = data.code;
            if (code == 200){
                var logistics = data.data;
                if(logistics == null || logistics.length == 0){
                    html = '<p class="positionContent">暂时没有订单!</p>';
                    $(".order_details ul").append(html);
                    return false;
                }
                if(logistics != null && logistics.length > 0){
                    html = getDataList(logistics);
                    pageIndex = 2;
                    setTimeout(function(){
                        $(".order_details ul").empty();
                        $(html).appendTo('.order_details ul');
                        //结束刷新
                        hui.endRefresh();
                        //重置加载更多状态
                        hui.resetLoadMore();
                        hui.loading('加载中...', true);
                        if(!first){
                            hui.toast("下拉刷新成功");
                        }
                        first = false;
                    },500)
                } else {
                    //结束刷新
                    hui.endRefresh();
                    hui.loading('加载中...', true);
                    html = '<p class="positionContent">暂时没有订单!</p>';
                    $(".order_details ul").append(html);
                }
            }else{
                //结束刷新
                hui.endRefresh();
                hui.loading('加载中...', true);
                html = '<p class="positionContent">暂时没有订单!</p>';
                $(".order_details ul").append(html);
            }
        }
    });
};

/*上拉加载*/
function goodsList() {
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/dOrders/findUserVoucherOrder",
        data:JSON.stringify({"userSeq" : userSeq,"pageIndex" : pageIndex,"couponType":couponType}),
        dataType: "json",	//设置返回值得类型
        async:false,
        success:function(data){
            var code = data.code;
            if (code == 200 && data.data != null){
                var logistics = data.data;
                var html = '';
                if(logistics.length > 0) {
                    html = getDataList(logistics);
                    $(".order_details ul").append(html);
                    pageIndex++;
                    hui.endLoadMore(false);
                    isLoading = false;
                }else{
                    hui.endLoadMore(true, '');
                    html = '<p class="positionContent">已经到头了...</p>';
                    $('.order_details').append(html);
                    $("#hui-load-more").html("");
                    $("#hui-load-more").css('position','inherit');
                    return false;
                }
            } else{
                hui.endLoadMore(true, '');
                html = '<p class="positionContent">已经到头了...</p>';
                $('.order_details').append(html);
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
}

/*搜索*/
$('body').on('click','#searchOrderno',function () {
    var orderno =document.getElementById("textOrder").value;
    /*if(orderno == "" || orderno == null){
        hui.toast("请输入订单号!");
        return;
    }*/
    orderno = orderno.replace(/\s+/g,"");
    loadingdate("搜索中...");
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/dOrders/findUserVoucherOrder",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"userSeq" : userSeq,"orderno":orderno,"couponType" : couponType}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            $(".order_details ul").empty();
            clearLoading();
            var html = '';
            var code = data.code;
            if (code == 200){
                var logistics = data.data;
                if(logistics == null || logistics.length == 0){
                    html = '<p class="positionContent">未搜索到此订单!</p>';
                    $(".order_details ul").append(html);
                    return false;
                }
                if(logistics != null && logistics.length > 0){
                    html = getDataList(logistics);
                    $(".order_details ul").empty();
                    $(html).appendTo('.order_details ul');
                } else {
                    html = '<p class="positionContent">未搜索到此订单!</p>';
                    $(".order_details ul").append(html);
                }
            }else{
                html = '<p class="positionContent">未搜索到此订单!</p>';
                $(".order_details ul").append(html);
            }
        }
    });
});

function getDataList(logistics){
    var html = '';
    for(var i = 0;i<logistics.length;i++){
        html += '<li>';
        html += '<div class="li_item">';
        html += '<p >';
        html += '<span>'+logistics[i].orderno+'</span>';
        /*html += '</span>';*/
        html += '</p>';
        html += '<p>优惠金额：<span class="colorR">'+logistics[i].couponDiscountMoney+'</span></p>';
        html += '</div>';
        html += '<div  class="li_item orderNum">';
        html += '</div>';
        html += '<div class="li_item porduct_name"> <div class="porduct_list">';
        for (var j = 0; j <logistics[i].orderGoodsDetail.length; j++) {
            html += '<div><div class="pull-left goods-img" ><img src="'+logistics[i].orderGoodsDetail[j].goods_img+'" onerror="this.src=\'/localQuickPurchase/distributionApp/images/head.png\'"></div>'
            html += '<div><span class="goodsName">商品：'+logistics[i].orderGoodsDetail[j].goodsName+'</span>';
            html += '<span >'+logistics[i].orderGoodsDetail[j].goodsNumAndUnit+'</span></div></div>';
        }
        html += '</div>';
        html += '<span class="phoneNum">'+formatDate(logistics[i].purchaseDate)+'</span>';
        html += '</div>';
        html += '</li>';
    }
    return html;
}















































