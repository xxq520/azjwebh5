var distributionGifts = null;
var shareContent = "";
var whoShare = ""
var virtualShop = null;
var goodsImgURL = "";
var userIconURL = "";
var weixinQrcodeURL = "";
var whoShare = "";

function initApply(seq,pageIndex,pageSize) {
	var  resultDate = null;
	$.ajax({
		type : "get",//定义提交的类型
		//contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/giftsOrders/findOrder",
		dataType : "json",//设置返回值得类型
		data : {
			"seq" : seq,
			"pageIndex" : pageIndex,
			"pageSize" : pageSize
			
		},
		async : true,//是否异步请求，false为同步
		success : function(result) {//成功返回值执行函数 
			if (result.code == 200) {
	        	hasNextPage = result.data.hasNextPage;
	        	if(result.data.list.length == 0){
					hui.endLoadMore(true, '已经到头了...');
		            return false;
	        	}else{
	        		var dataList = result.data.list;
	        		for(var i = 0; i < dataList.length; i++){
		                var _html="";
		                list += getHtml(dataList[i]);
		                hui(list).appendTo('#main_container');
		            }
		            page++;
		            hui.endLoadMore();
	        	}
			} else {
				hui.toast(data.message);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
           
        }
	});
}
function getHtml(giftOrder){
	var _html = "";
	var userRegisterTime = "未注册";
	if(giftOrder.userRegisterTime != null){
		userRegisterTime = formatDateTime(giftOrder.userRegisterTime);
	}
	if(giftOrder != null){
		var stateStr ="";
		var ophtml = ""
		var str = ""
		if(giftOrder.giftAudit == -1){
			stateStr = "拒绝";
			str = "<div style='padding: 0.7rem 0.5rem; color: #999;'  data_id='"+ giftOrder.orderId +"' class='myapply "+ giftOrder.orderId +" padding-t-2 pull-right'>"+stateStr +"</div>"; 
		}else if(giftOrder.giftAudit == 1){
			stateStr ="同意";
			str = "<div style='padding: 0.7rem 0.5rem; color: #64bd3c;'  data_id='"+ giftOrder.orderId +"' class='myapply "+ giftOrder.orderId +" padding-t-2 pull-right'>"+stateStr +"</div>"; 
		}else{
			stateStr ="待处理"
			str = "<div style='padding: 0.7rem 0.5rem; color: #e43a2d;'  data_id='"+ giftOrder.orderId +"' class='myapply "+ giftOrder.orderId +" padding-t-2 pull-right'>"+stateStr +"</div>"; 
			ophtml = "<div class='ap_manage "+ giftOrder.orderId +"' data_id='"+ giftOrder.orderId +"' style='display: none;'>" + 
			"<div class='pull-left font-sm stateEvent'>同意</div><div class='pull-right font-sm stateEvent'>拒绝</div></div>" ;
		}
		_html = "<div class='msg-list margin-t-3'>" + 
		"<div class='msg-container'>" + 
		"<div class='pull-left notice-img'><img src='"+ giftOrder.userIcon +"' onerror='this.src=\"/localQuickPurchase/distributionApp/images/head.png\"'></div>" + 
		"<div class='msg_date pull-left'>" + 
		"<div class='pull-left'>" + 
		"<p class='font-lg' style='line-height: 1.4rem;'>" + 
		giftOrder.shippingAddress.userName + 
		"&nbsp;&nbsp;<span>"+ giftOrder.shippingAddress.shippingTelephone +"</span>" + 
		"</p>" + 
		"<p class='font-sm'>注册信息："+ userRegisterTime +"</p>" + 
		"</div>" + 
		 str +
		"</div>" + 
		"</div>" + 
		ophtml +
		"</div>" + 
		"</div>";
		
	}
	return _html;
}
function initGiftDate(seqs) {
	$.ajax({
		type : "post",//定义提交的类型
		//contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/virtualShopAction/findShopBySeq",
		dataType : "json",//设置返回值得类型
		data : {
			"seq" : seqs
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				//console.log(data.data);
				virtualShop = data.data.virtualShop;
				distributionGifts = data.data.distributionGifts;
				var imgUrl = virtualShop.storeHeadImg;//头像地址
				var imgUrl2 = virtualShop.weixinQRcode;//头像地址
				if (virtualShop != null) {
					$("#giftsQuictity").html(virtualShop.giftQuantity);
					//$("#dsitrPv").html(virtualShop.pv);
					if (imgUrl != null && imgUrl != "") {
						userIconURL = imgUrl;
						$(".storeHeadImg").attr("src",imgUrl);
						$(".storeHeadImg").css("visibility","visible");
					}
					if(virtualShop.storeName == null){
						$(".storeName").text("未设置");
						shareContent="扫描二维码添加店铺(编号为："+virtualShop.seq+")为微信好友，免费获取图上所有商品。";
						whoShare="来自店铺(编号为："+virtualShop.seq+")的分享";
						$(".postersContent").text(shareContent);
					}else{
						$(".storeName").text(virtualShop.storeName);
						shareContent="扫描二维码添加"+virtualShop.storeName+"为微信好友，免费获取图上所有商品。";
						whoShare="来自"+virtualShop.storeName+"的分享";
					}
					$(".postersContent").text(shareContent);
					$(".postersShare").text(whoShare);
					$(".giftsQuictity").html(virtualShop.giftsQuictity);
					$(".storeNumber").text(virtualShop.seq);
					if (imgUrl2 != null && imgUrl2 != "") {
						weixinQrcodeURL = imgUrl2;
						$(".weixinQRcode").attr("src",imgUrl2);
						$(".weixinQRcode").css("visibility","visible");
					}
				}
				if(distributionGifts != null){
					if(distributionGifts.distributionGoods !=null){
						goodsImgURL = distributionGifts.distributionGoods.thumbnail;
						$(".distributionGiftsImg").attr("src",distributionGifts.distributionGoods.thumbnail);
					}
				}
			} else {
				hui.toast(data.message);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
           
        }
	});
}
