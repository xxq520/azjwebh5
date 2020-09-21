 window.location.href = "/localQuickPurchase/distributionVA/index";
/*hui.alert("为了给您提供完整的服务，请登录后再进行该操作", "确认", function(){
	 //var url = "/localQuickPurchase/distributionVA/login/passwordLogin";
	 window.location.href = "/localQuickPurchase/distributionVA/index";
});*/
var userSeq;
var registerMessage;
var distributorSeq = getQueryString("shopSeq");
console.log(distributorSeq);
var isPartnerAgent  = 0; // isPartnerAgent = 1 伙伴代理商   0  普通代理商
//通过手机号验证是否注册
function ifRegister(mobile) {
	var flag;
	$.ajax({
		type : "get",//定义提交的类型
		url : "/localQuickPurchase/ifRegisted",
		dataType : "json",//设置返回值得类型
		data : {
			"mobile" : mobile
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数
			flag = data.code; 
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {  
	            console.log('error');  
	            console.log(XMLHttpRequest.status);  
	            console.log(XMLHttpRequest.readyState);  
	            console.log(textStatus);  
	    }
	});
	return flag;
}

//根据手机号发送验证码
function sendCode(mobile) {
	var flag;
	$.ajax({
		type : "get",//定义提交的类型
		url : "/localQuickPurchase/sendCode",
		dataType : "json",//设置返回值得类型
		data : {
			"mobile" : mobile
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数
			flag = ifStatus(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {  
	            console.log('error');  
	            console.log(XMLHttpRequest.status);  
	            console.log(XMLHttpRequest.readyState);  
	            console.log(textStatus);  
	    } 
	});
	return flag;
}

//根据手机号和验证码,检验验证码输入是否正确
function ifCode(mobile, code) {
	var flag;
	$.ajax({
		type : "get",//定义提交的类型
		url : "/localQuickPurchase/ifCode",
		dataType : "json",//设置返回值得类型
		data : {
			"mobile" : mobile,
			"vcCode" : code
		},
		async : false,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数
			flag = ifStatus(data);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {  
	            console.log('error');  
	            console.log(XMLHttpRequest.status);  
	            console.log(XMLHttpRequest.readyState);  
	            console.log(textStatus);  
	    } 
	});
	return flag;
}

/**
 * 注册
 * @returns
 */
function register(pwd,mobile,captcha) {
	var flag;
	var data = {};
	data.pwd = pwd;
	data.rm = "";
	data.mobile = mobile;
	data.captcha = captcha;
	data.email = "";
	console.log(data);
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/shopMongo/addUser",
		dataType : "json",	//设置返回值得类型
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify(data),
		async : false,	//是否异步请求，false为同步
		success : function(data) {
			var code = data.code;
			if(code == 200){
				flag = true;
			} else{
				registerMessage = data.message;
				console.log(registerMessage);
				flag = false;
			}
		}
	});
	return flag;
}

function getResultJson(bool){
	var json ;
	if(bool){
	 json = {"code":200,"msg":"ok"};
	}else{
		 json = {"code":300,"msg":"error"};
	}
	return json;
}

/**
 * 通过用户seq和分销商seq,建立关系
 * @param userSeq
 * @param distributorSeq
 * @returns
 */
function addVip(userSeq, distributorSeq) {
	var json = getResultJson(true);
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
			var message = data.message;
			if(code == 200){
				message = '建立关系成功!';	
				json.msg = message;
				//hui.toast(message);
				/*setTimeout(function(){
					//跳转开店礼包页面
					window.location.href="/localQuickPurchase/distributionVA/inviate";
				},1500); */
			} else{
				json.msg = message;
				json.code = code;
				//message = data.message;
				//hui.toast(message);
				
			}
		}
	});
	return json;
}

function findByMobile(mobile) {
	var message;
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
			if (data.code == 200) {
				userSeq = data.data.seq;
			}
		}
	});
	return message;
}

//根据返回状态判断是否成功
function ifStatus(data) {
	var flag;
	var da = data.data;
	console.log(da);
	if (da == null) {
		return flag = false;
	}
	if (da.status == 200) {
		flag =  true;
	} else {
		flag =  false;
	}
	return flag;
}

//校验手机号是否正确
function isPoneAvailable(str) {  
    var myreg=/^[1][3,4,5,7,8,9][0-9]{9}$/;  
    if (!myreg.test(str)) {  
        return false;  
    } else {  
        return true;  
    }  
}
/**
 * 领取试用店主方法
 */
