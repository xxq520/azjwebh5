if(userInfo==""||typeof(userInfo)=="undefined"||userInfo==null){
		$("#noLogin").css("display","block");
	}else{
		var userName=getCookie("userName");
		$("#isLogin").css("display","block");
		$("#isLogin .user-name").html(userName);
		$("#isLogin .user-tel").html("Tel："+userName);
}

function outLogin(){
	setCookie("userInfo","",-1);
	setCookie("userName","",-1);
	setCookie("serverFanWei","",-1);
}