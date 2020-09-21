    //获取支付页面列表的高度，如果高度大于150，让它出现滚动条
	var goodslist = document.getElementById(".payorder-detail");
	var height = goodslist.offsetHeight;
	if(height>150){
		$(".payorder-detail").css("overflow-y",'scroll');
	}
	