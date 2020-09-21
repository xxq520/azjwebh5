
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
					if(distributionPrice == null || distributionPrice == 0) {
						var costPrice= (platformPrice*1.15).toFixed(2);
						distributionPrice = (costPrice*1.2).toFixed(2);
					}
					
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
					if(distributionPrice == null || distributionPrice == 0) {
						var costPrice= (platformPrice*1.15).toFixed(2);
						distributionPrice = (costPrice*1.2).toFixed(2);
					}
					
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
					if(distributionPrice == null || distributionPrice == 0) {
						var costPrice= (platformPrice*1.15).toFixed(2);
						distributionPrice = (costPrice*1.2).toFixed(2);
					}
					
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
					if(distributionPrice == null || distributionPrice == 0) {
						var costPrice= (platformPrice*1.15).toFixed(2);
						distributionPrice = (costPrice*1.2).toFixed(2);
					}
					
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
					if(distributionPrice == null || distributionPrice == 0) {
						var costPrice= (platformPrice*1.15).toFixed(2);
						distributionPrice = (costPrice*1.2).toFixed(2);
					}
					
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


//查看商品详情
$(document).on('click', '.good-click', function() {
	var goodsId = $(this).attr('id');	
	addGoodsHistoryBySeq(seq,goodsId);//新增浏览记录
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});
/*查看更多点击事件*/
//热销商品 
$(document).on('click','#hot_products_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/goodsHotAPP";
});
//特价商品
$(document).on('click','#price_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/salesPromotioAPP"
});
//新品上架
$(document).on('click','#new_products_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/recentEventsAPP"
});
//520精选
$(document).on('click','#handpick_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/recommendShopAPP"
});
//猜你喜欢
$(document).on('click','#guess_like_x_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/hotSaleAPP"
});

/*//成为代理商
$(document).on('click','#one_agent_id',function(){
	window.location.href="/localQuickPurchase/commodityShow/openStore.html"
});*/
//查看订单
$(document).on('click','#one_agent_id',function(){
//	window.location.href="/localQuickPurchase/dOrders/submitOrder"
	window.location.href="/localQuickPurchase/distributionVA/order/index";
});

var condition = condition(0);

//消费者消息盒子
$(document).on('click', '#boxInformation', function() {
	window.location.href="/localQuickPurchase/distributionVA/messageTwo";
});

//搜索页面
$(document).on('click', '#searchKey', function() {
	window.location.href="/localQuickPurchase/distributionVA/historySearch";
});


/* js定位*/
/*$(function() {
	var nBMapPosition =getCookie("BMapPosition");
	if(nBMapPosition == ""){
		getLocalCity()
	}else{
		var  ption=JSON.parse(nBMapPosition);
		try{
			$(".localCity").text(ption.address.city);
		}catch(e){
			
		}
	}
});*/
function getLocalCity(){
		 /*$.ajax({
				type : 'POST',
				dataType : 'json',
				url : 'http://restapi.amap.com/v3/ip?key=494512821a86d6095cf5c5911a2d08f6',
				data : {
					pageSize : 10,
					pageIndex :1
				},
				async : true,
				
				success : function(data) {
					var business = data.status;
					if (business == '1') {
						$(".localCity").text(data.city);
						var rectangle=data.rectangle;//左下右上对标对
						var latlng=rectangle.split(";");
						if(latlng.length == 2){
							var lngAndLat1=latlng[0].split(",");
							var lngAndLat2=latlng[1].split(",");
							var lngAVG=(lngAndLat1[0]+lngAndLat2[0])/2;
							var latAVG=(lngAndLat1[1]+lngAndLat2[1])/2;
						}
					} else {
						
					}
				},
				error : function(error) {
					alert(error);
				}
			});*/
	/*//百度地图API功能
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(116.331398,39.897445);
	map.centerAndZoom(point,12);
	//ip定位
	function myFun(result){
		var cityName = result.name;
		map.setCenter(cityName);
		hui.toast("当前定位城市:"+cityName);
		hui.toast('定位成功！！')
	}
	var myCity = new BMap.LocalCity();
	myCity.get(myFun);*/
	//浏览器定位
	/*var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			setCookie('BMapPosition', JSON.stringify(r),0.041);//存30分钟的cookie
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
			map.panTo(r.point);
			//alert("当前城市为："+r.address.city);
			$(".localCity").text(r.address.city);
			hui.toast('定位成功！！')
			//alert('您的位置：'+r.point.lng+','+r.point.lat);
			console.log(r.point.lat+','+r.point.lng);
		}
		else {
			hui.toast("定位失败！！")
			//alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true});
*/
}
function getLocalDetail(lng,lat){
	
}
//点击定位
$(document).on('click','.localCity',function(){
	getLocalCity();
});

