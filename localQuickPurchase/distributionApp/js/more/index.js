
function invincible(business) {
	var html = '';
	for (var i = 0; i < business.length; i++) {
		var goodsName = business[i].goodsName;
		var thumbnail = business[i].thumbnail;
		var goodsId = business[i].goodsId;
		var goodsProStandard = business[i].goodsProStandard;
		var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
		var platformPrice = getPlatformPrice(goodsProStandard);//平台价
		//如果分销价是空的话就计算
		if(distributionPrice == null || distributionPrice == 0) {
			var costPrice= (platformPrice*1.15).toFixed(2);
			distributionPrice = (costPrice*1.2).toFixed(2);
		}
		html += "<li><div class='hotSaleImg'>";
		html += '<img id="'+ goodsId+'" src="' + thumbnail + '" class="good-pic" />';
		html += "</div>";
		
		var presellType = business[i].presellType;
		if(presellType != null && presellType == 1) {
			var endTime = business[i].endTime;
			var date = Date.parse(new Date());
			if(endTime > date) {
				html += '<p class="hotSaleTitle"><span style="color: red">(预售商品)</span>' + goodsName + '</p>';
			} else {
				html += '<p class="hotSaleTitle">' + goodsName + '</p>';
			}
		} else {
			html += '<p class="hotSaleTitle">' + goodsName + '</p>';
		}
		
		html += '<p class="hotSalePrice"><span>￥</span>' + distributionPrice + '</p></li>';
	}
	return html;
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

/*首页    豆干 广告*/
$(document).on('click', '.dessert2', function() {
	var goodsId ="5a97b40d45cefc02a4a9f325";
	if(seq == null || seq == 0) {
		seq = 0;
	}
	///localQuickPurchase/distributionVA/goodsDetail/5a9797cc45cefc02a4a9f2de/0/0
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/5a97b40945cefc02a4a9f324/0/0"+goodsId+"/0/"+seq;
});
/*首页 酒广告*/
$(document).on('click', '.dessert1', function() {
	var goodsId ="5a9797cc45cefc02a4a9f2de";
	if(seq == null || seq == 0) {
		seq = 0;
	}
	///localQuickPurchase/distributionVA/goodsDetail/5a97b40945cefc02a4a9f324/0/0
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/5a9797cc45cefc02a4a9f2de/0/0"+goodsId+"/0/"+seq;
});