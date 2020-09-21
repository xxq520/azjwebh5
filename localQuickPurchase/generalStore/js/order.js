$(function(){
	Order.init.initPage();
	Order.listener.getMoreData();
});
//获取未完成
var Order = {
	userName:userName,
	orderStatus:14,
	pageIndex:1,
	pageSize:5,
	loading:false,
	init:{
		initPage:function(){
			Order.getData.getDataList();
		}
	},
	listener:{
		handleClick:function(){
			$(".orderBarList .orderBar-item").click(function(){
				if(!$(this).hasClass('cur')){
					var i = $(this).index();
					Order.pageIndex = 1;
					Order.orderStatus = $(this).attr("data-id");
					$(this).addClass('cur').siblings().removeClass('cur');
					$(".orderBox-item .orderList").empty();
					Order.getData.getDataList();
				}
			});
			 $(".goodsItem").on("click",function(){
			 	var orderNo = $(this).attr("data-no");
			 	var seq = $(this).attr("data-seq");
			 	window.location.href = 'orderDetail.jsp?orderno='+ orderNo +'&seq='+ seq;
			 });
			$(".evalItem").on("click",function(){
				if(!$(this).parents(".goodsItem").hasClass('checked')){
					$(this).parents(".goodsItem").addClass('checked').siblings().removeClass('checked');
				}
			});
			$(".goToEvaluate").on("click",function(){
				var checkedItem = $(this).parents(".orderItem");
				if(checkedItem.length!=0){
					var orderId = checkedItem.attr("data-id");
					window.location.href = 'evalGoods.jsp?orderId='+ orderId;
				}
			});
			$(".cancelOrder").on("click",function(){
				var checkedItem = $(this).parents(".orderItem");
				if(checkedItem.length!=0){
					var orderno = checkedItem.attr("data-no");
					Order.getData.cancelDataItem(orderno,this);
				}
			});
			$(".delOrder").on("click",function(){
				var orderno = $(this).parents(".orderItem").attr("data-no");
				Order.getData.delDataItem(orderno,this);
			})
		},
		getMoreData:function(){
			$(document.body).infinite().on("infinite", function() {
			  if(Order.loading) return;
				  Order.loading = true;
				  Order.orderStatus = $(".orderBar-item.cur").attr("data-id");
				  setTimeout(function() {
			  		Order.pageIndex++;
			  		Order.getData.getDataList();
	  			    Order.loading = false;
			  }, 500);   //模拟延迟
			});
		}
	},
	getData:{
		getDataList:function(){
			$.ajax({
			url: _content+'/orderMongo/doneList',
			type: 'get',
			dataType:'JSON',
			async : false,
			data: {userName:Order.userName,orderStatus:Order.orderStatus,pageIndex:Order.pageIndex,pageSize:Order.pageSize},
			})
			.done(function(res) {
				//console.log(res);
				if(res.code == 200){
					var data = res.data.orders;
					var status = Order.orderStatus;
					var len = '';
					if(status == 14){
						len = res.data.noPay;
					}else if(status == 5){
						len = res.data.doneNum;
					}else if(status == 23){
						len = res.data.cancleNum;
					}
					var _html = '';
					if(len!=0){
						if(data!=''){
							$.each(data,function(index, el) {
								var orderTxt = orderStatus(el.orderStatus);
								_html += '<div class="orderItem" data-no="'+ el.orderno +'" data-id="'+ el.orderId +'">';
								_html += '<div class="shopMsg"><a href="shoppingpage.jsp?seq='+ el.seqSeller +'" class="shopName">'+ el.shopName +'</a><span class="right orderStatus">'+ orderTxt +'</span></div>';
								_html += '<div class="goodsList">';
								var bEvaluation=el.bEvaluation;
								if(status == 14){
									$.each(el.listOrderDetails,function(idx, val) {
										var spec = (val.spec == null) ? '' : val.spec;
										_html += '<div class="goodsItem" data-no="'+ el.orderno +'" data-seq="'+ el.seq +'"><a href="javascript:void(0);" class="goodsImg"><img class="cart-photo-thumb" src="'+ val.goodsImgUrl +'" onerror="this.src=\'/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\'"  /></a><div class="goodsDetail"><p class="goodsName">'+ val.goodsName +'</p><p class="goodsProp">'+ spec +'</p><p class="goodsPriceAndNum"><span class="left">单价:<i>&yen;</i><em class="price">'+ val.price +'</em></span><span class="right">数量:<em class="num">'+ val.count +'</em></span></p></div></div>';
									});
									if(el.orderStatus==4){
										_html += '<div class="goodsTotalBox"><div class="goodsTotalMsg"><div class="right t_price">应付:<i>&yen;</i><span class="totalPrice">'+ el.totalAmmount +'</span></div><div class="right t_Num">共<span class="num">'+ el.goodsNum +'</span>件商品</div></div></div>';
									}else{
										_html += '<div class="goodsTotalBox"><div class="goodsTotalMsg"><div class="right t_price">应付:<i>&yen;</i><span class="totalPrice">'+ el.totalAmmount +'</span></div><div class="right t_Num">共<span class="num">'+ el.goodsNum +'</span>件商品</div></div><a class="btnItem cancelOrder redBtn" href="javascript:void(0);">取消订单</a></div>';
									}
								}else if(status == 5){
									$.each(el.listOrderDetails,function(idx, val) {
										var spec = (val.spec == null) ? '' : val.spec;
										_html += '<div class="goodsItem"  data-no="'+ el.orderno +'" data-seq="'+ el.seq +'"><a href="javascript:void(0);" class="goodsImg1"><img class="cart-photo-thumb" src="'+ val.goodsImgUrl +'"  onerror="this.src=\'/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\'"  /></a><div class="goodsDetail1"><p class="goodsName">'+ val.goodsName +'</p><p class="goodsProp">'+ spec +'</p><p class="goodsPriceAndNum"><span class="left">单价:<i>&yen;</i><em class="price">'+ val.price +'</em></span><span class="right">数量:<em class="num">'+ val.count +'</em></span></p></div></div>';
									});
									_html += '<div class="goodsTotalBox"><div class="goodsTotalMsg"><div class="right t_price">应付:<i>&yen;</i><span class="totalPrice">'+ el.totalAmmount +'</span></div><div class="right t_Num">共<span class="num">'+ el.goodsNum +'</span>件商品</div></div>';
									if(bEvaluation){
										_html+='<a class="btnItem  redBtn" href="javascript:void(0);">已评价</a></div>';
									}else{
										_html+='<a class="btnItem goToEvaluate redBtn" href="javascript:void(0);">去评价</a></div>';
									}
								}else if(status == 23){
									$.each(el.listOrderDetails,function(idx, val) {
										var spec = (val.spec == null) ? '' : val.spec;
										_html += '<div class="goodsItem" data-no="'+ el.orderno +'" data-seq="'+ el.seq +'"><a href="javascript:void(0);" class="goodsImg"><img class="cart-photo-thumb" src="'+ val.goodsImgUrl +'"  onerror="this.src=\'/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\'"  /></a><div class="goodsDetail"><p class="goodsName">'+ val.goodsName +'</p><p class="goodsProp">'+ spec +'</p><p class="goodsPriceAndNum"><span class="left">单价:<i>&yen;</i><em class="price">'+ val.price +'</em></span><span class="right">数量:<em class="num">'+ val.count +'</em></span></p></div></div>';
									});
									_html += '<div class="goodsTotalBox"><div class="goodsTotalMsg"><div class="right t_price">应付:<i>&yen;</i><span class="totalPrice">'+ el.totalAmmount +'</span></div><div class="right t_Num">共<span class="num">'+ el.goodsNum +'</span>件商品</div></div><a class="btnItem delOrder grayBtn" href="javascript:void(0);">删除订单</a></div>';
								}
								_html += '</div></div>';
							});
							$(".orderBox-item .orderList").append(_html);
							$(".weui-loading").show();
							$(".weui-loadmore__tips").text('正在加载');
						}else{
							$(".weui-loading").hide();
							$(".weui-loadmore__tips").text('没有其他订单了...');
						}
					}else{
						$(".weui-loading").hide();
						$(".weui-loadmore__tips").text('');
						$(".orderBox-item .orderList").html('<p class="emptyTip">暂时没有找到相关信息</P>');
					}
					Order.listener.handleClick();
				}
			})
			.fail(function() {
				//console.log("error");
			})
			.always(function() {
				//console.log("complete");
			});
		},
		delDataItem:function(on,obj){
			var _this=$(obj);
			$.confirm({
				  title: '提示',
				  text: '确定删除订单',
				  onOK: function () {
				    //点击确认
					  $.ajax({
							url: _content+'/orderMongo/deleteOrder',
							type: 'get',
							dataType:'JSON',
							data: {userName:Order.userName,orderno:on},
							})
							.done(function(res) {
								//console.log(res);
								if(res.code == 200){
									$(".resultTip").text("删除成功！").show(300).delay(2000).hide(300);
									var t = setTimeout(function(){
										$(_this).parents(".orderItem").remove();
				                    },150);
								}else{
									$(".resultTip").text("删除失败！").show(300).delay(2000).hide(300);
								}
							})
							.fail(function() {
								//console.log("error");
							})
							.always(function() {
								//console.log("complete");
							});
				  },
				  onCancel: function () {
				  }
				});
			
		},
		cancelDataItem:function(on,obj){
			var _this=$(obj);
			$.prompt({
				 title: '确定取消订单吗',
				 input: '请输入取消原因',
				 empty: false, // 是否允许为空
				 onOK: function (input) {
					 //点击确认
					 //点击确认
					  $.ajax({
							url: _content+'/orderMongo/cancleOrder',
							type: 'get',
							dataType:'JSON',
							data: {userName:Order.userName,orderno:on,'refundsReason':input},
							})
							.done(function(res) {
								//console.log(res);
								if(res.code == 200){
									$(".resultTip").text("取消成功！").show(300).delay(2000).hide(300);
									var t = setTimeout(function(){
										$(_this).parents(".orderItem").remove();
				                    },150);
								}else{
									$(".resultTip").text("取消失败！").show(300).delay(2000).hide(300);
								}
							})
							.fail(function() {
								//console.log("error");
							})
							.always(function() {
								//console.log("complete");
							});
				 },
				 onCancel: function () {
					 //点击取消
				 }
			});
		}
	}
}