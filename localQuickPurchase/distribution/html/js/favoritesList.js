var globalpagenum=1;//开始页码数(默认1)
var nextPage = true;//下一页(默认有)
var favorPage = {
		userSeq: getQueryString('seq'),
		MD5distributorSeq : getQueryString('MD5distributorSeq'),
		beFrom : 1
};
/*获取收藏夹列表*/
function getFavoritesList(globalpagenum,obj){
	$.ajax({
		type:'GET',
		dataType:'json',
		url:'/localQuickPurchase/favoritesAction/favorites',
		data:{
			distributorSeq : favorPage.userSeq,
			pageIndex : globalpagenum,
			pageSize : 10,
		},
		async : false,
		success:function(data){
			var favorites = data.data.list;
			if(nextPage){
				var _listhtml="";
				for(var i = 0; i < favorites.length; i++){
					var distributionPrice = favorites[i].distributionPrice;//分销价，如果是自己发布的商品，可自定义价格
					var distributionURL = favorites[i].distributionURL;//分销商品的链接
					var distributorSeq = favorites[i].distributorSeq;//分销商用户
					var favoritesTime = favorites[i].favoritesTime;//收藏时间
					var goodsId = favorites[i].goodsId;//商品ID
					var goodsName = favorites[i].goodsName;//商品名
					var goodsPrice = favorites[i].goodsPrice;//原价，销售价
					var platformPrice = favorites[i].platformPrice;//平台价
					var profitPrice = favorites[i].profitPrice;//分销利润价，如果是自己发布的商品，可自定义价格
					var sales = favorites[i].sales;//销售量
					var state = favorites[i].state;//上传商品状态为  -1:店家已删除的商品，不显示  ：待上架，2：已上架，3：已下架 ，
					var thumbnail = favorites[i].thumbnail;//缩略图
					var unit = favorites[i].unit;//单位
					var favoritesId = favorites[i].id;
					_listhtml+='<div class="listitem">';
					_listhtml+='<div class="mui-tab-link li-left" target="javascript:;">';
					_listhtml+='<div class="lil-img"><img src="'+thumbnail+'"/></div>';
					_listhtml+='<div class="lil-ifon">';
					_listhtml+='<p class="lili-tit">'+goodsName+'</p>';
					_listhtml+='<p class="lili-price">分销价格：'+distributionPrice+'元/'+unit+'</p>';
//					_listhtml+='<p class="lili-sales">销售量：25468条</p>';
					_listhtml+='</div></div>';
					_listhtml+='<div class="li-right">';
					if (state == 2) {
						_listhtml+='<a onClick=shareGoodsDetail("'+goodsId+'");return false;><span class="mui-tab-method lir-share">去购买</span></a>';

					} else {
						_listhtml+='<span class="mui-tab-method lir-sold-out" >已下架</span>';
					}
					_listhtml+='</div></div>';
				}
				$("#favoriteslist").append(_listhtml);
				obj.endPullupToRefresh(false);
				nextPage = data.data.hasNextPage;
			}else{
				setTimeout(function(){
					obj.endPullupToRefresh(true);
				},1000);
			}
		},
		error : function(error) {
			$.alert("网络错误！！");
		}
	});
}	
/*收藏夹列表的下拉加载*/
if($("#favoriteslist").length>0){
	mui.init({
		pullRefresh : {
			container:"#muiscroll",
			down: {
				callback: function() {
					window.location.reload(true);
				}
			},
			up : {
				height:50,
				auto:true,
				contentrefresh : "正在加载...",
				contentnomore:'没有更多数据了',
				callback :moreFavoritesData 
			}
		}
	});
}
/*收藏夹列表加载更多数据*/
function moreFavoritesData(){
	var obj=this;
	if (nextPage) {
		getFavoritesList(globalpagenum,obj)
		globalpagenum++;
	} else {
		setTimeout(function(){
			obj.endPullupToRefresh(true);
		},1000);
	}
}
/*解决MUI框架不支持onClick、href的方法*/
mui('body').on('tap','a',function(e){
	this.click();
});
/*商品详情*/
function shareGoodsDetail(goodsId){
	var distributorSeq = favorPage.userSeq;
	var MD5distributorSeq = favorPage.MD5distributorSeq;
	if (goodsId != null && distributorSeq != null && MD5distributorSeq != null) {
		location.href="/localQuickPurchase/distribution/html/goodsDetail.jsp?goodsId="+goodsId+"&distributorSeq="+distributorSeq+"&MD5distributorSeq="+MD5distributorSeq;
		//$('.share').attr('href',href);//mui框架不支持window.location.href这样的跳转，只能换成a标签的href
		return true;	
	} else {
		mui.toast("缺失参数，操作失败！");
		return false;
	}
}