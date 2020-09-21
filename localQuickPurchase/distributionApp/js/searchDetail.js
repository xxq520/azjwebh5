//获取关键字recordword
var keyword = $("#method1").val();

//用关键字搜索商品列表
$(function(){
	var html = "";
	document.getElementById("searchKuang").value=keyword;
	$.ajax({
		type : "post",	//定义提交的类型
		url : "/localQuickPurchase/dGoodsAction/dFindGoodsByKeyword",
		dataType : "json",	//设置返回值得类型
		contentType: "application/json;charset=utf-8",
		data : JSON.stringify({"keyword" :keyword}),
		
		success : function(data) {	//成功返回值执行函数
			var goods = data.data.list;
			if(goods.length == 0){
				hui.toast("暂没有该类型的商品！");
			}
			for(var i = 0; i <goods.length; i++){
				
				var goodsId = goods[i].goodsId;
				var goodsName = goods[i].goodsName;
				var stock = goods[i].stock; //库存
				var goodsPrice = goods[i].goodsPrice; //价格
				var thumbnail = goods[i].thumbnail; //图片地址
				if(thumbnail == null) {
					thumbnail = "http://ndhimg.520shq.com//UploadFile/GHS/20170504/2017050416125175790.jpeg";
				}
				
				html +='<li>';
				html +='<div class="hotSaleImg">';
				html += '<img id="'+goodsId +'" src='+thumbnail+'>';
				html += '</div>';
				html +='<p class="hotSaleTitle" >'+goodsName+'</p> ';
				html += '<p class="inventoryNumber">库存'+stock+'</p> ';
				html += '<div class="hotSalePrice"><p class="hotSalePrice1">￥'+goodsPrice+'</p></div>';
				html += '</li>';
			}
			$(".productList").append(html);
		},
		error : function(){
			
		}
	});
	
	
});
//商品详情
function goodsDetail(goodsId){
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/goodsDetail/"+goodsId;

};
//清空输入框
$(document).on('click','.header-delete',function(){
	document.getElementById("searchKuang").value = '';
});

$(document).on('click', 'img', function() {
	var goodsId = $(this).attr('id');
//	addGoodsHistoryBySeq(seq,goodsId);//暂时注释
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId;
});