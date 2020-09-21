var invoiceType = 1; //发票类型     1 普通发票, 2 增值税专用发票  默认为1
var invoiceTitleFlag = 1; //发票抬头 1 个人, 2 单位 默认为1
var invoiceTitle = "";
var alertInput = '<input type="text" disabled="disabled" class="alertInput" value="" style="color: #ff0000;">';
var invoice = {};
$('.fapiao').on('click', function(){
	/*获取上次发票内容*/
    recordInvoice();
	$('.zzao').addClass('zzao-hover');
});
//取消
$('.popup-title i, .quxiao').on('click', function(){
	invoice = {};
	$('.zzao').removeClass('zzao-hover');
	$(".fapiao span").html("不开发票");
});
//确定
$('.popup-title i, .queding').on('click', function(){
	if ($(this).attr("class") == "quxiao") {
		$(".fapiao span").html("不开发票");
		invoice = {};
	} else {
		getInvoice($(this));
	}
});
//发票类别 tab切换
$('.fp-type .fp-list-btn span').on('click',function(){
	var idFlag = $(this).attr("id");
	if (idFlag == 2) {
		invoiceType = 2; //代表当前发票类型是---->增值税专用发票
	} else {
		invoiceType = 1; //代表当前发票类型是---->普通发票
	}
	tabSwitch('.fp-type', '.form-list', this);
	invoice = {};	//切换就清空
});
//发票抬头 tab切换
$('.fp-looked .fp-list-btn span').on('click',function(){
	var idFlag = $(this).attr("id");
	if (idFlag == 2) {
		invoiceTitleFlag = 2;
	} else {
		invoiceTitleFlag = 1;
	}
	console.log(idFlag);
	tabSwitch('.fp-looked', '.form-looked', this);
	invoice = {};	//切换就清空
});
//发票类别 tab切换
function tabSwitch(elmName1, elmName2, th) {
	var n = $(th).index();
	$(elmName1 +' .fp-list-btn span').removeClass('fp-hover');
	$(th).addClass('fp-hover');
	$(elmName2).hide();
	$(elmName2).eq(n).show();
}

/**获取invoice相关参数
 * @param	this	当前点击的dom对象那
 * @returns
 */
function getInvoice(th) {
	var $liInput = $(th).parent(".fp-form-btn").siblings("ul").children("li");
	var alertFlag = false;
	var bankAddress = ""; //开户行
	var account = ""; //银行账号
	$liInput.each(function(i, obj) {
		var $inputObj = $(obj).children("input");
		if (typeof($inputObj.val()) == "undefined") {
			console.log("qwe");
			return ;
		}
		var inputVal = $inputObj.val().trim();
		var className = $inputObj.attr("class");
		console.log("className: " + className);
		console.log("循环获取输入框的值: " + inputVal);
		if (inputVal == "") {
			$(".alertInput").remove();
			getErrorMessage(obj, $inputObj, "请完整的开票信息!");
			alertFlag = true;
			return false;
		} else {
			$inputObj.next(".alertInput").remove();
		}
		invoice.invoicetype = invoiceType;
		invoice.invoicecontent = "商品明细";
		if (className == "mobile") {
			if (!isPoneAvailable(inputVal)) {
				getErrorMessage(obj, $inputObj, "请输入正确的手机号!");
				alertFlag = true;
			} else {
				$inputObj.next(".alertInput").remove();
				invoice.phone = inputVal;
			}
		}
		if (className == "mail") {
			if (!isMail(inputVal)) {
				getErrorMessage(obj, $inputObj, "请输入正确的邮箱!");
				alertFlag = true;
				//return false;
			} else {
				$inputObj.next(".alertInput").remove();
				invoice.mailbox = inputVal;
			}
		}
		if (className == "idNumber") {
			if (!isIdCard(inputVal)) {
				getErrorMessage(obj, $inputObj, "请输入正确的身份证号码!");
				alertFlag = true;
			} else {
				$inputObj.next(".alertInput").remove();
				invoice.idNumber = inputVal;
			}
		}
		if (className == "invoicename") {
			invoice.invoicename = inputVal;
		}
		if (invoiceType == 2) {
			if (className == "invoiceTitle") {
				invoice.invoicetitle = inputVal;
			}
			if (className == "txpno") {
				invoice.ghf_nsrsbh = inputVal;
			}
			if (className == "address") {
				invoice.ghf_dz = inputVal;
			}
			if (className == "phone") {
				if (!checkPhone(inputVal)) {
					getErrorMessage(obj, $inputObj, "请输入正确的固定电话!");
					alertFlag = true;
				} else {
					$inputObj.next(".alertInput").remove();
					invoice.ghf_gddh = inputVal;
				}
			}
			if (className == "bankAddress") {
				bankAddress = inputVal;
			}
			if (className == "account") {
				account = inputVal;
			}
		} else {
			if (invoiceTitleFlag == 2) {
				if (className == "invoiceTitle") {
					invoice.invoicetitle = inputVal;
				}
				if (className == "txpno") {
					invoice.ghf_nsrsbh = inputVal;
				}
			} else {
				invoice.invoicetitle = "个人";
			}
		}
	});
	bankAddress = bankAddress + "  ";
	invoice.ghf_yhzh = bankAddress + account;
	if (!alertFlag) {
		$('.zzao').removeClass('zzao-hover');
	}
	$(".fapiao span").html("开发票");
	invoice.mobile = getCookie("userName");
	console.log(invoice);
	return invoice;
}

function getErrorMessage(obj, $inputObj, message) {
	if ($inputObj.next(".alertInput").val() == message) {
		return ;
	}
	$(obj).append(alertInput);
	$inputObj.next(".alertInput").val(message);
}

function recordInvoice(){
	$.ajax({
        url:"/localQuickPurchase/invoice/findInvoiceBySeq",
        type:"POST",
        data:{
            seq: seq
        },
        async:true,
        dataType:"json",
        success:function(data){
        	if(data.code == 200){
        		var invoiceValue = data.data;
        		var invoicetype = invoiceValue.invoicetype;/*发票类型*/
        		var invoicetitle = invoiceValue.invoicetitle;/*抬头类型*/
        		var invoicename = invoiceValue.invoicename;/*发票抬头姓名*/
        		var idNumber = invoiceValue.idNumber;/*身份证*/
				var mobile  = invoiceValue.phone;/*手机号*/
        		var mailBox = invoiceValue.mailBox;/*邮箱*/
        		var txpno = invoiceValue.ghf_nsrsbh;/*纳税人识别号*/
        		var address = invoiceValue.ghf_dz;/*地址*/
        		var ghf_gddh = invoiceValue.ghf_gddh;/*电话*/
        		var bankAddress = invoiceValue.ghf_yhzh;/*开户行*/
                var account = null;/*账号*/
                if(bankAddress != null){
                    var str = bankAddress.split(" ");
                    bankAddress = str[0];
                    account = str[2];
                }
				$('.invoiceTitle').val(invoicetitle);
				$('.txpno').val(txpno);
				$('.invoicename').val(invoicename);
				$('.idNumber').val(idNumber);
				$('.mobile').val(mobile);
				$('.mail').val(mailBox);
				$('.address').val(address);
				$('.phone').val(ghf_gddh);
				$('.bankAddress').val(bankAddress);
				$('.account').val(account);
        	}
        }
	});
}