// function noLoginForShop() {
//     $.DialogByZ.Confirm({
//         Title: "登录", Content: "为了给您提供完整的服务，请登录后再进行该操作", BtnL: "马上登录", FunL: function () {
//             var loginRetrunUrl = window.location.href;
//             setCookie("loginRetrunUrl",loginRetrunUrl);
//             loginPage();
//         }, BtnR: "暂不登录", FunR: function () {
//             $.DialogByZ.Close();
//         }
//     });
// };
// if(!isLogin()) {
//     noLoginForShop();
// }
var href = window.location.href;
var urlVal = href.substring(0, href.indexOf("distributionVA/")) + "distributionVA/personal/shareApp";
var localUrlVal = window.location.href;
var portValue = "";
var columnTypeValue = "";
var page = 1;
var appendMark = 0;
var showBrandBusinessInfo = 0;
var seq = getUserSeq();
var shareSeq = getQueryString("shareSeq");
var Coums=shopgd(seq);
var localUrlValForPersonal = window.location.href + "&shareSeq=" + seq;

if (shareSeq) {
    setCookie("shareSeq", shareSeq, 1);
}

function  jumpCoupon(){
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href="/localQuickPurchase/activity/baiye.html";
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
        $(".ewmcode img").attr("src", "/localQuickPurchase/shareQRCode/personalIndexURL?urlVal=" + encodeURIComponent(localUrlValForPersonal));
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
    if ($(".ewmcode").length == 0) {
        var weixinCode = '<div class="ewmcode" value="0"><img src=""/></div>';
        $("body").append(weixinCode);
    }
    // 生成二维码
    $(".ewmcode img").attr("src", "/localQuickPurchase/shareQRCode/personalIndexURL?urlVal=" + encodeURIComponent(localUrlValForPersonal));
    $(".ewmcode").hide();
    $(".shopCode").attr("value", "0");
}

