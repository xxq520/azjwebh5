var bankCardNO = "";
$(function(){
	
	findBankCard();
});
/*获取支付系统银行卡信息*/
function findBank(){
	$.ajax({
		url : "/localQuickPurchase/shopper/GetCustomerCertificationInfo",
		type : "POST",
		data : {
			seq : seq
		},
		async : false,
		dataType : "json",
		success : function(data) {
			var bankCard = data.data;
			if (bankCard.length > 0) {
				var list = '';
				for (var i = 0; i < bankCard.length; i++) {
					bankCardNO = bankCard[i].BankCardNO;
					var bankCardNumber = "****"+bankCardNO.slice(-4);
					$(".drawalType-name").html(bankCardNumber);
				}
			} else{
				
			}

		},
		error : function(error) {
			
		}
	});
}
// 获取mongodb
function findBankCard(){
	$.ajax({
		url : "/localQuickPurchase/shopper/findBankCard",
		type : "POST",
		data : {
			seq : seq
		},
		async : false,
		dataType : "json",
		success : function(data) {
			var bankCard = data.data;
			if (bankCard.length > 0) {
				var list = '';
				for (var i = 0; i < bankCard.length; i++) {
					var typeName = bankCard[i].typeName;
					bankCardNO = bankCard[i].bankCardNumber;
					var bankCardNumber = "****"+bankCardNO.slice(-4);
					$(".drawalType-name").html(typeName+bankCardNumber);
				}
			} else{
				$("#bankCardList").html("");
			}

		},
		error : function(error) {
			
		}
	});
}

function delBank(){
	if(bankCardNO == ""){
		return false;
	}
	hui.confirm('确定解除绑定吗？', ['取消','解除'], function(){
		loadingdate("加载中...");
		$.ajax({
			url : "/localQuickPurchase/shopper/deteleCustomerCertification",
			type : "POST",
			data : {
				seq : seq,
				bankCardNO : bankCardNO
			},
			async : true,
			dataType : "json",
			success : function(data) {
				clearLoading();
				var code = data.code;
				if (code == 200) {
					hui.toast("删除成功");
					window.location.reload(true);
				} else{
					hui.toast("删除失败");
				}

			},
			error : function(error) {
				clearLoading();
			}
		})
    });
}