var list = [];
var _html = '';
var distributionStock = "";//分销商品库存
var goods;
var goodsState = true;// 判断商品是否上架
var activityState;//活动商品上下架状态 3:上架  4：下架
var activity;
var salesVolume = 1;// 起卖量
var shareSeq = getQueryString("shareSeq"); // 分享该商品的用户seq
var goods_ImgPath = "";//商品图片
var Coums=shopgd(seq);  //seq用户的ID----------------
//获取优惠券图标 ---------
function getYhqHtm(data){
    var goodsYhq = data.yHQ;
    var type=getRoleType();
    var yhqHtml = "";
    console.info("type===="+type+"Coums==="+Coums+"seq===="+seq);
    if (goodsYhq) {
        if (type==1||type==2||!type) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else if ((type==3 ||type==4) && Coums<=100) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else {
            yhqHtml+=""
        }
    } else {yhqHtml+=""}
    return yhqHtml;
}

if(shareSeq != null && shareSeq != "" && seq != shareSeq) {
    //如果是分享过来的  且不是自己的seq  保存
    setCookie("shareSeq",shareSeq,1);
} else {
    var shareSeqCK = getCookie('shareSeq');
    if(shareSeqCK != ""){
        shareSeq = shareSeqCK;
    }else {
        shareSeq =0
    }
}
// 获取商品详情
 function goodsInit(goodsId) {
    // 商品信息
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : '/localQuickPurchase/dGoodsAction/loveHouseGodosDetail',
        data : {
            "goodsId" : goodsId,
            "seq" : seq
        },
        async : false,
        success : function(data) {
            if(null == data.data || null == data.data.goodsInfo){
                hui.alert('该商品已经下架！', ['返回首页'], function(){
                    window.location.href="/localQuickPurchase/distributionVA/index";
                });
            }
            var shop = data.data.shopInfo;
            var field = data.data.field;
            goods = data.data.goodsInfo;
            goodsId = goods.goodsId;
            //分销商品库存赋值
            distributionStock = goods.goodsProStandard[0].stock;
            if(distributionStock == null || distributionStock == 0){
                distributionStock = 999;

            }

            //规格
            //商品规格处理数据
            var  props = data.data.props;
            goodsSkuList = props.goodsList;

            if (goods != null) {
                activityState = goods.activityState;//活动商品上下架状态
                shopSeq = goods.seq;
                //false 为本地商品,
                if (goods.isDistrbutionGoods) {
                    supplierSeq = goods.supplierSeq;
                } else {
                    supplierSeq = goods.seq;
                }
                var goodsImg = goods.listGoodsImg;
                var thumbnail = goods.thumbnail;
                if(goodsImg == null || goodsImg.length <= 0) {
                    goodsImgFirst = thumbnail;
                } else {
                    goodsImgFirst = goodsImg[0].goodsImgPath;
                }
                goodsName = goods.goodsName;

                var selfConfessed = goods.selfConfessed;//日供量
                var sellSelfConfessed = goods.sellSelfConfessed;//日卖供量
                proStandardsMap = goods.goodsProStandard;
                //var goodsProStandard = goods.goodsProStandard;
                // ----------------- 2018.5.16 新版详情------------- begin --------------------

                var sale_goods = goods.activitySales;//销量
                $('#marketNum').html("已售"+sale_goods);

                var goodsProStandard = goods.goodsProStandard;
                if (!isLogin() || isRoleConsumer() || isRoleVip()) {
                    //$('.pull-left').html("成为网络店主立减"+cutPriceDown(goodsProStandard[0].distributionProfit)+"元");
                } else if (isRoleAgent()) {
                    $('.pull-left').html("分享好友下单立赚"+cutPriceDown(goodsProStandard[0].distributionProfit)+"元")
                } else if (isRoleDealer()){
                    $('.pull-left').html("分享好友下单立赚"+cutPriceDown(goodsProStandard[0].profitPrice)+"元")
                }
                // ----------------- 2018.5.16 新版详情------------- begin --------------------

                if(goods.purchaseNotes != null && goods.purchaseNotes != ""){
                    $(".txtItem").replaceWith(goods.purchaseNotes);
                }

                if(goodsProStandard != null) {
                    var length = goodsProStandard.length;
                    proStandardsMap = new Array(length);
                    for(var i = 0; i < length; i++) {
                        var goodsProStandards = {};//对象
                        goodsProStandards.sku = goods.goodsProStandard[i].sku;//goodsSku
                        goodsProStandards.distributionPrice = goods.goodsProStandard[i].distributionPrice;//分销价
                        goodsProStandards.platformPrice = goods.goodsProStandard[i].platformPrice;//平台价
                        goodsProStandards.salesVolume = goods.goodsProStandard[i].salesVolume;//起卖量

                        goodsProStandards.companyName = goods.companyName;//供应商名称
                        goodsProStandards.goodsCode = goods.goodsCode;//商品Code
                        goodsProStandards.factoryPrice = goods.goodsProStandard[i].factoryPrice;//出厂价
                        goodsProStandards.cost_unit_price = goods.goodsProStandard[i].cost_unit_price;//出厂单价
                        goodsProStandards.primitiveFactoryPrice = goods.goodsProStandard[i].primitiveFactoryPrice;//原始出厂价
                        goodsProStandards.seckillUnivalence = goods.goodsProStandard[i].seckillUnivalence;//秒杀出厂单价

                        goodsProStandards.distributionProfit = goods.goodsProStandard[i].distributionProfit;//分销商佣金
                        goodsProStandards.profitPrice = goods.goodsProStandard[i].profitPrice;//代理商佣金
                        goodsProStandards.tariffFee = goods.goodsProStandard[i].tariffFee;//关税

                        goodsProStandards.seckillPrice = goods.goodsProStandard[i].seckillPrice;//秒杀价
                        goodsProStandards.activityQuantity = goods.goodsProStandard[i].activityQuantity;//活动总数量
                        goodsProStandards.sellActivityQuantity = goods.goodsProStandard[i].sellActivityQuantity;//卖出的数量
                        goodsProStandards.specificationImg = goods.goodsProStandard[i].specificationImg;//规格对应的图片

                        //获取商品规格信息  common.js
                        var selectSpec = getGoodsProStandardSpecs(goodsProStandard[i]);
                        goodsProStandards.selectSpec = selectSpec;//规格信息
                        proStandardsMap[i] = goodsProStandards;
                    }
                }
//				console.info(proStandardsMap);

                var distributionPrice;
                var seckillPrice;
                var goodsPrice;
                var seckillUnivalence;
                if (goods.goodsProStandard != null) {
                    distributionPrice = goods.goodsProStandard[0].distributionPrice;
                    seckillPrice = goods.actualPrice;
                    seckillUnivalence = goods.goodsProStandard[0].seckillUnivalence;
                    // goodsPrice = goods.goodsProStandard[0].goodsPrice;
                    goodsPrice = goods.comparativePrice;
                }
                var platformPrice = goods.goodsProStandard[0].platformPrice;

                state = goods.state;// 商品状态
                state = goods.state;

                var companyState = goods.companyState;
                // 上下架判断
                if (!(shopSeq > 0)) {
                    if (companyState != 0) {
                        goodsState = false;
                    }
                } else {
                    if (state != 2) {
                        goodsState = false;
                    }
                }
                var logisticsPrice = goods.logisticsPrice;
                var lng1 = goods.lng;
                var lat1 = goods.lat;
                if (shop != null) {
                    if (lng1 == null) {
                        lng1 = shop.lng;
                    }
                    if (lat1 == null) {
                        lat1 = shop.lat;
                    }

                    var range = getGreatCircleDistance(lat1,lng1,lat,lng);
                    //$(".shopAddress").html(range+"公里");

                    var adressDetail = shop.province + shop.city + shop.area + shop.street;
                    if(adressDetail == "" || adressDetail == null){
                        adressDetail = "没填写";
                    }
                    $(".shopAddress").html(adressDetail);
                } else {
                    $(".adressN").hide();
                    $(".distance").hide();
                }
                $(".distributionPrice").html("￥"+seckillPrice);
                $(".goodsPrice").html("￥"+goodsPrice);
                $(".slt-price").html("特卖价:￥" + (seckillPrice));
                var goodsId = goods.goodsId;

                /**
                 * 默认取第一个....
                 */
                var goodsPsd = goods.goodsProStandard[0];
                var currentTime = goods.currentTime;//系统当前时间
                var countDownText = field.countDownText;
                var intervalText = field.intervalText;
                var beginTime = field.seckillFieldBeginTime;
                var endTime = field.seckillFieldEndTime;
                activity = field.activity;

                /* ============ 定时器 =========== begin ===========*/
                var timeNow,finalTime,timeServerClient,timerID;
                var dataIndex = 0;//秒杀列表的tab下标
                $('.day').attr("id","day"+dataIndex);
                $('.hour').attr("id","hour"+dataIndex);
                $('.minute').attr("id","minute"+dataIndex);
                $('.second').attr("id","second"+dataIndex);
                $('.timeText').html(countDownText);
                finalTime = beginTime;//开始的时间
                if (!!activity){
                    finalTime = endTime;//开始的时间
                }
                timeNow = currentTime;//当前时间 -- 获取
                timeServerClient = finalTime-timeNow;  //结束时间 - 当前时间 = 距离活动结束的时间

                setTimeout("show_time("+finalTime+","+timeServerClient+","+dataIndex+")",1000);
                /* ============ 定时器 ===========  end  ===========*/

                //获取下单优惠价
                var PreferentialPrice = 0.0;
                if(isRoleAgent() || isRoleDealer()){

                    var _distributionProfit = goodsPsd.distributionProfit;//分销商佣金
                    var _profitPrice = goodsPsd.profitPrice;//代理商佣金

                    if(_profitPrice != null && _profitPrice > 0.0 && _distributionProfit != null && _distributionProfit > 0.0) {
                        if(isRoleAgent()) {
                            PreferentialPrice = _distributionProfit;//分销商佣金
                        } else if(isRoleDealer()) {
                            PreferentialPrice = _profitPrice;//代理商佣金
                        }
                    }

                    _html = '<div class="slt-txt styleColor slt-price">优惠:'+cutPriceDown(PreferentialPrice)+'</div>';
                    $('.slt-price').append(_html);
                }
                var ifOverseas = goods.ifOverseas;
                if (null != ifOverseas && 1 == ifOverseas) {
                    var tariffFee = goodsPsd.tariffFee;//分销商佣金
                    if (null == tariffFee || "" == tariffFee) {
                        tariffFee = 0;
                    }
                    $('.tariff').show();
                    $('.tariffFee').html(tariffFee)
                }

                // 商品描述
                var introduction = goods.introduction;
                goodsCode = goods.goodsCode;
                salesVolume = goodsPsd.salesVolume;//起卖量
                $('.stock-num').html(salesVolume);
                /*// 规格

                var chooseSpec = '';
                for(var i = 0; i < list.length; i++) {
                    var array_element = list[i];
                    var elements = array_element.split(":");
                    var name = elements[0];//规格参数名
                    chooseSpec += '<div class="spec-list">';
                    chooseSpec += '<div class="spec-title">' + name + '</div>';

                    var chima = elements[1];
                    var chimas = chima.split("^");//商品规格
                    for (var j = 0; j < chimas.length; j++) {
                        var array_element = chimas[j];
                        chooseSpec += '<div class="spec-item" onclick="selSpec(this);getSpces(this)">' + array_element + '</div>';
                    }
                    chooseSpec += '</div>';
                }
                $(".spec-box").html(chooseSpec);*/
                // 规格展示
                // 规格展示
                var chooseSpec = '';
                var attrList = props.attrList;
                for(var i = 0; i < attrList.length; i++) {
                    var name = attrList[i].name;
                    var attrValues = attrList[i].attrValues;

                    chooseSpec +='<div class="spec-list attr-row">';
                    chooseSpec += '<div class="spec-title">' + name + '</div>';
                    for (var j = 0; j < attrValues.length; j++) {
                        var attrValue = attrValues[j];
                        var prime = attrValue.prime;
                        var attrValue = attrValue.attrValue;
                        chooseSpec += '<div class="spec-item" data-prime='+prime+' onclick="selectSpces(this)" >' + attrValue + '</div>';
                    }
                    chooseSpec += '</div>';
                }
                $(".spec-box").html(chooseSpec);

                $(".name-txt").html(goodsName);
                // $(".stock").html(stock);
                if (logisticsPrice == null || logisticsPrice == 0) {
                    $(".logisticsPrice").html("免运费");
                } else {
                    $(".logisticsPrice").html("物流运费:" + logisticsPrice + "元");
                }
                $(".value").html();

                var imgText = '';

                if(goodsImg == null || goodsImg.length <= 0) {
                    goods_ImgPath = thumbnail;
                    imgText += '<div class="hui-swipe-item"><img src="' + thumbnail + '"/></div>';
                    $(".goodsImg").find("img").attr("src", thumbnail);
                } else {
                    for (var i = 0; i < goodsImg.length; i++) {
                        var goodsImgPath = goodsImg[i].goodsImgPath;
                        imgText += '<div class="hui-swipe-item"><img src="' + goodsImgPath + '"/></div>';
                    }
                    goods_ImgPath = goodsImg[0].goodsImgPath;
                    $(".goodsImg").find("img").attr("src", goods_ImgPath);
                }
                $("#swipe2").append(imgText);

                $(".imgAndTxt").html(introduction);
                var parameter = data.data.goodsInfo.parameter;
                var specText = null;
                if(parameter != null && parameter.length > 0){
                    for(var i = 0; i < parameter.length; i++){
                        specText = '<li class="paramItem">'
                            + '<label class="paramName">' + parameter[i].pName + '</label>'
                            + '<span class="paramValue checked">' + parameter[i].pDName
                            + '</span>' + '</li>';
                        $(".paramList").append(specText);
                    }
                }

                // 图片轮播初始化   秒杀列表共用 秒杀列表没有图片轮播
                try{
                    showEva(data.data.evaluation);
                    $(".evaNum").html("("+ data.data.totalEvaluation +")");
                    var swipe2 = new huiSwpie('#swipe2');
                    swipe2.autoPlay = false;
                    swipe2.speed=500;//切换图片的时间
                    swipe2.delay=5000;//切换图片后停顿的时间  毫秒
                    swipe2.run();
                }catch (e){}

                //初始化选择规格面板
                try{
                    var goodsAttr1 = new GoodsAttr({
                        jqWrap: $('#wrap1'),
                        goodsList: goodsSkuList,
                        success(product) {
                            console.log(product.sku);
                            orderSku = product.sku;
                            getPriceForSelectSku(orderSku);
                        }
                    });
                }catch (e){}
            }else{
                hui.toast("暂无商品信息");
            }
        },
        error : function(err) {

        }
    });
}
/* 获取规格的内容 */
function selectSpces(obj){
    if($(obj).hasClass("disabled")) {
        return;
    }
    $(".slt-spec").html("选择规格");

    $(".specBox.buyBtn").html("选择规格");
    var moreHtml = '<span class="checkedSpec"></span>' +
        '<span class="checkedMore"><img src="/localQuickPurchase/distributionApp/images/gd_spec.png"></span>';
    $(".specBox.buyBtn").append(moreHtml);
}
//选中规格
function selSpec(t){
    if($(t).hasClass("nogood")){
        return;
    }
    $(t).addClass("checked").siblings(".spec-item").removeClass("checked");
}