//获取店铺及banner信息
$.ajax({
    type: 'GET',
    dataType: 'json',
    async: false,
    contentType: "application/json;charset=utf-8",
    url: '/localQuickPurchase/brandSquareShopAction/findBrandShopOptimization?brandSquareSeq=' + getQueryString("shopSeq"),
    success: function (data) {
        if (data.code == "200") {
            console.log(data.data);
            var dataList = data.data;
            var imgUrl = data.equipmentData;
            portValue = imgUrl;
            if (dataList) {
                //渲染顶部bannner信息
                if (dataList.shopInfoDate) {
                    //店铺名
                    var brandSquareName = dataList.shopInfoDate.brandSquareName;

                    if (dataList.bannerDate) {
                        //顶部大图
                        var imageLocation = "";
                        if (dataList.bannerDate.imageLocation) {
                            imageLocation = dataList.bannerDate.imageLocation;
                        }
                        var imageLocationForShow = "";
                        //var b = imageLocation.indexOf("Content") == -1;
                        if (imageLocation != null) {
                            //判断是否是七牛云的地址
                            imageLocationForShow = imgUrl + imageLocation;
                            // var b = imageLocation.indexOf("1587441234208")==-1;
                            // if(!b){
                            //     imageLocationForShow = imageLocation;
                            // }else{
                            //
                            // }
                        }
                        //渲染顶部banner区域
                        var bannerHTML = "<img src='" + imageLocationForShow + "' alt=''>" +
                            "<div class='shopName' onclick='goShopCertificate()'>" +
                            // "<div class='shopName'>" +
                            brandSquareName +
                            "<a class='arrow'></a>" +
                            "</div>";
                        $(".banner").append(bannerHTML);
                    }

                    //店铺模板类型
                    var columnType = dataList.shopInfoDate.columnType;
                    if (columnType == 3) {
                        if (dataList.modularList) {

                            var modularName = dataList.modularList[0].modularName;
                            var modularId = dataList.modularList[0].id;

                            var modularHTML = "<div class='hui-list-text'>" +
                                "<div class='hui-list-text-content'><span>" + modularName + "</span></div>" +
                                "</div><div class='goodsList'></div>";

                            $(".brand").append(modularHTML);
                            $('.goodsList').dropload({

                                scrollArea: window,
                                loadDownFn: function (me) {
                                    me.opts.autoLoad = false;
                                    $.ajax({
                                        type: 'GET',
                                        dataType: 'json',
                                        async: false,
                                        contentType: "application/json;charset=utf-8",
                                        url: '/localQuickPurchase/brandSquareShopAction/findHotSaleGoodsInShop?pageIndex=' + page + '&pageSize=3&columnId=' + modularId+"&brandSquareSeq="+getQueryString("shopSeq"),
                                        success: function (data) {
                                            page++;
                                            if (data.code == "200") {
                                                console.log(data.data);
                                                var goodsList = data.data;
                                                console.log(goodsList);
                                                if (goodsList==null||goodsList==undefined||goodsList.length < 3) {
                                                    $(".dropload-down").hide();
                                                }

                                                if (goodsList) {
                                                    var brandGoodsHTML = "";
                                                    for (var i = 0; i < goodsList.length; i++) {
                                                        var goodsId = goodsList[i].goodsId;
                                                        var hotSaleGoodsId = goodsList[i].hotSaleGoodsId;
                                                        var thumbnail = goodsList[i].thumbnail;
                                                        var goodsName = goodsList[i].goodsName;
                                                        var distributionPrice = goodsList[i].distributionPrice;
                                                        var goodsPrice = goodsList[i].goodsPrice;
                                                        var fabulousNum = goodsList[i].fabulousNum;
                                                        var isActivityGoods = goodsList[i].isActivityGoods;

                                                        brandGoodsHTML += "<div class='goodsType3'>" +
                                                            "<div style='position: relative;' class='picType3' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "' isActivityGoods='" + isActivityGoods + "' ><img src='" + thumbnail + "' alt=''>" +
                                                            "<img style=\"height: 20px;width: 40%;top: 10px;right: 0px; position: absolute\" class=\"hehe\"  src=\"/localQuickPurchase/coupons/images/home_icon_label_1@2x.png\" onclick=jumpCoupon()>" +
                                                            "</div>" +
                                                            "<div class='rContentType3'>" +
                                                            "<div class='goodsNameType3'>" + goodsName + "</div>" +
                                                            "<div class='bottomType3'>" +
                                                            "<div class='priceType3'>" +
                                                            "<span class='priceSpan1Type3'>抢购价￥<i>" + distributionPrice + "</i></span>" +

                                                        "<span class='priceSpan2Type3'>" + goodsPrice + "</span>" +
                                                            "</div>" +
                                                            "<div class='btn'>" +
                                                            "<div class='follow'><i>" + fabulousNum + "</i>人已关注</div>" +
                                                            "<botton  type='button' class='goBtn' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "' isActivityGoods='" + isActivityGoods + "'>立即抢购</botton>" +
                                                            "</div>" +
                                                            "</div>" +
                                                            "</div>" +
                                                            "</div>";
                                                    }
                                                    $(".dropload-down").before(brandGoodsHTML);
                                                    var userType = getRoleType();
                                                    if( 5==userType || 6==userType ){
                                                        $(".hehe").hide();
                                                    }
                                                    if ((userType==3 ||userType==4)&& Coums>=100){
                                                        $(".hehe").hide();
                                                    }
                                                    me.resetload();
                                                } else {
                                                    $(".dropload-down").hide();
                                                    me.resetload();
                                                }
                                            } else {
                                                $(".dropload-down").hide();
                                                me.resetload();
                                            }
                                            me.resetload();
                                        },
                                        error: function (xhr, type) {
                                            me.resetload();
                                        }
                                    });

                                }
                            });
                        }


                        var userType = getRoleType();
                        if( 5==userType || 6==userType ){
                            $(".hehe").hide();
                        }
                        if ((userType==3 ||userType==4)&& Coums>=100){
                            $(".hehe").hide();
                        }
                    } else if (columnType == 4) {
                        if (dataList.modularList) {
                            var modularAllList = dataList.modularList;
                            for (var j = 0; j < modularAllList.length; j++) {
                                var modularName = dataList.modularList[j].modularName;
                                var modularId = dataList.modularList[j].id;

                                var modularHTML = "<div class='hui-list-text'>" +
                                    "<div class='hui-list-text-content'><span>" + modularName + "</span></div>" +
                                    "</div><div class='goodsList'>";

                                $.ajax({
                                    type: 'GET',
                                    dataType: 'json',
                                    async: false,
                                    contentType: "application/json;charset=utf-8",
                                    url: '/localQuickPurchase/brandSquareShopAction/findHotSaleGoodsInShop?pageIndex=1&pageSize=100&columnId=' + modularId+"&brandSquareSeq="+getQueryString("shopSeq"),
                                    success: function (data) {
                                        if (data.code == "200") {
                                            console.log(data.data);
                                            var goodsList = data.data;
                                            if(goodsList==null||goodsList==undefined){
                                               return;}
                                            for (var z = 0; z < goodsList.length; z++) {
                                                var goodsId = goodsList[z].goodsId;
                                                var hotSaleGoodsId = goodsList[z].hotSaleGoodsId;
                                                var thumbnail = goodsList[z].thumbnail;
                                                var goodsName = goodsList[z].goodsName;
                                                var distributionPrice = goodsList[z].distributionPrice;
                                                var goodsPrice = goodsList[z].goodsPrice;
                                                var fabulousNum = goodsList[z].fabulousNum;
                                                var isActivityGoods = goodsList[z].isActivityGoods;

                                                modularHTML += "<div class='goodsType4'>" +
                                                    "<div class='picType4' style='position: relative;'goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "' isActivityGoods='" + isActivityGoods + "'><img src='" + thumbnail + "' alt=''>" +
                                                    "<img style=\"height: 20px;width: 40%;top: 10px;right: 0px; position: absolute\" class=\"hehe\"  src=\"/localQuickPurchase/coupons/images/home_icon_label_1@2x.png\" onclick=jumpCoupon()>' " +

                                                    "</div>" +
                                                    "<div class='rContentType4'>" +
                                                    "<div class='goodsNameType4'>" + goodsName + "</div>" +
                                                    "<div class='bottomType4'>" +
                                                    "<div class='priceType4'>" +

                                                "<span class='priceSpan1Type4'>抢购价￥<i>" + distributionPrice + "</i></span>" +
                                                    "<span class='priceSpan2Type4'>" + goodsPrice + "</span>" +
                                                    "</div>" +
                                                    "<div class='btn'>" +
                                                    "<div class='follow'><i>" + fabulousNum + "</i>人已关注</div>" +
                                                    "<botton  type='button' class='goBtn' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "' isActivityGoods='" + isActivityGoods + "'>立即抢购</botton>" +
                                                    "</div>" +
                                                    "</div>" +
                                                    "</div>" +
                                                    "</div>";
                                            }
                                        }
                                    }
                                });

                                $(".brand").append(modularHTML);
                                if( 5==userType || 6==userType ){
                                    $(".hehe").hide();
                                }
                                if ((userType==3 ||userType==4) && Coums>=100){
                                    $(".hehe").hide();
                                }
                            }
                        }
                        var userType = getRoleType();
                        if( 5==userType || 6==userType ){
                            $(".hehe").hide();
                        }
                        if ((userType==3 ||userType==4) && Coums>=100){
                            $(".hehe").hide();
                        }
                    } else if (columnType == 5) {
                        if (dataList.modularList) {
                            var narHTML = "<div class='topnav'><ul>";
                            var brandHTML = "<div class='goodsList'>";
                            var goodsDateList = dataList.modularList;

                            for (var i = 0; i < goodsDateList.length; i++) {
                                var modularName = goodsDateList[i].modularName;
                                var modularId = goodsDateList[i].id;

                                if (i == 0) {
                                    narHTML += "<li class='lihover' title='tab" + (i + 1) + "' onclick='changeState(event," + (i + 1) + ")' modularId='" + modularId + "'>" + modularName + "<i></i></li>";
                                    brandHTML += "<div id='tab" + (i + 1) + "'  class='statecontent showcontent'></div>";
                                } else {
                                    narHTML += "<li class='table'  title='tab" + (i + 1) + "' onclick='changeState(event," + (i + 1) + ")' modularId='" + modularId + "'>" + modularName + "<i></i></li>";
                                    brandHTML += "<div  id='tab" + (i + 1) + "' class='statecontent'></div>";
                                }
                            }
                            narHTML += "</ul></div>";
                            brandHTML += "</div>";
                            var userType = getRoleType();
                            $(".brand").append(narHTML + brandHTML);
                            if( 5==userType || 6==userType ){
                                $(".hehe").hide();
                            }
                            if ((userType==3 ||userType==4)&& Coums>=100){
                                $(".hehe").hide();
                            }
                        }
                        showType5ShopInfo();

                        if( 5==userType || 6==userType ){
                            $(".hehe").hide();
                        }
                        if ((userType==3 ||userType==4)&& Coums>=100){
                            $(".hehe").hide();
                        }
                    }
                }
            }
        }
    }
})


