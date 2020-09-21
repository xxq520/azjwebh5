var userSeq;
var registerMessage;
var distributorSeq = getQueryString("seq");
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
		async : true,//是否异步请求，false为同步
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
		async : true,//是否异步请求，false为同步
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
function register() {
	var flag;
	var data = {};
	data.pwd = $(".pwd").val().trim();
	data.rm = "";
	data.mobile = $(".invita_text input").val().trim();
	data.captcha = $(".code").val().trim();
	data.email = "";
	data.comeFrom = "1001"; //爱之家
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
				hui.toast(message);
				setTimeout(function(){
					window.location.href = "/localQuickPurchase/distributionVA/goodmanage/" + distributorSeq;
				},1500); 
			} else{
				message = data.message;
				hui.toast(message);
			}
		}
	});
	return message;
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
				console.log(data.data);
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

function getEditShopInfo() {
	$.ajax({
		url : "/localQuickPurchase/virtualShopAction/getShopEditInfo",
		type : "post",
		dataType : "json",
		//contentType : "application/json;charset=utf-8",
		data : {"seq" : distributorSeq},
		async : true,
		success : function(res){
			console.log(res);
			if(res.code == 200){
				var storeImg = res.data.storeHeadImg;
				if (storeImg != null && storeImg.trim() == "") {
					$("#shopImg").attr("src", res.data.storeHeadImg);
				}
				$("#shopName").html(res.data.storeName);
			} else{
				console.log(res.message);
				hui.alert("系统异常,查询失败!");
			}
		}
	});
}
