function guessGoods(){
	var seq = getQueryString("seq");
	$(".collection-ico").attr("data-seq",seq);
	$.ajax({
		type : "post",
		url : _content+"/shoppingCartMongo/listCart",
		dataType : "json", //设置返回值得类型
		data : {	
			seq:seq,
			userName:userName
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				setCookie("shoppingCartId",msi.data.shoppingCartId,1);
			}else{
				$.toptip("尚未登录，请先登录", 'error');
			}
		}
	})
	$.ajax({
		type : "post",
		url : _content+"/goodsMongo/queryByShopIdMP",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			userName:userName
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				var _listhtml = "";
				var _listtype = "";
				var _ifonhtml = "";
				if(msi.data.att==1){
					$(".collection-ico").addClass("act");
					$(".collection-ico").attr("data-collect","true");
				}else if(msi.data.att==0){
					$(".collection-ico").attr("data-collect","false");
				}
				if(msi.data.shopInfo.deliverType==null){
					var delivertype="上门自提";
				}else{
					var delivertype=msi.data.shopInfo.deliverType;
				}
				if (msi.data.shopInfo.announcement!=null&&msi.data.shopInfo.announcement!="") {   
					var announcement=msi.data.shopInfo.announcement;
				} else {  
				    var announcement="暂无公告";
				}
				_ifonhtml += "<div class='sti-img'><img src='"+msi.data.shopInfo.shopHeadImgPath+"' onerror='this.src=\"/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\"'/></div>";
				_ifonhtml += "<div class='sti-ifo'>";
				_ifonhtml += "<div class='stii-top'><a href='storedetails.jsp?seq="+msi.data.shopInfo.seq+"' class='stiit-right'>商家详情<i class='font-ico'>&#xe937;</i></a><p class='stiit-left'>"+msi.data.shopInfo.shopName+"</p></div>";
				_ifonhtml += "<div class='stii-tips'><span class='stiit-left'>"+delivertype+"</span></div>";
				_ifonhtml += "<div class='stti-notice'>公告："+announcement+"</div></div>";
				$("#shopIfon").html(_ifonhtml);
				for(var n=0;n<msi.data.customTypes.length;n++){
					var  customTypeName=msi.data.customTypes[n].customTypeOne.customTypeName;
					var  actStyle=""
					// 数字个数
					var numCnt = customTypeName.replace(/\D/g, '').length;
					// 大小写字母个数
					var alphaNum = customTypeName.replace(/[^a-zA-Z]/g, '').length;
					if(customTypeName.length<5){
							actStyle="line-height: 2.5rem;"
					}
					if((alphaNum!=0||numCnt!=0)&&(alphaNum<5||numCnt<5)&&customTypeName.length<7){
						actStyle="line-height: 2.5rem;"
					}
					if((alphaNum==2||numCnt==2)&&customTypeName.length==6){
						actStyle=""
					}
					if(n==0){
						_listtype +="<li class='act' style='"+actStyle+"' >"+customTypeName+"</li>";
					}else{
						_listtype +="<li  style='"+actStyle+"' >"+customTypeName+"</li>";
					}
					_listhtml+="<li class='splc-item'><p class='splci-tit'><span>"+customTypeName+"</span></p><div class='splci-list'>";
					for(var j=0;j<msi.data.customTypes[n].customTypeOne.goodsSet.length;j++){
						_listhtml+="";
						_listhtml+="<div class='list-item'>";
						_listhtml+="<a href='goodsdetails.jsp?seq="+msi.data.shopInfo.seq+"&goodsId="+msi.data.customTypes[n].customTypeOne.goodsSet[j].goodsId+"'><div class='item-img'><img src='"+msi.data.customTypes[n].customTypeOne.goodsSet[j].thumbnail+"' onerror='this.src=\"/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\"' /></div>";
						_listhtml+="<div class='item-ifo'>";
						_listhtml+="<p class='item-tit'>"+msi.data.customTypes[n].customTypeOne.goodsSet[j].goodsName+"</p>";
						_listhtml+="<p class='item-sales'>库存"+msi.data.customTypes[n].customTypeOne.goodsSet[j].stock+msi.data.customTypes[n].customTypeOne.goodsSet[j].unit+"</p>";
						if(msi.data.customTypes[n].customTypeOne.goodsSet[j].promotionPrice==null){
							_listhtml+="<div class='item-price'><i class='now-price'>&yen;<b>"+msi.data.customTypes[n].customTypeOne.goodsSet[j].goodsPrice+"</b></i></div></div></a>";
						}else{
							_listhtml+="<div class='item-price'><i class='now-price'>&yen;<b>"+msi.data.customTypes[n].customTypeOne.goodsSet[j].promotionPrice+"</b></i><del>&yen;"+msi.data.customTypes[n].customTypeOne.goodsSet[j].goodsPrice+"</del></div></div></a>";
						}
						_listhtml+="<div class='buy_num' data-goodsId='"+msi.data.customTypes[n].customTypeOne.goodsSet[j].goodsId+"'>";
						_listhtml+="<i class='font-ico reduction-but' onclick='reduceGoods(this)'>&#xe8d3;</i>";
						_listhtml+="<i class='product-num'></i>";
						_listhtml+="<i class='font-ico add-but' onclick='addGoods(this)'>&#xee36;</i></div></div>";						
					}
					_listhtml+="</div></li>";
				}
				setCookie("shopLats",msi.data.shopInfo.lat,1);
				setCookie("shopLngs",msi.data.shopInfo.lng,1);
				$("#list-type").html(_listtype);
				$("#list-con").html(_listhtml);
				calculateHeight();
				guesscart();
				traverseNum();
			}else{
				//$.toptip(msi.message, 'error');
			}
		}
	})
	$.ajax({
		type : "post",
		url : _content+"/evaMongo/queryEVASeq",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			pageIndex:1,
			pageSize:10,
			eva:0
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				$("#pageevalink a").html("评价（"+msi.data.allEvaSize+"）").attr("href","allevaluation.jsp?seq="+seq+"&eva=0");
			}else{
				//$.toptip(msi.message, 'error');
			}
		}
	});
}