function showType5ShopInfo() {
    //清空每个分类元素div中的内容重新加载
    $(".statecontent").empty();
    $(".dropload-down").hide();
    //渲染第一列数据
    var modularId = $(".lihover").attr("modularId");
    if (modularId) {
        page = 1;
        $('.showcontent').dropload({
            scrollArea: window,
            loadDownFn: function (me) {
                me.opts.autoLoad = false;
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    contentType: "application/json;charset=utf-8",
                    url: '/localQuickPurchase/brandSquareShopAction/findHotSaleGoodsInShop?pageIndex=' + page + '&pageSize=4&columnId=' + modularId+"&brandSquareSeq="+getQueryString("shopSeq"),
                    success: function (data) {
                        page++;
                        if (data.code == "200") {
                            console.log(data.data);
                            if (data.data) {
                                var goodsList = data.data;
                                if (goodsList==null||goodsList==undefined||goodsList.length < 3) {
                                    $(".dropload-down").hide();
                                }
                                var goodsListHTML = "";
                                for (var j = 0; j < goodsList.length; j++) {
                                    //图片链接
                                    var thumbnail = goodsList[j].thumbnail;
                                    //商品名称
                                    var goodsName = goodsList[j].goodsName;
                                    //原价
                                    var goodsPrice = goodsList[j].goodsPrice;
                                    //分销价
                                    var distributionPrice = goodsList[j].distributionPrice;
                                    //商品关注数
                                    var fabulousNum = 0;
                                    if (goodsList[j].fabulousNum) {
                                        fabulousNum = goodsList[j].fabulousNum;
                                    }
                                    //商品id
                                    var goodsId = goodsList[j].goodsId;
                                    //商品位于栏目id
                                    var hotSaleGoodsId = goodsList[j].hotSaleGoodsId;
                                    var isActivityGoods = goodsList[j].isActivityGoods;

                                    goodsListHTML += "<div class='goodsType4'>" +
                                        "<div class='picType4' style='position: relative;'goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "' isActivityGoods='" + isActivityGoods + "'><img src='" + thumbnail + "' alt=''>" +
                                        "<img style=\"height: 20px;width: 40%;top: 10px;right: 0px; position: absolute\" class=\"hehe\" src=\"/localQuickPurchase/coupons/images/home_icon_label_1@2x.png\" onclick=jumpCoupon()>' " +
                                        "</div>" +
                                        "<div class='rContentType4'>" +
                                        "<div class='goodsNameType4'>" + goodsName + "</div>" +
                                        "<div class='bottomType4'>" +
                                        "<div class='priceType4'>" +
                                        "<span class='priceSpan1Type4'>￥<i>" + distributionPrice + "</i></span>" +
                                        "<span class='priceSpan2Type4'>" + goodsPrice + "</span>" +
                                        "</div>" +
                                        "<div class='btn'>" +
                                        "<div class='follow'><i>" + fabulousNum + "</i>人已关注</div>" +
                                        "<botton  type='button' class='goBtn' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "' isActivityGoods='" + isActivityGoods + "'>立即抢购</botton>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>" +
                                        "</div>";
                                }
                                $(".dropload-down").before(goodsListHTML);
                                var userType = getRoleType();
                                if( 5==userType || 6==userType ){
                                    $(".hehe").hide();
                                }
                                if ((userType==3 ||userType==4)&& Coums>=100){
                                    $(".hehe").hide();
                                }
                                me.resetload();
                            } else {
                                $(".dropload-down").hide();
                            }
                        } else {
                            $(".dropload-down").hide();
                        }
                        me.resetload();
                    }, error: function (xhr, type) {
                        me.resetload();
                    }
                });
            }
        });
    }

}


