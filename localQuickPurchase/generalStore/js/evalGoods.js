var orderId = getQueryString("orderId");
var bEvaluation=false;
$(function(){
	$('#attitude,#quality').raty();
	$('#evaluate-remark').bind('input propertychange',function(){
       var txtval = $('#evaluate-remark').val().length;
        if(txtval < 300 ){
          $('#num_txt').html(txtval);
      }else{
          $('#num_txt').html(300);
          $('#evaluate-remark').val($('#evaluate-remark').val().substring(0,300));
        }
    });
    initPage();
});
$(".orderBarList .orderBar-item").click(function(){
	if(!$(this).hasClass('cur')){
		var i = $(this).index();
		$(this).addClass('cur').siblings().removeClass('cur');
		$(".orderBox-item").eq(i).show().siblings().hide();
	}
})
$(".AEvaluation").click(function(){
	if(!$(this).hasClass('checked')){
		$(this).addClass('checked');
	}else{
		$(this).removeClass('checked');
	}
});
$("#evaluateBtn").click(function(){
	evalSubmit();
})
function initPage(){
	$.ajax({
			url: _content+'/orders/findByOrderId',
			type: 'get',
			dataType:'JSON',
			data:{orderId:orderId},
			})
			.done(function(res) {
				if(res.code == 200){
					var data = res.data.order;
					bEvaluation=data.bEvaluation
					var _html = '<input type="hidden" name="seq" value="'+ (data.seqSeller==null?data.seq:data.seqSeller) +'"/><input type="hidden" name="orderno" value="'+ data.orderno +'"/>';
					var listItem=data.listOrderDetails;
					for(var i=0;i<listItem.length;i++){
						_html+='<input type="hidden" class="goodsId" name="goodsId" value="'+ listItem[i].goodsId +'"/>';
					}
					_html+='<a href="shoppingpage.jsp?seq='+ data.seq +'" class="shop-name"><span>'+ data.shopName +'</span><i class="rightIco"></i></a>';
					var purchaseDate = formatDateTime(data.purchaseDate);
					$.each(data.listOrderDetails,function(index,el){
						if(el.goodsId!=null){
							var spec = (!el.spec) ? '' : el.spec+',';
							_html += '<div class="good-msg"><a href="#" class="good-img"><img src="'+ el.goodsImgUrl +'"></a><div class="good-detail"><p class="good-name">'+ el.goodsName +'</p><p class="good-prop">'+ spec +'单价&yen;'+ el.price +'</p><p class="good-total">总价:<i>&yen;</i><em>'+ el.amount +'</em></p><div class="buyTime"><span>'+ purchaseDate +'</span></div><div class="buyNum">数量:<span>'+ el.count+'</span></div></div></div>';
						}
					})
					$(".goodsCon").html(_html);
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
}
function evalSubmit(){
	if(bEvaluation){
		$.alert("请不要重复填写评价",function(){
			var url=document.referrer;
			if(url.indexOf("generalStore")!=-1||url.indexOf("evalGoods")!=-1){
				location.href=url;
			}else{
				location.href="index.jsp";
			}
		});
		return;
	}
	var aScore = $('#attitude input[name=score]').val();
	var qScore = $('#quality input[name=score]').val();
	var seq = $("input[name=seq]").val();
	var evalContent = $("#evaluate-remark").val();
	var orderno = $("input[name=orderno]").val();
	var anonymity = $(".AEvaluation").hasClass('checked');
	var updateTime = getNowFormatDate();
	if(!aScore || !qScore){
		$(".resultTip").text("请先评价商品").show(300).delay(2000).hide(300);
		return;
	}
	var dataList=[];
	var idList = $(".goodsId");
	for(var x=0;x<idList.length;x++){
		var inGoodsId=idList.eq(x).val();
		var data = {};
		data.seq = seq;
		data.evaluationContent = evalContent;
		data.goodsId = inGoodsId;
		data.service = aScore;
		data.quality = qScore;
		data.anonymity = anonymity;
		data.updateTime = updateTime;
		data.orderno = orderno;
		data.userName = userName;
		dataList[x]=data;
	}
	var param = JSON.stringify(dataList);
	$.ajax({
		url: _content+'/evaMongo/addOrderEVA',
		type: 'POST',
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: param,
	})
	.done(function(res) {
		if(res.code==200){
			$(".resultTip").text("评价成功").show(300).delay(2000).hide(300);
			window.location.href = 'order.jsp';
		}
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
}