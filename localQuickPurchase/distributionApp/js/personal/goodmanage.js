var pageIndex = 1;
var pageSize = 5;
var isLoading = false;
var first = true;
hui.refresh('#refreshContainer', refresh);
hui.loadMore(getMore);
// 获取网络店主昵称
$.ajax({
	type:'post',
	dataType:'json',
	url:'/localQuickPurchase/virtualShopAction/findShopBySeq',
	data:{
		seq : distributorSeq
	},
	async : false,
	success:function(data){
		var virtualShop = data.data.virtualShop;
		if(virtualShop != null){
			var storeHeadImg = virtualShop.storeHeadImg;
			var storeName = virtualShop.storeName;
			if(storeName=="" || storeName ==null ){
				storeName="店铺名称:未设置";
			}
			$('.userName').html(storeName);
			if(storeHeadImg != null) {
				$('.personal_detail2').find("img").attr("src",storeHeadImg);
				//shopImgUrl =  "/localQuickPurchase/distributionApp/images/head.png";
			}
		}
	}
})

//加载更多
function getMore(){	
	if(isLoading){
		return;
	}
	isLoading = true;
	// 因渲染时获取分享图片路径找不到，固ajax方法放在jsp中
	findDistributorGoods();
}
//下拉刷新
function refresh(){
    /*hui.loading('加载中...');*/
    pageIndex = 1;
    // 因渲染时获取分享图片路径找不到，固ajax方法放在jsp中
    refreshDistributorGoods();
}
