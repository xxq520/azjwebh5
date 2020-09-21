/*var text1 = "<ul style='text-align:left;padding-left:0.8rem;'>"+
    "<li style='list-style-type:disc;'>爱之家商城是一个与亲朋分享的货真价惠高品质网络商城，商城创建的初心是“为爱为家”。在本商场，您与亲朋都可以放心消费、开心分享。</li>"+
    "<li style='left;list-style-type:disc;'>您分享此链接给亲朋，亲朋登录本商城放心选购、省钱省心，由本商城确保商品货真价惠与售后保障。</li>"+
    "</ul>";*/

var distributorSeq = seq;
var privilegeMsgs = null;
var privilegeMsgList ;

//代理商跟经销商显示分享入口
if(isRoleAgent() || isRoleDealer()){
    $(".shareButton").removeClass("noting");
    //获取邀请按钮列表信息
    getShareButton();
}
// 获取个人资料信息
function initUserInfo() {
    $.ajax({
        url: '/localQuickPurchase/memberCenter/findUserInfo',
        type: 'GET',
        data: {
            seq: distributorSeq
        },
        async: true,
        dataType: 'json',
        success: function (result) {
            console.info(result);

            if(result.code == 200){
                initUser(result.data);
                //点击特群提示语
                privilegeMsgs = result.data.privilegeMsg;
                privilegeMsgList = result.data.privilegeMsgList;
            }
        },
        error: function (error) {
            hui.toast('网络错误!');
        }
    });
}


//用户升级经销商的升级方式
var choiceWayType = null;
//初始化用户的个人信息
initUserInfo();
function initUser(userInfoData){
    if(userInfoData == null){
        return;
    }
    if(userInfoData.show == 0){
        //用户不能升级的时候隐藏进度条
        hideUpgColumn();
    }
    //头像
    $("#userHeadImg").attr("src",getHeadImg(userInfoData.headImg));
    //名称
    $("#uname").html(userInfoData.userName);
    //角色升级提示
    //$("#upgradeMsg").html(userInfoData.upgradeMsg);
    judgeUserName(userInfoData.upgradeMsg);
    //升级进度条
    progressInit(userInfoData.schedule);
    choiceWayType = userInfoData.choiceWay;//分销商申请代理商的选择方式
}

function judgeUserName(upgMsg){
    if(upgMsg == null){
        return "";
    }
   var sindex = upgMsg.indexOf("@");
    if(sindex < 0){
        initUpgMsg(upgMsg,"");
        return "";
    }
    var upgMsgs = upgMsg.split("@");
    initUpgMsg(upgMsgs[0],upgMsgs[1]);
}

function initUpgMsg(upgName,upgMessage){
    $("#upgName").html(upgName);
    $("#upgMsg").html(upgMessage);
}

//个人头像为空时使用默认头像
function getHeadImg(headImg){
    if(headImg == null || headImg == ""){
        return "/localQuickPurchase/distributionApp/images/_logo.png";
    }
    return headImg;
}

//隐藏升级进度条跟升级提示
function hideUpgColumn(){
    $(".progressbox ").addClass("noShow");
    //$(".progressTitle ").addClass("noShow");
    //$(".progress").addClass("noShow");
}

//显示升级进度
function progressInit(progressNum){
    $(".progress").css("width",progressNum+"%");
   /* 动画显示
    var i = 0;
    var interval = setInterval(function(){
        if(progressNum != null && progressNum > 0){
            $(".progress").css("width",(++i)+"%");
        }
        if(i >= progressNum){
            clearInterval(interval);
        }
    },30);*/
}

/**
 * 对应的角色显示对应的文案
 */
