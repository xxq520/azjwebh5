var keyword = getQueryString("keyword");
$(function(){
	ShopList.initPage.initList();
	ShopList.listener.getMoreShopList();
	ShopList.listener.getSearch();
});
var ShopList = {
	loading:false,
	data:{
		keyword:keyword,
		lat:lat,
		lng:lng,
	},
	listener:{
		getMoreShopList:function(){
			$(document.body).infinite().on("infinite", function() {
			  if(ShopList.loading) return;
				  ShopList.loading = true;
				  setTimeout(function() {
			  		ShopList.data.pageIndex++;
			  		ShopList.initPage.initList();
	  			    ShopList.loading = false;
			  }, 500);   //模拟延迟
			});
		},
		getSearch:function(){
			$("input[name=keyword]").click(function(){
				window.location.href = 'search.jsp';
			});
		}
	},
	initPage:{
		initList:function(){
			var param = JSON.stringify(ShopList.data);
			$.ajax({
				url: _content+'/shopMongo/findByKeyword',
				type: 'post',
				dataType: 'json',
				data: param,
				contentType: "application/json; charset=utf-8",
			})
			.done(function(res) {
//				console.log(res);
				if(res.code == 200){
					var data = res.data;
					var _html = '';
					if(data!=''){
						$.each(data,function(index, el) {
							var tel = el.telephone;
							tel = (!tel) ? '无' : tel;
							_html += '<div class="list-item1">';
							_html += '<div class="item-img"><a href="shoppingpage.jsp?seq='+ el.seq +'"><img class="middle" src="'+ el.shopHeadImgPath +'" onerror="this.src=\'/localQuickPurchase/imgback/shopDefault.jpg;this.onerror=null;\'"></a></div>';
							_html += '<div class="item-ifon">';
							_html += '<a href="shoppingpage.jsp?seq='+ el.seq +'">';
							_html += '<div class="store-tit">'+ el.shopName +'</div>';
							_html += '<div class="store-eva">';
							var score = el.eva;
							switch(score){
								case 1:
								_html += '<img src="../images/level-1.png" style="width:35%;" />';
								break;
								case 2:
								_html += '<img src="../images/level-2.png" style="width:35%;" />';
								break;
								case 3:
								_html += '<img src="../images/level-3.png" style="width:35%;" />';
								break;
								case 4:
								_html += '<img src="../images/level-4.png" style="width:35%;" />';
								break;
								case 5:
								_html += '<img src="../images/level-5.png" style="width:35%;" />';
								break;
								default:
								_html += '';
								break;
							}
							_html += '<span class="totalSale" style="display:none;">总销量<em>'+ el.shopOrders +'</em>单</span></div>';
							_html += '<div class="store-type">'+ el.dealName +'</div>';
							_html += '<div class="store-wordTime">营业时间:<em>'+ (el.serverTime==null?"全天":el.serverTime) +'</em></div>';
							_html += '<div class="store-tel">电话:<em>'+ tel +'</em></div>';
							_html += '<div class="store-address">地址:<em>'+ el.adressDetail +'</em></div>';
							_html += '</a></div></div>';
						});
						$(".store-list").append(_html);
						if(data.length < 10){
							$(".weui-loading").hide();
							$(".weui-loadmore__tips").text('');
						}
					}else{
						$(".weui-loading").hide();
						$(".weui-loadmore__tips").text('没有其他商品了...');
					}
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
		}
	}

}