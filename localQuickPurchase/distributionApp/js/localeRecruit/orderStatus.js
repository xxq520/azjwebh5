//判断用户是否登录   1  强制退出
checkIsLogin(1);
var orderno = getQueryString("orderno");
var countNum = 0;
var pageIndex = 1;
var pageSize = 5;
var param = {"userSeq":seq,"orderStatus":35,"pageIndex":pageIndex,"pageSize":pageSize};
var isLoading = false;
var first = true;
var logisticsitem_height = 125;
var full_container_height = 208;
var hui_list_heigth = 0;
var backPageIndex = 1;;//控制上拉加载

function init(){
	var json = findlocaleRecruitOrder(param);
	return json;
}

function initHtml(orderList){
	var html = "";
	if(orderList == null){
		return null;
	}
	for(var i = 0 ; i < orderList.length ; i++ ){
		var bigOrder = orderList[i];
		var listOrderDetails = bigOrder.listOrderDetails;
		var orderno = bigOrder.orderno;
		var orderStatus = bigOrder.orderStatus;//订单状态  待接1，已接4，已完成5   确认收货8   已删除  37   
		var deliverStatus = bigOrder.deliverStatus;//物流状态 1 待发货,  3 已收货,	4 待收货
		var waybill = bigOrder.waybill;
		var deliveryMethod =  bigOrder.deliveryMethod;
		html += '<div class="full-container mescroll-touch">';
		html += '<div class="all" style="width: 100%;">';
		html += '<div class="all-header orderDetail" style="padding: 0 0.5rem;" orderno='+orderno+'>';
		html += '<div class="pull-left " style="font-size: 0.56rem; color: #666;">';
		html += '订单号：' + orderno;
		html += '</div>';
		html += '</div>';
		var amount = bigOrder.totalAmmount;
		for(var j = 0 ; j < listOrderDetails.length ; j ++){
			if(j == 1){
				break;
			}
			var orders = listOrderDetails[j];
			var goodImg = orders.goodsImgUrl;
			var goodsName = orders.goodsName;
			var count = orders.count;
			var spec = orders.spec;
			if(spec.substr(spec.length-1,1) == ","){
				spec = spec.substr(0,spec.length-1);
			}
			html += '<div class="good-detail">';
			html += '<div class="goods-info" style="border-bottom:none">';
			html += '<img style="height: 2.2rem;max-width: 18%" src="'+goodImg+'" class="orderDetail" orderno='+orderno+'>';
			html += ' <div class="order-detail " >';
			html += '<span class="order-name font-lg">'+goodsName+'</span>';
			html += '<span class="order-price font-md">￥'+amount+'</span>';
			html += '<span class="color_gray order-attr">数量    ×'+count+' </span>';
			html += '<span class="color_red order-promise">规格：'+spec+' </span>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
		}
		html += '<div class="order-btn font-md" style="padding: 0.5rem; height: auto; border-top: 1px #e6e6e6 solid;"">';


		if(orderStatus == 4 && deliverStatus == 4){//待收货
			if(deliveryMethod == 1){
				html += '<span style="margin-top: 0;" class="check-receive color_red isCheck-receive" state=0  count = '+countNum+' orderno='+orderno+' >确认收货</span>';
			}else{
				html += '<span style="margin-top: 0;" class="check-receive color_red isCheck-receive" state=0 count = '+countNum+' orderno='+orderno+' >确认收货</span>';
				html += '<span style="margin-top: 0;" class="check-ems ems" num = 0 count = '+countNum+' >查看物流</span>';
			}
		}else if(orderStatus == 5 && deliverStatus == 3){//已完成
			html += '<span style="margin-top: 0;" class="check-receive color_red shouhuo" state=1 count = '+countNum+' >已收货</span>';
		}else if(orderStatus ==  0){
			html += '<span style="margin-top: 0;" class="check-ems topay" num = 0 orderno = '+orderno+' count = '+countNum+' >待付款</span>';
		}else{
			html += '<span style="margin-top: 0;" class="check-ems noems" num = 0 count = '+countNum+' >待发货</span>';
		}
		html += '</div>';
		html += '</div>';
		if(orderStatus == 4 && deliverStatus == 4 && deliveryMethod !=1){
			logisticsNo = parseInt(waybill);
			var param = {"trackingNo" : logisticsNo};
			var json = getInfo(param);
			html += '<div class="logistics margin-t-3" count = '+countNum+' style="display: none; background: #fff;">';
			if(json != null){
				html += infoH(json.data);
			}
			html += '</div>';
		}

		html += '</div>';
		html += '</div>';
		countNum++;
	}
	return html;
}
//init();


hui.tab('.hui-tab',function(data){
	if(data == '1'){
		$('.footer-paid').removeClass('hui-hide');
	}
	else{
		$('.footer-paid').addClass('hui-hide');
	}
})

	$(document).on("click",".orderDetail",function(){
	var orderno = $(this).attr("orderno");
	window.location.href="/localQuickPurchase/distributionVA/localeRecruit/orderList?orderno=" + orderno;
})

//查看物流
function cancelOrder() {
	$(".logistics").show()
}

//查看物流
$(document).on("click",".ems",function(){
	var num =parseInt($(this).attr("num"));//区分隐藏还是显示
	var count = $(this).attr("count");//订单对应的物流信息
	var logistics = $('.logistics[count='+count+']');
	if(num % 2 == 0){
		num = 0;
		logistics.show();
		logistics.find(".logisticsitem").attr("isShow",1);
		var size = logistics.find(".logisticsitem").length;
		hui_list_heigth +=  size * logisticsitem_height;
	}else{
		logistics.hide();
		logistics.find(".logisticsitem").attr("isShow",0);
		var size = logistics.find(".logisticsitem").length;
		hui_list_heigth -=  size * logisticsitem_height;
	}
	$(this).attr("num",++num)
});

