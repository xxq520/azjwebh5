//返回上一页
function backClick(){
	var url = "/localQuickPurchase/distributionVA/store";
	window.location.href = url;
};

/*$("body").on("click",".set-edit",function(){
      //var url ="/localQuickPurchase/distributionVA/localeRecruit/editGoods";
      //alert(url);
	  // window.location.href=url;
	  window.location.href="/localQuickPurchase/distributionVA/localeRecruit/editGoods";
 });*/
var pageIndex = 1;
hui.refresh('#refreshContainer', refresh);
hui.loadMore(getMore);

var isLoading = false;
var first = true;
var backPageSize;//控制上拉加载
var ImgHeight = $(document).width()/2 - 20;
var seq = seq;
//下拉刷新
function refresh(){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/investmentGoods/findAllInvestmentGoods',
		data : {
			"seq" : seq,
			"pageIndex" : 1,
			"pageSize" : 10
			},
		success : function(data){
			
			var html = "";
			if(data.code == 200) {
				var distributionGoodsList = data.data.distributionGoodsList;//现场招商商品集合
				var activityTitle = data.data.investmentGoods.activityTitle;//店铺信息
				var virtualShop = data.data.virtualShop;//店铺信息
				var storeName = virtualShop.storeName;//店铺信息
				var storeHeadImg = virtualShop.storeHeadImg;//店铺信息
				if(storeHeadImg == null){
					storeHeadImg = "/localQuickPurchase/distributionApp/images/head.png";
				}
				if(storeName == null){
				    storeName = "店铺名：未设置"
				}else{
					storeName = "来自于“"+storeName+"”的邀请";
				}
				$(".activityTitle").html(activityTitle);
				console.log(storeHeadImg);
				$("#storeHeadImg").attr("src",storeHeadImg);
				//document.getElementById("storeHeadImg").src=storeHeadImg;
				$(".color_darkgray").html(storeName);
				var length = distributionGoodsList.length;
				if(distributionGoodsList != null && distributionGoodsList.length > 0){
					for (var i = 0; i < distributionGoodsList.length; i++) {
						var goodsName = distributionGoodsList[i].goodsName;
						///var goodsId = distributionGoodsList[i].goodsId;
						var goodsId = distributionGoodsList[i].gid;
						var goodsProStandard = distributionGoodsList[i].goodsProStandard;//多规格
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var goodsImgPath = distributionGoodsList[i].listGoodsImg;
						if(goodsImgPath == null || goodsImgPath == ""){
							goodsImgPath = "/localQuickPurchase/distributionApp/images/default-classify.png";
						}else{
							if(distributionGoodsList[i].listGoodsImg[0] != null && distributionGoodsList[i].listGoodsImg[0] != ""){
								goodsImgPath = distributionGoodsList[i].listGoodsImg[0].goodsImgPath;//默认取第一个							
							}							
						}
						var subLength = 5;
						if(goodsName != null && goodsName != "" && goodsName.length > subLength){
							goodsName = goodsName.substring(0,subLength);
							goodsName +="..";
						}
						var tatolProStandard = getGoodActivityQuantity(goodsProStandard);
						html += '<div class="set_left" id="'+goodsId+'">'; 
						html += '<img width="'+ ImgHeight +'" height="'+ ImgHeight +'" src="'+goodsImgPath+'"/>'; 
						html += '<p class="margin-t-3 set-goods-title">'+goodsName+'&nbsp;库存：<span style="color:red;">'+tatolProStandard+'</span></p>'; 
						html += '<p class="margin-t-3 set-goods-price">¥'+distributionPrice+'</p>'; 
					//	html += '<span class="margin-t-3">严选</p>'; 
						html += '</div>'; 
						
						pageIndex = 2;
						backPageSize = 10;
						setTimeout(function(){
							$('#investmentGoods').html(html);
							//结束刷新
							hui.endRefresh();
							//重置加载更多状态
							hui.resetLoadMore();
							hui.loading('加载中...', true);
							if(!first){
								hui.toast("下拉刷新成功");	            	
							}
							first = false;
						},500)
					}
					
				}else{
					html += '<p class="positionContent">暂时没有商品,请先去设置!</p>';
					$('#investmentGoods').html(html);
					hui.endRefresh();
			        hui.loading('加载中...', true);
				}
			}else if(data.code == 404){
				var virtualShop = data.data.virtualShop;//店铺信息
				var storeName = virtualShop.storeName;//店铺信息
				var storeHeadImg = virtualShop.storeHeadImg;//店铺信息
				if(storeHeadImg == null){
					storeHeadImg = "/localQuickPurchase/distributionApp/images/head.png";
				}
				if(storeName == null){
				    storeName = "店铺名：未设置"
				}else{
					storeName = "来自于“"+storeName+"”的邀请";
				}
				$(".activityTitle").html(activityTitle);
				console.log(storeHeadImg);
				$("#storeHeadImg").attr("src",storeHeadImg);
				//document.getElementById("storeHeadImg").src=storeHeadImg;
				$(".color_darkgray").html(storeName);
				html += '<p class="positionContent">暂时没有商品,请先去设置!</p>';
				$('#investmentGoods').html(html);
				hui.endRefresh();
		        hui.loading('加载中...', true);
			}
		},
		error : function(data){
			if (data.message == undefined) {
				hui.alert("暂时没有商品,请先去添加吧！");
				$("#logisticsList").hide();
			}
		}
	});
	
};

