/*if (isRoleDealer()) {
 $(".store_invite").show(); //显示招募网络店主
 $(".shopOwner").hide();
 }*/
//$("#dis_invite").show(); // 显示招募分销商模块
//$("#dis_invite").show(); //显示招募普通代理商模块
$("#dis_invite").show();
if (isRoleAgent()) {
    $(".angets").show(); // 显示我的代理商
    //$(".angets").attr("css", "visibility: visible;"); // 显示我的代理商
} else if (isRoleDealer()) {
    $("#locale").show();
    $("#agent_invite").show(); //显示招募普通代理商模块
    $("#wholesaler").show(); //显示邀请批发商模块
}


/**
 * 分销商申请代理商的选择方式
 */
var choiceWayType = null;
/**
 * 统计店铺销售额和利润
 * @returns
 */
function initCount() {
	$.ajax({
		type : "get",//定义提交的类型
		//type : "post",//定义提交的类型
		//contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/earningsUpgradeLog/countEarningsAndShop",
        //url : "/localQuickPurchase/virtualShopAction/countShop",
		dataType : "json",//设置返回值得类型
		data : {
			"userSeq" : seq
            //"shopSeq" : seq
		},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数
			if (data.code == 200) {
				var stayEarnings = data.data.stayEarnings;//待收益
				var totalEconomize = data.data.totalEconomize;//累计收益
				var todayEarnings = data.data.todayEarnings;//今日收益
				var monthEarnings = data.data.monthEarnings;//本月收益
				var totalEarnings = data.data.totalEarnings;//累计收益
				var monthAmount = data.data.monthAmount;//本月销售额
                choiceWayType = data.data.choiceWayType;//分销商申请代理商的选择方式
				$(".stayEarnings").html(stayEarnings);//待收益
				$(".countEarningsAndShop").html(totalEconomize);//累计收益
				$(".todayEarnings").html(todayEarnings);//今日收益
				$(".monthEarnings").html(monthEarnings);//本月收益
				$(".totalEarnings").html(totalEarnings);//累计收益
				$(".orderNum").html(data.data.orderNum);//今日订单数量
				$(".monthAmount").html(monthAmount);//本月销售额
				$(".vipNum").html(data.data.vipNum);//VIP人数
				$(".dsitrPv").html(data.data.pvQuantity);//今日访问量
				
				/*var imgUrl = virtualShop.storeHeadImg;//头像地址
				if (virtualShop != null) {
					$("#dsitrPv").html(virtualShop.pv);
					if (imgUrl != null && imgUrl != "") {
						$(".pull-left #img").attr("src",imgUrl);
					}
					document.getElementById("shopNameId").innerHTML=virtualShop.storeName == null ? "未设置" : virtualShop.storeName;
					document.getElementById("shopSeqId").innerHTML=virtualShop.seq;
					document.getElementById("shopNameId").innerHTML=virtualShop.nickName == null ? "未设置" : virtualShop.storeName;
					if(isRoleAgent()){
						document.getElementById("shopType").innerHTML="网络店主";
					}else if(isRoleDealer()){
						document.getElementById("shopType").innerHTML="代理商";
					}
				}*/
			} else {
				hui.alert("店铺销售额等信息,统计异常!");
			}
			console.log(data.data);
			/*var swipe2 = new huiSwpie('#swipe2');
			swipe2.autoPlay = false;
			swipe2.run();*/
		},
		error: function (jqXHR, textStatus, errorThrown) {
           
        }
		
	});
	
	/*$.ajax({
		type : "post",//定义提交的类型
		//contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/dApplicationAction/findBySeq",
		dataType : "json",//设置返回值得类型
		data : {
			"distributorSeq" : seq
		},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				console.log(data.data);
				$("#dsitrPv").html(data.data.pvQuantity);
				if (data.data.shopImgUrl != null) {
					$(".pull-left img").arrt("src",data.data.shopImgUrl);
				}
				$(".shopName").html(data.data.shopName);
				$(".seq").html(data.data.distributorSeq);
			} else {
				console.log(data);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
           
        }
	});*/
}

//更新pv
function addPv() {
	$.ajax({
		type : "post",//定义提交的类型
		//contentType: "application/json;charset=utf-8",
		url : "/localQuickPurchase/dApplicationAction/updatePvQuantity",
		dataType : "json",//设置返回值得类型
		data : {
			"seq" : seq
		},
		async : true,//是否异步请求，false为同步
		success : function(data) {//成功返回值执行函数 
			if (data.code == 200) {
				console.log(data.data);
			} else {
				console.log(data);
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
           
        }
	});
}
//处理利润的小数点（原则：只舍不入）
function profitsPoint(profits){
	if(profits == null || profits == ""){
		return "0";
	}else{
		  var f = Math.floor(profits * 100) / 100;	 
		  var s = f.toString(); 
	      var rs = s.indexOf('.'); 
	      if (rs < 0) { 
	        rs = s.length; 
	        s += '.'; 
	      } 
	      while (s.length <= rs + 2) { 
	        s += '0'; 
	      } 
	      return s; 
	}
};

function hiddend(){
	$("html,body").css("overflow","visible");
    hui.dialogClose();
    $(".share-block").slideUp(200);
    $(".ewmcode").hide();
}

function goSalesManage(){
	window.location.href='/localQuickPurchase/distributionVA/store/salesmanagement';
 }

function myService(){
	$.post("/localQuickPurchase/dApplicationAction/findBySeq",{distributorSeq:seq},function(result){
		if(result.code == 200){
			var distrInfo = result.data.distrInfo;
			if(distrInfo != null && distrInfo.masterSeq != 0){
				//window.location.href="/localQuickPurchase/distributionVA/goodsManage/distributionSheves";
				window.location.href="/localQuickPurchase/distributionVA/goodsManage/servierGoods?masterSeq="+distrInfo.masterSeq;
				return;
			}
			hui.toast("你还没有代理商");
		}else{
			hui.toast("访问错误");
		}
		
		
	})
}

//查看累计收益
/*$('body').on('click','#earnings', function(){
    window.location.href="/localQuickPurchase/distributionVA/order/earningsDetail";
});*/
//查看累计收益
$('body').on('click','#earnings', function(){
    window.location.href="/localQuickPurchase/earnings/earnings.html?earningsType=4";
});
//查看待收收益
$('body').on('click','#stayEarnings', function(){
    window.location.href="/localQuickPurchase/earnings/earnings.html?earningsType=2";
});
//查看今日收益
$('body').on('click','#todayEarnings', function(){
    window.location.href="/localQuickPurchase/earnings/earnings.html?earningsType=3";
});
//查看本月收益
$('body').on('click','#monthEarnings', function(){
    window.location.href="/localQuickPurchase/earnings/earnings.html?earningsType=1";
});

/*function shareQRCode() {
	  $.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/localQuickPurchase/shareQRCode/storeVIPUrl',
		data : {
			distributorSeq : distributorSeq,
			state : 2
		},
		async : true,
		success : function(data) {
			url = data.data.URL;
		},
	});  
	return url;
} */

/*function getUrl(){
	if(type == 1){
		url = shareQRCode();
	}else if(type == 2){
		url = recruitUrl();
	}
	return url;
}

function recruitUrl(){
	var href = window.location.href;
	var contentUrl = href.substring(0,href.indexOf("distributionVA/"))+"distributionVA/recruitinfo?masterSeq="+seq;
	return contentUrl;
}*/
