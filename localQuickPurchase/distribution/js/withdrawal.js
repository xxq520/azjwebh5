var balance;

$(function() {
		mui.alert('需等在线支付功能上线后，才开放提现功能，敬请期待！', '亲爱的用户', function() {
			window.history.go(-1);
        });
		
		/*获取银行卡类型接口*/
//		var getBalanceUrl = "";
//		if (location.host.indexOf("520") > 0) {
//			getBalanceUrl = "";
//		} else {
//			getBalanceUrl = "http://192.168.1.42:8032/api/Balance/GetBalance";
//		}
		
//		$.ajax({
//			url : getBalanceUrl,
//			type : "get",
//			data : {
//				seq : userSeq
//			},
//			async : false,
//			dataType : "json",
//			success : function(data) {
//				$("#indexBalance").html(data.toFixed(1));
//				$(".mentionval").html("可用零钱<i>"+data.toFixed(1)+"</i>元");
//				$(".mentionbut").attr("data-val",data.toFixed(1));
//				balance = data;
//			},
//			error : function(error) {
//				mui.toast("网络错误");
//			}
//		});
		
		$("#bankCardList").hide();
		findBank();
		findBankCard();
		
		$("#addCardFromWithdrawal").click(function(){
			window.location.href = "bankCard.jsp";
		});
		
		$("#withdrawalbut").click(function(){
			addWithdrawals();
		});
				
		$("#cardId").click(function(){
			$(".rechargeFrom").hide();
			$("#bankCardList").show();
			
			var list = '<span class="get-back mui-icon mui-icon-arrowleft" onclick="chooseHead()"></span>'+
					'<p class="headtitle">提现</p>';
			$(".headnav").html(list);
		});
		
		$(".chooseBankCard").click(function(){
			var list = '<a href="javascript:history.go(-1)" class="get-back mui-icon mui-icon-arrowleft"></a>'+
			'<p class="headtitle">提现</p>';
			$(".headnav").html(list);
			
			var number = $(this).siblings(".cardNo").attr("data-val");
			var name = $(this).siblings(".cardUser").attr("data-val");
			var id = $(this).attr("value");
			
			$("#cardNo").attr("data-val",number);
			$("#cardUser").attr("data-val",name);
			$("#cardId").attr("value",id);
			
			initBankCard();
			
			$(".rechargeFrom").show();
			$("#bankCardList").hide();
			
		});
		
		
});

/*获取银行卡信息*/
function findBank(){
	$.ajax({
		url : "/localQuickPurchase/shopper/findBankCard",
		type : "POST",
		data : {
			seq : userSeq
		},
		async : false,
		dataType : "json",
		success : function(data) {
			var bankCard = data.data;
			var list = '';
			if (bankCard.length > 0) {
				for (var i = 0; i < 1; i++) {
					list += '<div class="carditem invisible" data-state="invisible">'
							+ '<i class="eyes" onclick="bankCardTab(this)"></i>'
							+ '<span class="cardUser" id="cardUser" data-val="'
							+ bankCard[i].cardName
							+ '"></span>'
							+ '<p class="cardNo" id="cardNo" data-val="'
							+ bankCard[i].bankCardNumber
							+ '"></p>'
							+ '<i class="mui-icon mui-icon-arrowright" id="cardId" value="'
							+bankCard[i].id
							+'" ></i>'
							+ '</div>';
				}

			} else{
				list = '<div class="addcard" id="addCardFromWithdrawal"><i class="mui-icon mui-icon-plus"></i>去添加银行卡</div>';
			}
			
			$("#bankCard").html(list);

		},
		error : function(error) {
			mui.toast("网络错误");
		}
	});
}

function addWithdrawals(){
	if("" == userSeq || null == userSeq){
		mui.toast("还未登录，请登录");
	}
	var bankCardId = $("#cardId").attr("value");
	if("" == bankCardId || undefined == bankCardId){
		mui.toast("请选择需提现的银行卡");
		return ;
	}
	var money = $("#money").val();
	if(money <= 0 || money > balance || "" == money){
		mui.toast("提现金额小于等于0或者超出零钱范围,不能提现");
		return null;
	}
	var msg = "您确认要提现吗？";
	if(confirm(msg) == true){
		$.ajax({
			url : '/localQuickPurchase/withdrawalsAction/addWithdrawals',
			type : 'POST',
			data : {
				seq : userSeq,
				money : money,
				bankCardId :bankCardId
			},
			async : false,
			dataType : 'json',
			success : function(data) {
				if(data.code == 200){
					mui.toast("提现成功");
					location.href="withdrawal.jsp";
				} else{
					mui.toast("提现失败");
				}
			},
			error : function(error) {
				mui.toast("网络错误！！");
			}
		});
		
	}	
};

/*获取银行卡信息*/
function findBankCard(){
	$.ajax({
		url : "/localQuickPurchase/shopper/findBankCard",
		type : "POST",
		data : {
			seq : userSeq
		},
		async : false,
		dataType : "json",
		success : function(data) {
			var bankCard = data.data;
			if (bankCard.length > 0) {
				var list = '';
				for (var i = 0; i < bankCard.length; i++) {
					list += '<div class="carditem invisible" data-state="invisible">'
							+ '<i class="eyes" onclick="bankCardTab(this)"></i>'
							+ '<span class="cardUser" data-val="'
							+ bankCard[i].cardName
							+ '"></span>'
							+ '<p class="cardNo" data-val="'
							+ bankCard[i].bankCardNumber
							+ '"></p>'
							+ '<i class="mui-icon mui-icon-arrowright chooseBankCard" value="'
							+bankCard[i].id
							+'" ></i>'
							+ '</div>';
				}
				$("#bankCardList").append(list);

			}

		},
		error : function(error) {
			mui.toast("网络错误");
		}
	});
}

function initBankCard(){
	if($("#bankCardList").length>0){
		var reg = /^(\d{4})\d+(\d{4})$/;
		$(".carditem").each(function(){
			$(this).removeClass("visible").addClass("invisible");
			$(this).attr("data-state","invisible");
			var cardNo = $(this).find(".cardNo").attr("data-val");
			var cardUser =$(this).find(".cardUser").attr("data-val");
			$(this).find(".cardNo").html(cardNo.replace(reg,"$1 **** $2"));
			$(this).find(".cardUser").html(cardUser[0]+"**");
		})
	}
}

function chooseHead(){
	var list = '<a href="javascript:history.go(-1)" class="get-back mui-icon mui-icon-arrowleft"></a>'+
	'<p class="headtitle">提现</p>';
	$(".headnav").html(list);
	$(".rechargeFrom").show();
	$("#bankCardList").hide();
};
