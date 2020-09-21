var receiveSeq = getQueryString("receiveSeq");
var receiveName = getQueryString("receiveName");
var giftSeq = getQueryString("giftSeq");
var giveTitle = getQueryString("giveTitle");
var receiveTitle = getQueryString("receiveTitle");
var nickName=getCookie("nickName");
/*别人赠送的消费券金额*/
var giveVoucherSum = 0.0;
/*自己本人消费券金额*/
var oneselfVoucher = 0.0;
/*选择赠送类型 1:零钱 2:消费券*/
var giftType;
/*是否可以选择赠送消费券*/
var ifGive = false;

$(".name").html(receiveName);
$(function () {
    var initDate = {
        "init":function(){//初始化查询零钱
            var param = {"giftSeq":giftSeq,"receiveSeq":receiveSeq}
            $.ajax({
                type:'GET',
                contentType:'application/json;charset=utf-8',
                url:'/localQuickPurchase/give/getBalanceAndDeduction',
                data:param,
                async:false,
                dataType:'JSON',
                success:function(data){
                    var code = data.code;
                    if (code == "1000"){
                        $('.remy').html(data.data.balance);
                        /*判断是否可以送消费券*/
                        ifGive = data.data.ifGive;
                        if (ifGive){
                            var stringObjectMap = data.data.stringObjectMap;
                            if (null != stringObjectMap) {
                                $('.voucher').show();
                                /*可赠送零钱*/
                                var complimentaryBalance = stringObjectMap.complimentaryBalance;
                                /*消费券总金额*/
                                var oneselfVoucher = stringObjectMap.balance;
                                /*消费券不可赠送金额*/
                                var lockBalance = (oneselfVoucher - complimentaryBalance).toFixed(2);
                                $('.deduction').html(complimentaryBalance);
                                $('.explain').html("(自己拥有消费券总金额:"+oneselfVoucher+",不能赠送消费券金额:"+lockBalance+")");
                                $('.tips').html("赠送后直接从您的零钱或消费券中扣取对应的金额")
                            }
                        }
                    }else{
                        hui.alert("查询零钱失败！")
                    }
                }
            })
        },
        "pushGiftCoupons":function (giftSeq,receiveSeq,giftPrice,textContent,giftType) {//赠送优惠券
            var param = {"giftSeq":giftSeq,"receiveSeq":receiveSeq,"giftPrice":giftPrice,"giftType":giftType,"giveVoucherSum":giveVoucherSum,"oneselfVoucher":oneselfVoucher}
            $.ajax({
                type:'POST',
                contentType:'application/json;charset=utf-8',
                url:'/localQuickPurchase/couponCardBagAction/pushGift',
                data:JSON.stringify(param),
                async:false,
                dataType:'JSON',
                success:function(data){
                    var code = data.code;
                    console.log("赠送优惠券返回结果:"+data)
                    $(".hint-name").html(receiveName)
                    var markedWords = giftPrice+"元的红包";
                    if (giftType == 2) {
                        markedWords = giftPrice+"元的消费券";
                    }
                    $(".hint-price").html(markedWords)
                    initDate.init();
                    $("input[name=mm]").val();
                    if (code == "1000"){
                        initDate.presentPeram(data,giftPrice,textContent);
                        $("#hint").show();
                    }else{
                        hui.alert(data.data);
                        return;
                    }
                }
            })
        },
        "couponPresentation":function (giftRecord) {//保存赠送优惠券记录
            $.ajax({
                type:'POST',
                contentType:'application/json;charset=utf-8',
                url:'/localQuickPurchase/give/insert',
                data:JSON.stringify(giftRecord),
                async:true,
                dataType:'JSON',
                success:function(data){
                    var code = data.code;
                    console.log("保存优惠券信息返回结果:"+data);
                    if (code != "1000"){
                        hui.alert("保存赠送优惠券记录失败！")
                    }
                }
            })
        },
        "queryCoupons":function (giftSeq,receiveSeq) {//回赠  从记录获取数据
            var param = {"giftSeq":receiveSeq,"receiveSeq":giftSeq}
            $.ajax({
                type:'GET',
                contentType:'application/json;charset=utf-8',
                url:'/localQuickPurchase/give/findOne',
                data:param,
                async:true,
                dataType:'JSON',
                success:function(data){
                    var code = data.code;
                    console.log("保存优惠券信息返回结果:"+data);
                    if (code == "1000"){
                        nickName = data.data.receiveName;
                        receiveName = data.data.giftName;
                        giveTitle = data.data.receiveTitle;
                        receiveTitle = data.data.giveTitle;
                        $(".name").html(receiveName);
                    }
                }
            })
        },
        "presentPeram":function (data,giftPrice,textContent) {
            var couponsId = data.data.result;
            var validityData;
            /*如果是消费券需要把id和有效期截开*/
            if (giftType == 2) {
                var result = couponsId.split("-")
                couponsId = result[0];
                validityData = result[1];
            }
            var giftRecord = {
                "couponsId" : couponsId,
                "giftSeq" : giftSeq,
                "giftType" : giftType,
                "giftName" : nickName,
                "receiveSeq" : receiveSeq,
                "receiveName" : receiveName,
                "validityData" : validityData,
                "giftPrice" : giftPrice,
                "giveTitle" : giveTitle,
                "receiveTitle" : receiveTitle,
                "leaveWord" : textContent,
                "orderno" : data.data.orderno
            }
            console.log(giftRecord);
            //保存赠送优惠券记录
            initDate.couponPresentation(giftRecord);
        }
    }
    if (receiveName == null || receiveName == undefined){
        //初始化
        initDate.queryCoupons(giftSeq,receiveSeq)
    }
    //初始化查询零钱
    initDate.init()

    /**
     * 赠送优惠券的点击事件
     */
    var bodyHeight=parseFloat($('body').css('height'))+parseFloat($('#hui-footer').css('height'))+10;
    $('.scancode').css('height',bodyHeight+"px");
    $('body').on('click','#btn1',function () {
        if (!hui('#cponds').val()) {
            hui.alert('红包金额不能为空')
        }else{
            if (ifGive) {
                $(".scancode").show();
            } else {
                /*默认选择零钱*/
                giftType = 1;
                confirmGive();
            }
        }
    });
    $('body').on('click', '#commit', function() {
        var s;
        $('.hui-list').children("li").each(function(i) {
            if($(this).attr("data-type") == 0) {
                s = 0;
            }
        });
        if(s == null) {
            hui.toast('选择赠送金额类型');
            return;
        }
        $(".scancode").hide();
        confirmGive();
    });
    function confirmGive() {
        var giftPrice = 0;
        if (giftType == 1) {
            giftPrice = Number($('.remy').html());
        }else if (giftType == 2) {
            giftPrice = Number($('.deduction').html());
        }
        var price = Number($('#cponds').val());

        var bool = checkNum();
        if (!bool){
            hui.alert("赠送金额只能输入数字！")
            return;
        }
        if (price > giftPrice){
            hui.alert("零钱不足")
            $("input[name=mm]").val(giftPrice);
            return;
        }
        if (price <= 0){
            hui.alert("赠送金额应大于0")
            return;
        }
        var reg = /^(([1-9]\d*)|\d)(\.\d{1,2})?$/;
        var reg = new RegExp(reg)
        if (!reg.test(price)) {
            hui.alert("赠送金额最小单位为分!")
            return;
        }

        /*如果赠送的消费券金额大于别人赠送的消费券金额，判断扣除别人赠送的消费券金额后是否大于自己消费券金额的一半*/
        // if (giftType == 2) {
        //     if (!verifyGiftPrice(giftPrice,price,giveVoucherSum,oneselfVoucher)) {
        //         hui.alert("赠送的金额扣除被赠送的消费券金额后不能大于自己的消费券金额一半");
        //         return
        //     }
        // }
        /*留言*/
        var textContent = $('#textContent').val();
        if(textContent == null || textContent ==""){
            textContent = "您的表现很出色，请再接再厉!"
        }
        if(textContent.length > 15){
            hui.alert("留言不能超过15个字,请重新填写！")
            return;
        }
        //赠送红包
        initDate.pushGiftCoupons(giftSeq,receiveSeq,price,textContent,giftType);
    }
})

