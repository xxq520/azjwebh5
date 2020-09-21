var count = 0;//控制获取验证码事件
//判断该手机是否存在
function verificationCode(object){
	//获取手机号
	var userPhone = $("input[name=phone]").val();
	var imgCode = $("#imgCodeInput").val();
	if(!isPoneAvailable(userPhone)){
		hui.toast("请输入正确的手机号码！");
		return;
	}
	if($(object).attr("state")=="ban"){
		return;
	}
	$.ajax({
		type : "get",//定义提交的类型
		url : "/localQuickPurchase/ifRegisted",
		dataType : "json",//设置返回值得类型
		data : {
			"mobile" : userPhone
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数
			if(data.code==200){
				/*var obj = $(object);
				count = countdown(obj,userPhone);
				if(count != 1){
					hui.toast("验证码已发送!");
					return;
				}*/
				sendCode(userPhone,object,imgCode);
			}else if(data.code==404){
				hui.confirm("您还没注册,是否去注册!", ['取消','确认'], function(){
					window.location.href="/localQuickPurchase/distributionVA/login/register";
				});
				return;
			}else{
				hui.toast("网络异常,请稍后再试!");
				return;
			}
			
			/*if(data.data.status == 400){//到外部接口（一部）
				var obj = $(object);
				count = countdown(obj,userPhone);
				if(count != 1){
					hui.toast("验证码已发送!");
					return;
				}
				sendCode(userPhone,object);
			}else if(data.data.status == 200){
				hui.confirm("您还没注册,是否去注册!", ['取消','确认'], function(){
					window.location.href="/localQuickPurchase/distributionVA/login/register";
				});
				return;
			}*/
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {  
	            console.log('error');  
	            console.log(XMLHttpRequest.status);  
	            console.log(XMLHttpRequest.readyState);  
	            console.log(textStatus);  
	    }
	});
};
//根据手机号发送验证码
function sendCode(userPhone,object,code) {
	$.ajax({
		type : "get",//定义提交的类型
		url : "/localQuickPurchase/sendCodeV2",
		dataType : "json",//设置返回值得类型
		data : {
			"mobile" : userPhone,
			"code":code
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数
			if(data.code == 200){
				/*if(data.data.data == 1){
				    hui.alert(data.data.msg);
				}*/
				hui.toast("验证码发送成功！");
				var obj = $(object);
				count = countdown(obj,userPhone);
				if(count != 1){
					hui.toast("验证码已发送!");
					return;
				}
			}else if(data.code == 501){
				$(".img-code-con").show();
				var  random = Math.random()
				$("#imgCode img").attr("src","/localQuickPurchase/validateCode?random=" + random+"&mobile="+userPhone);
				refreshImgCode(userPhone);
				hui.toast(data.message);
			}else{
				hui.toast("验证码发送失败,请重新发送！");
				return;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {  
	            console.log('error');  
	            console.log(XMLHttpRequest.status);  
	            console.log(XMLHttpRequest.readyState);  
	            console.log(textStatus);  
	    }
	});
}
//手动刷新图片验证码
function refreshImgCode(userPhone){
	$("#imgCode").on("click",function(){
		console.log($(this).find("img"));
		console.log("/localQuickPurchase/validateCode");
		$(this).find('img').attr("src","/localQuickPurchase/validateCode?time="+ new Date().toLocaleTimeString()+"&mobile="+userPhone)
	})
}
//验证码检验
function theNextStep(){
	//获取验证码
	var smscode = $("input[name=smscode]").val();
	//获取手机号
	var userPhone = $("input[name=phone]").val();
	if(!isPoneAvailable(userPhone)){
		hui.toast("请输入正确的手机号码！");
		return;
	}
	if(smscode == null || smscode == ""){
		hui.toast("请输入验证码！");
		return;
	}
	//根据手机号和验证码,检验验证码输入是否正确
	var flag;
	$.ajax({
		type : "get",//定义提交的类型
		url : "/localQuickPurchase/ifCode",
		dataType : "json",//设置返回值得类型
		data : {
			"mobile" : userPhone,
			"vcCode" : smscode
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数
			if(data.code == 200){
				if(data.data.status == 200){
					window.location.href="/localQuickPurchase/distributionVA/resetpw/"+userPhone;
				}else{
					hui.toast("请输入正确的验证码！");
				}
			}else{
				hui.toast("网络异常,请稍后再试！");
			}
			/*flag = ifStatus(data);
			if(flag){
				window.location.href="/localQuickPurchase/distributionVA/resetpw/"+userPhone;
			}else{
				hui.toast("请输入正确的验证码！");
			}*/

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {  
	            console.log('error');  
	            console.log(XMLHttpRequest.status);  
	            console.log(XMLHttpRequest.readyState);  
	            console.log(textStatus);  
	    } 
	});
	return flag;
};
//根据返回状态判断是否成功
function ifStatus(data) {
	var flag;
	var da = data.code;
	console.log(da);
	if (da == null) {
		return flag = false;
	}
	if (da == 200) {
		flag =  true;
	} else {
		flag =  false;
	}
	return flag;
}
/*倒计时*/
function countdown(obj,mobile){
	count = count+1;
	var countdown = 60;
	var smsTime;
	if($(obj).attr("state")=="sent"){
//		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
		if(mobile==""){
			//hui.toast('请输入手机号码');
			return false;
		}
		if(!isPoneAvailable(mobile)){
			hui.toast('请输入正确的手机号码');
			return false; 
		}
		$(obj).attr("state", "ban");
		$(obj).css("color","#262626");
		var smsTime = setInterval(function() {
			--countdown;
			if (countdown == 0) {
				clearInterval(smsTime);
				$(obj).css("color","#f35f5f");
				$(obj).html("重发验证码");
				$(obj).attr("state", "sent");
				count = 0;
			} else {
				$(obj).html(countdown + "秒后重发");
			}
		}, 1000);
	}
	return count;
}
/*倒计时*/










