var pageindex =1;
/*猜你喜欢*/
function guessYouLike(){
	var data = {};
	data.userName=userName;
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
	$.ajax({
		type : "post",
		url : _content+"/goodsMongo/guessYouLikeGoods",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				if(msi.data[n].goods.listGoodsImg.length==0){
					var imgpath="";
				}else{
					var imgpath=msi.data[n].goods.listGoodsImg[0].goodsImgPath;
				}
				var price = msi.data[n].goods.promotionPrice;
				if(null == price || "" == price){
					price = msi.data[n].goods.goodsPrice;
				}
				_listhtml+="<div class='list-item'><a href='goodsdetails.jsp?seq="+msi.data[n].shop.seq+"&goodsId="+msi.data[n].goods.goodsId+"'>";
				_listhtml+="<div class='item-img'><img class='middle' src='"+imgpath+"'></div>";
				_listhtml+="<div class='item-ifon'>";
				_listhtml+="<div class='product-tit'>"+msi.data[n].goods.goodsName+"</div>";
				_listhtml+="<div class='product-tips'>"+msi.data[n].shop.shopName+"</div>";
				_listhtml+="<div class='product-buttom'>";
				_listhtml+="<span class='product-price'>&yen;<i>"+price+"</i></span>";
				_listhtml+="<span class='product-sales'>月销"+msi.data[n].goods.sales+"包</span>";
				_listhtml+="</div></div></a></div>";
			}
			$("#youlike-list").html(_listhtml);
		}
	})
}

function guessNearMerchants(){
	var data = {};
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
    data.pageIndex=pageindex;
    data.pageSize=5;
    data.dealGroupId="";
	data.userName=userName;
	$.ajax({
		type : "post",
		url : _content+"/shopMongo/findBroundShop",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _listhtml = "";
			for(var n=0;n<msi.data.length;n++){
				var i=4;
				/*if(msi.data[n].listGoods.length<5){
					var i=msi.data[n].listGoods.length;
				}else{
					var i=4;
				}*/
				_listhtml+="<div class='list-item'>";
				_listhtml+="<div class='item-img'><a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'><img class='middle' src='"+msi.data[n].shopHeadImgPath+"'></a></div>";
				_listhtml+="<div class='item-ifon'><a href='shoppingpage.jsp?seq="+msi.data[n].seq+"'>";
				_listhtml+="<div class='store-tit'><i>[推荐]</i>"+msi.data[n].shopName+"<img src='../images/level-"+parseInt(msi.data[n].eva)+".png'></div>";
				_listhtml+="<div class='store-date'>月销"+(msi.data[n].shopOrders==null?"0":msi.data[n].shopOrders)+"单 | 小于"+parseInt(msi.data[n].distance)+"米</div></a></div>";
				_listhtml+="<div class='preferential-layer'>";
				_listhtml+="<div class='preferential-list'>";
				for(var j=0;j<i;j++){
					break;
					if(msi.data[n].listGoods[j].listGoodsImg.length==0){
						var imgpath="";
					}else{
						var imgpath=msi.data[n].listGoods[j].listGoodsImg[0].goodsImgPath;
					}
					var priceNow = msi.data[n].listGoods[j].promotionPrice;
					if(priceNow == null || priceNow == ""){
						priceNow = msi.data[n].listGoods[j].goodsPrice;
					}
					_listhtml+="<div class='preferential-product'><a href='goodsdetails.jsp?seq="+msi.data[n].seq+"&goodsId="+msi.data[n].listGoods[j].goodsId+"'>"
					_listhtml+="<div class='pp-img'><img class='middle' src='"+imgpath+"'></div>";
					_listhtml+="<div class='pp-price'>&yen;"+priceNow+"</div>";
					_listhtml+="</a></div>";
				}
				_listhtml+="</div></div></div>";
			}
			$("#s-loading-con").append(_listhtml);
			$(".weui-loadmore").css("display","block");
			if(msi.data.length<5){
				$(".weui-loadmore").css("display","block");
				$(".weui-loading").hide();
				$(".weui-loadmore__tips").html("~ 无更多数据 ~");
			}
		}
	});
	pageindex = pageindex+1;
}
$(function(){
	if($(".swiper-container").length>0){
		$(".swiper-container").swiper({
			loop: true,
			autoHeight: true,
			autoplay: 2000,
			autoplayDisableOnInteraction: false
		});
	}
	getLocat(guessYouLike);
	getLocat(guessNearMerchants);
	if($("#s-loading-con").length>0){
		var loading = false;  //状态标记
		$(document.body).infinite().on("infinite", function() {
		  	if(loading) return;
	  		loading = true;
		  	setTimeout(function() {
		  		getLocat(guessNearMerchants);
    			loading = false;
		  	},1000);   //模拟延迟
		});
	}
})