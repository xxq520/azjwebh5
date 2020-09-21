var shopperBinding;
/*倒计时*/
function countdown(obj,mobile,imgCode){
	if($(obj).attr("state")=="sent"){
		//var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if(mobile==""){
			hui.toast('请输入手机号码');
			return false;
		}
		if(!isPoneAvailable(mobile)){
			hui.toast('请输入正确的手机号码');
			return false; 
		}
		/*if(mobile.length!==11 || !myreg.test(mobile)){
			hui.toast('请输入正确的手机号码');
			return false; 
		}*/
		sendCode(mobile,imgCode,obj);
	}
}
/*倒计时*/

//var code = getCode(4) + "  ";
$(function(){
	//$(".J-code-but").html(code);
	if($(".generalform").length>0){
		hui.formInit();
	}
	$(".J-code-but").click(function() {
		var obj = $(this);
		var mobile = $("#mobile").val();
		var imgCode = $("#imgCodeInput").val();
		//change(obj);
		countdown(obj,mobile,imgCode);
	})
	/*密码登录*/
	$("#wordLogin").on("click",".J-submit-but",function() {
		$(".msgtips").hide();
		//验证
		var res = huiFormCheck('#wordLogin');
		//提交
		if(res){
			var userName = $("#userName").val();
			var pwd = $("#pwd").val();
			login(userName,pwd);
		}else{
			//$(".msgtips").show().addClass("shake");
			setTimeout(function() {
				//$(".msgtips").removeClass("shake");
			},500)
		}
	})
	/*短信登录*/
	$("#smsLogin").on("click",".J-submit-but",function() {
		$(".msgtips").hide();
		//验证
		var res = huiFormCheck('#smsLogin');
		//提交
		if(res){
			hui.iconToast('验证通过！');
		}else{
			$(".msgtips").show().addClass("shake");
			setTimeout(function() {
				$(".msgtips").removeClass("shake");
			},500)
		}
	})
	/*找回密码*/
	$("#findBack").on("click",".J-submit-next",function() {
		$(".msgtips").hide();
		//验证
		var res = huiFormCheck('#findBack');
		//下一步
		if(res){
			hui.iconToast('验证通过！');
		}else{
			$(".msgtips").show().addClass("shake");
			setTimeout(function() {
				$(".msgtips").removeClass("shake");
			},500)
		}
	})
	$("#resetpw").on("click",".J-submit-but",function() {
		$(".msgtips").hide();
		//验证
		var res = huiFormCheck('#resetpw');
		//确定修改密码
		if(res){
			hui.iconToast('验证通过！');
		}else{
			$(".msgtips").show().addClass("shake");
			setTimeout(function() {
				$(".msgtips").removeClass("shake");
			},500)
		}
	})
	/*注册*/
	//$("#register").on("click",".J-submit-but",);
	
	/*帮助反馈折叠列表*/
	if($("#accordionList").length>0){
		hui.accordion(true, true);
	}
	$("#feedback textarea").keyup(function() {
		var textlength = parseInt($("#feedback textarea").val().length);
		var remainlength = 200-textlength;
		$("#feedback .areatips i").html(textlength);
		$("#feedback .areatips b").html(remainlength);
	})
	$("#feedback").on("click",".J-submit-but",function() {
		$(".msgtips").hide();
		//验证
		var res = huiFormCheck('#feedback');
		var message = $("#message").val();
		var contactWay = $(".contactWay").val();
		//提交
		if(res){
			insertFeedbank(contactWay,message);
			var tipslayer="<div style='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);background:#fff;width: 75%;padding: 2rem 0;z-index:999;'><p style='text-align:center;margin: 0 0 .25rem;font-size: 1.25rem;color: #e23030;'>恭喜你</p><p style='text-align:center;font-size: .75rem;color: #212121;'>提交成功</p></div>";
			hui.dialogBase();
			$("body").append(tipslayer);
		}else{
			$(".msgtips").show().addClass("shake");
			setTimeout(function() {
				$(".msgtips").removeClass("shake");
			},500)
		}
	});
})
//反馈
function insertFeedbank(contactWay,message){
	$.ajax({
		type : 'GET',
		url : '/localQuickPurchase/feedbackAction/insert',
		data : {
			seq : seq,   
			contactWay : contactWay,
			message : message
		},
		async : true,
		success : function(data) {

		}
	})
};


function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


