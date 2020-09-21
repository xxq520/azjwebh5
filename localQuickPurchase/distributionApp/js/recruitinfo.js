$(function(){
	var masterseq=$("#masterSeq").val();
	if(masterseq == ''){
		return hui.toast("seq is null!");
	}
	var param={seq:masterseq };
	var recruiSeq ={}
	function init(){
		//初次加载待审核网络店主
		$.get("/localQuickPurchase/dshop/findShop",param,function(json){
			var code = json.code;
			if(code==200){
				var shop = json.data;
				var html="";
				for(var i=0;i<shop.length;i++){
					//if(shop[i].seq==recruiSeq.seq)
						//continue;
					html+='<div class="listitem">';
					html+='<div class="lt-top">';
					html+='<img src="/localQuickPurchase/distribution/img/head.png" class="ltt-img"  onerror="this.src=/localQuickPurchase/distribution/img/head.png"/>';
					html+='<div class="ltt-info">';
					html+='<p class="ltti-top">';
					var shopName = shop[i].userName;
					var shopName = ((shopName==null||shopName==''||"null"==shopName)?"":(shopName.substring(0,6)));
					html+='<span class="lttit-name">'+(shopName+"...")+'&nbsp;&nbsp;&nbsp;<span style="color:red;">邀请您成为网络店主</span></span>';
					html+='<p class="lttit-tel" style=" margin: 2px 0 0 0;">联系方式：'+shop[i].mobile+'</p>';
					html+='</p>';
					html+='<p class="ltti-address">地址：'+(shop[i].adressDetail == null ? "" : shop[i].adressDetail)+'</p>';
					html+='</div>';
					html+='</div>';
					html+='<div class="lt-bottom">';
					//html+='<button type="button" class="mui-btn mui-tab-method"   state="2" >拒绝</button>';
					html+='<button type="button" class="mui-btn mui-btn-danger mui-tab-method"    state="1" >接受</button>';
					html+='</div>';
					html+='</div>';
				}
				$("#recruitlist").html(html);
			}else if(code==400){}
			//alert("没数据");
			else
				hui.toast("error");
		});
	}
	init();
	//处理网络店主的申请(type=2 拒绝    type=1   接收)
	$(document).on('click', ".mui-tab-method", function() {
		if(seq == 0){
			//tiaoZhuan();
            loginPage();
			return;
		}
		var state = $(this).attr("state");//根据type值判断拒绝或接受    
		console.info(state);
		if(state==2){
			//mui.toast("拒绝成功");
			hui.toast("拒绝成功");
			tiaoZhuan();
			return;
		}

		$.ajax({
			url : "/localQuickPurchase/dApplicationAction/addDistributor",
			type : "get",
			data : {"masterSeq":param.seq,"distributorSeq":seq},
			async : false,
			dataType : "json",
			success : function(result) {
				var json = result.data;
				if(result.code==200){
	        		setCookie("distributorType",2,new Date());
					//	hui.toast("操作成功");
					hui.toast("操作成功");
					tiaoZhuan();
				}else{
					hui.toast(result.message);
				//	hui.toast(result.message);
					tiaoZhuan();
				}
			},
			error : function(error) {
				//hui.toast("服务器异常,操作失败");
				hui.toast("服务器异常,操作失败");
			}
		})
	
	});
	
	
	function tiaoZhuan(){
		setTimeout(function(){
			//解决挑转到登录页在跳转个人中心页的问题
			var url=getMyJspUrl();
			window.top.location.href =url;
			//init();
		},1000);
	}

});