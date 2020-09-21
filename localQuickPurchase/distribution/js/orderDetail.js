// 获取url上的参数
var seqD = getQueryString("seq");
var userTypeD = getQueryString("userType");
var ordernoD = getQueryString("orderno");
// console.log(seq);
// console.log(userType);
// console.log(orderno);
if (seqD != "" && userTypeD != "" && ordernoD != "") {
	findDetail();
}

function findDetail() {
	$.ajax({
		type : "post",//定义提交的类型
		url : _content + "/dOrders/findDetail",
		dataType : "json",//设置返回值得类型
		data : {
			 "seq" : seqD,
             "from":"h5",
			 "userType" : userTypeD,
			 "orderno" : ordernoD
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				$(".contentDetail").html("");
				var dOrders=data.data.dOrders;
				var shippingAddress=dOrders.shippingAddress;
				$("#user_name").text(shippingAddress.shippingName);
				$("#user_phone").text("("+shippingAddress.shippingTelephone+")");
				$(".default-tip").show();
				$("#addr_txt").text("送货地址："+shippingAddress.tipName+shippingAddress.address);
				var listOrderDetails=dOrders.listOrderDetails;
				$("#good_amount").html(dOrders.goodsNum);
				$("#total_money").html((dOrders.totalAmmount).toFixed(2));
				
				dOrders.remark = dOrders.remark == null || dOrders.remark == "" ? "暂无备注!" : dOrders.remark
				$("#remark").html("备注: " + dOrders.remark);
				var freight = dOrders.freight.toFixed(2);
				freight = freight == null ? 0.0 : freight;
				$(".freightInfo").html(freight);
				var invoiceContent = dOrders.invoiceContent;
				invoiceContent = invoiceContent == null ? "无" : invoiceContent;
				$(".invoiceMsg").html(invoiceContent);
				var date = dOrders.purchaseDate; // 下单时间
				var purchaseDate = formatDateTime(date); 
				$(".buyTime").html(purchaseDate);
				if (userTypeD != 1) {
					$("#returnAmount").html(dOrders.returnAmount.toFixed(2));
					$(".Lamount").show();
				}
				for(var i=0;i<listOrderDetails.length;i++){
					var _listHtml="<div class='order-shop'>"
									+"<div class='shop-pic'>"
									+"<img src='"+listOrderDetails[i].goodsImgUrl+"' />"
									+"</div>"
									+"<div class='flex-box'>"
									+"<div class='shop-content'>"
									+"<div class='shop-name'>"
									+listOrderDetails[i].goodsName
									+"</div>"
									+"<div class='shipper sv'>"
									+"数量：<span id='sv_num' class='sv-num'>"
									+listOrderDetails[i].count
									+"</span><span class='unit'>"
									+(listOrderDetails[i].unit==null?"":listOrderDetails[i].unit)+"</span>"
									+"</div>"
									/*+"<div class='shipper'>"
									+"供货商：耐克中国员村分工厂"
									+"</div>"*/
									+"<div class='price'>单价: ￥<span class=priceInofo>"+ listOrderDetails[i].price.toFixed(2) +"</span></div>"
									+"<div class='shop-buy'>"
									+"<div class='shop-price txt-red'><span class='rmb'>￥</span><span id='unit_price'>"+(listOrderDetails[i].amount).toFixed(2)+"</span></div>"
									+"</div>"
									+"</div>"
									+"</div>"
									+"</div>";
					$(".contentDetail").append(_listHtml);
					
				}
			} else {
				alert("查询失败...请稍后再试!");
			}
		}
	});
}