//注册
function addUser(){
	var mobile = $("#mobile").val().trim();
	var pwd = $("#pwd").val().trim();
	var captcha = $("#captcha").val().trim();
	var rm = '';
	//邀请人手机号
	/*var rm = $("#rm").val();
	if(rm != null){
		rm = rm.trim();
	}*/
	var data = {};
	data.mobile = mobile;
	data.pwd = pwd;
	data.captcha = captcha;
	//data.rm = rm;
	data.email = "";
	data.comeFrom = "1001"; //爱之家
	loadingdate("注册登录中,请稍等!");
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/shopMongo/addUser",
		dataType : "json",	//设置返回值得类型
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify(data),
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			var code = data.code;
			var message = data.message;
			clearLoading();
			if(code == 200){
				hui.iconToast('验证通过！');
				var shareSeq = getCookie("shareSeq"); //分享人seq
				//alert("分享人seq: " + shareSeq);
				if (shareSeq != null && shareSeq != "") {
					var seqM = findByMobile(mobile);	//获取注册后的seq
					//alert("注册人seq: " + seqM);
					var flag = addVip(seqM, shareSeq);
					if (flag.indexOf("成功") > -1) {
						var shopperB = findShopperBySeq(shareSeq);
						var alertMessage = "恭喜您注册成功，您已经绑定手机号为"+ shopperB.mobile +"的会员";
						alert(alertMessage);
						//hui.alert(alertMessage);
					}
				}
				if(investmentSeq != null && investmentSeq != ""){//现场招商绑定关系
					relationship(investmentSeq,mobile);
				}else {
					console.log("=======现场招商没有获取到邀请人seq========");
				}
				if(enterpriseShareSeq != null && enterpriseShareSeq != ""){//企业级代理商绑定关系
					relationship(enterpriseShareSeq,mobile);
				}else {
					console.log("=======企业级代理商没有获取到邀请人seq========");
				}
				login(mobile,pwd);
			} else{
				// 因为注册接口有时候请求会失败，所以这里进行判断，如果返回的错误信息是请求失败，则在重新调用一次注册接口
				if(message.indexOf("请求失败") > 0){
					addUserTwo();
				} else if(message.indexOf("已注册") > 0){
					hui.iconToast("手机已注册","error");
				} else if (message.indexOf("验证码错误") > 0) {
					hui.iconToast("验证码错误","error");
				} else {
					hui.iconToast("注册失败","error");
				}
			}
		}
	});
}

function registerf() {
	var masterSeq = GetRequest().rdSeq;
	var mobile = $("#mobile").val();
	$(".msgtips").hide();
	//验证
	var res = huiFormCheck('#register');
	if($("#mobile").val().length==0){
		//hui.toast("请输入电话号码");
		$("#mobile").focus();
		return false;
	}
	if($("#pwd").val().length==0){
		//hui.toast("请输入密码");
		$("#pwd").focus();
		return false;
	}
	var userpw = $("input[name=userpw]").val();
	if(userpw.length < 6){
    	//hui.toast("密码长度不能低于六位");
    	return;
	}
	if($("#pwd1").val().length==0){
		hui.toast("请输入确认密码");
		$("#pwd1").focus();
		return false;
	}else{
		if($("#pwd1").val()!=$("#pwd").val()){
			hui.toast('两次密码不一致！');
			$("#pwd1").focus();
			return false;
		}
	}
	if($("#captcha").val().length==0){
		hui.toast("请输入验证码");
		$("#pwd1").focus();
		return false;
	}
	/*var codeR = $("#captcha").val().trim();
	console.log("输入的验证码: " + codeR);
	console.log("随机的验证码: " + code.trim());
	if(codeR != code.trim()){
		hui.toast("请输入正确的验证码");
		$("#pwd1").focus();
		return false;
	}*/
	
	//提交
	if(res){
		addUser();
	}else{
		$(".msgtips").show().addClass("shake");
		setTimeout(function() {
			$(".msgtips").removeClass("shake");
		},500)
	}
}



