/**
 * 严选好货--更多商品
 */
var pageIndex = 1;
var isLoading = false;
var first = true;
var pageSize = 10;
var Coums=shopgd(seq);
var singState = getQueryString("name");
if(singState != null) {
    try{
        //进行URL解码
        var singStateD = decodeURI(singState);
        singState = singStateD;
    }catch (e){
        console.log(e);
    }
    $("._title").text(singState);
    $("._title_H1").text(singState);
    if (singState == "每日上新"){
        $("#classify").show();
        $(".search_box").show();
     }else{
    	$("#list").css("margin-top","1.8rem")
	}
	columnName  = singState;
}

function getMore(){
	if(!isLoading){
		if($(".nothing").length == 0){
			var _html  = '<li style="width: 100%;"><p class="drp_bottom font-sm person1 nothing" style="text-align: center;margin-top: 1rem;" id="morn2" >没有更多了</p></li>';
			$("#list").append(_html);
		}else{
			$(".nothing").show();
		}
		//$("#morn").css("display","block");
		return;
	}
	//isLoading = true;
	var html = '';
	$.ajax({
		type : 'post',
		dataType : 'JSON',
		contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
		data : JSON.stringify({
			columnName: columnName,
			pageIndex : pageIndex,
			pageSize : pageSize
		}),
		async : false,
		success : function(data){
			var code = data.code;
			var listData = data.data;
			if(code == 200 && listData != null && listData.length > 0) {
				for(var i = 0; i < listData.length; i++){
					var _data = listData[i];
					html += getHTML(_data);
				}
				$(html).appendTo('#list');
				pageIndex++;
				//hui.endLoadMore(false);
	           // isLoading = false;
			} else {
				//hui.endLoadMore(true, '已经到头了...');
				isLoading = false;
                return false;
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}

//下拉刷新
function refreshGood(){ 
    var html ='';
    $.ajax({
		type : 'post',
		dataType : 'json',
		contentType: "application/json;charset=utf-8",
		url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
		data : JSON.stringify({
			columnName: columnName,
			pageIndex : 1,
			pageSize : pageSize
		}),
		async : false,
		success : function(data) {
			var code = data.code;
			var listData = data.data;
			if(code == 200 && listData != null && listData.length > 0) {
				var s = listData;
				for(var i = 0; i < s.length; i++){
					var _data = s[i];
					html += getHTML(_data);
				}
				pageIndex = 2;
				//setTimeout(function(){
					$('#list').html(html);
		            //结束刷新
		           /// hui.endrefreshGood();
		            //重置加载更多状态
		          ///  hui.resetLoadMore();
		          ///  hui.loading('加载中...', true);
		            //if(!first){
		            	//hui.toast("下拉刷新成功");	            	
		            //}
		            first = false;
				//},500)
				
			} else {
				html += "<h3>没有商品了，去逛逛其他的吧</h3>";
				$('#list').html(html);
				/// hui.endrefreshGood();
		        /// hui.loading('加载中...', true);
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
	var isActivityGoods = $(this).attr('isActivityGoods');
	if(seq == null || seq == '') {
		seq = 0;
	}
    if (isActivityGoods != null && isActivityGoods == "1"){
        window.location.href= "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq="+seq+"&shareSeq=0";
    } else {
        window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
    }
});
//获取优惠券图标
function getYhqHtml(data){
    var goodsYhq = data.yHQ;
    var type=getRoleType();
    var yhqHtml = "";
    if (goodsYhq) {
        if (type==1||type==2||!type) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else if ((type==3 ||type==4)&& Coums<=100) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else {
            yhqHtml+=""
        }
    } else {yhqHtml+=""}
    return yhqHtml;
}
function getHTML(data) {
	
	var html = "";
   // var type=getRoleType();
	var goodName = data.goodsName;//商品名字
	var goodsName='';
	var goodsImg = data.thumbnail;//商品图片
	var goodsId = data.goodsId;//商品ID
	var isActivityGoods = data.isActivityGoods;//秒杀商品标识
	//var buyingPrice = data.goodsProStandard[0].buyingPrice;//商品价格
	var goodsProStandard = data.goodsProStandard;
	var distributionPrice = getDistributionPrice(goodsProStandard);//分销价
	var goodsPrice = goodsProStandard[0].goodsPrice;//商品原价
    var actualPrice = data.actualPrice;//实际价格
    var comparativePrice = data.comparativePrice;//展示价格
    var _labelHtml='&nbsp;';
    if(data.listLabel != null){
        var  listLabel = data.listLabel;
        for (var j = 0; j < listLabel.length; j++) {
            var label = listLabel[j];
            _labelHtml += ' <span style="color:'+label.colour+';border: 1px solid '+ label.colour +';border-radius: 0.59rem;padding: 0 4px;">'+ label.labelValue +'</span>';
        }
    }
    html += '<li id="'+goodsId+'" class="good-pic" isActivityGoods="'+isActivityGoods+'"> <div class="hotSaleImg">';
    html += '<img  src=' + goodsImg + ' >';
    html += getYhqHtml(data);
	if(goodName.length>23){
		goodsName=goodName.substring(0,23)+"...";
		html += '</div> <p class="hotSaleTitle">' + goodsName + '</p>';
	}
	else{
		html += '</div> <p class="hotSaleTitle">' + goodName + '</p>';
	}
    html += ' <p class="hotLabel">' + _labelHtml + '</p>';
    html += '<p class="hotSalePrice">';
    html += '<span>￥</span>'+ actualPrice + '&nbsp;';
    if(goodsPrice != null && goodsPrice > 0){
   		 html += '<span style="text-decoration:line-through;color: #999">￥'+ comparativePrice + '</span>';
    }
    html += '</li>';
    return html;
}

function goClassifyWyf(){
    window.location.href="/localQuickPurchase/distributionVA/classify/classifyWyf?moduleName="+columnName;
}

function  jumpCoupon(){
    var oEvent = event;
    oEvent.cancelBubble = true;
	window.location.href="/localQuickPurchase/activity/baiye.html";
}