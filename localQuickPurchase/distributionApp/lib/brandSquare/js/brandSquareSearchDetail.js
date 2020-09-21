/**
 * 禁止非法访问
 * @type {*|string}
 */
var identifyMark = getQueryString("identifyMark");
if(identifyMark != "1"){
    for(var i = 1; i > 0; i++){
        alert("非法访问路径!");
    }
}

/**********************************************************   导航相关   ***************************************************************/

$(function(){
    screen();
});

//筛选按钮
function screen(){
    $("#screenBtn").on("click",function(){
        $('.mask').fadeIn(100);
        $('.choose').fadeIn(100);
        var _html = $('.choose-main').html();
        var small = $('.choose-main').find('.small').val();
        var big = $('.choose-main').find('.big').val();
        choosefn(_html,small,big);
        resethtml();
        return false;
    })
}

/**
 * 导航栏点击切换
 */
$('.nav-box span').on('click',function(){

    var isLoading = false;
    hui.resetLoadMore();
    pageIndex = swtichConditionIndex + 1;

    var s = $('.nav-box span').length;
    var n = $(this).index();
    var clickMark = $(this).attr("clickMark");
    var spanId = $(this).attr("id");
    if(clickMark == 0) {
        if ($(this).hasClass("store-nave")) {
            //点击店铺，查询店铺名
            var keyword = $(".searchInput").val();
            searchShop(keyword);
            //$(this).attr("clickMark","1");
            //444
            $(".goods").hide();
            $(".store").show();
            $(".hui-refresh").css("display", "none");
        } else {
            swtichCondition(spanId);
            $(".goods").show();
            $(".store").hide();
            $(".hui-refresh").css("display", "block");
        }
    }else{
        var activeMark = $(".icon_up").hasClass("active");
        var sortMark = "";
        if(activeMark){
            $(".icon_down").addClass("active");
            $(".icon_up").removeClass("active");
            $(".icon_down").css("border-bottom",".2rem solid red");
            $(".icon_up").css("border-bottom",".2rem solid #989898");
            sortMark = 2;
        }else{
            $(".icon_up").addClass("active");
            $(".icon_down").removeClass("active");
            $(".icon_up").css("border-bottom",".2rem solid red");
            $(".icon_down").css("border-bottom",".2rem solid #989898");
            sortMark = 3;
        }
        swtichCondition(sortMark);
        $(".goods").show();
        $(".store").hide();
        $(".hui-refresh").css("display", "block");
    }
    $('.nav-box span').removeClass('phover');
    $(this).addClass('phover');
});

