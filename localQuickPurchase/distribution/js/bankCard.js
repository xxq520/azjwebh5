//将数组格式化为符合picker要求的方法
function dataFormat(arr) {
	return arr.map(function(item) {
		return {
			value : item.id,
			text : item.name,
		};
	})
}
// 初始化picker插件
var picker = new mui.PopPicker();
// picker.setData([{value:"001",text:"工商银行"},{value:"002",text:"农业银行"}]);

document.getElementById("user").addEventListener("tap", function() {
	picker.show(function(res) {
		res = res[0]; // 返回选择后的结果,如:{value:"001",text:"工商银行"}
		document.getElementById("typeId").value = res.value;
		document.getElementById("user").value = res.text;
	})
}, false)

/* 初始化 */
$(function() {
	findBank();
	bankCardType();
	
	/* 添加和修改点击事件 */
	$("#addbut").click(function() {
		addBank();
	});
	$(".banckCardBox").click(function() {
		var butValue = $(this).attr("value");
		if(butValue == "0"){
			$(this).attr("value","1");
		} else if(butValue == "1"){
			$(this).attr("value","0");
		}
	});
	$("#delbut").click(function(){
		var butValue = $(".banckCardBox").attr("value");
		if(butValue == "1"){
			delBank();
		} else{
			mui.toast("请勾选要删除的银行卡");
		}
	});
	
	/* 点击单个银行卡获取银行卡详情 */
//	$(".updateBankCardBt").click(function() {
//		$("#addbut").html("修改");
//		// 显示添加页面
//		$("#addpanel").show();
//		// 显示删除按钮
//		$("#delbut").show();
//		var id = $(this).attr("value");
//		findById(id);
//	});

});

/* 获取银行卡类型方法，回调 */
var bankTypeArray = [];
function bankCardType() {
	$.ajax({
		url : "/localQuickPurchase/shopper/findBankType",
		type : "get",
		data : {

		},
		async : false,
		dataType : "json",
		success : function(data) {
			var bank = data.data;
			for (var i = 0; i < bank.length; i++) {
				var id = bank[i].id;
				var name = bank[i].name;
				var oneBank = {};
				oneBank.value = id;
				oneBank.text = name;
				bankTypeArray.push(oneBank);
			}
			picker.setData(bankTypeArray);

		},
		error : function(error) {
			mui.toast("网络错误");
		}
	})
}
/*获取银行卡信息*/
function findBank(){
	$.ajax({
		url : "/localQuickPurchase/shopper/GetCustomerCertificationInfo",
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
							+ '<input type="checkbox" name="banckCardBox" class="banckCardBox" />'
							+ '<span class="cardUser" data-val="'
							+ bankCard[i].AccountName
							+ '"></span>'
							+ '<p class="cardNo" data-val="'
							+ bankCard[i].BankCardNO
							+ '"></p>'
//							+ '<i class="mui-icon mui-icon-arrowright updateBankCardBt" value="'
//							+bankCard[i].Id
//							+'" ></i>'
							+ '</div>';
				}
				$("#bankCardList").html(list);
				$(".headExit").show();
			} else{
				$(".addcard").show();
			}

		},
		error : function(error) {
			mui.toast("网络错误");
		}
	});
}
/* 添加银行卡 */
function addBank() {
	var typeName = $("#user").val();
	var typeId = $("#typeId").val();
	var cardName = $("#cardName").val();
	var idCard = $("#idCard").val();
	var bankCardNumber = $("#cardNumber").val();
//	var bankOfDeposit = $("#cardAddress").val();
	bankCardNumber = bankCardNumber.replace(/ /g,""); // 去除空格
	if(""==bankCardNumber||""==idCard||""==cardName||""==typeName){
		return mui.toast("请输入完整的信息");
	}
	$.ajax({
		url : "/localQuickPurchase/shopper/addBankCard",
		type : "POST",
		data : {
			bankCardNumber : bankCardNumber,
			idCard : idCard,
			cardName : cardName,
			typeName : typeName,
			typeId : typeId,
			seq : userSeq
		},
		async : false,
		dataType : "json",
		success : function(data) {
			var code = data.code;
			if (code == 200) {
				window.location.reload();
			} else if(code == 300){
				mui.toast("该银行卡已添加过一次!");
				$("#cardNumber").val("");
			} else if(code == 501){
				mui.toast("实名认证失败!");
			} else{
				mui.toast("添加失败!");
			}

		},
		error : function(error) {
			mui.toast("网络错误");
		}
	})
}