function collectTab(obj){
	if(!userName){
		$.confirm("收藏功能需要先登录，是否登录", function() {
			location.href="login.jsp";
		}, function() {
		});
		return;
	}
	var datacollect = $(obj).attr("data-collect");
	var dataseq = $(obj).attr("data-seq");
	var data = {};
	data.seq = dataseq;
	data.userName = userName;
	
	if(datacollect=="true"){
		$.ajax({
			type : "post",
			url : _content+"/attention/deleteBySeq",
			dataType : "json", //设置返回值得类型
			contentType : "application/json",
			data : JSON.stringify(data),
			async : true, //是否异步请求，false为同步
			success : function(msi) { //成功返回值执行函数
				$(obj).attr("data-collect","false");
				$(obj).removeClass("act");
			}
		})
	}else if(datacollect=="false"){
		$.ajax({
			type : "post",
			url : _content+"/attention/saveAttention",
			dataType : "json", //设置返回值得类型
			contentType : "application/json",
			data : JSON.stringify(data),
			async : true, //是否异步请求，false为同步
			success : function(msi) { //成功返回值执行函数
				$(obj).attr("data-collect","true");
				$(obj).addClass("act");				
			}
		})
		
	}
	
}

function calculateHeight(){
	var heightTab = $(".sp-tab").outerHeight(true);
	var heightCar = $(".shoppingcart").outerHeight(true);
	var listHei = $(window).outerHeight()-(heightTab+heightCar);
	$(".sp-list").height(listHei);
}

function addGoods(obj){
	//alert(userName);
	if ($.trim(userName) == "" || userName == null) {
		window.location.href = "/localQuickPurchase/generalStore/html/login.jsp"; 
	}
	var goodsNum = parseInt($(obj).siblings(".product-num").text());
	if(isNaN(goodsNum)){
		$(obj).siblings(".product-num").text("1");
		$(obj).siblings(".reduction-but").css("display","inline-block");
	}else{
		var sum = goodsNum+1;
		$(obj).siblings(".product-num").text(sum); 
	}
	var seq = getQueryString("seq");
	var goodsId = $(obj).parent("div").attr("data-goodsid");
	var shoppingCartId = getCookie("shoppingCartId");
	if(isNaN(goodsNum)){
		$.ajax({
			type : "post",
			url : _content+"/shoppingCartMongo/add",
			dataType : "json", //设置返回值得类型
			data : {
				goodsId:goodsId,
				seq:seq,
				shoppingCartId:shoppingCartId,
				goodsNum:1,
				userName:userName
			},
			async : true, //是否异步请求，false为同步 
			success : function(msi) { //成功返回值执行函数
				if(msi.code==200){
					guesscart();
				}else{
					$.toptip("操作失败", 'error');
				}
			}
		})
	}else{
		$.ajax({
			type : "post",
			url : _content+"/shoppingCartMongo/addMix",
			dataType : "json", //设置返回值得类型
			data : {
				goodsId:goodsId,
				shoppingCartId:shoppingCartId
			},
			async : true, //是否异步请求，false为同步
			success : function(msi) { //成功返回值执行函数
				if(msi.code==200){
					guesscart();
					if($(obj).parent(".product-buy").length>0){
						traverseNum();
					}
				}else{
					$.toptip("操作失败", 'error');
				}
			}
		})		
	}
}

