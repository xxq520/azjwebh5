var seq  = seq;
var userName = userName;

/*网络店主和代理商*/
if(isRoleDealer() || isRoleAgent()) {
	
	/*热卖商品*/
	$(function() {
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/goodsHot',
			data : {
				pageSize : 10,
				pageIndex : 1,
				userType  : 1
			},
			async : false,
	
			success : function(data) {
				var business = data.data;
				console.info(data.data);
				var html = '<div>';
				if (business.length > 0 && business != null) {
					for (var i = 0; i < business.length; i++) {
						var goodsName = business[i].goodsName;// 商品名
						var buyingPrice = business[i].buyingPrice;// 价格
						var thumbnail = business[i].thumbnail;// 图片路径
						var goodsId = business[i].goodsId;// 商品id
						var goodsPrice = business[i].goodsPrice;// 商品
						var goodsProStandard = business[i].goodsProStandard;
						
						var distributionPrice = parseFloat(getDistributionPrice(goodsProStandard)).toFixed(2);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						var isDistrbutionGoods = business[i].isDistrbutionGoods;//
						
						
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						
						var costPrices;
						
						var _profit;
						if(isRoleAgent()) {
							_profit = goodsProStandard[0].distributionProfit//分销商利润
						} else if(isRoleDealer()) {
							_profit = numAdd(goodsProStandard[0].profitPrice, goodsProStandard[0].distributionProfit);//代理商利润
						}
						
						if(_profit != null && _profit > 0.0) {
							costPrices = _profit;
						}
						
						html += '<div class="product_list"><dl>';
						html += '<dt><img class="good-pic lazy"  data-original="'+ thumbnail + '" height="205" width="206" id="' + goodsId + '" /></dt>';
						
						var presellType = business[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = business[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								html += '<dd><span style="color: red">(预售商品)</span>' + goodsName + '</dd>';
							} else {
								html += '<dd>' + goodsName + '</dd>';
							}
						} else {
							html += '<dd>' + goodsName + '</dd>';
						}
						
						html += '<dd class="price_get"><span class="pri">￥'+ distributionPrice +'</span>';
						html += '<span class="get">赚￥' + cutPriceDown(costPrices) + '</span></dd>';
						html += '</dl> </div> ';
					}
					html += '</div> ';
					$("#hot_products_x").empty();
					$('#hot_products_x').html(html);
					$("#hot_products_x img.lazy").lazyload({effect: "fadeIn",container:"#hot_products_x"});
					hui('#hot_products_x').scrollX(2.5, '.product_list');// 热销商品
				} else {
					var _html = "<h3>暂时没有商品了，去其他地方看看吧</h3>";
					$("#hot_products_x").empty();
					$('#hot_products_x').html(_html);
				}
			},
			error : function(error) {
				
			}
		});
	});
	
	
	/*今日推荐 1*/
	/*今日推荐 2*/
	$(function() {
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/goodsHot',
			data : {
				pageSize : 2,
				pageIndex : 1,
				userType  : distributorType,
				seq : seq
			},
			async : false,

			success : function(data) {
				var business = data.data;
				if(business.length > 0 && business != null) {
					for(var i = 0; i < business.length; i++) {
						var html = '';
						var goodsName = business[i].goodsName;// 商品名
						var buyingPrice = business[i].buyingPrice;// 价格
						var thumbnail = business[i].thumbnail;// 图片路径
						var goodsId = business[i].goodsId;// 商品id
						var goodsProStandard = business[i].goodsProStandard;
						var distributionPrice = parseFloat(getDistributionPrice(goodsProStandard)).toFixed(2);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						var isDistrbutionGoods = business[i].isDistrbutionGoods;
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						
						var _profit;
						var costPrices;
						if(isRoleAgent()) {
							_profit = goodsProStandard[0].distributionProfit//分销商利润
						} else if(isRoleDealer()) {
							_profit = numAdd(goodsProStandard[0].profitPrice, goodsProStandard[0].distributionProfit);//代理商利润
						}
						if(_profit != null && _profit > 0.0) {
							costPrices = _profit;
						}
						
						var isFavorites = business[i].isFavorites;//是否收藏
						
						var shop_id=business[i].seq==null?0:business[i].seq;
						var supplier_id=business[i].supplierSeq==null?0:business[i].supplierSeq;
						
						html += '<div class="tuijian_list " id='+goodsId+'>';
						html += '<p><em>特卖</em>'+ goodsName +'</p>';
						html += '<p class="p2" ></p></div>';
						html += '<div class="tuijian_inven ">';
						html += '<ul> <li class="li1">';
						html += '<p class="p1"><span>¥'+ distributionPrice +'</span> / <span class="span2">赚¥'+cutPriceDown(costPrices)+'</span></p>';
						html += '<li class="li2" state="3" data_id="'+goodsId+'"  shop_id="'+shop_id+'" supplier_id="'+supplier_id+'">';
						
						if(isFavorites) {
							html += '<a class="a1 ative txt" data_id="'+goodsId+'"></a>';//class="a1 ative"
						} else {
							html += '<a class="a1 txt" data_id="'+goodsId+'"></a>';//class="a1 ative"
						}
						html += '<a class="a2 txt" id='+goodsId+' goodsName="'+goodsName+'" ><span class="hot-share-icon"></span></a>';
						html += '</li></ul></div>';
						if(i == 0) {
							$('#hot_products_h_t').append(html);
						} else if(i == 1) {
							$('#hot_products_h_f').append(html);
						}
					}
				} else {
					var _html = '<h3>没有商品了，去看看其他的吧</h3>';
					$('#hot_products_h_t').append(_html);
					$('#hot_products_h_f').append(_html);
				}
				
			},
			error : function(error) {
				
			}
		});
	});
	
	
	setTimeout(function () {
		/*更多推荐*/
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/hotSale',
			data : {
				pageIndex :1,
				pageSize : 10,
				userType  : distributorType,
				seq : seq,
				userName : userName
			},
			async : false,
			
			success : function(data) {
				var business = data.data;
				console.info(data.data);
				var html = '<div>';
				if (business.length > 0 && business != null) {
					for (var i = 0; i < business.length; i++) {
						var goodsName = business[i].goodsName;// 商品名
						var buyingPrice = business[i].buyingPrice;// 价格
						var thumbnail = business[i].thumbnail;// 图片路径
						var goodsId = business[i].goodsId;// 商品id
						var goodsProStandard = business[i].goodsProStandard;
						var distributionPrice = parseFloat(getDistributionPrice(goodsProStandard)).toFixed(2);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						var isDistrbutionGoods = business[i].isDistrbutionGoods;
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						var profitPrice = getProfitPrice(goodsProStandard);//分销利润价
						//求取网络店主赚多少公式
						//var costPrices = getDistributionMoney(distributorType,platformPrice,distributionPrice,profitPrice);
						var costPrices; 
						
						var _profit;
						if(isRoleAgent()) {
							_profit = goodsProStandard[0].distributionProfit//分销商利润
						} else if(isRoleDealer()) {
							_profit = numAdd(goodsProStandard[0].profitPrice, goodsProStandard[0].distributionProfit);//代理商利润
						}
						
						if(_profit != null && _profit > 0.0) {
							costPrices = _profit;
						}
						
						var shop_id=business[i].seq==null?0:business[i].seq;
						var supplier_id=business[i].supplierSeq==null?0:business[i].supplierSeq;
						var isFavorites = business[i].isFavorites;//是否收藏
						
						html += '<div class="product_list more"><dl>';
						html += '<dt><img class="good-pic lazy" src="" data-original="'+thumbnail+'" height="205" width="206" id='+goodsId+' ></dt>';
						var presellType = business[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = business[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								html += '<dd><span style="color: red">(预售商品)</span>' + goodsName + '</dd>';
							} else {
								html += '<dd>' + goodsName + '</dd>';
							}
						} else {
							html += '<dd>' + goodsName + '</dd>';
						}
						html += '<div class="tuijian_inven p6">';
						html += '<ul><li class="li1">';
						html += '<p class="p1"><span>¥'+distributionPrice+'</span> / <span class="span2">赚¥'+cutPriceDown(costPrices)+'</span></p></li>';
						html += '<li class="li2" state="'+business[i].state+'" data_id="'+goodsId+'"  shop_id="'+shop_id+'" supplier_id="'+supplier_id+'" >';
						if(isFavorites) {
							html += '<a class="a1 ative" data_id="'+goodsId+'" >&nbsp</a>';//class="a1 ative"
						} else {
							html += '<a class="a1" data_id="'+goodsId+'" >&nbsp</a>';//class="a1 ative"
						}
						html += '<a class="a2" id='+goodsId+' src='+thumbnail+' goodsName="'+goodsName+'" >&nbsp</a>';
						html += '</li></ul></div></div>';
					}
					html += '</div>';
					$("#more_recommended_x").empty();
					$('#more_recommended_x').append(html);
					$("#more_recommended_x img.lazy").lazyload({effect: "fadeIn",container:"#more_recommended_x"});
					hui('#more_recommended_x').scrollX(2.5,'.product_list');//新品上架
				} else {
					var _html = '<h3>没有商品了，去看看其他的吧</h3>';
					$("#more_recommended_x").empty();
					$('#more_recommended_x').append(_html);
				}
			},
			error : function(error) {
				
			}
		});
	  }, 500);
	
}

