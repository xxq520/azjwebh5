var pageIndex = 1;
var main_container = 1
hui.refresh('.main_container', refresh);
hui.loadMore(getMore);

var isLoading = false;
var first = true;
var goodsList;

//下拉刷新
function refresh(){
	
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/presellGoods/findPresellGoods',
		data : {
			"pageIndex" : 1,
			"pageSize" : 10
			},
		success : function(data){
			
			var html = "";
			if(data.code == 200) {
				var bookingGoodsList = data.data;
				if(bookingGoodsList != null && bookingGoodsList.length > 0){
					//for (var i = 0; i < bookingGoodsList.length; i++) {
						html = _setListData(bookingGoodsList);
					//}
					console.log(html);
					pageIndex = 2;
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
					
				} else {
					html += '<p class="positionContent">暂时没有预售商品!</p>';
					$('#investmentGoods').html(html);
					hui.endRefresh();
			        hui.loading('加载中...', true);
				}
			}
		},
		error : function(data){
			
		}
	});
	
};
//加载更多
function getMore(){
	if(isLoading){
		hui.endLoadMore(true, '已经到头了...');
		return false;
	}
	isLoading = true;
	var html = '';
    $.ajax({
    	type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/presellGoods/findPresellGoods',
		data : {
			"pageIndex" : pageIndex,
			"pageSize" : 10
			},
		async : false,
		success : function(data) {
			if(data.code == 200) {
				var html = "";
				var bookingGoodsList = data.data;
				if(bookingGoodsList != null && bookingGoodsList.length > 0){
					for (var i = 0; i < bookingGoodsList.length; i++) {
						html = _setListData(bookingGoodsList);
					}
					$(html).appendTo('#investmentGoods');
					pageIndex++;
					hui.endLoadMore(false);
					isLoading = false;					
				}else{
					hui.endLoadMore(true, '已经到头了...');
	                return false;
				}
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}

function _setListData(_data){
	var dataIndex = 0;
	var index = 1;
	goodsList = _data;
	
	var html = "";
	for (var i = 0; i < goodsList.length; i++) {
		var thumbnail = goodsList[i].thumbnail;//缩略图路径
		var goodsName = goodsList[i].goodsName;//商品名
		var goodsId = goodsList[i].goodsId;//商品名
		
		// ============== 默认取第一个规格的参数来比较 ================================================
		var distributionPrice = goodsList[i].goodsProStandard[0].distributionPrice;//分销价
		var activityStartTime = goodsList[i].statrtTime;//活动开始时间
		var activityFinishTime = goodsList[i].endTime;//活动结束时间
		var distributionProfit = goodsList[i].goodsProStandard[0].distributionProfit;//分销商佣金
		var profitPrice = goodsList[i].goodsProStandard[0].profitPrice;//代理商佣金
		var presellDay = goodsList[i].presellDay;
		var endTime = goodsList[i].endTime;
		
		html += '<div class="good-detail">';
		html += '<div class="goods-info" style="border-bottom:none">';
		html += '<img src="'+thumbnail+'" class="goodsDetail" goodsId="'+goodsId+'" num="'+dataIndex+'">';
		html += '<div class="order-detail font-md-3">';
		html += '<span class="order-name font-md-3 margin-t-3">'+goodsName+'</span>';
		html += '<span class="margin-t-3 font-sm" style="width: 70%;">';
		html += '<span class="color_red ">￥'+distributionPrice+'</span>';
		html += '</span>';
		html += '<div class="timer" id="timer"  style="padding:.2rem 0;">预售开始时间:'+formatDateTime_(activityStartTime)+'</div>';	
		html += '<div class="timer" id="timer2" style="padding:.2rem 0;">最迟发货时间:'+formatDateTime_(fun_date(endTime,presellDay))+'</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
														   
	}
	return html;
}

//商品图片点击  进入商品详情
$("body").on('click', '.goodsDetail', function() {
	var goodsId = $(this).attr('goodsId');
	var num = $(this).attr('num');
	// addGoodsHistoryBySeq(seq,goodsId);//暂时注释
	if(seq == null || seq == 0) {
		seq = 0;
	}
	var url = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
	window.location.href = url;
});