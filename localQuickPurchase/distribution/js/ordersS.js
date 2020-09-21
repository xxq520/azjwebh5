// 查询订单参数(线下服务中心的订单管理)
var begindate; // 开始时间
var enddate;	// 结束时间
var pageIndex0 = 1; // 当前页码(待确认)
var pageIndex1 = 1; // 当前页码(已确认)
var pageIndex2 = 1; // 当前页码(已确认)
var pageSize = 10; // 一页显示多少条
var userType = 3; //  角色类型: 1 顾客,2 分销商, 3 线下服务中心
var bTime = false; // true 时间查询, false 普通查询
var seq = userSeq;	// 用户Seq
var num0; // 待确认数量
var num1; // 已确认数量
//var status = 0; // 确认状态: 0 待确认, 1 确认

$(function(){
	//登录的用户类型（1 普通用户，2 分销商，3 线下服务中心，4 成为分销商的线下服务中心）
	var distributorType = getCookie("distributorType");
	if (isRoleAgent()) {
		return window.location.href = "ordersD.jsp"
	}
});
var totalPage0; // 总页数(待确认)
var totalPage1; // 总页数(以确认)

// 初始化查询待确认订单
function initOrders0(ifEmpty) {
	var code0;
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findOrders",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seq,
			 "status" : 0,
			 "bTime" : bTime,
			 "userType" : userType,
			 "pageIndex" : pageIndex0,
			 "pageSize" : pageSize
		},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			code0 = data.code;
			if (data.code == 200) {
				var orders = data.data.distrOrders.list;
				totalPage0 = data.data.distrOrders.totalPage;
				var totalCount = data.data.distrOrders.totalCount;
				num0 = totalCount;
				$("#orders0").html("待确认("+ totalCount +")");
				if (ifEmpty) {
					$("#ordersList0").empty();
				}
				for (var i = 0; i < orders.length; i++) {
					var orderno = orders[i].orderno; // 订单号
					var date = orders[i].purchaseDate; // 下单时间
					var purchaseDate = formatDateTime(date); 
					var shopImgUrl = orders[i].shopImgUrl; // 店家图片
					var shopName = orders[i].shopName; // 店家名字
					var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额
					var returnAmount = orders[i].returnAmount.toFixed(2); // 利润金额
					var goods = orders[i].listOrderDetails;// 商品集合
					var goodsName = goods[0].goodsName;// 商品名
					var goodsImgUrl = goods[0].goodsImgUrl;// 商品图片
					
					var quantity = orders[i].listOrderDetails[0].count; // 商品数量
					var list = '<li class="mui-table-view-cell list-item">'+
									'<div class="item-head">'+
										'<div class="order-num">订单号:'+ orderno +'</div>'+
										'<div class="order-time">'+ purchaseDate +'</div>'+
									'</div>'+
									'<div class="item-content" >'+
										'<div class="content-media goDetail">'+
											'<img src="'+ goodsImgUrl +'" />'+
										'</div>'+
										'<div class="content-info goDetail">'+
											'<div class="shop-name">'+ goodsName +'</div>'+
											'<div class="shop-name" style="font-size:0.6rem;margin-top:0.4rem;color:#999;">'+ shopName +'</div>'+
											'<div>'+
												'<div class="order-money">订单总金额:'+ totalAmount +'元</div>'+
												'<div class="order-amount">商品数量:'+ quantity +'</div>'+
											'</div>'+
										'</div>'+
										'<div class="content-handle">'+
											'<div class="profit">利润: <span class="profit-num txt-red">+'+ returnAmount +'</span></div>'+
											//'<a href="javascript:;" class="btn-sure-order" id="alink">确认订单</a>'+
											'<input type="hidden" value="'+ orderno +'" class="orderno">'+
										'</div>'+
									'</div>'+
								'</li>';
					$("#ordersList0").append(list);
				}
			} else {
				muiAlert(data.message);
			}
		}
	});
	return code0;
}

//初始化查询已确认订单
function initOrders1(ifEmpty) {
	var code1;
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findOrders",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seq,
			 "status" : 1,
			 "userType" : userType,
			 "pageIndex" : pageIndex1,
			 "pageSize" : pageSize
		},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			code1 = data.code;
			if (data.code == 200) {
				var orders = data.data.distrOrders.list;
				totalPage1 = data.data.distrOrders.totalPage;
				var totalCount = data.data.distrOrders.totalCount;
				num1 = totalCount;
				$("#orders1").html("已确认("+ totalCount +")");
				if (ifEmpty) {
					$("#ordersList1").empty();
				}
				// 线下服务中心待确认
				var serverS = "";
				if (orders.orderStatus != 8) {
					serverS =	'<div class="item-footer order-fail">'+
									'<span class="font-ico"> &#xe863;</span>等待用户确认收货中...'+
								'</div>';
				}
				for (var i = 0; i < orders.length; i++) {
					var orderno = orders[i].orderno; // 订单号
					var date = orders[i].purchaseDate; // 下单时间
					var purchaseDate = formatDateTime(date); 
					var shopImgUrl = orders[i].shopImgUrl; // 店家图片
					var shopName = orders[i].shopName; // 店家名字
					var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额 
					var returnAmount = orders[i].returnAmount.toFixed(2); // 利润金额
					var serverStatus = orders[i].serverStatus; // 线下服务中心确认状态: 0 待确认, 1 确认
					var goods = orders[i].listOrderDetails;// 商品集合
					var goodsName = goods[0].goodsName;// 商品名
					var goodsImgUrl = goods[0].goodsImgUrl;// 商品图片
					var quantity = orders[i].listOrderDetails[0].count; // 商品数量
					var list = '<li class="mui-table-view-cell list-item">'+
									'<div class="item-head">'+
										'<div class="order-num">订单号:'+ orderno +'</div>'+
										'<div class="order-time">'+ purchaseDate +'</div>'+
									'</div>'+
									'<div class="item-content" >'+
										'<div class="content-media goDetail">'+
											'<img src="'+ goodsImgUrl +'" />'+
										'</div>'+
										'<div class="content-info goDetail">'+
											'<div class="shop-name">'+ goodsName +'</div>'+
											'<div class="shop-name" style="font-size:0.6rem;margin-top:0.4rem;color:#999;">'+ shopName +'</div>'+
											'<div>'+
												'<div class="order-money">订单总金额:'+ totalAmount +'元</div>'+
												'<div class="order-amount">商品数量:'+ quantity +'</div>'+
											'</div>'+
										'</div>'+
										'<div class="content-handle">'+
											'<div class="profit">利润: <span class="profit-num txt-red">+'+ returnAmount +'</span></div>'+
											//'<a href="javascript:;" class="btn-sure-order">确认订单</a>'+
											'<input type="hidden" value="'+ orderno +'" class="orderno">'+
										'</div>'+
									'</div>'+
									serverS+
								'</li>';
					$("#ordersList1").append(list);
				}
			} else {
				muiAlert(data.message);
			}
		}
	});
	return code1;
}

