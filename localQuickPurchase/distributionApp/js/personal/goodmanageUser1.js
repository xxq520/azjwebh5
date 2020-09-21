var pageIndex = 1;
//hui.refresh('.goods_list', downMove);
//hui.loadMore(goodsList);
var isLoading = false;	
var first = true;
var shopSeq;
//获得用户的网络店主
$(function(){
	$.ajax({ 
		type: "POST", 
		url : _content+'/dApplicationAction/findDisByUserSeq', 
		data :{"userSeq":seq}, 
		async : true, 
		success :function(data) {
			console.info(data);
			if(data.code == 400){
				hui.toast("你没有挂扣的网络店主!");
				//window.stop(); 
				return;
			}
			if(data.code == 200){
				var userName = data.data.userName;
				shopSeq = data.data.seq;
				$(".distributionName").html(userName);
				$("#shopSeq").append('<input type="hidden" name="shopSeq" class="shopSeq" value="'+ shopSeq + '">');
				//onerror="this.src=\'/localQuickPurchase/distribution/img/head.png;this.onerror=null;\'"
			}else{
				//hui.alert(data.message);
			}
		}
  })
});

//首次加载精品商品列表
function goodsList(){
	if(isLoading){return;}
	isLoading = true;
	$.ajax({ 
		type: "POST", 
		url : _content+'/commodityShow/recommendShop', 
		//url : _content+'/favoritesAction/favorites', 
		data :{
			"pageIndex":pageIndex,
			"distributorSeq":seq,
		}, 
		async : true, 
		success :function(data) {
			var goodsList = data.data;
			var _html='';
			if(goodsList.length > 0){
				for(var i = 0 ; i< goodsList.length ; i++){
					_html+=	'<div class="full-container">';
					_html+=	'<div class="all">';
					_html+=	'<div class="good-detail" style="border: none">';
					_html+=	'<div class="goods-info goods-mg no-border">';
					_html+=	' <img src="'+goodsList[i].thumbnail+'" class="goodsDetai">';
					_html+=	'<div class="order-detail">';
					_html+=	'<span style="float:none; height: 1.3rem;" class="goods-name mutiply overflow font-sm goodsDetai"><span style="margin-right: 7px;" class="color_red border-red">特卖</span>'+goodsList[i].goodsName+'</span>';
					_html+=	'<div class=" pull-left color_gray">￥'+goodsList[i].goodsPrice+' 元 /'+goodsList[i].orderGoodsUnit+'</div>';
					_html+=	'<div class="full-container color_gray goods-op">';
					_html+=	'<span>库存：'+goodsList[i].stock+'</span>';
					var goodsId = goodsList[i].goodsId;
					var supplierSeq = goodsList[i].supplierSeq;
					var goodsName = goodsList[i].goodsName;
					var thumbnail = goodsList[i].thumbnail;
					_html+= '<input type="hidden" name="goodsId" class="goodsId" value="'+ goodsId + '">';// 供应商seq
					_html+= '<input type="hidden" name="supplierSeq" class="supplierSeq" value="'+ supplierSeq + '">';// 供应商seq
					_html+= '<input type="hidden" name="goodsName" class="goodsName" value="'+ goodsName + '">';// 
					_html+= '<input type="hidden" name="thumbnail" class="thumbnail" value="'+ thumbnail + '">';// 
					_html+= '<div class="goodmanage-img" id="shareShop"><img  src="../distributionApp/images/goodsmng_06.png"></div>';
					_html+= '<div class="goodmanage-img" id="addShopCar"><img src="${path}/distributionApp/images/goodsmng_04.png"></div>';
					
					_html+=	'</div></div></div></div></div></div>';

					_html+=getGoodsItemhtml(goodsList[i]);

				}
				$(".goods_list").append(_html);
				
				pageIndex++;
				 hui.endLoadMore(false);
		         isLoading = false;
			}else{
				hui.endLoadMore(true, '已经到头了...');
                return ;
			}
		}
});
}
//下拉加载....
function downMove(){
	 hui.loading('加载中...');
		isLoading = true;
	$.ajax({ 
		type: "POST", 
		url : _content+'/commodityShow/recommendShop', 
		data :{
			"pageIndex":pageIndex,
		}, 
		async : true, 
		success :function(data) {
			console.info(data);
			var goodsList = data.data;
			var _html='';
			if(goodsList.length > 0){
				for(var i = 0 ; i< goodsList.length ; i++){

					var goodsId = goodsList[i].goodsId;
					_html+=	'<div class="full-container">';
					_html+=	'<div class="all">';
					_html+=	'<div class="good-detail" style="border: none">';
					_html+=	'<div class="goods-info goods-mg no-border">';
					_html+=	' <img src="'+goodsList[i].thumbnail+'"  class="goodsDetai">';
					_html+= '<input type="hidden" name="goodsId" class="goodsId" value="'+ goodsId + '">';
					_html+=	'<div class="order-detail">';
					_html+= '<input type="hidden" name="goodsId" class="goodsId" value="'+ goodsId + '">';
					_html+=	'<span style="float:none; height: 1.3rem;" class="goods-name mutiply overflow font-sm"><span style="margin-right: 7px;" class="color_red border-red">特卖</span>'+goodsList[i].goodsName+'</span>';
					_html+=	'<div class=" pull-left color_gray">￥'+goodsList[i].goodsPrice+' 元 /'+goodsList[i].orderGoodsUnit+'</div>';
					_html+=	'<div class="full-container color_gray goods-op">';
					_html+=	'<span>库存：'+goodsList[i].stock+'</span>';
					var supplierSeq = goodsList[i].supplierSeq;
					var goodsName = goodsList[i].goodsName;
					var thumbnail = goodsList[i].thumbnail;
					var distributionSeq = goodsList[i].seq;
					_html+= '<input type="hidden" name="goodsId" class="goodsId" value="'+ goodsId + '">';// 供应商seq
					_html+= '<input type="hidden" name="supplierSeq" class="supplierSeq" value="'+ supplierSeq + '">';// 供应商seq
					_html+= '<input type="hidden" name="distributionSeq" class="distributionSeq" value="'+ distributionSeq + '">';// 供应商seq
					_html+= '<input type="hidden" name="goodsName" class="goodsName" value="'+ goodsName + '">';// 
					_html+= '<input type="hidden" name="thumbnail" class="thumbnail" value="'+ thumbnail + '">';// 
					_html+= '<div class="goodmanage-img" id="shareShop"><img  src="../distributionApp/images/goodsmng_06.png"></div>';
					_html+= '<div class="goodmanage-img" id="addShopCar"><img src="${path}/distributionApp/images/goodsmng_04.png"></div>';
					
					_html+=	'</div></div></div></div></div></div>';

					_html+=getGoodsItemhtml(goodsList[i]);

				}
				$(".goods_list").append(_html);
				
				pageIndex++;
				setTimeout(function(){
					$(".goods-content").append(_html);
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
		}
});
}
function getGoodsItemhtml(goods){
	var _html="";
	_html+=	'<div class="full-container">';
	_html+=	'<div class="all">';
	_html+=	'<div class="good-detail" style="border: none">';
	_html+=	'<div class="goods-info goods-mg no-border">';
	_html+=	' <img src="'+goods.thumbnail+'">';
	_html+=	'<div class="order-detail">';
	_html+=	'<span style="float:none; height: 1.3rem;" class="goods-name mutiply overflow font-sm"><span style="margin-right: 7px;" class="color_red border-red">特卖</span>'+goods.goodsName+'</span>';
	_html+=	'<div class=" pull-left color_gray">￥'+goods.goodsPrice+' 元 /'+goods.unit+'</div>';
	_html+=	'<div class="full-container color_gray goods-op">';
	//_html+=	'<span>库存：'+goods.stock+'</span>';
	var goodsId = goods.goodsId;
	var supplierSeq = goods.supplierSeq;
	var goodsName = goods.goodsName;
	var thumbnail = goods.thumbnail;
	var distributionSeq = goods.seq;
	_html+= '<input type="hidden" name="goodsId" class="goodsId" value="'+ goodsId + '">';// 供应商seq
	_html+= '<input type="hidden" name="supplierSeq" class="supplierSeq" value="'+ supplierSeq + '">';// 供应商seq
	_html+= '<input type="hidden" name="distributionSeq" class="distributionSeq" value="'+ distributionSeq + '">';// 供应商seq
	_html+= '<input type="hidden" name="goodsName" class="goodsName" value="'+ goodsName + '">';// 
	_html+= '<input type="hidden" name="thumbnail" class="thumbnail" value="'+ thumbnail + '">';// 
	_html+= '<div class="goodmanage-img" id="shareShop"><img  src="'+_content+'/distributionApp/images/goodsmng_06.png"></div>';
	_html+= '<div class="goodmanage-img" id="addShopCar"><img src="'+_content+'/distributionApp/images/goodsmng_04.png"></div>';
	_html+=	'</div></div></div></div></div></div>';
	return _html;
}
//添加 到购物车
$(document).on("click","#addShopCar",function(){
	var goodsId = $(this).parent(".full-container").children(".goodsId").val();
	var supplierSeq = $(this).parent(".full-container").children(".supplierSeq").val();
	supplierSeq = supplierSeq == "null" ? 0 : supplierSeq;
	shopSeq = shopSeq == null ? 0 : shopSeq;
	$.ajax({
			type : "post",// 定义提交的类型
			url : _content+"/dCart/add",
			dataType : "json",// 设置返回值得类型
			data : {
				"userName" : userName,
				"goodsId" : goodsId,
				"shopSeq" : shopSeq,
				"goodsNum" : 1,// 默认为1
				"supplierSeq" : supplierSeq,
			},
			async : false,// 是否异步请求，false为同步
			success : function(data) {// 成功返回值执行函数
				if (data.code == 200) {
					hui.toast("添加成功!");
				} else {
					hui.toast("添加失败!");
		}
			}
	})
});

$(document).on("click",".goodsDetai",function(){
	var goodsId = $(this).attr('id');
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0";
});