var pageIndex = 0;
//点击分类菜单切换
var columnName =""

var urlVal,appUrl,shareGoodsPic,goodsId,goodsName;
$(function () {
    //延时一秒,模拟联网
    setTimeout(function () {
        // .yh   满减优惠
        $.ajax({
            url:"/localQuickPurchase/selectionGoods/v2/actityColumn",
            type:"GET",
            dataType:"json",
            data:{
                'actityType': 1
            },
            success:function(res){
                if(res.code != 200) return;
                var categoryMenuHTML = "";
                if(res.data){
                    var list = res.data;
                    console.log(list);
                    for(var i = 0; i < list.length; i++){
                        var id = list[i].id;
                        var name = list[i].moduleName;
                        var clazz = '';
                        if(i == 0){
                            clazz = "active";
                            columnName = name;
                            loadMore();
                        }
                        categoryMenuHTML += "<div class='nav_Li swiper-slide "+ clazz +"' id='"+id+"' onclick='loadGoods(this)'>"+name+"</div>";
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
            }
        })
    }, 1000)
    $.ajax({
        type: 'GET',
        url: '/localQuickPurchase/sgMongoAction/seckillField',
        dataType: 'json',
        success:function(data){
            var dataInfo = data.data;
            if (dataInfo != null && dataInfo.length>0){
                var rushToBuyText = dataInfo[0].rushToBuyText;
                var seckillFieldEndTime = dataInfo[0].seckillFieldEndTime;
                $('.countdownTimeText').html(rushToBuyText);
                $(".haveData").show();
                countdown(seckillFieldEndTime);
            }
        }
    })

})
function loadGoods(obj){
    $(obj).siblings().removeClass('active');
    $(obj).addClass("active");
    keyword = null;
    pageIndex = 0;
    $(".productDet").html("");
    columnName = $(obj).text()
    loadMore();
}
/**
 * 加载更多
 */
function loadMore(){
    $('.productDet').dropload({
        scrollArea : window,
        domDown : {
            domClass   : 'dropload-down',
            domNoData : '<p class="dropload-refresh">↑下拉加载更多</p>',
            domRefresh    : '',
            domLoad  : '<p class="dropload-noData">没有更多了...</p>'
        },
        //下拉加载方法
        loadDownFn : function(me){
            pageIndex++;
            $.ajax({
                type : 'post',
                dataType : 'json',
                contentType: "application/json;charset=utf-8",
                url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
                data : JSON.stringify({
                    'columnName': columnName,
                    'pageIndex' : pageIndex,
                    'pageSize' : 10
                }),
                async : true,
                success : function(respone) {
                    if(respone!=null && respone.code == 200 && respone.data.length >0){
                        setListData(respone.data);
                        me.resetload();
                    }else{
                        me.lock();
                        me.noData();
                    }
                }
            });
        }
    });
}
/*设置列表数据*/
function setListData(commodity) {
    var html = "";
    if (commodity != null && commodity.length>0){
        for (var i = 0; i < commodity.length; i++) {
            var goodsName = commodity[i].goodsName;//商品名字
            var goodsImg = commodity[i].thumbnail;//商品图片
            var goodsId = commodity[i].goodsId;//商品ID
            var goodsProStandard = commodity[i].goodsProStandard;
            var sellPercentage = commodity[i].sellPercentage;//已抢百分比
            if(!sellPercentage){
                sellPercentage = 0;
            }
            //var totalPseudoSales = commodity[i].totalPseudoSales;//已抢总数量
            var actualPrice = commodity[i].actualPrice;//已抢总数量
            var comparativePrice = commodity[i].comparativePrice;//已抢总数量
            //var distributionPrice = goodsProStandard[0].distributionPrice;//分销价
            var goodsPrice = goodsProStandard[0].goodsPrice;//商品原价
            var seckillPrice = goodsProStandard[0].seckillPrice;//秒杀价
            //var seckillUnivalence = goodsProStandard[0].seckillUnivalence;//秒杀出厂单价
            //var sellActivityQuantity = goodsProStandard[0].sellActivityQuantity;//已抢件数
            var spce = getGoodsProStandardSpecs(goodsProStandard[0]);
            var discount = getDiscount(seckillPrice,goodsPrice);
            html +='<li num="'+sellPercentage+'">';
            html +='<div class="img_box">';
            html +='<img src="'+goodsImg+'" num="'+goodsId+'" onclick="robberyNow(this)" alt="">';
            html +='<i>'+discount+'折</i>';
            html +='<i class="hg_bg"></i>';
            html +='</div>';
            html +='<div class="product_info">';
            html +='<p>'+goodsName+'</p>';
           /* html +='<div class="items">';
            <!-- 进度条 -->
            html +='<div class="hui-progress" id="progress'+i+'">';
            html +='<i>'+sellPercentage+'%</i>';
            html +='<span></span>';
            html +='</div>';
            html +='<p class="count">已抢<span>'+totalPseudoSales+'</span>件</p>';
            html +='</div>';*/
            html +='<div class="items">';
            html +='<div  id="progress'+i+'">';
            html +='<p>规格: '+ spce +'</p>';
            html +='</div>';
            html +='</div>';
            html +='<div class="items">';
            html +='<div class="price">';
            html +='<p class="normal">￥'+comparativePrice+'</p>';
            html +='<p class="special">￥'+actualPrice+'</p>';
            html +='</div>';
            html +='<div class="btn_box">';
            html +='<button class="shareBtn" id="'+goodsId+'" name="'+goodsName+'"><i class="share_icon"></i>分享</button>';
            html +='<button class="buyBtn" id="'+goodsId+'" onclick="robberyNow(this)">马上抢</button>';
            html +='</div>';
            html +='</div>';
            html +='</div>';
            html +='</li>';
        }
        $(".dropload-down").before(html);
    }
}
//点击分享按钮
$("body").on("click",".shareBtn",function() {
    // 判断是否登录
    function noLogin(){
        hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
            setCookie("loginRetrunUrl",window.location.href);
            loginPage();
        });
    }
    if(!isLogin()){
        noLogin();
        return;
    }
    goodsId= $(this).attr("id");
    goodsName = $(this).attr("name");
    if (goodsId == null || goodsId == undefined){
        //展示二维码和复制链接
        $('.copyCode').show();
        // 商品二维码
        $(".ewmcode img").attr("src","/localQuickPurchase/sgMongoAction/fieldShare/"+seq);
        $(".ewmcode").hide();
        // 分享
        var _href = window.location.href;
        urlVal = _href;
        goodsName = "520惠购节";
        shareGoodsPic = _href.substring(0,_href.indexOf("activity"))+"distributionApp/images/azj.png";
        urlVal = urlVal+"&shareSeq="+seq;
        appUrl = urlVal;
        console.log("appurl:"+appUrl);
    }else{
        //展示二维码和复制链接
        $('.copyCode').show();
        //海报图片
        var href = window.location.href;
        appUrl = href + "?sharePic=1"+"&shareSeq="+seq;
        console.log("appurl:"+appUrl);
        var urlsub= href.substring(0,href.indexOf("activity/"));
        urlVal = urlsub + "s.html?shareSeq="+seq + "&goodsId="+goodsId+"&s=1";
        shareGoodsPic = urlsub + "shareQRCode/stringQRCode?urlVal=" + appUrl;
        // 商品二维码
        $(".ewmcode img").attr("src",shareGoodsPic);
        $(".ewmcode").hide();
    }
//判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        //点击分享
        share520Love(appUrl,'520惠购节',goodsName,shareGoodsPic,'.share-content');
    } else{
        share520LoveWeb(appUrl,'520惠购节',goodsName,shareGoodsPic,'.share-content');
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
});

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
$(".makePosters").click(function(){
    var href = window.location.href;
    var urlsub= href.substring(0,href.indexOf("activity"))
    var urlstr= urlsub + "distributionVA/seckill/sgDetail?goodsId="+goodsId+"&checkShare=1&shareSeq="+seq+"&distributorSeq="+seq;
    //调手机原生去下载；
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        // 调app原生图片保存
        var  downImgParam= urlsub + "sgMongoAction/makePostersIO"+"?seq="+seq+"&goodsId="+goodsId + "&url="+urlstr;
        window.action.downImg(downImgParam);
    }else{
        downLoadImg("/localQuickPurchase/sgMongoAction/makePostersIO"+"?seq="+seq+"&goodsId="+goodsId + "&url="+urlstr,"shareRecuit.png");
    }
});
/**
 * 获取商品折扣
 * @param seckillPrice
 * @param distributionPrice
 * @returns {*}
 */
function getDiscount(seckillPrice,goodsPrice){
    var discount = numMulti(numDiv(seckillPrice, goodsPrice), 10);
    discount = getnum(discount);
    return discount;
}

/**
 * 处理折扣小数点（直接截取），只保留一位
 * @param discount
 * @returns {string}
 */
function getnum(discount){
    discount = parseFloat(discount).toFixed(3);
    //先把数据转成字符串
    var priceStr = discount.toString();
    //确定小数在第几位
    var index = priceStr.lastIndexOf(".");
    //把小数点后几位去掉
    var priceNew=priceStr.slice(0,index+2);
    //返回只舍不入的结果
    return priceNew;
}
// 点击分享后弹出的背景层
$(".mask").click(function(){
    $(".sharebox").removeClass('active');
    $(".specBtn").hide();
    $(".numBox").hide();
    $(".ewmcode").hide();
    $(".mask").hide();
    $(".ewmcode").attr("value","0");
});