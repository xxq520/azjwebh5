var saleType = getQueryString("saleType");//售后类型(退款退货, 换货)
var orderno = getQueryString("orderno");
var route = getQueryString("route");
var totalAmmount = getQueryString("totalAmmount");
var seq = seq;
var afterState = 0;//售后状态(0 等待审核, 1 退款、退货 , 2 换货, 3 仅退款)
var supplierSeqStr = getQueryString("supplierSeq");//供应商Seq
var supplierSeq = Number(supplierSeqStr);
$('.order').html(orderno);
$('.refundspan').html('￥'+parseFloat(totalAmmount).toFixed(2));
if (route == 4) {
    route = 3;
    afterState = 3;
}
if(route == 3){
    $("#btnbutton").removeClass("btn");
}
$(document).on('click','.footer-btn',function(){
    /*if (afterState == 2) {*/
    var afterReason = $("#refund").val();//售后原因
    var afterWhy = $(".after-text").val();//售后理由
    //var Courier = $("#afterOrder").val();//快递理由
    var afterOrderno = $(".afterOrder-text").val();//快递单号

    var datas = {
        "seq":seq,"orderno":orderno,"afterOrderno":afterOrderno,
        "afterType":saleType,"afterState":afterState,"afterWhy":afterWhy,
        "afterReason":afterReason,"supplierSeq":supplierSeq,"route":route
    };
    datas = getParamDatas(route,datas);
    if(datas == null){
        return;
    }
    console.log(datas);
    if (afterWhy != "") {
        $.ajax({
            type : 'POST',
            dataType : 'json',
            contentType: "application/json;charset=utf-8",
            url : '/localQuickPurchase/afterSales/insert',
            'async' : false,
            data :JSON.stringify(datas),
            success : function(data){
                if (data.code == 200) {
                    var after = data.data;
                    if(true == data.equipmentData){
                        hui.alert(data.message,"确定",function(){
                            cobakc(after)
                        });
                        return;
                    }else{
                        hui.alert(data.message,"确定",function(){
                            cobakc(after)
                        });
                        return;
                    }
                } else {
                    hui.alert(data.message);
                }
            },
            error : function(error){
                hui.alert(data.message);
            }
        });
    } else {
        hui.alert("售后理由不能为空！！");
    }
});
function cobakc(after){
    if (after != null && after != "") {
        setTimeout(function(){
            window.location.href = "/localQuickPurchase/distributionVA/order/index?tabNum=4";
        },1000);
    } else {
        setTimeout(function(){
            window.location.href = "/localQuickPurchase/distributionVA/order/index?tabNum=3";
        },1000);
    }
}
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
