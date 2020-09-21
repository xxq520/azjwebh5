guessCollect();
function guessCollect(){
	var data = {};
	data.lng=getCookie("a-lng");
    data.lat=getCookie("a-lat");
	data.userName = userName;
	$.ajax({
		type : "post",
		url : _content+"/attention/getAttentionByMobile",
		dataType : "json", //设置返回值得类型
		contentType : "application/json",
		data : JSON.stringify(data),
		async : true, //是否异步请求，false为同步
		success : function(msi) { //成功返回值执行函数
			var _nearlist = "";
			var _otherlist = "";
			_nearlist += "<div class='collection-tit'>附近区域店家（"+msi.data.nearShop.length+"家）</div>";
			_otherlist += "<div class='collection-tit'>其他区域店家（"+msi.data.otherShop.length+"家）</div>";
			if(msi.data.nearShop.length>0){
				for(var n=0;n<msi.data.nearShop.length;n++){
					_nearlist += "<div class='collection-item'>";
					_nearlist += "<a href='shoppingpage.jsp?seq="+msi.data.nearShop[n].shop.seq+"'>";
					_nearlist += "<div class='ci-img'><img src='"+msi.data.nearShop[n].shop.shopHeadImgPath+"'></div>";
					_nearlist += "<div class='ci-ifo'>";
					_nearlist += "<div class='cii-top'><span class='ciit-tit'>"+msi.data.nearShop[n].shop.shopName+"</span></div>";/*<span class='ciit-distance'>约2千米</span>*/
					_nearlist += "<div class='cii-cen'><img src='../images/level-"+parseInt(msi.data.nearShop[n].eva)+".png'><span class='ciic-sale'>总售"+msi.data.nearShop[n].shopOrders+"单</span></div>";
					_nearlist += "<div class='cii-bot'><span class='ciib-item red'>距离"+msi.data.nearShop[n].range+"米</span></div>";
					_nearlist += "</div></a></div>";
				}				
			}
			if(msi.data.otherShop.length>0){
				for(var i=0;i<msi.data.otherShop.length;i++){
					_otherlist += "<div class='collection-item'>";
					_otherlist += "<a href='shoppingpage.jsp?seq="+msi.data.otherShop[i].shop.seq+"'>";
					_otherlist += "<div class='ci-img'><img src='"+msi.data.otherShop[i].shop.shopHeadImgPath+"'></div>";
					_otherlist += "<div class='ci-ifo'>";
					_otherlist += "<div class='cii-top'><span class='ciit-tit'>"+msi.data.otherShop[i].shop.shopName+"</span></div>";/*<span class='ciit-distance'>约2千米</span>*/
					_otherlist += "<div class='cii-cen'><img src='../images/level-"+parseInt(msi.data.otherShop[i].eva)+".png'><span class='ciic-sale'>总售"+msi.data.otherShop[i].shopOrders+"单</span></div>";
					_otherlist += "<div class='cii-bot'><span class='ciib-item red'>距离"+msi.data.otherShop[i].range+"米</span></div>";
					_otherlist += "</div></a></div>";
				}				
			}
			$("#nearstore").html(_nearlist);
			$("#otherstore").html(_otherlist);			
		}
	});
}

$(function(){
	if($("#collection").length>0){
		getLocat(guessCollect);
	}
})
