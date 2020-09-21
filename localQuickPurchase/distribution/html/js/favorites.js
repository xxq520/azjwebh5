var nextPage = true;//下一页
var categoryId;//商品分类ID
var favorPage = {
		distributorSeq : userSeq,
		masterSeq:0,
		categoryId : null,
		pageNum:1
};
/*首次加载商品分类数据*/
$(function(){
	var html;
	$.ajax({
		type:'GET',
		dataType:'json',
		url:'/localQuickPurchase/dGoodsAction/getGoodsCategory',
		data: {
			distributorSeq : favorPage.distributorSeq,
		},
		async:false,
		success:function(data){
			var business = data.data;
			
			if(business.length > 0) {
				html = '<button id="'+0+'">'+"全部"+'</button>'
				for (var i = 0; i < business.length; i++) {
					var businessTypeName = business[i].name;//分类名
					var categoryId = business[i].id;
					html+='<button id="'+categoryId+'">'+businessTypeName+'</button>';
				}
				$('.group-content').html(html);
			} else {
				/*如果没有数据就添加新样式*/
				var style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML=".group{background: #fff;}";
				document.getElementsByClassName('group').item(0).appendChild(style);
			}
		},
		error:function(error){
			alert(error);
		}
	});
});

/*收藏夹列表的下拉加载*/
if($("#favoriteslist").length>0){
	mui.init({
		pullRefresh : {
			container:"#muiscroll",
			down: {
				callback:pullDown
			},
			up : {
				height:50,
				auto:true,
				contentrefresh : "正在加载...",
				contentnomore:'没有更多数据了',
				callback :pullUp 
			}
		}
	});
}
/*启用右滑关闭功能*/
mui.init({  
	swipeBack: true   
});
/*移出收藏夹*/
function myCancelCollect(goodsId,distributorSeq){
	var param = {
			goodsId : goodsId,
			distributorSeq : Number(distributorSeq)
	};
	var btnArray = ['取消', '确认'];  
	mui.confirm('确认移出收藏夹？','提示',btnArray,function(e) {  
		if (e.index == 1) {
		$.ajax({
				type : 'POST',
				dataType : 'json',
				data : param,
				url : '/localQuickPurchase/favoritesAction/remove',
				success : function(data){
					if (data.code == 200) {
						mui.toast("成功移出！");
						//pullDown();
						setTimeout(function(){
							window.location.reload();
						},1000);
					} else {
						alert(data.message);
						return false;
					}
				}
			})
		} else {  
			mui.toast("放弃操作！");
		}  
	})  
}
/*分享商品*/
function myShareGoods(favoritesId,seq,distributorSeq,goodsId){
	$.ajax({
		type:'POST',
		dataType:'json',
		url:'/localQuickPurchase/dApplicationAction/withinLimits',
		data:{
			distributorSeq : distributorSeq,
			masterSeq : seq
		},
		async : false,
		success : function(result){
			endTime(result.code);
		},
		error : function(error){
			mui.toast("网络错误！！");
		}
	});
	function endTime(result) {
		var masterSeq = seq;
		if(result == 200){
			if (favoritesId != null && goodsId != null && distributorSeq != null && masterSeq != null) {
				location.href="shareGoods.jsp?favoritesId="+favoritesId+"&goodsId="+goodsId+"&distributorSeq="+distributorSeq+"&masterSeq="+seq;
				return true;
			}
			mui.toast("缺是参数，操作失败！")
			return false;
		}
		mui.toast("不在营销时间内！！")
		return false;
	}
}
/*分享收藏夹*/
function myShareFavorites(){
	if ($("#favoriteslist").find('.listitem').length > 0) {
		$.ajax({
			type:'POST',
			dataType:'json',
			url:'/localQuickPurchase/dApplicationAction/withinLimits',
			data:{
				distributorSeq : favorPage.distributorSeq,
				masterSeq : favorPage.masterSeq
			},
			async : false,
			success : function(result){
				endTime(result.code);
			},
			error : function(error){
				mui.toast("网络错误！！");
			}
		});
		function endTime(result) {
			if(result == 200){
				var seq = favorPage.distributorSeq;
				if (seq != null) {
					location.href="shareFavorites.jsp?seq="+seq;
					return true;
				} 
				mui.toast("缺是参数，操作失败！");
				return false;
			}
			mui.toast("不在营销时间内！！");
			return false;
		}
	}else{
		mui.toast("没有数据不能分享！！");
		return false;
	}
}