function reduceGoods(obj){
	var goodsNum = parseInt($(obj).siblings(".product-num").text());
	var sum = goodsNum-1;
	if(sum==0){
		$(obj).siblings(".product-num").text("");
		$(obj).hide();
	}else{
		$(obj).siblings(".product-num").text(sum);
	}
	var seq = getQueryString("seq");
	var goodsId = $(obj).parent("div").attr("data-goodsid");
	var shoppingCartId = getCookie("shoppingCartId");
	$.ajax({
		type : "post",
		url : _content+"/shoppingCartMongo/reduce",
		dataType : "json", //设置返回值得类型
		data : {
			goodsId:goodsId,
			seq:seq,
			shoppingCartId:shoppingCartId
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				guesscart();
				if($(obj).parent(".product-buy").length>0){
					traverseNum();
				}
			}else{
				$.toptip("操作失败", 'error');
			}
		}
	})
}

function guesscart(){
	var seq = getQueryString("seq");
	var shoppingCartId = getCookie("shoppingCartId");
	$.ajax({
		type : "post",
		url : _content+"/shoppingCartMongo/listCart",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			userName:userName
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				if(msi.data.shoppingCarts.itemsList.length==0){
					$("#cart").removeClass("act");
					$("#car-num").removeClass("car-num").html(" ");
					$("#listing").removeClass("weui-popup__container--visible");
					$("#listing").hide();
					$("#list-con .reduction-but").hide();
					$("#list-con .product-num").text("");
					$("#product-list").html("");
					$(".settlement").attr("href","javascript:;")
				}else{
					var totalnum = 0;
					var _listhtml = "";
					for(var n=0;n<msi.data.shoppingCarts.itemsList.length;n++){
						_listhtml+="<div class='product-list-item'>";
						_listhtml+="<div class='product-list-num product-buy' data-goodsid='"+msi.data.shoppingCarts.itemsList[n].goodsId+"'>";
						_listhtml+="<i class='font-ico reduction-but' onclick='reduceGoods(this)' style='display:inline-block'>&#xe8d3;</i>";
						_listhtml+="<i class='product-num'>"+msi.data.shoppingCarts.itemsList[n].quantity+"</i>";
						_listhtml+="<i class='font-ico add-but' onclick='addGoods(this)'>&#xee36;</i></div>";
						_listhtml+="<div class='product-list-con'>";
						_listhtml+="<img src='"+msi.data.shoppingCarts.itemsList[n].imgUrl+"' />";
						_listhtml+="<div class='con-ifo'>";
						_listhtml+="<p class='con-ifo-tit'>"+msi.data.shoppingCarts.itemsList[n].goodsName+"</p>";
						_listhtml+="<p class='con-ifo-price'><i class='now-price'>&yen;<b>"+msi.data.shoppingCarts.itemsList[n].goodsPirce+"</b></i></p>";
						_listhtml+="</div></div></div>";
						totalnum = totalnum+parseInt(msi.data.shoppingCarts.itemsList[n].quantity);
					}
					$("#cart").addClass("act");
					$("#car-num").addClass("car-num").html(totalnum);
					$("#totalprice").html(msi.data.shoppingCarts.amount);
					$("#totalnum").html(totalnum);
					$("#product-list").html(_listhtml);
					$(".settlement").attr("href","placeOrder.jsp?shoppingCartId="+shoppingCartId+"&seq="+seq)
				}
				setCookie("shoppingCartId",msi.data.shoppingCartId,1);
			}else{
				//$.toptip(msi.message, 'error');
			}
		}
	})
}