function inviteDistributor(userSeq,inviteSeq){
	var resultJson = {"code":400,"msg":"error"};
	$.ajax({
		type : "post",	//定义提交的类型9
		url : "/localQuickPurchase/dApplicationAction/inviteDistributor",
		dataType : "json",	//设置返回值得类型
		//contentType : "application/json;charset=utf-8",
		data : {
			"userSeq" : userSeq,
			"inviteSeq" : inviteSeq
		},
		async : false,	//是否异步请求，false为同步
		success : function(result) {
			var code = result.code;
			if(code == 200){
				resultJson.code = code;
				resultJson.msg = "ok";
			}else if(code == 401){
				resultJson.code = code;
				resultJson.msg = result.message;
			}else if(code == 402){
				resultJson.code = 401;
				resultJson.msg = result.message;
			}else if(code == 301){
				resultJson.code = 301;
				resultJson.msg = result.message;
			}else{
				resultJson.code = 400;
				resultJson.msg = result.message;
			}
		}
	});
	return resultJson;
}

//倒计时
var wait = 30;
function time(o) {
	
	if (wait == 0) {
		o.attr("disabled", false);
		o.attr("data-state", "sent");
		o.html("获取验证码");
		wait = 30;
	} else {
		o.attr("data-state", "no");
		o.attr("disabled", true);
		o.html("重新发送(" + wait + ")");
		wait--;
		setTimeout(function() {
			time(o);
		}, 1000);
	}
}
	var flag = getQueryString('flag');
	var countdown = 30;
	//发送验证码
	$(".getCode").click(function(){
		if(check(0).code == 300){
			return ;
		}
		var $code = $(this);
		var isSent = $code.attr("data-state");
		//手机验证码
		  if(isSent == "sent"){
			var phone = $("#phone").val();
			var flag = sendCode(phone);	//发送验证码
			if (flag) {
				hui.toast('发送成功,请稍等!');	//发送验证码成功后,提示
			} else {
				$code.attr("disabled", true);
			}
			time($code);
		}
		
		/* num = RndNum(4);
		 $(this).html(num);*/
		
		
		
		
		/* if(countdown == 30){
	    var smsTime = setInterval(function() {
        --countdown;
        if (countdown == 0) {
        	clearInterval(smsTime);
            countdown = 30;
            $(".getCode").html("点击获取");
            
        } else {
        	
            $(".getCode").html(countdown + "秒后重发");
        }
    }, 1000);
		} */
		
	})
	
	//产生随机数函数
	function RndNum(n){
	    var rnd="";
	    for(var i=0;i<n;i++)
	        rnd+=Math.floor(Math.random()*10);
	    return rnd;
	}
	
	function check(type){
		var phone = $("#phone").val();
		var code = $("#code").val();
		var result = {"code":200,"msg":"ok"};
		if(phone == ""){
			hui.toast("请输入手机号");
			result.code = 300;
			result.msg = "请输入手机号";
			return result;
		}
		if(!isPoneAvailable(phone)){
			hui.toast("请输入正确的手机号");
			result.code = 300;
			result.msg = "请输入正确的手机号";
			return result;
		}
		if(type == 1){
			if(code == ""){
				hui.toast("请输入验证码");
				result.code = 400;
				result.msg = "请输入验证码";
				return result;
			}
		}
		return result;
	}
	