/* 修改银行卡 */
function updateBank() {
	var typeName = $("#user").val();
	var typeId = $("#typeId").val();
	var cardName = $("#cardName").val();
	var idCard = $("#idCard").val();
	var bankCardNumber = $("#cardNumber").val();
	bankCardNumber = bankCardNumber.replace(/ /g,""); // 去除空格
	if(""==bankCardNumber||""==idCard||""==cardName||""==typeName){
		return mui.toast("请确认信息的完整");
	}
	var id = $("#addbut").attr("value");
	mui.confirm('确定修改吗？', '亲！', function(e) {
		if(e.index == 1){
			$.ajax({
				url : "/localQuickPurchase/shopper/updateBankCard",
				type : "POST",
				data : {
					bankCardNumber : bankCardNumber,
					idCard : idCard,
					cardName : cardName,
					typeName : typeName,
					typeCode : typeCode,
					typeId : typeId,
					seq : userSeq,
					id : id
				},
				async : false,
				dataType : "json",
				success : function(data) {
					var code = data.code;
					if (code == 200) {
						window.location.reload();
					} else if(code == 505){
						mui.toast("银行卡号校验失败，请查看输入的银行卡号是否正确");
						$("#cardNumber").val("");
					} else if(code == 506){
						mui.toast("银行卡号和所选类型不匹配");
						$("#cardNumber").val("");
					} else if(code == 300){
						mui.toast("该银行卡已添加过一次");
						$("#cardNumber").val("");
					} else{
						mui.toast("修改失败");
					}

				},
				error : function(error) {
					mui.toast("网络错误");
				}
			})
		}
		
	})
}

function delBank(){
	var bankCardNO = $(".cardNo").attr("data-val");
	// 删除
	mui.confirm('确定删除吗？', '亲！', function(e) {
		if(e.index == 1){
			$.ajax({
				url : "/localQuickPurchase/shopper/deteleCustomerCertification",
				type : "POST",
				data : {
					seq : userSeq,
					bankCardNO : bankCardNO
				},
				async : false,
				dataType : "json",
				success : function(data) {
					var code = data.code;
					if (code == 200) {
						window.location.reload();
					} else{
						mui.toast("删除失败");
					}

				},
				error : function(error) {
					mui.toast("网络错误");
				}
			})
		}
	})
}

function findById(id) {
	$.ajax({
		url : "/localQuickPurchase/shopper/GetCustomerCertificationInfo",
		type : "POST",
		data : {
			seq : userSeq
		},
		async : false,
		dataType : "json",
		success : function(data) {
			var bankCard = data.data;
			if (null != bankCard) {
				$("#user").val(bankCard[0].typeName);
				$("#typeId").val(bankCard[0].BankCode);
				$("#cardName").val(bankCard[0].AccountName);
				$("#idCard").val(bankCard[0].IDCard);
				$("#cardNumber").val(bankCard[0].BankCardNO);
				
				$("#addbut").hide();
				
//				$("#addbut").attr("value", bankCard.id);
				
//				$("#user").attr("disabled","disabled");
//				$("#cardName").attr("disabled","disabled");
//				$("#cardAddress").attr("disabled","disabled");
//				$("#cardNumber").attr("disabled","disabled");
			}

		},
		error : function(error) {
			mui.toast("网络错误");
		}
	});
}