function cartTab(){
	guesscart();
	$("#listing").toggleClass("weui-popup__container--visible");
	$("#listing").toggle();
}

function traverseNum(){
	var seq = getQueryString("seq");
	$.ajax({
		type : "post",
		url : _content+"/shoppingCartMongo/listCart",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			userName:userName
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				if(msi.data.shoppingCarts.itemsList.length==0){
					$("#list-con .reduction-but").hide();
					$("#list-con .product-num").text("");
				}else{
					for(var i=0;i<$("#list-con").find(".buy_num").length;i++){
						var lgoodsId = $("#list-con").find(".buy_num").eq(i).attr("data-goodsid");
						var objthis = $("#list-con").find(".buy_num").eq(i);
						for(var n=0;n<msi.data.shoppingCarts.itemsList.length;n++){
							var tgoodsId = msi.data.shoppingCarts.itemsList[n].goodsId;
							var tity = msi.data.shoppingCarts.itemsList[n].quantity
							if(lgoodsId==tgoodsId){
								objthis.find(".reduction-but").css("display","inline-block");
								objthis.find(".product-num").text(tity);
								break;
							}else{
								objthis.find(".reduction-but").hide();
								objthis.find(".product-num").text("");
							}
						}
						
					}
				}
			}else{
				//$.toptip(msi.message, 'error');
			}
		}
	})	
}

function clearOrder(){
	var seq = getQueryString("seq");
	var shoppingCartId = getCookie("shoppingCartId");
	$.ajax({
		type : "post",
		url : _content+"/shoppingCartMongo/delete",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			shoppingCartId:shoppingCartId
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				guesscart();
			}else{
				$.toptip("操作失败", 'error');
			}
		}
	})
}

function guessGoodsDetail(){
	var seq = getQueryString("seq");
	var goodsId = getQueryString("goodsId");
	$.ajax({
		type : "post",
		url : _content+"/shoppingCartMongo/listCart",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			userName:userName
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				setCookie("shoppingCartId",msi.data.shoppingCartId,1);
			}else{
				//$.toptip(msi.message, 'error');
			}
		}
	});
	$.ajax({
		type : "post",
		url : _content+"/goodsMongo/goodsDetail",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			goodsId:goodsId
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				var _listimg=""
				for(var n=0;n<msi.data.goodsInfo.listGoodsImg.length;n++){
					_listimg+="<div class='swiper-slide'><img src='"+msi.data.goodsInfo.listGoodsImg[n].goodsImgPath+"' onerror='this.src=\"/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\"'></div>";
				}
				$("#detail-banner .swiper-wrapper").html(_listimg);
				$("#detail-banner").swiper({
					loop: true,
					autoHeight: true,
					autoplay: 2000,
					autoplayDisableOnInteraction: false
				});
				if(msi.data.evaSize==0){
					var evaval = "暂无评论";
				}else{
					var evaval = msi.data.evaSize+"条评论";
				}
				var price = msi.data.goodsInfo.promotionPrice;
				if(null == price || "" == price){
					price = msi.data.goodsInfo.goodsPrice;
				}
				$("#gd-tit").html(msi.data.goodsInfo.goodsName);
				var  spec=msi.data.goodsInfo.spec;
				$("#gd-specificat").html((spec==null||spec=="null")?"":msi.data.goodsInfo.spec);
				$("#gd-sales").html("库存"+msi.data.goodsInfo.stock+msi.data.goodsInfo.unit);
				$("#gd-newprice").html(price);
				$("#gd-oldprice").html(msi.data.goodsInfo.goodsPrice);
				$("#gd-storedetais").html("商家信息："+msi.data.shopInfo.shopName+"<i class='font-ico'>&#xe937;</i>").attr("href","storedetails.jsp?seq="+msi.data.shopInfo.seq);
				$("#gd-evaluat").html("商品评价："+evaval+"<i class='font-ico'>&#xe937;</i>").attr("href","goodsevaluation.jsp?goodsId="+msi.data.goodsInfo.goodsId+"&eva=0");
				$("#gd-buycar").attr("data-goodsid",msi.data.goodsInfo.goodsId);
				setCookie("shopLats",msi.data.shopInfo.lat,1);
				setCookie("shopLngs",msi.data.shopInfo.lng,1);
			}else{
				//$.toptip(msi.message, 'error');
			}
		}
	})
}

