
var userSeq = getCookie("seq");//当前用户的seq
var _html = '';

function getGoods(){
	var goods = null;
	// 商品信息
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/upgradeGood/findUpgradeGoodByGoodsId',
		data : {
			goodsId : goodsId
		},
		async : false,
		success : function(result) {
			console.info(result);
			goods = result;
		},
		error : function(err) {
		}
	});
	return goods;
}

//判断该直升礼包是否下架
function checkSoldOut(){
	var goods = getGoods();
	if(goods.code == 200){
		var good = goods.data;
		if(good.putaway == 0){
			 hui.toast("商品已下架!");
			 return false;
		}
	}else{
		return false;
	}
	return true;
}

//获取商品详情
function goodsInit() {
			var result = getGoods();
			if(null == result.data){
				hui.alert('该商品已下架!', ['返回首页'], function(){
					window.location.href="/localQuickPurchase/distributionVA/index";
				});
			}
			var goods = result.data;
			if (goods != null) {
				
				var goodsImg = goods.goodsImg;
				var imgs = strs=goodsImg.split(","); //字符分割 
				var goodsName = goods.goodsName;
				var goodsPrice = goods.goodsPrice;
				var specification = goods.specification;//商品规格
				var imgText = '';
				var fristImgPath ;
				if(imgs != null){
					fristImgPath = imgs[0];
					for(var i = 0 ; i < imgs.length; i++){
						var goodsImgPath = imgs[i];
						imgText += '<div class="hui-swipe-item"><img src="'
						+ goodsImgPath + '"/></div>';
					}
				}
				$("#swipe2").append(imgText);
				$(".goodsName").html(goodsName);
				$(".distributionPrice").html(goodsPrice);
				//$(".imgAndTxt").html(introduction);
				var specText = '<li class="paramItem">'
					+ '<label class="paramName">' + "商品规格" + '</label>'
					+ '<span class="paramValue checked"></span>' + '</li>';
				$(".paramList").append(specText);
				$(".goodsImg").find("img").attr("src", fristImgPath);
				
				
				// 图片轮播初始化
				var swipe2 = new huiSwpie('#swipe2');
				$(".slt-price").html("￥"+goodsPrice);
				if(specification != null && specification != '' && specification.length > 18){
					specification = specification.substring(0,18)+"...";
				}
				if(goodsName != null && goodsName != '' && goodsName.length > 18){
					goodsName = goodsName.substring(0,16)+"...";
				}
				$(".stock-num").html(specification);
				$(".stock-name").html(goodsName);
				
				swipe2.autoPlay = true;
				swipe2.speed=500;//切换图片的时间
				swipe2.delay=5000;//切换图片后停顿的时间  毫秒
				swipe2.run();
			}
}
//强行同步函数顺序
function doAsync(){
	// 初始化商品状态
	$.ajaxSettings.async = false;
	goodsInit();
	findGoodsUserState();
}

//判断网络店主是否将商品上下架
function findOneByQuery() {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		async : true,
		data : {
			goodsId : goodsId,
			distributorSeq : seq
		},
		url : '/localQuickPurchase/favoritesAction/findOneByQuery',
		success : function(data) {
			var data = data.data;
			if (null != data) {
				if (data.favoritesOrNot) {
					$("#detailup").toggle();
					$("#detaildown").toggle();

					$("#detailup").hide();
					$("#detaildown").show();
					goodsUserState = true;
				} else {
					goodsUserState = false;
					console.log("goodsUserState1: " + goodsUserState);
					$("#detailup").toggle();
					$("#detaildown").toggle();

					$("#detailup").show();
					$("#detaildown").hide();

				}
			} else {
				goodsUserState = false;
			}
		}
	});
};

//判断代理商是否将商品上下架
function checkF() {
	$.ajax({
		type : 'POST',
		dataType : 'json',
		async : true,
		data : {
			goodsId : goodsId,
			seq : seq
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
			console.log("goodsUserState2: " + goodsUserState);
		}
	});
};

//判断网络店主或者服务商是否将商品上下架
function findGoodsUserState() {
	$.ajax({
		type : 'get',
		dataType : 'json',
		async : true,
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
			console.log("goodsUserState2: " + goodsUserState);
		}
	})
};

//下架操作
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

//上架操作
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

//上下架的点击切换
function changeOrderStatus(){
	$("#detailup").toggle();
	$("#detaildown").toggle();
}

//添加购物车事件
function addCart(){
	if(checkShare == null || checkShare == ""){
		shareSeq = 0;//分享者seq
	}
	/*var param = {};
	param.supplierSeq = supplierSeq;
	param.shopSeq = shopSeq;
	param.goodsId = goodsId;
	param.goodsNum = goodsNum;
	param.distributorType = distributorType;*/
	console.log("分享人seq: " + shareSeq);
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/dCart/add',
		data : {
			supplierSeq : supplierSeq,   
			shopSeq : shopSeq,
			goodsId : goodsId,
			userName : userName,
			goodsNum : goodsNum,
			distributorType : distributorType,
			shareSeq : shareSeq
		},
		async : true,
		success : function(data) {
			var code = data.code;
			if(code == 200){
				hui.toast("加入购物车成功");
				sltHide();
			} else if(code == 501){
				hui.toast(data.message);
				sltHide();
			}else{
				hui.toast("加入购物车失败");
				sltHide();
			}
		}
	});
}

//商品推荐
function hotSale(){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/commodityShow/hotSale',
		data : {
			pageSize : 4,
			pageIndex : 1,
			seq : seq,
			userType : 1,
			userName : userName,
		},
		async : true,
		success : function(data) {
			var data = data.data;
			if(data.length > 0){
				var goodsText = '';
				for (var i = 0; i < data.length; i++) {
					var goods = data[i];
					var goodsName = goods.goodsName;
					var distributionPrice = goods.distributionPrice;
					var listImg = goods.listGoodsImg;
					var goodsId = goods.goodsId;
					var goodsImg = '';
					if(null != listImg || listImg.length > 0){
						goodsImg = listImg[0].goodsImgPath;
					}
					goodsText += '<div class="goodsItem"><div class="gImg"><img class="good-pic" src="'+
					goodsImg+'" id='+goodsId+'></div><div class="gDetail"><div class="gName">'+
					goodsName+'</div><div class="gPrice"><span class="rPrice">￥'+
					distributionPrice+'</span>'+
					/* '<span class="oPrice">￥36.0</span>'+ */
					'</div></div></div>';
				}
				$(".goodsList").html(goodsText);
			}

		},
		error : function(error) {

		}
	});
}
/*//获取商品的利润
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
 */