var genreId=getQueryString("genreId");
var shopSeq = getQueryString("shopSeq");//店铺商家seq
var Coums=shopgd(seq);
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
if(genreId!=null){
    var keyword=getQueryString("keyword");
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
        data=dataG;
    }else{
        var dataP={};
        dataP.keyword=keyword;
        dataP.pageSize=10;
        dataP.pageIndex=pageIndex;
        dataP.seq=seq;
        dataP.shopSeq=shopSeq;
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
            if(data!=null && data.code == 200){
                var data = data.data;
                hasNextPage=data.hasNextPage;
                var listGoods=data.list;
                var list="";
                for(var i=0;i<listGoods.length;i++){
                    list+=getDataHtml(listGoods[i]);
                }
                $("#goods-ul").append(list);

                pageIndex++;
                isLoading=false;
                hui.endLoadMore(false);
                if(!hasNextPage){
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
                    list = '<p class="positionContent">没有更多了,搜下别的吧!</p>';

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
    var salesVolume = getSalesVolume(goodsProStandard);//起卖量
    console.info(salesVolume)
    if(salesVolume == null || salesVolume == 0){
        salesVolume = 1;
    }
    var costPrices;
    var _profit = data.discounts;//  赚多少/优惠多少价格
    //日供货量
    var actualPrice = data.actualPrice;//实际价格
    var comparativePrice = data.comparativePrice;//展示价格
    //标签集合
    var labelList = data.listLabel;
    var presellType = data.presellType;
    costPrices = _profit;
    var shop_id = data.seq == null ? 0 : data.seq;
    var supplier_id = data.supplierSeq == null ? 0 : data.supplierSeq;
    var list = '<li class="backGroundColorLI" style="position: relative;" data_id="'+data.goodsId+'" state="'+data.state+'" shop_id="'+shop_id+'" supplier_id="'+supplier_id+'" salesvolume_num="'+ salesVolume +'" >';
    list += "<img  class='goGoodsDetail' src='"+data.thumbnail+"' alt='' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>";
    if (data.yhq) {
        var type=getRoleType();
        if (type==1||type==2 ||!type ) {
            list+='<img style="height: 20px;width:40px;top: 2rem;left: 5.4rem; position: absolute" src="/localQuickPurchase/coupons/images/home_icon_label_1@2x.png" onclick=jumpCoupon()>';
        }else if ((type==3 || type==4)&& Coums<=100) {
            list+='<img style="height: 20px;width:40px;top: 2rem;left: 5.4rem; position: absolute" src="/localQuickPurchase/coupons/images/home_icon_label_1@2x.png" onclick=jumpCoupon()>'
        }else{
            list+=""
        }
    }
    list += "<div class='productInfo'>";

    if(presellType != null && presellType == 1) {
        var endTime = data.endTime;
        var date = Date.parse(new Date());
        if(endTime > date) {
            list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'><span style='color: red'>(预售商品)</span>"+data.goodsName+"</div>";
        } else {
            list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>"+data.goodsName+"</div>";
        }
    } else {
        list += "<div class='title goGoodsDetail' goodsid='"+data.goodsId+"' isActivityGoods = '"+isActivityGoods+"'>"+data.goodsName+"</div>";
    }
    list += "<p class='price'>";
    if(isActivityGoods && isActivityGoods == 1){
        list += "<span class='special'>特卖价:"+actualPrice.toFixed(2)+"</span>";
    }else{
        list += "<span class='special'>¥"+actualPrice.toFixed(2)+"</span>";
    }
    list += "<span class='text_line'>¥"+comparativePrice.toFixed(2)+"</span>";
    list += "</p>";
    if (labelList && labelList.length > 0) {
        list += "<div class='label'>";
        for (var z = 0; z < labelList.length && z < 2; z++) {
            var colour = labelList[z].colour;
            var labelValue = labelList[z].labelValue;
            list += "<p class='hotSaleGoods' style='color:"+ colour +";border:1px solid "+ colour +"'>"+labelValue+"</p>";
        }
        if((isRoleAgent() || isRoleDealer()) && costPrices > 0) {
            list += "<span class='commissionPrice'>佣金：¥"+cutPriceDown(costPrices)+"</span>";
        }
        list += "</div>";
    }
    list += "</div></li>";
    return list;
}
function jumpCoupon(){
    var oEvent = event;
    oEvent.cancelBubble = true;
    window.location.href="/localQuickPurchase/activity/baiye.html";
}

/**
 * 搜索，或返回上一级
 */
//绑定回车键
$("input[class='searchInput']").bind('keydown',function(event){
    if(event.keyCode == "13")
    {
        searchDetailClick();
    }
});
function searchDetailClick(){
    keyword=$(".searchInput").val();
    if(keyword) {
        if (genreId != null) {
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

/**
 * 清空搜索框内容
 */
hui('.header-delete').click(function(){
    $(".searchInput").val('');
});

/**
 * 返回上一级方法
 */
function goBack(){
    try{
        // 调app原生返回
        window.action.app_back();
    }catch(e){

    }
    setTimeout(function() {
        var RtSearch = getQueryString("RtSearch");
        if (RtSearch != null && RtSearch != "") {
            history.go(-3);
        } else {
            javascript:history.go(-1);
        }
    }, 200);
}

/**
 * 点击图片或商品文字进入商品详情
 */
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