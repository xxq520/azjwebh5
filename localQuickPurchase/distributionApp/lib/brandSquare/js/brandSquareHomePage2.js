var overallSituationPath = "";
var href = window.location.href;
var urlVal = href.substring(0,href.indexOf("distributionVA/"))+"distributionVA/personal/shareApp";
var localUrlVal = window.location.href;
var portValue = "";
var page = 1;
var appendMark = 0;


var shareSeq=getQueryString("shareSeq");

if(shareSeq){
    setCookie("shareSeq",shareSeq,1);
}

$(function () {
    //复制二维码
    $(".shopCode").click(function (e) {
        e.stopPropagation();
        if ($(".ewmcode").length == 0) {
            var weixinCode = '<div class="ewmcode" value="0"><img src=""/></div>';
            $("body").append(weixinCode);
        }
        // 生成二维码
        $(".ewmcode img").attr("src", "/localQuickPurchase/shareQRCode/personalIndexURL?urlVal=" + localUrlVal);
        var ewmcodeVal = $(".shopCode").attr("value");
        if (ewmcodeVal == "1") {
            $(".ewmcode").hide();
            $(".shopCode").attr("value", "0");
        } else {
            $(".ewmcode").show();
            $(".shopCode").attr("value", "1");
        }
    });
});

tests();
function tests() {
    if($(".ewmcode").length == 0){
        var weixinCode = '<div class="ewmcode" value="0"><img src=""/></div>';
        $("body").append(weixinCode);
    }
    // 生成二维码
    $(".ewmcode img").attr("src","/localQuickPurchase/shareQRCode/personalIndexURL?urlVal="+localUrlVal);
    $(".ewmcode").hide();
    $(".shopCode").attr("value","0");
}


//点击分类按钮跳转分类页面
$(".brandSquareClassify").click(function(){
    window.location.href = "/localQuickPurchase/distributionVA/brandSquareClassify";
});


$(document).on("click",".hui-list-info",function(){
    window.location.href = "/localQuickPurchase/distributionVA/brandSquareClassify";
});

$(document).on("click",".goBtn,.pic",function(){
    var hotSaleGoodsId = $(this).find(".hotSaleGoodsId").text();

    if(hotSaleGoodsId != null || hotSaleGoodsId != "" || hotSaleGoodsId != undefined) {
        hotSaleGoodsId = $(this).attr("hotSaleGoodsId");
    }


    if(hotSaleGoodsId != null && hotSaleGoodsId != "" && hotSaleGoodsId != undefined) {
        //增加关注数
        $.ajax({
            type: "GET",	//定义提交的类型9
            url: "/localQuickPurchase/brandCountAction/addFollowNumber?key=" + hotSaleGoodsId,
            async: false,	//是否异步请求，false为同步
            success: function (data) {
                if (data != true) {
                    alert("增加关注量出现错误");
                }
            }
        });

        var goodsId = $(this).find(".goodsId").text();
        if (goodsId == null || goodsId == "defined" || goodsId == "") {
            goodsId = $(this).attr("goodsId");
        }

        if (seq == null || seq == 0) {
            seq = 0;
        }
        // 进入原生商品详情界面
        try {
            //ios
            var json = {'goodsId':goodsId};
            window.webkit.messageHandlers.goGoodsDetail.postMessage(json);
            //alert("进入商品详情ios");
            return;
            // window.action.app_goodsDetails(goodsId, 0);
        } catch (e) {

        }
        //alert("进入商品详情h5");
        window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/0/" + seq;
    }
});



//点击搜索框进入搜索界面
$("#hui-header-sreach input").on('click',function(){
    window.location.href="/localQuickPurchase/distributionVA/brandSquareHistorySearch?identifyMark=1";
});


//获取品牌广场顶部banner图
$.ajax({
    type: 'POST',
    dataType: 'json',
    async : false,
    contentType: "application/json;charset=utf-8",
    url: '/localQuickPurchase/bannerAction/listAllBanner',
    data: JSON.stringify({
        "identifyType": 7
    }),
    success: function (data) {
        //TODOO
        if (data.code == "200") {
            var bannerList = data.data;
            portValue = data.equipmentData;
            console.log(bannerList);

            var bannerListStr = "";
            for(var i = 0; i < bannerList.length; i++){
                var bannerJumpTarget = bannerList[i].banner.jumpTarget;
                var bannerLocation = bannerList[i].banner.imageLocation;
                var identifyType = bannerList[i].banner.identifyType;
                if(identifyType != 5) {
                    bannerListStr += "<li><a href='" +
                        bannerJumpTarget +
                        "'><img src='" +
                        portValue + bannerLocation +
                        "'/></a></li>";
                }
            }
            $(".bannerListUL").append(bannerListStr);

            //开启优惠券分页
            TouchSlide({
                slideCell:"#focus",
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                autoPlay:true,
                autoPage:true //自动分页//自动播放
            });
        }
    }
});




