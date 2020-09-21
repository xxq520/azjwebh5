/*供应商seq*/
var supplierSeq = getQueryString("supplierSeq");
hui.refresh('#refreshContainer', downMove);
hui.loadMore(goodsList);
var isLoading = false;
var first = true;
var pageIndex = 1;
var pageSize = 10;

//下拉刷新
function downMove(){
    $(".order_details .positionContent").empty();
    loadingdate("加载中...");
    $.ajax({
        type:"GET",
        url:"/localQuickPurchase/earningsUpgradeLog/countGoodsReferrerPrice",
        contentType: "application/json;charset=utf-8",
        dataType : "json",//设置返回值得类型
        data:({"userSeq" : userSeq,"supplierSeq" : supplierSeq}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            clearLoading();
            var html = '';
            var code = data.code;
            if (code == 200){
                var logistics = data.data;
                if(logistics == null || logistics.length == 0){
                    html = '<p class="positionContent" style="margin-top:6.8888rem">暂时没有订单!</p>';
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
                    html = '<p class="positionContent" style="margin-top:6.8888rem">暂时没有订单!</p>';
                    $(".order_details ul").append(html);
                }
            }else{
                //结束刷新
                hui.endRefresh();
                hui.loading('加载中...', true);
                html = '<p class="positionContent" style="margin-top:6.8888rem">暂时没有订单!</p>';
                $(".order_details ul").append(html);
            }
        }
    });
};

/*上拉加载*/
function goodsList() {
    $.ajax({
        type:"GET",
        url:"/localQuickPurchase/earningsUpgradeLog/countGoodsReferrerPrice",
        contentType: "application/json;charset=utf-8",
        data:({"userSeq" : userSeq,"supplierSeq" : supplierSeq,"pageIndex" : pageIndex}),
        dataType: "json",	//设置返回值得类型
        async:false,
        success:function(data){
            var code = data.code;
            if (code == 200){
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
                    html = '<p class="positionContent" style="margin-top: -2.1112rem">已经到头了...</p>';
                    $('.order_details').append(html);
                    $("#hui-load-more").html("");
                    $("#hui-load-more").css('position','inherit');
                    //hui.endLoadMore(true, '已经到头了...');
                    return false;
                }
            } else{
                hui.endLoadMore(true, '');
                html = '<p class="positionContent" style="margin-top: -2.1112rem">已经到头了...</p>';
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

function getDataList(logistics){
    var html = '';
    for(var i = 0;i<logistics.length;i++){
        html += '<li>';
        html += '<div class="li_item">';
        html += '<p >';
        html += '<span style="font-size: .5667rem">订单号:'+logistics[i].orderno+'</span>';
        html += '</p>';
        html += '<p>收益：<span class="colorR">+'+logistics[i].income+'</span></p>';
        html += '</div>';
        html += '<div  class="li_item orderNum">';
        html += '<span>'+logistics[i].orderno+'</span>';
        html += '<span>'+formatDate(logistics[i].purchaseDate)+'</span>';
        html += '</div>';
        html += '<div class="li_item porduct_name"> <div class="porduct_list">';
        for (var j = 0; j <logistics[i].listOrderDetails.length; j++) {
            html += '<div class="pull-left goods-img"><img src="'+logistics[i].listOrderDetails[j].goodsImg+'" onerror="this.src=\'/localQuickPurchase/distributionApp/images/head.png\'"></div>'
            html += '<div><span class="goodsName">商品：'+logistics[i].listOrderDetails[j].name+'</span>';
            html += '<span >'+logistics[i].listOrderDetails[j].goodsNumAndUnit+'</span></div>';
        }
        html += '</div>';
        html += '<span class="phoneNum">'+logistics[i].incomeType+'</span>';
        html += '</div>';
        html += '<div class=" btn">';
        // html += '<div class="right"><button class="give" onclick=jumpCoupons("'+buySeq+'","'+buyName+'","'+seq+'","'+superiorTypeName+'","'+userTypeName+'")><赠送TA红包></赠送TA红包></button></div>';
        html += '</div>';
        html += '</li>';

    }
    return html;
}

/*搜索*/
function searchOrderno() {
    var orderno =document.getElementById("textOrder").value;
    // if(mobile == "" || mobile == null){
    //     hui.toast("请输入供应商手机号!");
    //     return;
    // }
    orderno = orderno.replace(/\s+/g,"");
    loadingdate("搜索中...");
    $.ajax({
        type:"GET",
        url:"/localQuickPurchase/earningsUpgradeLog/countGoodsReferrerPrice",
        contentType: "application/json;charset=utf-8",
        data:({"userSeq" : userSeq,"supplierSeq" : supplierSeq,"orderno":orderno}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            $(".order_details ul").empty();
            $(".positionContent").empty();
            clearLoading();
            var html = '';
            var code = data.code;
            if (code == 200){
                var logistics = data.data;
                if(logistics == null || logistics.length == 0){
                    html = '<p class="positionContent" style="margin-top:6.8888rem">未搜索到此订单!</p>';
                    $(".order_details ul").append(html);
                    return false;
                }
                if(logistics != null && logistics.length > 0){
                    html = getDataList(logistics);
                    $(".order_details ul").empty();
                    $(html).appendTo('.order_details ul');
                } else {
                    html = '<p class="positionContent" style="margin-top:6.8888rem">未搜索到此订单!</p>';
                    $(".order_details ul").append(html);
                }
            }else{
                html = '<p class="positionContent" style="margin-top:6.8888rem">未搜索到此订单!</p>';
                $(".order_details ul").append(html);
            }
        }
    });
};

