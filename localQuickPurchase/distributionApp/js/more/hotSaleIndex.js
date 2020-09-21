var pageIndex = 1;
hui.refresh('.main_container', refresh);
hui.loadMore(getMore);
var seq = seq;
var isLoading = false;
var first = true;

/*热卖商品*/
//加载更多
function getMore(){	
	if(isLoading){
		return;
	}
	isLoading = true;
	var html = '';
    $.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/commodityShow/goodsHot',
		data : {
			pageIndex : pageIndex,
			seq : seq,
			userType : distributorType
		},
		async : false,
		success : function(data) {
			var business = data.data;
			if (business.length > 0) {
				for (var i = 0; i < business.length; i++) {
					var goodsName = business[i].goodsName;// 商品名
					var buyingPrice = business[i].buyingPrice;// 价格
					var thumbnail = business[i].thumbnail;// 图片路径
					var goodsId = business[i].goodsId;// 商品id
					/*var distributionPrice = business[i].distributionPrice;//分销价
					var platformPrice = business[i].platformPrice;//平台价
					var profitPrice = business[i].profitPrice;//分销利润价*/
					var goodsProStandard = business[i].goodsProStandard;
					var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
					var platformPrice = getPlatformPrice(goodsProStandard);//平台价
					var profitPrice = getProfitPrice(goodsProStandard);//分销利润价
					var isDistrbutionGoods = business[i].isDistrbutionGoods;
					
					//如果分销价是空的话就计算
//					if(distributionPrice == null || distributionPrice <= 0) {
//						var costPrice= (platformPrice*1.15).toFixed(2);
//						distributionPrice = (costPrice*1.2).toFixed(2);
//					}
					
					var _distributionProfit = goodsProStandard[0].distributionProfit;//分销商利润价
					var _profitPrice = goodsProStandard[0].profitPrice;//代理商利润价
					
					//求取网络店主赚多少公式
					//var costPrices = getDistributionMoney(distributorType,platformPrice,distributionPrice,profitPrice);
					var costPrices;
					
					if(_distributionProfit != null && _distributionProfit > 0.0 && _profitPrice != null && _profitPrice > 0.0) {
						if(isRoleAgent()) {
							costPrices = _distributionProfit;
						} else if(isRoleDealer()) {
							costPrices = numAdd(_distributionProfit, _profitPrice);
						}
					}
					
					
					var shop_id = business[i].seq == null ? 0 : business[i].seq;
					var supplier_id = business[i].supplierSeq == null ? 0 : business[i].supplierSeq;
					var isFavorites = business[i].isFavorites;//是否收藏
					
					html += '<div class="product_list more"><dl>';
					html += '<dt><img class="good-pic" src=' + thumbnail + ' height="205" width="206" id="' + goodsId + '" /></dt>';
					html += '<dd>' + goodsName + '</dd></dl>';
					html += '<div class="tuijian_inven p6"> <ul> <li class="li1">';
					html += '<p class="p1"><span>¥'+distributionPrice+'</span> / <span class="span2">赚'+parseFloat(costPrices).toFixed(2)+'</span></p></li>';
					html += '<li class="li2" state="'+business[i].state+'" data_id="'+goodsId+'"  shop_id="'+shop_id+'" supplier_id="'+supplier_id+'">';
					if(isFavorites) {
						html += '<a class="a1 ative" data_id="'+goodsId+'">&nbsp</a>';//class="a1 ative"
					} else {
						html += '<a class="a1" data_id="'+goodsId+'">&nbsp</a>';//class="a1 ative"
					}
					html += '<a class="a2" id='+goodsId+'>&nbsp</a>';
					html += '</li></ul></div></div>';
				}
				$(html).appendTo('.hui-refresh-content #list');
				pageIndex++;
	            hui.endLoadMore(false);
	            isLoading = false;
			} else {
				hui.endLoadMore(true, '已经到头了...');
                return false;
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}

//下拉刷新
function refresh(){
   /* hui.loading('加载中...');*/
    var html ='';
    $.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/commodityShow/goodsHot',
		data : {
			pageIndex : 1,
			seq : seq,
			userType : distributorType
		},
		async : false,
		success : function(data) {
			var business = data.data;
			if (business.length > 0 && business != null) {
				for (var i = 0; i < business.length; i++) {
					var goodsName = business[i].goodsName;// 商品名
					var buyingPrice = business[i].buyingPrice;// 价格
					var thumbnail = business[i].thumbnail;// 图片路径
					var goodsId = business[i].goodsId;// 商品id
					/*var distributionPrice = business[i].distributionPrice;//分销价
					var platformPrice = business[i].platformPrice;//平台价
					var profitPrice = business[i].profitPrice;//分销利润价*/
					var isDistrbutionGoods = business[i].isDistrbutionGoods;
					var goodsProStandard = business[i].goodsProStandard;
					var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
					var platformPrice = getPlatformPrice(goodsProStandard);//平台价
					var profitPrice = getProfitPrice(goodsProStandard);//分销利润价
					//如果分销价是空的话就计算
//					if(distributionPrice == null && distributionPrice == undefined) {
//						var costPrice= (platformPrice*1.15).toFixed(2);
//						distributionPrice = (costPrice*1.2).toFixed(2);
//					}

					var _distributionProfit = goodsProStandard[0].distributionProfit;//分销商利润价
					var _profitPrice = goodsProStandard[0].profitPrice;//代理商利润价
					
					//求取网络店主赚多少公式
					//var costPrices = getDistributionMoney(distributorType,platformPrice,distributionPrice,profitPrice);
					var costPrices;
					
					if(_distributionProfit != null && _distributionProfit > 0.0 && _profitPrice != null && _profitPrice > 0.0) {
						if(isRoleAgent()) {
							costPrices = _distributionProfit;
						} else if(isRoleDealer()) {
							costPrices = numAdd(_distributionProfit, _profitPrice);
						}
					}
					
					var shop_id = business[i].seq == null ? 0 : business[i].seq;
					var supplier_id = business[i].supplierSeq == null ? 0 : business[i].supplierSeq;
					var isFavorites = business[i].isFavorites;//是否收藏
					
					html += '<div class="product_list more"><dl>';
					html += '<dt><img  class="good-pic" src=' + thumbnail + ' height="205" width="206" id="' + goodsId + '" /></dt>';
					html += '<dd>' + goodsName + '</dd></dl>';
					html += '<div class="tuijian_inven p6"> <ul> <li class="li1">';
					html += '<p class="p1"><span>¥'+distributionPrice+'</span> / <span class="span2">赚'+parseFloat(costPrices).toFixed(2)+'</span></p></li>';
					html += '<li class="li2" state="'+business[i].state+'" data_id="'+goodsId+'"  shop_id="'+shop_id+'" supplier_id="'+supplier_id+'">';
					if(isFavorites) {
						html += '<a class="a1 ative" data_id="'+goodsId+'">&nbsp</a>';//class="a1 ative"
					} else {
						html += '<a class="a1" data_id="'+goodsId+'">&nbsp</a>';//class="a1 ative"
					}
					html += '<a class="a2" id='+goodsId+'>&nbsp</a>';
					html += '</li></ul></div></div>';
				}
				pageIndex = 2;
				setTimeout(function(){
					$('.hui-refresh-content #list').html(html);
		            //结束刷新
		            hui.endRefresh();
		            //重置加载更多状态
		            hui.resetLoadMore();
		            hui.loading('加载中...', true);
		            if(!first){
		            	hui.toast("下拉刷新成功");	            	
		            }
		            first = false;
				},500)
			} else {
				html += "<h3>没有商品了，去逛逛其他的吧</h3>";
				$('.hui-refresh-content #list').html(html);
				 hui.endRefresh();
		         hui.loading('加载中...', true);
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}

/*商品详情*/
$(document).on('click', '.good-pic', function() {
	var goodsId = $(this).attr('id');
	addGoodsHistoryBySeq(seq,goodsId);//新增浏览记录
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});