//密码登录
var validation = 0; //没登录过或长期不登录验证用
var investmentSeq = getCookie("investmentSeq");//现场招商商家的seq
var enterpriseShareSeq = getQueryString("enterpriseShareSeq");//企业级代理商的邀请人seq
var investmentAccounts = getCookie("investmentAccounts");//现场招商用户勾选礼包数据封装的redisKey
console.log("investmentSeq:"+investmentSeq+"investmentAccounts:"+investmentAccounts);
function login(userName,pwd){
	
	var userpw = $("input[name=userpw]").val();
	$("#pwd").blur(function(){
    	if(userpw.length < 6){
        	//hui.toast("密码长度不能低于六位");
        	return;
    	}
    });
	if(userpw.length < 6){
		//hui.toast("密码长度不能低于六位");
    	return;
	}
	loadingdate("登录中,请稍后!");
	$.ajax({
		type : "post", 
		url : "/localQuickPurchase/shopMongo/loginTest",
		dataType : "json", 
		data : {
			userName : userName,
			pwd : pwd,
			shareSeq : enterpriseShareSeq
		},
		async : true,
		success : function(data) {
			var code = data.code;
			if(code == 200){
				//用来验证是否新登录或者半年没有登录(此功能暂时不要)
				var validationSeq = getCookie("validationSeq");
				var seq = data.data.seq;
				/*if(validationSeq == "" || validationSeq == null || seq != validationSeq){
					if(validation == 0){
						var html_ = '';
						html_ += '<input type="text" oninput="colorOnchange(this)" id="captcha" class="hui-input font-md" name="smscode" maxlength="4" placeholder="请输入验证码" checkType="string" checkData="1," checkMsg="请输入验证码" />';
						html_ += '<button id="verification" type="button" class="hui-button hui-fl J-code-but" state="sent" onclick="verificationCode(this)">获取验证码</button>';
						$("#validation").html(html_).show();
						return;
					}
				}*/
				hui.iconToast('登录成功！');
				setCookie("validationSeq",seq,180);
				var warrant = data.data.virtualShop.warrant;
				if(warrant == null){
					warrant = 0;
				}
				setCookie("headImg",data.data.virtualShop.headImgUrl,7);
				setCookie("nickName",data.data.virtualShop.nickName,7);
				setCookie("warrant",warrant,7);
				setCookie("enterpriseAgent",data.data.enterpriseAgent,7);
				//现场招商登录跳转
				if(investmentAccounts != null && investmentAccounts != ""){
					//判断是否绑定关系,没有就绑定关系
					relationship(investmentSeq,userName);
					var investUrl = "/localQuickPurchase/investmentGoods/settlement?redisKey="+investmentAccounts;
					//window.location.href=investUrl;
					location.href=investUrl
					console.log(investUrl);
					return;
				}
				//邀请企业级代理商链接跳转
				///localQuickPurchase/distributionVA/enterpriseLevelAgent?shareSeq=4316541
				//邀请企业级代理商链接跳转
                if(enterpriseShareSeq != null && enterpriseShareSeq != "") {
                	//企业级代理商绑定关系
                	relationship(enterpriseShareSeq,userName);
                    var investUrl = "/localQuickPurchase/distributionVA/enterpriseLevelAgent?shareSeq="+enterpriseShareSeq;
                    //window.location.href=investUrl;
                    location.href=investUrl
                    return;
                }
				var distributorType = getCookie("distributorType");
				var consumer = getCookie("consumer");
				var jumpUrl = "/localQuickPurchase/distributionVA/index";
				
				var loginRetrunUrl = getCookie("loginRetrunUrl");
				var userInfo = getCookie("userInfo");
				
				var distributorType = getCookie("distributorType");
				var consumer = getCookie("consumer");
				// 判断是否是app
				var u = navigator.userAgent;
				var isappwebview = u.indexOf('app_webview') > -1
				if(isappwebview){
					// 登录成功后，给app调用的方法
					try{
						window.action.loginSuccess(userInfo,distributorType,consumer);
					}catch(e){
						
					}
				}
				
				if(loginRetrunUrl == ""){
					console.log("jumpUrl:" + jumpUrl);
					console.log("returnAddressUrl:" + returnAddressUrl);
					console.log("loginRetrunUrl:" + loginRetrunUrl);
					var returnAddressUrl = document.referrer;
					//现场招商跳转到个人中心页面
					if(returnAddressUrl.indexOf("orderStatus")>0){
						var orderStatusUrl = "/localQuickPurchase/distributionVA/personal/index";
						window.location.href = orderStatusUrl;
						return;
					}
					if(returnAddressUrl=="" || returnAddressUrl.indexOf("login")>0
							|| returnAddressUrl.indexOf("Login")>0 || returnAddressUrl.indexOf("placeOrderPay")>0 
							|| returnAddressUrl.indexOf("upgradeSchedule")>0 || returnAddressUrl.indexOf("resetpw")>0
							|| returnAddressUrl.indexOf("orderStatus")>0){
						window.location.href=jumpUrl;
					} else{
						window.location.href=returnAddressUrl;
					}
				} else{
					window.location.href=loginRetrunUrl;
				}
			} else if(code == 404){
				if(investmentSeq != null && investmentSeq != ""){
					var url = "";
					hui.confirm('您还没有注册,请是否去注册', ['取消','确定'],function() {
						url = "/localQuickPurchase/distributionVA/login/register";
						window.location.href = url;
				    },function(){
				    	url = getCookie("loginRetrunUrl");
						window.location.href = url;
				    });
				}else{
					hui.iconToast('用户不存在','error');
				}
				
				
			} else if(code == 201){
				var userLoginError = data.data.userLoginError;
				if(userLoginError == 6){
					hui.iconToast('您的账号已锁定,将在24小时后自动解锁,解锁剩余时间','error');
				}else{
					if(userLoginError < 3){
						hui.iconToast('错误的用户名/密码','error');
					}else{
						hui.toast('错误的用户名/密码,您还有'+userLoginError+'','error');
					}
				}
			}else if(code == 501){
				hui.alert(data.message,"确定",function(){
					
				});
			}else{
				var userLogin = data.data.userLogin;//用户状态 0：正常 1:锁定
				var stateTiem = fun_date(data.data.stateTiem,1);//用户状态更新时间
				var newDate = getToData();
				var countdownTime = stateTiem-newDate;
				var errorNum = 5-userLogin.length;
				console.log(AccordingTime(countdownTime));
				if(userLogin == 1){
					hui.iconToast('您的账号已锁定,将在24小时后自动解锁,剩余'+AccordingTime(countdownTime),'error');
				}else{
					if(errorNum > 3 || errorNum < 0){
						hui.iconToast('错误的用户名/密码','error');
					}else{
						hui.iconToast('错误的用户名/密码,您还有'+errorNum+'次输入机会','error');
					}
				}
				//hui.iconToast('错误的用户名/密码','error');
			}
			clearLoading();
		}
	})
}
function loginaTwo(userName,pwd){
	$.ajax({
		type : "post", 
		url : "/localQuickPurchase/shopMongo/loginTest",
		dataType : "json", 
		data : {
			userName : userName,
			pwd : pwd
		},
		async : false,
		success : function(data) {
			var code = data.code;
			if(code == 200){
				hui.iconToast('登录成功！');
				var distributorType = getCookie("distributorType");
				var consumer = getCookie("consumer");
				var jumpUrl;
				if(isRoleAgent() || isRoleDealer()){
					jumpUrl="/localQuickPurchase/distributionVA/index/distributionIndex";
				} else{
					if(consumer == 2){
						jumpUrl="/localQuickPurchase/distributionVA/personal2/index"; 
					} else{
						jumpUrl="/localQuickPurchase/distributionVA/index/index";
					}
				}
				var userInfo = getCookie("userInfo");
				var distributorType = getCookie("distributorType");
				var consumer = getCookie("consumer");
				// 判断是否是app
				var u = navigator.userAgent;
				var isappwebview = u.indexOf('app_webview') > -1
				if(isappwebview){
					// 登录成功后，给app调用的方法
					window.action.loginSuccess(userInfo,distributorType,consumer);
				}
				
				window.location.href=jumpUrl;
			} else{
				hui.iconToast('错误的用户名/密码！','error');
			}
		}
	})
}
//发送验证码
function sendCode(mobile,code,obj){
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/sendCodeV2",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : {mobile:mobile,code:code},
		async : true,	//是否异步请求，false为同步
		success : function(data) {
			if(data.code == "501"){
				$(".img-code-con").show();
				var  random = Math.random()
				$("#imgCode img").attr("src","/localQuickPurchase/validateCode?random="+ random);
				refreshImgCode();
				hui.toast(data.message);
			}else if(data.code == "200"){
				hui.toast(data.message);
				var countdown = 60;
				var smsTime;
				$(obj).attr("state", "ban");
				$(obj).css("color","#262626");
				var smsTime = setInterval(function() {
					--countdown;
					if (countdown == 0) {
						clearInterval(smsTime);
						$(obj).css("color","#f35f5f");
						$(obj).html("重发验证码");
						$(obj).attr("state", "sent");
					} else {
						$(obj).html(countdown + "秒后重发");
					}
				}, 1000);
			}else{
				hui.toast("系统繁忙,清稍后重试");
			}
		}
	});
}
//刷新图片验证码
function refreshImgCode(){
	$("#imgCode").on("click",function(){
		console.log($(this).find("img"));
		console.log("/localQuickPurchase/validateCode");
		$(this).find('img').attr("src","/localQuickPurchase/validateCode?time="+ new Date().toLocaleTimeString())
	})
}


