// 查询订单参数(分销商的订单管理)
var begindate; // 开始时间
var enddate;	// 结束时间
var pageIndex0=1; // 当前页码
var hasNextPage0=true; 
var pageIndex1=1; // 当前页码
var hasNextPage1=true;
var pageIndex2=1; // 当前页码
var hasNextPage2=true; 
var pageSize=10; // 一页显示多少条
var userType=1; //  角色类型: 1 顾客,2 分销商, 3 线下服务中心
var bTime = false; // true 时间查询, false 普通查询
var seq = userSeq;	// 用户Seq
var num1; // 已确认的订单数量
var num2; // 已收货的订单数量
if(seq==0){
	location.href="login.jsp";
}
//var status = 0; // 确认状态: 0 待确认, 1 确认
if (distributorType != "1" && distributorType != "") {
	$(".orderA-tab").show();
}

// 初始化查询待确认订单
function initOrders0() {
	//登录的用户类型（1 普通用户，2 分销商，3 线下服务中心，4 成为分销商的线下服务中心）
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findOrders",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seq,
			 "status" : 0,
			 "bTime" : bTime,
			 "userType" : userType,
			 "pageSize":pageSize,
			 "pageIndex":pageIndex0
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				pageIndex0++; // 当前页码
				var orders = data.data.distrOrders.list;
				hasNextPage0=data.data.distrOrders.hasNextPage;
				$(".order0").text("待确认("+data.data.distrOrders.totalCount+")");
				for (var i = 0; i < orders.length; i++) {
					var orderno = orders[i].orderno; // 订单号
					var date = orders[i].purchaseDate; // 下单时间
					var purchaseDate = formatDateTime(date); 
					var shopImgUrl = orders[i].shopImgUrl; // 店家图片
					var shopName = orders[i].shopName; // 店家名字
					var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额
					//var returnAmount = orders[i].returnAmount; // 利润金额
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
											//'<div class="profit">利润: <span class="profit-num txt-red">+'+ returnAmount +'</span></div>'+
											//'<a href="javascript:;" class="btn-sure-order alink">确认订单</a>'+
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
}

//初始化查询确认订单
function initOrders1() {
	//登录的用户类型（1 普通用户，2 分销商，3 线下服务中心，4 成为分销商的线下服务中心）
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findOrders",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seq,
			 "status" : 1,
			 "userType" : userType,
			 "pageIndex":pageIndex1,
			 "pageSize":pageSize
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				pageIndex1++; // 当前页码
				num1 = data.data.distrOrders.totalCount;
				$(".order1").text("已确认("+ num1 +")");
				var orders = data.data.distrOrders.list;
				hasNextPage1=data.data.distrOrders.hasNextPage;
				for (var i = 0; i < orders.length; i++) {
					var orderno = orders[i].orderno; // 订单号
					var date = orders[i].purchaseDate; // 下单时间
					var purchaseDate = formatDateTime(date); 
					var shopImgUrl = orders[i].shopImgUrl; // 店家图片
					var shopName = orders[i].shopName; // 店家名字
					var goods = orders[i].listOrderDetails;// 商品集合
					var goodsName = goods[0].goodsName;// 商品名
					var goodsImgUrl = goods[0].goodsImgUrl;// 商品图片
					/*var returnAmount = orders[i].returnAmount;
					if (returnAmount!= null) {
						returnAmount = returnAmount.toFixed(2); // 利润金额
					} else {
						returnAmount = 0.0;
					}*/
					var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额
					var distributorStatus = orders[i].distributorStatus; // 分销商确认状态: 0 待确认, 1 确认
					var serverStatus = orders[i].serverStatus; // 服务商商确认状态: 0 待确认, 1 确认
					var isComplain = orders[i].isComplain; 
					var orderStatus = orders[i].orderStatus; // 订单状态
					var quantity = orders[i].listOrderDetails[0].count; // 商品数量
					var serverS="";
					if (distributorStatus == 1 && orderStatus != 8 && serverStatus == 1) {
						// 线下服务中心已确认
						var strIsC=""
							strIsC='<span class="complainBut finshBut" value="'+orderno+'">确认收货</span>'
						serverS = '<div class="item-footer">'+
										//'<div class="order-success order-state-ico"><span class="font-ico">&#xe9c7;</span></div>线下服务中心已确认订单'+
										strIsC+
								  '</div>';
						
					} else {
						// 线下服务中心待确认
						serverS =	'<div class="item-footer order-fail">'+
										'<span class="font-ico"> &#xe863;</span>请先等待服务商确认后,再来确认收货!...'+
									'</div>';
					}
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
											'<input type="hidden" value="'+ orderno +'" class="orderno">'+
											//'<div class="profit">利润: <span class="profit-num txt-red">+'+ returnAmount +'</span></div>'+
											//'<a href="javascript:;" class="btn-sure-order alink">确认订单</a>'+
										'</div>'+
									'</div>'+
									serverS +
								'</li>';
					$("#ordersList1").append(list);
				}
			} else {
				muiAlert(data.message);
			}
		}
	});
}
//初始化查询确认订单
function initOrders2() {
	//登录的用户类型（1 普通用户，2 分销商，3 线下服务中心，4 成为分销商的线下服务中心）
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findOrderStatus",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seq,
			 "userType" : userType,
			 "orderStatus" : 8,
			 "pageIndex":pageIndex2,
			 "pageSize":pageSize
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				pageIndex2++; // 当前页码
				num2 = data.data.distrOrders.totalCount;
				$(".order2").text("已收货("+ num2 +")");
				var orders = data.data.distrOrders.list;
				hasNextPage2=data.data.distrOrders.hasNextPage;
				for (var i = 0; i < orders.length; i++) {
					var orderno = orders[i].orderno; // 订单号
					var date = orders[i].purchaseDate; // 下单时间
					var purchaseDate = formatDateTime(date); 
					var shopImgUrl = orders[i].shopImgUrl; // 店家图片
					var shopName = orders[i].shopName; // 店家名字
					var goods = orders[i].listOrderDetails;// 商品集合
					var goodsName = goods[0].goodsName;// 商品名
					var goodsImgUrl = goods[0].goodsImgUrl;// 商品图片
					var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额 
					//var returnAmount = orders[i].returnAmount.toFixed(2); // 利润金额
					var serverStatus = orders[i].serverStatus; // 线下服务中心确认状态: 0 待确认, 1 确认
					var isComplain = orders[i].isComplain; 
					var orderStatus = orders[i].orderStatus; // 订单状态
					var quantity = orders[i].listOrderDetails[0].count; // 商品数量
					var serverS="";
					if (serverStatus == 1 || orderStatus == 8) {
						// 线下服务中心已确认
						var strIsC=""
						if(isComplain){
							strIsC='<span class="complainBut " value="'+orderno+'">已投诉</span>'
						}else{
							strIsC='<span class="complainBut complainButC" value="'+orderno+'">投诉</span>'
						}
						serverS = '<div class="item-footer">'+
										//'<div class="order-success order-state-ico"><span class="font-ico">&#xe9c7;</span></div>线下服务中心已确认订单'+
										strIsC+
								  '</div>';
						
					} else {
						// 线下服务中心待确认
						serverS =	'<div class="item-footer order-fail">'+
										//'<span class="font-ico"> &#xe863;</span>等待线下服务中心确认订单中...'+
									'</div>';
					}
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
											'<input type="hidden" value="'+ orderno +'" class="orderno">'+
											//'<div class="profit">利润: <span class="profit-num txt-red">+'+ returnAmount +'</span></div>'+
											//'<a href="javascript:;" class="btn-sure-order alink">确认订单</a>'+
										'</div>'+
									'</div>'+
									serverS +
								'</li>';
					$("#ordersList2").append(list);
				}
			} else {
				muiAlert(data.message);
			}
		}
	});
}
mui('body').on('tap','.complainButC',function(){
	var orderNo = $(this).attr("value");
	if($(".complainpup").length==0){
		var _puphtml = "";
		_puphtml+="<div class='complainpup'>";
		_puphtml+="<div class='complainmask'></div>";
		_puphtml+="<div class='complaincon'><form>";
		_puphtml+="<span class='mui-icon mui-icon-closeempty closebut'></span>";
		_puphtml+="<textarea class='complainval' maxlength='50' placeholder='请输入投诉内容(只能输入50个字哟!)'></textarea>";
		_puphtml+="<button type='button' class='complainsubmit mui-btn mui-btn-danger' value='提交' name='complainsubmit'>提交</button>";
		_puphtml+="</form></div>";
		_puphtml+="</div>";
		$("body").append(_puphtml);
		$(".complainpup").show();
	}else{
		$(".complainpup").show();
	}
	$(".complainsubmit").attr("data-val",orderNo);
});
mui('body').on('tap','.finshBut',function(){
	var orderNo = $(this).attr("value");
	var th = $(this);
	mui.confirm('确认收货吗？', '亲！', function(e) {
		if(e.index){
			$.ajax({
				type : "post",//定义提交的类型
				url : _content + "/dOrders/affirmReceive",
				dataType : "json",//设置返回值得类型
				data : {
					"userName" : userName,
					"orderno" : orderNo
				},
				async : false,//是否异步请求，false为同步
				success : function(data) {
					var code = data.code;
					if(code == 200){
						--num1;
						++num2;
						mui.toast("确认收货成功");
						$(".confirmed").text("已确认("+ num1 +")");
						$(".finshed").text("已收货("+ num2 +")");
						th.parents(".item-footer").parents(".list-item").remove();
						
						pageIndex2 = 1; // 刷新重置页码
						$("#ordersList2").empty();
						var code2 = initOrders2();	// 初始化查询订单
						if (code2 == 200) {
							pageIndex2++;
						}
					}else{
						muiAlert(data.message);
					}
				},
			});
		} else{
			
		}
	});
});
// 关闭投诉弹窗
mui("body").on("tap",".complainmask",function(){
	$(".complainpup").hide();
	$(".complainval").val("");
});
mui("body").on("tap",".closebut",function(){
	$(".complainpup").hide();
	$(".complainval").val("");
});
mui("body").on("tap",".complainsubmit",function(){
	addComplain();
});
// 个人中心
mui("body").on("tap",".commonPage",function(){
	return location.href=my_jspUrl;
});
function addComplain(){
	var remarks = $(".complainval").val();
	var orderNo = $(".complainsubmit").attr("data-val");
	if(null == remarks || "" == remarks){
		mui.toast("内容不能为空");
		return ;
	}
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/complainAction/add",
		dataType : "json",//设置返回值得类型
		data : {
			 "remarks" : remarks,
			 "orderno" : orderNo
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {
			var code = data.code;
			if(code == 200){
				mui.toast("投诉成功");
			} else if(code == 405){
				mui.toast("您已经投诉过一次了！");
			}
			$(".complainpup").hide();
			$(".complainval").val("");
		},
	});
	
}

// 去订单详情页
mui('body').on('tap','.goDetail',function(){
	var orderno = $(this).siblings(".content-handle").children(".orderno").val();
//	console.log(seq);
//	console.log(userType);
//	console.log(orderno);
	window.location.href = "orderDetail.jsp?seq=" + seq + "&userType=" + userType + "&orderno=" + orderno;
});