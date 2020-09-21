
// 添加购物车事件
function addCart(supplierSeq,shopSeq,goodsId,userName,goodsNum,sku,specs,shareSeq){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/dCart/add',
		data : JSON.stringify({
			'supplierSeq' : parseInt(supplierSeq),   
			'shopSeq' : parseInt(shopSeq),
			'goodsId' : goodsId,
			'userName' : userName,
			'goodsNum' : goodsNum,
			'distributorType' :distributorType,
			'sku' :sku,
			'spec' :specs,
			'shareSeq' : shareSeq
		}),
		async : false,
		success : function(data) {
			var code = data.code;
			if(code == 200){
				hui.toast("加入购物车成功");
				//通知手机端  加入购物车成功
				 try{
					 window.action.app_addCarSuccess();
				 }catch (e) {
				 }
			}else if(code == 501){
				hui.toast(data.message);
			} else {
				hui.toast("加入购物车失败");
			}
		}
	})
}

// 加入收藏或加入我的店铺
function addOrFavorite(seq,goodsId,distributorType){
	var flag=false;
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/dGoodsAction/addOrFavorite',
		data : {
			'goodsId' : goodsId,   
			'seq' : seq,
			'distributorType' : distributorType,
		},
		async : false,
		success : function(data) {
			var code = data.code;
			if(code == 200){
				hui.iconToast("上架成功");
				flag = true;
			}/*else if(code==405){
				hui.iconToast("已经存在","error");
				flag = true; 
			}*/else{
				hui.iconToast("上架失败","error");
				flag = false;
			}
		}
	})
	return flag;
}

//移除收藏或从我的店铺移除
function reduceOrFavorite(seq,goodsId,distributorType){
	var flag =false 
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/dGoodsAction/reduceOrFavorite',
		data : {
			'goodsId' : goodsId,   
			'seq' : seq,
			'distributorType' : distributorType,
		},
		async : false,
		success : function(data) {
			var code = data.code;
			if(code==200){
				hui.iconToast("下架成功");
				flag = true;
			}else{
				hui.iconToast("下架失败","error");
				flag = false;
			}
		}
	})
	return flag;
}

