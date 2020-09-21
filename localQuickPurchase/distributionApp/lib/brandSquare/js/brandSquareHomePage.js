var pageIndex = 0;
var pageIndex1 = 0;
var Coums = shopgd(seq);
/**
 * 获取品牌广场顶部banner图
 */
$.ajax({
    type: 'POST',
    dataType: 'json',
    async: true,
    contentType: "application/json;charset=utf-8",
    url: '/localQuickPurchase/brandSquareShopAction/findListBanner',
    success: function (data) {
        //TODOO
        if (data.code == "200") {
            if (data.data) {
                var equipmentData = data.equipmentData;
                var bannerList = data.data;
                var bannerSmallImgHTML = "";
                for (var i = 0; i < bannerList.length; i++) {

                    var identifyType = bannerList[i].identifyType;
                    var imageLocation = bannerList[i].imageLocation;
                    var jumpTarget = bannerList[i].jumpTarget;

                    if (identifyType == 9) {
                        //background : url(http://192.168.1.36:8019/UploadFile/YY/20181107/2018110715212117142.jpeg) no-repeat center center;
                        $(".topMainImg").css("background-image", "url(" + equipmentData + imageLocation + ")");
                    } else if (identifyType == 10) {
                        bannerSmallImgHTML = "<a href='" + jumpTarget + "'>" +
                            "<img src='" + equipmentData + imageLocation + "' alt=''>" +
                            "</a>";

                    }
                }
                $(".topImg").append(bannerSmallImgHTML);
            }
        }
    }
});

/**
 * 渲染品牌推荐信息
 */
$.ajax({
    type: 'GET',
    dataType: 'json',
    async: true,
    contentType: "application/json;charset=utf-8",
    url: '/localQuickPurchase/brandSquareShopAction/findBrandRecommendInfo',
    success: function (data) {
        //TODOO
        if (data.code == "200") {
            if (data.data) {
                var isShowMore = data.equipmentData;
                var dataUrl = data.message;
                var dataList = data.data;

                for (var i = 0; i < dataList.length; i++) {
                    var brandRecommendHTML = "";
                    var modularStatus = dataList[i].modularDate.modularStatus;
                    //栏目开启状态
                    if (modularStatus == 2) {
                        if (dataList[i].recommendDate) {
                            var modularName = dataList[i].modularDate.modularName;
                            var isShowTitle = 1;
                            if (dataList[i].modularDate.isShowTitle) {
                                isShowTitle = dataList[i].modularDate.isShowTitle;
                            }
                            brandRecommendHTML += "<ul class='bannerNav'>";
                            if (isShowTitle == 2) {
                                brandRecommendHTML += "<div class='hui-list-text'><div class='hui-list-text-content'><span>" + modularName + "</span></div><div class='hui-list-info'></div></div>";
                            }
                            var recommendDateList = dataList[i].recommendDate;

                            //限制每个品牌推荐栏目个数
                            var dataSize = 0;
                            if (recommendDateList.length < 8) {
                                if (recommendDateList.length < 4) {
                                    dataSize = recommendDateList.length
                                } else {
                                    dataSize = 4;
                                }
                            } else if (recommendDateList.length >= 8) {
                                if (isShowMore == false) {
                                    dataSize = 7;
                                } else {
                                    dataSize = 8;
                                }
                            }

                            for (var j = 0; j < dataSize; j++) {
                                var brandRecommendStatus = recommendDateList[j].brandRecommendStatus;

                                if (brandRecommendStatus == 1) {
                                    var brandName = recommendDateList[j].brandName;
                                    var brandLogoImg = dataUrl + recommendDateList[j].brandLogoImg;
                                    var jumpTarget = "#";
                                    if (recommendDateList[j].jumpTarget) {
                                        jumpTarget = recommendDateList[j].jumpTarget;
                                    }

                                    brandRecommendHTML += "<li>" +
                                        "<a href='" + jumpTarget + "'>" +
                                        "<img src='" + brandLogoImg + "' alt=''>" +
                                        "</a>" +
                                        "<p>" + brandName + "</p>" +
                                        "</li>";
                                }

                            }

                            if (isShowMore == false) {
                                brandRecommendHTML += "<li>" +
                                    "<img src='/localQuickPurchase/distributionApp/images/newBrandSquare/3.jpg' class='moreBrand' alt='' onclick='goMoreBrandRecommend()'>" +
                                    "<p>更多...</p>" +
                                    "</li>";
                            }
                            brandRecommendHTML += "</ul>";
                            $(".topNav").append(brandRecommendHTML);
                        }

                    }
                }
            }
        }
    }
});

