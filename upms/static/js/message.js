//普通用户
//信息盒子进来默认进入通知页面
$(function(){
	systemMessageClick();
});
 var userType = getCookie("distributorType");//用户类型
var seq = seq;//用户类型
var html = '';
var informTime = '';//系统通知时间
//系统通知信息
function systemMessageClick(){
	//seq = 0;
	userType = 1;
	$('.logisticsInformationContent').empty();//从被选元素中删除子元素
	$(".systemMessageContent").empty();
	$.ajax({
		type:"post",
		url:"/localQuickPurchase/systematicNotification/findAllSystematicNotification",
		data:{
			seq:0,
			userType:userType
		},
		dataType: "json",	//设置返回值得类型
		success:function(data){
			var systemMessage = data.data;
			if(systemMessage.length == null ||systemMessage == 0){
				//hui.iconToast("对不起,没有搜索到您要的商品!");
				html = '<p class="positionContent">暂时没有系统通知信息!</p>';
				$(".systemMessageContent").append(html);
				return;
			}
			for(var i = 0; i<systemMessage.length;i++){

				var state = systemMessage[i].state; //信息状态
				var informType = systemMessage[i].informType;//系统信息小标题
				var messageType = systemMessage[i].messageType;//系统信息类型
				var informTitle = systemMessage[i].informTitle;//信息标题
				var informContent = systemMessage[i].informContent;//信息内容
				var informImgUrl = systemMessage[i].informImgUrl;//信息图片路径
				informTime = systemMessage[i].informTime;//通知时间
				var date = formatDateTime(informTime);//转换时间格式

				//state = 0;

				if(state == 0){//未阅读
					html = ''; 
					html += '<div class="notice-item"  data-seq="'+seq+'"  data-state="'+state+'" data-informContent="'+informContent+'" data-messageType="'+messageType+'">';
					html += '<div class="notice-block unLook"><span class="point point_list">&nbsp</span> ';
					html += '<span class="hui-badge hui-danger font-sm">"'+informType+'"</span>';
					html += '<span class="font-md">"'+informTitle+'"</span>';
					html += '<span class="pull-right">"'+date+'"</span>';
					html += '</div>';
					html += '<div class="notice_detail" >';
					html += '<span class="notice_text" id="notice-message">"'+informContent+'" </span>';
					html += '<span class="notice_img"><img src="/localQuickPurchase/distributionApp/images/img_03.png" height="158" width="144"/></span>';
					html += '</div>';
					html += '</div>';
				}else{
					html = '';
					html += '<div class="notice-item" data-seq="'+seq+'"  data-state="'+state+'" data-informContent="'+informContent+'" data-messageType="'+messageType+'">';
					html += '<div class="notice-block" >';
					html += '<span class="hui-badge hui-danger font-sm">"'+informType+'"</span>';
					html += '<span class="font-md">"'+informTitle+'"</span>';
					html += '<span class="pull-right">"'+date+'"</span>';
					html += '</div>';
					html += '<div class="notice_detail">';
					html += '<span class="notice_text" id="notice-message">"'+informContent+'"</span>';
					html += '<span class="notice_img"><img src="/localQuickPurchase/distributionApp/images/img_03.png" height="158" width="144"/></span>';
					html += '</div>';
					html += '</div>';
				}
				//$(".systemMessageContent").empty();
				//$(html).appendTo('.systemMessageContent');
				$('.systemMessageContent').append(html);
				html = '';
			}

		},
		error:function(){
			
		}
	});
};
//物流信息

var deliverStatus = "";//发货状态

