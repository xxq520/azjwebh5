$(function(){
	$(".loginBtn").click(function(){
		var mobile = $("input[name=username]").val();
		var pwd = $("input[name=pwd]").val();
		setCookie('SIOFTFF_UD',pwd,365);
		var _html = '';
		if(mobile==''){
			_html += '<div class="login-txt">手机号不能为空</div><a class="login-btn">返回</a>';
			$(".dialog-cont").html(_html);
			$(".login-dialog").show();
			return;
		}
		if(pwd == ''){
			_html += '<div class="login-txt">密码不能为空</div><a class="login-btn">返回</a>';
			$(".dialog-cont").html(_html);
			$(".login-dialog").show();
			return;
		}
		console.log("mobile:"+mobile+",pwd:"+pwd);
		$.ajax({
			url: _content+'/shopMongo/loginTest',
			type: 'get',
			dataType: 'json',
			xhrFields: {withCredentials: true},
			data: {userName: mobile,pwd:pwd},
		})
		.done(function(res) {
			console.log(res);
			if(res.code == 200){
				var data = res.data;
				var userName = data.mobile;
				var userInfo = JSON.stringify(data);
				setCookie('userInfo',userInfo,365);
				setCookie('userName',userName,365);
				$(".resultTip").text("登录成功").show(300).delay(2000).hide(300);
				var delay = setTimeout(function(){
					if(document.referrer == ""){
						window.location="/localQuickPurchase/generalStore/html/index.jsp"; 
					}else{
						window.location=document.referrer; 
					}
				}, 1500)
			}else{
				$(".resultTip").text("手机号或密码错误").show(300).delay(2000).hide(300);
			}
		})
		.fail(function() {
			console.log("error");
		});
	})
})
$(document).on("click",".login-btn",function(){
	$(this).parents(".login-dialog").hide();
})