//
//渲染品牌推荐信息
//
$.ajax({
    type: 'GET',
    dataType: 'json',
    async : false,
    contentType: "application/json;charset=utf-8",
    url: '/localQuickPurchase/brandSquareShopAction/findBrandRecommendInfo',
    success: function (data) {
        //TODOO
        if (data.code == "200") {
            console.log(data.data);
            var dateList = data.data;
            var dataUrl = data.equipmentData;
            if(dateList){
                var brandRecommendHTML = "";
                for(var i = 0; i < dateList.length;i++){
                    var modularName = dateList[i].modularDate.modularName;

                    brandRecommendHTML += "<div class='brand'>"+
                        "<div class='hui-list-text'>"+
                        "<div class='hui-list-text-content'><span>"+modularName+"</span></div>";

                    if(dataUrl == false) {
                        brandRecommendHTML += "<div class='hui-list-info'>更多>></div>";
                    }

                    brandRecommendHTML += "</div>"+
                        "<div class='content'>"+
                        "<ul class='contentUL'>";

                    if(dateList[i].recommendDate){
                        var brandRecommendList = dateList[i].recommendDate;

                        var dataSize = 0;
                        if (brandRecommendList.length < 8) {
                            if (brandRecommendList.length < 4) {
                                dataSize = brandRecommendList.length
                            } else {
                                dataSize = 4;
                            }
                        } else if (brandRecommendList.length >= 8) {
                            dataSize = 8;
                        }
                        for (var j = 0; j < dataSize; j++) {

                            var jumpTarget = "";
                            var brandLogoImg = brandRecommendList[j].brandLogoImg;
                            var brandName = brandRecommendList[j].brandName;

                            if (brandRecommendList[j].jumpTarget == null || brandRecommendList[j].jumpTarget == "" || brandRecommendList[j].jumpTarget == undefined) {
                                jumpTarget = "#";
                            } else {
                                jumpTarget = brandRecommendList[j].jumpTarget;
                            }

                            brandRecommendHTML += "<li>" +
                                "<a href='" + jumpTarget + "'><img src='" + portValue + brandLogoImg + "' alt=''></a>" +
                                "<div>" + brandName + "</div>" +
                                "</li>";
                        }
                    }
                    brandRecommendHTML += "</ul></div></div>";
                }
                $(".brandRecommend").append(brandRecommendHTML);
            }

        }
    }
});

