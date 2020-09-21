var shareSeq = getQueryString("shareSeq");
if(shareSeq != null && shareSeq != "") {
    setCookie("shareSeq", shareSeq, 1);
}

/*爆款秒杀*/
function seckillGoods() {
    $.ajax({
        type: 'GET',
        url: '/localQuickPurchase/sgMongoAction/annualGoods',
        async : true,
        dataType: 'json',
        success: function (data) {
            if (data.code == 200){
                var seckillList = data.data.list;
                if (seckillList != null && seckillList.length >0){
                    var html = "";
                    for (var i = 0; i < seckillList.length; i++) {
                        var goodsId = seckillList[i].goodsId;
                        var thumbnail = seckillList[i].thumbnail;
                        var goodsName = seckillList[i].goodsName;
                        var goodsPrice = seckillList[i].goodsProStandard[0].goodsPrice;
                        var seckillPrice = seckillList[i].goodsProStandard[0].seckillPrice;
                        var priceInt = parseInt(seckillPrice);
                        //先把数据转成字符串
                        seckillPrice = parseFloat(seckillPrice).toFixed(2);
                        var priceStr = seckillPrice.toString();
                        //确定小数在第几位
                        var index = priceStr.lastIndexOf(".");
                        //把小数点后几位去掉
                        var decimal=priceStr.substr(index+1,index+3);
                        html += '<li>';
                        html += '<div class="goods_pic">';
                        html += '<img src="'+thumbnail+'" alt="" onclick="seckillGoodsJump(this)" num="'+goodsId+'"/>';
                        html += '</div>';
                        html += '<div class="productInfo seckill_price">';
                        html += '<p class="seckill_goodsName">'+goodsName+'</p>';
                        html += '<div class="price_box">';
                        html += '<div class="left">';
                        html += '<p>¥'+goodsPrice.toFixed(2)+'</p>';
                        html += '<p class="spikePrice">秒杀价：¥</p>';
                        html += '</div>';
                        html += '<p class="right">'+priceInt+'.<em>'+decimal+'</em></p>';
                        html += '</div>';
                        /*html += '<div class="price_box">';
                        html += '<span class="seckillPrice"><span class="yuan">¥</span>'+priceInt+'.<em>'+decimal+'</em></span>';
                        html += '<span class="goodsPrice">¥'+goodsPrice+'</span>';
                        html += '</div>';*/
                        html += '<button onclick="seckillGoodsJump(this)" num="'+goodsId+'">立即购买</button>';
                        html += '</div>';
                        html += '</li>';
                    }
                    $('#seckillGoods').html(html);
                    // setTimeout(function(){
                    //     var imgList = $(".loadImage");
                    //     for(i = 0; i < imgList.length;i++){
                    //         $(imgList[i]).css("width","5rem");
                    //         $(imgList[i]).css("height","5rem");
                    //     }
                    // }, 200);

                }
            }
        }
    });
}
/*品牌商家*/
function brandShop() {
    $.ajax({
        type: 'GET',
        url: '/localQuickPurchase/annual/brandShop',
        async : true,
        dataType: 'json',
        success: function (data) {
            if (data.code == 200){
                var picturePath = data.data.picturePath;
                var brandShop = data.data.brandShop;
                if (brandShop != null && brandShop.length >0){
                    var html = "";
                    for (var i = 0; i < brandShop.length; i++) {
                        var imageLocation = brandShop[i].imageLocation;
                        var thumbnail = picturePath + imageLocation;
                        var title = brandShop[i].title;
                        var jumpTarget = brandShop[i].jumpTarget;
                        if (i < 10){
                            html += '<li>';
                            html += '<a href="'+jumpTarget+'">';
                            html += '<div class="img_box">';
                            html += '<img src="'+thumbnail+'" alt=""/>';
                            html += '<div>';
                            html += '<p>'+title+'</p>';
                            // html += '<p>成功的标志</p>';
                            html += '</div>';
                            html += '</div>';
                            html += '<button>点击进入</button>';
                            html += '</a>';
                            html += '</li>';
                        }
                    }
                    $('.brandShop').html(html);
                }
            }
        }
    });
}