function goodsDetailAdd(obj){
	var seq = getQueryString("seq");
	var thisGoodsId = $(obj).attr("data-goodsid");
	var shoppingCartId = getCookie("shoppingCartId");
	var typenum = 0;
	$(".product-list-num").each(function(){
		if($(this).attr("data-goodsid")==thisGoodsId){
			typenum = typenum+1;
		}
	})
	if(!userName){
		//如果参数过多，建议通过 object 方式传入
		$.confirm({
		  title: '提示',
		  text: '需要先登录',
		  onOK: function () {
			  location.href="login.jsp";
		  },
		  onCancel: function () {
			  
		  }
		})
		return;
	}
	
	if(typenum == 0){
		$.ajax({
			type : "post",
			url : _content+"/shoppingCartMongo/add",
			dataType : "json", //设置返回值得类型
			data : {
				goodsId:thisGoodsId,
				seq:seq,
				shoppingCartId:shoppingCartId,
				goodsNum:1,
				userName:userName
			},
			async : true, //是否异步请求，false为同步
			success : function(msi) { //成功返回值执行函数
				if(msi.code==200){
					guesscart();
				}else{
					$.toptip("操作失败", 'error');
				}
			}
		})
	}else{
		$.ajax({
			type : "post",
			url : _content+"/shoppingCartMongo/addMix",
			dataType : "json", //设置返回值得类型
			data : {
				goodsId:thisGoodsId,
				shoppingCartId:shoppingCartId
			},
			async : true, //是否异步请求，false为同步
			success : function(msi) { //成功返回值执行函数
				if(msi.code==200){
					guesscart();
				}else{
					$.toptip("操作失败", 'error');
				}
			}
		})		
	}
}

function guessStoreDetail(){
	var seq = getQueryString("seq");
	var data = {};
	data.seq = seq;
	$.ajax({
		type : "post",
		url : _content+"/shopMongo/getShopDetail",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listifon = "";
			var _storedetail = "";
			if(msi.data.shopInfo.deliverType==""){
				var delivertype="上门自提";
			}else{
				var delivertype=msi.data.shopInfo.deliverType;
			}
			_listifon += "<a href='shoppingpage.jsp?seq="+msi.data.shopInfo.seq+"'>";
			_listifon += "<div class='si-img'><img src='"+msi.data.shopInfo.shopHeadImgPath+"' onerror='this.src=\"/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\"' /></div>";
			_listifon += "<div class='si-con'>";
			_listifon += "<p class='sic-tit'>"+msi.data.shopInfo.shopName+"</p>";
			_listifon += "<p class='sic-score'><img src='../images/level-"+parseInt(msi.data.eva)+".png' /></p>";//<span class='sales'>月售"+msi.data.shopOrders+"单</span>
			_listifon += "<div class='introduce'>";
			_listifon += "<span class='send'>"+delivertype+"</span></div></div></a>";
			$("#sd-storeifon").html(_listifon);
			$("#evascore").html("（"+parseInt(msi.data.eva)+"分）");
			if (msi.data.shopInfo.announcement!=="") {   
				var announcement=msi.data.shopInfo.announcement;
			} else {  
			    var announcement="暂无公告";
			}
			_storedetail +="<p class='sd-tit'>商家信息</p>";
			_storedetail +="<p class='sd-txt'>店名："+msi.data.shopInfo.shopName+"</p>";
			_storedetail +="<p class='sd-txt'>店铺地址："+msi.data.shopInfo.adressDetail+"</p>";
			_storedetail +="<p class='sd-txt'>营业时间："+msi.data.shopInfo.serverTime+"</p>";
			_storedetail +="<p class='sd-txt'>月销量："+msi.data.shopOrders+"单</p>";
			_storedetail +="<p class='sd-txt'>联系电话：<a href='tel:"+msi.data.shopInfo.mobile+"'>"+msi.data.shopInfo.mobile+"</a></p>";
			$("#sd-announcement").html(announcement);
			$("#sd-storedetail").html(_storedetail);
		}
	})
}