$(".noems").on("click",function(){
	hui.toast("客服准备为您发货");
});

//确认收货
$(document).on("click",".isCheck-receive",function(){
	var orderno = $(this).attr("orderno");
	var state = $(this).attr("state");
	if(state != 0){
		hui.toast("已收货！");
		return;
	}
	var param = {"orderno":orderno,"orderStatus":5};
	var json = updateLocaleRecruitOrder(param);
	var $check_receive = $(this);
	if(json != null){
		hui.toast("收货成功");
		var count = $check_receive.attr("count");
		$check_receive.html("已收货");
		$('.check-ems[count='+count+']').hide();
		$('.logistics[count='+count+']').hide();
		var size = $('.logistics[count='+count+']').find(".logisticsitem[isShow=1]").length;
		$('.logistics[count='+count+']').find(".logisticsitem[isShow=1]").attr("isShow",0);
		hui_list_heigth -=  size * logisticsitem_height;
		$(this).attr("state",1);
	}else{
		hui.toast("平台已发货！请刷新重试！");
	}
});


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

}

//设置插件高度
function set_hui_list_height(_pageIndex,_pageSize,listSize){
	 hui_list_heigth =  ((_pageIndex - 1) * _pageSize + (listSize % _pageSize == 0 ? listSize : (listSize % _pageSize))) * full_container_height ; 
	 var _logisticsitem_height =  $(".logisticsitem[isShow=1]").length * logisticsitem_height;
	 hui_list_heigth += _logisticsitem_height;
}

function get_hui_list_height(){
	return hui_list_heigth;
}

//下拉刷新
function refresh(){
	param.pageIndex = 1;
	var json = init();
	if(json != null){
		var list = json.data.list;
		if(list != null){
			var html = initHtml(list);
			if(html == null || html == ''){
				//hui.loading('加载中...', true);
				html = '<p class="positionContent_no">对不起,没有搜索到相关的订单!</p>';
				$(".hui-list").append(html);
				///$(".hui-tab-body").css("height","300px");
				//结束刷新
				//hui.endRefresh();
				return;
			}
			$(".hui-list").append(html);
			param.pageIndex++;
			backPageIndex = json.data.totalPage;
			var _pageSize = json.data.pageSize;
			var _pageIndex = json.data.pageIndex;
			set_hui_list_height(_pageIndex,_pageSize,list.length);
			var _height = get_hui_list_height();
			///$(".hui-tab-body").css("height",_height+"px");
			setTimeout(function(){
				//结束刷新
				//hui.endRefresh();
				//重置加载更多状态
				//hui.resetLoadMore();
				//hui.loading('加载中...', true);
				if(param.pageIndex == 1){
					hui.toast("下拉刷新成功");	            	
				}
				first = false;
			},500)
		}else{
			var _html = '<p class="positionContent">对不起,没有搜索到相关的订单!</p>';
			$('.news-list').html(_html);
			mescroll.endErr();
		//	hui.endRefresh();
	     //   hui.loading('加载中...', true);
		}
	}
	
};

//确认收货
$(".shouhuo").on("click",function(){
	hui.toast("已收货");
});

//加载更多
function getMore(){
	if(backPageIndex < param.pageIndex){
		$(".news-list").append('<div id="not" style="display:none;text-align: center;">没有更多了</div>');
		$("#not").css("display","block");
		mescroll.endErr();
		return ;
	}
	
	//++param.pageIndex;
	var json = init();
	if(json != null){
		var list = json.data.list;
		if(list != null){
			var _pageSize = json.data.pageSize;
			var _pageIndex = json.data.pageIndex;
			set_hui_list_height(_pageIndex,_pageSize,list.length);
			var html = initHtml(list);
			$(".news-list").append(html);
			//param.pageIndex = ++param.pageIndex;
			param.pageIndex++;
			backPageIndex = json.data.totalPage;
			var _height = get_hui_list_height();
			//$(".hui-tab-body").css("height",_height+"px");
			//setTimeout(function(){
				//hui.endLoadMore(false);
				if(param.pageIndex > 1){
					hui.toast("上拉刷新成功");	            	
				}
				first = false;
		}else{
			var _html = '<p class="positionContent">对不起,没有搜索到相关的订单!</p>';
			$('.news-list').html(_html);
			mescroll.endErr();
		//	hui.endRefresh();
		//	hui.endLoadMore(true);
		}
	}
}
//现场招商升级提示
if(isRoleConsumer()){
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/dOrders/isInvestment",
		dataType : "json",	//设置返回值得类型
		data : {
			"seq" : seq
		},
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			if(data.code == 200){
				$("#scancode").css('display','block'); 
			}
		}
	});
}

//去付款


$(document).on("click",".topay",function(){
	var payFlag = true;
	var orderno = $(this).attr('orderno');
	console.log("orderno: " + orderno);
	$.ajax({
		type : 'POST',
		dataType : 'json',
		async : false,	//是否异步请求，false为同步
		//contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/pay/verifyPayStatus',
		data :{
			"orderno" : orderno
		},
		success : function(data){
			if (data.status == 200) {
				//hui.iconToast(data.message, 'success');
				payFlag = data.data.payFlag;
			} else {
				payFlag = false;
				hui.iconToast("系统正在更新支付状态中,请勿重复支付!", 'error');
			}
		},
		error : function(error){
			hui.iconToast(error.message, 'error');
		}
	});
	if (payFlag) {
		payUrl(orderno, seq);
	}
});

//现场招商点击退出
$('.set-button-right').on('click',function(){
	loginOffByBack();//退出登录清除cookie缓存
    loginPage();
});