/**
 * 获取所有可用模块
 */
$.ajax({
    type: 'GET',
    dataType: 'json',
    async: false,
    contentType: "application/json;charset=utf-8",
    url: '/localQuickPurchase/brandRecommendAction/findAllBannerPlusBrandSquareProduct',
    success: function (data) {
        //TODOO
        if (data.code == "200") {
            if (data.data) {
                var mixModularList = data.data;
                var equipmentData = data.equipmentData;

                for (var i = 0; i < mixModularList.length; i++) {
                    mixModularHTML = "";
                    var modularInfoDate = mixModularList[i].modularInfo;
                    var columnType = modularInfoDate.columnType;
                    var isShowTitle = modularInfoDate.isShowTitle;
                    var modularName = modularInfoDate.modularName;
                    var modularId = modularInfoDate.id;
                    //用于累加getMoreMixGoods方法循环的时候产生的商品数据长度
                    var tempLength = 0;

                    //混合模块
                    if (columnType == 7) {
                        if (mixModularList[i].modularBanner) {
                            var imageLocation = equipmentData + mixModularList[i].modularBanner.imageLocation;
                            var jumpTarget = "#";
                            if (mixModularList[i].modularBanner.jumpTarget) {
                                jumpTarget = mixModularList[i].modularBanner.jumpTarget;
                            }

                            mixModularHTML += "<div class='bigBanner'>";
                            if (isShowTitle == 2) {
                                mixModularHTML += "<div class='hui-list-text'><div class='hui-list-text-content'><span>" + modularName + "</span></div><div class='hui-list-info'></div></div>";
                            }
                            mixModularHTML += "<a href='" + jumpTarget + "'>" +
                                "<img src='" + imageLocation + "' alt=''>" +
                                "</a>" +
                                "</div>";
                        }
                        mixModularHTML += "<div class='swiper-container" + i + " '>" +
                            "<div class='plNavbar swiper-wrapper swiperNavBar" + i + "'></div></div>";
                        $(".contenner").append(mixModularHTML);
                    }

                    var parentClass = ".swiperNavBar" + i;
                    getMoreMixGoods(parentClass, modularId, 0, i, tempLength);
                }
            }
        }
    }
});

/**
 * 分页获取热销商品
 * @param parentClass
 * @param modularId
 * @param pageIndexValue
 * @param containerValue
 * @param tempLengthValue
 */
function getMoreMixGoods(parentClass, modularId, pageIndexValue, containerValue, tempLengthValue) {
    pageIndexValue++;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: true,
        contentType: "application/json;charset=utf-8",
        url: '/localQuickPurchase/brandRecommendAction/findMixModularGoodsById?modularId=' + modularId + "&pageIndex=" + pageIndexValue + "&pageSize=100",
        success: function (data) {
            //TODOO
            if (data.code == "200") {
                if (data.data && data.data.length > 0) {
                    var goodsInfoList = data.data;
                    var shareSeq = data.shareSeq;
                    var equipmentData = data.equipmentData;
                    var type = getRoleType();
                    tempLengthValue = tempLengthValue + goodsInfoList.length;
                    //混合模块
                    for (var j = 0; j < goodsInfoList.length; j++) {
                        var mixModularHTML = "";
                        var goodsName = goodsInfoList[j].goodsName;
                        var distributionPrice = goodsInfoList[j].distributionPrice;
                        var thumbnail = goodsInfoList[j].thumbnail;
                        var goodsId = goodsInfoList[j].goodsId;
                        var hotSaleGoodsId = goodsInfoList[j].hotSaleGoodsId;
                        var isActivityGoods = goodsInfoList[j].isActivityGoods;
                        //黄色优惠券的图片

                        var imgString = '<img class="futu" onclick="couponJump()" src="/localQuickPurchase/coupons/images/home_icon_label_1@2x.png">';
                        //黄色的优惠券
                        imgString = imgInit(imgString, type, Coums);
                        if (j == 0) {
                            mixModularHTML += "<ul>" +
                                "<li  class='nav_Li swiper-slide'>" +
                                "<div class='nav_Li_img'>" +
                                "<img class='zhutu' src='" + thumbnail + "' alt='' onclick='goGoodsDetail(this)' isActivityGoods='" + isActivityGoods + "' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "'>" +
                                imgString +
                                "</div>" +
                                "<div class='nav_Li_text'>" +
                                "<p class='nav_Li_text_firstp'>" + goodsName + "</p>" +
                                "<p class='nav_Li_text_secondp'>￥" + distributionPrice + " &nbsp;&nbsp;<span>抢</span></p>" +
                                "</div>" +
                                "</li>" +
                                "</ul>";
                        } else {
                            //"<img class='futu' style='z-index: 9999' onclick=couponJump() src='/localQuickPurchase/coupons/images/home_icon_label_1@2x.png'>"
                            mixModularHTML += "<ul class='nav_Li swiper-slide'>" +
                                "<li>" +
                                "<div class='nav_Li_img'>" +
                                "<img class='zhutu' src='" + thumbnail + "' alt='' onclick='goGoodsDetail(this)' isActivityGoods='" + isActivityGoods + "' goodsId='" + goodsId + "' hotSaleGoodsId='" + hotSaleGoodsId + "'>" +
                                imgString +
                                //"<img class='futu' style='z-index: 9999' onclick=couponJump() src='/localQuickPurchase/coupons/images/home_icon_label_1@2x.png'>" +
                                "</div>" +
                                "<div class='nav_Li_text'>" +
                                "<p class='nav_Li_text_firstp'>" + goodsName + "</p>" +
                                "<p class='nav_Li_text_secondp'>￥" + distributionPrice + " &nbsp;&nbsp;<span>抢</span></p>" +
                                "</div>" +
                                "</li>" +
                                "</ul>";
                        }

                        $(parentClass).append(mixModularHTML);
                        if (containerValue != undefined) {
                            var containerClassName = ".swiper-container" + containerValue;
                            var slidesOffsetAfterValue = 0;
                            if (tempLengthValue > 3) {
                                slidesOffsetAfterValue = 200;
                            }
                            var swiper = new Swiper(containerClassName, {
                                slidesPerView: 'auto',
                                slidesOffsetAfter: slidesOffsetAfterValue,
                                slidesOffsetBefore: 50
                            });
                        }
                    }
                    getMoreMixGoods(parentClass, modularId, pageIndexValue, containerValue, tempLengthValue);
                } else {
                    return;
                }
            } else {
                return;
            }
        }
    });
}

