$(function(){
	//var param={seq:"4316541"};

	var seq=getQueryString("masterSeq")
	var param={seq:seq };
	var recruiSeq ={}
	function init(){
		//初次加载待审核分销商
		$.get("/localQuickPurchase/dshop/findShop",param,function(json){
			var code = json.code;
			if(code==200){
				var shop = json.data;
				var html="";
				for(var i=0;i<shop.length;i++){
					if(shop[i].seq==recruiSeq.seq)
						continue;
					html+='<div class="listitem">';
					html+='<div class="lt-top">';
					html+='<img src="'+shop[i].shopHeadImgPath+'" class="ltt-img"  onerror="this.src=\'../../img/head.png\'"/>';
					html+='<div class="ltt-info">';
					html+='<p class="ltti-top">';
					var shopName = shop[i].userName;

					var shopName = ((shopName==null||shopName==''||"null"==shopName)?"":(shopName.substring(0,6)));
					//if(shopName==null||shopName==''){
					//	shopName='';
					//}else {
					//	shopName=shopName.substring(0,8);
					//}
					//var a = a.substring(0,8);
					html+='<span class="lttit-name">'+(shopName+"...")+'&nbsp;&nbsp;&nbsp;<span style="color:red;">邀请您成为分销商</span></span>';
					//html+='<span class="lttit-name">商家名称：'+shop[i].shopName+'</span>';
					//html+='<p class="lttit-tel" style="">联系方式：<span >'+shop[i].mobile+'</span></p>';
					html+='<p class="lttit-tel" style=" margin: 2px 0 0 0;">联系方式：'+shop[i].mobile+'</p>';
					html+='</p>';
					html+='<p class="ltti-address">地址：'+shop[i].adressDetail+'</p>';
					html+='</div>';
					html+='</div>';
					html+='<div class="lt-bottom">';
					html+='<button type="button" class="mui-btn mui-tab-method"   state="2" >拒绝</button>';
					html+='<button type="button" class="mui-btn mui-btn-danger mui-tab-method"    state="1" >接受</button>';
					html+='</div>';
					html+='</div>';

					/*html+='<div class="listitem">';
					html+='<div class="lt-top">';
				//--	html+='<span class="lttit-name">'+shop[i].shopName;+'</span>';
					html+='<img src="'+shop[i].shopHeadImgPath+'" class="ltt-img" />';
					html+='<div class="ltt-info">';
					html+='<p class="ltti-top">';
					html+='<span class="lttit-name">'+shop[i].shopName+'</span>';
				//	html+='	<span class="lttit-name">欧阳盛通</span>';
				//	html+='<span class="lttit-tel">18524698675</span>';
					html+='<span class="lttit-tel">'+shop[i].mobile+'</span>';

					html+='</p>';
					html+='<p class="ltti-address">地址：'+shop[i].adressDetail+'</p>';
				//	html+='<p class="ltti-address">地址：广东省汕尾市XXXXXXXXXXX路23号</p>';
					html+='	</div>';
					html+='	</div>';
					html+='<div class="lt-bottom">';
					html+='<button type="button" class="mui-btn mui-tab-method"   state="2" >拒绝</button>';
					html+='<button type="button" class="mui-btn mui-btn-danger mui-tab-method"    state="1" >接受</button>';
					html+='</div>';
					html+='</div>';*/
				}
				$("#recruitlist").html(html);
			}else if(code==400){}
			//alert("没数据");
			else
				alert("error");
		});
	}
	init();
	//处理分销商的申请(type=2 拒绝    type=1   接收)
	$(document).on('click', ".mui-tab-method", function() {
		var seq = getCookie("SEQ");
		//var seq=3711843;
		var userName = getCookie("username");
		if(userSeq==0){
			location.href="../login.jsp";
			return;
		}
		//var distributorSeq = $(this).attr("distributorSeq");//获取分销商的seq
		//var masterSeq = $(this).attr("masterSeq");//获取服务商的seq
		var state = $(this).attr("state");//根据type值判断拒绝或接受    
		console.info(state);
		if(state==2){
			mui.toast("拒绝成功");
			tiaoZhuan();
		/*	$.ajax({
				url : "/localQuickPurchase/dApplicationAction/findDis",
				type : "post",
				data : {"distributorSeq":userSeq,"masterSeq":param.seq},
				async : false,
				dataType : "json",
				success : function(result) {
					var json = result.data;

					if(result.code==200){
						mui.toast("拒绝成功");
						recruiSeq.seq=param.seq;
						
						setTimeout(function(){
							recruiSeq.seq=param.seq;
							//location.reload();
							location.href="../login.jsp";
							//init();
						},1000);
						//init();
					}
					else{
						mui.toast(result.message);
					}
					tiaoZhuan();
				},
				error : function(error) {
					mui.toast("拒绝失败");
					tiaoZhuan();
				}
				
			})*/

			return;
		}

		
		$.ajax({
			url : "/localQuickPurchase/dApplicationAction/addDistributor",
			type : "get",
			data : {"masterSeq":param.seq,"distributorSeq":userSeq},
			async : false,
			dataType : "json",
			success : function(result) {
				var json = result.data;
				if(result.code==200){
					mui.toast("操作成功");
					//alert("操作成功");
					//刷新页面
					tiaoZhuan();
				/*	setTimeout(function(){
						recruiSeq.seq=param.seq;
						//location.reload();
						location.href="../login.jsp";
						//init();
					},1000);*/
				}else{
					mui.toast(result.message);
					tiaoZhuan();
				}
			},
			error : function(error) {
				mui.toast("服务器异常,操作失败");
			}
		})
	
	});
	
	
	function tiaoZhuan(){
		setTimeout(function(){
			//recruiSeq.seq=param.seq;
			//location.reload();
			//location.href="../login.jsp";
			//解决挑转到登录页在跳转个人中心页的问题
			var url=getMyJspUrl();
			window.top.location.href =url;
			//init();
		},1000);
	}

});