function addUserTwo(){
	var mobile = $("#mobile").val().trim();
	var pwd = $("#pwd").val().trim();
	var captcha = $("#captcha").val().trim();
	//邀请人手机号
	/*var rm = $("#rm").val();
	if(rm != null){
		rm = rm.trim();
	}*/
	var data = {};
	data.mobile = mobile;
	data.pwd = pwd;
	data.captcha = captcha;
	//data.rm = rm;
	data.email = "";
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/shopMongo/addUser",
		dataType : "json",	//设置返回值得类型
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify(data),
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			var code = data.code;
			var message = data.message;
			if(code == 200){
				hui.iconToast('验证通过！');
				//if(rm != '' && rm.trim() != ''){
					// true 查询成功,并且有seq
					var seqMobile = findByMobile(rm);	//通过邀请人手机号获取他的seq
					if (seqMobile != null) {
						console.log("=======建立关系中========");
						var seqM = findByMobile(mobile);	//通过手机号获取用户的seq
						var flag = addVip(seqM, seqMobile);
						if (flag) {
							console.log("========建立关系成功=========");
						} else {
							console.log("========建立关系失败=========");
						}
					} else {
						console.log("=======没有查询到邀请人seq========");
					}
				//}
				login(mobile,pwd);
			} else{
				// 因为注册接口有时候请求会失败，所以这里进行判断，如果返回的错误信息是请求失败，则在重新调用一次注册接口
				if(message.indexOf("请求失败") > 0){
					addUserTwo();
				} else if(message.indexOf("已注册") > 0){
					hui.iconToast("手机已注册","error");
				} else{
					hui.iconToast("注册失败","error");
				}
			}
		}
	});
}



