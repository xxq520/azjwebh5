var orderno = getQueryString("orderno");

function init(){
	var param = {"orderno":orderno,"orderStatus":33};
	var json = findOrderDetil(param);
	console.info(json);
	if(json != null){
		if(json.code == 200){
			var list = json.data;
			if(list != null){
				//var order = list[0];
				var html = getOrderHtml(list);
				$(".all").append(html);
			}
		}
	}
}

function findOrderDetil(param){
	var json = null;
	$.ajax({
		type : "post",//定义提交的类型
		contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/dOrders/findLocaleRecruitOrderDetial",
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

function getOrderHtml(order){
	if(order == null){
		return null;
	}
	var orderno = order.orderno;
	var orders = order.listOrderDetails;
	var waybill = order.waybill;
	var orderStatus = order.orderStatus;//订单状态  待接1，已接4，已完成5   确认收货8   已删除  37   
	var deliverStatus = order.deliverStatus;//物流状态 1 待发货,  3 已收货,	4 待收货
	var deliveryMethod =  order.deliveryMethod;//发货方式
	var remark = order.remark;//备注
	if(remark == null || remark == ""){
		remark = "暂无";
	}
	var size = 50;
	if(remark != null && remark.length > size){
		remark = remark.substring(0,size);
	}
	var html ='<div class="all-header" style="padding: 0 0.5rem;">'
		html+='<div class="pull-left" style="font-size: 0.56rem; color: #666;">'
		html+='订单号：'+ orderno;
		html+='</div>'
		html+='</div>'
	for(var i = 0 ; i < orders.length ; i++){
			var goodImg = orders[i].goodsImgUrl;
			var goodsName = orders[i].goodsName;
			var count = orders[i].count;
			var amount = orders[i].amount;
			var spec = orders[i].spec;
			if(spec.substr(spec.length-1,1) == ","){
				spec = spec.substr(0,spec.length-1);
			}
			html+='<div class="good-detail">'
			html+='<div class="goods-info" style="border-bottom:none">'
			html+='<img src="'+goodImg+'" class="hui-arrow" style="height: 2.2rem;" orderno='+orderno+'>'
			html+='<div class="order-detail " >'
			html+='<span class="order-name font-lg">'+goodsName+'</span>'
			html+='<span class="order-price font-md">'+amount+'</span>'
			html+='<span class="color_gray order-attr">数量    ×'+count+' </span>'
			html+='<span class="color_red order-promise">规格：'+spec+' </span>'
			html+='</div>'
			html+='</div>'
			html+='</div>';
	}
		html += '<div><span style="font-size: 0.76rem;">备注:</span><span style="font-size: 0.76rem;">'+remark+'</span></div>';
	if(deliveryMethod !=1){
		if(waybill != null){
			initInfo(waybill);	
		}
	}else{
		$(".logistics").html("");
	}
	
	return html;
}

//物流信息
function infoH(infoList){
	if(infoList == null ){
		return null;
	}
	var infoHtml = "";
//	for(var i = infoList.length -1 ; i > 0  ; i--){
	for(var i = 0 ; i < infoList.length ; i++){
		var obj = infoList[i];
		var data = obj.date;
		var logisticsInfo = obj.logisticsInfo;
		var type = obj.type;
		//if(i == 1){
		if(i == 0){
			infoHtml += '<div class="logisticsitem itemActive" isShow=0>';
			//infoHtml += '<div class="logisticsitem">';
		}else{
			infoHtml += '<div class="logisticsitem" isShow=0>';
		}
		infoHtml += '<div class="itemState">';
		infoHtml += '<i class="roundico"></i>';
		infoHtml += '<i class="lineico"></i>';
		infoHtml += '</div>';
		infoHtml += '<div class="itemInfo">';
		infoHtml += '<p class="infoTime">'+data+'</p>';
		infoHtml += '<p class="infotxt">'+logisticsInfo+'</p>';
		infoHtml += '<p class="infoPeople">'+type+'</p>';
		infoHtml += '</div>';
		infoHtml += '</div>';
	}
	return infoHtml;
}

//获取物流信息
function getInfo(param){
	var json = null;
	$.ajax({
		type : 'GET',
		dataType : 'json',
		url : '/localQuickPurchase/logistics/info',
		data : param ,
		async : false,//是否异步请求，false为同步
		success : function(result){
			if(result.code == 200){
				json = result;
			}
		},
		error : function(error){
			hui.closeLoading();
			hui.upToast('无效的快递单号！');
			hui.endRefresh();
		}
	});
	return json;
}

function initInfo(logisticsNo){
	logisticsNo = parseInt(logisticsNo);
	var param = {"trackingNo" : logisticsNo};
	var json = getInfo(param);
	if(json != null){
		var info = infoH(json.data);
		console.info(info);
		$(".logistics").html(info);
	}
}

//http://192.168.1.66:8080/localQuickPurchase/logistics/info?trackingNo=417565486416848640
//初始化订单详情信息

//initInfo()