/**
 * 查看赠送记录跳转
 */
function giveRecord() {
    if (giftSeq != null){
        window.location.href = "/localQuickPurchase/coupons/html/giveRecord.html?giftSeq="+giftSeq;
    }
}

/**
 * 赠送成功后跳转
 */
function successJump() {
    var  _thisURl=document.referrer;
    if (_thisURl.indexOf("earnings")>0) {
        hui.back();
    }else if(isRoleAgent() || isRoleDealer()){
        window.location.href = "/localQuickPurchase/distributionVA/distributionDrpsub";
    }else {
        personalCenter();
    }
}

/**
 * 检查赠送金额是否合法
 * @returns {boolean}
 */
function checkNum(){
    var patrn = /^\d+(\.\d+)?$/;
    var result = true;
    $("input[type=text]").each(function () {
        if (!patrn.exec(this.value)) {
            result = false;
        }
    })
    return result;
}
/**
 * 如果赠送的消费券金额大于别人赠送的消费券金额，判断扣除别人赠送的消费券金额后是否大于自己消费券金额的一半
 * giftPrice:有效总金额
 * price:赠送金额
 * giveVoucherSum:别人赠送金额
 * oneselfVoucher:自己拥有金额
 */
function verifyGiftPrice(giftPrice, price, giveVoucherSum, oneselfVoucher) {
    /*扣除别人赠送的消费券金额*/
    var residueGiveVoucher = price - giveVoucherSum;
    /*自己拥有的消费券的一半金额*/
    var oneselfVoucher = oneselfVoucher * 0.5;
    if (residueGiveVoucher <= 0.0) {
        return true;
    }

    if (residueGiveVoucher < oneselfVoucher) {
        return true;
    }
    return false;
}
//返回个人中心页面
function backPersonalCenter(){
    // 部分原始app 返回原生界面
    try{
        //app 首页返回链接
        window.action.app_back();
    }catch (e) {
    }
    var  _thisURl=document.referrer;
    if(_thisURl.indexOf("distributionVA") > 0 || _thisURl.indexOf("earnings") > 0){
        hui.back();
    }else{
        personalCenter();
    }
}

$('body').on('click','.set-goods-3-title img',function(){
    $(".scancode").hide();
});
$('body').on('click','.set-goods-3-bottom .set-button-left',function(){
    $(".scancode").hide();
});
function choiceType(ele){
    var data=$(ele).attr("data-type");
    var $img = $(ele).find("img");
    console.info($img.attr("src"));
    if(data == 1){
        giftType=$(ele).attr("data-id");
        $(ele).find("img").attr("src","/localQuickPurchase/distributionApp/images/check.png");
        $(ele).attr("data-type","0");
        $(ele).attr("data-type","0").siblings().find("img").attr("src","/localQuickPurchase/distributionApp/images/check2.png");
        $(ele).attr("data-type","0").siblings().attr("data-type","1");
    }else{
        $(ele).find("img").attr("src","/localQuickPurchase/distributionApp/images/check2.png");
        $(ele).attr("data-type","1");
    }
};
