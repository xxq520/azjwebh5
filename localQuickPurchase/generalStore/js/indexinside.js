var pageindex = 1;
function getFearuress(){
	var data = {};
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
    data.pageIndex=pageindex;   
    data.pageSize=5;
	$.ajax({
		type : "post",
		url : _content+"/shopMongo/findFeatureShop",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				var announcement;
				if (msi.data[n].announcement!==null && typeof(msi.data[n].announcement)!="undefined") {  
					announcement=msi.data[n].announcement;
				} else {  
				    announcement="暂无公告";
				}
				_listhtml += "<div class='list-item'>";
				_listhtml += "<div class='item-img'><a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'><img class='middle' src='"+msi.data[n].shopHeadImgPath+"'></a></div>";
				_listhtml += "<div class='item-ifon'>";
				_listhtml += "<a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'>";
				_listhtml += "<div class='store-tit'>"+msi.data[n].shopName+"<img src='../images/level-"+parseInt(msi.data[n].eva)+".png'></div>";
				_listhtml += "<div class='store-tips'><span class='gray'>仅支持上门自提</span></div>";
				_listhtml += "<div class='store-date'>总销"+msi.data[n].shopOrders+"单 | 小于"+parseInt(msi.data[n].distance)+"米</div>";
				_listhtml += "<div class='store-txt'>"+announcement+"</div>";
				_listhtml += "</a></div></div>";
			}
			if($("#data-loadmore").length>0){
				$("#data-loadmore").remove();
			}
			$("#f-loading-con").append(_listhtml);
			$(".weui-loadmore").css("display","block");
			if(msi.data.length<5){
				$(".weui-loading").hide();
				$(".weui-loadmore__tips").html("~ 无更多数据 ~");
			}
		}
	});
	pageindex = pageindex+1;
}

function gethotstore(){
	var data = {};
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
    data.pageIndex=pageindex;   
    data.pageSize=5;
	$.ajax({
		type : "post",
		url : _content+"/shopMongo/findHotShop",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				_listhtml += "<div class='list-item'>";
				_listhtml += "<div class='item-img'><a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'><img class='middle' src='"+msi.data[n].shopHeadImgPath+"'></a></div>";
				_listhtml += "<div class='item-ifon'>";
				_listhtml += "<a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'>";
				_listhtml += "<div class='store-tit'>"+msi.data[n].shopName+"<img src='../images/level-"+parseInt(msi.data[n].eva)+".png'></div>";
				_listhtml += "<div class='store-tips'><span class='gray'>仅支持上门自提</span></div>";
				_listhtml += "<div class='store-date'>月销"+msi.data[n].shopOrders+"单 | 小于"+parseInt(msi.data[n].distance)+"米</div>";
				_listhtml += "</a></div></div>";
			}
			if($("#data-loadmore").length>0){
				$("#data-loadmore").remove();
			}
			$("#h-loading-con").append(_listhtml);
			$(".weui-loadmore").css("display","block");
			if(msi.data.length<5){
				$(".weui-loading").hide();
				$(".weui-loadmore__tips").html("~ 无更多数据 ~");
			}
		}
	});
	pageindex = pageindex+1;
}

function getnewstore(){
	var data = {};
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
    data.pageIndex=pageindex;   
    data.pageSize=5;
	$.ajax({
		type : "post",
		url : _content+"/shopMongo/findNewShop",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				var announcement;
				if (msi.data[n].announcement!==null && typeof(msi.data[n].announcement)!="undefined") {  
					announcement=msi.data[n].announcement;
				} else {  
				    announcement="暂无公告";
				}
				_listhtml += "<div class='list-item'>";
				_listhtml += "<div class='item-img'><a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'><i class='new-ico'></i><img class='middle' src='"+msi.data[n].shopHeadImgPath+"'></a></div>";
				_listhtml += "<div class='item-ifon'>";
				_listhtml += "<a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'>";
				_listhtml += "<div class='store-tit'>"+msi.data[n].shopName+"<img src='../images/level-"+parseInt(msi.data[n].eva)+".png'></div>";
				_listhtml += "<div class='store-tips'><span class='gray'>仅支持上门自提</span></div>";
				_listhtml += "<div class='store-date'>总销"+msi.data[n].shopOrders+"单 | 小于"+parseInt(msi.data[n].distance)+"米</div>";
				_listhtml += "<div class='store-txt'>"+announcement+"</div>";
				_listhtml += "</a></div></div>";
			}
			if($("#data-loadmore").length>0){
				$("#data-loadmore").remove();
			}
			$("#n-loading-con").append(_listhtml);
			$(".weui-loadmore").css("display","block");
			if(msi.data.length<5){
				$(".weui-loading").hide();
				$(".weui-loadmore__tips").html("~ 无更多数据 ~");
			}
		}
	});
	pageindex = pageindex+1;
}

