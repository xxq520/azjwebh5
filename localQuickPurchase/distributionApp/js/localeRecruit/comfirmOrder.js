// var payUrlBean = "http://payts.520shq.com/home/indexwap?comefrom=10007&busimode=0";
var payUrlBean = "http://192.168.1.36:8077/home/indexwap?comefrom=10007&busimode=0";
console.log("payUrlBean: " + payUrlBean);
var investmentSeq = getCookie("investmentSeq");//现场招商商家的seq
//返回上一页
function backClick(){
	var url = "/localQuickPurchase/distributionVA/localeRecruit/choiceGoods?seq="+investmentSeq;
	window.location.href = url;
};
var addressId;//收货地址Id
var logisticsPrice = 0.0;
var profitAmout = 0.0;
var profitAmount = 0.0;//订单优惠金额
var logisticsPriceAmonut = 0.0;
var profitAmountCount = 0.0;//订单优惠总金额
var goodsRedisKey;
var entity = [];
var seqSeller = 0;
var shareSeq = 0;
var addressObj;
//加载地址和购物车已选商品
function init() {
	userName = getCookie("userName");
	goodsRedisKey = $("input:hidden[name='redisKey']").val();
	$.ajax({
		type : "post",//定义提交的类型
		//contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/investmentGoods/comfirm",
		dataType : "json",//设置返回值得类型
		data : {"userName" : userName,"redisKey":goodsRedisKey},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				var address = data.data.address;
				addressObj = address;
				logisticsPriceAmonut = data.data.dCart.totalFreigth;
				//appendAddress(address);
				appendCart(data.data.dCart);
				if(distributorType==1){
					$(".profit").hide();
				}else{
					$(".profit").show();
				}
			} else {
				hui.toast("加载失败!");
				//window.location.href = "/localQuickPurchase/distributionVA/shopCar/shopCar2";
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
        }
	});
}

//append购物车已选商品
function appendCart(dCart) {
	var shopCarts = dCart.shopCarts;
	var shopListStr = "";
	for (var i = 0; i < shopCarts.length; i++) {
		var localItems = shopCarts[i].localItems;
		if (localItems != null && localItems.length > 0) {
			shopListStr += foreachShopCart(shopCarts[i], localItems);
		}
	}
	$(".shopList").append(shopListStr);
	//var amountProfit= parseFloat(dCart.totalAmount)-parseFloat(profitAmout);
	$(".pricestop").html("实付金额:&yen;" + profitAmout.toFixed(2));
	$(".pricesCount").html("总优惠:&yen;" + profitAmountCount.toFixed(2));
	$(".pricesbot").html("总运费(￥"+ logisticsPriceAmonut +")");
}

//循环购物车商品,然后返回string
function foreachLocalItems(localItems) {
	var goodsList = "";
	for (var y = 0; y < localItems.length; y++) {
		console.info(localItems[y]);
		var goodsPirce = localItems[y].distributionPrice;
		var logisticsPrice = localItems[y].logisticsPrice;
		var platformPrice = localItems[y].platformPrice;
		var distributionPrice = localItems[y].distributionPrice;
		var isDistrbutionGoods = localItems[y].isDistrbutionGoods;
		var isDistrbutionGoods = localItems[y].isDistrbutionGoods;
		var quantity = localItems[y].quantity;
		seqSeller = localItems[y].shareSeq;
		var distributionProfit = localItems[y].distributionProfit;//分销商佣金
		var profitPrice = localItems[y].profitPrice;//代理商佣金
		
		//下单价格
		var profit;
		
		if(distributionProfit != null && distributionProfit > 0.0 && profitPrice != null && profitPrice > 0.0) {
			//下单价格
			if(isRoleAgent()) {
				profit = numSub(distributionPrice, distributionProfit);
			} else if(isRoleDealer()) {
				profit = numSub(distributionPrice,numAdd(distributionProfit,profitPrice));
			} else {
				profit = distributionPrice;
			}

		}
		
		//已优惠金额
		profitAmount = numMulti(numSub(distributionPrice,profit),quantity);
		profitAmountCount = (profitAmountCount+profitAmount);
		
		var goodsSku = localItems[y].goodsSku;

		entity[y] = new Object();
		entity[y].preferentialHowMany = profitAmount;
		entity[y].goodsSku = goodsSku;

		//原价总金额
		var goodsPrices = goodsPirce*quantity;
		console.info("下单价格 : "+profit);
		profitAmout += profit*quantity+logisticsPrice;
		goodsList += '<div class="goodsItem">'+
				            '<div class="itemImg"><img src="'+ localItems[y].imgUrl +'"></div>'+
				            '<div class="itemInfo">'+
				                '<p class="infoTit">'+ localItems[y].goodsName +'</p>'+
				                //'<p class="infoSpecificat">规格:500ML×24</p>'+
				                '<p class="infoNum">数量:'+ localItems[y].quantity +'</p>'+
				                '<p class="infoPrice">原价:&yen;'+ goodsPrices.toFixed(2) +'</p>'+
				                '<p class="infoPrice profit">已优惠:&yen;'+ profitAmount.toFixed(2) +'</p>'+
				                '<input type="hidden" name="logisticsPrice" class="logisticsPrice" value="'+ logisticsPrice +'">'+
				                '<input type="hidden" name="profit" class="profit" value="'+ profit +'">'+
				            '</div>'+
				      '</div>';
	}
	return goodsList;
}

