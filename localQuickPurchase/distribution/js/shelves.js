var pageIndex=1;
var keyWord="";
var categoryId;// 分类id
var dataByQuery = true;// 判断是否按分类搜索，false为按分类搜索
var hasNextPage=true;
var state =null;
//上下架分类--全部上下架的状态 2：已上架，3：已下架 ，
/*$("#item1mobile").click(function(){
	//$(".item1mobile").html("");
	$("#btn_edit").hide();
	listGoods(pageIndex,null);
});
//上架分类
$("#item2mobile").click(function(){
	//$(".item2mobile").html("");
	$("#btn_edit").show();
	state = 2;
	listGoods(pageIndex,state);
});

//上架分类
$("#item3mobile").click(function(){
	//$(".item3mobile").html("");
	$("#btn_edit").show();
	state = 3;
	listGoods(pageIndex,state);
});*/

//打开首次加载全部
$(function(){
	listGoods(pageIndex,state);
	
	//延迟加载已上架
	setTimeout(function(){
		state = 2;
		listGoods(pageIndex,state);
		
		//延迟加载已下架
		setTimeout(function(){
			state = 3;
			listGoods(pageIndex,state);
		},1500); 
	},1500); 
})



//批量上下架
$("#handle_xj").click(function(){
	var list =[];
	list=$(".checked");
	var goodsIdList="";
	
	if(list.length == 0){
		alert("请选择商品!");
		return;
	}
	for(var i = 0; i < list.length; i++) {
		var goodsId = list[i].getAttribute("value");
		console.info(goodsId);
		goodsIdList+=goodsId+",";
	}
	console.info(goodsIdList);
	console.info(JSON.stringify(goodsIdList));
	
	$.ajax({
		type: "POST",
		url : '/localQuickPurchase/dGoodsAction/modifierGoodsStatu',
		//traditional: true,
		data : {
			"seq":userSeq,
			"goodsListId":goodsIdList,
		},
		async : true,
		success : function(data) {
			console.info(data);
			var successSize = data.data.successSize;
			alert("批量修改"+successSize+"条数据!");
			 //mui.toast("成功修改"+successSize+"条数据!",{ duration:'long', type:'div' }) 
			window.location.reload();
		},
		error : function(err) {
			alert("网络错误");
		}
	});
});



//加载全部数据
function listGoods(pageIndex,state){
	$.ajax({
		type: "POST",
		url : '/localQuickPurchase/dGoodsAction/myGoodsList',
		data : {
			"seq":userSeq,
			"pageSize":10,
			"pageIndex":pageIndex,
			"keyWord":keyWord,
			"categoryId":categoryId,
			"state":state//上下架的状态 2：已上架，3：已下架 ，
		},
		async : true,
		success : function(data) {
			console.info(data);
			if(data.code==200){
				console.info(data.data);
				var goods = data.data.list;
				//获取收藏夹列表
				var _listhtml="";
				for(var n=0;n<goods.length;n++){
					_listhtml+='<li class="mui-table-view-cell goods-list-item" value="'+goods[n].goodsId+'">';
					_listhtml+='<div class="check-box"><div class="btn-check"><span class="font-ico"></span></div></div>';
					_listhtml+='<div class="good-content">';
					_listhtml+='<div class="good-pic">';
					_listhtml+='<img src="'+goods[n].thumbnail+'" alt="" />';
					_listhtml+='</div>';
					_listhtml+='<div class="good-info">';
					_listhtml+='<h4 class="good-name">'+goods[n].goodsName+'</h4>';
					_listhtml+='<div class="good-price txt-red txt-red"><span class="rmb">分销价:￥</span><span class="price-num">'+(goods[n].distributionPrice).toFixed(2)+"元/"+goods[n].unit+'</span></div>';
					_listhtml+='<div class="good-amount">库存：<span class="amount-num">'+goods[n].stock+'</span></div>';
					var salesVolume = goods[n].salesVolume == null? 1 : goods[n].salesVolume;
					_listhtml+='<div class="moq">起订量：<span class="moq-num">'+salesVolume+'</span></div>';
					var stateNow = goods[n].state;
					// stateHtml = stateNow == 2 ? "下架" : "编辑";
					if(stateNow == 2){
						_listhtml+='<div class="handle-btn" data-size="'+goods[n].distributionPrice+'" data-id="'+goods[n].goodsId+'" data-state="'+goods[n].state+'" onclick="changeState(this);">上架</div>';
					}else if(stateNow == 3){
						_listhtml+='<div class="handle-btn" data-size="'+goods[n].distributionPrice+'" data-id="'+goods[n].goodsId+'" data-state="'+goods[n].state+'" onclick="changeState(this);">下架</div>';
					}
					_listhtml+='</div></div></li>';
				}
				if(state == 2){
					$(".item2mobile").append(_listhtml);
					hasNextPage=data.data.hasNextPage;
					if(hasNextPage){
						$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">上拉加载更多~~</div>');
					}else{
						$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">没有更多数据~~</div>');
						hasNextPage=true;
					}
				}else if(state == 3){
					$(".item3mobile").append(_listhtml);
					hasNextPage=data.data.hasNextPage;
					if(hasNextPage){
						$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">上拉加载更多~~</div>');
					}else{
						$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">没有更多数据~~</div>');
						hasNextPage=true;
					}
				}
				
					$(".item1mobile").append(_listhtml);
					hasNextPage=data.data.hasNextPage;
					if(hasNextPage){
						$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">上拉加载更多~~</div>');
					}else{
						$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">没有更多数据~~</div>');
						hasNextPage=true;
					}
				
				
			}else{
				alert(data.message);
			}
		},
		error : function(err) {
			alert("网络错误");
		}
	});
};

//点击上下架按钮
mui('body').on('tap','.handle-btn',function(){
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


mui.ready(function() {
	//循环初始化所有下拉刷新，上拉加载。
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		self = this;
		console.log(index);
		console.log(mui(pullRefreshEl));
		mui(pullRefreshEl).pullToRefresh({
			down: {
				callback: function() {
					self = this;
					setTimeout(function() {
						self.endPullDownToRefresh();
					}, 1000);
				}
			},
			up: {
				callback: function() {
					self = this;
					setTimeout(function() {
						pageIndex++;	
						var iHTML = $(".mui-scroll").find(".mui-active").html().trim();
						if(iHTML=="全部"){
							state = null;
						}else if(iHTML==="已上架"){
							state = 2;
						}else if(iHTML==="已下架"){
							state = 3;
						}
						listGoods(pageIndex,state);
						if (!hasNextPage) {
							self.endPullUpToRefresh(true);
						}else{
							self.endPullUpToRefresh(false);
							hasNextPage=false;
						}
					}, 1000);
				}
			}
		})
	})
});

/*document.getElementById('slider').addEventListener('slide', function(event) {
	if(event.detail.slideNumber == 1){
		
	}else if(event.detail.slideNumber == 2){
		
	}
});*/