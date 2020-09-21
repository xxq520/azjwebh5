// document.writeln("<div id=\'hui-footer\'>");
// document.writeln("<div class=\'bottom\'></div>");
// document.writeln("</div>");

//以下代码解决底部栏一闪一闪的问题,4个变5个. 5个变4个
	//首页和分类
	var  clzssWidth = "w20";
	if(isRoleConsumer() || isRoleVip() || !isLogin()){
		clzssWidth = "w25";
	}
	var indexAndclasss = '<a class="'+clzssWidth+'" onclick = "jumpURL(1)" id="nav-home">'+
								'<img src="/common/images/home_02.png" />'+
								'<div class="hui-footer-text">首页</div>'+
							'</a>'+
							'<a class="'+clzssWidth+'" id="nav-type" onclick = "jumpURL(2)" >'+
								'<img src="/common/images/type_02.png" />'+
								'<div class="hui-footer-text">分类</div>'+
							'</a>';
	//精品或店铺
	var boutiqueOrStore = "";
	//判断用户类型
	if (isRoleAgent() || isRoleDealer()) {
		boutiqueOrStore = 	'<a class="'+clzssWidth+'" onclick="jumpURL(3)" id="nav-shop">'+
								'<img src="/common/images/shop_02.png">'+
								'<div class="hui-footer-text">管理</div>'+
							'</a>';
	}
	//购物车和个人中心
	var cartAndMy = /*'<a onclick = "jumpURL(4)" class="'+clzssWidth+'"  id="nav-car" style="display:none">'+
						'<img src="/common/images/car_02.png" />'+
						'<p class="number" id="number"></p>'+
						'<div class="hui-footer-text">购物车</div>'+
					'</a>'+//style="display: none;"*/
					'<a onclick = "jumpURL(4)" class="'+clzssWidth+'"  id="nav-circle">'+
					'<img src="/common/images/circleInfoDefault.png" />'+
					'<div class="hui-footer-text">发圈</div>'+
					'</a>'+//style="display: none;"
					'<a onclick = "jumpURL(5)" class="'+clzssWidth+'" id="nav-mine">'+
						'<img src="/common/images/mine_02.png" />'+
						'<div class="hui-footer-text">我的</div>'+
					'</a>';
	var identify = getQueryString("identify");
	if (identify != 1) {
		$("#hui-footer").append("<div class=\'bottom\'>" + indexAndclasss + boutiqueOrStore + cartAndMy + "</div>");
	}

	/*底部栏跳转的点击事件*/
	function jumpURL(index){

	    var url = "";
	    switch (index){
	        //首页
			case 1:
			    url = "/localQuickPurchase/distributionVA/index";
			    break;
			//分类
			case 2:
			    url = "/localQuickPurchase/distributionVA/classify/classify";
			    break;
			//会员中心
			case 3:
			    url = "/localQuickPurchase/distributionVA/store";
                // url = "/localQuickPurchase/distributionApp/html/store.html";
			    break;
			//发圈
			case 4:
                url = "/localQuickPurchase/distributionVA/propagandaCircle/propagandaCircleHomePage";
			    break;
			//我的个人中心
			case 5:
				if (isLogin()) {
                    url = "/upms/static/personalCenter.html";
                } else {
					url = "/upms/static/noLogin.html";
				}
			    break;
		};
	    // 判断当前环境
        var ua = window.navigator.userAgent.toLowerCase();
		if (ua.indexOf('micromessenger') == -1) {
            location.href = url
		} else {
            location.href = url+'?id='+Math.random(4);
		}
	    setCookie("categoryId","");
	}