// 上下架的点击切换
function changeOrderStatus(){
    $("#detailup").toggle();
    $("#detaildown").toggle();
}

// 判断是否登录
function noLogin(){
    sltHide();
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        //setCookie("loginRetrunUrl",urlVal);
        loginPage();
    });
}

//商品推荐
function hotSale(){
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
        data : JSON.stringify({
            'pageSize' : 10,
            'pageIndex' : 1,
            'columnName' : '为您推荐',
        }),
        contentType: "application/json;charset=utf-8",
        async : true,
        success : function(data) {
            var data = data.data;
            if(data.length > 0){
                var goodsText = '';
                for (var i = 0; i < data.length; i++) {
                    var goods = data[i];
                    var goodsName = goods.goodsName;
                    var actualPrice = goods.actualPrice;//实际价格
                    var comparativePrice = goods.comparativePrice;//对比价格
                    var isActivityGoods = goods.isActivityGoods;
                    var goodsProStandard = goods.goodsProStandard;
                    var distributionPrice = goodsProStandard[0].distributionPrice;//分销价
                    var goodsPrice = goodsProStandard[0].goodsPrice;//市场销售价
                    var listImg = goods.listGoodsImg;
                    var goodsId = goods.goodsId;
                    var goodsImg = '';
                    if(null != listImg && listImg.length > 0){
                        goodsImg = listImg[0].goodsImgPath;
                    } else {
                        goodsImg = goods.thumbnail;
                    }
                    goodsText += '<div class="goodsItem"><div class="gImg">';

                    goodsText += '<img class="good-pic" src="'+ goodsImg+'" id='+goodsId+' isActivityGoods='+isActivityGoods+'></div>';
                    goodsText +=getYhqHtm(goods);//------------
                    var presellTypes = goods.presellType;
                    if(presellTypes != null && presellTypes == 1) {
                        var endTime = goods.endTime;
                        var date = Date.parse(new Date());
                        if(endTime > date) {
                            goodsText += '<div class="gDetail"><div class="gName"><span style="color: red">(预售商品)</span>'+ goodsName+'</div>';
                        } else {
                            goodsText += '<div class="gDetail"><div class="gName">'+ goodsName+'</div>';
                        }
                    } else {
                        goodsText += '<div class="gDetail"><div class="gName">'+ goodsName+'</div>';
                    }
                    goodsText += '<div class="label">';
                    if(goods.listLabel != null){
                        var  listLabel = goods.listLabel;
                        for (var j = 0; j < listLabel.length; j++) {
                            var label = listLabel[j];
                            goodsText += ' <span style="color:'+ label.colour +';border: 1px solid '+ label.colour +';border-radius: 0.59rem;' +
                                'padding: 0 4px;word-break: keep-all;">'+ label.labelValue +'</span>'
                        }
                    }
                    goodsText += '</div>';
                    goodsText += '<div class="gPrice"><span class="rPrice">￥'+ actualPrice +'</span> <span class="oPrice">￥'+goodsPrice+'</span></div></div></div>';
                }
                $(".goodsList").html(goodsText);
            }

        },
        error : function(error) {

        }
    });
}