//初始化查询已完成订单
function initOrders2(ifEmpty) {
	var code2;
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findOrderStatus",
		dataType : "json",//设置返回值得类型
		data : {
			 "userType" : userType,
			 "seq" : seq,
			 "orderStatus" : 8,
			 "pageIndex" : pageIndex2,
			 "pageSize" : pageSize
		},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			code2 = data.code;
			if (data.code == 200) {
				var orders = data.data.distrOrders.list;
				totalPage2 = data.data.distrOrders.totalPage;
				var totalCount = data.data.distrOrders.totalCount;
				num2 = totalCount;
				$("#orders2").html("已完成("+ totalCount +")");
				if (ifEmpty) {
					$("#ordersList2").empty();
				}
				for (var i = 0; i < orders.length; i++) {
					var orderno = orders[i].orderno; // 订单号
					var date = orders[i].purchaseDate; // 下单时间
					var purchaseDate = formatDateTime(date); 
					var shopImgUrl = orders[i].shopImgUrl; // 店家图片
					var shopName = orders[i].shopName; // 店家名字
					var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额 
					var returnAmount = orders[i].returnAmount.toFixed(2); // 利润金额
					var serverStatus = orders[i].serverStatus; // 线下服务中心确认状态: 0 待确认, 1 确认
					var goods = orders[i].listOrderDetails;// 商品集合
					var goodsName = goods[0].goodsName;// 商品名
					var goodsImgUrl = goods[0].goodsImgUrl;// 商品图片
					var quantity = orders[i].listOrderDetails[0].count; // 商品数量
					var list = '<li class="mui-table-view-cell list-item">'+
									'<div class="item-head">'+
										'<div class="order-num">订单号:'+ orderno +'</div>'+
										'<div class="order-time">'+ purchaseDate +'</div>'+
									'</div>'+
									'<div class="item-content" >'+
										'<div class="content-media goDetail">'+
											'<img src="'+ goodsImgUrl +'" />'+
										'</div>'+
										'<div class="content-info goDetail">'+
											'<div class="shop-name">'+ goodsName +'</div>'+
											'<div class="shop-name" style="font-size:0.6rem;margin-top:0.4rem;color:#999;">'+ shopName +'</div>'+
											'<div>'+
												'<div class="order-money">订单总金额:'+ totalAmount +'元</div>'+
												'<div class="order-amount">商品数量:'+ quantity +'</div>'+
											'</div>'+
										'</div>'+
										'<div class="content-handle">'+
											'<div class="profit">利润: <span class="profit-num txt-red">+'+ returnAmount +'</span></div>'+
											//'<a href="javascript:;" class="btn-sure-order">确认订单</a>'+
											'<input type="hidden" value="'+ orderno +'" class="orderno">'+
										'</div>'+
									'</div>'+
								'</li>';
					$("#ordersList2").append(list);
				}
			} else {
				muiAlert(data.message);
			}
		}
	});
	return code2;
}


// 确认订单
mui("body").on("tap","#alink",function(){
	var orderno = $(this).next().val();
	var th = $(this);
	//console.log(seq);
	$.ajax({
		type : "post",//定义提交的类型
		url : "/localQuickPurchase/dOrders/updateStatus",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seq,
			 "orderno" : orderno,
			 "opType" : 3,
			 "userType" : userType
		},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				--num0;
				++num1;
				mui.toast("确认成功!");
			    $("#orders0").html("待确认("+ num0 +")"); 
			    $("#orders1").html("已确认("+ num1 +")");
				th.parents(".content-handle").parents(".list-item").remove();
				
				pageIndex1 = 1; // 刷新重置页码
				var code0 = initOrders1(true);	// 初始化查询订单
				if (code0 == 200) {
					pageIndex1++;
				}
			} else {
				muiAlert(data.message);
			}
		}
	});
});

//去订单详情
mui("body").on("tap",".goDetail",function(){
	var orderno = $(this).siblings(".content-handle").children(".orderno").val();
	window.location.href = "orderDetail.jsp?seq=" + seq + "&userType=" + userType + "&orderno=" + orderno;
	//findDetail(seq, userType, orderno);
});