function roleShow(){
    var roleName = "";
    var rolePrivilegeMsg = "";
    var showPrivilegeLine =  6.4555;
    if(isRoleVip()){
        $(".drpmanage").css("display","none");
        roleName = "VIP会员";
        rolePrivilegeMsg = "尊敬的VIP您拥有以下特权";
       // $(".mask2").find("div").html();
        $(".mask2").find("div p").eq(1).html("升级成为代理商");
    }else if(isRoleAgent()){
        if(isRoleEAgent()){
            roleName = "企业代理商";
            rolePrivilegeMsg = "尊敬的企业代理商您拥有以下特权";
        }else {
            roleName = "代理商";
            rolePrivilegeMsg = "尊敬的代理商您拥有以下特权";
        }
        showPrivilegeLine = 3.4555;
    }else if(isRoleDealer()){
        if(isRoleEDealer()){
            roleName = "企业级经销商";
            rolePrivilegeMsg = "尊敬的企业级经销商您拥有以下特权";
        }else {
            roleName = "尊享经销商";
            rolePrivilegeMsg = "尊敬的尊享经销商您拥有以下特权";
        }
        showPrivilegeLine = 0;
        $(".mask2").find("div").html("");
    }

    //显示角色身份
    $(".roleName").html(roleName);
    //显示角色特权
    $(".hasRight ").html(rolePrivilegeMsg);
    $(".maskimg").css("height",showPrivilegeLine+"rem");
}
//显示角色文案
roleShow();


var pageIndex = 1;
var pageSize = 10;
var memberColumnType = "";
var hasNext = true;
// 查询会员专享商品
function findMemberGoods(me) {
    if(!hasNext){
        return;
    }
    $.ajax({
        url: '/localQuickPurchase/memberCenter/findMemberGoods',
        type: 'post',
        data: {
           pageIndex:pageIndex,
           pageSize: pageSize,
           memberColumnType:memberColumnType
        },
        async: true,
        dataType: 'json',
        success: function (result) {
            //初始化会员专享商品
            if(result.code == 200){
                //$(".pro-list").append(initGoodsList(result.data));mescroll
                $("#refreshContainer").append(initGoodsList(result.data));
                me.resetload()
            }else{
                hasNext = false;
            }
        },
        error: function (error) {
            hui.toast('网络错误!');
        }
    });
}

function initGoodsList(goodsList){
    var html = "";
    for(var i = 0 ; i < goodsList.length ; i++){
        html += getGoodsHtml(goodsList[i]);
    }
   // isFristPage();
    pageIndex ++;
    if(goodsList.length == 0){
        //$("#noting").css("display","block");
        hasNext = false;
    }
    return html;
}


//创建商品html
function getGoodsHtml(goods){
    if(goods == null){
        return "";
    }
    var goodsName = goods.goodsName;
    var goodsImgPath = goods.listGoodsImg[0].goodsImgPath;
    var goodsProStandard = goods.goodsProStandard;
    var goodsId = goods.goodsId;
    var distributionPrice = goodsProStandard[0].distributionPrice;
    var goodsPrice = goodsProStandard[0].goodsPrice ;
    var html ='<li class="pro-item"  goodsId ='+goodsId+'>'
    html +='<div class="pro-img"><img src="'+goodsImgPath+'"/></div>';
    html +='<p class="pro-title limit2 fs24">'+goodsName+'</p>';
    html +='<p class="priceBox">';
    html += '<span class="price">';
    html +='<span class="newPrice fs28 rclor">￥'+distributionPrice+'</span>';
    html +='<span class="oldPrice fs22 c99">￥'+goodsPrice+'</span>';
    html +='</span>';
    html +='<span class="goBuy fs22 wclor">立即抢购</span>';
    html +='</p>';
    html +='</li>';
    return html;
}