/*消费者1和消费者2*/
if(isRoleConsumer() || isRoleVip() || distributorType == null) {
	/*热销商品*/
	$(function() {
		var html = '';
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/goodsHot',
			data : {
				pageSize : 10,
				pageIndex :1,
				userType : distributorType
			},
			async : false,
			
			success : function(data) {
				var business = data.data;
				html += "<div>";
				if (business != null && business.length > 0) {
					for (var i = 0; i < business.length; i++) {
						var goodsName = business[i].goodsName;//商品名
						var thumbnail = business[i].thumbnail;//图片路径
						var goodsId = business[i].goodsId;//商品id
						
						var goodsProStandard = business[i].goodsProStandard;
						
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						
						html += '<div class="product_list"><dl>';
						html += '<dt><img data-original="'+thumbnail+'" class="good-click lazy" height="205" width="206" id="'+ goodsId+'" /></dt>';
						var presellType = business[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = business[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								html += '<dd><span style="color: red">(预售商品)</span>' + goodsName + '</dd>';
							} else {
								html += '<dd>' + goodsName + '</dd>';
							}
						} else {
							html += '<dd>' + goodsName + '</dd>';
						}
						html += '<dd class="price">￥'+distributionPrice +'</dd>';//改了这里的价格
						html += '</dl> </div> ';
					}
					html += '</div>';
					$("#hot_products_x").empty();
					$('#hot_products_x').html(html);
					$("#hot_products_x img.lazy").lazyload({effect: "fadeIn",container:"#hot_products_x"});
					hui('#hot_products_x').scrollX(2.5, '.product_list');//热销商品
				} else {
					html += "<h3>没有商品了，去看看其他的吧</h3>";
					$("#hot_products_x").empty();
					$('#hot_products_x').html(html);
				}
			},
			/*error : function(error) {
				hui.toast(error);
			}*/
		});
	});

	/*特价商品*/
	$(function() {
		var html = '';
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/salesPromotio',
			data : {
				pageSize : 10,
				pageIndex :1,
				userType : distributorType
			},
			async : false,
			
			success : function(data) {
				var business = data.data;
				html += '<div>';
				if (business != null && business.length > 0) {
					for (var i = 0; i < business.length; i++) {
						var goodsName = business[i].goodsName;//商品名
						var thumbnail = business[i].thumbnail;//图片路径
						var goodsId = business[i].goodsId;//商品id
						
						var goodsProStandard = business[i].goodsProStandard;
						
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						
						html += '<div class="product_list"><dl>';
						html += '<dt><img data-original="'+thumbnail+'" class="good-click lazy" height="205" width="206" id="'+ goodsId+'"  /></dt>';
						var presellType = business[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = business[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								html += '<dd><span style="color: red">(预售商品)</span>' + goodsName + '</dd>';
							} else {
								html += '<dd>' + goodsName + '</dd>';
							}
						} else {
							html += '<dd>' + goodsName + '</dd>';
						}
						html += '<dd class="price">￥'+distributionPrice+'</dd>';
						html += '</dl> </div> ';
					}
					html += '</div>';
					$("#price_x").empty();
					$('#price_x').append(html);
					$("#price_x img.lazy").lazyload({effect: "fadeIn",container:"#price_x"});
					hui('#price_x').scrollX(2.5, '.product_list');//特价商品
				} else {
					html += "<h3>没有商品了，去看看其他的吧</h3>";
					$("#price_x").empty();
					$('#price_x').append(html);
				}
			},
			/*error : function(error) {
				hui.toast(error);
			}*/
		});
	});



	/*新品上架*/
	$(function() {
		var html = '<div> ';
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/recentEvents',
			data : {
				pageSize : 10,
				pageIndex :1,
				userType  : distributorType
			},
			async : false,
			
			success : function(data) {
				var business = data.data;
				if (business != null && business.length > 0) {
					for (var i = 0; i < business.length; i++) {
						var goodsName = business[i].goodsName;//商品名
						var thumbnail = business[i].thumbnail;//图片路径
						var goodsId = business[i].goodsId;//商品id
						
						var goodsProStandard = business[i].goodsProStandard;
						
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						
						html += '<div class="product_list"><dl>';
						html += '<dt><img data-original="'+thumbnail+'" class="good-click lazy" height="205" width="206" id="'+ goodsId+'"  /></dt>';
						
						var presellType = business[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = business[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								html += '<dd><span style="color: red">(预售商品)</span>' + goodsName + '</dd>';
							} else {
								html += '<dd>' + goodsName + '</dd>';
							}
						} else {
							html += '<dd>' + goodsName + '</dd>';
						}
						
						html += '<dd class="price">￥'+distributionPrice+'</dd>';
						html += '</dl> </div> ';
					}
					html += '</div>';
					$("#new_products_x").empty();
					$('#new_products_x').append(html);
					$("#new_products_x img.lazy").lazyload({effect: "fadeIn",container:"#new_products_x"});
					hui('#new_products_x').scrollX(2.5, '.product_list');//新品上架
				} else {
					html += "<h3>没有商品了，去看看其他的吧</h3>";
					$("#new_products_x").empty();
					$('#new_products_x').append(html);
				}
			},
			/*error : function(error) {
				hui.toast(error);
			}*/
		});
	});


	/*520精选*/
	$(function() {
		var html = '';
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/recommendShop',
			data : {
				pageSize : 10,
				pageIndex :1,
				userType  : distributorType
			},
			async : false,
			success : function(data) {
				var business = data.data;
				html += '<div>';
				if (business != null && business.length > 0) {
					for (var i = 0; i < business.length; i++) {
						var goodsName = business[i].goodsName;//商品名
						var thumbnail = business[i].thumbnail;//图片路径
						var goodsId = business[i].goodsId;//商品id
						
						var goodsProStandard = business[i].goodsProStandard;
						
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						
						html += '<div class="product_list"><dl>';
						html += '<dt><img data-original="'+thumbnail+'" class="good-click lazy"  height="205" width="206" id="'+ goodsId+'"  /></dt>';
						var presellType = business[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = business[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								html += '<dd><span style="color: red">(预售商品)</span>' + goodsName + '</dd>';
							} else {
								html += '<dd>' + goodsName + '</dd>';
							}
						} else {
							html += '<dd>' + goodsName + '</dd>';
						}
						html += '<dd class="price">￥'+distributionPrice+'</dd>';
						html += '</dl> </div>';
					}
					html += '</div>';
					$("#handpick_x").empty();
					$('#handpick_x').append(html);
					$("#handpick_x img.lazy").lazyload({effect: "fadeIn",container:"#handpick_x"});
					hui('#handpick_x').scrollX(2.5, '.product_list');//520精选
				} else {
					html += "<h3>没有商品了，去看看其他的吧</h3>";
					$("#handpick_x").empty();
					$('#handpick_x').append(html);
				}
			},
			/*error : function(error) {
				hui.toast(error);
			}*/
		});
	});

	/*猜你喜欢*/
	$(function() {
		var html = '';
		$.ajax({
			type : 'POST',
			dataType : 'json',
			url : '/localQuickPurchase/commodityShow/hotSale',
			data : {
				pageSize : 10,
				pageIndex :1,
				userType : distributorType,
				seq : seq,
				userName : userName
			},
			async : false,
			
			success : function(data) {
				var business = data.data;
				html += '<div>';
				if (business != null && business.length > 0) {
					for (var i = 0; i < business.length; i++) {
						var goodsName = business[i].goodsName;//商品名
						var thumbnail = business[i].thumbnail;//图片路径
						var goodsId = business[i].goodsId;//商品id
						
						var goodsProStandard = business[i].goodsProStandard;
						
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						//如果分销价是空的话就计算
						/*if(distributionPrice == null || distributionPrice == 0) {
							var costPrice= (platformPrice*1.15).toFixed(2);
							distributionPrice = (costPrice*1.2).toFixed(2);
						}*/
						
						html += '<div class="product_list"><dl>';
						html += '<dt><img data-original="'+thumbnail+'" class="good-click lazy" height="205" width="206" id="'+ goodsId+'"  /></dt>';
						var presellType = business[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = business[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								html += '<dd><span style="color: red">(预售商品)</span>' + goodsName + '</dd>';
							} else {
								html += '<dd>' + goodsName + '</dd>';
							}
						} else {
							html += '<dd>' + goodsName + '</dd>';
						}
						html += '<dd class="price">￥'+distributionPrice+'</dd>';
						html += '</dl> </div> ';
					}
					html += '</div>';
					$("#guess_like_x").empty();
					$('#guess_like_x').append(html);
					$("#guess_like_x img.lazy").lazyload({effect: "fadeIn",container:"#guess_like_x"});
					hui('#guess_like_x').scrollX(2.5, '.product_list');//520精选
				} else {
					html += '<h3>没有商品了，去看看其他的吧</h3>';
					$("#guess_like_x").empty();
					$('#guess_like_x').append(html);
				}
			},
			/*error : function(error) {
				hui.toast(error);
			}*/
		});
	});
	
}