// 校验银行卡号
function luhnCheck(bankno) {
	if(bankno.length == 16 || bankno.length == 19){
		
	} else{
		return false;
	}
	var lastNum = bankno.substr(bankno.length - 1, 1);// 取出最后一位（与luhn进行比较）
	
	var first15Num = bankno.substr(0, bankno.length - 1);// 前15或18位
	var newArr = new Array();
	for (var i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
		newArr.push(first15Num.substr(i, 1));
	}
	var arrJiShu = new Array(); // 奇数位*2的积 <9
	var arrJiShu2 = new Array(); // 奇数位*2的积 >9

	var arrOuShu = new Array(); // 偶数位数组
	for (var j = 0; j < newArr.length; j++) {
		if ((j + 1) % 2 == 1) {// 奇数位
			if (parseInt(newArr[j]) * 2 < 9)
				arrJiShu.push(parseInt(newArr[j]) * 2);
			else
				arrJiShu2.push(parseInt(newArr[j]) * 2);
		} else
			// 偶数位
			arrOuShu.push(newArr[j]);
	}

	var jishu_child1 = new Array();// 奇数位*2 >9 的分割之后的数组个位数
	var jishu_child2 = new Array();// 奇数位*2 >9 的分割之后的数组十位数
	for (var h = 0; h < arrJiShu2.length; h++) {
		jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
		jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
	}

	var sumJiShu = 0; // 奇数位*2 < 9 的数组之和
	var sumOuShu = 0; // 偶数位数组之和
	var sumJiShuChild1 = 0; // 奇数位*2 >9 的分割之后的数组个位数之和
	var sumJiShuChild2 = 0; // 奇数位*2 >9 的分割之后的数组十位数之和
	var sumTotal = 0;
	for (var m = 0; m < arrJiShu.length; m++) {
		sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
	}

	for (var n = 0; n < arrOuShu.length; n++) {
		sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
	}

	for (var p = 0; p < jishu_child1.length; p++) {
		sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
		sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
	}
	// 计算总和
	sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu)
			+ parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

	// 计算luhn值
	var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
	var luhn = 10 - k;

	if (lastNum == luhn) {
		return true;
	} else {
		return false;
	}
};
// 银行卡号输入限制
function formatBankNo(BankNo) {
	if (BankNo.value == "")
		return;
	var account = new String(BankNo.value);
	account = account.substring(0, 23); /* 帐号的总数, 包括空格在内 */
	if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
		/* 对照格式 */
		if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|"
				+ ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|"
				+ ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|"
				+ ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
			var accountNumeric = accountChar = "", i;
			for (i = 0; i < account.length; i++) {
				accountChar = account.substr(i, 1);
				if (!isNaN(accountChar) && (accountChar != " "))
					accountNumeric = accountNumeric + accountChar;
			}
			account = "";
			for (i = 0; i < accountNumeric.length; i++) { /* 可将以下空格改为-,效果也不错 */
				if (i == 4)
					account = account + " "; /* 帐号第四位数后加空格 */
				if (i == 8)
					account = account + " "; /* 帐号第八位数后加空格 */
				if (i == 12)
					account = account + " ";/* 帐号第十二位后数后加空格 */
				if (i == 16)
					account = account + " ";/* 帐号第十六位后数后加空格 */
				account = account + accountNumeric.substr(i, 1)
			}
		}
	} else {
		account = " " + account.substring(1, 5) + " "
				+ account.substring(6, 10) + " " + account.substring(14, 18)
				+ "-" + account.substring(18, 25);
	}
	if (account != BankNo.value)
		BankNo.value = account;
}
// 过滤特殊字符
function checkSpecialChar(test){
	 //正则表达式
	 var reg = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+$");
	 //获取输入框中的值
	 var username = test.value.trim();
	 //判断输入框中有内容
	 if(!reg.test(username)){
		 //输入非法字符，清空输入框
		 $(test).val("");
		 mui.toast("请输入中文,字母,数字");
	 }
}