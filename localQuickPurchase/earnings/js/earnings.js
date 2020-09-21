
/*收益明细类型*/
var earningsType = getQueryString("earningsType");
if(earningsType == 3){
    document.getElementById("headerMessage").innerHTML = "今日收益明细";
}
if(earningsType == 1){
    document.getElementById("headerMessage").innerHTML = "本月收益明细";
}
if(earningsType == 4){
    document.getElementById("headerMessage").innerHTML = "近三个月收益明细";
}

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
        url:"/localQuickPurchase/earningsUpgradeLog/findEarnings",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"userSeq" : seq,"earningsType":earningsType}),
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

/*
*  html = '<p class="positionContent">未搜索到此订单!</p>';
                $(".order_details ul").append(html);*/

/*上拉加载*/
function goodsList() {
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/earningsUpgradeLog/findEarnings",
        data:JSON.stringify({"userSeq" : seq,"pageIndex" : pageIndex,"earningsType":earningsType}),
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
        url:"/localQuickPurchase/earningsUpgradeLog/findEarnings",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"userSeq" : seq,"orderno":orderno,"earningsType" : earningsType}),
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
        /*升级类型*/
        var upgradeList = logistics[i].upgrade;
        /*购买者名称*/
        var buyName = logistics[i].buyName;
        /*购买者用户类型名称*/
        var userTypeName = logistics[i].userTypeName;
        /*用户类型名称*/
        var superiorTypeName = logistics[i].superiorTypeName;
        var buySeq = logistics[i].userSeq;
        html += '<li>';
        html += '<div class="li_item">';
        html += '<p >';
        html += '<span>'+buyName+'</span>';
        html += '<span class="icon"><i>'+userTypeName+'</i></span>';
        /*html += '</span>';*/
        html += '</p>';
        html += '<p>收益：<span class="colorR">+'+logistics[i].earnings+'</span></p>';
        html += '</div>';
        html += '<div  class="li_item orderNum">';
        html += '<span>'+logistics[i].orderno+'</span>';
        html += '<span>'+formatDate(logistics[i].purchaseDate)+'</span>';
        html += '</div>';
        html += '<div class="li_item porduct_name"> <div class="porduct_list">';
        var goodsName = "";
        for (var j = 0; j <logistics[i].orderGoodsDetail.length; j++) {
            goodsName = logistics[i].orderGoodsDetail[j].goodsName;
            if (null != goodsName && "" != goodsName) {
                html += '<span class="goodsName">商品：'+logistics[i].orderGoodsDetail[j].goodsName+'</span>';
            }
        }
        html += '</div>';
        if (null != goodsName && "" != goodsName) {
            html += '<span class="phoneNum">'+logistics[i].mobile+'</span>';
        }
        html += '</div>';
        html += '<div class=" btn">';
        html += '<div class="right"><button class="give" onclick=jumpCoupons("'+buySeq+'","'+buyName+'","'+seq+'","'+superiorTypeName+'","'+userTypeName+'")><赠送TA红包></赠送TA红包></button></div>';
        if(upgradeList || upgradeList == 'true'){
            html += '<div class="left"><button class="invitation "  data-buySeq="'+buySeq+'">邀请TA身份升级</button></div>';
        }


        html += '</div>';
        html += '</li>';

    }
    return html;
}



//点击邀请TA身份升级
function inviationCss(){
    $('.windowM').css('display','block');
    $('.modal-dialog').css('display','block');
    $('.Reconfirm').css('display','none');
}

$('body').on('click','.invitation',function () {
    /*样式控制*/
    var bool = findUpgrade($(this).attr("data-buySeq"));
    if (bool){
        inviationCss();
    }
})

function findUpgrade(buySeq){
    var bool = false;
    $.ajax({
        type:'post',
        url:'/localQuickPurchase/earningsUpgradeLog/findUpgrade',
        data:{
            "superiorSeq":seq,
            "userSeq":buySeq
        },
        dataType:"json",
        async:false,
        success:function (data) {
            var code = data.code;
            if(code == 200){
                var upgrade = data.data;
                if(upgrade != null || upgrade.length > 0){
                    var html = getUpgrade(upgrade,buySeq);
                    $(".upgrade").empty();
                    $('.upgrade').append(html);
                    //$(html).appendTo('.upgrade');
                    bool = true;
                }else{
                    hui.toast("该用户不符合升级条件")
                }
            }else {
                hui.toast("该用户不符合升级条件")
            }
        }
    });
    return bool;
}

