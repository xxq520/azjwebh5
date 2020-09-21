/** 专区类型 moduleType 1:百业联盟 2:每日上新*/
var moduleType = getQueryString("moduleType");
/** 抵用券余額*/
var Coums=shopgd(seq);
/** 因为移动端输入法自带前往按钮使链接参数丢失，所以暂时将参数放入cookie里*/
if (moduleType != null && moduleType != ""){
    setCookie("moduleType",moduleType,7);
}
if (moduleType == null || moduleType == ""){
    moduleType = getCookie("moduleType");
}

var _productThreeId;
var sortType = "";
function  jumpCoupon(){
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href="/localQuickPurchase/activity/baiye.html";
}
//点击分类菜单切换
function productThreeId(obj){
    _productThreeId = $(obj).attr("id");
    keyword = null;
    pageIndex = 0;
    $(".productDet").html("");
    loadMore();
}

//暂时不知道用于干什么
var shareSeqCK = getCookie('shareSeq');
var shareSeq = 0;
if(isRoleConsumer() || !isLogin()) {
    if(shareSeqCK != null && shareSeqCK != 0) {
        shareSeq = shareSeqCK;
    }
}

//获取二级分类
var genreId = getQueryString("genreId");
if(genreId) {
    //加载三级分类
   // getThirdId(genreId);
}

//渲染二级分类菜单方法
function getThirdId(num) {
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : '<%=path%>/ogMongoAction/getThirdId',
        data : {
            genreId : parseInt(num)
        },
        async : false,
        success : function(data) {
            var categoryMenuHTML = "<div class='nav_Li swiper-slide active' id='0' onclick='productThreeId(this)'>全部</div>";
            if(data.data){
                var list = data.data;
                console.log(list);

                for(var i = 0; i < list.length; i++){
                    var id = list[i].id;
                    var name = list[i].name;
                    if(name != "香烟"){
                        categoryMenuHTML += "<div class='nav_Li swiper-slide' id='"+id+"' onclick='productThreeId(this)'>"+name+"</div>";
                    }
                }
            }
            $(".plNavbar").append(categoryMenuHTML);

            // 滑动导航栏
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 5,
                spaceBetween: 10,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });

        },
    });
}

//加载默认选中第一栏分类所属商品
var url;
var data;
var pageIndex=0;
var requestType="GET";
var contentType="application/x-www-form-urlencoded";
    $(".swiper-container").css("display","none");
    var keyword = "";
    var queryStringKeyword = getQueryString("keyword");
    if(queryStringKeyword != null && queryStringKeyword != "null"){
        keyword = queryStringKeyword ;
    }
    try{
        //进行URL解码
        var keywordD = decodeURI(keyword);
        keyword = keywordD;
    }catch (e){
        console.log(e);
    }
    $(".search").val(keyword);
    url='/localQuickPurchase/dGoodsAction/findOfWYF';
    requestType="POST";
    contentType="application/json;charset=utf-8";

function getRequestData(){
        saveHistorysearch(keyword);
        var dataP={};
        dataP.moduleType=moduleType;
        dataP.keyword=keyword;
        dataP.pageSize=5,
            dataP.pageIndex=pageIndex;
        dataP.seq=seq;
        if(sortType){
            dataG.sortType = sortType;
        }
        dataP.genreId = genreId;
        data=JSON.stringify(dataP);
}


//显示佣金
function showCommission(distributionProfit, profitPrice) {
    var preferentialPrice = getCommission(distributionProfit, profitPrice);
    if(preferentialPrice > 0){
        if(isRoleAgent() || isRoleDealer()) {
            return preferentialPrice;
        }
    }
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
        preferentialPrice = numAdd(profitPrice, distributionProfit);//经销商佣金
    }
    return preferentialPrice;
}

getRequestData();
loadMore();

/**
 * 加载更多
 */
