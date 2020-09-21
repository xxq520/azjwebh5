/*商品goodsCode集合*/
var goodsCodeList = null;
/*供应商seq*/
var supplierSeqList = null;

// 点击隐藏
$('.couponBox div.cloes').click(function(){

    $('div.couponBox').animate({bottom:'-80%'},500,function(){
        //    console.log($(this));
        //    $(this).parent('div.couponModal').hide();
    });
    $('.couponModal').css("top","100%");
    $('.couponModal').hide();
    /*商品集合*/
    goodsCodeList = null;
    /*供应商seq*/
    supplierSeqList = null;

})

/** 点击优惠劵*/
$('body').on('click','.coupon',function () {
    $('div.couponBox').animate({bottom:'0'},500);
    $('div.couponModal').css("top",'0');
    $('div.couponModal').show();
    var codeList = $(this).attr("data-codeList").split(",");
    goodsCodeList = new Array();
    for (var i=0; i<codeList.length; i++) {
        goodsCodeList[i] = codeList[i];
    }
    var supplierSeqListData = $(this).attr("data-supplierSeqList").split(",");
    supplierSeqList = new Array();
    for (var i=0; i<supplierSeqListData.length; i++) {
        supplierSeqList[i] = supplierSeqListData[i];
    }
    getStatyAndMayCoupon(goodsCodeList,supplierSeqList);
})


/**获取用户可领取和已经领取的优惠劵*/
function getStatyAndMayCoupon(codeList,supplierSeqList){
    $.ajax({
        type:'post',
        contentType: "application/json;charset=utf-8",
        url:'/localQuickPurchase/couponCardBagAction/getStatyAndMayCoupon',
        dataType:"json",
        data:JSON.stringify({"userSeq" : getUserSeq(),"supplierSeqList":supplierSeqList,"codeList" : codeList,"pageSize" : 50}),
        async:false,
        success:function (data) {
            var code = data.code;
            if (code == 200){
                $('.hascoupon').empty();
                $('.received').empty();
                $('.nothing').hide();
                $('.couponModal .couponBox .received').css('padding-bottom','2.8889rem');
                /*可领取优惠劵*/
                var mayCoupon = data.data.mayCoupon;
                /*已领取优惠劵*/
                var alreadyCoupon = data.data.alreadyCoupon;
                if ((mayCoupon != null && mayCoupon.length > 0) || (alreadyCoupon != null && alreadyCoupon.length > 0)){
                    var mayHtml = '';
                    if (mayCoupon != null && mayCoupon.length > 0) {
                        mayHtml = getCouponData(mayCoupon,1);
                    }else{
                        mayHtml = getNoCoupon();
                    }
                    $('.hascoupon').append(mayHtml);
                    var alraadyHtml = '';
                    if (alreadyCoupon != null && alreadyCoupon.length > 0 ){
                        alraadyHtml = getCouponData(alreadyCoupon,2);
                    }
                    $('.received').append(alraadyHtml);
                }else{
                    $('.nothing').show();
                    $('.couponModal .couponBox .received').css('padding-bottom','0rem');
                }
            } else {
                $('.nothing').show();
                $('.couponModal .couponBox .received').css('padding-bottom','0rem');
            }
        }
    });
}


function getCouponData(coupon,type) {
    var title = '可领取优惠券';
    if (type == 2){
        title = '已领取优惠劵';
    }
    var html = '';
    html += '<h4 class="title">'+title+'</h4>';
    html += '<ul class="couponList list">';
    for (var i = 0; i < coupon.length ; i++) {
        html += '<li>';
        html += '<div class="coupons">';
        html += '<p class="title">优惠券</p>';
        html += '<span class="line"></span>';
        html += '<div>';
        //满减
        if(coupon[i].couponsType == 1) {
            html += '<p class="price">￥<em>'+coupon[i].amtFullReduce+'</em></p>';
            //立减
        }else if(coupon[i].couponsType == 2){
            html += '<p class="price">￥<em>'+coupon[i].amtSub+'</em></p>';
            //折扣
        }else if(coupon[i].couponsType == 3){
            html += '<p class="price"><em>'+coupon[i].amtDiscount / 10+'折</em></p>';
        }
        html += '<p class="text">'+coupon[i].couponsTypeDesc+'</p>';
        html += '</div>';
        html += '</div>';
        html += '<div class="explain">';
        if (type == 1){
            html += '<p>'+coupon[i].name+'</p>';
        } else {
            html += '<p>'+coupon[i].couponsName+'</p>';
        }
        html += '<div>';
        if (type == 1){
            html += '<p>'+formatDateStr(coupon[i].sendTimeStartStr)+'-'+formatDateStr(coupon[i].sendTimeEndStr)+'</p>';
        }else{
            html += '<p>'+formatDateStr(coupon[i].valiDayStart)+'-'+formatDateStr(coupon[i].valiDayEnd)+'</p>';
        }
        if (type == 1){
            html += '<span class="btn" data-couponsId="'+coupon[i].couponsId+'" data-actBatchNo="'+coupon[i].actBatchNo+'">点击领取</span>';
        }
        html += '</div>';
        html += '</li>';
    }
    return html;
}

function getNoCoupon() {
    var html = '';
    html += '<div class="noCoupon isHide">';
    html += '<div class="imgBox">';
    html += '<img src="/localQuickPurchase/carCoupon/images/icon_2.png" alt=""/>';
    html += '</div>';
    html += '<p>暂无优惠券可领取</p>';
    html += '</div>';
    return html;
}

/**
 * 领取优惠劵
 * */
$('body').on('click','.btn',function () {
    var couponsId = $(this).attr("data-couponsId");
    var actBatchNo =  $(this).attr("data-actBatchNo");
    var bool = getCoupon(couponsId,actBatchNo);
    if (bool){
        Dialog.init('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;优惠劵领取成功,'+'<br>'+'感谢您的参与,祝您购物愉快!',800);
        getStatyAndMayCoupon(goodsCodeList,supplierSeqList);
    }else{
        Dialog.init("优惠劵领取异常,请稍后再试!",800);
    }
});