//获取商品的利润
function PreferentialPrice(userSeq,goodsId){
    if(checkShare == null){
        shareSeq = 0;//分享者seq
    }
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : '/localQuickPurchase/dGoodsAction/getGoodsProfit',
        data : {
            seq : userSeq,
            goodsId : goodsId,
            shareSeq : shareSeq
        },
        async : false,
        success : function(data) {
            var code = data.code;
            if(code == 200){

            } else {
                hui.toast("加入购物车失败");
                sltHide();
            }
        }
    });

}

/**
 * 根据角色类型获取优惠价
 * @returns
 */
function getDicountPrice(entity, platformPrice, distributionPrice, isDistrbutionGoods) {
    //获取下单优惠价
    var PreferentialPrice = 0.0;
    if(isRoleAgent() || isRoleDealer()) {
        var _distributionProfit = entity.distributionProfit;//分销商佣
        var _profitPrice = entity.profitPrice;//代理商佣金
        if(_distributionProfit != null && _distributionProfit > 0.0 && _profitPrice != null && _profitPrice > 0.0) {
            if(isRoleAgent()) {
                PreferentialPrice = entity.distributionProfit;//分销商佣金
            } else if(isRoleDealer()) {
                PreferentialPrice = numAdd(entity.profitPrice, entity.distributionProfit);//代理商佣金
            }
        }
    }
    return PreferentialPrice;
}

