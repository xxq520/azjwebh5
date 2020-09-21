$(function(){
	$.ajax({
		type : 'POST',
		dataType : 'JSON',
		url : '/localQuickPurchase/shopper/findBankCard',
		data : {"seq" : seq},
		success : function(data){
			var bankCard = data.data;
			var _html = "";
			for (var i = 0; i < bankCard.length; i++) {
				isAdd = true;
	            //var cardName = bankCard[i].cardName;//持卡人姓名
	            var bankCardNumber = bankCard[i].bankCardNumber;//银行卡号
	            var bankOfDeposit = bankCard[i].bankOfDeposit;//开户支行
	            var check = 1;
	            if(bankOfDeposit == null || bankOfDeposit ==""){
	            	check = 0;
	            }
	            var typeName = bankCard[i].typeName;//开户行
	            //var typeId = bankCard[i].typeId;//银行id,进行实名认证时需传参数
	            var banknoOfFour = interceptionOfNum(bankCardNumber);
	            _html +='<li check="'+check+'" id="'+bankCard[i].id+'">';
	            _html +='<div class="drawalType-img">';
	            _html +='<img src="/localQuickPurchase/distributionApp/images/drawalImg3.png" />';
	            _html +='</div>';
	            _html +='<div class="drawalType-name">'+typeName+banknoOfFour+'</div>';
	            _html +='<div class="drawalType-rightImg">';
	            _html +=' <img src="/localQuickPurchase/distributionApp/images/checkok.png" />';
	            _html +='</div>';
	            _html +='</li>';
			}
			$("#bankCardList").html(_html);
		},
		error : function(error){
			
		}
	});
});	
/*截取银行卡后四位数字*/
function interceptionOfNum(param){
	var begin = param.substring(param.length-4);
	return begin;
}