function loadMore(){
    // productDet
    // if(){}
    $('.productDet').dropload({
        scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domNoData : '<p class="dropload-refresh">↑下拉加载更多</p>',
            domRefresh    : '<p class="dropload-load"><span class="loading"></span>加载中...</p>',
            domLoad  : '<p class="dropload-noData">没有更多了...</p>'
        },
        //下拉加载方法
        loadDownFn : function(me){
            pageIndex++;
            getRequestData();
            $.ajax({
                type: requestType,
                dataType: 'json',
                'url': url,
                'data': data,
                async: false,
                'contentType': contentType,
                success: function (data) {
                    if (data != null && data.code == 200) {
                        var data = data.data;
                        var plContentHTML = "";
                        if (data.list && data.list.length != 0) {
                            // $("#hui-load-more2").css("display", "block");
                            var goodsList = data.list;
                            for (var i = 0; i < goodsList.length; i++) {
                                var thumbnail = "";
                                if (goodsList[i].thumbnail) {
                                    thumbnail = goodsList[i].thumbnail;
                                } else {
                                    thumbnail = "/localQuickPurchase/distributionApp/images/goodsImg.png";
                                }
                                var goodsName = goodsList[i].goodsName;
                                var goodsId = goodsList[i].goodsId;
                                var isActivityGoods = goodsList[i].isActivityGoods;
                                var actualPrice = goodsList[i].actualPrice;//实际价格
                                var comparativePrice = goodsList[i].comparativePrice;//展示价格
                                var listLabel = goodsList[i].listLabel;
                                //佣金计算
                                var distributionProfit = goodsList[i].goodsProStandard[0].distributionProfit;
                                var profitPrice = goodsList[i].goodsProStandard[0].profitPrice;
                                var commission = goodsList[i].discounts;
                                var type=getRoleType();

                                plContentHTML += "<li class='img' goodsId='" + goodsId + "'num='" + isActivityGoods + "' >" +"<p style='position: relative;width: 6.02rem;'>" +
                                    "<img  src='" + thumbnail + "' alt='' />"
                                if (type==1||type==2 ||!type ) {
                                    plContentHTML+= "<img  style='height: 20px;width: 40%; position: absolute;top: 10px;right: -10px;'  src='/localQuickPurchase/coupons/images/home_icon_label_1@2x.png'  onclick='jumpCoupon()'/>"

                                }else if ((type==3||type==4) && Coums<=100) {
                                    plContentHTML+="<img  style='height: 20px;width: 40%; position: absolute;top: 10px;right: -10px;'  src='/localQuickPurchase/coupons/images/home_icon_label_1@2x.png'  onclick='jumpCoupon()'/>"

                                }else {
                                    plContentHTML+=""
                                }
                                plContentHTML += "</p>"+
                                    "<div class='productInfo'>" +
                                    "<div class='title'>" + goodsName + "</div>" +
                                    "<p class='price'>" ;
                                if (isActivityGoods && isActivityGoods == 1) {
                                    plContentHTML +="<span class='special'>特卖价:" + actualPrice.toFixed(2) + "</span>";
                                } else {
                                    plContentHTML +="<span class='special'>¥" + actualPrice.toFixed(2) + "</span>";
                                }
                                plContentHTML +="<span class='text_line'>¥" + comparativePrice.toFixed(2) + "</span></p>";
                                plContentHTML +="<div class='label'>";
                                if(listLabel && listLabel.length > 0){
                                    for(var z = 0; z < listLabel.length  && z < 2; z++){
                                        var colour = listLabel[z].colour;
                                        var labelValue = listLabel[z].labelValue;
                                        plContentHTML += "<span class='hotSaleGoods' style='color:"+colour+";border:1px solid "+colour+"'>"+labelValue+"</span>"
                                        //专区商品只展示一个标签，此处break一下
                                        // break;
                                    }
                                }
                                if ( commission && commission != "") {
                                    plContentHTML +=  "<span class='commissionPrice'>佣金：" + "¥" + commission + "</span>";
                                }
                                // "<p class='hotSaleGoods'>热卖</p>";
                                plContentHTML += "</div></div></li>";
                            }
                            // $(".productDet").append(plContentHTML);
                            $(".dropload-down").before(plContentHTML);
                            me.resetload();
                        }else{
                            // $(".dropload-load").hide();
                            // $(".hui-load-more").css("display","block");
                            me.lock();
                            me.noData();
                        }

                        //接口出错返回空
                    }else{
                        hui.toast('加载异常请稍后重试！！');
                        //noData()
                    }
                },error: function (error) {
                    hui.toast('加载异常请稍后重试！！');
                    me.resetload();
                }
            });
        }
    });
}