//统计数量
function getGoodActivityQuantity(items){
	var goodsactivityQuantity = 0;
	for(var i = 0 ;i < items.length ; i++){
		goodsactivityQuantity += items[i].activityQuantity;
	}
	return goodsactivityQuantity;
}
//加载更多
function getMore(){
	if(backPageSize < 10){
		hui.endLoadMore(true, '已经到头了...');
		return;
	}
	if(isLoading){
		return;
	}
	isLoading = true;
	var html = '';
    $.ajax({
    	type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/investmentGoods/findAllInvestmentGoods',
		data : {
			"seq" : seq,
			"pageIndex" : pageIndex,
			"pageSize" : 10
			},
		async : false,
		success : function(data) {
			if(data.code == 200) {
				var distributionGoodsList = data.data.distributionGoodsList;//现场招商商品集合
				var localeRecruitGoods = data.data.localeRecruitGoods.length;//现场招商商品个数集合
				var html = "";
				if (distributionGoodsList.length > 0) {
					backPageSize = localeRecruitGoods - (pageIndex-1)*10;
					var length = distributionGoodsList.length;
					for (var i = 0; i < distributionGoodsList.length; i++) {
						var goodsName = distributionGoodsList[i].goodsName;
						//var goodsId = distributionGoodsList[i].goodsId;
						var goodsId = distributionGoodsList[i].gid;
						var goodsProStandard = distributionGoodsList[i].goodsProStandard;//多规格
						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						var goodsImgPath = distributionGoodsList[i].listGoodsImg;
						var subLength = 5;
						if(goodsName != null && goodsName != "" && goodsName.length > subLength){
							goodsName = goodsName.substring(0,subLength);
							goodsName +="..";
						}
						var tatolProStandard = getGoodActivityQuantity(goodsProStandard);
						if(goodsImgPath == null || goodsImgPath == ""){
							goodsImgPath = "/localQuickPurchase/distributionApp/images/default-classify.png";
						}else{
							if(distributionGoodsList[i].listGoodsImg[0] != null && distributionGoodsList[i].listGoodsImg[0] != ""){
								goodsImgPath = distributionGoodsList[i].listGoodsImg[0].goodsImgPath;//默认取第一个							
							}							
						}
					    html += '<div class="set_left" id="'+goodsId+'">'; 
					    html += '<img width="'+ ImgHeight +'" height="'+ ImgHeight +'" src="'+goodsImgPath+'"/>';
					    html += '<p class="margin-t-3 set-goods-title">'+goodsName+'&nbsp;库存：<span style="color:red;">'+tatolProStandard+'</span></p>'; 
					    html += '<p class="margin-t-3 set-goods-price">¥'+distributionPrice+'</p>'; 
					  //  html += '<span class="margin-t-3">严选</p>'; 
					    html += '</div>'; 
					}
					$(html).appendTo('#investmentGoods');
					pageIndex++;
		            hui.endLoadMore(false);
		            isLoading = false;
			} else {
				hui.endLoadMore(true, '已经到头了...');
                return false;
			}
		  }else if(data.code == 200){
			  hui.toast("网络异常,请稍后再试!");
		  }
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}
//商品详情页
$(document).on('click', '.set_left', function() {
	var goodsId = $(this).attr('id');
	var url = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
	window.location.href = url;
});
/**
<div class="set-goods">
			<div class="set_left">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
			<div class="set_right">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
		</div>
		<div class="set-goods">
			<div class="set_left">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
			<div class="set_right">
				<img src="${base}/distributionApp/images/set-goods.png"/>
				<p class="margin-t-3 set-goods-title">来自法国的葡萄美酒</p>
				<p class="margin-t-3 set-goods-price">¥26.5</p>
				<span class="margin-t-3">严选</p>
			</div>
		</div>
**/