/*热卖商品查看更多点击跳转*/
$(document).on('click', '#hot_products_h_id', function() {
	window.location.href="/localQuickPurchase/distributionCommodityShow/hotSaleIndex";
});

/*更多推荐点击跳转*/
$(document).on('click', '#hot_products_h_gId', function() {
	window.location.href="/localQuickPurchase/distributionCommodityShow/moreProduct";
});

//特价商品查看全部专场
$(document).on('click','#price_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/salesPromotioAPP"
});

//新品上架查看全部专场
$(document).on('click','#new_products_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/recentEventsAPP"
});

//热销商品 
$(document).on('click','#hot_products_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/goodsHotAPP";
});

//520精选
$(document).on('click','#handpick_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/recommendShopAPP"
});

//猜你喜欢
$(document).on('click','#guess_like_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/hotSaleAPP"
});

//商品详情
$(document).on('click', '.good-pic', function() {
	var goodsId = $(this).attr('id');
	addGoodsHistoryBySeq(seq,goodsId);
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});
//商品详情
$(document).on('click', '.tuijian_list', function() {
	var goodsId = $(this).attr('id');
	addGoodsHistoryBySeq(seq,goodsId);
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});

//查看商品详情
$(document).on('click', '.good-click', function() {
	var goodsId = $(this).attr('id');	
	addGoodsHistoryBySeq(seq,goodsId);//新增浏览记录
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});
/*分类跳转 */
$(document).on('click', '.hui-speed-dial-icons', function() {
	var categoryId = $(this).attr('id');
	if(categoryId == "2053"){
		var id=1166;
		var genreName="营养保健";
		window.location.href="/localQuickPurchase/distributionVA/searchDetail?genreId="+id+"&genreName="+genreName;
	}else if(categoryId == "2063"){
		window.location.href="/localQuickPurchase/distributionCommodityShow/moreProductShow/2091";
	}else if(categoryId == "2052"){
		window.location.href="/localQuickPurchase/distributionCommodityShow/moreProductShow/2089";
	}else if(categoryId == "2051"){
		var id=1167;
		var genreName="中外名酒";
		window.location.href="/localQuickPurchase/distributionVA/searchDetail?genreId="+id+"&genreName="+genreName;
	}else{
		window.location.href="/localQuickPurchase/distributionCommodityShow/moreProductShow/"+categoryId;
	}
});
//信息盒子 
$(document).on('click', '.hui-icons-message', function() {
	if(isRoleConsumer() || isRoleVip()){
		window.location.href="/localQuickPurchase/distributionVA/messageTwo";
		
	} else { 
		window.location.href="/localQuickPurchase/distributionVA/messageThree";
		
	}
});