//模块导航栏切换
function changeState(event, val) {
    var elem = event.currentTarget;
    $('.topnav li').removeClass('lihover');
    $(elem).addClass('lihover');
    $(".statecontent").removeClass('showcontent');
    $('#tab' + val).addClass('showcontent');

    //加载模板5类型的商品信息
    //showType5ShopInfo();
}


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

//点击跳转到店铺分类页面中
$(".shopClassify").click(function () {
    window.location.href = "/localQuickPurchase/distributionVA/brandSquareShopClassify?shopSeq=" + getQueryString("shopSeq");
});

//点击商品跳转
$(document).on("click", ".goBtn,.picType3,.picType4", function () {
    var hotSaleGoodsId = $(this).find(".hotSaleGoodsId").text();

    if (hotSaleGoodsId != null || hotSaleGoodsId != "" || hotSaleGoodsId != undefined) {
        hotSaleGoodsId = $(this).attr("hotSaleGoodsId");
    }


    if (hotSaleGoodsId != null && hotSaleGoodsId != "" && hotSaleGoodsId != undefined) {
        //增加关注数
        $.ajax({
            type: "GET",	//定义提交的类型9
            url: "/localQuickPurchase/brandCountAction/addFollowNumber?key=" + hotSaleGoodsId,
            async: false,	//是否异步请求，false为同步
            success: function (data) {
                if (data.code != 200) {
                    console.log("增加关注量出现错误");
                }
            }
        });


        var goodsId = $(this).find(".goodsId").text();
        if (goodsId == null || goodsId == "defined" || goodsId == "") {
            goodsId = $(this).attr("goodsId");
        }
        var isActivityGoods = $(this).attr("isActivityGoods");

        if (seq == null || seq == 0) {
            seq = 0;
        }


        // 进入原生商品详情界面
        try {
            //ios
            var json = {'goodsId': goodsId};
            window.webkit.messageHandlers.goGoodsDetail.postMessage(json);
            return;
            //window.action.app_goodsDetails(goodsId, 0);
        } catch (e) {
        }
        if (isActivityGoods != null && isActivityGoods == "1") {
            window.location.href = "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq=" + seq + "&shareSeq=0";
        } else {
            window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/0" + "/" + seq;
        }
    }
});

