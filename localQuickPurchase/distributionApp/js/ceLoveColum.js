///**
// * 严选好货 -- celove
// * @returns
// */
//celove();
//function celove(){
//var pageIndex = "1";
//var pageSize = "3";
//var html = "";
//var html2 = "";
//var html3 = "";
//var ZSname = getQueryString("name");
//var Yxname = "活动商品";
//	$.ajax({
//		type : 'Get',
//		dataType : 'JSON',
//		url : '/localQuickPurchase/selectionGoods/SelectionGoodsCom',
//		data : {
//			CNname: "活动商品",
//		    ZSname: "活动商品",
//			YXname: "活动商品",
//			MRname: "",
//			pageIndex : pageIndex,
//			pageSize : 3
//		},
//		success : function(result){
//			var s = result.data;
//			var Yx = s.Yx;
//			if(Yx.length > 0){
//				for(var i = 0; i < Yx.length; i++){
//					var YxgoodsName = Yx[i].goodsName;//商品名字
//					var YxgoodsImg = Yx[i].thumbnail;//商品图片
//					var YxgoodsId = Yx[i].goodsId;//商品ID
//					var Yxheight = $("#als1").width()*0.49;
//					if(i == 0){
//						html += '<img class="margin-t-3" src=' + YxgoodsImg + ' id="' + YxgoodsId + '" />'
//					}else if(i == 1){
//						html += '<img class="margin-t-3 pull-left" width="'+ Yxheight +'" height="'+ Yxheight +'" id="' + YxgoodsId + '"  src=' + YxgoodsImg + ' />'
//					}else{
//						html += '<img class="margin-t-3 margin-l-2 pull-right" width="'+ Yxheight +'" height="'+ Yxheight +'" id="' + YxgoodsId + '"  style="width: 49%;" src=' + YxgoodsImg + ' />'
//					}
//				}
//				$("#als1").append(html);
//			}else{
//				$(".marginYx-t-5").empty();
//			}
//			
//			var Zs = s.Zs;
//			if(Zs.length > 0){
//				for(var j = 0; j < Zs.length; j++){
//					var ZsgoodsName = Zs[j].goodsName;//商品名字
//					var ZsgoodsImg = Zs[j].thumbnail;//商品图片
//					var ZsgoodsId = Zs[j].goodsId;//商品ID
//					var Zsheight = $("#ace").width()/3;
//					if(j == 0){
//						html2 += '<div class="pull-left" style="width: 66%;">'
//						html2 += 	'<img class="pull-right-zhenshih 1" id="' + ZsgoodsId + '"  src='+ ZsgoodsImg +' />'
//						html2 += '</div>'
//					}else if(j == 1){
//						html2 += '<div class="pull-right" style="width: 33%;">'
//						html2 += 	'<img class="pull-right-zhenshih 2" id="' + ZsgoodsId + '"  src=' + ZsgoodsImg + ' height="'+ Zsheight +'"/>'
//					}else{
//						html2 += 	'<img class="pull-right-zhenshih 3 " id="' + ZsgoodsId + '"  src=' + ZsgoodsImg + ' height="'+ Zsheight +'"/>'
//						html2 += '</div>'
//					}
//				}
//				$("#ace").append(html2);
//			}else{
//				$(".marginZs-t-5").empty();
//			}
//			
//			var Cn = s.Cn;
//			if(cn.length > 0){
//				for(var l = 0; l < Cn.length; l++){
//					var CngoodsName = Cn[l].goodsName;//商品名字
//					var CngoodsImg = Cn[l].thumbnail;//商品图片
//					var CngoodsId = Cn[l].goodsId;//商品ID
//					var goodsProStandard = Cn[l].goodsProStandard;
//					if(goodsProStandard != null){
//						var buyingPrice = Cn[l].goodsProStandard[0].buyingPrice;//商品价格
//					}
//					var goodsProStandard = Cn[l].goodsProStandard;
//					var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
//					
//					html3 += '<div class="set-goods" style="padding-top:0 ;">'
//					html3 += 	'<div class="set_left" id="' + CngoodsId + '">'
//					html3 += 	'<img src=' + CngoodsImg + ' />'
//					html3 += 		'<p class="margin-t-3 set-goods-title">'+ CngoodsName +'</p>'
//					html3 += 		'<p class="margin-t-3 set-goods-price">¥ '+ distributionPrice + '</p>'
//					html3 += 		'<span class="margin-t-3">严选</p>'
//					html3 += 	'</div>'
//					html3 += '</div>'
//				}
//			}else{
//				
//			}
//			
//						
//		
//			
//			
//			
//			
//		},
//	});
//}
//
//$(".Details").click(function(){
//	var AppGroup = $(this).parents(".index_list_title").find('.font-lg').text();
//	name = "活动商品";
//	window.location.href="/localQuickPurchase/distributionVA/selectionGoods?name="+name;
//})
//
//
///*商品详情*/
//$(document).on('click', '.pull-right-zhenshih', function() {
//	var ZsgoodsId = $(this).attr('id');
//	addGoodsHistoryBySeq(seq,ZsgoodsId);//新增浏览记录
//	if(seq == null || seq == 0) {
//		seq = 0;
//	}
//	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+ZsgoodsId+"/0/"+seq;
//});
//
///*商品详情*/
//$(document).on('click', '.margin-t-3', function() {
//	var goodsId = $(this).attr('id');
//	addGoodsHistoryBySeq(seq,goodsId);//新增浏览记录
//	if(seq == null || seq == 0) {
//		seq = 0;
//	}
//	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
//});