//循环购物车商品,然后返回运费
function foreachlogisticsPrice(localItems) {
	var logisticsPrice = 0.0;
	for (var y = 0; y < localItems.length; y++) {
		logisticsPrice += parseFloat(localItems[y].logisticsPrice);
	}
	return logisticsPrice;
}

//循环购物车商品,然后返回总金额
function foreachAmount(localItems) {
	var logisticsPrice = 0.0;
	var goodsAmount = 0.0;
	for (var y = 0; y < localItems.length; y++) {
		console.info(localItems[y]);
		logisticsPrice += parseFloat(localItems[y].logisticsPrice);
		goodsAmount += parseFloat(localItems[y].goodsAmount);
	}
	var amount = parseFloat(goodsAmount + logisticsPrice).toFixed(2);
	return amount;
}

//循环购物车店家,然后返回string
function foreachShopCart(shopCart, localItems) {
	var shopAmount = shopCart.shopAmount;
	console.info(shopCart);
	var shopList = '<div class="goodsInfo">'+
						foreachLocalItems(localItems)+
						'<div class="goodsPs">'+
							'<span class="psTit">备注:</span>'+
							'<p class="psCon" id="'+ shopCart.supplierSeq +'">'+
								'<input style="width:100%;padding: 0;"  placeholder="不接受指定快递，特殊需求请求联系卖家(20字)" class="psCon" maxlength=20/>'+
							'</p>'+
						'</div>'+
					'</div>'+
					'<div class="goodsPrices">'+
						/*'<div id="price-arrow" class="priceItem price-arrow">'+ 
		                    '<span class="itemL">发票</span>'+
		                    '<span class="itemr">不开发票</span>'+
		                '</div>'+*/
						'<div class="priceItem">'+
							'<span class="itemL">商品金额</span> <span class="itemr">&yen;'+ shopAmount.toFixed(2) +'</span>'+
						'</div>'+
						'<div class="priceItem" style="display:none">'+
							//'<span class="itemL">运费</span> <span class="itemr">&yen;'+ freightShop +'</span>'+
						'<span class="itemL" >运费</span> <span class="itemr">&yen;'+ foreachlogisticsPrice(localItems) +'</span>'+
						'</div>'+
						'<div class="priceItem">'+
							'<span class="itemL">合计金额</span> <span class="itemr red">&yen;'+ foreachAmount(localItems) +'</span>'+
						'</div>'+
					'</div>';
	return shopList;
}

//获取提交订单参数
function getSubmitOrderParme() {
	var userSeq = seq;
	var dovo = {};
	dovo.seq = userSeq;
	dovo.userName = userName;
	dovo.addressId = addressId;
	dovo.remarkAndSeq = getRemarkAndSeq();
	dovo.seqSeller = seqSeller;
	dovo.shareSeq = seqSeller;
	
	dovo.idAndSeqs = JSON.parse(JSON.stringify(entity));
	dovo.preferentialHowMany = profitAmount;
	dovo.redisKey = goodsRedisKey;
	dovo.remark = $(".goodsInfo").find(".goodsPs").children(".psCon").children("input").val();
	return dovo;
}

//获取remarkAndSeq
function getRemarkAndSeq() {
	var remarkAndSeqs = [];
	$(".goodsInfo").each(function(ine, obj) {
		var remarkAndSeq = {};
		var $psCin = $(this).find(".goodsPs").children(".psCon");
		remarkAndSeq.remark = $psCin.children("input").val();
		remarkAndSeq.supplierSeq = $psCin.attr("id");
		console.log(remarkAndSeq.remark);
		console.log(remarkAndSeq.supplierSeq);
		remarkAndSeqs.push(remarkAndSeq);
	});
	console.log(remarkAndSeqs);
	return remarkAndSeqs;
}

//判断该用户是否为已别人绑定关系
$(function(){
	//查找该用户绑定关系的是否是现场招商的卖家
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/relation/checkRelAndDisApp",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : {
			"userSeq" : seq
		},
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			if(data.code == 200){
				var data = data.data;
				//判断当前用户是否是代理商
				var user_Type = data.user_Type;
				if(UT == 2){
					hui.alert('由于您是商家,不会产生任何绑定！','好的', function(){
                        personalCenter();
					});
					return;
				}
				if(UT == 5){
					hui.alert('由于您是供应商,不会产生任何绑定！','好的', function(){
                        personalCenter();
					});
					return;
				}
				if(user_Type == -1){
					hui.alert('您的账号已被禁用,不会产生任何绑定！','好的', function(){
                        personalCenter();
					});
					return;
				}
				if(user_Type == 4){
					hui.alert('您已经是代理商,不会产生任何绑定！','好的', function(){
                        personalCenter();
					});
					return;
				}
			}
			
		}
	});
	
});
function updateRelation(seq,investmentSeq){
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/relation/updateRelOrDisApp",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : {
			"userSeq" : seq,
			"shareSeq" : investmentSeq
		},
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			var data = data.data;
			if(data.code == 200){
				
			}
			
		}
	});
}