/*银行卡选择picker*/
if($("#bankName").length>0){
	var pickerbank = new huiPicker("#bankName", function(){
		var bankname = pickerbank.getText(0);
		var bankvalue = pickerbank.getVal(0);
		$("#bankName").val(bankname).attr("data-values",bankvalue);
	});
	pickerbank.level = 1;
	var names = new Array();
	names = [
		{
			value: "1",
			text:"中国建设银行"
		},
		{
			value: "2",
			text:"广发银行"
		},
		{
			value: "3",
			text:"中国银行"
		},
		{
			value: "4",
			text:"中国农业银行"
		},
		{
			value: "5",
			text:"中国工商银行"
		},
		{
			value: "6",
			text:"邮政储蓄银行"
		},
		{
			value: "7",
			text:"招商银行"
		}
		]
	pickerbank.bindData(0, names);
}
/*添加银行卡表单验证*/
/*$("#addBank").on("click",".J-add-bank",function() {
	$(".msgtips").hide();
	//验证
	var res = huiFormCheck('#addBank');
	//提交
	if(res){
		addbank();
	}else{
		$(".msgtips").show().addClass("shake");
		setTimeout(function() {
			$(".msgtips").removeClass("shake");
		},500)
	}
});*/
/*添加银行卡表单验证*/
function addBankClick(){
	$(".msgtips").hide();
	//验证
	var res = huiFormCheck('#addBank');
	//提交
	if(res){
		addbank();
	}else{
		$(".msgtips").show().addClass("shake");
		setTimeout(function() {
			$(".msgtips").removeClass("shake");
		},500)
	}
}

