var distributorType = distributorType;
var seq = seq;
var orderno = getQueryString("orderno");
var isConsumptionOrder = getQueryString("isConsumptionOrder");
var totalAmmount = 0;
var supplierSeq = 0;
var sku  = getQueryString("sku");
var partialRefund  = getQueryString("partialRefund");
$(function(){
    var param = {"seq":seq,"userType":distributorType,"orderno":orderno};
    $.ajax({
        type : 'GET',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/dOrders/findDetail',
        data :{"seq":param.seq,"userType":param.userType,"orderno":param.orderno,"from":"h5"},
        success : function(data){
            var order = data.data.dOrders;
            totalAmmount = order.amount;
            var goodsDetails = order.listOrderDetails;//商品详情
            supplierSeq = order.supplierSeq;//供应商Seq
            var _html = "";
            for (var i = 0; i < goodsDetails.length; i++) {
                var goodsImgUrl = goodsDetails[i].goodsImgUrl;
                var goodsName = goodsDetails[i].goodsName;
                var amount = goodsDetails[i].amount;
                var orderSku = goodsDetails[i].orderSku;
                if(sku != null && sku == orderSku){
                    totalAmmount = amount;
                }else if(sku != null && sku != orderSku ){
                    continue
                }
                _html +='<div class="afterSale-topImg">';
                _html +='<img src="'+goodsImgUrl+'" />';
                _html +='</div>';
                _html +='<div class="afterSale-topRight">';
                _html +='<p class="goodsText">'+goodsName+'</p>';//<span>[预售]</span>
                //_html +='<p class="goods-specifications">规格: 单果55-56#</p>';
                _html +='<p class="goods-price">￥'+profitsPoint(amount)+'  </p>';// /<span>总收益'+order.totalAgentProfit+'</span>
                _html +='</div>';
            }
            $('.afterSale-top').html(_html);
        },
        error : function(error){
            hui.iconToast(error.message, 'error');
        }
    })
})

$(document).on('click','.submitApply',function(){
    var saleType = $("#saleType").html();
    var route = 0;
    if (saleType == "换货") {
        route = 1;
    } else if (saleType == "退款/退货"){
        route = 2;
    } else if (saleType == "仅退款"){
        route = 3;
    }
    if(isConsumptionOrder == "true" && (route == 2 || route == 3)){
        hui.alert("升级订单不能选择"+saleType+"售后！");
        return;
    }
    var  skuParam = ""
    if(partialRefund != null){
        skuParam += "&partialRefund="+partialRefund;
    }
    if(sku != null){
        skuParam += "&sku="+sku;
    }
    window.location.href = "/localQuickPurchase/distributionVA/order/refundDetail?orderno="+orderno+"&saleType="+saleType+"&totalAmmount="+totalAmmount+"&supplierSeq="+supplierSeq+"&route="+route+skuParam;
});

//处理利润的小数点（原则：只舍不入）
function profitsPoint(profits){
    if(profits == null || profits == ""){
        return "0";
    }else{
        var f = Math.floor(profits * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }
};