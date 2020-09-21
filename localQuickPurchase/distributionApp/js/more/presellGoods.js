/**
 * 预售--更多商品
 */
var pageIndex = 1;
var isLoading = false;
var first = true;
var seq = seq;
hui.loadMore(getMore);
hui.refresh('.product_box1', refresh);
var name = getQueryString("name");
function getMore(){
	if(isLoading){
		return;
	}
	isLoading = true;
	var html = '';
	$.ajax({
		type : 'Get',
		dataType : 'JSON',
		url : 'http://192.168.1.96:8080/localQuickPurchase/selectionGoods/SelectionGoodsCom',
		data : {
			CNname: "",
		    ZSname: "",
			YXname: "",
			MRname: name,
			pageIndex : pageIndex,
			pageSize : 10
		},
		async : false,
		success : function(result){
			var s = result.data.Yx;
			if(s != undefined || s != null){
				for(var i = 0; i < s.length; i++){
					var goodsName = s[i].goodsName;//商品名字
					var goodsImg = s[i].thumbnail;//商品图片
					var goodsId = s[i].goodsId;//商品ID
					var goodsCode = s[i].goodsCode;//商品code
					var goodsProStandard = s[i].goodsProStandard;
					if(goodsProStandard != null){
						var buyingPrice = s[i].goodsProStandard[0].buyingPrice;//商品价格
					}
					var goodsProStandard = s[i].goodsProStandard;
					var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
					html += '<li>'
					html += 	'<div class="hotSaleImg">'
					html += 		'<img id="'+goodsId+'"src=' + goodsImg + '  class="good-pic">'
					html += 	'</div>'
					html += 	'<p class="hotSaleTitle">' + goodsName + '</p>'
					html += 	'<p class="hotSalePrice">'
					html += 		'<span>￥</span>'+ distributionPrice
					html += 	'</p>'
					html += '</li>'
				}
				$(html).appendTo('.hui-refresh-content #list');
				pageIndex++;
				hui.endLoadMore(false);
	            isLoading = false;
			} else {
				hui.endLoadMore(true, '已经到头了...');
                return false;
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}

//下拉刷新
function refresh(){ 
    var html ='';
    $.ajax({
		type : 'get',
		dataType : 'json',
		url : 'http://192.168.1.96:8080/localQuickPurchase/selectionGoods/SelectionGoodsCom',
		data : {
			CNname: "",
		    ZSname: "",
			YXname: name,
			MRname: "",
			pageIndex : 1,
			pageSize : 10
		},
		async : false,
		success : function(rsm) {
			var s = rsm.data.Yx;
			if (s != undefined || s != null) {
				for(var i = 0; i < s.length; i++){
					var goodsName = s[i].goodsName;//商品名字
					var goodsImg = s[i].thumbnail;//商品图片
					var goodsId = s[i].goodsId;//商品ID
					var buyingPrice = s[i].goodsProStandard[0].buyingPrice;//商品价格
					var goodsProStandard = s[i].goodsProStandard;
					var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
					var platformPrice = getPlatformPrice(goodsProStandard);//平台价
						html += '<li>'
						html += 	'<div class="hotSaleImg">'
						html += 		'<img id="'+goodsId+'"src=' + goodsImg + ' class="good-pic">'
						html += 	'</div>'
						html += 	'<p class="hotSaleTitle">' + goodsName + '</p>'
						html += 	'<p class="hotSalePrice">'
						html += 		'<span>￥</span>'+ distributionPrice
						html += 	'</p>'
						html += '</li>'
				}
				pageIndex = 2;
				setTimeout(function(){
					$('.hui-refresh-content #list').html(html);
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
				html += "<h3>没有商品了，去逛逛其他的吧</h3>";
				$('.hui-refresh-content #list').html(html);
				 hui.endRefresh();
		         hui.loading('加载中...', true);
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}



/*商品详情*/
$(document).on('click', '.good-pic', function() {
	var goodsId = $(this).attr('id');
	addGoodsHistoryBySeq(seq,goodsId);//新增浏览记录
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});