//分享
function share520(isappwebview,urlVal,shareTileleMsg,shareTitle){
    if(isappwebview){
        //点击分享
        share520Love(urlVal,shareTitle,shareTileleMsg,'','.share-content');
    } else {
        share520LoveWeb(urlVal,shareTitle,shareTileleMsg,'','.share-content');
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
    //anyHiddent();
}


/*shareType分享类型，根据类型获取对应的分享链接*/
function shareQRCode(shareType) {
    //var distributorSeq = getCookie("seq");
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : '/localQuickPurchase/shareQRCode/storeVIPUrl',
        data : {
            distributorSeq : distributorSeq,
            state : shareType
        },
        async : false,
        success : function(data) {
            url = data.data.URL;
        },
    });
    return url;
}
var buttonType;
//二维码点击事件
$(".shopCode").click(function () {
    getQRCodeURL(buttonType);
    var ewmcodeVal = $(".shopCode").attr("value");
    if(ewmcodeVal == "1"){
        $(".ewmcode").hide();
        $(".shopCode").attr("value","0");
    } else {
        $(".ewmcode").show();
        $(".shopCode").attr("value","1");
    }
});
//二维码,根据对应的type获取对应的二维码
function  getQRCodeURL(type){
    if($(".ewmcode").length == 0){
        var weixinCode = '<div class="ewmcode" value="0" style="display:none;"><img src=""/></div>';
        $("body").append(weixinCode);
    }
    // 生成二维码 distributorSeq
    var qrCodeURL = "";
    if(type == 1){
        qrCodeURL = "/localQuickPurchase/shareQRCode/storeVIPCode/"+distributorSeq;
    } else if(type == 2){
        qrCodeURL = "/localQuickPurchase/dApplicationAction/disQrcode/"+seq;
    } else if(type == 6) {
        qrCodeURL = "/localQuickPurchase/shareQRCode/inviteEnterprise/"+distributorSeq;
    }else if(type == 8){
        qrCodeURL = "/localQuickPurchase/shareQRCode/storeAgentCode/"+distributorSeq;
    }else if(type == 9){
        qrCodeURL = "/localQuickPurchase/shareQRCode/networkOwner/"+distributorSeq;
    }else if(type == 10){
        qrCodeURL = "/localQuickPurchase/shareQRCode/wholesaler/"+distributorSeq;
    }
    $(".ewmcode img").attr("src",qrCodeURL);
}

//显示闭邀请按钮弹窗
$(".shareButton").click(function(){
   $(".share-mask").show();
});

//进入员工管理
$(".drpmanage").click(function(){
    window.location.href="/localQuickPurchase/distributionVA/distributionDrpsub";
});

//我的二维码
$("#mcEwn").click(function(){
    location.href = "/localQuickPurchase/distributionVA/personal/meQRCode?redirectType=1";
});

//关闭邀请按钮弹窗
$(".close").click(function(){
    closePopup();
});

function closePopup(){
    $(".share-mask").hide();
    $("html,body").css("overflow","visible");
}

//
$(document).on("click",".pro-item",function(){
    var goodsId = $(this).attr("goodsId");
    if(seq == null || seq == 0) {
        seq = 0;
    }
    window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});