//商品详情
$("body").on('click', '.good-pic', function() {
    var goodsId = $(this).attr('id');
    var isActivityGoods = $(this).attr('isActivityGoods');
    if (isActivityGoods != null && isActivityGoods == "1"){
        window.location.href= "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq="+seq+"&shareSeq=0";
    } else {
        window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
    }
});

function guid() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
/**
 * 根据当前用户类型获取佣金
 * @param distributionProfit
 * @param profitPrice
 */
function getCommission(distributionProfit, profitPrice) {
    var preferentialPrice;
    if(isRoleAgent()) {
        preferentialPrice = distributionProfit;//分销商佣金
    } else if(isRoleDealer()) {
        preferentialPrice = profitPrice;//经销商佣金
    }
    return preferentialPrice;
}
//根据选中商品sku获取价格
function getPriceForSelectSku(sku) {
    for(var i = 0; i < proStandardsMap.length; i++) {
        var getProStandard = proStandardsMap[i];
        var getSku = getProStandard.sku;
        if (getSku == sku) {
            var specificationImg = getProStandard.specificationImg;
            if (specificationImg == null || specificationImg == "") {
                specificationImg = goods_ImgPath;
            }
            spec = getProStandard.selectSpec;
            showSpecs(spec);
            var getDisPrice = getProStandard.seckillPrice;
            var tariffFee = getProStandard.tariffFee;
            var getSalesVolume = getProStandard.salesVolume;
            $(".goodsImg").find("img").attr("src", specificationImg);
            $('.stock-num').html(getSalesVolume);//起卖量
            $(".slt-price").html("￥" + (getDisPrice));//分销价
            $(".distributionPrice").html(getDisPrice);
            $(".tariffFee").html(tariffFee);//关税
            $("input[name=numValue]").val(getSalesVolume);//
            $(".distributionPrice").html(getDisPrice);
            //分销商品库存赋值
            var activityQuantity = getProStandard.activityQuantity;//活动总数量
            var sellActivityQuantity = getProStandard.sellActivityQuantity;//卖出量
            var totalNum = numSub(activityQuantity, sellActivityQuantity);
            /*if(totalNum != null ) {
                $(".selfConfessed").show();
                if(totalNum == 0) {
                    $(".specBtn-item.buyNow").addClass("buyyel");
                    $(".specBtn-item.buyNow").html("该秒杀商品已被抢光~");
                } else {
                    $(".buyNow").attr("residual",totalNum);//插上剩余量
                    $(".specBtn-item.buyNow").removeClass("buyyel");
                    $(".specBtn-item.buyNow").html("立即购买");
                }
            }*/
            $(".buyNow").attr("residual",totalNum);//插上剩余量
            $(".specBtn-item.buyNow").removeClass("buyyel");
            $(".specBtn-item.buyNow").html("立即购买");
            //显示
            var getDisProfit = getProStandard.distributionProfit;
            var getProfitPrice = getProStandard.profitPrice;
            showCommission(getDisProfit, getProfitPrice);
        }
    }
}
//显示佣金
function showCommission(distributionProfit, profitPrice) {
    var preferentialPrice = getCommission(distributionProfit, profitPrice);
    if(preferentialPrice > 0){
        if(isRoleAgent() || isRoleDealer()) {
            if (isRoleAgent()) {
                $('.pull-left').html("分享好友下单立赚"+cutPriceDown(preferentialPrice)+"元")
            } else if (isRoleDealer()){
                $('.pull-left').html("分享好友下单立赚"+cutPriceDown(preferentialPrice)+"元")
            }
            var preferentialHtml = '<div class="slt-txt styleColor slt-price">优惠:'+cutPriceDown(preferentialPrice)+'</div>';
            $('.slt-price').append(preferentialHtml);
        }
    }
}
/**
 * 规格显示
 * @param showSpec
 */
