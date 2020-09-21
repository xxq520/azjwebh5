//调手机原生去下载；
var u = navigator.userAgent;
var isappwebview = u.indexOf('app_webview') > -1;
var couponsArray;
var previousUrl = document.referrer;
function goHisBack(){
    if(previousUrl && previousUrl !="") {
        if(previousUrl.indexOf(document.domain) == -1){
            if(isappwebview){
                // 调app原生返回
                window.action.app_back();
            }else{
                window.location.href = "/localQuickPurchase/distributionVA/index";
            }
            return;
        }
        if(previousUrl.indexOf("login") != -1){
            history.go(-3);
            return;
        }
        if(previousUrl.indexOf("register.html") != -1){
            history.go(-4);
            return;
        }
        if(previousUrl.indexOf("baiye.html") != -1){
            history.back()
            return;
        }
        if(previousUrl.indexOf("distributionVA/goodsDetail") != -1){
            history.go(-1);
            return;
        }
        history.go(-1);
        return;
    }else{
        if(isappwebview){
            // 调app原生返回
            window.action.app_back();
            return;
        }
    }
    window.location.href = "/localQuickPurchase/distributionVA/index";
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
// 判断是否登录
function noLogin(){
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        setCookie("loginRetrunUrl",window.location.href);
        loginPage();
    });
}
var shareSeq = getQueryString("shareSeq");
if(shareSeq != null && shareSeq != "") {
    shareSeq = shareSeq.split("?")[0];
    setCookie("shareSeq", shareSeq, 1);
}
var _href = window.location.href;
var urlVal = _href;
if(seq != 0 && seq != ""){
    if(window.location.href.indexOf("shareSeq=")>-1){
        urlVal += seq;
    }else{
        if(window.location.href.indexOf("?")>-1){
            urlVal+= "&shareSeq=" + seq;
        }else{
            urlVal+= "?shareSeq=" + seq;
        }
    }
}
//点击分享按钮
$("body").on("click",".shareBtn",function() {
    if(!isLogin()){
        noLogin();
        return;
    }

    var title = "购买优惠券";
    //var disc = "爱之家购买365元劵，即返3650消费劵。爱之家购买99元劵，即返300消费劵。";
    var disc = "爱之家购买365元劵，即返1200消费劵。";
    shareGoodsPic = _href.substring(0,_href.indexOf("activity"))+"distributionApp/images/azj.png";
    appUrl = urlVal;
    // 商品二维码
    $(".ewmcode img").attr("src","/localQuickPurchase/shareQRCode/stringQRCode?urlVal=" + appUrl);
    $(".ewmcode").hide();
    $('.copyCode').show();
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        //点击分享
        share520Love(appUrl,title,disc,shareGoodsPic,'.share-content');
    } else{
        share520LoveWeb(appUrl,title,disc,shareGoodsPic,'.share-content');
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
});

// 复制链接
var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function() {
        var link = urlVal;
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
// 点击分享后弹出的背景层
$(".mask").click(function(){
    $(".sharebox").removeClass('active');
    $(".specBtn").hide();
    $(".numBox").hide();
    $(".ewmcode").hide();
    $(".mask").hide();
    $(".ewmcode").attr("value","0");
});
function selectItem(obj){
    $(obj).siblings().removeClass('active');
    $(obj).addClass("active");
    $(".contentImg div ").hide();
    $("."+$(obj).attr("id")).show();
    $(".orPrice").html($(obj).attr("money"));
    $(".statement-discount").html($(obj).attr("explain"));
}
function loadShare(){
    if(!isLogin()){
        return;
    }
    $.ajax({
        type : 'get',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/couponBaiYeAction/share',
        data : {'seq':seq},
        async : true,
        success : function(respone) {
            if(respone!= null && respone.code == 200 ){
                $(".shareBtn").css({'visibility': 'unset'})
                $(".makePosters").show();
            }
        },
        error:function(respone){

        }
    });
}
function makePosters(obj){
    if (!isLogin()) {
        noLogin();
        return;
    }
    var href = window.location.href;
    var id = $(".active").attr("id");
    var urlsub= href.substring(0,href.indexOf("localQuickPurchase/"))
    var urlstr= urlsub + "localQuickPurchase/activity/by.html";
    // 调app原生图片保存
    var  downImgParam= urlsub + "localQuickPurchase/couponBaiYeAction/posters"+"?seq="+seq+"&id="+id + "&url="+urlstr;
    if(isappwebview){
        window.action.downImg(downImgParam);
    }else{
        downLoadImg(downImgParam,"shareRecuit.png");
    }
}




function toPay(obj) {
    if(!isLogin()){
        noLogin();
        return;
    }
    if(shareSeq == null){
        shareSeq = 0;
    }
    if(isRoleAgent() || isRoleDealer()){
        var roleName = "";
        if(isRoleEAgent()){
            roleName = "企业代理商";
        }else if (isRoleAgent()){
            roleName = "代理商";
        }else if (isRoleEDealer()){
            roleName = "企业级经销商";
        }else if (isRoleDealer()){
            roleName = "经销商";
        }

        var couponMoney=$(".orPrice").html();
        var couponValue;
        for (var i = 0;i<couponsArray.length;i++){
            if(couponsArray[i].money==couponMoney){
                couponValue= couponsArray[i].title;
            }
        }
        console.log(couponValue);

        hui.confirm('尊贵的用户，您已经是爱之家商场的'+ roleName +'，请问是否继续购买爱之家的'+parseInt($(".orPrice").html())+'元送'+couponValue+'呢？', ['否','是'], function(){
            window.location.href ="/localQuickPurchase/couponBaiYeAction/buy?shareSeq="+shareSeq+"&seq="+seq+"&id="+$(".active").attr("id");
        });
    }else{
        window.location.href ="/localQuickPurchase/couponBaiYeAction/buy?shareSeq="+shareSeq+"&seq="+seq+"&id="+$(".active").attr("id");
    }
}

$(function(){
    $.ajax({
        type : 'get',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/couponBaiYeAction/query',
        data : {},
        async : true,
        success : function(respone) {
            if(respone!=null && respone.code == 200 && respone.data.length >0){
               var list = respone.data;
               var categoryMenuHTML = "";
               var contentImg = "";
                couponsArray=list;
                for(var i = 0; i < list.length; i++){
                    var id = list[i].id;
                    var name = list[i].title;
                    var clazz = '';
                    var imgStyle="style='display:none;'"
                    if(i == 0){
                        clazz = "active";
                        imgStyle ="";
                        $(".orPrice").html(list[i].money);
                        $(".statement-discount").html(list[i].explain);
                    }
                    categoryMenuHTML += "<div class='nav_Li swiper-slide "+ clazz +"' explain='"+ list[i].explain+"' money='"+ list[i].money+"' id='"+id+"' onclick='selectItem(this)'>"+name+"</div>";
                    contentImg +="<div class='"+id+"' "+imgStyle+"><img src='"+list[i].img+"'></div>";
                }
                $(".contentImg").html(contentImg);
                $(".plNavbar").html(categoryMenuHTML);
                // 滑动导航栏
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 2,
                    spaceBetween: 10,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }
        },
        error:function(respone){

        }
    });

    loadShare();
});