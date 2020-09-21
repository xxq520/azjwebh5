var pi=1;
var keyWord="";
var categoryId;// 分类id
var dataByQuery = true;// 判断是否按分类搜索，false为按分类搜索
var hasNextPage=true;
$(function(){
	var obj;
	var initData={
			//参数
			"param":function(pi){
				var param={"seq":userSeq,"pageSize":10,"pageIndex":pi,"keyWord":keyWord,"categoryId":categoryId};
				return param;
			},
			// 分类搜索参数
			"category":function(pi){
				var category={"seq":userSeq,"pageSize":10,"pageIndex":pi,"categoryId":categoryId};
				return category;
			},
			"functions":{
				"init" :function(data){
					var goods = data.list;
					var html = "";
					/*获取收藏夹列表*/
						var _listhtml="";
						for(var n=0;n<goods.length;n++){
							_listhtml+="<div class='listitem'>";
							_listhtml+="<a href='../changePriceSj.jsp?goodsId="+goods[n].goodsId+"'>";
							_listhtml+="<div class='mui-tab-link li-left' target='javascript:;'>";
							_listhtml+="<div class='lil-img'><img src='"+goods[n].thumbnail+"' onerror='this.src=\"/localQuickPurchase/imgback/goods.jpg\"' /></div>";
							_listhtml+="<div class='lil-ifon'>";
							_listhtml+="<p class='lili-tit'>"+goods[n].goodsName+"</p>";
							_listhtml+="<p class='lili-price' >分销价:"+(goods[n].distributionPrice).toFixed(2)+"元/"+goods[n].unit+"</p>";
							_listhtml+="<p class='lili-stock'>库存量："+goods[n].stock+"</p>";
							//_listhtml+="<p class='lili-sales'>销售量：25468条</p>";
							_listhtml+="</div></div>";
							_listhtml+="</a>";
							_listhtml+="<div class='li-right'>";
							_listhtml+="<div class='mui-tab-method lir-share div-click' data-size='"+goods[n].distributionPrice+"' data-id='"+goods[n].goodsId+"' data-state='"+goods[n].state+"' onclick='changeState(this);'>"+(goods[n].state==2?"下架":"上架")+"</div>";
							//_listhtml+="<div class='mui-tab-method lir-cancel' onclick='javascript:cancelCollect();'>取消收藏</div>";
							_listhtml+="</div></div>";
						}
						$("#favoriteslist").append(_listhtml);
						hasNextPage=data.hasNextPage;
						if(hasNextPage){
							pi++;
							obj.endPullupToRefresh(false);
						}else{
							obj.endPullupToRefresh(false);
							if($(".noMoreTips").length==0){
								$("#favoriteslist").append('<p class="noMoreTips">没有更多数据了</p>');
							}
						}
				},
				"sendUrl":function(){
					$.ajax({
						type : 'POST',
						contentType: "application/json;charset=utf-8",
						
						url : '/localQuickPurchase/dGoodsAction/mydg',

						data : JSON.stringify(initData.param(pi)),
						async : true,
						dataType : 'JSON',
						success : function(data) {
							var data = data.data;
							if(data!=null)
								initData.functions.init(data);
							
						},
						error : function(err) {
							alert("网络错误");
						}
					});
				},
				"queryByCId":function(){
					$.ajax({
						type : 'GET',
						contentType: "application/json;charset=utf-8",
						
						url : '/localQuickPurchase/dGoodsAction/queryByCId',

						data : initData.category(pi),
						async : true,
						dataType : 'JSON',
						success : function(data) {
							var data = data.data;
							if(data!=null)
								initData.functions.init(data);
							
						},
						error : function(err) {
							alert("网络错误");
						}
					});
				}
			}
	}
	
	/*//收藏
	$( ".collect").on('click', function() {
		var isFavorites = $(this).attr("isFavorites");
		var goodsId = $(this).attr("goodsId");
		var url = "/localQuickPurchase/favoritesAction/";
		url+=isFavorites=="true"?"remove":"add";
		$.post(url,{"goodsId":goodsId,"distributorSeq":data.param.distributorSeq},function(result){
			if(result.code==200){
				alert((isFavorites=="true"?"取消":"收藏")+"成功");
				setTimeout(function(){
        			location.reload();
				},500)
			}else{
				alert("操作失败");
			}
		});
	});*/
	
	/*收藏夹列表加载更多数据*/
	function moreFavoritesData(){
		obj=this;
		console.log("hasNextPage" + hasNextPage);
		if(hasNextPage){
			if(dataByQuery){
				initData.functions.sendUrl();
			} else{
				initData.functions.queryByCId();
			}
		}else{
			obj.endPullupToRefresh(false);
		}
	}
	/*收藏夹列表下拉加载*/
	//if($("#favoriteslist").length>0){
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
	//}
	
	
	//搜索事件
	mui('body').on('tap','.seaBtn',function(){
		mui("#muiscroll").scroll().scrollTo(0,0,0);
		//obj.endPullupToRefresh(false);
		//$(this).siblings().val();
		keyWord = $("#goodsKeyword").val();
		initData.param.keyWord = keyWord;
		initData.param.categoryId = parseInt();
		console.log(initData.param.categoryId);
		$("#favoriteslist").html('');
		pi = 1;
		//dataByQuery = false;
		initData.param.pageIndex = 1;
		initData.functions.sendUrl();
		dataByQuery = true;
	});
	// 点击分类事件
	mui('body').on('tap','.group button',function(){
		$(this).addClass("active").siblings().removeClass("active");

		mui("#muiscroll").scroll().scrollTo(0,0,0);
		categoryId = $(this).val();
		$("#favoriteslist").html('');
		pi = 1;
		dataByQuery = false;
		initData.functions.queryByCId();
	});
	// 初始化分类列表
	$.ajax({
		type : 'GET',
		contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/dGoodsAction/getCategoryId',
		data : {seq : userSeq},
		async : true,
		dataType : 'JSON',
		success : function(data) {
			var data = data.data;
			if(data!=null){
				var list = "";
				for(var i=0;i<data.length;i++){
					if (i == 0) {
						$(".group-content").append('<button class="active" value="">全部</button>');
					}
					list+='<button value="'+data[i].id+'">'+data[i].name+'</button>';
				}
				$(".group-content").append(list);
			}
			
		},
		error : function(err) {
			alert("网络错误");
		}
	});
	
	
});
mui('#contUl').on('tap', 'li', function() { //给li添加点击事件，直接写普通的a标签或者在元素上加onclick事件不成功
});
mui('body').on('tap','.div-click',function(){
	var _this=$(this);
	var goodsId=$(this).attr("data-id");
	var state=parseInt($(this).attr("data-state"));
	var size=$(this).attr("data-size");
	if(size==0){
		mui.toast("没有设置分销价，商品上架失败");
	}
	var obj={};
	obj.goodsId=goodsId;
	//state 当前商品状态
	obj.state=state==3?2:3;
	obj.seq=userSeq;
	$.ajax({
		type : 'POST',
		contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/dGoodsAction/modifyDGState',
		data : JSON.stringify(obj),
		async : false,
		dataType : 'json',
		success : function(data) {
			if(data.code==200){
				var newstate;
				var newstateStr;
				if (state == 2) {
					newstate = 3;
					newstateStr="上架";
					changeStateStr = "下架";
				} else {
					newstate = 2;
					newstateStr= "下架";
					changeStateStr = "上架";
				}
				$(_this).html(newstateStr);
				$(_this).attr("data-state",newstate);
				mui.toast(changeStateStr+"成功!!");
				//location.reload();
			}
		},
		error : function(err) {


		}
	});
});