//后退按钮点击事件
hui('.back_btn').click(function(){
    setCookie("moduleType","",-1);
    try{
        // 调app原生返回
        //window.action.app_back();
    }catch(e){
    }
    setTimeout(function(){
        hui.Back();
    }, 200);
});

//点击搜索方法
function searchDetailClick(){
    //获取输入框查询信息
    var  searchInputValue = $(".search").val();
    //获取当前分类id
    _productThreeId = $(".active").attr("id");
    // if(searchInputValue) {
    keyword = searchInputValue;
    genreId = "";
    requestType = "POST";
    contentType = "application/json;charset=utf-8";
    pageIndex = 1;
    url = '/localQuickPurchase/dGoodsAction/findOfWYF';
    $(".productDet").html('');
    //hui.loading('加载中...', true);
    pageIndex = 0;
    loadMore();
    //重置不可加载状态
    isLoading = false;
    //重置加载更多状态
    hui.resetLoadMore();
}


//排序条件点击事件
$(".sort_Li").click(function(){
    var sortList = $(".selected").find(".sort_nav").find(".sort_Li");
    //去除字体高亮
    for(var i = 0; i < sortList.length; i++){
        $(sortList[i]).removeClass("sort_active");
    }
    $(".drop_down").removeClass("current");

    //去除指针高亮
    $($(".selected").find(".sort_nav").find(".icon_up")[0]).css("border-bottom", ".2rem solid #989898");
    $($(".selected").find(".sort_nav").find(".icon_up")[1]).css("border-bottom", ".2rem solid #989898");
    $($(".selected").find(".sort_nav").find(".icon_down")[0]).css("border-bottom", ".2rem solid #989898");
    $($(".selected").find(".sort_nav").find(".icon_down")[1]).css("border-bottom", ".2rem solid #989898");

    //高亮字体
    $(this).addClass("sort_active");

    var activeMark = $(this).find(".icon_up").attr("active");
    if(activeMark == "0") {
        //高亮上指针
        $(this).find(".icon_up").css("border-bottom", ".2rem solid #ff9003");
        $(this).find(".icon_down").css("border-bottom", ".2rem solid #989898");
        //状态改为激活
        $(this).find(".icon_up").attr("active",1);
        $(this).find(".icon_down").attr("active",0);
        if($(this).find(".icon_up").attr("sortType")){
            sortType = $(this).find(".icon_up").attr("sortType");
        }
    }else{
        //高亮上指针
        $(this).find(".icon_up").css("border-bottom", ".2rem solid #989898");
        $(this).find(".icon_down").css("border-bottom", ".2rem solid #ff9003");
        //状态改为激活
        $(this).find(".icon_down").attr("active",1);
        $(this).find(".icon_up").attr("active",0);
        if($(this).find(".icon_down").attr("sortType")){
            sortType = $(this).find(".icon_down").attr("sortType");
        }
    }

    var  searchInputValue = $(".search").val();
    //封装条件请求数据
    pageIndex = 0;
    $(".productDet").html("");
    if(searchInputValue){
        getRequestData();
        searchDetailClick();
    }else {
        getRequestData();
        loadMore();
    }

});


//点击跳转商品详情 跳转
$(document).on("click",".productDet .img",function(){
    var goodsId = $(this).attr('goodsId');
    var num = $(this).attr("num");
    if(seq == null || seq == 0) {
        seq = 0;
    }
    // 进入原生商品详情界面
    try{
        window.action.app_goodsDetails(goodsId,0);
    }catch (e) {
    }
    if (num != undefined && num == "1"){
        window.location.href = "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq=0";
    } else {
        window.location.href = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
    }
});

function clearValue(){
    $(".search").val("");
}

function test(){
    var searchVal = $(".search").val();
    location.href = "/localQuickPurchase/distributionVA/classify/searchWyfDetail?keyword="+searchVal+"&moduleType=1";
    // while(true){
    //     setTimeout(function(){
    //         break;
    //     },5000)
    // }
    return false;
}
