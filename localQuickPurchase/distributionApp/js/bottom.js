document.writeln("<style>");
document.writeln("/* 购物车数量样式 */");
document.writeln(".number {");
document.writeln("	display: inline-block;");
document.writeln("	font-size: 12px;");
document.writeln("	width: 0.8rem;");
document.writeln("	height: 0.8rem;");
document.writeln("	border-radius: 0.4rem;");
document.writeln("	background: red;");
document.writeln("	color: #fff;");
document.writeln("	vertical-align: top;");
document.writeln("	margin-left: -0.8rem;");
document.writeln("	padding: 0;");
document.writeln("}");
document.writeln("</style>");
document.writeln("<div id=\'hui-footer\'>");
document.writeln("<div class=\'bottom\'></div>");
document.writeln("</div>");

//以下代码解决底部栏一闪一闪的问题,4个变5个. 5个变4个
//首页和分类
var  clzssWidth = "w20";
if(!isLogin() || (isRoleConsumer())){
	clzssWidth = "w25";
}
var indexAndclasss = 	'<a class="'+clzssWidth+'" href="/localQuickPurchase/distributionVA/index" id="nav-home">'+
							'<img src="/localQuickPurchase/distributionApp/images/home_02.png" />'+
							'<div class="hui-footer-text">首页</div>'+
						'</a>'+
						'<a class="'+clzssWidth+'" id="nav-type" href="/localQuickPurchase/distributionVA/classify">'+
							'<img src="/localQuickPurchase/distributionApp/images/type_02.png" />'+
							'<div class="hui-footer-text">分类</div>'+
						'</a>';
//精品或店铺
var boutiqueOrStore = "";
//判断用户类型
if (isRoleVip()) {
	boutiqueOrStore = 	'<a class="'+clzssWidth+'" id="nav-home-seq">'+
							'<img src="/localQuickPurchase/distributionApp/images/shop_02.png">'+
							'<div class="hui-footer-text">店主精品</div>'+
						'</a>';
} else if (isRoleAgent() || isRoleDealer()) {
	boutiqueOrStore = 	'<a class="'+clzssWidth+'" href="/localQuickPurchase/distributionVA/store" id="nav-shop">'+
							'<img src="/localQuickPurchase/distributionApp/images/shop_02.png">'+
							'<div class="hui-footer-text">管理</div>'+
						'</a>';
}
//购物车和个人中心
var cartAndMy = '<a href="/localQuickPurchase/distributionVA/shopCar" class="'+clzssWidth+'"  id="nav-car">'+
					'<img src="/localQuickPurchase/distributionApp/images/car_02.png" />'+
					'<p class="number" id="number"></p>'+
					'<div class="hui-footer-text">购物车</div>'+
				'</a>'+//style="display: none;"
				'<a href="/localQuickPurchase/distributionVA/personal/index" class="'+clzssWidth+'" id="nav-mine">'+
					'<img src="/localQuickPurchase/distributionApp/images/mine_02.png" />'+
					'<div class="hui-footer-text">我的</div>'+
				'</a>';
var identify = getQueryString("identify");
//alert(identify);
if (identify != 1) {
	$(".bottom").append(indexAndclasss + boutiqueOrStore + cartAndMy);
}
goodsLocalItem();//按多规格统计购物车商品数量
var goodsLocalItems = getCookie("goodsLocalItems");//按多规格统计购物车商品数量
var number = document.getElementById("number");
if (goodsLocalItems > 0) {
	setCookie("goodsLocalItems", goodsLocalItems);
	number.innerHTML = goodsLocalItems;
} else {
	number.remove();
}