/**
 * 跳转更多品牌分类
 */
function goMoreBrandRecommend() {
    window.location.href = "/localQuickPurchase/distributionVA/brandSquareClassify1";
}

/**
 * 跳转商品详情
 * @param thisValue
 */
function goGoodsDetail(thisValue) {
    var hotSaleGoodsId = $(thisValue).attr("hotSaleGoodsId");
    var goodsId = $(thisValue).attr("goodsId");
    var isActivityGoods = $(thisValue).attr("isActivityGoods");

    if (hotSaleGoodsId) {
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
    }

    if (goodsId) {
        if (seq == null || seq == 0) {
            seq = 0;
        }
        // 进入原生商品详情界面
        try {
            //ios
            var json = {'goodsId': goodsId};
            window.webkit.messageHandlers.goGoodsDetail.postMessage(json);
            return;
        } catch (e) {

        }
        if (isActivityGoods != null && isActivityGoods == "1") {
            window.location.href = "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq=" + seq + "&shareSeq=0";
        } else {
            window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/0/" + seq;
        }
    }
}


/* <===================================  热卖商品模块  ===================================> */

/**
 * 分页加载热卖商品
 */
function getMoreHotSaleGoods() {

    $('.temaiListUL').dropload({
        scrollArea: window,
        domDown: {
            domClass: 'dropload-down',
            domNoData: '<p class="dropload-refresh">↑下拉加载更多</p>',
            domLoad: '<p class="dropload-load"><span class="loading"></span>加载中...</p>',
            domRefresh: '<p class="dropload-noData">没有更多了...</p>'
        },
        //下拉加载方法
        loadDownFn: function (me) {
            pageIndex++;
            $.ajax({
                type: 'GET',
                async: true,
                url: '/localQuickPurchase/brandSquareShopAction/findBrandHotSaleGoods?pageIndex=' + pageIndex + '&pageSize=4',
                dataType: 'json',
                success: function (data) {
                    // 每次数据加载完，必须重置
                    if (data.code == "200") {
                        if (data.data) {
                            if (data.data.goodsListInfo) {
                                var goodsListInfo = data.data.goodsListInfo;
                                var shareSeq = data.shareSeq
                                goodsListHTML = "";
                                for (var i = 0; i < goodsListInfo.length; i++) {
                                    var distributionPrice = goodsListInfo[i].distributionPrice;
                                    var fabulousNum = goodsListInfo[i].fabulousNum;
                                    var goodsPrice = goodsListInfo[i].goodsPrice;
                                    var isActivityGoods = goodsListInfo[i].isActivityGoods;
                                    var thumbnail = goodsListInfo[i].thumbnail;
                                    var goodsName = goodsListInfo[i].goodsName;
                                    var hotSaleGoodsId = goodsListInfo[i].hotSaleGoodsId;
                                    var goodsId = goodsListInfo[i].goodsId;

                                    // //获取商家的类型
                                    var type = getRoleType();
                                    // //拼接优惠券
                                    var imgString = "<img style='height:20px; width: 100%' src='/localQuickPurchase/coupons/images/hmvip_icon_label_1.png'>";
                                    //判断是否
                                    imgString = imgInit(imgString, type, Coums);

                                    goodsListHTML += "<li>" +
                                        "<img src='" + thumbnail + "' alt='' onclick='goGoodsDetail(this)' isActivityGoods='" + isActivityGoods + "' hotSaleGoodsId='" + hotSaleGoodsId + "' goodsId='" + goodsId + "'>" +
                                        "<div class='temaiDetail'>" +
                                        "<div class='dada' onclick=couponJump()>" +
                                        imgString +
                                        "</div>" + "</div>" +
                                        "<p class='temaiText'>" + goodsName + "</p>";
                                    goodsListHTML += "<p class='markPrice'>市场价：<span style='text-decoration:line-through;'>" + goodsPrice + "</span>&nbsp;&nbsp;&nbsp;<span style='color: red;'>" + fabulousNum + "人已关注</span></p>";
                                    goodsListHTML += "<div class='priceTag'>" +
                                        "<div class='hotprise'>￥" + distributionPrice + "</div>" +
                                        "<div class='qianggou' onclick='goGoodsDetail(this)' isActivityGoods='" + isActivityGoods + "' hotSaleGoodsId='" + hotSaleGoodsId + "' goodsId='" + goodsId + "'>立即抢购</div>" +
                                        "</div>" +
                                        "</div>" +
                                        "</li>";
                                }
                                $(".dropload-down").before(goodsListHTML);
                                me.resetload();

                            } else {
                                me.lock();
                                me.noData();
                                $(".dropload-down").hide();
                            }
                        }
                    } else {
                        hui.toast('加载异常请稍后重试！！');
                        me.noData();
                        $(".dropload-down").hide();
                    }
                },


                error: function (xhr, type) {
                    hui.toast('加载异常请稍后重试！！');
                    me.resetload();
                    $(".dropload-down").hide();
                }


            });
        }
    });
}