function showSpecs(showSpec) {
    $(".slt-spec").text("已选择 " + showSpec);
    $(".specBox.buyBtn").html("已选择");
    $(".specBox.buyBtn").append('<span class="checkedSpec">'+showSpec+'</span>');
}
var Num = {
    num:salesVolume == null ? 1 : salesVolume,
    maxNum:999,
    init:function(){
        $("input[name=numValue]").val(Num.num);
    },
    handle:function(){
        $("input[name=numValue]").change(function(){
            var numNum = $(this).val()
            if(!checkNum(numNum) ){
                hui.toast("购买数量只能为数字");
                numNum = salesVolume
                $(this).val(numNum);
            }else if ( numNum < salesVolume){
                hui.toast("购买数量不能小于起卖量");
                numNum = salesVolume
                $(this).val(numNum);
            } else if(numNum >= Num.maxNum){
                $(this).val(Num.maxNum);
                numNum = Num.maxNum;
            }
            Num.num = numNum;
        });
        $(".nbox-reduce").click(function(){
            if(!checkNum(Num.num)){$("input[name=numValue]").val(0);}
            var numNum = $("input[name=numValue]").val();
            numNum--;
            Num.num = numNum;
            if(numNum < salesVolume){
                hui.toast("购买数量不能小于起卖量");
                return;
            }
            $("input[name=numValue]").val(numNum);
        });
        $(".nbox-add").click(function(){
            if(!checkNum(Num.num)){$("input[name=numValue]").val(0);}
            if(Num.num>=Num.maxNum){hui.toast("已经是最大购买量");return;}
            var numNum = $("input[name=numValue]").val();
            numNum++;
            Num.num = numNum;
            if(numNum > Num.maxNum){
                hui.toast("购买量不能大于999");
                return;
            }
            $("input[name=numValue]").val(numNum);
        });
        function checkNum(n){
            var reg = /^[0-9]\d*$/;
            if(reg.test(n)){
                return true;
            }else{
                return false;
            }
        }
    }
};
//立即购买
$(".buyNow").click(function(){
    var goodsId = $(this).attr("num");
    if (!activity){
        hui.alert("该商品活动还没开始，请耐心等待！");
        return;
    }
    console.log(goodsId);
    if (!activity) {
        hui.alert("活动还未开始！请留意活动开始时间！");
        return;
    }
    if(!isLogin()){noLogin();return;}

    var ishas = $(this).hasClass("buyyel");
    if(ishas) {
        hui.alert("该规格已售罄~,请选择其他规格！");
        return;
    }

    var num = Number($("input[name=numValue]").val());//商品数量
    var an = $(".spec-list").length;
    var sn = $(".spec-item.active").length;
    if(an != sn) {
        hui.toast("请选择商品规格");
        return;
    }

    goodsNum = num;
    if(num <= 0){
        //hui.toast("请选择购买数量!");
        hui.toast("该商品的起卖量是"+salesVolume);
        $("input[name=numValue]").val(salesVolume);
    } else if(num < salesVolume){
        //hui.toast("购买数量要大于起卖量!");
        hui.toast("该商品的起卖量是"+salesVolume);
        $("input[name=numValue]").val(salesVolume);
    } else if(num > distributionStock){
        hui.toast("最大订单数量为"+distributionStock);

    } else{
        //判断平台商品是否上架
        if(!goodsState){
            return hui.toast("商品已下架");
        } else {
            var quantity = $(this).attr("residual");
            /*if (Number(num) > Number(quantity)) {
                hui.toast("最大订单数量为:"+quantity);
                $("input[name=numValue]").val(quantity);
                return;
            }*/
            if (goodsId != null) {// && quantity > 0
                shopSeq = shopSeq == null ? 0 : shopSeq;
                supplierSeq = supplierSeq == null ? 0 : supplierSeq;
                var url = "/localQuickPurchase/distribution/html/placeOrder.jsp"+
                    "?goodsId="+goodsId+"&shareSeq="+ shareSeq +"&quantity="+goodsNum+"&seq="+seq+"&shopSeq="+shopSeq+"&spec="+spec+"&sku="+orderSku+"&isActivityGoods=1";
                window.location.href=url;
            } else {
                hui.alert("该规格已售罄~,请选择其他规格！");
            }
        }
        //}else{
        //	hui.toast("商品已下架");
        //}
    }
});
function  jumpCoupon(){
    window.location.href="/localQuickPurchase/activity/baiye.html?shareSeq";
};
