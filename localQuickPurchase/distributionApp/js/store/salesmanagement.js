var pageIndex = 1;
var pageSize = 15;
var buyAndSellStatus = 2;//卖

var isLoading = false;
var first = true;
hui.refresh('#refreshContainer', refresh);
hui.loadMore(getMore);

function checkOrderInfo() {
	var param = {
		"seq" : seq,
		"userType" : distributorType,
		"orderStatus" : null,
		"deliverStatus" : 0,
		"buyAndSellStatus" : buyAndSellStatus,
		"pageIndex" : pageIndex,
		"pageSize" : pageSize,
        "from":"h5"
	};
	$.ajax({
		type : 'GET',
		url : '/localQuickPurchase/dOrders/checkOrderInfoV1',
		data : param,
		dataType : 'json',
		success : function(data) {
			var orderList = data.data.distrOrders.list;
			var htmlList="";
			if (orderList != null && orderList.length > 0) {
				for (var i = 0; i < orderList.length; i++) {
					// 销售额
					var totalAmmount = orderList[i].totalAmmount;
					// 时间
					var purchaseDate = formatDateTime(orderList[i].purchaseDate);
					// 利润
					var profitAmount = 0.0;
					if (isRoleAgent()) {
						profitAmount = orderList[i].profitAmount;
					} else if (isRoleDealer()) {
						profitAmount = orderList[i].totalAgentProfit;
					}
                    htmlList += '<div class="shqshopping">';
                    if(null ==orderList[i].ifBrandProduct  || 0 == orderList[i].ifBrandProduct || 4 != orderList[i].isLocaleRecruitOrders){
                            htmlList +='<div class="spn"><div class="spa_img">' +
                                '<img src="'+orderList[i].shopImgUrl+'" alt="">' +
                                '</div>' +
                                '<div>'+orderList[i].shopName+'</div>';
                    }else{
                        var shopImgUrl = orderList[i].shopImgUrl;
                        htmlList +='<img src="'+shopImgUrl+'" alt="">\n';
                        htmlList +='<div class="spn"><div class="spa_img">' +
                            '<img src="'+orderList[i].shopImgUrl+'" alt="">' +
                            '</div>' +
                            '<div>'+orderList[i].shopName+'</div>'+
                            '<div class="more"><a class="shopList" href="'+orderList[i].brandProductUrl+'"></a></div>';
                    }

                    htmlList+= '</div>';
					htmlList += '<div class="hui-accordion">'
							+ '<div class="hui-accordion-title">'
							+ '<ul class="salemana_2">' + '<li>' + purchaseDate
							+ '</li>' + '<li>￥' + profitsPoint(totalAmmount) + '</li>'
							+ '<li>￥' + profitsPoint(profitAmount) + '</li>'
							+ '</ul></div></div>';
				}
				$(htmlList).appendTo('.distributorOrders');
				pageIndex++;
				hui.endLoadMore(false);
				isLoading = false;
			} else {
				hui.endLoadMore(true, '已经到头了...');
				return false;
			}
		}
	})
}

function refreshSales() {
	var param = {
		"seq" : seq,
		"userType" : distributorType,
		"orderStatus" : null,
		"deliverStatus" : 0,
		"buyAndSellStatus" : buyAndSellStatus,
		"pageIndex" : pageIndex,
		"pageSize" : pageSize,
        "from":"h5"
	};
	$.ajax({
		type : 'GET',
		url : '/localQuickPurchase/dOrders/checkOrderInfoV1',
		data : param,
		dataType : 'json',
		success : function(data) {
			var orderList = data.data.distrOrders.list;
			var htmlList = "";
			if (orderList != null && orderList.length > 0) {
				for (var i = 0; i < orderList.length; i++) {
					// 销售额
					var totalAmmount = orderList[i].totalAmmount;
					// 时间
					var purchaseDate = formatDateTime(orderList[i].purchaseDate);
					// 利润
					var profitAmount = 0.0;
					if (isRoleAgent()) {
						profitAmount = orderList[i].profitAmount;
					} else if (isRoleDealer()) {
						profitAmount = orderList[i].totalAgentProfit;
					}
                    htmlList += '<div class="shqshopping">';
                    if(null ==orderList[i].ifBrandProduct  || 0 == orderList[i].ifBrandProduct || 4 != orderList[i].isLocaleRecruitOrders){
                        htmlList +='<div class="spn"><div class="spa_img">' +
                            '<img src="'+orderList[i].shopImgUrl+'" alt="">' +
                            '</div>' +
                            '<div>'+orderList[i].shopName+'</div>';
                    }else{
                        var shopImgUrl = orderList[i].shopImgUrl;
                        htmlList +='<img src="'+shopImgUrl+'" alt="">\n';
                        htmlList +='<div class="spn"><div class="spa_img">' +
                            '<img src="'+orderList[i].shopImgUrl+'" alt="">' +
                            '</div>' +
                            '<div>'+orderList[i].shopName+'</div>'+
                            '<div class="more"><a class="shopList" href="'+orderList[i].brandProductUrl+'"></a></div>';
                    }

                    htmlList+= '</div>';
					htmlList += '<div class="hui-accordion">'
							+ '<div class="hui-accordion-title">'
							+ '<ul class="salemana_2">' + '<li>' + purchaseDate
							+ '</li>' + '<li>￥' + profitsPoint(totalAmmount) + '</li>'
							+ '<li>￥' + profitsPoint(profitAmount) + '</li>'
							+ '</ul></div></div>';
				}

				pageIndex = 2;
				setTimeout(function() {
					$('.distributorOrders').html(htmlList);
					// 结束刷新
					hui.endRefresh();
					// 重置加载更多状态
					hui.resetLoadMore();
					hui.loading('加载中...', true);
					if (!first) {
						hui.toast("下拉刷新成功");
					}
					first = false;
				}, 500)
			} else {
				htmlList += "<p>暂时没有数据了</p>";
				$('.distributorOrders').html(htmlList);
				// 结束刷新
				hui.endRefresh();
				hui.loading('加载中...', true);
			}
		}
	})
}

// 加载更多
function getMore() {
	if (isLoading) {
		return;
	}
	isLoading = true;
	// 因渲染时获取分享图片路径找不到，固ajax方法放在jsp中
	checkOrderInfo();
}
// 下拉刷新
function refresh() {
	/* hui.loading('加载中...'); */
	pageIndex = 1;
	// 因渲染时获取分享图片路径找不到，固ajax方法放在jsp中
	refreshSales();
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