/**
 * 分页加载特卖会商品
 */
$.ajax({
    type: 'GET',
    url: '/localQuickPurchase/brandSquareShopAction/findBrandHotSaleGoods?pageIndex=1&pageSize=1',
    dataType: 'json',
    async: false,
    success: function (data) {
        // 每次数据加载完，必须重置
        if (data.code == "200") {
            if (data.data) {
                if (data.data.goodsListInfo) {
                    var goodsListInfo = data.data.goodsListInfo;

                    goodsListHTML = "<div class='hiddenBox'></div>" +
                        "<div class='temai'>" +
                        "<img src='/localQuickPurchase/distributionApp/images/newBrandSquare/7.jpg' alt=''>" +
                        "</div>" +
                        "<div class='hiddenBox'></div>" +
                        "<div class='temaiList'>" +
                        "<ul class='temaiListUL'></ul></div>";
                    $(".contenner").append(goodsListHTML);
                }
            }
            getMoreHotSaleGoods();
        }
    },
    error: function (xhr, type) {
    }
});

/**
 * 返回上一页方法
 */
function goBack() {
    if (document.referrer == "") {
        try {
            //如果没有上一页尝试返回原生
            // 调app原生返回  webview
            window.action.app_back();
        } catch (e) {

        }
        try {
            var json = {'function': 'goBack'};
            window.webkit.messageHandlers.goBack.postMessage(json);
        } catch (e) {

        }
        //判断是否是app
        var u = navigator.userAgent;
        var isappwebview = u.indexOf('app_webview') < 0;
        // 如果不是app打开的  则返回首页
        if (isappwebview) {
            window.location.href = "/localQuickPurchase/distributionVA/index";
        }
    } else {
        javascript:history.go(-1);
    }
}

/**
 * 清除搜索框
 */
function clearSearchValue() {
    $(".search").val("");
}

/**
 * 点击进入品牌广场搜索页面
 */
function searchToHistory() {
    window.location.href = "/localQuickPurchase/distributionVA/brandSquareHistorySearch?identifyMark=1";
}

function couponJump() {
    window.location.href = "/localQuickPurchase/activity/baiye.html?shareSeq=shareSeq";
}
