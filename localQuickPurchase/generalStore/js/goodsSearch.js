if(lat == ""){
	lat = 23.1200491;
}
if(lng == ""){
	lng = 113.30764968;
}
var dId = getQueryString("dealGroupId");
$(function(){
	ShopList.initPage.initList();
	ShopList.listener.getMoreShopList();
	ShopList.listener.getSearch();
});
var ShopList = {
	loading:false,
	data:{
		userName:userName,
		pageIndex:1,
		pageSize:8,
		lat:lat,
		lng:lng,
		dealGroupId:dId,
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
				url: _content+'/shopMongo/findBroundShopWeb',
				type: 'post',
				dataType: 'json',
				data: param,
				contentType: "application/json; charset=utf-8",
			})
			.done(function(res) {
				console.log(res);
				if(res.code == 200){
					var data = res.data;
					var _html = '';
					if(data!=null){
						$.each(data,function(index, el) {
							var distance = getDistance(el.distance);
							var announcement = el.announcement;
							var deliverType = el.deliverType;
							deliverType = (!deliverType) ? '自提' : deliverType;
							announcement = (!announcement) ? '暂无公告' : announcement;
							_html += '<div class="list-item1">';
							_html += '<div class="item-img"><a href="shoppingpage.jsp?seq='+ el.seq +'"><img class="middle" src="'+ el.shopHeadImgPath +'"></a></div>';
							_html += '<div class="item-ifon"><a href="shoppingpage.jsp?seq='+ el.seq +'">';
							_html += '<div class="store-tit">'+ el.shopName;
							var score = el.eva;
							switch(score){
								case 1:
								_html += '<img src="../images/level-1.png"/>';
								break;
								case 2:
								_html += '<img src="../images/level-2.png"/>';
								break;
								case 3:
								_html += '<img src="../images/level-3.png"/>';
								break;
								case 4:
								_html += '<img src="../images/level-4.png"/>';
								break;
								case 5:
								_html += '<img src="../images/level-5.png"/>';
								break;
								default:
								_html += '';
								break;
							}
							_html += '</div><div class="store-tips"><span class="gray">'+ deliverType +'</span></div><div class="store-date"><span class="saleNum">总销量:<em>'+ el.shopOrders +'</em>单</span><span class="store-distance">距离<em>'+ distance +'</em></span></div><div class="store-txt">'+ announcement +'</div></a></div></div>';
						});
						$(".store-list").append(_html);
						if(data.length < 8){
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