function logisticsInformationClick(){
	$('.logisticsInformationContent').empty();//从被选元素中删除子元素(物流)
	//seq = 3751621.0;
	$('.systemMessageContent').empty();//从被选元素中删除子元素
	$.ajax({
		type:"post",
		url:"/localQuickPurchase/dOrders/findDistributionOrders",
		data:{
			seq:seq,
			deliverStatus:4
		},
		dataType: "json",	//设置返回值得类型
		success: function(data){
			if(data.code == 404){
				html = '<p class="positionContent">暂时没有物流信息！</p>';
				$(".logisticsInformationContent").append(html);
				//hui.toast("暂时没有物流信息！");
				return;
			}
			if(data.code == 200){
				var logisticsInformation = data.data;
				if(logisticsInformation.length == 0){
					tml = '<p class="positionContent">暂时没有物流信息！</p>';
					$(".logisticsInformationContent").append(html);
					//hui.toast("暂时没有物流信息！");
					return;
				}
				for(var i = 0;i<logisticsInformation.length;i++){
					var state = logisticsInformation[i].state; //信息状态
					var orderStatus = logisticsInformation[i].orderStatus;//订单状态
					deliverStatus = logisticsInformation[i].deliverStatus;//发货状态
					var listOrderDetails = logisticsInformation[i].listOrderDetails;//商品信息
					var orderno = logisticsInformation[i].orderno;//订单号
					var waybill = logisticsInformation[i].waybill;//运单号
					var messageType = logisticsInformation[i].messageType;//盒子信息类型
					var receiveTime = logisticsInformation[i].receiveTime;//收货时间
					var deliverTime = logisticsInformation[i].deliverTime;//发货时间
					var date = formatDateTime(deliverTime);//转换时间格式
					var orderStatus = logisticsInformation[i].orderStatus;//订单状态：0待支付, 1未接单, 4已接单, 8已收货
					if(state == 0){//未阅读
						html = '';
						html += '<div class="notice-block" onclick=lineItem("'+seq+'","'+state+'","'+messageType+'","'+orderno+'","'+deliverStatus+'","'+orderStatus+'","'+waybill+'")>';
						if(orderStatus == 4 && deliverStatus == 4){
							html += '<span class="font-md posre unLook"><span class="point point_list"></span>【订单已发货】恭喜您！</span>';
						}else{
							html += '<span class="font-md posre unLook"><span class="point point_list"></span>【订单已完成】恭喜您！</span>';
							/*html += '<span class="font-md posre unLook">订单已签收</span>';*/
						}
						html += '<span class="pull-right">'+date+'</span>';
						for(var j = 0;j<listOrderDetails.length;j++){
							
							var goodsName = listOrderDetails[j].goodsName;//商品名称
							var goodsImgUrl = listOrderDetails[j].goodsImgUrl;//商品图片
							
							html += '<div class="notice_detail">';
							html += '<span class="logistics_detail">'+goodsName+'</span>';
							html += '<span class="notice_img"><img src="'+goodsImgUrl+'"/></span>';
							html += '<span class="logistics_detail color_gray margin-t-3">订单号：'+orderno+'</span>';
							html += '</div>';
						}
					}else{
						html = '';
						html += '<div class="notice-block" onclick=lineItem("'+seq+'","'+state+'","'+messageType+'","'+orderno+'","'+deliverStatus+'","'+orderStatus+'","'+waybill+'")>';
						if(orderStatus == 4 && deliverStatus == 4){
							html += '<span class="font-md posre unLook"><span></span>【订单已发货】恭喜您！</span>';
						}else{
							html += '<span class="font-md posre unLook"><span></span>【订单已完成】恭喜您！</span>';
							/*html += '<span class="font-md posre unLook">订单已签收</span>';*/
						}
						html += '<span class="pull-right">'+date+'</span>';
						for(var k = 0;k<listOrderDetails.length;k++){
							
							var goodsName = listOrderDetails[k].goodsName;//商品名称
							var goodsImgUrl = listOrderDetails[k].goodsImgUrl;//商品图片
							
							html += '<div class="notice_detail">';
							html += '<span class="logistics_detail">'+goodsName+'</span>';
							html += '<span class="notice_img"><img src="'+goodsImgUrl+'"/></span>';
							html += '<span class="logistics_detail color_gray margin-t-3">订单号：'+orderno+'</span>';
							html += '</div>';
						}
					}
					$(".logisticsInformationContent").append(html);
				}
			}
			
		},
		error: function(){
			
		}
	});
};
//跳转到订单详情并修改状态
function lineItem(seq,state,messageType,orderno,deliverStatus,orderStatus,waybill){
	//alert(seq+','+state+','+messageType+','+waybill);
	//修改状态
	state = 1;//已阅读
	$.ajax({
		type:"post",
		url:"/localQuickPurchase/informationBox/updateInfomationBoxState",
		data:{
			seq:seq,
			state:state,
			waybill:waybill,
			userType:null,
			messageType:messageType
		},
		dataType: "json",	//设置返回值得类型
		success: function(data){
			orderMessage(seq,orderno,userType,deliverStatus,orderStatus);
			if(data.code == 200){
				//alert("更新成功!");
			}
		},
		error:function(){
			
		}
	});
	//跳转到订单详情页面
	//window.location.href = "/localQuickPurchase/distributionVA/order/orderDetail?orderNo="+orderno+"&seq="+seq+"&userType="+userType+"&deliverStatus="+deliverStatus+"&orderStatus="+orderStatus;
};
//跳转订单详情
function orderMessage(seq,orderno,userType,deliverStatus,orderStatus){
	
	window.location.href = "/localQuickPurchase/distributionVA/order/orderDetail?orderNo="+orderno+"&seq="+seq+"&userType="+userType+"&deliverStatus="+deliverStatus+"&orderStatus="+orderStatus;

};

//修改系统信息的状态
function systemStateUpdate(seq,informContent,state,messageType){
	state = 1;//已阅读
	//alert(seq,informTitle,state,messageType);
	$.ajax({
		type:"post",
		url:"/localQuickPurchase/systematicNotification/updateSystematicNotificationState",
		data:{
			seq:seq,
			state:state,
			informContent:informContent,
			messageType:messageType,
			userType:userType
		},
		dataType: "json",	//设置返回值得类型
		success: function(data){
			if(data.code == 200){
				//alert("更新成功!");
			}
		},
		error:function(){
			
		}
	});
};
//店主私信
function privateMessageClick(){
	$('.systemMessageContent').empty();//从被选元素中删除子元素(系统通知)privateChat
	$('.logisticsInformationContent').empty();//从被选元素中删除子元素(物流)
	html = '<p class="positionContent">暂时没有信息!</p>';
	$(".privateChat").append(html);
	//hui.toast("暂无消息！");
};

//转化时间格式
function formatDateTime(inputTime) {    
    var date = new Date(inputTime);  
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
   /* var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  */
    /*var minute = date.getMinutes();   
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    return y + '-' + m + '-' + d+'  '+h+':'+minute+':'+second;*/
    //return y + '-' + m + '-' + d+' &nbsp;'+h+':'+minute;  
    return y + '-' + m + '-' + d;
};
//点击取消系统通知小红点
$("body").on("click",".notice-item",function(){
	var seq = $(this).attr("data-seq");
	var informContent = $(this).attr("data-informContent");
	var state = $(this).attr("data-state");
	var messageType = $(this).attr("data-messageType");
	systemStateUpdate(seq,informContent,state,messageType);
	$(this).find(".notice-block").removeClass("unLook");
	//删除红点
	$(this).find(".point").remove();
});

$("body").on("click",".logisticsInformationContent .notice-block",function(){
	$(this).find(".font-md").removeClass("unLook");
});