hui.refresh('#refreshContainer', refresh);	//绑定下拉刷新
hui.loadMore(getMore);		//绑定上拉加载
var isLoading = false;
var first = true;
var pageIndex = 1;
var pageSize = 10;
//加载更多 默认加载第二页
function getMore(){
    var annualId = $('.act').attr("num");
    var index = Number($('.act').attr("i"));
    var param = {"annualId":annualId,"pageIndex": pageIndex, "pageSize": pageSize}
    if(isLoading){
        return;
    }
    isLoading = true;
    $.ajax({
        type: 'GET',
        url: '/localQuickPurchase/annual/annualGoods',
        data: param,
        dataType: 'json',
        success : function(data) {
            if(data!=null && data.code == 200){
                var goods = data.data.goods;
                hasNextPage = goods.hasNextPage;
                var listGoods = goods.list;
                //渲染数据
                setListData(goods,index)
                pageIndex++;
                isLoading=false;
                hui.endLoadMore(false);
                if(!hasNextPage){
                    /* $("#goods-ul").append('<p>找不到更多了</p>'); */
                    hui.endLoadMore(true, '没有更多了...');
                    if(listGoods.length==0){
                        hui.toast('没有更多了,搜下别的吧');
                    }
                }
            }else{
                hui.toast('加载异常请稍后重试！！');
            }
        },
        error : function(error) {
            hui.toast(error);
        }
    });
}

//下拉刷新   页面加载时  加载的方法
function refresh(){
    var annualId = $('.act').attr("num");
    var param = {"annualId":annualId,"pageIndex": 1, "pageSize": 10}
    setTimeout(function () {
        $.ajax({
            type: 'GET',
            url: '/localQuickPurchase/annual/annualGoods',
            data: param,
            dataType: 'json',
            success : function(data) {
                if(data!=null && data.code == 200){
                    classifyHtml(data.data)
                }else{
                    hui.endLoadMore(true, '没有更多了...');
                    return false;
                }
            },
            error : function(error) {
                hui.toast(error);
            }
        });
    },200)
}
/*设置列表数据*/
function setListData(data,num) {
    var annualGoods = data.list;
    var goodsIndex = data.pageIndex;
    if (annualGoods != null && annualGoods.length>0){
        var _annualHtml = "";
        for (var i = 0; i < annualGoods.length; i++) {
            var goodsId = annualGoods[i].goodsId;//商品ID
            var goodsName = annualGoods[i].goodsName;//商品名字
            var thumbnail = annualGoods[i].thumbnail;//商品缩略图
            var goodsPrice = annualGoods[i].goodsPrice;//商品原价
            var distributionPrice = annualGoods[i].distributionPrice;//分销价
            _annualHtml += '<li>';
            // _annualHtml += '<div class="goods_pic">';
            _annualHtml += '<img src="'+thumbnail+'" alt="" onclick="goodsJump(this)" num="'+goodsId+'"/>';
            // _annualHtml += '</div>';
            _annualHtml += '<div class="productInfo product_info">';
            _annualHtml += '<span class="goods_Name">'+goodsName+'</span>';

            _annualHtml += '<div class="price_box">';
            _annualHtml += '<p class="left disPrice"><span class="rmb">¥</span>'+distributionPrice+'.<em>00</em></p>';
            _annualHtml += '<span class="left goods-price">¥'+goodsPrice.toFixed(2)+'</span>';
            // _annualHtml += '<div class="right line-through">';
            // _annualHtml += '<p class="goodsPrice">原价¥'+goodsPrice+'</p>';
            // _annualHtml += '<p class="spikePrice">秒杀价：¥</p>';
            // _annualHtml += '</div>';
            _annualHtml += '</div>';
            /*_annualHtml += '<div class="price_box">';
            _annualHtml += '<div class="left">';
            _annualHtml += '<p class="goodsPrice">原价¥'+goodsPrice+'</p>';
            _annualHtml += '<p class="spikePrice">秒杀价：¥</p>';
            _annualHtml += '</div>';
            _annualHtml += '<p class="right">'+distributionPrice+'.<em>00</em></p>';
            _annualHtml += '</div>';*/

            _annualHtml += '<button onclick="goodsJump(this)" num="'+goodsId+'" class="buyNow">立即购买</button>';
            _annualHtml += '</div>';
            _annualHtml += '</li>';
        }
        $('#newsList'+num).append(_annualHtml);
        $('#newsList'+num).attr("num",goodsIndex);
    }
}