//搜索店铺5757774
function searchShop(brandShopName){
    $.ajax({
        type : "POST",
        url : "/localQuickPurchase/brandShopInfoAction/findShopByKeyword",
        data : {
            keyword : brandShopName
        },
        async : false,
        success : function(data) {
            console.log(data.data);
            if(data.code == 200){
                var shopInfoList = data.data;
                var bannerPath = data.equipmentData;
                if(shopInfoList.length > 0){
                    var shopInfoStr = "";
                    for(var i = 0; i < shopInfoList.length; i++){
                        var brandShopSmallAdvertisement = "${path}/distributionApp/images/brandNosetShop.png";
                        if(shopInfoList[i].brandRecommendDate) {
                            if(shopInfoList[i].brandRecommendDate.brandLogoImg) {
                                brandShopSmallAdvertisement = bannerPath + shopInfoList[i].brandRecommendDate.brandLogoImg;
                            }
                        }
                        shopInfoStr += "<div class='store-item'><div class='store-item-title hui-list'><span class='store-item-logo'><img src='"+
                            brandShopSmallAdvertisement+
                            "'></span><p class='store-item-text'>"+
                            shopInfoList[i].brandShopName+
                            "</p>"+
                            "<a href='"+
                            "/localQuickPurchase/distributionVA/brandSquareShopPage?shopSeq="+shopInfoList[i].shopSeq+
                            "' class='go-store'>进店</a></div><div class='hui-list store-item-content'><div class='store-item-limg'>";

                        var shopInfoGoodsList = shopInfoList[i].disGoodsList;
                        if(shopInfoGoodsList.length > 0){
                            for(var j = 0; j < shopInfoGoodsList.length; j++){
                                var distributionPrice = "";
                                var goodsImgPath = "";
                                if(shopInfoGoodsList[j].actualPrice != null){
                                    distributionPrice = shopInfoGoodsList[j].actualPrice;
                                }
                                if(shopInfoGoodsList[j].thumbnail != null){
                                    goodsImgPath = shopInfoGoodsList[j].thumbnail;
                                }

                                shopInfoStr += "<a href='#' class='store-item-s' goodsid='"+
                                    shopInfoGoodsList[j].goodsId+
                                    "' isActivityGoods='"+shopInfoGoodsList[j].isActivityGoods+"'>"+
                                    "<img class='imgChange' src='"+
                                    goodsImgPath+
                                    "' class='store-item-img'>"+
                                    "<span class='store-item-m' style='color: red;background: gainsboro;opacity: 0.8;'>"+
                                    "￥"+distributionPrice+
                                    "</span>"+
                                    "</a>";
                            }
                        }
                        shopInfoStr += "</div></div></div>";

                    }
                    document.getElementById("storeId").innerHTML = shopInfoStr;
                }
            }else{
                document.getElementById("storeId").innerHTML = "<p style='text-align: center;color: #999;margin-top: 5%;font-size: 0.7rem;'>无该店铺</p>";
            }
        }
    });
}

var swtichConditionIndex = 1;
//切换筛选条件
function swtichCondition(spanId){
    console.log(spanId);
    var dataP={};
    dataP.keyword = keyword;
    dataP.pageSize = 10;
    dataP.pageIndex = 1;
    swtichConditionIndex = dataP.pageIndex;
    dataP.seq = seq;
    dataP.identifyMark = identifyMark;
    dataP.sortMark = spanId;
    sortMark = spanId;
    data=JSON.stringify(dataP);
    console.log(data);
    $.ajax({
        type: "POST",
        dataType: 'json',
        'url': '/localQuickPurchase/ogMongoAction/dgSH',
        'data': data,
        async: false,
        'contentType': "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if(data.code == 200){
                var searchGoodsList = data.data.list;
                if(searchGoodsList.length > 0) {
                    var searchGoodsStr = "";
                    for (var i = 0; i < searchGoodsList.length; i++) {
                        searchGoodsStr += getDataHtml(searchGoodsList[i]);
                    }
                    spanId == 1 ? searchGoodsStr1 = {1: searchGoodsStr} [spanId] : searchGoodsStr1;
                    spanId == 2 ? searchGoodsStr2 = {2: searchGoodsStr} [spanId] : searchGoodsStr2;
                    document.getElementById("goods-ul").innerHTML = searchGoodsStr;
                }
            }
        }
    })
}

/**********************************************************   导航相关   ***************************************************************/


/**********************************************************   搜索相关   ***************************************************************/
var searchGoodsStr1 = "";
var searchGoodsStr2 = "";
var genreId=getQueryString("genreId");

if(genreId != null) {
    getThirdId(genreId);
} else {
    $(".product-classify").hide();
}

var url;
var data;
var pageIndex=1;
var requestType="GET";
var contentType="application/x-www-form-urlencoded";
var sortMark = 0;
if(genreId!=null){
    //搜索
    $(".searchInput").val(keyword);
    url='/localQuickPurchase/ogMongoAction/queryByGId';

}else{
    //从上一级跳转到本页
    var keyword=getQueryString("keyword");
    $(".searchInput").val(keyword);
    url='/localQuickPurchase/ogMongoAction/dgSH';
    requestType="POST";
    contentType="application/json;charset=utf-8";
}