function getUpgrade(upgrade,buySeq){
    html = '';
    if (upgrade.length > 0){
        // html += '<div class="li">';
        html += getListUpgrade(upgrade[0],buySeq);
        if (upgrade.length > 1){
            html += getListUpgrade(upgrade[1],buySeq);
        }
        html += '</div>';
        if(upgrade.length > 2){
            html += '<div class="li">';
            html += getListUpgrade(upgrade[2],buySeq);
            if (upgrade.length > 3) {
                html += getListUpgrade(upgrade[3],buySeq);
            }
            // html += '</div>';
        }
    }
    return html;
}

function getListUpgrade(upgrade,buySeq){
    var upgradeType = upgrade.upgradeType;
    var twiceContent = upgrade.twiceContent;
    html = '';
    html += '<div class="li_item">';
    //html += '<span class="icon"></span>';
    html += '<div class="icon_img"><img  src="'+upgrade.icon+'"></div>';
    html += '<div class="item_text" data-type="'+upgradeType+'" data-content="'+twiceContent+'" data-buySeq="'+buySeq+'">';
    html += '<p class="upgrade">'+upgrade.upgrade+'</p>';
    html += '<p class="upgradeContent">'+upgrade.upgradeContent+'</p>';
    html += '</div>';
    html += '</div>';
    return html;
};

$('body').on('click','.item_text',function () {
    var upgradeType = $(this).attr("data-type");
    var twiceContent = $(this).attr("data-content");
    var buySeq = $(this).attr("data-buySeq");
    /*二次确认弹窗*/
    li_itemCss(upgradeType,twiceContent,buySeq);
   /* hui.confirm(twiceContent,['否','是'],function () {
        upgradeTypeClick(buySeq,upgradeType);
    });*/

})

/*向下级邀请升级*/
function upgradeTypeClick(buySeq,upgradeType){
    $.ajax({
        type:'post',
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/earningsUpgradeLog/saveEarningsUpgradeLog",
        data:JSON.stringify({"userSeq" : buySeq,"superiorSeq" : seq,"upgradeType":upgradeType}),
        dataType:"json",
        async:true,
        success:function (data) {
            var code = data.code;
            if (code == 200){
                hui.toast("邀请成功!")
            }else {
                hui.toast("网络异常,请稍后再试!");
            }
        }
    });
}

function li_itemCss(upgradeType,twiceContent,buySeq){
    /*清空链表*/
    $('.twiceContent').empty();
    $('.modal-dialog').css('display','none');
    $('.Reconfirm').css('display','block');
    html = '<p class="mgs_con">'+twiceContent+'</p>';
    html += '<div class="list_btn ReconfirmBtn">';
    html += '<button class="cancel">否</button>';
    html += '<button class="sure" data-type="'+upgradeType+'" data-buySeq="'+buySeq+'">是</button>';
    html += '</div>';
    $('.twiceContent').append(html);
}

/*删除弹窗的升级类型*/
$('body').on('click','.close',function () {
    $('.windowM').css('display','none');
})

//再次确定
$('body').on('click','.sure',function () {
    $('.windowM').css('display','none');
    var upgradeType = $(this).attr("data-type")
    var buySeq = $(this).attr("data-buySeq")
    upgradeTypeClick(buySeq,upgradeType);
})

$('body').on('click','.cancel',function () {
    $('.windowM').css('display','none');
})

/**
 * 跳转赠送红包页面
 * @param receiveSeq		接收人seq
 * @param receiveName		接收人名称
 * @param giftSeq			赠送人seq
 * @param giveTitle			赠送人职称：经销商
 * @param receiveTitle		接收人职称：VIP用户
 */
function jumpCoupons(receiveSeq,receiveName,giftSeq,giveTitle,receiveTitle) {
    if (receiveSeq == null || receiveName == null || giftSeq == null){
        hui.alert("缺少赠送人信息！");
        return;
    }
    window.location.href = "/localQuickPurchase/coupons/html/inviteFriends.html?receiveSeq="+receiveSeq
        +"&receiveName="+receiveName+"&giftSeq="+giftSeq+"&giveTitle="+giveTitle+"&receiveTitle="+receiveTitle;
}






























