/**
 * 渲染分类列表
 * @param data
 */
function classifyHtml(data) {
    var modulars = data.modulars;
    if (modulars != undefined && modulars != null){
        var _classifyHtml = "";
        var _goodsULHtml = "";
        for (var i = 0; i < modulars.length; i++) {
            var modularName = modulars[i].modularName;
            var classifyId = modulars[i].id;
            if (i == 0){
                _classifyHtml += '<p class="act" num="'+classifyId+'" i="'+i+'" onclick="classifyTab(this)">'+modularName+'</p>';
            } else {
                _classifyHtml += '<p num="'+classifyId+'" i="'+i+'" onclick="classifyTab(this)">'+modularName+'</p>';
            }
            //设置每个列表的商品数据盒子
            _goodsULHtml += '<ul id="newsList'+i+'" class="listDel current" num="0" style="display: none"></ul>';
        }
        $('#tab').html(_classifyHtml);
        $('.hui-list').html(_goodsULHtml);
        slide()
    }
    handleHtml(data)
}

/**
 * 渲染每个分类的商品数据
 * @param data 商品数据
 * @param num  分类下标
 */
function handleHtml(data) {
    var goodsList = data.goods;
    if (goodsList != null && goodsList.length > 0){
        for (var i = 0; i < goodsList.length; i++) {
            refreshGoods(goodsList[i],i)
        }
        $("#newsList0").show();
    }
}
function refreshGoods(goods,num) {
    hasNextPage = goods.hasNextPage;
    var listGoods = goods.list;
    var list="";
    if(listGoods == null || listGoods.length == 0){
        list = '<li class="positionContent"><span class="notMore">--没有更多了,搜下别的吧--</span></li>';
        $("#newsList"+num).append(list);
        return;
    }else{
        //渲染数据
        setListData(goods,num)
    }
    //$("#goods-ul").append(list);
    setTimeout(function(){

        $('#refreshContainer #goods-ul').html(list);
        if(!hasNextPage){
            /* $("#goods-ul").append('<p>找不到更多了</p>'); */
            hui.endLoadMore(true, '没有更多了...');
        }else{
            //重置加载更多状态
            hui.resetLoadMore();
            hui.loading('加载中...', true);
        }
        //结束刷新
        hui.endRefresh();
    },500)
}
function slide() {
    // 获取滑动导航栏 ul 的宽度
    var sumWidth =0;
    $(".nav > div ").each(function(){
        // 获取width+padding+border+margin
        sumWidth += $(this).outerWidth(true) ;
    });

    $('div.nav > div').css('width',sumWidth+ 'px');
}
/**
 * 秒杀商品详情的跳转
 */
function seckillGoodsJump($this){
    var seckillGoodsId = $($this).attr("num");
    if (shareSeq == undefined || shareSeq == null){
        shareSeq = 0;
    }
    window.location.href = "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + seckillGoodsId + "&distributorSeq=0&shareSeq="+shareSeq;
}

/**
 * 普通商品详情的跳转
 */
function goodsJump($this){
    var goodsId = $($this).attr("num");
    if (shareSeq == undefined || shareSeq == null){
        shareSeq = 0;
    }
    window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/"+shareSeq+"/"+seq;
}
/*初始化数据*/
seckillGoods()
brandShop()
// classifyGoods()

