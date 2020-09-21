var pageIndex=1;
var pageIndex1=1;
var pageIndex2=1;
var pageIndex3=1;
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
	//全部
	listGoods(pageIndex1,4);
})



//批量上下架
$("#handle_xj").click(function(){
	var list =[];
	list=$(".checked");
	var goodsIdList="";
	
	if(list.length == 0){
		mui.alert("请选择商品!");
		return;
	}
	for(var i = 0; i < list.length; i++) {
		var goodsId = list[i].getAttribute("value");
		console.info(goodsId);
		goodsIdList+=goodsId+",";
	}
	//console.info(goodsIdList);
	//console.info(JSON.stringify(goodsIdList));
	var str=$(this).html().substring(2,4);
	var btnArray = ['取消', '确认'];  
    mui.confirm("确认"+str+"这些宝贝吗?", '提示',btnArray, function(e){
    	if(e.index==1){
    		$.ajax({
    			type: "POST",
    			url : '/localQuickPurchase/dGoodsAction/modifierGoodsStatu',
    			//traditional: true,
    			data : {
    				"seq":seq,
    				"goodsListId":goodsIdList,
    			},
    			async : true,
    			success : function(data) {
    				//console.info(data);
    				var successSize = data.data.successSize;
    				mui.alert("批量修改"+successSize+"条数据!");
    				 //mui.toast("成功修改"+successSize+"条数据!",{ duration:'long', type:'div' }) 
    				window.location.reload();
    			},
    			error : function(err) {
    				//mui.alert("网络错误");
    			}
    		});
    	}else{
    		
    	}
    });
});



//加载全部数据
function listGoods(pageIndex,state){
	$.ajax({
		type: "POST",
		url : '/localQuickPurchase/dGoodsAction/myGoodsList',
		data : {
			"seq":seq,
			"pageSize":10,
			"pageIndex":pageIndex,
			"keyWord":keyWord,
			"categoryId":categoryId,
			"state":state//上下架的状态 2：已上架，3：已下架 ，
		},
		async : true,
		success : function(data) {
			//console.info(data);
			if(data.code==200){
				//console.info(data.data);
				var goods = data.data.list;
				//获取收藏夹列表
				var _listhtml="";
				for(var n=0;n<goods.length;n++){
					var goodsProStandards = goods[n].goodsProStandard;
					var distributionPrice = getDistributionPrice(goodsProStandards);
//					var distributionPrice=goods[n].distributionPrice;
					if(distributionPrice<=0){
						var platformPrice = getPlatformPrice(goodsProStandards);
//						var costPrice = (goods[n].platformPrice*1.15).toFixed(2);
						var costPrice = (platformPrice*1.15).toFixed(2);
						distributionPrice = (costPrice*1.2).toFixed(2);
					}
					_listhtml+='<li class="mui-table-view-cell goods-list-item" num="'+n+'" value="'+goods[n].goodsId+'">';
					_listhtml+='<div class="check-box"><div class="btn-check"><span class="font-ico"></span></div></div>';
					_listhtml+='<div class="good-content">';
					_listhtml+='<div class="good-pic">';
					_listhtml+='<img src="'+goods[n].thumbnail+'" alt="" />';
					_listhtml+='</div>';
					_listhtml+='<div class="good-info">';
					_listhtml+='<h4 class="good-name">'+goods[n].goodsName+'</h4>';
					_listhtml+='<div class="good-price txt-red txt-red"><span class="rmb">分销价:￥</span><span class="price-num">'+distributionPrice+"元/"+goods[n].unit+'</span></div>';
					//_listhtml+='<div class="good-amount">库存：<span class="amount-num">'+goods[n].stock+'</span></div>';
//					var salesVolume = goods[n].salesVolume == null? 1 : goods[n].salesVolume;
					var salesVolume = getSalesVolume(goodsProStandards) == null ? 1 : getSalesVolume(goodsProStandards);
					_listhtml+='<div class="moq">起订量：<span class="moq-num">'+salesVolume+'</span></div>';
					var stateNow = goods[n].state;
					// stateHtml = stateNow == 2 ? "下架" : "编辑";
					if(stateNow == 2){
						_listhtml+='<div class="handle-btn" data-num="'+n+'" data-size="'+distributionPrice+'" data-id="'+goods[n].goodsId+'" data-state="'+goods[n].state+'" onclick="changeState(this);">下架</div>';
					}else if(stateNow == 3){
						_listhtml+='<div class="handle-btn" data-num="'+n+'" data-size="'+distributionPrice+'" data-id="'+goods[n].goodsId+'" data-state="'+goods[n].state+'" onclick="changeState(this);">上架</div>';
					}
					_listhtml+='</div></div></li>';
				}
				hasNextPage=data.data.hasNextPage;
				if(hasNextPage){
					$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">上拉加载更多~~</div>');
				}else{
					$(".mui-pull-bottom-tips").html('<div class="mui-pull-bottom-wrapper">没有更多数据~~</div>');
					hasNextPage=true;
				}
				if(state == 2){
					$(".item2mobile").append(_listhtml);
				}else if(state == 3){
					$(".item3mobile").append(_listhtml);
				}else{
					$(".item1mobile").append(_listhtml);
				}
			}else{
				mui.alert(data.message);
			}
		},
		error : function(err) {
			//mui.alert("网络错误");
		}
	});
};
//点击已上架刷新页面
$("body").on('click','#sj',function(){
	listGoods(pageIndex1,4);
});
//点击已下架刷新页面
$("body").on('click','#xj',function(){
	listGoods(pageIndex1,4);
});