function getSuperMarket(){
	var data = {};
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
    data.dealGroupId=73;
    data.pageIndex=pageindex;   
    data.pageSize=5;
	$.ajax({
		type : "post",
		url : _content+"/shopMongo/findBigShop",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				var announcement;
				if (msi.data[n].announcement!==null && typeof(msi.data[n].announcement)!="undefined") {   
					announcement=msi.data[n].announcement;
				} else {  
				    announcement="暂无公告";
				}
				_listhtml += "<div class='list-item'>";
				_listhtml += "<div class='item-img'><a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'><img class='middle' src='"+msi.data[n].shopHeadImgPath+"'></a></div>";
				_listhtml += "<div class='item-ifon'>";
				_listhtml += "<a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'>";
				_listhtml += "<div class='store-tit'>"+msi.data[n].shopName+"<img src='../images/level-"+parseInt(msi.data[n].eva)+".png'></div>";
				_listhtml += "<div class='store-tips'><span class='gray'>仅支持上门自提</span></div>";
				_listhtml += "<div class='store-date'>总销"+msi.data[n].shopOrders+"单 | 小于"+parseInt(msi.data[n].distance)+"米</div>";
				_listhtml += "<div class='store-txt'>"+announcement+"</div>";
				_listhtml += "</a></div></div>";
			}
			if($("#data-loadmore").length>0){
				$("#data-loadmore").remove();
			}
			$("#s-loading-con").append(_listhtml);
			$(".weui-loadmore").css("display","block");
			if(msi.data.length<5){
				$(".weui-loading").hide();
				$(".weui-loadmore__tips").html("~ 无更多数据 ~");
			}
		}
	});
	pageindex = pageindex+1;
}

function getWellstore(){
	var data = {};
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
    data.pageIndex=pageindex;   
    data.pageSize=5;
	$.ajax({
		type : "post",
		url : _content+"/shopMongo/findHotShop",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				var announcement;
				if (msi.data[n].announcement!==null && typeof(msi.data[n].announcement)!="undefined") {   
					announcement=msi.data[n].announcement;
				} else {  
				    announcement="暂无公告";
				}
				_listhtml += "<div class='list-item'>";
				_listhtml += "<div class='item-img'><a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'><img class='middle' src='"+msi.data[n].shopHeadImgPath+"'></a></div>";
				_listhtml += "<div class='item-ifon'>";
				_listhtml += "<a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'>";
				_listhtml += "<div class='store-tit'>"+msi.data[n].shopName+"<img src='../images/level-"+parseInt(msi.data[n].eva)+".png'></div>";
				_listhtml += "<div class='store-tips'><span class='gray'>仅支持上门自提</span></div>";
				_listhtml += "<div class='store-date'>总销"+msi.data[n].shopOrders+"单 | 小于"+parseInt(msi.data[n].distance)+"米</div>";
				_listhtml += "<div class='store-txt'>"+announcement+"</div>";
				_listhtml += "</a></div></div>";
			}
			if($("#data-loadmore").length>0){
				$("#data-loadmore").remove();
			}
			$("#w-loading-con").append(_listhtml);
			$(".weui-loadmore").css("display","block");
			if(msi.data.length<5){
				$(".weui-loading").hide();
				$(".weui-loadmore__tips").html("~ 无更多数据 ~");
			}
		}
	});
	pageindex = pageindex+1;
}

function getTimeLimit(){
	$.ajax({
		type : "post",
		url : _content+"/activityMongo/findSaleGoods",
		dataType : "json", //设置返回值得类型
		data :{
			pageIndex:pageindex,
			pageSize:5
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				if(msi.data[n].good.listGoodsImg.length==0){
					var imgpath="";
				}else{
					var imgpath=msi.data[n].good.listGoodsImg["0"].goodsImgPath;
				}
				var priceNow = msi.data[n].good.promotionPrice;
				if(priceNow == null || priceNow == ""){
					priceNow = msi.data[n].good.goodsPrice;
				}
				_listhtml += "<div class='list-item'><a href='goodsdetails.jsp?seq="+msi.data[n].good.seq+"&goodsId="+msi.data[n].good.goodsId+"'>";
				_listhtml += "<div class='item-img'><img class='middle' src='"+imgpath+"'></div>";
				_listhtml += "<div class='item-ifon'>";
				_listhtml += "<div class='product-tit'>"+msi.data[n].good.goodsName+"<i class='sales'>月销"+msi.data[n].good.sales+"包</i></div>";
				_listhtml += "<div class='product-tips'>"+msi.data[n].shopName+"</div>";
				_listhtml += "<div class='product-buttom'>";
				_listhtml += "<span class='product-price'>&yen;<i>"+priceNow+"</i><del>原价：&yen;"+msi.data[n].good.goodsPrice+"</del></span>";
				_listhtml += "<span class='product-time'>仅剩"+msi.data[n].hours+"小时</span>";
				_listhtml += "</div></div></a></div>";
			}
			if($("#data-loadmore").length>0){
				$("#data-loadmore").remove();
			}
			$("#t-loading-con").append(_listhtml);
			$(".weui-loadmore").css("display","block");
			if(msi.data.length<5){
				$(".weui-loading").hide();
				$(".weui-loadmore__tips").html("~ 无更多数据 ~");
			}
		}
	});
	pageindex = pageindex+1;
}

$(function(){
	if($("#f-loading-con").length>0){
		getLocat(getFearuress);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		getLocat(getFearuress);
    			loading = false;
		  	},500);   //模拟延迟
		});
	}
	
	if($("#h-loading-con").length>0){
		getLocat(gethotstore);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		getLocat(gethotstore);
    			loading = false;
		  	},500);   //模拟延迟
		});
	}
	
	if($("#n-loading-con").length>0){
		getLocat(getnewstore);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		getLocat(getnewstore);
    			loading = false;
		  	},500);   //模拟延迟
		});
	}	
	
	if($("#s-loading-con").length>0){
		getLocat(getSuperMarket);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		getLocat(getSuperMarket);
    			loading = false;
		  	},500);   //模拟延迟
		});
	}
	
	if($("#w-loading-con").length>0){
		getLocat(getWellstore);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		getLocat(getWellstore);
    			loading = false;
		  	},500);   //模拟延迟
		});
	}
	
	if($("#t-loading-con").length>0){
		getLocat(getTimeLimit);
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		getLocat(getTimeLimit);
    			loading = false;
		  	},500);   //模拟延迟
		});
	}	
})
