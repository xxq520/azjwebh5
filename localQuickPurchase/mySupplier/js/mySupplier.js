
hui.refresh('#refreshContainer', downMove);
hui.loadMore(goodsList);
var isLoading = false;
var first = true;
var pageIndex = 1;
var pageSize = 10;

//判断是否是app
var u = navigator.userAgent;
var isApp =  u.indexOf('app_webview') > -1;

// var isIos= !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);/*ios终端*/


//下拉刷新
function downMove(){
    $(".order_details .positionContent").empty();
    loadingdate("加载中...");
    $.ajax({
        type:"GET",
        url:"/localQuickPurchase/earningsUpgradeLog/findMySupplier",
        contentType: "application/json;charset=utf-8",
        dataType : "json",//设置返回值得类型
        data:({"userSeq" : userSeq}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            clearLoading();
            var html = '';
            var code = data.code;
            if (code == 200){
                var logistics = data.data;
                if(logistics == null || logistics.length == 0){
                    html = '<p class="positionContent" style="margin-top:6.8888rem">暂时没有供应商,快去招募吧!</p>';
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
                    html = '<p class="positionContent" style="margin-top:6.8888rem">暂时没有供应商,快去招募吧!!</p>';
                    $(".order_details ul").append(html);
                    
                }
            }else{
                //结束刷新
                hui.endRefresh();
                hui.loading('加载中...', true);
                html = '<p class="positionContent" style="margin-top:6.8888rem">暂时没有供应商,快去招募吧!</p>';
                $(".order_details ul").append(html);
                
            }
        }
    });
};

/*上拉加载*/
function goodsList() {
    $.ajax({
        type:"GET",
        url:"/localQuickPurchase/earningsUpgradeLog/findMySupplier",
        contentType: "application/json;charset=utf-8",
        data:({"userSeq" : userSeq,"pageIndex" : pageIndex}),
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
                    html = '<p class="positionContent">已经到头了...</p>';
                    $('.order_details').append(html);
                    
                    $("#hui-load-more").html("");
                    $("#hui-load-more").css('position','inherit');
                    //hui.endLoadMore(true, '已经到头了...');
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

function getDataList(logistics){
    var html = '';
    for(var i = 0;i<logistics.length;i++){
        /*供应商seq*/
        var hrefUrl=isApp ? 'javascript:;' : "tel:"+logistics[i].phone;
        var hrefSms=isApp ? 'javascript:;' : "sms:"+logistics[i].phone;
        var supplierSeq = logistics[i].supplierSeq;
        html += '<li>';
        html += `<div class="opt-tel">
                        <a href="${hrefUrl}" onclick=callPhone(${logistics[i].phone}) ><img class="tel-img"  src="./img/mine_ghs_icon_phone@2x.png" alt=""></a>
                       <a href="${hrefSms}"  onclick=callMsg(${logistics[i].phone}) ><img class="msg-img"   src="./img/mine_ghs_icon_sms@2x.png" alt=""></a>
                 </div>`;
        html += '<div class="pull-left notice-img"><img src="'+logistics[i].supplierHeadImg+'" onerror="this.src=\'/localQuickPurchase/distributionApp/images/head.png\'"></div>'
        html += '<div><div class="li_item">';
        // html += '<p>';
        html += '<div class="head-title__height">'+logistics[i].supplierName+'</div>';
        // html += '</p>';
        html += '</div>';
        html += '<div class="li_item porduct_name"> <div class="porduct_list">';
        html += '<span class="goodsName">绑定日期：'+formatDate(logistics[i].enterDate)+'</span>';
        html += '<span class="goodsName">累计收益：'+logistics[i].accumulatedIncome+'</span>';
        html += `<span class="goodsName">手机号码：${formatPhone(logistics[i].phone)}</span>`;
        html += `<span class="goodsName" >入驻状态：<i style="color:${logistics[i].submitStatus == 1 ? '#0ac54e' : '#f01f24'} ">${logistics[i].submitStatus == 1 ? '已提交' : '未提交'}</i></span>`;
        html += '</div>';
        html += '<div class="right"><button class="jumpCoupons" onclick=jumpCoupons("'+supplierSeq+'")>收益明细</button></div>';
        html += '</div></div>';
        html += '<div class=" btn">';
        html += '</div>';
        html += '</li>';
        /*<a href="tel:400-0000-688">400-0000-688</ a>*/
        /* submitStatus 提交状态 1已经提交 0未提交*/


    }
    return html;
}

function formatPhone(num) {
    var mobile = String(num)

    var reg = /^(\d{3})\d{4}(\d{4})$/

    return mobile.replace(reg, '$1****$2')
}

/*搜索*/
function search(){
    var mobile =document.getElementById("textOrder").value;
    // if(mobile == "" || mobile == null){
    //     hui.toast("请输入供应商手机号!");
    //     return;
    // }
    mobile = mobile.replace(/\s+/g,"");
    loadingdate("搜索中...");
    $.ajax({
        type:"GET",
        url:"/localQuickPurchase/earningsUpgradeLog/findMySupplier",
        contentType: "application/json;charset=utf-8",
        data:({"userSeq" : userSeq,"mobile" : mobile}),
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
                    html = '<p class="positionContent" style="margin-top:6.8888rem">未搜索到此供应商!</p>';
                    $(".order_details ul").append(html);
                    
                    return false;
                }
                if(logistics != null && logistics.length > 0){
                    html = getDataList(logistics);
                    $(".order_details ul").empty();
                    $(html).appendTo('.order_details ul');
                } else {
                    html = '<p class="positionContent" style="margin-top:6.8888rem">未搜索到此供应商!</p>';
                    $(".order_details ul").append(html);
                }
            }else{
                html = '<p class="positionContent" style="margin-top:6.8888rem">未搜索到此供应商!</p>';
                $(".order_details ul").append(html);
                
            }
        }
    });
}





function callPhone(phone) {
    if (isApp) {
        $(this).click(function (e) {
            e.preventDefault()
            window.action.phoneCall(phone.toString());
        })
    }
    
}

function callMsg(phone) {
    if (isApp) {
        $(this).click(function (e) {
            e.preventDefault()
            window.action.infofn(phone.toString());

        })
    }
}


function jumpCoupons(supplierSeq) {
    window.location.href="/localQuickPurchase/mySupplier/mySupplierEarnings.html?supplierSeq="+supplierSeq;
}