/*分类切换的点击事件*/
function classifyTab($this){
    var idx = $($this).index();
    $($this).addClass('act').siblings().removeClass('act');
    $("#newsList"+idx).show().siblings().hide();
    var numIndex = Number($('#newsList'+idx).attr("num"));
    numIndex++;
    pageIndex = numIndex;
    hui.resetLoadMore();
    hui.loading('加载中...', true);
    /*$('#newsList').html("");
    refresh()*/
}

/**
 * 分享弹窗的点击事件
 */
function shareBtn($this){
    if(!isLogin()) {
        noLogin();
        return;
    }
    var urlVal,appUrl,shareGoodsPic;
    //展示二维码和复制链接
    $('.copyCode').show();
    // 商品二维码
    $(".ewmcode img").attr("src","/localQuickPurchase/annual/annualShare/"+seq);
    $(".ewmcode").hide();
    // 分享
    var _href = window.location.href;
    urlVal = _href;
    appUrl = _href
    console.log("appurl:"+appUrl);
    goodsName = "年货节";
    shareGoodsPic = _href.substring(0,_href.indexOf("goods"))+"goods/annualGoods/img/banner_02.png";
    urlVal = urlVal+"?shareSeq="+seq;
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        //点击分享
        share520Love(urlVal,'年货节',goodsName,shareGoodsPic,'.share-content');
    } else{
        share520LoveWeb(urlVal,'年货节',goodsName,shareGoodsPic,'.share-content');
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
    // 复制链接
    var clipboard = new Clipboard('.copylink', {
        // 点击copy按钮，直接通过text直接返回复印的内容
        text: function() {
            var link = urlVal+"&checkShare=1";
            return link;
        }
    });
    clipboard.on('success', function(e) {
        var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
        $("body").find(".copy-tips").remove().end().append($copysuc);
        $(".copy-tips").fadeOut(2000);
        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        hui.toast('复制失败!');
    });

    $("#closeShare").click(function() {
        hiddend();
    });

    function hiddend() {
        $("html,body").css("overflow", "visible");
        hui.dialogClose();
        $(".share-block").slideUp(200);
        $(".ewmcode").hide();
        $('.copyCode').hide();
    }

    $(".shopCode").click(function(){
        var ewmcodeVal = $(".ewmcode").attr("value");
        if(ewmcodeVal == "0"){
            $(".mask").show();
            $(".ewmcode").show();
            $(".ewmcode").attr("value","1");
        } else{
            $(".mask").hide();
            $(".ewmcode").hide();
            $(".ewmcode").attr("value","0");
        }
    });
    // 点击分享后弹出的背景层
    $(".mask").click(function(){
        $(".sharebox").removeClass('active');
        $(".specBtn").hide();
        $(".numBox").hide();
        $(".ewmcode").hide();
        $(".ewmcode").attr("value","0");
    });
}


/**
 *  判断是否登录
 */
function noLogin(){
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        setCookie("loginRetrunUrl",window.location.href);
        loginPage();
    });
}
/**
 * 更多跳转点击
 * @param index{1：秒杀页面跳转；2：品牌广场页面跳转;3：客服中心跳转}
 */
function jump(index) {
    var jumpUrl = "";
    if (index == 1){
        jumpUrl = "/localQuickPurchase/activity/spike.html";
    } else if (index == 2) {
        jumpUrl = "/localQuickPurchase/distributionVA/brandSquareHomePage";
    } else {
        jumpUrl = "/localQuickPurchase/distributionVA/customer/menu";
    }
    if (shareSeq != undefined && shareSeq != null && shareSeq != 0){
        jumpUrl = jumpUrl + "?shareSeq="+shareSeq;
    }
    window.location.href = jumpUrl;
}
/**
 * 返回首页的跳转
 */
function gohome($this){
    window.location.href = "/localQuickPurchase/distributionVA/index";
}