//
// 渲染热卖商品信息
//
$('.brandHotSaleGoods').dropload({
    scrollArea : window,
    loadDownFn : function(me){
        $.ajax({
            type: 'GET',
            url: '/localQuickPurchase/brandSquareShopAction/findBrandHotSaleGoods?pageIndex='+page+'&pageSize=2',
            dataType: 'json',
            success: function(data){
                console.log(data);
                page++;
                // 每次数据加载完，必须重置
                if (data.code == "200") {
                    if(data.data.goodsListInfo){
                        console.log(data.data);
                        var goodsInfo = data.data;
                        var brandAndGoodsHTML = "";
                        if(goodsInfo){
                            if(appendMark == 0) {
                                if (goodsInfo.modularDate) {
                                    var modularName = goodsInfo.modularDate.modularName;
                                    brandAndGoodsHTML += "<div class='brand'>" +
                                        "<div class='hui-list-text'>" +
                                        "<div class='hui-list-text-content'><span>" + modularName + "</span></div>" +
                                        "</div>" +
                                        "<div class='goodsList'>";
                                }
                                brandAndGoodsHTML += "</div></div>";
                                $(".dropload-down").before(brandAndGoodsHTML);
                                appendMark = 1;
                            }

                            var brandGoodsHTML = "";
                            if(goodsInfo.goodsListInfo){
                                var goodsList = goodsInfo.goodsListInfo;
                                for(var i = 0; i < goodsList.length; i++){

                                    var fabulousNum = goodsList[i].fabulousNum;
                                    var goodsCode = goodsList[i].goodsCode;
                                    var hotSaleGoodsId = goodsList[i].hotSaleGoodsId;
                                    var goodsId = goodsList[i].goodsId;
                                    var goodsName = goodsList[i].goodsName;
                                    var distributionPrice = goodsList[i].distributionPrice;
                                    var goodsPrice = goodsList[i].goodsPrice;
                                    var thumbnail = "";
                                    if(goodsList[i].thumbnail){
                                        thumbnail = goodsList[i].thumbnail;
                                    }

                                    brandGoodsHTML += "<div class='goods'>" +
                                        "<div class='pic' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "'><img src='" + thumbnail + "' alt=''></div>" +
                                        "<div class='rContent'>" +
                                        "<div class='goodsName'>" + goodsName + "</div>" +
                                        "<div class='bottom'>" +
                                        "<div class='price'>" +
                                        "<span>抢购价￥<i>" + distributionPrice + "</i></span>" +
                                        "<span>" + goodsPrice + "</span>" +
                                        "</div>" +
                                        "<div class='btn'>" +
                                        "<div class='follow'><i>" + fabulousNum + "</i>人已关注</div>" +
                                        "<button type='button' class='goBtn' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "'>立即抢购</button>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>";
                                }
                            }

                        }

                        $(".goodsList").append(brandGoodsHTML);
                        me.resetload();
                    }else {
                        $(".dropload-down").hide();
                    }
                }
            },
            error: function(xhr, type){
                //alert('Ajax error!');
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
    }
});

/*
function goBack(){
    try{
        // 调app原生返回
        //window.action.app_back();

        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(isAndroid == true){
            //alert("返回安卓");
            window.action.app_back();
        }

        if(isiOS == true){
            //alert("返回ios");
            var json = {'function':'goBack'};
            window.webkit.messageHandlers.goBack.postMessage(json);

        }
    }catch(e){

    }
    setTimeout(function(){
        //alert("返回h5");
        if(document.referrer == ""){
            window.location.href="/localQuickPurchase/distributionVA/index";
        }else{
            javascript:history.go(-1);
        }
    }, 200);
}
*/

function goBack() {
    if(document.referrer == ""){
        var u = navigator.userAgent;
        var isappwebview = u.indexOf('app_webview') > -1
        if (isappwebview) {
            try {//如果没有上一页尝试返回原生
                // 调app原生返回  webview
                window.action.app_back();
                // ios  调app原生返回  wkwebview

            } catch (e) {
            }
            try {
                var json = {'function': 'goBack'};
                window.webkit.messageHandlers.goBack.postMessage(json);
            } catch (e) {
            }
        }else{
            window.location.href = "/localQuickPurchase/distributionVA/index";
        }
    }else{
        javascript:history.go(-1);
    }

}


window.onload=function(){
    //调整banner距离顶部header的位置
    //$(".bannerListUL").css("margin","45px 0px 0px");
    //去除插件中li加载后存在1.2.3.....数字编号
    $(".hd li").text("");
};



$('.share').click(function(){
    var localUrlValForIos = localUrlVal;
    var localUrlValForWeb = localUrlVal + "?shareSeq=" + seq;
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if (isappwebview) {

        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isiOS == true) {
            var json = {
                'shareUrl': localUrlValForIos,
                "title": '自购省钱 分享赚钱-爱之家商城',
                "content": '打造1小时生活圈、体验社交新零售的便捷与便利、实现线上线下无缝对接的新理念平台',
                "img": 'http://nfxts.520shq.com:7050/localQuickPurchase/distributionApp/images/azj.png',
                "className": '.share-content',
                "identifyMark" : 1
            };

            //alert("分享ios");
            window.webkit.messageHandlers.brandSquareShare.postMessage(json);
        } else {
            if(seq == 0 || seq == ""){
                loginPage();
            }else {
                // 分享
                //alert("分享安卓");
                share520Love(localUrlValForWeb, '自购省钱 分享赚钱-爱之家商城', '打造1小时生活圈、体验社交新零售的便捷与便利、实现线上线下无缝对接的新理念平台',
                    '', '.share-content');
            }
        }

    } else {
        if(seq == 0 || seq == ""){
            loginPage();
        }else {
            //alert("分享h5")
            share520LoveWeb(localUrlValForWeb, '自购省钱 分享赚钱-爱之家商城', '打造1小时生活圈、体验社交新零售的便捷与便利、实现线上线下无缝对接的新理念平台',
                '', '.share-content');
            //hui.dialogBase();
            $(".share-block").slideDown(200);
            $("#hui-mask").css("display", "block");
        }
    }

});

//关闭分享页面
$(".center-img,#hui-mask").click(function(){
    $("#hui-mask").css("display" , "none");
    $(".share-block").css("display","none");
    $(".ewmcode").css("display","none");
});

// 复制链接
var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function() {
        return localUrlVal;
    }
});

clipboard.on('success', function(e) {
    var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
    $("body").find(".copy-tips").remove().end().append($copysuc);
    $(".copy-tips").fadeOut(2000);
    e.clearSelection();
    Dialog.init("☺ 复制成功",1000);
});

clipboard.on('error', function(e) {
    Dialog.init("复制失败!",1000);
});