/*分类搜索的点击事件*/
mui("body").on("tap",".group button",function(){
	$("input[name='keyword']").val("");//清空关键字
	var categoryId = $(this).attr('id');
	if(categoryId == 0){
		$("#favoriteslist").html("");//清空样式
		favorPage.pageNum = 1;
		favorPage.categoryId = null;
		mui('#muiscroll').pullRefresh().pulldownLoading();
	} else {
		$("#favoriteslist").html("");//清空样式
		favorPage.pageNum = 1;
		favorPage.categoryId = categoryId;
		mui('#muiscroll').pullRefresh().pulldownLoading();
	}
	$(this).addClass("active").siblings().removeClass("active");//切换样式
});
/*下拉加载数据*/
function pullDown(){
	favorPage.pageNum = 1;
	$.ajax({
		type:'GET',
		dataType:'json',
		url:'/localQuickPurchase/favoritesAction/favorites',
		data:{
			distributorSeq : favorPage.distributorSeq,
			pageIndex : 1,
			pageSize : 10,
			categoryId : favorPage.categoryId
		},
		async : false,
		success:function(data){
			var favorites = data.data.list;
				var _listhtml="";
				if (favorites.length > 0) {
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
					var seq = favorites[i].seq;//服务商
					favorPage.masterSeq = seq;
					_listhtml+='<div class="listitem">';
					_listhtml+='<div class="mui-tab-link li-left" target="javascript:;">';
					_listhtml+='<div class="lil-img" ><a onClick=findGoodsDetails("'+ goodsId+'");return false;><img src="'+thumbnail+'"/></a></div>';
					_listhtml+='<div class="lil-ifon">';
					_listhtml+='<p class="lili-tit">'+goodsName+'</p>';
					_listhtml+='<p class="lili-price">分销价格：'+distributionPrice+'元/'+unit+'</p>';
//					_listhtml+='<p class="lili-sales">销售量：25468条</p>';
					_listhtml+='</div></div>';
					_listhtml+='<div class="li-right">';
					if (state == 2) {
						_listhtml+='<a class="share" onClick=myShareGoods("'+favoritesId+'","'+seq+'","'+distributorSeq+'","'+goodsId+'");return false;><div class="mui-tab-method lir-share">分享商品</div></a>';
						_listhtml+='<a class="cancel" onClick=myCancelCollect("'+goodsId+'","'+distributorSeq+'");return false;><div class="mui-tab-method lir-cancel">取消收藏</div></a>';

					} else {
						_listhtml+='<div class="mui-tab-method lir-sold-out"">已下架</div>';
						_listhtml+='<a onClick=myCancelCollect("'+goodsId+'","'+distributorSeq+'");return false;><div class="mui-tab-method lir-cancel">取消收藏</div></a>';
					}
					_listhtml+='</div></div>';
				}
				$("#favoriteslist").empty();
				$("#favoriteslist").append(_listhtml);
				nextPage =data.data.hasNextPage;
				favorPage.pageNum = favorPage.pageNum + 1;
				mui('#muiscroll').pullRefresh().endPulldownToRefresh();
				mui('#muiscroll').pullRefresh().refresh(true);
				} else {
					mui.toast("没有数据了！！");
					mui('#muiscroll').pullRefresh().endPulldownToRefresh();
					mui('#muiscroll').pullRefresh().refresh(true);
				}
		},
		error : function(error) {
			mui.toast("网络错误！！");
		}
	});
}
/*上拉加载数据*/
function pullUp(){
	var self = this;
	$.ajax({
		type:'GET',
		dataType:'json',
		url:'/localQuickPurchase/favoritesAction/favorites',
		data:{
			distributorSeq : favorPage.distributorSeq,
			pageIndex : favorPage.pageNum,
			pageSize : 10,
			categoryId : favorPage.categoryId
		},
		async : false,
		success:function(data){
			var favorites = data.data.list;
			if(nextPage){
				var _listhtml="";
				if (favorites.length > 0) {
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
					var seq = favorites[i].seq;//服务商
					favorPage.masterSeq = seq;
					_listhtml+='<div class="listitem">';
					_listhtml+='<div class="mui-tab-link li-left" target="javascript:;">';
					_listhtml+='<div class="lil-img" ><a onClick=findGoodsDetails("'+ goodsId+'");return false;><img src="'+thumbnail+'"/></a></div>';
					_listhtml+='<div class="lil-ifon">';
					_listhtml+='<p class="lili-tit">'+goodsName+'</p>';
					_listhtml+='<p class="lili-price">分销价格：'+distributionPrice+'元/'+unit+'</p>';
//					_listhtml+='<p class="lili-sales">销售量：25468条</p>';
					_listhtml+='</div></div>';
					_listhtml+='<div class="li-right">';
					if (state == 2) {
						_listhtml+='<a class="share" onClick=myShareGoods("'+favoritesId+'","'+seq+'","'+distributorSeq+'","'+goodsId+'");return false;><div class="mui-tab-method lir-share">分享商品</div></a>';
						_listhtml+='<a class="cancel" onClick=myCancelCollect("'+goodsId+'","'+distributorSeq+'");return false;><div class="mui-tab-method lir-cancel">取消收藏</div></a>';

					} else {
						_listhtml+='<div class="mui-tab-method lir-sold-out"">已下架</div>';
						_listhtml+='<a onClick=myCancelCollect("'+goodsId+'","'+distributorSeq+'");return false;><div class="mui-tab-method lir-cancel">取消收藏</div></a>';
					}
					_listhtml+='</div></div>';
				}
				$("#favoriteslist").append(_listhtml);
				self.endPullupToRefresh(false);
				nextPage =data.data.hasNextPage;
				favorPage.pageNum = favorPage.pageNum+1;
				} else {
					mui('#muiscroll').pullRefresh().endPullupToRefresh(false);
					if($(".noMoreTips").length==0){
						$("#favoriteslist").append('<p class="noMoreTips">没有更多数据了</p>');
					}
				}
			}else{
				setTimeout(function(){
					self.endPullupToRefresh(true);
				},1000);
			}
		},
		error : function(error) {
			mui.toast("网络错误！！");
		}
	});
}
//进行关健字搜索
$(".keyword-search").click(function(){
	var keyword = $("input[name='keyword']").val();
	if(keyword == null || keyword ==""){
		pullDown();
		return;
	}
	 //alert(keyword+": :" +favorPage.distributorSeq+"favorPage.categoryId:"+favorPage.categoryId);
		$.ajax({
			type:'GET',
			dataType:'json',
			url:'/localQuickPurchase/favoritesAction/queryFavoritesByKeyword',
			data: {
				distributorSeq : favorPage.distributorSeq,
				pageIndex : 1,
				pageSize : 10,
				categoryId : favorPage.categoryId,
				keyword:keyword
			},
			async:true,
			success:function(data){
				console.log(data);
				var favorites = data.data.list;
				console.info(favorites);
				
					var _listhtml="";
					if (favorites.length > 0) {
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
						var seq = favorites[i].seq;//服务商
						favorPage.masterSeq = seq;
						_listhtml+='<div class="listitem">';
						_listhtml+='<div class="mui-tab-link li-left" target="javascript:;">';
						_listhtml+='<div class="lil-img" ><a onClick=findGoodsDetails("'+ goodsId+'");return false;><img src="'+thumbnail+'"/></a></div>';
						_listhtml+='<div class="lil-ifon">';
						_listhtml+='<p class="lili-tit">'+goodsName+'</p>';
						_listhtml+='<p class="lili-price">分销价格：'+distributionPrice+'元/'+unit+'</p>';
//						_listhtml+='<p class="lili-sales">销售量：25468条</p>';
						_listhtml+='</div></div>';
						_listhtml+='<div class="li-right">';
						if (state == 2) {
							_listhtml+='<a class="share" onClick=myShareGoods("'+favoritesId+'","'+seq+'","'+distributorSeq+'","'+goodsId+'");return false;><div class="mui-tab-method lir-share">分享商品</div></a>';
							_listhtml+='<a class="cancel" onClick=myCancelCollect("'+goodsId+'","'+distributorSeq+'");return false;><div class="mui-tab-method lir-cancel">取消收藏</div></a>';

						} else {
							_listhtml+='<div class="mui-tab-method lir-sold-out"">已下架</div>';
							_listhtml+='<a onClick=myCancelCollect("'+goodsId+'","'+distributorSeq+'");return false;><div class="mui-tab-method lir-cancel">取消收藏</div></a>';
						}
						_listhtml+='</div></div>';
					}
					$("#favoriteslist").empty();
					$("#favoriteslist").append(_listhtml);
					nextPage =data.data.hasNextPage;
					favorPage.pageNum = favorPage.pageNum + 1;
					mui('#muiscroll').pullRefresh().endPulldownToRefresh();
					mui('#muiscroll').pullRefresh().refresh(true);
					} else {
						$("#favoriteslist").empty();
						mui.toast("没有数据了！！");
						mui('#muiscroll').pullRefresh().endPulldownToRefresh();
						mui('#muiscroll').pullRefresh().refresh(true);
					}
			
			},
			error:function(error){
				alert(error);
			}
		});
	});