$(document).on("click", ".header-right1", function () {
    var keyword = $("#searchKey").val();
    var shopSeq = getQueryString("shopSeq");
    window.location.href = "/localQuickPurchase/distributionVA/brandShopSearchDetail?shopSeq=" + shopSeq + "&keyword=" + keyword;
});

//点击搜索框聚焦1234
$("#searchKey").focus(function () {
    $(".shopClassify").css("display", "none");
    $(".header-right1").css("display", "block");
});

//失去焦点
$("#searchKey").blur(function () {
    setTimeout(function () {
        $(".shopClassify").css("display", "block");
        $(".header-right1").css("display", "none");
    }, 100);

});

/*
function goBack() {
    try{
        // 调app原生返回
        //window.action.app_back();

        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(isAndroid == true){
            window.action.app_back();
        }

        if(isiOS == true){
            var json = {'function':'goBack'};
            window.webkit.messageHandlers.goBack.postMessage(json);

        }
    }catch(e){

    }
    setTimeout(function(){
        if(document.referrer == ""){
            window.location.href="/localQuickPurchase/distributionVA/index";
        }else{
            javascript:history.go(-1);
        }
    }, 200);
}
*/

function goBack() {
    if (document.referrer == "") {
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
        } else {
            window.location.href = "/localQuickPurchase/distributionVA/index";
        }
    } else {
        javascript:history.go(-1);
    }

}


$('.share').click(function () {
    var localUrlValForIos = localUrlVal + "&shareSeq=" + seq;
    var localUrlValForWeb = localUrlVal + "&shareSeq=" + seq;
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
                "identifyMark": 1
            };

            //alert("分享ios");
            window.webkit.messageHandlers.brandSquareShare.postMessage(json);
        } else {
            if (!isLogin()) {
                setCookie("loginRetrunUrl", localUrlVal);
                loginPage();
            } else {
                // 分享
                //alert("分享安卓");
                share520Love(localUrlValForWeb, '自购省钱 分享赚钱-爱之家商城', '打造1小时生活圈、体验社交新零售的便捷与便利、实现线上线下无缝对接的新理念平台',
                    '', '.share-content');
            }
        }

    } else {
        if (!isLogin()) {
            setCookie("loginRetrunUrl", localUrlVal);
            loginPage();
        } else {
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
$(".center-img,#hui-mask").click(function () {
    $("#hui-mask").css("display", "none");
    $(".share-block").css("display", "none");
    $(".ewmcode").css("display", "none");
});

// 复制链接
var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function () {
        return localUrlVal + "&shareSeq=" + seq;
    }
});

clipboard.on('success', function (e) {
    var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
    $("body").find(".copy-tips").remove().end().append($copysuc);
    $(".copy-tips").fadeOut(2000);
    e.clearSelection();
    Dialog.init("☺ 复制成功", 1000);
});

clipboard.on('error', function (e) {
    Dialog.init("复制失败!", 1000);
});

/**
 * 加载店铺证件信息
 */
