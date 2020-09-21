var list = [];
var userSeq = seq;//当前用户的seq
var _html = '';
var distributionStock = "";//分销商品库存
var goods;
var presellType = "";//商品标识
var statrtTime;//开始时间
var endTime;//结束时间
var presellDay = -1; //预计发货天数
var Coums=shopgd(seq);
var type=getRoleType();


//获取优惠券图标
function getYhqHtml(data){
	var goodsYhq = data.yHQ;
	var yhqHtml = "";
	if (goodsYhq) {
		if (type==1||type==2||!type) {
			yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
		}else if ((type==3 ||type==4)&& Coums<=100) {
			yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
		}else {
			yhqHtml+=""
		}
	} else {yhqHtml+=""}
	return yhqHtml;
}
//选中规格
function selSpec(t){
	if($(t).hasClass("nogood")){
		return;
	}
	$(t).addClass("checked").siblings(".spec-item").removeClass("checked");
}
	
// 判断网络店主是否将商品上下架  distributorSeq 谁的商品
function findOneByQuery() {
	if(distributorSeq == 0){
		return;
	}
	$.ajax({
		type : 'POST',
		dataType : 'json',
		async : false,
		data : {
			goodsId : goodsId,
			distributorSeq : distributorSeq//
		},
		url : '/localQuickPurchase/favoritesAction/findOneByQuery',
		success : function(result) {
			var data = result.data;
			if (null != data) {
				if (data.favoritesOrNot) {
					$("#detailup").toggle();
					$("#detaildown").toggle();
					
					$("#detailup").hide();
					$("#detaildown").show();
					goodsUserState = true;
				} else {
					goodsUserState = false;
					//console.log("goodsUserState1: " + goodsUserState);
					$("#detailup").toggle();
					$("#detaildown").toggle();
					
					$("#detailup").show();
					$("#detaildown").hide();
					
				}
			} else {
				if(result.code == 200){
					goodsUserState = true;
				}else{
					goodsUserState = false;
				}
			}
		}
	});
};

// 判断代理商是否将商品上下架   distributorSeq 谁的商品
function checkF() {
	if(distributorSeq == 0){
		return;
	}
	$.ajax({
		type : 'POST',
		dataType : 'json',
		async : true,
		data : {
			goodsId : goodsId,
			seq : distributorSeq
		},
		url : '/localQuickPurchase/dGoodsAction/checkFavorites',
		success : function(data) {
			var data = data.data;
			if (null != data) {
				if (data.state != 2) {
					goodsUserState = false;
					$("#detailup").toggle();
					$("#detaildown").toggle();
					$("#detailup").show();
					$("#detaildown").hide();
				} else {
					$("#detailup").toggle();
					$("#detaildown").toggle();
					$("#detailup").hide();
					$("#detaildown").show();
					goodsUserState = true;
				}
			} else {
				goodsUserState = false;
			}
			//下架
			if(goodsState){
				goodsUserState = true;
			} 
			//console.log("goodsUserState2: " + goodsUserState);
		}
	});
};

// 判断网络店主或者服务商是否将商品上下架   distributorSeq 谁的商品
function findGoodsUserState() {
	if(distributorSeq == 0){
		return;
	}
	$.ajax({
		type : 'get',
		dataType : 'json',
		async : false,
		data : {
			goodsId : goodsId,
			seq : distributorSeq,
			orderSku : orderSku
		},
		url : '/localQuickPurchase/dGoodsAction/goodsUserState',
		success : function(data) {
			var data = data.data;
			if (null != data) {
				goodsUserState = data;
			}
			//下架
			if(goodsState){
				goodsUserState = true;
			} 
			//console.log("goodsUserState2: " + goodsUserState);
		}
	})
};

// 下架操作
function reduceOrFavorite(param) {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		data : param,
		url : '/localQuickPurchase/dGoodsAction/reduceOrFavorite',
		success : function(data) {
			if (data.code == 200) {
				hui.toast("下架成功");
				changeOrderStatus();
				goodsUserState = false;// 下架后修改状态为false
				// goodsState = false; //改为架状态
				/*
				 * setTimeout(function () { }, 1500);
				 * $(".sideFooter").show().delay(3000).hide(300);
				 * $(".dtItem.close").click(function(){ $(".sideFooter").hide();
				 * changeOrderStatus(); })
				 */
			} else {
				hui.toast(data.message);
				return false;
			}
		}
	})
}

