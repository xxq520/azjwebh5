
/*var orderno = getQueryString("orderno");*/


//判断用户是否登录
checkIsLogin(1);
var countNum = 0;

var pageIndex = 1;
var pageSize = 10;
var backPageIndex = 1;;//控制上拉加载
/*插件高度变量*/
var logisticsitem_height = 135;
var full_container_height = 208;
/*插件高度变量*/

var deliveryMethod = 99;

//请求参数
var param = {seqSeller:seq,orderStatus:33,deliveryMethod:deliveryMethod,pageIndex:1,pageSize:10};
///-hui.refresh('#refreshContainer', refresh);
///-hui.loadMore(getMore);

var isLoading = false;
var first = true;
var backPageSize;//控制上拉加载
function findlocaleRecruitOrder(param){
	var json = null;
	$.ajax({
		type : "post",//定义提交的类型
		contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/dOrders/findLocaleRecruitOrder",
		dataType : "json",//设置返回值得类型
		data : JSON.stringify(param) ,
		async : false,//是否异步请求，false为同步
		success : function(result) {//成功返回值执行函数 
			if(result.code == 200){
				//json = result.data.list;
				json = result;
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
		}
	});
	return json;
}
//设置插件高度
function set_hui_list_height(_pageIndex,_pageSize,listSize){
	 hui_list_heigth =  ((_pageIndex - 1) * _pageSize + (listSize % _pageSize == 0 ? listSize : (listSize % _pageSize))) * full_container_height ; 
	 var _logisticsitem_height =  $(".logisticsitem[isShow=1]").length * logisticsitem_height;
	 hui_list_heigth += _logisticsitem_height;
}

function init(){
	//var param = {seqSeller:0,orderStatus:33,deliveryMethod:deliveryMethod};
	var json = findlocaleRecruitOrder(param);
	if(json != null){
		var list = json.data.list;
		if(list != null){
			var html = initHtml(list);
			if(html == '' || html == null){
				html = '<p class="positionContent_no">对不起,没有搜索到相关的订单!</p>';
				//$(".hui-tab-body").css("height","300px");
			}
			if(param.deliveryMethod == 5){
				$("#wo").append(html);
			}else{
				$("#arder").append(html);
			}
			var _pageSize = json.data.pageSize;
			var _pageIndex = json.data.pageIndex;
			set_hui_list_height(_pageIndex,_pageSize,list.length);
			backPageIndex = json.data.totalPage;
			var _height = hui_list_heigth;
			param.pageIndex++;
			mescroll.endSuccess(); //无参
			if(_height == 0){
				_height = 300;
				$("#hui-load-more").hide();
			}else{
				//$("#hui-load-more").show();
			}
			$(".hui-tab-body").css("height",_height+"px");
			var hasNext = json.data.hasNextPage;
			//setTimeout(function(){
				//结束刷新
				///-hui.endRefresh();
				//重置加载更多状态
				///-hui.resetLoadMore();
				///-hui.loading('加载中...', true);
				if(param.pageIndex == 1){
					hui.toast("下拉刷新成功");	            	
				}
				first = false;
			//},3000)
			//param.pageIndex++;
			if(hasNext){
				$("#hui-load-more").html("下拉加载更多");
			}
		}else{
			var orderHtml = "没有相关的订单";
			if(param.deliveryMethod == 5){
				$("#wo").append(orderHtml);
			}else{
				$("#arder").append(orderHtml);
			}
			mescroll.endErr();
		}
		///-hui.endLoadMore(false);
	}
}



$(document).on("click",".hui-arrow",function(){
	var orderno = $(this).attr("orderno");
	window.location.href="/localQuickPurchase/distributionVA/localeRecruit/orderList?orderno=" + orderno;
});
/*$(document).on("click",".good-detail",function(){
	var orderno = $(this).attr("orderno");
	window.location.href="/localQuickPurchase/distributionVA/localeRecruit/orderList?orderno=" + orderno;
});*/


/*var scancodeState = 0;// 0 标示有未处理的订单
function tanchuan(){
	console.info(scancodeState+"=========");
	if(scancodeState == 1){
		return;
	}
	var param = {seqSeller:seq,orderStatus:33,deliveryMethod:0,pageIndex:1,pageSize:10};
	var json = findlocaleRecruitOrder(param);
	if(json != null){
		var list = json.data.list;
		for(var i = 0 ; i < list.length ; i++){
			var order = list[i];
			var orderno = order.orderno;
			var scancode_length = $(".scancode").length;;
			if(scancode_length > 0){
				$("#orderno").html(orderno);
			}else{
				var html = '';
				html += '<div class="scancode" style="display:none;">';
				html += '<div class="set-goods-2" >';
				html += '<div class="set-goods-2-title" style="padding-top: 0.3rem;">';
				html += '发货提示';
				html += '</div>';
				html += '<div class="set-goods-2-content">';
				html += '<p>您有一个订单为：<span id="orderno">'+orderno+'</span>的订单已付款，请选择发货方式</p>';
				html += '<div class="set-goods-2-bottom">';
				html += '<button class="set-button-left my">我发货</button>';
				html += '<button class="set-button-right platform">平台发货</button>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
			$("html").append(html);
			}
			scancodeState = 1;
			$(".scancode").show();
			break;
			
		}
	}
}

//平台发货
//$(".platform").on("click",function(){
$(document).on("click",".platform",function(){
	var orderno = $("#orderno").html();
	var json = fahuo(2,orderno);
	if(json != null){
		hui.toast("发货成功");
	}else{
		hui.toast("发货失败");
	}
})

//我发货
//$(".my").on("click",function(){
$(document).on("click",".my",function(){
	var orderno = $("#orderno").html();
	var json = fahuo(1,orderno);
	if(json != null){
		hui.toast("发货成功");
	}else{
		hui.toast("发货失败");
	}
})

//发货方式    state的值 1 自己发货(代理商) 2 平台发货   3  补充发货(代理商触发的)
function fahuo(state,orderno){
	scancodeState = 0;
	console.info(scancodeState+"=========");
	//var orderno = $("#orderno").html();
	var param = {"orderno":orderno,"deliveryMethod":state,"orderStatus":2};
	var json = updateLocaleRecruitOrder(param);
	$(".scancode").hide();
	return json;

}

//定时器检查是否有未发货的订单
setInterval("tanchuan()",3000);






//更新订单状态
function updateLocaleRecruitOrder(param){
	var json = null;
	$.ajax({
		type : "post",//定义提交的类型
		contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/dOrders/updateLocaleRecruitOrder",
		dataType : "json",//设置返回值得类型
		data : JSON.stringify(param) ,
		async : false,//是否异步请求，false为同步
		success : function(result) {//成功返回值执行函数 
			if(result.code == 200){
				//json = result.data.list;
				json = result;
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
		}
	});
	return json;

}*/




function initHtml(orderList){
	if(orderList == null){
		return null;
	}
	var html = "";
	for(var i = 0 ; i < orderList.length ; i++){
		var order = orderList[i];
		var listOrderDetails = order.listOrderDetails;
		var goodImg = '';
		var smallHtml = "";
		var orderStatus = order.orderStatus;
		var deliverStatus = order.deliverStatus;
		var deliveryMethod = order.deliveryMethod;
		var orderno = order.orderno;
		var totalAmmount = order.totalAmmount;//总价
		var freight = order.logisticsPrice;//运费
		var isLogistic = order.isLogistic;//是否是偏远地区
		var totalAgentProfit = order.totalAgentProfit;//赚多少钱
		for(var j = 0 ; j < listOrderDetails.length ; j++){
			if(j == 1){
				break;
			}
			var orders = listOrderDetails[j];
			if(j == 0){
				goodImg = orders.goodsImgUrl;
			}
			var goodsName = orders.goodsName;
			var count = orders.count;
			smallHtml += '<span class="order-name font-lg">'+goodsName+'</span>';
			smallHtml += '<span class="color_gray order-attr">数量    ×'+count+' </span>';
		}

		html += '<div class="full-container">';
		html += '<div class="all" style="width: 100%;">';
		html += '<div class="all-header hui-arrow tt-arrow" style="padding: 0 0.5rem;" orderno='+orderno+'>';
		html += '<div class="pull-left" style="font-size: 0.56rem; color: #666;">';
		html += '订单号：' + orderno;
		html += '</div>';
		if(isLogistic != null && "1" == isLogistic){
			html += '<div style="float: right;font-size: 0.6rem;">';
		}
		if(deliveryMethod == "1"){
			html += '<span style="font-size: .68rem;color: red;margin-left: .2rem;border-radius: 15px;border: 1rem;float: right;">我发货</span>';
		}else if(deliveryMethod == "2"){
			html += '<span style="font-size: .68rem;color: red;margin-left: .2rem;border-radius: 15px;border: 1rem;float: right;">平台发货</span>';
		}
		html += '</div>';
		html += '</div>';
		html += '<div class="good-detail" orderno='+orderno+'>';
		html += '<div class="goods-info" style="border-bottom:none">';
		html += '<img style="height: 3.2rem;" src="'+goodImg+'"  class="hui-arrow" orderno='+orderno+'>';
		html += '<div class="order-detail" >';
		html += smallHtml;
		html += '</div>';
		html += '<div class="pull-right" style="height: 100%;">';

		if(orderStatus == 4 && deliverStatus == 4){
			if(deliveryMethod == 1){
				html += '<span class="check-receive color_red supplement1" isSupplement = 0 isLogistic='+isLogistic+' orderno='+orderno+'>等待客户收货</span>';
			}else{
				html += '<span class="check-receive color_red waitDelivery" isSupplement = 1 orderno='+orderno+'>等待客户收货</span>';
			}
		}else if(orderStatus == 5 && deliverStatus == 3){
			html += '<span class="check-receive color_red isDelivery ">已收货</span>';
		}else if(deliveryMethod == 3){
			html += '<span class="check-receive color_red">已补充发货</span>';
		}else{
			html += '<span class="check-receive color_red wait">待发货</span>';
		}
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="order-btn font-md" style="height: auto; border-top: 1px #e6e6e6 solid;margin: .5rem 1rem 0rem;">';
		html += '<span class="font-md" style="float:left;color:red;">我的收益: ￥'+(totalAgentProfit == null?0:totalAgentProfit)+'</span>';
		html += '<span class="font-md">共'+listOrderDetails.length+'件商品</span>';
		html += '<span class="font-md">';
		html += '应付：';
		html += '<span class="color_red" style="margin-top: 0;">';
		html += '￥<span class="font-lg">'+totalAmmount+'</span>';
		html += '<span class="font-sm"></span>';
		html += '</span>';
		//html += '<span class="font-sm color_gray">（含运费：'+(freight)+'）</span>';
		html += '</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';

	}
	return html;
}

hui.tab('.hui-tab',function(data){
	if(data == '1'){
		$('.footer-paid').removeClass('hui-hide');
		if(param.deliveryMethod != 6){
			param.pageIndex = 1;
			//param.deliveryMethod = 6;
			$("#arder").html("");
			hui.refresh('#arder', refresh);
			
		}
	}else{
		$('.footer-paid').addClass('hui-hide');
		if(param.deliveryMethod != 5){
			param.pageIndex = 1;
			//param.deliveryMethod = 5;
			$("#wo").html("");
			hui.refresh('#wo', refresh);
		}
	}

})
/*$(".hui-tab-body").css("height","1500px");*/
function refresh(){
	$("#wo").html("");
	$("#arder").html("");
	param.pageIndex = 1;
	setTimeout(function(){
		init(deliveryMethod);
	},600);
}

//待发货
$(document).on("click",".wait",function(){
		hui.toast("客服准备为您发货！");
});

//已收货
$(document).on("click",".isDelivery",function(){
		hui.toast("已经收货！");
});

//已收货
$(document).on("click",".waitDelivery",function(){
		hui.toast("等待用户收货！");
});


//补充发货
$(document).on("click",".supplement",function(){
	var isSupplement = $(this).attr("isSupplement");
	if(isSupplement == "1"){
		hui.toast("已经补充发货");
		return;
	}
	var $this = $(this);
	var orderno = $(this).attr("orderno");
	var isLogistic = $(this).attr("isLogistic");
	if(isLogistic != null && isLogistic == 1){
		hui.confirm("此订单为偏远地区订单", ['取消','补发'], function(){
			var json = fahuo(3,orderno);
			if(json != null){
				hui.toast("补充发货成功");
				$this.html("已补充发货");
				$this.attr("isSupplement","1");
			}else{
				hui.toast("用户已收货，请刷新重试");
				setTimeout(function(){
					hui.refresh('#refreshContainer', refresh);
				},3000);
			}
		},function(){
			
		});
	}else{
		var json = fahuo(3,orderno);
		if(json != null){
			hui.toast("补充发货成功");
			$(this).html("已补充发货");
			$(this).attr("isSupplement","1");
		}else{
			hui.toast("用户已收货，请刷新重试");
			setTimeout(function(){
				hui.refresh('#refreshContainer', refresh);
			},3000);
		}
	}
});
//上啦
function getMore(){
	if(backPageIndex < param.pageIndex){
		$("#hui-load-more").html("已经到底部");
		$("#not").css("display","block");
		//hui.endLoadMore(true);
		return ;
	}
	
	init(deliveryMethod);
	///-hui.endLoadMore(false);
	///-hui.endRefresh();
	//hui.loading('加载中...', true);
	if(param.pageIndex > 1){
		hui.toast("上拉刷新成功");	            	
	}
	
	//hui.endLoadMore(true, '已经到头了...');
}

//hui.refresh('#arder', refresh);