/*====================*/
// 复制链接
/*var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function(){
        return shareQRCode(shareType);
    }
});*/
var shareUrl;
var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function(){
        return shareUrl ;
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

$(document).on("click","#hui-mask",function(){
    hiddend();
});

function hiddend(){
    $("html,body").css("overflow","visible");
    hui.dialogClose();
    $(".share-block").slideUp(200);
    $(".ewmcode").hide();
}

//跳转消息盒子
$(".personal_icon_message").click(function(){
   location.href = "/localQuickPurchase/distributionVA/messageThree";
});

//加盟佣金跳转
$("#upgradeIncome").click(function(){
    location.href = "/localQuickPurchase/distributionVA/upgradeIncome";
});

//下拉加载数据
$('.brandHotSaleGoods').dropload({
    scrollArea : window,
    loadDownFn : function(me){
        findMemberGoods(me);
    }
});


$('.right-item').each(function(i,item){
    $(item).on('click',function(){
        $(".privilege").eq(i).html(privilegeMsgList[i]);
        if(i < 5){
            $('.item1 p').eq(i).show().siblings().hide();
            $('.item2 p').hide();
            $('.item3 p').hide();
        }else if(i>=5&&i< 10){
            $('.item2 p').eq(i-5).show().siblings().hide();
            $('.item1 p').hide();
            $('.item3 p').hide();
        }else if(i>=10&&i<14){
            $('.item3 p').eq(i-10).show().siblings().hide();
            $('.item1 p').hide();
            $('.item2 p').hide();
        }
    })
})
$('.item p').each(function(i,item){
    $(item).click(function(){
        $(this).hide();
    })
});

var shareButtonList = {};

//获取邀请按钮列表信息
function getShareButton(){
    $.ajax({
        url: '/localQuickPurchase/memberCenter/findInviteMsg',
        type: 'post',
        data: {
            seq: distributorSeq
        },
        async: true,
        dataType: 'json',
        success: function (result) {
            console.info(result);

            if(result.code == 200){
                shareButtonList = result.data;
                $(".shareButtonUl").append(initShareButton());
            }
        },
        error: function (error) {
            hui.toast('网络错误!');
        }
    });
}


//渲染邀请按钮列表
function initShareButton(){
    var html = "";
    for(var i = 0 ; i < shareButtonList.length; i++){
        html += getShareButtonHtml(shareButtonList[i]);
    }
    return html;
}

function getShareButtonHtml(shareButton){
    var pictureUrl = shareButton.pictureUrl;
    var smallTitle = shareButton.smallTitle;
    var bigTitle = shareButton.bigTitle;
    var onOff = shareButton.onOff;
    var shareId = shareButton.number;
    var html ='<li class="share-item shareinvite" onclick="shareinvite(this)" onOff='+onOff+' shareId='+shareId+'>';
    html += '<div class="pic"><img src="'+pictureUrl+'"/></div>';
    html +=  '<div class="share-text">';
    html +=   '<p class="fs28 fw700">'+smallTitle+'</p>';
    html +=   '<p class="fs24">'+bigTitle+'</p>';
    html +=  '</div>';
    html +=   '</li>';
    return html;
}

//点击分享按钮事件
//$(document).on("click",".shareinvite",function(){
function shareinvite(obj){
    var $this = $(obj);
    var onOff = $this.attr("onOff");
    var shareId = $this.attr("shareId");
    if(onOff == "1"){
        //弹出对应的文案
        hui.alert(alertAgentMsg(shareId));
        return false;
    }
    //选中的按钮对象
    var shareButton = getButtonForShareId(shareId);
    //点击提示文案
    var tipText = shareButton.hintMsg;
    //获取分享文本
    var shareTileleMsg = shareButton.shareText;
    //获取分享标题
    var shareTitle = shareButton.shareTitle;
    var urlVal = shareButton.jumpUrl;//获取分享链接参数
    shareUrl = urlVal;
    // 根据shareId 赋值 buttonType ，生成二维码用
    setShopCodeType(shareId);
    getQRCodeURL(buttonType);
    $("#vip_context").html("");
    $("html,body").css("overflow","hidden");
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1;
    hui.confirm(tipText,['取消','立即分享'],function(){
        share520(isappwebview,urlVal,shareTileleMsg,shareTitle);
    });
    // hui.alert("12313");
    closePopup();
};

//创建点击分分享按钮的提示语
function checkMsg(hintMsg){
    var checkMsgHml = "<ul style='text-align:left;padding-left:0.8rem;'>";
    for(var i = 0 ; i < hintMsg.length ; i++){
        checkMsgHml += "<li style='list-style-type:disc;'>"+hintMsg[i]+"</li>";
    }
    checkMsgHml += "</ul>";
    return checkMsgHml;
}


//邀请按钮不可用弹出相应的信息
function alertAgentMsg(shareId){
   return getButtonForShareId(shareId).agentHintMsg;
}

//根据shareId获取对应的邀请按钮信息
function getButtonForShareId(shareId){
    for(var i = 0 ; i < shareButtonList.length ; i++){
        var number = shareButtonList[i].number;
        if(number == shareId){
            return shareButtonList[i];
        }
    }
    return null;
}


function setShopCodeType(number){
    if(number == 1){
        buttonType = 1;
    }else if(number == 2){
        buttonType = 9;
    }else if(number == 3){
        buttonType = 8;
    }else if(number == 4){
        buttonType = 6;
    }else if(number == 5){
        buttonType = 10
    }
}