// 上架操作
function addOrFavorite(param) {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		data : param,
		url : '/localQuickPurchase/dGoodsAction/addOrFavorite',
		success : function(data) {
			if (data.code == 200) {
				hui.toast("上架成功");
				goodsUserState = true;// 下架后修改状态为true
				// goodsState = true; //改为上架状态
				changeOrderStatus();
			} else {
				hui.toast(data.message);
				return false;
			}
		}
	})
}

// 上下架的点击切换
function changeOrderStatus(){
    $("#detailup").toggle();
    $("#detaildown").toggle();
}

// 判断是否登录
function noLogin(){
    sltHide();
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        setCookie("loginRetrunUrl",urlVal);
        loginPage();
    });
}

// 添加购物车事件
function addCart(){
	if(checkShare == null || checkShare == ""){
		 shareSeq = 0;//分享者seq
	}
	if(shareSeqCK != null && shareSeqCK != "") {
		shareSeq = shareSeqCK;
	}
	var param = {};
	param.supplierSeq = supplierSeq;
	param.shopSeq = shopSeq;
	param.goodsId = goodsId;
	param.goodsNum = goodsNum;
	//console.log("分享人seq: " + shareSeq);
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/dCart/add',
		data : JSON.stringify({
			"supplierSeq" : parseInt(supplierSeq),
			 "shopSeq" : parseInt(shopSeq), 
			 "goodsId" : goodsId,
			 "goodsCode": goodsCode,
             "factoryPrice": parseInt(factoryPrice),
             "cost_unit_price": parseInt(cost_unit_price),
             "primitiveFactoryPrice" : parseInt(primitiveFactoryPrice),
			 "companyName" : companyName,
			 "goodsNum" : parseInt(goodsNum),
			 "userName" : userName,
			 "shareSeq" : parseInt(shareSeq),
			 "sku" : orderSku,
			 "spec" : spec,
			 "ifBrandProduct" : ifBrandProduct,
			 "ifWYFcommodity" : ifWYFcommodity
			 }),
		async : true,
		success : function(data) {
			var code = data.code;
			//操作完之后清空
			spec = '';
 			$(".slt-spec").text("选择规格 " + spec);
			$(".checkedSpec").text(spec);
			if(code == 200){
				hui.toast("加入购物车成功");
				/*更新库存同步 购物车*/
				synchronizeCartData();
			} else if(code == 501){
				hui.toast(data.message);
			}else{
				hui.toast("加入购物车失败");
			}
			$(".specBtn").hide();
			$(".numBox").hide();
			sltHide();
		}
	});
}

function synchronizeCartData() {
	$.ajax({
		type : "GET", // 定义提交的类型
		url : "/localQuickPurchase/dCart/getCartNum",// 请求的地址
		dataType : "json", // 设置返回值得类型
		data : {"userName": getUserName()},
		async : true, // 是否异步请求，false为同步
		success : function(data) { // 成功返回值执行函数
			if (data.code == 200) {
				var goodsLocalItems = data.data;
				setCookie("goodsLocalItems",goodsLocalItems);
				if (goodsLocalItems > 0) {
					document.getElementById("numberForCart1").innerHTML = goodsLocalItems;
					document.getElementById("numberForCart2").innerHTML = goodsLocalItems;
				}
			}
		},
		error : function () {
		}
	});
}

