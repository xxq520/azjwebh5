// 个人中心页面
var headImg=getCookie("headImg");
var headName=getCookie("headName");
var nickName=getCookie("nickName");
/*if(headName!=""){
	//$("#personal_userName").html(headName);
	$("#personal_userName").html(headName);
}else{
	var userstr=userName.substring(0,3)+"****"+userName.substring(userName.length-4,userName.length)
	$("#personal_userName").html(userstr);
	//$("#personal_userName").html(userstr);
}*/
if(nickName != null && nickName != "" && nickName != "null"){
    $("#personal_userName").html(nickName);
}else{
    var userstr=userName.substring(0,3)+"****"+userName.substring(userName.length-4,userName.length)
    $("#personal_userName").html(userstr);
}

if(headImg != null && headImg != ""){
	$("#personal_img").attr("src", headImg);
}
$(function(){
	if(headImg == '' && headName == ""){
		$.ajax({
			url:"/localQuickPurchase/shopper/findShopperBySeq",
			type:"POST",
			data:{
				seq: seq
			},
			async:true,
			dataType:"json",
			success:function(data){
				var shopper = data.data.shopper;
				if(null != shopper){
					var userName = shopper.userName;
					var mobile = shopper.mobile;
					var imgUrl =getCookie("headImg"+seq)
					if(imgUrl==""){
						setTimeout(function () {
							// f1的任务代码
							getHeadUrl();
						}, 1);
					}
					$("#username").html(userName);
					$("#usertel").html(mobile);
					$(".userface").html('<img id="headImg"  src="'+imgUrl+'" onerror="this.src=\'../../img/head.png\'"/>');
					var platform=getCookie("platform");
					if(!(platform==="app")){
						var loginList = '<div class="userinfo" id="loginOut"><a href="#" class="login-out">退出登录</a></div>';
						$(".centerinfo").append(loginList);
					}
				}
			},
			error:function(error){
				$.alert("网络错误");
			}
		})
	}
});
function getHeadUrl(){
	$.ajax({
		url:"/localQuickPurchase/getcddata/getHeadUrl",
		type:"POST",
		data:{
			seq: seq
		},
		async:true,
		dataType:"json",
		success:function(data){
			if(data.code==200){
				if(data.data==""){
					setCookie("headImg","1",30);
					setCookie("headName","1",30);
				}else{
					setCookie("headImg",data.data.url,30);
					setCookie("headName",data.data.name,30);
				}
				
				$("#headImg").attr("src",data.data.url);
			}
		},
		error:function(error){
			//$.alert("网络错误");
		}
	})
}