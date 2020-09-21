	alert("111");
var pageIndex = 1;
var pageSize = 10;
var isActivityGoods = "2"; //  1 秒杀  2  预购
var param ={"state":1,"pageIndex":pageIndex,"pageSize":pageSize,"isActivityGoods":isActivityGoods};	
	
function getDate(){
		var json = null;
		$.ajax({
			type: 'GET',
			url: '/localQuickPurchase/sgMongoAction/seckillListForActivityGoods',
			data : param,
			dataType: 'json',
			async : false,
			success: function(data){
				if (data.code == 200) {
					json = data;
				} 
			}
		});
		
		return json;
}
	
	function init(activityType){
		var json = getDate();
		if(json != null){
			var list = json.data.seckillGoods.list;
			var html = initHtml(list);
			var notning = "<span >没有更多数据！</span>";
			if(activityType == 1){
				$("#miaoSha").append(html);
				if(html == ''){
					$("#miaoSha").append(notning);
				}
			}else if(activityType == 2){
				$("#yuShou").append(html);
				if(html == ''){
					$("#yuShou").append(notning);
				}
			}
		}
	}
	
	init(2);
	init(1);
	function initHtml(list){
		var _html = '';
		if(list == null || list.length < 1){
			return  "";
		}
		for(var i = 0 ; i < list.length ; i++){
			var sGood = list[i];
			var goodsName = sGood.goodsName;
			var listGoodsImg = sGood.listGoodsImg
			var goodsProStandard = sGood.goodsProStandard;
			var goodsImgPath = "";
			var goodsId = sGood.goodsId;
			if(listGoodsImg != null && listGoodsImg.length > 0 ){
				goodsImgPath = listGoodsImg[0].goodsImgPath;
			}
			_html += '<div class="act_box_item">';
			_html += '<div class="act_tag2"></div>';
			_html += '<div class="a_b_i_img" goodsId='+goodsId+' num='+1+'><img src="'+goodsImgPath+'"/></div>';
			_html += '<div class="a_b_i_con">';
			_html += '<div class="a_b_i_name">'+goodsName+'</div>';
			//_html += '<div class="a_b_i_tip">'+goodsName+'</div>';
			_html += '<div class="a_b_i_num_box">';
			//_html += '<div class="a_b_i_num_txt color2">日供量<span class="dayNum">100</span>份</div>';
			//_html += '<div class="a_b_i_num_txt color2">剩余量<span class="leftNum">20</span>份</div>';
			_html += '</div>';
			if(goodsProStandard != null && goodsProStandard.length > 0){
				for(var j = 0 ; j < goodsProStandard.length ; j++){
					var proStandardp = goodsProStandard[j];
					var distributionPrice = proStandardp.distributionPrice;//分销价
					var seckillPrice = proStandardp.seckillPrice;//活动价
					var distributionProfit = proStandardp.distributionProfit;//分销商赚多少 
					var profitPrice = proStandardp.profitPrice;//代理商赚多少 
					_html += '<div class="a_b_i_price_box">';
					_html += '<div class="a_b_i_price_txt"><span class="tag">活动价</span><i class="fh">￥</i><span class="actPrice color2">'+seckillPrice+'</span></div>';
					_html += '<div class="a_b_i_price_txt">';
					_html += '<div class="reprice"><del>￥'+distributionPrice+'<del></div>';
					if(seq != 0 && seq != ''){
						if(isRoleAgent()){
							_html += '<div class="earnMoney">赚：￥'+distributionPrice+'</div>';
						}else if(isRoleDealer()){
							_html += '<div class="earnMoney">赚：￥'+profitPrice+'</div>';
						}
					}
					_html += '</div>';
					_html += '</div>';
					break;
				}
			}
			
			_html += '<div class="a_b_i_btn flashSale"><img src="/localQuickPurchase/distributionApp/images/but2.png"/></div>';
			_html += '</div>';
			_html += '</div>';
		}
		return _html;
	}

//商品图片点击  进入商品详情
$("body").on('click', '.a_b_i_img', function() {
	var goodsId = $(this).attr('goodsId');
	var num = $(this).attr('num');
	// addGoodsHistoryBySeq(seq,goodsId);//暂时注释
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq+"&num="+num;///"+goodsId+"/"+seq+"/"+seq
});