//商品推荐
function hotSale(){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
		data : JSON.stringify({
			'pageSize' : 10,
			'pageIndex' : 1,
			'columnName' : '为您推荐',
		}),
        contentType: "application/json;charset=utf-8",
		async : true,
		success : function(data) {
			var data = data.data;
			if(data.length > 0){
				var goodsText = '';
				for (var i = 0; i < data.length; i++) {
					var goods = data[i];
					var goodsName = goods.goodsName;
					var actualPrice = goods.actualPrice;//实际价格
					var comparativePrice = goods.comparativePrice;//对比价格
					var goodsProStandard = goods.goodsProStandard;
					var isActivityGoods = goods.isActivityGoods;
                    var distributionPrice = getDistributionPrices(goodsProStandard);//分销价
                    var goodsPrice = goodsProStandard[0].goodsPrice;//市场销售价
					var listImg = goods.listGoodsImg;
					var goodsId = goods.goodsId;
					var goodsImg = '';
					if(null != listImg && listImg.length > 0){
						goodsImg = listImg[0].goodsImgPath;
					} else {
						goodsImg = goods.thumbnail;
					}
					goodsText += '<div class="goodsItem"><div class="gImg">';
					goodsText += '<img class="good-pic" src="'+ goodsImg+'" id='+goodsId+' isActivityGoods='+isActivityGoods+'></div>';
					goodsText +=getYhqHtml(goods);
					var presellTypes = goods.presellType;
					if(presellTypes != null && presellTypes == 1) {
						var endTime = goods.endTime;
						var date = Date.parse(new Date());
						if(endTime > date) {
							goodsText += '<div class="gDetail"><div class="gName"><span style="color: red">(预售商品)</span>'+ goodsName+'</div>';
						} else {
							goodsText += '<div class="gDetail"><div class="gName">'+ goodsName+'</div>';
						}
					} else {
						goodsText += '<div class="gDetail"><div class="gName">'+ goodsName+'</div>';
					}
                    goodsText += '<div class="label">';

                    if(goods.listLabel != null){
                        var  listLabel = goods.listLabel;
                        for (var j = 0; j < listLabel.length; j++) {
                            var label = listLabel[j];
                            goodsText += ' <span style="color:'+ label.colour +';border: 1px solid '+ label.colour +';border-radius: 0.59rem;' +
                                'padding: 0 4px;word-break: keep-all;">'+ label.labelValue +'</span>'
                        }
                    }
                    goodsText += '</div>';
                    goodsText += '<div class="gPrice"><span class="rPrice">￥'+ actualPrice+'</span> <span class="oPrice">￥'+goodsPrice+'</span></div></div></div>';
				}
				$(".goodsList").html(goodsText);
			}
			
		},
		error : function(error) {
			
		}
	});
}
//获取商品的利润
function PreferentialPrice(userSeq,goodsId){
	if(checkShare == null){
		 shareSeq = 0;//分享者seq
	}
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/dGoodsAction/getGoodsProfit',
		data : {
			seq : userSeq,   
			goodsId : goodsId,
			shareSeq : shareSeq
		},
		async : false,
		success : function(data) {
			var code = data.code;
			if(code == 200){
				
			} else {
				hui.toast("加入购物车失败");
				sltHide();
	}
		}
	});
	
}

/**
 * 根据角色类型获取优惠价
 * @returns
 */
function getDicountPrice(entity, platformPrice, distributionPrice, isDistrbutionGoods) {
	//获取下单优惠价
	var PreferentialPrice = 0.0;
	if(isRoleAgent() || isRoleDealer()) {
		var _distributionProfit = entity.distributionProfit;//分销商佣
		var _profitPrice = entity.profitPrice;//代理商佣金
		if(_distributionProfit != null && _distributionProfit > 0.0 && _profitPrice != null && _profitPrice > 0.0) {
			if(isRoleAgent()) {
				PreferentialPrice = entity.distributionProfit;//分销商佣金
			} else if(isRoleDealer()) {
				PreferentialPrice = numAdd(entity.profitPrice, entity.distributionProfit);//代理商佣金
			}
		}
	}
	return PreferentialPrice;
}

function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

/**
 * 获取分销价
 * @returns
 */
function getDistributionPrices(data) {
	var distributionPrice = data[0].distributionPrice;
	if(distributionPrice == null) {
		var costPrice = (data[0].platformPrice*1.15).toFixed(2);;
		distributionPrice = (costPrice*1.2).toFixed(2);
	}
	return distributionPrice;
}
/**
 * 获取分销价
 * @returns
 */
function getGoodsPrices(data) {
    return data[0].goodsPrice;
}
var preselType = 0;
function checkGoodsType() {
    if (presellType == 1) {
        var code = checkGoodsToBuy(presellType, statrtTime, endTime);
        var now = getToData();
        if (now < endTime) {
            preselType = 1;
            $(".hasDisplay").removeClass("hasDisplay");
            var expectedDeliveryTime = formatDateTime_(fun_date(endTime, presellDay));
            $(".expectedDelivery").html(expectedDeliveryTime);
        }
    }
}
function  jumpCoupon(){
	window.location.href="/localQuickPurchase/activity/baiye.html";
}
