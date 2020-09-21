var seckill_param = {
    "state": 1,
    "pageIndex": 1,
    "pageSize": 10
};

function hideBanner() {
    //隐藏百业惠盟图标
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        $(".topBarad").hide();
        for (var i = 0; i < $(".btn>li").length; i++) {
            var htmlStr = $(".btn>li").eq(i).children("span").html()
            if (htmlStr == '百业惠盟') {
                $(".btn>li").eq(i).hide()
            }
        }
        // 在小程序中不隐藏直播入口
        $(".goliveList").show()
    }
}
// 点击直播带货按钮
if (!window.Promise) {
    document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"' + '>' + '<' + '/' + 'script>');
}

function goLiveRooms() {
    isMiniprogram().then(function (res) {
        wx.miniProgram.navigateTo({
            url: "/pages/liveList/liveList"
        });
    }).catch(function (err) {
        location.href = '/pages/nowLivelist.html';
    })
}
var seckill_param = {
    "state": 1,
    "pageIndex": 1,
    "pageSize": 10
};
var giftType = 1;
var indexPage, columnName, pageIndex = 2,
    isLoading = false,
    pageSize = 10;
var Coums = shopgd(seq);
var shoplist = [];
(function () {
    indexPage = {
        init: function () {
            //this.initDate()
            //this.banner();
            //this.onSale();
            //this.secTab();
            //this.brandBanner();
            //this.footerTabTaggle();
        },
        getMore: function () {
            var restore = sessionStorage.getItem('Restore')
            if (restore != 1) {
                if (!isLoading && (columnName == null || columnName == 'undefined')) {
                    hui.endLoadMore(true, '没有更多了...');
                    return;
                }

                isLoading = true;
                var html = '';
                $.ajax({
                    type: 'post',
                    dataType: 'JSON',
                    contentType: "application/json;charset=utf-8",
                    url: '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
                    data: JSON.stringify({
                        'columnName': columnName,
                        'pageIndex': pageIndex,
                        'pageSize': 10
                    }),
                    async: false,
                    success: function (data) {
                        var code = data.code;
                        var listData = data.data;
                        shoplist = shoplist.concat(data.data);
                        if (code == 200 && listData != null && listData.length > 0) {
                            for (var i = 0; i < listData.length; i++) {
                                var _data = listData[i];
                                html += indexPage.getGoodsHtml(_data);;
                            }
                            $(".dataList").eq($(".dataList").length - 1).append(html);
                            pageIndex++;
                            isLoading = false;
                            //设置这个属性才能 第二次上拉加载 更多
                            hui.endLoadMore(false);
                        } else {
                            hui.endLoadMore(true, '没有更多了...');
                            return false;
                        }
                    },
                    error: function (error) {
                        hui.toast(error);
                    }
                });
            } else {
                 var html = '';
                var restore = sessionStorage.setItem('Restore', 0)
                var restorelist = JSON.parse(sessionStorage.getItem('shoplist'));
                pageIndex = sessionStorage.getItem('respageIndex');
                var resTop = sessionStorage.getItem('scrollindex');
                for (var i = 0; i < restorelist.length; i++) {
                    var _data = restorelist[i];
                    html += indexPage.getGoodsHtml(_data);;
                }
                $(".dataList").eq($(".dataList").length - 1).append(html);

                isLoading = false;
                //设置这个属性才能 第二次上拉加载 更多
                hui.endLoadMore(false);
                $(document).scrollTop(resTop)
                sessionStorage.removeItem('shoplist');
                sessionStorage.removeItem('respageIndex')
                sessionStorage.removeItem('scrollindex')
            }

        },
        //刷新页面  重置页面数据
        reInitDate: function () {
            $(".main").html("");
            //重置加载更多状态
            pageIndex = 2;
            hui.resetLoadMore();
            hui.loading('加载中...');
            indexPage.initDate();
        },
        //首页初始化数据
        initDate: function () {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/localQuickPurchase/homePageIntegrationAction/v4/homePage',
                data: {
                    'seq': seq
                },
                async: false,
                success: function (result) {
                    var isMinprogram;
                    isMiniprogram().then(function (res) {
                        hideBanner()
                    }).catch(function () {});
                    if (result.code == 200) {
                        var columnLength = result.data.homePageColumn.length;
                        for (var i = 0; i < columnLength; i++) {
                            var column = result.data.homePageColumn[i];
                            if (i == columnLength - 1) {
                                //可以加载更多
                                if (column.loadMore) {
                                    columnName = column.columnName;
                                }
                            }
                            var _html = "";
                            if (column.celoveColumnStyle == 1) { //banner
                                _html = indexPage.getBannerHtml(column);
                                $(".main").append(_html);
                                if (_html != "") {
                                    indexPage.banner();
                                }
                            } else if (column.celoveColumnStyle == 12) { //首页按钮
                                //屏蔽按钮显示
                                _html = indexPage.getBtnHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 2 || column.celoveColumnStyle == 3) { //优惠券
                                _html = indexPage.getCouponHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 4) { //画廊  商品(左右滑动)
                                _html = indexPage.getOnSaleHtml(column, i);
                                $(".main").append(_html);
                                if (_html != "") {
                                    indexPage.onSale('swiper' + i);
                                }
                            } else if (column.celoveColumnStyle == 5) { //做一右二
                                _html = indexPage.getBenefitHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 6) { //上一下二
                                _html = indexPage.getSelectionHtml(column)
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 7) { //画廊  (banner + 商品为一个Item)  (左右滑动)
                                _html = indexPage.getBrandHtml(column, i);
                                $(".main").append(_html);
                                if (_html != "") {
                                    indexPage.brandBanner("swipe" + i);
                                }
                            } else if (column.celoveColumnStyle == 8) { // 秒杀
                                _html = indexPage.getSeckillHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 9) { //商品列表 每行两个
                                _html = indexPage.getHotionHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 10) {
                                _html = indexPage.getBoomHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 11) {
                                _html = indexPage.getRecommendHtml(column);
                                $(".main").append(_html);
                                indexPage.countDown();
                            }
                        }
                    }
                    hui.endRefresh();
                    //关闭loading
                    hui.loading('加载中...', true);
                },
                /*error : function(error) {
                    hui.toast(error);
                }*/
            });
        },
        //轮播广告
        banner: function () {
            var swipe1 = new huiSwpie('#swipe1');
            swipe1.autoPlay = true;
            swipe1.indicatorOn = true;
            swipe1.delay = 5000;
            swipe1.speed = 200;
            swipe1.run();
        },
        //倒计时
        countDown: function () {
            /*$.leftTime("2019/01/22 23:45:24",function(d){
                if(d.status){
                    var $dateShow=$(".timeOut");
                    $dateShow.find(".day").html(d.d);
                    $dateShow.find(".hour").html(d.h);
                    $dateShow.find(".min").html(d.m);
                    $dateShow.find(".sec").html(d.s);
                }
            });*/
        },
        //天天特价
        onSale: function (swiperName) {
            var swiper2 = new Swiper('#' + swiperName, {
                slidesPerView: 3.5,
                paginationClickable: true,
                freeMode: false,
                loop: false
            });
        },
        //品牌广场轮播
        brandBanner: function (brandBannerName) {
            var swipe2 = new huiSwpie('#' + brandBannerName);
            swipe2.indicatorOn = false;
            swipe2.loop = false;
            swipe2.autoPlay = false;
            swipe2.speed = 200;
            swipe2.run();
        },
        //获取banner html
        getBannerHtml: function (column) {
            if (column.listBanner == null) {
                console.log("getCouponHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<!--轮播模块-->' +
                '<div class="banner">' +
                indexPage.columnFun(column) +
                '<div class="hui-swipe" id="swipe1">' +
                '<div class="hui-swipe-items">';
            for (var i = 0; i < column.listBanner.length; i++) {
                var itemc = column.listBanner[i];
                var jumpTarget = itemc.jumpTarget;
                if (jumpTarget == null || jumpTarget == "#") {
                    jumpTarget = "JavaScript:;";
                }
                // 判断是否是直播带货
                if (jumpTarget.indexOf("/pages/nowLivelist.html") > -1) {
                    _html += '<div class="hui-swipe-item"><a href="javascript:;" onclick="goLiveRooms()"><img src="' + itemc.imageLocation + '"/></a></div>';
                } else {
                    _html += '<div class="hui-swipe-item"><a href="' + jumpTarget + '" ><img src="' + itemc.imageLocation + '"/></a></div>';
                }
            }
            _html += '</div>' +
                //'<div class="swiper-pagination"></div>'+
                '</div></div>';
            return _html;
        },
        //获取优惠券 html
        getCouponHtml: function (column) {
            if (column.listBanner == null || column.listBanner.length == 0) {
                console.log("getCouponHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var jumpTarget = "javascript:;"
            if (column.celoveColumnStyle == 2) {
                jumpTarget = "/localQuickPurchase/distributionVA/receiveCoupons";
            } else if (column.listBanner[0].jumpTarget != null && column.listBanner[0].jumpTarget != "#") {
                jumpTarget = column.listBanner[0].jumpTarget;
            }
            var _html = '<!--优惠券-->' +
                '<div>' +
                indexPage.columnFun(column) +
                '<div class="coupon-box wBg">' +
                '<a href="' + jumpTarget + '"> <img src="' + column.listBanner[0].imageLocation + '"/></a></div>' +
                '</div>';
            return _html;
        },
        //推荐模块
        getRecommendHtml: function (column) {

            if (column.listBanner == null || column.listBanner.length == 0) {
                console.log("getCouponHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var jumpTarget = "javascript:;"
            if (column.celoveColumnStyle == 2) {
                jumpTarget = "/localQuickPurchase/distributionVA/receiveCoupons";
            } else if (column.listBanner[0].jumpTarget != null && column.listBanner[0].jumpTarget != "#") {
                jumpTarget = column.listBanner[0].jumpTarget;
            }
            var _html = '<div class="recommend wBg mgTop">' + indexPage.columnFun(column) +
                '<div class="recommend1"><div class="secKill"><a href="' + column.listBanner[0].jumpTarget + '"><img src="' + column.listBanner[0].imageLocation + '"/></a></div><div class="big"><div class="onSale"><a href="' + column.listBanner[1].jumpTarget + '"><img src="' + column.listBanner[1].imageLocation + '"/></a></div><div class="small"><div class="fine"><a href="' + column.listBanner[3].jumpTarget + '"><img src="' + column.listBanner[3].imageLocation + '"/></a></div></div></div></div><div class="recommend2"><div class="cutPrice"><a href="' + column.listBanner[4].jumpTarget + '"><img src="' + column.listBanner[4].imageLocation + '"/></a></div><div class="newest"><a href="' + column.listBanner[5].jumpTarget + '"><img src="' + column.listBanner[5].imageLocation + '"/></a></div></div></div>';
            return _html;
        },
        //获取天天特价 html
        getOnSaleHtml: function (column, index) {
            if (column.listGoods == null) {
                console.log("getOnSaleHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<!--天天特价-->' +
                '<div class="on-sale wBg mgTop">' +
                indexPage.columnFun(column) +
                '<div class="on-sale-swiper swiper-container swiper-container-horizontal" id="swiper' + index + '">' + '<div class="on-sale-list swiper-wrapper">';
            for (var i = 0; i < column.listGoods.length; i++) {
                var goods = column.listGoods[i];
                var goodsId = goods.goodsId;
                var actualPrice = goods.actualPrice;
                var comparativePrice = goods.comparativePrice;
                var isActivityGoods = goods.isActivityGoods;
                var goodsProStandard = goods.goodsProStandard;
                var presellType = goods.presellType;
                var goodsName = '';
                if (presellType != null && presellType == 1) {
                    var endTime = goods.endTime;
                    var date = Date.parse(new Date());
                    if (endTime > date) {
                        goodsName = '<span style="color: red">(预售商品)</span>' + goods.goodsName;
                    } else {
                        goodsName = goods.goodsName;
                    }
                } else {
                    goodsName = goods.goodsName;
                }
                var index = 1;
                if (isActivityGoods != null && isActivityGoods == "1") {
                    index = 0;
                }
                _html +=
                    '<div class="on-sale-item swiper-slide"   onclick="goodsJump(\'' + goodsId + '\',\'' + index + '\')" >' +
                    '<div class="on-sale-img"><img src="' + goods.thumbnail + '"/></div>' +
                    '<div class="on-sale-details">' +
                    '<p class="on-sale-title limit1">' + goodsName + '</p>' +
                    '<p class="on-sale-price">' +
                    '<span class="price">￥' + actualPrice + '</span>' +
                    '<span class="oldPrice">￥' + comparativePrice + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>';
            }
            _html += '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        //获取大兵爆款 html
        getBoomHtml: function (column) {
            if (column.group.listGoods == null) {
                console.log("getHotionHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<div class="boom mgTop wBg" style="background-image:url(' + column.group.banner.imageLocation + ')">' +
                indexPage.columnFun(column) +
                '<a href = "' + column.group.banner.jumpTarget + '"><div class="clickSquare"></div></a><div class="boomList wBg">';
            for (var i = 0; i < column.group.listGoods.length; i++) {
                var index = 1;
                var isActivityGoods = column.group.listGoods[i].isActivityGoods;
                if (isActivityGoods != null && isActivityGoods == "1") {
                    index = 0;
                }

                _html += '<div class="boomItem"   onclick="goodsJump("' + column.group.listGoods[i].goodsId + '", "' + index + '")" ><div class="pro-img"><img src="' + column.group.listGoods[i].thumbnail + '"/></div><p class="pro-title limit1 fs22">' + column.group.listGoods[i].goodsName + '</p><p class="pro-price money pricecolr fs20">' + column.group.listGoods[i].actualPrice + '</p></div>';
            }
            _html += '</div>' +
                '</div>';


            return _html;
        },
        //获取真实惠 html
        getBenefitHtml: function (column) {
            var _html = "";
            if (column.listBanner == null || column.listBanner.length != 3) {
                console.log("getBenefitHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var hasLoadMoreHtml = '';
            if (column.hasloadMore) {
                loadMoreHtml = '<span onclick="selectionJump(\'' + column.columnName + '\')" class="more">更多 <img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></span>';
            }
            var columnNameHtml = '';
            if (column.columnNameShow) {
                columnNameHtml = '<span class="bt ct">' + column.columnName + '</span>';
            }
            _html = '<!--臻实惠-->' +
                '<div class="benefit wBg mgTop">' +
                indexPage.columnFun(column) +
                '<div class="benefit-box">' +
                '<div class="big">' +
                '<a href="' + column.listBanner[0].jumpTarget + '" ><img src="' + column.listBanner[0].imageLocation + '"/></a>' +
                '</div>' +
                '<div class="small">' +
                '<div>' +
                '<a href="' + column.listBanner[1].jumpTarget + '" ><img src="' + column.listBanner[1].imageLocation + '"/></a>' +
                '</div>' +
                '<div>' +
                '<a href="' + column.listBanner[2].jumpTarget + '" ><img src="' + column.listBanner[2].imageLocation + '"/></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        //获取首页按钮 html
        getBtnHtml: function (column) {
            var listBanner = column.listBanner;
            if (listBanner == null) {
                return "";
            }
            var html = '<div class="btnList"><ul class="btn">';


            for (var i = 0;i < listBanner.length; i++) {
                var banner = listBanner[i];
                //跳转链接
                var jumpTarget = banner.jumpTarget;
                //图片路径
                var imageLocation = banner.imageLocation;
                //标题
                var title = banner.title;
                html += '<li jumpUrl="' + jumpTarget + '"><img src="' + imageLocation + '"><span>' + title + '</span></li>';
            }
            html += '</ul></div>';
            return html;
        },
        //获取严选精品 html
        getSelectionHtml: function (column) {
            if (column.listBanner == null || column.listBanner.length != 3) {
                console.log("getSelectionHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<!--严选精品-->' +
                '<div class="fine wBg mgTop">' +
                indexPage.columnFun(column) +
                '<div class="fine-box">' +
                '<div class="big"><a href="' + column.listBanner[0].jumpTarget + '" ><img src="' + column.listBanner[0].imageLocation + '"/></a></div>' +
                '<div class="small">' +
                '<div><a href="' + column.listBanner[1].jumpTarget + '" ><img src="' + column.listBanner[1].imageLocation + '"/></a></div>' +
                '<div><a href="' + column.listBanner[2].jumpTarget + '" ><img src="' + column.listBanner[2].imageLocation + '"/></a></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        //获取严选精品 html
        getHotionHtml: function (column) {
            if (column.listGoods == null) {
                console.log("getHotionHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<!--热销商品-->' +
                '<div class="hot mgTop wBg">' +
                indexPage.columnFun(column) +
                '<div class="hot-list dataList">';
            for (var i = 0; i < column.listGoods.length; i++) {
                var goods = column.listGoods[i];
                _html += indexPage.getGoodsHtml(goods);
            }
            _html += '</div>' +
                '</div>';
            return _html;
        },
        goGoodsDetails: function () {
            window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/"
        },
        goGoodsDetails1: function () {
            window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/"
        },

        // /!*消费券*!/
        shopgd: function () {
            var result = null;
            var code = 1034;
            var deviceType = "PC";
            var type = 2;
            var incomeSpending = 0
            var source = 101
            $.ajax({
                type: "POST", //定义提交的类型
                headers: {
                    "Content-Type": "application/json"
                },
                url: "/localQuickPurchase/selectionGoods/SelecsCoupon",
                data: JSON.stringify({
                    seq: shareSeq,
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }),
                dataType: "json", //设置返回值得类型
                async: false, //是否异步请求，false为同步
                success: function (data) { //成功返回值执行函数
                    if (data.code == 200) {
                        console.log("data" + data);
                        result = data.data;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('error');
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                }
            });
            return result;
        },

        //获取优惠券悬浮图标
        getYhqHtml: function (goods) {
            var goodsYhq = goods.yHQ;
            var type = getRoleType();
            // var  result = indexPage.shopgd();
            var yhqHtml = "";
            if (goodsYhq) {
                if (type == 1 || type == 2 || !type) {
                    yhqHtml += '<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
                } else if ((type == 3 || type == 4) && Coums <= 100) {
                    yhqHtml += '<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
                } else {
                    yhqHtml += ""
                }
            } else {
                yhqHtml += ""
            }
            return yhqHtml;
        },
        //获取优惠券小悬浮图标
        getYhqHtml2: function (goods) {
            var goodsYhq = goods.yHQ;
            var type = getRoleType();
            //var  result = indexPage.shopgd();
            var yhqHtml = "";
            if (goodsYhq) {
                if (type == 1 || type == 2 || !type ) {
                    yhqHtml += '<img class="add" src="/localQuickPurchase/coupons/images/home_icon_label_1@2x.png" onclick=jumpCoupon()>'
                } else if ((type == 3 || type == 4) && Coums <= 100) {
                    yhqHtml += '<img class="add" src="/localQuickPurchase/coupons/images/home_icon_label_1@2x.png" onclick=jumpCoupon()>'
                } else {
                    yhqHtml += ""
                }
            } else {
                yhqHtml += ""
            }
            return yhqHtml;
        },



        //获取商品html
        getGoodsHtml: function (goods) {
            var _html = '';
            var goodsId = goods.goodsId;
            var ifBrandProduct = goods.ifBrandProduct;
            var actualPrice = goods.actualPrice;
            var comparativePrice = goods.comparativePrice;
            var isActivityGoods = goods.isActivityGoods;
            var goodsProStandard = goods.goodsProStandard;
            var distributionPrice = actualPrice.toString();
            var distributionPriceArr = distributionPrice.split(".");
            var distributionPrice1;
            var distributionPrice2;
            if (distributionPriceArr.length == 2) {
                distributionPrice1 = distributionPriceArr[0]
                distributionPrice2 = distributionPriceArr[1]
            } else {
                distributionPrice1 = distributionPriceArr[0];
                distributionPrice2 = "00";
            }
            var _labelHtml = '';
            if (goods.listLabel != null) {
                var listLabel = goods.listLabel;
                for (var j = 0; j < listLabel.length; j++) {
                    var label = listLabel[j];
                    _labelHtml += ' <span style="color:' + label.colour + ';border: 1px solid ' + label.colour + ';border-radius: 0.59rem;padding: 0 4px;">' + label.labelValue + '</span>'
                }
            }
            var presellType = goods.presellType;
            var goodsName = '';
            if (presellType != null && presellType == 1) {
                var endTime = goods.endTime;
                var date = Date.parse(new Date());
                if (endTime > date) {
                    goodsName = ' <span style="color: red">(预售商品)</span>' + goods.goodsName;
                } else {
                    goodsName = goods.goodsName;
                }
            } else {
                goodsName = goods.goodsName;
            }
            var index = 1;
            if (isActivityGoods != null && isActivityGoods == "1") {
                index = 0;
            }

            _html += '<div class="hot-item" onclick="goodsJump(\'' + goodsId + '\',\'' + index + '\')" >' +

                '<div class="hot-img" ><img src="' + goods.thumbnail + '"/></div>' +
                '<div class="hot-details">' +
                indexPage.getYhqHtml(goods) +
                '<p class="hot-title limit2 fs12">' + goodsName + '</p>' +
                '<div class="hot-title limit2 fs12 hot-label" >' + _labelHtml + '</div>' +
                '<p class="hot-price pcolr">' +
                '<span class="yuan pcolr fs11">￥</span>' +
                '<span class="int pcolr fs12">' + distributionPrice1 + '</span>.' +
                '<span class="float pcolr fs11">' + distributionPrice2 + '</span>' +
                '<span class="oldPrice opcolr fs11">￥' + comparativePrice + '</span>' +
                '</p>' +
                '</div>' +
                '</div>';

            return _html;
        },


        //获秒杀 html
        getSeckillHtml: function (column) {
            console.log(column);
            if (column.group == null) {
                console.log("getSeckillHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var banner = column.group.banner;
            var field = column.group.seckillField;
            var seckill_html = "";
            var jumpTarget = "javascript:;"
            if (banner.jumpTarget != null && banner.jumpTarget != "#") {
                jumpTarget = banner.jumpTarget;
            } else {
                jumpTarget = "/localQuickPurchase/distributionVA/seckill";
            }
            seckill_html += '<div>';
            seckill_html += indexPage.columnFun(column);
            seckill_html += '<a href="' + jumpTarget + '" > <img class="salaindex_col mgTop" src="' + banner.imageLocation + '" /></a>';
            seckill_html += '</div>'
            seckill_html += '<div class="hui-tab wbg">';
            seckill_html += '<div class="hui-tab-title">';
            var listSize = 0;
            if (field != null && field != undefined && field.length > 0) {
                if (field.length > 3) {
                    listSize = 3
                } else {
                    listSize = field.length;
                }
                /*渲染秒杀场次*/
                for (var i = 0; i < listSize; i++) {
                    //场次ID
                    var seckillId = field[i].seckillFieldId;
                    //开始和结束区间
                    var intervalText = field[i].intervalText;
                    //tab说明hot-item
                    var writing = field[i].writing;
                    if (i == 0) {
                        seckill_html += '<div class="seckill-list hui-tab-active" num="' + i + '" onclick="g(this,' + i + ',' + seckillId + ')" style="width: 33.3%!important;">';
                    } else {
                        seckill_html += '<div class="seckill-list" num="' + i + '" onclick="getSaleLimit(this,' + i + ',' + seckillId + ')" style="width: 33.3%!important;">';
                    }
                    seckill_html += '<span class="font-md">' + intervalText + '</span>';
                    seckill_html += '<span class="padding-t-1">' + writing + '</span>';
                    seckill_html += '<span class="sale-active"></span>';
                    seckill_html += '</div>';
                }
            } else {
                return;
            }

            /*seckill_html += '<div class="seckill-list" num="4" onclick="getSaleLimit(this,1)" style="width: 33.3%!important;">';
                                /!*<!--<span class="font-md">13:00</span>-->*!/
            seckill_html += '<span class="padding-t-1">即将开始</span>';
            seckill_html += '<span class="sale-active"></span>';
            seckill_html += '</div>';
            seckill_html += '<div class="seckill-list" num="2" onclick="getSaleLimit(this,2)" style="width: 33.3%!important;">';
            /!*<span class="font-md">11:00</span>*!/
            seckill_html += '<span class="padding-t-1">已结束</span>';
            seckill_html += '<span class="sale-active"></span>';
            seckill_html += '</div>';*/

            seckill_html += '</div>';
            seckill_html += '<div class="index_line"></div>';
            seckill_html += '<div class="hui-list index_list_content" style="padding-bottom:0 ;">';
            seckill_html += '<div class="set-goods set-goods-seckill">';

            seckill_html += '</div>';
            seckill_html += '</div>';
            $(".salaindex").html(seckill_html);
            getSaleLimit(seckill_html, 0, field[0].seckillFieldId)
            return seckill_html;
        },
        //品牌广场 html
        getBrandHtml: function (column, index) {
            if (column.groups == null) {
                console.log("getBrandHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var columnHtml = indexPage.columnFun(column);
            var _html = '<!-- 品牌广场 -->' +
                '<div class="brand mgTop wBg">' +
                indexPage.columnFun(column) +
                '<div class="brand-box hui-swipe" id="swipe' + index + '">' +
                '<div class="hui-swipe-items">';
            for (var i = 0; i < column.groups.length; i++) {
                var banner = column.groups[i].banner;
                var listGoods = column.groups[i].listGoods;
                _html += '<div class="brand-box-item hui-swipe-item">' +
                    '<div class="brand-banner"><a href="' + banner.jumpTarget + '"><img src="' + banner.imageLocation + '"></a></div>' +
                    '<div class="brand-list">';
                for (var j = 0; j < listGoods.length; j++) {
                    //console.log("品牌广场  "+listGoods.length);
                    var goods = listGoods[j]
                    var goodsId = goods.goodsId;
                    var actualPrice = goods.actualPrice;
                    var isActivityGoods = goods.isActivityGoods;
                    var index = 1;
                    if (isActivityGoods != null && isActivityGoods == "1") {
                        index = 0;
                    }
                    var goodsProStandard = goods.goodsProStandard;
                    _html +=

                        '<div class="brand-item"  onclick="goodsJump(\'' + goodsId + '\',\'' + index + '\')" >' + indexPage.getYhqHtml2(goods) +
                        '<div class="brand-img"><img src="' + goods.thumbnail + '"></div>' +
                        '<div class="brand-desc">' +
                        '<p class="brand-price pcolr">&yen;' + actualPrice + '</p>' +
                        /*'<p class="selled">已售:'+ goods.sales+'</p>'+*/
                        '</div>' +
                        '</div>';
                }
                _html += '</div>' +
                    '</div>';
            }

            _html += '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        secTab: function () {
            $('.seckill-list').each(function (i) {
                $(this).on('click', function () {
                    $('.seckill-list').eq(i).addClass('hui-tab-active').siblings().removeClass('hui-tab-active');
                })
            })
        },
        columnFun: function (column) {
            var columnHtml = '';
            //   column.followingBlank = 20 为APP的空白高度   需要除以 2  才能显示正常高度   转换为rem  需要再除以 16
            var heightRem = column.followingBlank / 60;
            if (!column.columnNameShow && !column.hasloadMore) {
                columnHtml += '<div style="height:' + heightRem + 'rem;background-color:#F0F0F0;"></div><div class="brand-top common" style="height:0;">';
            } else {
                columnHtml += '<div style="height:' + heightRem + 'rem;background-color:#F0F0F0;"></div><div class="brand-top common" >';
            }
            if (column.columnNameShow) {
                columnHtml += '<span class="bt ct">' + column.columnName + '</span>';
            } else {
                columnHtml += '<span class="bt ct" style="visibility: hidden;">' + column.columnName + '</span>';
            }
            if (column.hasloadMore) {
                if (column.jumpTarget != "" && column.jumpTarget != null) {
                    if (column.actityType && column.actityType == 4) {
                        columnHtml += '<a href ="' + column.jumpTarget + '" ><span class="more">分类 <img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></span></a>';
                    } else {
                        columnHtml += '<a href ="' + column.jumpTarget + '" ><span class="more">更多 <img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></span></a>';
                    }
                } else {
                    if (column.actityType && column.actityType == 4) {
                        columnHtml += '<span onclick="selectionJump(\'' + column.columnName + '\')" class="more">分类 <img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></span>';
                    } else {
                        columnHtml += '<span onclick="selectionJump(\'' + column.columnName + '\')" class="more">更多 <img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></span>';
                    }
                }
            }
            columnHtml += '</div>';
            return columnHtml;
        },
        //赠送优惠券弹窗
        couponData: function () {
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: '/localQuickPurchase/give/checked',
                data: {
                    'seq': seq
                },
                async: false,
                success: function (result) {
                    console.log(result);
                    if (result.code == 200) {
                        var hint = result.data.hint;
                        giftType = result.data.giftType;
                        $('#hint').html(hint);
                        $('#hint').show();
                    }
                }
            });
        }
    }
    indexPage.couponData();
    hui.refresh('#refreshContainer', indexPage.reInitDate);
    hui.loadMore(indexPage.getMore);
})(jQuery);

function getSaleLimit(obj, index, seckillId) {
    if (seckillId == null || seckillId == undefined) {
        return;
    }
    console.log("tab=============list:1");
    seckill_param = {
        "seckillId": seckillId,
        "pageIndex": 1,
        "pageSize": 2
    };
    $(obj).siblings().removeClass("hui-tab-active");
    $(obj).addClass("hui-tab-active");
    $.ajax({
        type: 'GET',
        url: '/localQuickPurchase/sgMongoAction/seckillGoods',
        data: seckill_param,
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                if (data.data.list != null && data.data.list.length > 0) {
                    var sale_html = "";
                    var sort = 0;
                    var saleList = data.data.list;
                    for (var i = 0; i < saleList.length; i++) {
                        var thumbnail = saleList[i].thumbnail; //缩略图
                        var goodsName = saleList[i].goodsName; //商品名
                        var goodsId = saleList[i].goodsId; //商品名
                        //var distributionPrice = saleList[i].goodsProStandard[0].distributionPrice;//分销价
                        var seckillPrice = saleList[i].goodsProStandard[0].seckillPrice; //秒杀价格
                        var goodsPrice = saleList[i].goodsProStandard[0].goodsPrice; //原价、零售价
                        var activityStartTime = saleList[i].goodsProStandard[0].activityStartTime; //活动开始时间
                        //var activityFinishTime = saleList[i].goodsProStandard[0].activityFinishTime;//活动结束时间
                        var filds = 0;
                        var timeNow = new Date(); //当前时间 -- 获取;
                        if (index == 3) {
                            filds = 1;
                        }
                        if (index == 0) {
                            if (activityStartTime > timeNow) {
                                filds = 1;
                            }
                        }
                        sale_html += '<div onclick="goodsJump(\'' + goodsId + '\',' + index + ')" ';
                        if (sort == 0) {
                            sale_html += ' class="set_left">';

                            sort = 1;
                        } else {
                            sale_html += ' class="set_right">';

                            sort = 0;
                        }
                        sale_html += '<img src="' + thumbnail + '" class="goodsDetail" goodsId="' + goodsId + '" num="' + index + '" indexNum="' + filds + '"/>';
                        sale_html += '<p class="margin-t-3 set-goods-price">¥' + seckillPrice + '<span class="dis-price"><s>¥' + goodsPrice + '</s></span></p>';
                        sale_html += '<p class="margin-t-3 set-goods-title">' + goodsName + '</p>';
                        /* sale_html += '<span class="margin-t-3">严选</p>'; */
                        sale_html += '</div>';
                    }
                    $(".set-goods-seckill").html(sale_html);
                } else {
                    //hui.alert("-- 秒杀列表暂无更多数据 --");
                    var html_null = '<span class="downList">--- 暂无更多数据 ---</span>';
                    $(".set-goods-seckill").html(html_null);
                }
            } else {
                hui.alert("-- 秒杀列表请求数据失败 --");
            }
        }
    })
}

function goodsJump(goodsId, index) {

    sessionStorage.setItem('Restore', 1)
    sessionStorage.setItem('scrollindex', $(document).scrollTop())
    sessionStorage.setItem('shoplist', JSON.stringify(shoplist));
    sessionStorage.setItem('respageIndex', pageIndex)
    if (index != null && index == 0) {

        window.location.href = "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq=" + seq + "&shareSeq=0";
    } else {

        window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/0/" + seq;
    }
}


function jumpCoupon() {
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href = "/localQuickPurchase/activity/baiye.html";
}

function selectionJump(selection) {
    window.location.href = "/localQuickPurchase/distributionVA/selectionGoods?name=" + selection;
}

/**
 * 查看优惠券的点击事件
 */
$("body").on('click', '.hint-btn-cancel', function () {
    var href = "/localQuickPurchase/distributionVA/couponCardBag";
    if (giftType == 2) {
        href = "/localQuickPurchase/voucher/voucher.html";
    }
    window.location.href = href;
})
/**
 * 前往购买的点击事件
 */
$("body").on('click', '.hint-btn-sure', function () {
    var href = "/localQuickPurchase/distributionVA/index";
    if (giftType == 2) {
        href = "/localQuickPurchase/coupons/html/wyf.html";
    }
    window.location.href = href;
});

/**
 *  查看用户是否有被邀请升级
 * */
$(function () {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: "/localQuickPurchase/earningsUpgradeLog/findEarningsUpgradeLog",
        data: {
            "userSeq": seq
        },
        async: false,
        success: function (data) {
            var code = data.code;
            if (code == 200) {
                var dataUrl = data.data.upgradeUrl;
                var word = data.data.content;
                hui.confirm(word, ['否', '是'], function () {
                    window.location.href = dataUrl;
                });
            }
        }
    })
})

/**
 *  查看用户是否有赠送的代金券(降级的伙伴)
 * */
/*$(function () {
    $.ajax({
        type:'GET',
        dataType:'json',
        url:"/localQuickPurchase/give/findVoucher",
        data:{"userSeq":seq},
        async : false,
        success:function (data) {
            var code = data.code;
            if(code == 200){
                var dataUrl = data.data.url;
                var word = data.data.official;
                hui.confirm(word, ['否','是'], function () {
                    window.location.href = dataUrl;
                });
            }
        }
    })
})*/

$(document).on("click", ".btn li", function () {
    var jumpUrl = $(this).attr("jumpurl");
    // 判断是否是直播带货
    if (jumpUrl.indexOf("/pages/nowLivelist.html") > -1) {
        goLiveRooms()
    } else {
        location.href = jumpUrl;
    }
});