/*添加银行卡*/
function addbank(){
	
	var seq = getCookie('seq');
	var bankName = $("input[name='bankName']").val();//银行名称
	var userName = $("input[name='userName']").val();//持卡人姓名
	var bankOfDeposit = $("input[name='bankOfDeposit']").val();//银行支行
	var bankNo = $("input[name='bankNo']").val();//银行卡号
	var bankphone = $("#mobile").val();//手机号码
	var idCard = $("input[name='idCard']").val();//身份证号
	var smscode = $("input[name='smscode']").val();//验证码
	if(bankName == "" || bankName == null){
		hui.iconToast("请选择发卡行","error");
		return;
	}
	if(bankOfDeposit== "" || bankOfDeposit == null){
		hui.iconToast("请输入银行支行","error");
		return;
	}
	if(userName == "" || userName == null){
		hui.iconToast("请输入持卡人姓名","error");
		return;
	}
	if(bankNo == "" || bankNo == null){
		hui.iconToast("请输入银行卡号","error");
		return;
	}
	
	if(!isIdCard(idCard)){
		hui.iconToast("身份证号码不正确","error");
		return;
	}
	if (!isPoneAvailable(bankphone)){
		hui.iconToast("手机号不正确","error");
		return;
	}
	if (smscode.length!=4){
		hui.iconToast("请输入有效验证码","error");
		return;
	}
	loadingdate("加载中...");
	/*添加银行卡*/
	var bankTypeId = 0;
	if ($.trim(bankTypeId) != "") {
		$.ajax({
			type : 'POST',
			dateType : 'JSON',
			url : '/localQuickPurchase/shopper/addBankCard',
			data :{"idCard":idCard,"seq":seq,"bankCardNumber":bankNo,"cardName":userName,"typeName":bankName,
				"typeId":bankTypeId,"bankOfDeposit":bankOfDeposit,"smscode":smscode,"bankphone":bankphone},
			async : true,	//是否异步请求，false为同步
			success : function(data){
				if (data.code == 200) {
					hui.iconToast('验证通过！');
					window.location.href = "/localQuickPurchase/distributionVA/withdrawal";
				}else{
					if(data.message!="" && data.message != null && data.code != 201 && data.code != 404 && data.code != 500){
						hui.iconToast(data.message,"error");
					}else{
						hui.iconToast("添加银行卡失败","error");
					}
				}
				clearLoading();
			},
			error : function(error){
				clearLoading();
				hui.iconToast("请求异常","error");
			}
		});
	} else {
		hui.iconToast("缺失参数","error");
	}
}

function getCookie(cookName){  
	if(document.cookie.length>0){  
		var c_start = document.cookie.indexOf(cookName + "=");  
		if(c_start!=-1){ //存在  
			if(c_start == 0){
				c_start = c_start + cookName.length + 1; //"history="后的开始位置  
				var c_end=document.cookie.indexOf(";",c_start); //找到JSESSIONID在的位置  
				if (c_end==-1){ //JSESSIONID不存在  
					c_end=document.cookie.length;  
				}  
				return unescape(document.cookie.substring(c_start,c_end));
			} else{
				c_start = document.cookie.indexOf("; "+cookName + "=");
				if(c_start!=-1){ //存在  
					c_start = c_start + cookName.length + 3; //"history="后的开始位置  
					var c_end=document.cookie.indexOf(";",c_start); //找到JSESSIONID在的位置  
					if (c_end==-1){ //JSESSIONID不存在  
						c_end=document.cookie.length;  
					}  
					return unescape(document.cookie.substring(c_start,c_end)); 
				}
			}

		}   
	}  
	return "";  
}; 

function verificationCode(obj){
	var userName = $("#userName").val();
	validation = 1;
	countdown(obj,userName);
}

//绑定关系  seqMobile：上级的seq,mobile:用户的手机号
function relationship(seqMobile,mobile){
	console.log("=======建立关系中========");
	var seqM = findByMobile(mobile);	//通过邀请人手机号获取他的seq
	var flag = addVip(seqM, seqMobile);
	if (flag) {
		console.log("========建立关系成功=========");
	} else {
		console.log("========建立关系失败=========");
	}
}

/**
 * 通过手机号查询seq
 * @param mobile
 * @returns	
 */
function findByMobile(mobile) {
	var seqMobile = null;
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/shop/findShopperByMobile",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : {
			"mobile" : mobile
		},
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			console.log(data);
			if (data.code == 200 && data.data != null) {
				seqMobile = data.data.seq;
			}
		}
	});
	return seqMobile;
}
/**
 * 通过用户seq和网络店主seq,建立关系
 * @param userSeq
 * @param distributorSeq
 * @returns
 */
function addVip(userSeq, distributorSeq) {
	var message;
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/relation/addRelation",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : {
			"userSeq" : userSeq,
			"distributorSeq" : distributorSeq
		},
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			var code = data.code;
			if(code == 200){
				message = '建立关系成功!';	
			} else{
				if (code == 404) {
					message = data.message;
				} else {
					message = '系统错误,请稍后再试!';
				}
			}
		}
	});
	return message;
}

function findShopperBySeq(superiorSeq){
	var shopperBinding;
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/shopper/findShopperBySeq",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : {
			"seq" : superiorSeq
		},
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			var code = data.code;
			if(code == 200){
				shopperBinding = data.data.shopper;
			} else{
				
			}
		}
	});
	return shopperBinding;
}