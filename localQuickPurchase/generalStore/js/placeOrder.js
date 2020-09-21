var shoppingCartId = getQueryString("shoppingCartId");
var ballObj;
var seq=getQueryString("seq");
var shippingAddressId;
var billHead;
var billCont;
if(!userInfo){
		window.location.href = 'login.jsp';
}
$(function(){
	initPage();
	if(getCookie("tempBill")||getCookie("tempBill")!=""){
		ballObj=JSON.parse(getCookie("tempBill"));
		billHead = ballObj.billHead;
		billCont = ballObj.billCont;
		if(billHead){
			$(".billMsg").text("需要发票");
			$("input[name=billHead]").val(billHead);
			$("input[name=billCont]").val(billCont);
		}else{
			$(".billMsg").text("不需要发票");
		}
	}
})
$(".backToPrev").on("click",function(){
	/*var orderUrl = getCookie("returnOrderUrl");
	if(orderUrl == "" || orderUrl == null){
		window.location.href = document.referrer;
	} else{
		window.location.href=orderUrl;
	}*/
	window.history.go(-1);
})
$(".payMethod-item").click(function(){
	if(!$(this).hasClass('checked')){
		$(this).addClass('checked').siblings().removeClass('checked');
	}
});
$(".sub-item.address").click(function() {
	window.location.href = "address.jsp";
});
$(".sub-item.billInfo").click(function() {
	window.location.href = "bill.jsp?shoppingCartId="+shoppingCartId+'&seq='+ seq + '&shippingAddressId='+shippingAddressId;
});
$(".submitBtn").click(function(){
	submitOrder();
});
var freight=0;
var amount=0;
var addressObj=null;
function initPage(){
	$.ajax({
		url:_content+'/orderMongo/downOrder',
		type: 'post',
		dataType: 'json',
		data: {shoppingCartId:shoppingCartId,seq:seq,userName:userName,userSeq:userSeq},
	})
	.done(function(res) {
		//console.log(res);
		if(res.code == 200){
			var data = res.data;
			var _html = '';
			$(".shopMsg .shopImg img").attr("src",data.shopUrl);
			$(".shopName").text(data.shopName);
			var goodsDetail = data.shoppingCart;
			var deliverType=data.deliverType;
			if(deliverType.indexOf("自提")>-1){
				$(".payInGh").hide();
			}
			$(".good-total").text(goodsDetail.amount.toFixed(2));
			freight = (!data.freight) ? 0 : data.freight;
			amount =data.shoppingCart.amount;
			$(".good-freight").text("0.00");
			$(".good-discount").text(data.price2.toFixed(2));
			$(".statement-price em").text(goodsDetail.amount.toFixed(2));
            $(".statement-discount em").text(data.price2.toFixed(2));
            var _address = '';
            if(data.shippingAddress.length){
            	for(var i=0;i<data.shippingAddress.length;i++){
            		var isDefaut = '';
            		var val=data.shippingAddress[i]
                	if(val.bDefault){
                		idDefault = (val.bDefault)?'<i class="remark">默认地址</i>':'';
                		_address = '<p><input type="hidden" name="l_address" value="'+ val.address +'"/><input type="hidden" name="l_tel" value="'+ val.shippingTelephone +'"/><input type="hidden" name="l_name" value="'+ val.shippingName +'"/><input type="hidden" name="l_sex" value="'+ val.shippingSex +'"/><span  class="consignerMsg" data-value="'+ val.bDefault +'">'+ val.shippingName + '('+ val.shippingTelephone +')'+'</span>'+ idDefault +'</p><p>收货地址：<span class="addressMsg">'+ val.tipName+val.address +'</span></p><i class="rightIco"></i>';
                		addressObj=val;
                		shippingAddressId=val.shippingAddressId

                	}
            	}
            	if(_address==""){
            		_address = '收货信息：暂无默认地址，请先设置默认地址再提交订单!';
            	}
            }else{
            	_address = '收货信息：暂无地址，去新增地址吧';
            }
			$.each(goodsDetail.itemsList,function(index,el){
				_html += '<div class="good-item"><div class="good-name item-item"><span>'+ el.goodsName +'</span></div><div class="good-num item-item">x<span>'+ el.quantity +'</span></div><div class="good-price item-item"><i>&yen;</i><span>'+ el.goodsPirce.toFixed(2) +'</span></div></div>';
			})
			$(".sub-item.address").html(_address);
			$(".sub-item .good-list").html(_html);
		}
		$(".payment-con").show();
	})
	.fail(function() {
		//console.log("error");
	})
	.always(function() {
		//console.log("complete");
	});
}

//var flagType;
$(".payMethod-item").click(function(event) {
	if($(this).hasClass('payInWechat')) {
		$(".orPrice").html(amount.toFixed(2));
		$(".good-freight").html("0.00");
	}else{
		$(".good-freight").html(freight.toFixed(2));
		$(".orPrice").html((amount+freight).toFixed(2));
	}
});


function submitOrder(){
	if(addressObj==null){
		$.alert("请绑定收货地址");
		return;
	}
	var str=addressObj.tipLocation.split(",");
	var lat1=str[1];
	var lng1=str[0];
	var lat2=getCookie("shopLats");
	var lng2=getCookie("shopLngs");
	var distance=getGreatCircleDistance(lat1,lng1,lat2,lng2);
	if(distance>20000){
		   $.alert("配送距离超出范围(20公里)","提示");
		   return;
	}
	//console.log(addressObj);
	var remark = $(".good-remark").val();
	var mode = $(".payMethod").find(".checked").find("span").text();

	var data = {};
	data.shippingSex = addressObj.shippingSex;
	data.shippingTelephone = addressObj.shippingTelephone;
	data.address = addressObj.tipCity + addressObj.tipDistrict + addressObj.tipName +  addressObj.address ;
	data.shippingName = addressObj.shippingName;
	data.seq = seq;
	data.seqSeller = seq;
	data.userName = userName;
	data.shoppingCartId = shoppingCartId;
	data.pickUpWay = mode;
	data.invoiceHead = billHead;
	data.remark = remark;
	data.invoiceContent = billCont;
	$(".submitBtn").addClass("lock");
	$.ajax({
		url:_content+'/orderMongo/goPay',
		type: 'post',
		async:false,
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		data:JSON.stringify(data),
	})
	.done(function(res) {
		//console.log(res);
		if(res.code == 200){
			window.location.href = 'paySuccess.jsp';
		}else{
			$.alert(res.message);
		}
	})
	.fail(function() {
		//console.log("error");
	})
	.always(function() {
		$(".submitBtn").removeClass("lock");
		//console.log("complete");
	});
}
//根据两点的经纬度算距离，单位米
var EARTH_RADIUS = 6378137.0;    //单位M
var PI = Math.PI;

function getRad(d){
    return d*PI/180.0;
}
//纬度，经度
function getGreatCircleDistance(lat1,lng1,lat2,lng2){
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);

    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);

    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*EARTH_RADIUS;
    s = Math.round(s*10000)/10000.0;

    return s;
}
	//var flagType;
	$(".payMethod-item").click(function(event) {
		if($(this).hasClass('payInWechat')) {
			$(".orPrice").html(amount);
			$(".good-freight").html(0);
		}else{
			$(".good-freight").html(freight);
			$(".orPrice").html(amount+freight);
		}
	});