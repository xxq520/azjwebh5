
var loginFrom = getCookie("loginFrom");
if(loginFrom!="app"){
	$("#loginOut").show();
}

if(userInfo==""||typeof(userInfo)=="undefined"||userInfo==null){
		$("#noLogin").css("display","block");
	}else{
		$(".sfi-icon-5").attr("class","sfi-icon-5 active");
		$(".sfi-icon-1").attr("class","sfi-icon-1");
		$(".sfi-icon-3").attr("class","sfi-icon-3");
		$(".sfi-icon-4").attr("class","sfi-icon-4");
		$(".sfi-icon-2").attr("class","sfi-icon-2");
		var userName=getCookie("userName");
		$("#isLogin").css("display","block");
		$("#isLogin .user-name").html(userName);
		$("#isLogin .user-tel").html("Tel："+userName);
}

function outLogin(){
	setCookie("userInfo","",-1);
	setCookie("userName","",-1);
	setCookie("serverFanWei","",-1);
	setCookie("loginFrom","",-1);
}