// 查询订单参数(分销业绩)
//var begindate; // 开始时间
//var enddate;	// 结束时间
var pageIndex; // 当前页码
var pageSize = 10; // 一页显示多少条
var userType = 2; //  角色类型: 1 顾客,2 分销商, 3 线下服务中心
var bTime; // true 时间查询, false 普通查询
var seq = userSeq;	// 用户Seq
var totalPage; // 总页数
var bempty; // true 清空, false 不清空
//var status = 0; // 确认状态: 0 待确认, 1 确认1

//登录的用户类型（1 普通用户，2 分销商，3 线下服务中心，4 成为分销商的线下服务中心）
var distributorType = getCookie("distributorType");
if (distributorType != 2) {
	
}

//跳到趋势图
function incomeTable() {
	//window.open("/localQuickPurchase/distribution/html/personalCenter/incomeTable.jsp?seq="+ seq+ "&userType="+ userType);
	location.href="/localQuickPurchase/distribution/html/personalCenter/incomeTable.jsp?seq="+ seq+ "&userType="+ userType;
};

//初始化查询确认订单(分销商查询业绩)
function initOrders2(bTime, pageIndex, begindate, enddate, bempty) {
	var code;
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findOrders",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seq,
			 "status" : 1,
			 "bTime" : bTime,
			 "userType" : userType,
			 "pageIndex" : pageIndex,
			 "pageSize" : pageSize,
			 "begindate" : begindate,
			 "enddate" : enddate
			 
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			code = data.code;
			if (data.code == 200) {
				var orders = data.data.distrOrders.list;
				totalPage = data.data.distrOrders.totalPage; // 总页数
				$(".returnAmount").html(data.data.returnAmount.toFixed(2)); // 利润总金额
				$(".totalAmount").html(data.data.totalAmount.toFixed(2)); // 订单总金额
				if (bempty) {
					$("#accountlist").empty();
				}
				/*if (orders.length == 0 || orders == null) {
					$("#accountlist").html("<span style='color:red;'>没有查询到数据!</span>");
				}*/
				for (var i = 0; i < orders.length; i++) {
					var orderno = orders[i].orderno; // 订单号
					var date = orders[i].purchaseDate; // 下单时间
					var purchaseDate = formatDateTime(date);
					var shopImgUrl = orders[i].shopImgUrl; // 店家图片
					var shopName = orders[i].shopName; // 店家名字
					var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额 
					var returnAmount = orders[i].returnAmount.toFixed(2); // 利润金额
					var serverStatus = orders[i].serverStatus; // 线下服务中心确认状态: 0 待确认, 1 确认
					
					var quantity = orders[i].listOrderDetails[0].count; // 商品数量
					/*var serverS;
					if (serverStatus == 1) {
						// 线下服务中心已确认
						serverS =	'<div class="item-footer order-fail">'+
												'<span class="font-ico"> &#xe863;</span>等待先线下服务中心确认订单中...'+
									'</div>';
					} else {
						// 线下服务中心待确认
						serverS = '<div class="item-footer">'+
												'<div class="order-success order-state-ico"><span class="font-ico">&#xe9c7;</span></div>线下服务中心已确认订单'+
								   '</div>';
					}*/
					var list = '<li class="mui-table-view-cell list-item">'+
									'<div class="item-head">'+
										'<div class="order-time">'+ purchaseDate +'</div>'+
										'<div class="order-num">订单号:'+ orderno +'</div>'+
									'</div>'+
									'<div class="item-content mui-tab-item" target="shopDetail.html">'+
										'<div class="content-media">'+
											'<img src="'+ shopImgUrl +'" />'+
										'</div>'+
										'<div class="content-info">'+
											'<div class="shop-name">'+ shopName +'</div>'+
											'<div>'+
												'<div class="order-money">订单总金额:'+ totalAmount +'元</div>'+
												'<div class="order-amount">商品数量:'+ quantity +'</div>'+
											'</div>'+
										'</div>'+
										'<div class="content-handle">'+
											'<div class="profit">利润: <span class="profit-num txt-red">+'+ returnAmount +'</span></div>'+
											//'<a href="orderDetail.html" class="btn-sure-order alink">确认订单</a>'+
										'</div>'+
										//serverS +
									'</div>'+
								'</li>';
					$("#accountlist").append(list);
				}
			} else {
				//alert(data.message);
			}
		}
	});
	
	return code;
}