//点击上下架按钮
mui('body').on('tap','.handle-btn',function(){
	var _this=$(this);
	var goodsId=$(this).attr("data-id");
	var nstate=parseInt($(this).attr("data-state"));
	var size=$(this).attr("data-size");
	var num = $(this).attr("data-num");
	var a = $(this).parent().parent().parent().attr("num");
	
	if(size==0){
		mui.toast("没有设置分销价，商品上架失败");
	}
	var btnArray = ['取消', '确认'];  
    mui.confirm("确认"+_this.html()+"该宝贝吗?", '提示',btnArray, function(e) {  
        if (e.index == 1) {  
        	var obj={};
        	obj.goodsId=goodsId;
        	//state 当前商品状态
        	obj.state=nstate==3?2:3;
        	obj.seq=seq;
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
        				var changeStateStr;
        				if (nstate == 2) {
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
        				if(_this.parents("ul").hasClass("item2mobile") || _this.parents("ul").hasClass("item3mobile") ){
        					_this.parents("li").remove();
        				}
        				mui.toast(changeStateStr+"成功!!");
        				if (a == num) {
        					$(this).parent().parent().parent().css('display','none');
        				}
        				//location.reload();
        			}
        		},
        		error : function(err) {
        		}
        	});  
        } else {  
             
        }  
    });
});


mui.ready(function() {
	//循环初始化所有下拉刷新，上拉加载。
	mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
		self = this;
		//console.log(mui(pullRefreshEl));
		mui(pullRefreshEl).pullToRefresh({
			down: {
				callback: function() {
					
					//console.log(index);
					self = this;
					setTimeout(function() {
						if(index==1){//上架商品
							state=2;
							pageIndex2=1;
							pageIndex=pageIndex2;
							$(".item2mobile").html("");
						}else if(index==2){//下架商品
							pageIndex3=1;
							pageIndex=pageIndex3;
							state=3;
							$(".item3mobile").html("");
						}else{//全部商品
							pageIndex1=1;
							pageIndex=pageIndex1;
							state=4;
							$(".item1mobile").html("");
						}
						listGoods(pageIndex,state);
						self.endPullDownToRefresh();
					}, 1000);
				}
			},
			up: {
				callback: function() {
					//console.log(index);
					self = this;
					setTimeout(function() {
						
						var iHTML = $(".mui-scroll").find(".mui-active").html().trim();
						if(iHTML=="全部"){
							state = null;
							pageIndex1++;
							listGoods(pageIndex1,null);
						}else if(iHTML==="已上架"){
							state = 2;
							pageIndex2++;	
							listGoods(pageIndex2,2);
						}else if(iHTML==="已下架"){
							state = 3;
							pageIndex3++;	
							listGoods(pageIndex3,3);
						}
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