/* 	$("body").on('click','.header-delete',function(){
		if(flag == "trial"){
			window.location.href= "store1.html";
		}else{
			window.location.href= "store2.html";
		}
		
	}); */
	//领取试用店主事件
	$("body").on('click','.clickTrial img',function(){
		if(check(1).code != 200)
			return;
		var mobile = $("#phone").val().trim();
		var code = $("#code").val();
		//404 账号不存在	200 账号已存在
		var ifRegisterFlag = ifRegister(mobile);
		//验证码验证
		  if(!ifCode(mobile,code)){
			  hui.toast("请输入正确的验证码");
			return;
		}
		/*if(num != code){
			hui.toast("请输入正确的验证码");
			return ;
		}*/
		var registerResult = true;
		var msg = false;
		if (ifRegisterFlag == 404) {//没注册的手动注册
			var pwd = mobile.slice(5);
			var flagCode = register(pwd,mobile,code);	//注册
    		// true 注册成功 , false 失败
			if (!flagCode) {	
				registerResult = false;
			}else{
				msg = true;
			}
		}
		var inviteType = $(this).attr("inviteType");
		if(registerResult){
			findByMobile(mobile);
			if(inviteType == "0"){//邀请试用网络店主
			var result = inviteDistributor(userSeq,distributorSeq);//领取试用店主方法
			if(result.code != 200 && result.code != 301){
				//hui.alert(result.msg);
				if(result.code == 401){
					$(".trial-failure").show();
					return;
				}else{
					hui.alert(result.msg);
				}
			}else{
				if(msg){
				hui.alert("领取成功，初始密码为您手机号码后六位");
				}
				$(".trial-success").show();
			}
			}else if(inviteType == "1"){//邀请正式网络店主
				var json = addVip(userSeq, distributorSeq);	//建立关系
				if(json.code != 200 && json.code != 301){// 可以要求自己的VIP成为网络店主
					$(".trial-failure").show();
					return;
				}
				
				var url = "/localQuickPurchase/distributionVA/inviate";
				if(isPartnerAgent == 1){//伙伴代理商招募网络店主跳转首页
					//“购买礼包”修改为“马上开店”
					// 点击之后出现弹窗“尊敬的用户，请在注册之后，在爱之家商城购买任意一件商品，就可以升级成为网络店主。”
					  hui.confirm('尊敬的用户，您在爱之家商城购买任意一件商品，就可以升级成为网络店主。', ['取消','去首页'], function(){
					        url = "/localQuickPurchase/distributionVA/index";
							window.location.href = url; 
					    });
				 	// 判断是否登录
					
				}else {//普通代理商
					window.location.href = url; 
				}
				//跳转开店礼包页面
				
				// 2.0版本的升级礼品
				//window.location.href="/localQuickPurchase/distributionVA/buyGiftBag";  //2.1版本的升级礼品
				//hui.toast(message);	
			}
		}else{
			hui.alert("注册失败");
		}
		
		//$(".trial-failure").show();
		
		
	});
	
	function getUrl(){
		var url = "/localQuickPurchase/distributionVA/inviate";
		if(isPartnerAgent == 1){//伙伴代理商招募网络店主跳转首页
			//“购买礼包”修改为“马上开店”
			 // 点击之后出现弹窗“尊敬的用户，请在注册之后，在爱之家商城购买任意一件商品，就可以升级成为网络店主。”
			url += "/localQuickPurchase/distributionVA/index/distributionIndex?isAgent=1";
		}else if(agentType = 0){
			
		}
		return url;
	}

	$(".success-delete").click(function(){
		$(".trial-success").hide();
	});
	$("body").on('click','.failure-delete',function(){
		$(".trial-failure").hide();
	});
	$("body").on('click','#cancel',function(){
		$(".trial-failure").hide();
	});
	//去登录
	$("#goLogin").click(function(){
		//去登录
		//location.href = "/localQuickPurchase/distributionVA/login/passwordLogin";
		//跳转首页
		location.href = "/localQuickPurchase/distributionVA/index";
	});
	
	$(".success-load").click(function(){
		//去登录
        loginPage();
	});
	
	
	function noLogin(){
	    sltHide();
	    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
	        setCookie("loginRetrunUrl",urlVal);
	        var url = loginPageUrl();
		    if (checkShare != null && checkShare != "") {
		    	url += "?rdSeq=" + shareSeq;
		    }
			window.location.href = url;
	    });
	}
	
	//验证验证码是否匹配
	function ifCode(userPhone,smscode){
		var pass = false;
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
						pass = true;
						//window.location.href="/localQuickPurchase/distributionVA/resetpw/"+userPhone;
					}else{
						hui.toast("请输入正确的验证码！");
					}
				}else{
					hui.toast("网络异常,请稍后再试！");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {  
		            console.log('error');  
		            console.log(XMLHttpRequest.status);  
		            console.log(XMLHttpRequest.readyState);  
		            console.log(textStatus);  
		    } 
		});
		return pass;
	}
	
	$("#captcha").click(function() {
		//if ($(this).attr("data-state") == "sent") {
			var mobile = $(".invita_text input").val().trim();
			console.log(mobile);
			var othis = $(this);
			change(othis);
			othis.attr("data-state", "no");
			othis.attr("disabled", false);
			// true 手机号格式不对
			if (!isPoneAvailable(mobile)) {
				othis.attr("data-state", "sent");
				return hui.toast('请输入正确的手机号!');	
			}
			//404 账号不存在	200 账号已存在
			ifRegisterFlag = ifRegister(mobile);
			//flag = typeof(flag) == "undefined" ? false : flag;
			if (ifRegisterFlag == 404) {
				//不存在就去注册
				if($("#setpw").children().length>0){
					$("#setpw").append("");
				}else{
					var str = 	'<div class="invita_text password">'+
						'<input class="hui-input invita_input password pwd" type="password" placeholder="请设置密码" checkType="string" id="pwd" checkData="1," checkMsg="请设置密码"  /></div><div class="invita_text password"><input class="hui-input invita_input" type="password" placeholder="请确认密码"'+ 
						'checkType="sameWithId" checkData="pwd" checkMsg="两次密码不一致" />'+'</div>';
					$("#setpw").append(str);
				}
				$(".invita_confirm").html("立即注册");
			} else {
				$(".invita_confirm").html("确认");
			}
			
			//time(othis);	//计时
			//var flag = sendCode(mobile);	//发送验证码
			/* if (flag) {
				hui.toast('发送成功,请稍等!');	//发送验证码成功后,提示
			} else {
				othis.attr("disabled", true);
			} */
		//s}
			
	});
	//根据seq判断是否是伙伴代理商
	function agentType(){
		$.ajax({
			type : "post",	//定义提交的类型9
			url : "/localQuickPurchase/dApplicationAction/agentType",
			dataType : "json",	//设置返回值得类型
			/*contentType : "application/json",*/
			data : {
				"seq" : distributorSeq
			},
			async : false,	//是否异步请求，false为同步
			success : function(data) {
				var code = data.code;
				if(code == 200){
					isPartnerAgent = 1;
				} 
			}
		});
	}