$.ajax({
    type: "GET",	//定义提交的类型9
    url: "/localQuickPurchase/brandCountAction/getBrandShopDetailInfo?shopSeq=" + getQueryString("shopSeq"),
    async: true,	//是否异步请求，false为同步
    success: function (data) {
        var shopDetailHtml = "<li>企业名称：无</li>" +
            "<li>营业执照注册号：无</li>" +
            "<li>法定代表人姓名：无</li>" +
            "<li>营业执照所在地：无</li>" +
            "<li>企业注册资金：无</li>" +
            "<li>营业执照有效期：无</li>" +
            "<li>公司地址：无</li>" +
            "<li>营业执照经营范围：无</li>";

        var LicensePictureHtml = "<div class='imgbox'>" +
            "<img src='/localQuickPurchase/distributionApp/images/brandSquare_icon_imprint.png' alt=''/>" +
            "</div>";
        if (data.code == 200) {
            console.log(data);
            var shopDetailInfo = data.data.data;
            if (shopDetailInfo) {
                var status = shopDetailInfo.status;
                if (status && status == 2) {
                    showBrandBusinessInfo = 1;
                    shopDetailHtml = "";
                    //企业名称
                    var enterpriseName = shopDetailInfo.enterpriseName;
                    if (enterpriseName) {
                        shopDetailHtml += "<li>企业名称：" + enterpriseName + "</li>";
                    } else {
                        shopDetailHtml += "<li>企业名称：无</li>";
                    }
                    //营业执照注册号
                    var registrationNo = shopDetailInfo.registrationNo;
                    if (registrationNo) {
                        shopDetailHtml += "<li>营业执照注册号：" + registrationNo + "</li>";
                    } else {
                        shopDetailHtml += "<li>营业执照注册号：无</li>";
                    }
                    //法定代表人姓名
                    var legalName = shopDetailInfo.legalName;
                    if (legalName) {
                        shopDetailHtml += "<li>法定代表人姓名：" + legalName + "</li>";
                    } else {
                        shopDetailHtml += "<li>法定代表人姓名：无</li>";
                    }
                    //营业执照所在地
                    var licenseAddr = shopDetailInfo.licenseAddr;
                    if (licenseAddr) {
                        shopDetailHtml += "<li>营业执照所在地：" + licenseAddr + "</li>";
                    } else {
                        shopDetailHtml += "<li>营业执照所在地：无</li>";
                    }
                    //企业注册资金
                    var registrationCapital = shopDetailInfo.registrationCapital;
                    if (registrationCapital) {
                        shopDetailHtml += "<li>企业注册资金：" + registrationCapital + "万元</li>";
                    } else {
                        shopDetailHtml += "<li>企业注册资金：无</li>";
                    }
                    //营业执照有效期开始时间
                    var licenseBeginDate = shopDetailInfo.licenseBeginDate;
                    //营业执照有效期结束时间
                    var licenseEndDate = shopDetailInfo.licenseEndDate;
                    if (licenseBeginDate && licenseEndDate) {
                        shopDetailHtml += "<li>营业执照有效期：" + licenseBeginDate + "至" + licenseEndDate + "</li>";
                    } else {
                        shopDetailHtml += "<li>营业执照有效期：无</li>";
                    }
                    //公司地址
                    var enterpriseAddr = shopDetailInfo.enterpriseAddr;
                    if (enterpriseAddr) {
                        shopDetailHtml += "<li>公司地址：" + enterpriseAddr + "</li>";
                    } else {
                        shopDetailHtml += "<li>公司地址：无</li>";
                    }
                    //营业执照经营范围
                    var licenseScope = shopDetailInfo.licenseScope;
                    if (licenseScope) {
                        shopDetailHtml += "<li>营业执照经营范围：" + licenseScope + "</li>";
                    } else {
                        shopDetailHtml += "<li>营业执照经营范围：无</li>";
                    }

                    var LicensePictureList = shopDetailInfo.images;
                    LicensePictureHtml = "";
                    if (LicensePictureList && LicensePictureList.length > 0) {
                        for (var i = 0; i < LicensePictureList.length; i++) {
                            var imageHttp = LicensePictureList[i].imageHttp;
                            var path = LicensePictureList[i].path;
                            var name = LicensePictureList[i].name;
                            if (imageHttp && path && name) {
                                LicensePictureHtml += "<div class='imgbox'>" +
                                    "<img src='" + imageHttp + path + name + "' alt=''/>" +
                                    "</div>";
                            }
                        }
                    } else {
                        LicensePictureHtml += "<div class='imgbox'>" +
                            "<img src='/localQuickPurchase/distributionApp/images/brandSquare_icon_imprint.png' alt=''/>" +
                            "</div>";
                    }
                }
            }
            $(".brandShopDetailInfoUl").append(shopDetailHtml);
            $(".imgBigBox").append(LicensePictureHtml);
        }
    }
});