function guessStoreEvaluation(n,eva,i){
	var seq = getQueryString("seq");
	$.ajax({
		type : "post",
		url : _content+"/evaMongo/queryEVASeq",
		dataType : "json", //设置返回值得类型
		data : {
			seq:seq,
			pageIndex:n,
			pageSize:i,
			eva:eva
		},
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			if(msi.code==200){
				if($("#evalink").length>0){
					$("#evalink").html("查看全部"+msi.data.allEvaSize+"条评价<i class='font-ico'>&#xe937;</i>").attr("href","allevaluation.jsp?seq="+seq+"&eva=0")
				}
				if($("#evaclassify").length>0){
					$("#evaclassify a").eq(0).html("全部（"+msi.data.allEvaSize+"）").attr("href","allevaluation.jsp?seq="+seq+"&eva=0");
					$("#evaclassify a").eq(1).html("好评（"+msi.data.excellentSize+"）").attr("href","allevaluation.jsp?seq="+seq+"&eva=1");
					$("#evaclassify a").eq(2).html("中评（"+msi.data.middleSize+"）").attr("href","allevaluation.jsp?seq="+seq+"&eva=2");
					$("#evaclassify a").eq(3).html("差评（"+msi.data.badSize+"）").attr("href","allevaluation.jsp?seq="+seq+"&eva=3");
				}
				if(msi.data.evaList.length>0){
					var _listevalust="";
					for(var n=0;n<msi.data.evaList.length;n++){
						_listevalust+="<div class='evaluation-item'>";
						_listevalust+="<div class='ei-img'><img src='../images/face-no.png' /></div>";
						_listevalust+="<div class='ei-ifo'>";
						_listevalust+="<div class='eii-top'><span class='eiit-tel'>"+msi.data.evaList[n].userName+"</span><span class='eiit-time'>"+getSmpFormatDateByLong(msi.data.evaList[n].updateTime,true)+"</span></div>";
						_listevalust+="<div class='eii-star'><img src='../images/level-"+parseInt(msi.data.evaList[n].service)+".png'></div>";
						_listevalust+="<div class='eii-txt'><p style='word-break: break-all;'>"+msi.data.evaList[n].evaluationContent+"</p></div></div></div>";
					}
					$("#storeevalist").css("display","block");
					$("#storeevalist").append(_listevalust);
				}else{
					$(".weui-loading").hide();
					$(".weui-loadmore__tips").html("~ 无更多数据 ~");
				}
			}else{
				//$.toptip(msi.message, 'error');
			}
		}
	});
}

$(function(){
	if($(".shopping-top-preferential").length>0){
		if($(".stp-list .stp-item").length>1){
			$(".shopping-top-preferential .more-but").show();
			$(".stp-list .stp-item").each(function(){
				$(this).css("padding","0 .75rem 0 0")
				if($(this).index()>0){
					$(this).hide();
				}
			})
		}
	}
	$(".shopping-top-preferential .more-but").click(function(){
		$(".stp-list .stp-item").show();
		$(".shopping-top-preferential .more-but").hide();
		$(".shopping-top-preferential .pack-up").show();
	})
	$(".shopping-top-preferential .pack-up").click(function(){
		$(".stp-list .stp-item").each(function(){
			if($(this).index()>0){
				$(this).hide();
			}
		})
		$(".shopping-top-preferential .more-but").show();
		$(".shopping-top-preferential .pack-up").hide();
	});
	if($("#list-type").length>0){
		guessGoods();
	}
	$("body").on("click",".spl-right li",function(){
		$(this).addClass("act").siblings("li").removeClass("act");
		var n = $(this).index();
		var mainContainer = $('#list-con'),
		scrollToContainer = mainContainer.find('.splc-item:eq('+n+')');
		mainContainer.scrollTop(
			scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop()-20
		);
	});
	if($("#goods-details").length>0){
		guessGoodsDetail();
		guesscart();
	}
	if($("#store-details").length>0){
		guessStoreDetail();
		guessStoreEvaluation(1,0,3);
	}
	if($("#allstoreeva").length>0){
		var eva = getQueryString("eva");
		if(eva>0){
			var tabeva = 4-parseInt(eva);			
		}else{
			var tabeva = parseInt(eva);
		}
		$("#evaclassify a").eq(eva).addClass("active");
		guessStoreEvaluation(1,tabeva,10);
		var n = 2;
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		guessStoreEvaluation(n,tabeva,10);
    			loading = false;
    			n=n+1
		  	},500);   //模拟延迟
		});
	}
})
