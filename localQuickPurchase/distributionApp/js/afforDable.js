/**
 * 新版栏目
 */

affor();
function affor(){
var html = "";
var Mr_html = "";
var Zs_html = "";
var Yx_html = "";
	$.ajax({
		type : 'Post',
		dataType : 'JSON',
		url : '/localQuickPurchase/homePageIntegrationAction/homeComIndex',
		data : {
			
		},
		success : function(result){
				var Ky = result.data.homesComData;
				var DeKy = result.data.homeDestData;
				var brandSquareData = result.data.brandSquareData;
				var Zs = DeKy.ZS;
				var Ys = Ky.Mr;
				var Cn = Ky.list;
				var Yx = DeKy.YX;
				//严选好货
				if(Yx != undefined){
					for(var i = 0; i < Yx.length; i++){
						var YxgoodsName = Yx[i].storesName;//栏目名字
						var YxgoodsImg = Yx[i].storesUrl;//栏目图片
						var YxgoodsId = Yx[i].id;//栏目ID
						var YxSort = Yx[i].sort;//排序
						var Yxheight = $("#als1").width()/3;
						var contentUrl = Yx[i].contentUrl;
						contentUrl = contentUrl + seq;
						if(i == 0){
							Yx_html += 	'<a href='+contentUrl+'><img width="100%" height="147px" class="_Yx" id="' + YxgoodsId + '"  src='+ YxgoodsImg +' /></a>'
						}else if(i == 1){
							Yx_html += 	'<a href='+contentUrl+'><img class="margin-t-3 pull-left _Yx" style="width: 49%;" id="' + YxgoodsId + '"  src=' + YxgoodsImg + ' /></a>'
						}else{
							Yx_html += 	'<a href='+contentUrl+'><img class="margin-t-3 margin-l-2 pull-right _Yx" style="width: 49%;" id="' + YxgoodsId + '"  src=' + YxgoodsImg + ' /></a>'
						}
					}
					
					$("#als1").append(Yx_html);
				}else{
					$("._Yx_more").empty();
				}

				//臻实惠
				if(Zs != undefined){
					for(var j = 0; j < Zs.length; j++){
						var ZsgoodsName = Zs[j].storesName;//商品名字
						var ZsgoodsImg = Zs[j].storesUrl;//商品图片
						var ZsgoodsId = Zs[j].id;//商品ID
						var contentUrl = Zs[j].contentUrl;
						contentUrl = contentUrl + seq;
						var Zsheight = $("#ace").width()/3;
						if(j == 0){
							Zs_html += '<div class="pull-left" style="width: 55%;">'
							Zs_html += 	'<a href='+contentUrl+'><img  id="' + ZsgoodsId + '"  src='+ ZsgoodsImg +' /></a>'
							Zs_html += '</div>'
						}else if(j == 1){
							Zs_html += '<div class="pull-right margin-l-2" style="width: 43%;">'
							Zs_html += 	'<a href='+contentUrl+'><img id="' + ZsgoodsId + '"  src=' + ZsgoodsImg + ' /></a>'
						}else{
							Zs_html += 	'<a href='+contentUrl+'><img class="margin-t-3" id="' + ZsgoodsId + '"  src=' + ZsgoodsImg + ' /></a>'
							Zs_html += '</div>'
						}
					}
					$("#ace").append(Zs_html);
				}else{
					$("._Zs_more").empty();
				}

				$("._Tags").click(function(){
					window.location.href= "/localQuickPurchase/distributionVA/bookingGoods";
				})
				
				//品牌广场
				if(brandSquareData != "" && brandSquareData != undefined){
                    var columnName = brandSquareData.columnName;
                    var isActivate = brandSquareData.isActivate;
                    var brandElements = brandSquareData.brandElements;
                    var brandSquarePageStr = "";
                    //处于激活状态
					if (isActivate == 1){
                        brandSquarePageStr += 	"<div class='item_list_title hui-list font-lg'>"+
												"<span class='pull-left font-weight'>"+
                            						columnName+
												"</span><a href='#' class='pull-right hui-arrow brandSquareMore'>更多</a></div>"+
												"<div class='index_line' style='height: 1px;"+
												"width: 100%;"+
												"background: #f0f0f0;"+
												"margin-bottom: 10px;'>"+
												"</div>";
						if(brandElements != null && brandElements.length > 0){
                            var advertisementBanner = brandElements[0].advertisementBanner;
                            var bottomGoodsList = brandElements[0].bottomGoodsList;
							//http://192.168.1.36:8019
                            brandSquarePageStr += "<div class='hui-list item_list_content'>"+
													"<div class='item_list_bimg'><a href='"+
													advertisementBanner.jumpTarget+
													"'><img src='"+
														"http://192.168.1.36:8019" + advertisementBanner.imageLocation+
													"'></a></div>"+
													"<div class='item_list_limg'>";
                            for(var i = 0;i < bottomGoodsList.length; i++){
                                brandSquarePageStr += "<a href='#' class='item_list_s'>"+
                                    "<img src='"+
                                    	bottomGoodsList[i].listGoodsImg[0].goodsImgPath+
									"' class='item_list_img'>"+
                                    "<div class='item_list_k font-lg'>"+
                                    "<span class='item_list_m'>￥"+
                                    	bottomGoodsList[i].goodsProStandard[0].distributionPrice+
									"</span>"+
                                    "<span class='item_list_j'>已售:"+
										bottomGoodsList[i].sellSelfConfessed+
									"</span>"+
                                    "</div>"+
                                    "</a>";
							}
						}
					}

					$(".item_list").append(brandSquarePageStr);

				}

				//猜你喜欢
				if(Cn != null && Cn.length > 0){
					var _Cn_html = '';
					_Cn_html += '<div class="set-goods" style="padding-top:0 ;">'
					var sort = 0;
					for(var n = 0; n < Cn.length; n++){
						var CngoodsName = Cn[n].goodsName;//商品名字
						var CngoodsImg = Cn[n].thumbnail;//商品图片
						var CngoodsId = Cn[n].goodsId;//商品ID
						var goodsCode = Cn[n].goodsCode;//商品code
						var signColum = Cn[n].signColum;//栏目标识
						var goodsProStandard = Cn[n].goodsProStandard;

						var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
						if ( sort == 0) {
							sort = 1;
							_Cn_html += 		'<div class="set_left" style="margin-bottom:10px;">'
							_Cn_html += 		'<span class="CngoodsId" style="display:none;">'+ CngoodsId +'</span>'
							_Cn_html += 			'<div ><img id="' + CngoodsId + '" class="pull-right-zhenshih" src="'+ CngoodsImg +'"/></div>'
							_Cn_html += 			'<p class="margin-t-3 set-goods-title gNameCheck">'+ CngoodsName +'</p>'
							_Cn_html += 			'<p class="set-goods-price">¥ '+ distributionPrice +'</p>'
							_Cn_html += 		'</div>'
						} else {
							sort = 0;
							_Cn_html += 		'<div class="set_right" style="margin-bottom:10px;">'
							_Cn_html += 		'<span class="CngoodsId" style="display:none;">'+ CngoodsId +'</span>'
							_Cn_html += 			'<div ><img id="' + CngoodsId + '" class="pull-right-zhenshih" src="'+ CngoodsImg +'"/></div>'
							_Cn_html += 			'<p class="margin-t-3 set-goods-title gNameCheck">'+ CngoodsName +'</p>'
							_Cn_html += 			'<p class="set-goods-price">¥ '+ distributionPrice +'</p>'
							_Cn_html += 		'</div>'
						}
					}
					_Cn_html +=	'</div>'
					$("._Cn").append(_Cn_html);
					var imgHeight = $(".goodsImg").width();
					$(".goodsImg").css('height',imgHeight);
					/*商品详情*/
					$(document).on('click', '.Cn_Goods', function() {
						var goodsId = $(this).find('.CngoodsId').text();
						if(seq == null || seq == 0) {
							seq = 0;
						}
						window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
					});
				}else{
					$("._Cn_see").empty();
				}
		},
	});
}


//严选查看更多
$(".Details").click(function(){
	name = "严选好货";
	window.location.href="/localQuickPurchase/distributionVA/selectionGoods?name="+name;
})


//臻实惠查看更多
$(".ZSDetails").click(function(){
	name = "臻实惠";
	window.location.href="/localQuickPurchase/distributionVA/selectionGoods?name="+name;
})


//预售查看更多
$("._Ys_Detil").click(function(){
	window.location.href= "/localQuickPurchase/distributionVA/bookingGoods";
})


/*商品详情*/
$(document).on('click', '.pull-right-zhenshih', function() {
	var goodsId = $(this).attr('id');
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
});