function getRequestData(){
    if(requestType=="GET"){
        var dataG={}
        dataG.genreId=genreId;
        dataG.pageSize=10;
        dataG.pageIndex=pageIndex;
        dataG.seq=seq;
        dataG.productThreeId = _productThreeId;
        dataG.keyWords = keyword;
        dataG.sortMark = sortMark;
        data=dataG;
    }else{
        // saveHistorysearch(keyword);
        var dataP={};
        dataP.keyword=keyword;
        dataP.pageSize=10;
        dataP.pageIndex=pageIndex;
        dataP.seq=seq;
        dataP.identifyMark=identifyMark;
        dataP.sortMark = sortMark;
        data=JSON.stringify(dataP);
    }
}

getRequestData();
hui.refresh('#refreshContainer', refresh);	//绑定下拉刷新
hui.loadMore(getMore);		//绑定上拉加载
var isLoading = false;
var first = true;
var hasNextPage=true;

//加载更多 默认加载第二页
function getMore(){
    if(isLoading){
        return;
    }
    getRequestData();
    isLoading = true;
    $.ajax({
        type : requestType,
        dataType : 'json',
        'url' : url,
        'data' : data,
        async : false,
        'contentType': contentType,

        success : function(data) {
            if(data != null && data.code == 200){
                var onlineGoodsList = data.data.list;
                if(onlineGoodsList.length > 0) {
                    hasNextPage = data.data.hasNextPage;
                    var list = "";
                    for (var i = 0; i < onlineGoodsList.length; i++) {
                        list += getDataHtml(onlineGoodsList[i]);
                    }
                    $("#goods-ul").append(list);

                    pageIndex++;
                    isLoading = false;
                    hui.endLoadMore(false);
                    if (!hasNextPage) {
                        hui.endLoadMore(true, '没有更多了...');
                        if (onlineGoodsList.length == 0) {
                            hui.toast('没有更多了,搜下别的吧');
                        }
                    }
                }else{
                    $(".hui-refresh-icon").css("display","none");
                    if(pageIndex != 1){
                        hui.endLoadMore(true, '没有更多了...');
                    }else{
                        //5757
                        $("#goods-ul").append("<p class='positionContent'>没有更多了,搜下别的吧!</p>");
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

//下拉刷新   页面加载时  加载的方法(排除)
function refresh(){
    pageIndex=1;
    getRequestData();
    $.ajax({
        type : requestType,
        dataType : 'json',
        'url' : url,
        'data' :data,
        async : false,
        'contentType': contentType,
        success : function(data) {
            if(data!=null && data.code == 200){
                var data = data.data;
                hasNextPage=data.hasNextPage;
                pageIndex++;
                var  listGoods=data.list;
                //555
                conditionGoodsList = listGoods;
                var list="";
                if(listGoods.length == null || listGoods.length == 0){
                    //hui.iconToast("对不起,没有搜索到您要的商品!");
                    list = '<p class="positionContent">没有更多了,搜下别的吧!</p>';
                    $(".hui-refresh-icon").css("display","none");
                    $(".product-classify").hide();
                    $(".hui-list").css('height','4rem');
                    $("#goods-ul").append(list);
                    return;
                }else{
                    for(var i=0;i<listGoods.length;i++){
                        list+=getDataHtml(listGoods[i]);
                    }
                }
                setTimeout(function(){

                    $('#refreshContainer #goods-ul').html(list);
                    if(!hasNextPage){
                        hui.endLoadMore(true, '没有更多了...');
                        if(listGoods.length==0){
                            hui.toast('没有更多了,搜下别的吧');
                        }
                    }else{
                        //重置加载更多状态
                        hui.resetLoadMore();
                        hui.loading('加载中...', true);
                    }
                    //结束刷新
                    hui.endRefresh();
                },500)
            }else{
                hui.endLoadMore(true, '没有更多了...');
                return false;
            }
        },
        error : function(error) {
            hui.toast(error);
        }
    });
}


function getDataHtml(data){
    var goodsProStandard = data.goodsProStandard;
    var isActivityGoods = data.isActivityGoods;
    var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
    var goodsPrice = getGoodsPrice(goodsProStandard);
    var platformPrice = getPlatformPrice(goodsProStandard);//平台价
    var seckillPrice = goodsProStandard[0].seckillPrice;
    if(distributionPrice <= 0){
        var costPrice = (platformPrice*1.15).toFixed(2);
        distributionPrice = (costPrice*1.2).toFixed(2);
    }
    var salesVolume = getSalesVolume(goodsProStandard);//起卖量
    var isDistrbutionGoods = data.isDistrbutionGoods;//
    console.info(salesVolume)
    if(salesVolume == null || salesVolume == 0){
        salesVolume = 1;
    }
    var costPrices;

    var _profit;

    if(isRoleAgent()) {
        _profit = goodsProStandard[0].distributionProfit//分销商利润
    } else if(isRoleDealer()) {
        _profit = numAdd(goodsProStandard[0].profitPrice, goodsProStandard[0].distributionProfit)//代理商利润
    }

    //日供货量
    var actualPrice = data.actualPrice;//实际价格
    var comparativePrice = data.comparativePrice;//展示价格
    var canSaleStock = data.canSaleStock;//剩余库存
    /*
    var stock = "";
    if (canSaleStock <= 0 || canSaleStock == null) {
        stock = "9999件";
        if (isActivityGoods != null && isActivityGoods == "1"){
            stock = "";
        }
    } else {
        stock = canSaleStock + "件";
    }*/
    //标签集合
    var labelList = data.listLabel;
    var presellType = data.presellType;
    costPrices = _profit;

    var isFavorites = data.isFavorites;
    var shop_id = data.seq == null ? 0 : data.seq;
    var supplier_id = data.supplierSeq == null ? 0 : data.supplierSeq;

    var isOk = 0;
    var list = '<li class="backGroundColorLI" data_id="'+data.goodsId+'" state="'+data.state+'" shop_id="'+shop_id+'" supplier_id="'+supplier_id+'" salesvolume_num="'+ salesVolume +'" identifyMark="'+identifyMark+'">';
    list += "<img class='goGoodsDetail' src='"+data.thumbnail+"' alt='' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>";
    list += "<div class='productInfo'>";

    if(presellType != null && presellType == 1) {
        var endTime = data.endTime;
        var date = Date.parse(new Date());
        if(endTime > date) {
            isOk = 1;
            list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'><span style='color: red'>(预售商品)</span>"+data.goodsName+"</div>";
        } else {
            list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>"+data.goodsName+"</div>";
        }
    } else {
        list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"'isActivityGoods = '"+isActivityGoods+"' >"+data.goodsName+"</div>";
    }

    list += "<p class='price'>";
    if(isActivityGoods && isActivityGoods == 1){
        list += "<span class='special'>特卖价:"+actualPrice.toFixed(2)+"</span>";
    }else{
        list += "<span class='special'>¥"+actualPrice.toFixed(2)+"</span>";
    }
    list += "<span class='text_line'>¥"+comparativePrice.toFixed(2)+"</span>";
    list += "</p>";
    /*if (stock != "" && stock != null) {
        list += "<p class='Stock'> 剩余数量：<span>"+stock+"</span></p>";
    }*/
    if (labelList && labelList.length > 0) {
        list += "<div class='label'>";
        for (var z = 0; z < labelList.length && z < 2 ; z++) {
            var colour = labelList[z].colour;
            var labelValue = labelList[z].labelValue;
            list += "<span class='hotSaleGoods' style='color:"+ colour +";border-radius: 0.59rem;border:1px solid "+ colour +"'>"+labelValue+"</span>";
        }
        if((isRoleAgent() || isRoleDealer()) && costPrices > 0) {
            list += "<span class='commissionPrice'>佣金：¥"+cutPriceDown(costPrices)+"</span>";
        }
        list += "</div>";
    }
    list += "</div></li>";
    return list;
}



/**********************************************************   搜索相关   ***************************************************************/



/**********************************************************   点击事件相关   ***************************************************************/
//返回按钮
function goBack(obj){
    try{
        if(document.referrer){
            var RtSearch = getQueryString("RtSearch");
            if (RtSearch != null && RtSearch != "") {
                history.go(-3);
            } else {
                history.go(-1);
            }
        }else{
            // 调app原生返回
            // window.action.app_back();
            try {
                // 调app原生返回  webview
                window.action.app_back();
            } catch (e) {
            }
            try {
                var json = {'function':'goBack'};
                window.webkit.messageHandlers.goBack.postMessage(json);
            } catch (e) {
            }
        }
    }catch(e){
    }
}

//清空输入框
hui('.header-delete').click(function(){
    $(".searchInput").val('');
    $(".back-search").attr('state','1');
    $(".back-search").text('返回');
});
$('input').bind('input propertychange', function() {
    if(($(this).val())==""){
        $(".back-search").attr('state','1');
        $(".back-search").text('返回');
    }else{
        $(".back-search").attr('state','0');
        $(".back-search").text('搜索');
    }
});
//绑定回车键
$("input[class='searchInput']").bind('keydown',function(event){
    if(event.keyCode == "13")
    {
        searchDetailClick();
    }
});
// 取消 或者返回
function searchDetailClick(){
    //店铺搜索
    if($(".phover").attr("id") == "stroeClick") {
        var keywordForShop = $(".searchInput").val();
        searchShop(keywordForShop);
    }
    //普通商品搜索
    var state = $(".back-search").attr('state');
    if (state == '1') {
        hui.Back();
    } else {
        if (genreId != null) {
            keyword = $(".searchInput").val();
            requestType = "GET";
            contentType = "application/x-www-form-urlencoded";
            $(".back-search").attr('state', '0');
            $(".back-search").text('搜索');
            pageIndex = 1;
            $(".searchInput").val(keyword);
            url = '/localQuickPurchase/ogMongoAction/queryByGId';
            $("#goods-ul").html('');
            hui.loading('加载中...', true);
            refresh();
            //重置不可加载状态
            isLoading = false;
            //重置加载更多状态
            hui.resetLoadMore();
        } else {
            keyword = $(".searchInput").val();
            requestType = "POST";
            contentType = "application/json;charset=utf-8";
            $(".back-search").attr('state', '0');
            $(".back-search").text('搜索');
            pageIndex = 1;
            url = '/localQuickPurchase/ogMongoAction/dgSH';
            $("#goods-ul").html('');
            hui.loading('加载中...', true);
            refresh();
            //重置不可加载状态
            isLoading = false;
            //重置加载更多状态
            hui.resetLoadMore();
        }
    }
}


//商品图片点击  进入商品详情
$('#goods-ul').on('click', '.goGoodsDetail', function() {
    var goodsId = $(this).attr('goodsid');
    var isActivityGoods = $(this).attr('isActivityGoods');
    if(seq == null || seq == 0) {
        seq = 0;
    }
    // 进入原生商品详情界面
    try{
        window.action.app_goodsDetails(goodsId,0);
    }catch (e) {
    }

    if(isActivityGoods && isActivityGoods == 1){
        window.location.href= "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq="+seq+"&shareSeq=0";
    }else{
        window.location.href= "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
    }
});


$('#storeId').on('click', '.store-item-s', function() {
    var goodsId = $(this).attr('goodsid');
    var isActivityGoods = $(this).attr('isActivityGoods');
    if(seq == null || seq == 0) {
        seq = 0;
    }
    // 进入原生商品详情界面
    try{
        window.action.app_goodsDetails(goodsId,0);
    }catch (e) {
    }

    if(isActivityGoods && isActivityGoods == 1){
        window.location.href= "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq="+seq+"&shareSeq=0";
    }else{
        window.location.href= "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
    }
});


/**********************************************************   点击事件相关   ***************************************************************/