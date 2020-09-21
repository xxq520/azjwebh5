var totalAmount = 0.00;//总金额
var countGoodsNum = 0;//商品总件数
var idAndSeqs = new Array();
//消费者2
var consumer = getCookie("consumer");
var userName = getCookie("userName");
var shareSeqCK = getCookie("shareSeq");
//按商品名称统计购物车个数
var goodsLocalItemsArr = new Array();
var goodsLocalItems;
var hrefUrl = "../static/noShopping.html";
//返回个人中心页面
function backPersonalCenter(){
	//window.location.href=_content+"/distributionVA/personal/index";
}

//初始化查询购物车
function initFindCart() {
	setCookie("idAndSeqs", "", 1);
	$.ajax({
		type : "post", // 定义提交的类型
		url : "/cart/cart/findCart",// 请求的地址
		dataType : "json", // 设置返回值得类型
		data : {
			"userName" : userName,
			"comefrom" : 1// 1 : 店下详情的购物车, 2 : 单独页面的购物车
		},
		async : false, // 是否异步请求，false为同步
		success : function(data) { // 成功返回值执行函数
			if (data.code == 1000) {
				totalAmount = data.data.totalAmount;
				countGoodsNum = data.data.countGoodsNum;
				var localItems = data.data.localItems;
				if(localItems == null){
					window.location.href=hrefUrl;
				}else{
					if (localItems.sizi < 1) {
						window.location.href=hrefUrl;
					}
					var goodsPiece = localItems.length;
					if (parseInt(goodsPiece) < 1) {
						window.location.href=hrefUrl;
					}
					goodsLocalItems = localItems.length;
					var number = document.getElementById("number");
					if(goodsLocalItems > 0){
						setCookie("goodsLocalItems",goodsLocalItems);
						number.innerHTML = goodsLocalItems;
					}else{
						number.remove();
					}
					$("#good_num").html("(" + countGoodsNum + ")");

					for (var y = localItems.length-1; y >= 0; y--) {
						goodsName = localItems[y].goodsName;
						distributionPrice = localItems[y].distributionPrice;
						quantity = parseInt(localItems[y].quantity);
						goodsAmount = localItems[y].goodsAmount;
						var goodsId = localItems[y].goodsId;
						//将商品的goodsId存放到数组中
						if(!ifArray(goodsLocalItemsArr,goodsId)){
							goodsLocalItemsArr.push(goodsId);
						}
						//alert(goodsLocalItemsArr.lenght);
						var shopSeq = localItems[y].shopSeq;
						var supplierSeq = localItems[y].supplierSeq;
						imgUrl = localItems[y].imgUrl;
						logisticsPrice = localItems[y].logisticsPrice;//运费
						salesVolume = localItems[y].salesVolume;//起卖量
						var goodsSku = localItems[y].goodsSku;//商品sku
						var goodsSpec = localItems[y].goodsSpec;//商品规格参数
						
						var goodsCode = localItems[y].goodsCode;//商品Code 唯一
						var factoryPrice = localItems[y].factoryPrice;//出厂价
						var cost_unit_price = localItems[y].cost_unit_price;//出厂单价
						var primitiveFactoryPrice = localItems[y].primitiveFactoryPrice;//原始出厂价
						var companyName = localItems[y].companyName;//
						var isActivityGoods = localItems[y].isActivityGoods;//标识是什么商品 --- "1":秒杀商品 ; "0":普通商品
						var seckillPrice = localItems[y].seckillPrice;//秒杀价格
						var activityState = localItems[y].activityState;//秒杀商品的上下架状态		3：上架 ; 4:下架
						if(salesVolume == null || salesVolume == 0){
							salesVolume = 1;
						}
						// 购物车店铺下的商品
						var items = '';
						//判断商品是否下架 商品状态: 0 正常, 1 不存在或者下架, 2 库存不足
						var goodsStatus = localItems[y].goodsStatus;
						if (isActivityGoods != null && isActivityGoods == "1") {
							if (activityState != null && activityState == 4) {
								items += '<li class="goods-list-item useless">';
							} else {
								items += '<li class="goods-list-item">';
							}
						} else {
							if(goodsStatus == 1 ){
								items += '<li class="goods-list-item useless">';
							}else{
								items += '<li class="goods-list-item">';
							}
						}
						
						items += '<div class="check-box" state="0" data-goodsAmount="'+goodsAmount+'" >';
						items += '<div class="btn-check"></div></div>';
						items += '<div class="good-content">';
						items += '<div class="good-pic" goodsid='+goodsId+' num='+isActivityGoods+'>';
						items += '<img src="' + imgUrl+ '" alt="" /></div>';
						items += '<div class="good-info">';
						items += '<h4 class="good-name overflow">' + goodsName+ '</h4>';
						/*items += '<div class="good-des">' + shopName+ '</div>';goodsPrice="'+goodsPirce+'"*/
						items +='<div class="spec">';
						items +='<span style="float: left;">规格：</span>';
						items +='<span style="float: left;">';
						items +='<span>'+(goodsSpec==null?"暂无规格信息":goodsSpec)+'</span>';
						items +='</span>';
						items +='</div>';
						items += '<div class="unit-price">';
						items += '<span style="float: left;">单价：</span>';
						items += '<span style="float: left;">';
						if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
							items += '￥<span>'+parseFloat(seckillPrice).toFixed(2)+'</span>';	
						} else {//分销价格
							items += '￥<span>'+parseFloat(distributionPrice).toFixed(2)+'</span>';
						}
						
						items += '</span>';
						items += '<span style="float: left;margin-left:15px">';
						items += '起卖量 :<span class="salesVolume">'+salesVolume+'</span>';
						items += '</span>';
						items += '</div>';
						items += '<div class="good-price-info" >';
						items += '<div class="good-num-handle" style="float: none;  width: 100%;">';
						if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
							items += '<div class="good-amount-box" style=" width: 50%;" ><span class="btn-muins" price = "'+seckillPrice+'">-</span>';
						} else {//分销价格
							items += '<div class="good-amount-box" style=" width: 50%;" ><span class="btn-muins" price = "'+distributionPrice+'">-</span>';
						}
						items += '<div class="amount-num">';
						items += '<input type="text" name="goodnum" class="amount-inp" readonly="readonly" maxlength="3" value="'+ quantity + '"/></div>';//readonly="readonly"
						items += '<input type="hidden" class="quantity" value="'+ quantity + '">';// 数据库查出的初始值
						items += '<input type="hidden" name="goodsId" class="goodsId" value="'+ goodsId + '">';
						items += '<input type="hidden" name="logisticsPrice" class="logisticsPrice" value="'+ logisticsPrice + '">';
						items += '<input type="hidden" name="shopSeq" class="shopSeq" value="'+ shopSeq + '">';
						items += '<input type="hidden" name="userName" class="userName" value="'+ userName + '">';
						items += '<input type="hidden" name="supplierSeq" class="supplierSeq" value="'+ supplierSeq + '">';// 供应商seq
						items += '<input type="hidden" name="totalAmont" class="totalAmont" value="'+ totalAmount +'">';// 总金额
						items += '<input type="hidden" name="goodsSku" class="goodsSku" value="'+ goodsSku +'">';// sku
						items += '<input type="hidden" name="goodsSpec" class="goodsSpec" value="'+ goodsSpec +'">';//规格 
						
						items += '<input type="hidden" name="goodsCode" class="goodsCode" value="'+ goodsCode +'">';//goodsCode 
						items += '<input type="hidden" name="factoryPrice" class="factoryPrice" value="'+ factoryPrice +'">';///出厂价 
						items += '<input type="hidden" name="cost_unit_price" class="cost_unit_price" value="'+ cost_unit_price +'">';//出厂单价
						items += '<input type="hidden" name="primitiveFactoryPrice" class="primitiveFactoryPrice" value="'+ primitiveFactoryPrice +'">';//原始出厂价
						items += '<input type="hidden" name="companyName" class="companyName" value="'+ companyName +'">';//供应商名称
						items += '<input type="hidden" name="isActivityGoods" class="isActivityGoods" value="'+ isActivityGoods +'">';//供应商名称
						items += '<input type="hidden" name="seckillPrice" class="seckillPrice" value="'+ seckillPrice +'">';//供应商名称
						items += '<input type="hidden" name="activityState" class="activityState" value="'+ activityState +'">';//供应商名称
					
						/*items += '<input type="hidden" class="shopAmount" value="'+ shopAmount + '">';// 整个购物车总金额
						 */
						if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
							items += '<span class="btn-add" price = "'+seckillPrice+'" >+</span></div></div>';	
						} else {//分销价格
							items += '<span class="btn-add" price = "'+distributionPrice+'" >+</span></div></div>';
						}
						items += '<div class="good-price color_red" style=" text-align: right; float: none;  width: 100%;">';
						if (isActivityGoods != null && isActivityGoods == "1") {//秒杀价格
							items += '<span class="rmb">￥</span><span class="price-num" name="gprice">'+  parseFloat(seckillPrice*quantity).toFixed(2) + '</span><span>元</span></div></div></div></div></li>';// onclick="addCart('+goodsId+','+shopSeq+')"
						} else {//分销价格
							items += '<span class="rmb">￥</span><span class="price-num" name="gprice">'+  parseFloat(distributionPrice*quantity).toFixed(2) + '</span><span>元</span></div></div></div></div></li>';// onclick="addCart('+goodsId+','+shopSeq+')"
						}
						$(".goods-list").append(items);
					}
				}
				//}
			} else {
				//alert("查询失败!");
			}
		}
	});
}

//购物车输入数量校验为
$('.amount-inp').keyup(function(){ 
	var c=$(this);
	console.info(c);
	if(/[^\d]/.test(c.val())){//替换非数字字符  
		var temp_amount=c.val().replace(/[^\d]/g,'');  
		$(this).val(temp_amount);  
	}
	var count = $(this).val();
	if(count==""){

	}else if(count==0){
		$(this).val(salesVolume); 
	}
});
/*失去焦点事件数量不能为空*///购物车输入数量校验
$('.body').blur(function(){ 
	var count = $(this).val();
	if(count==""){
		$(this).val(1);
	}
});

//点击结算
$("body").on('click', '#to_pay', function() {
	var list;
	var flagUseless = false;
	//var idAndSeqs =[];
	var data = {};
	var idAndSeqs =new Array();
	list = $(".checked");// 所有选择的商品
	$(".checked").each(function() {
		console.info($(this));
		if($(this).hasClass("useless")){
			var goodsName_useless = $(this).children(".good-content").children(".good-info").children(".good-name").html();
			hui.alert("["+goodsName_useless+"]已下架,请先移除!");
			flagUseless = true;
			return;
		}else{
			var data = {};
			var shopSeqD = $(this).children(".good-content")
			.children(".good-info").children(
			".good-price-info").children(
			".good-num-handle").children(
			".good-amount-box").find(
			"input[name='shopSeq']").val();
			var goodsIdD = $(this).children(".good-content")
			.children(".good-info").children(
			".good-price-info").children(
			".good-num-handle").children(
			".good-amount-box").find(
			"input[name='goodsId']").val();
			var supplierSeqD = $(this).children(".good-content")
			.children(".good-info").children(
			".good-price-info").children(
			".good-num-handle").children(
			".good-amount-box").find(
			"input[name='supplierSeq']").val();
			var userNameD = $(this).children(".good-content")
			.children(".good-info").children(
			".good-price-info").children(
			".good-num-handle").children(
			".good-amount-box").find(
			"input[name='userName']").val();
			var goodsSku = $(this).children(".good-content")
			.children(".good-info").children(
			".good-price-info").children(
			".good-num-handle").children(
			".good-amount-box").find(
			"input[name='goodsSku']").val();

			var goodsSpec = $(this).children(".good-content").children(".good-info").children(".good-price-info").children(
			".good-num-handle").children(".good-amount-box").find("input[name='goodsSpec']").val();
			var logisticsPrice = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='logisticsPrice']").val();
			
				var goodsCode = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='goodsCode']").val();
				
				var factoryPrice = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='factoryPrice']").val();
				
				var cost_unit_price = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='cost_unit_price']").val();
				
				var primitiveFactoryPrice = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='primitiveFactoryPrice']").val();
				
				var companyName = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='companyName']").val();
				
				var quantity = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='quantity']").val();
				
				var isActivityGoods = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='isActivityGoods']").val();
				
				var seckillPrice = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='seckillPrice']").val();
				
				var activityState = $(this).children(".good-content")
				.children(".good-info").children(
				".good-price-info").children(
				".good-num-handle").children(
				".good-amount-box").find(
				"input[name='activityState']").val();
				
//				console.info("======>" + goodsCode + ":" + factoryPrice + ":"  + cost_unit_price + ":" + primitiveFactoryPrice+":"+companyName);
			
				data.shopSeq=shopSeqD;
				data.goodsId=goodsIdD;
				data.userName=userNameD;
				data.supplierSeq=supplierSeqD;
				data.logisticsPrice=logisticsPrice;
				data.goodsSku=goodsSku;
				data.goodsSpec=goodsSpec;
				
				data.goodsCode = goodsCode
				data.factoryPrice = factoryPrice;
				data.cost_unit_price = cost_unit_price;
				data.primitiveFactoryPrice = primitiveFactoryPrice;
				data.companyName = companyName;
				
				if(shareSeqCK != null && shareSeqCK != "") {
					data.shareSeq=shareSeqCK;
				}
				data.isActivityGoods = isActivityGoods;
				data.seckillPrice = seckillPrice;
				data.activityState = activityState;
				
			console.info(goodsSku);
			console.info(goodsSpec);
			idAndSeqs.push(data);
		}
	});
	if(!flagUseless){
		if (idAndSeqs == null || idAndSeqs.length == 0) {
			return hui.alert("请先勾选要购买商品!");
		}
		//setCookie("idAndSeqs", JSON.stringify(idAndSeqs));
		//console.info(getCookie("idAndSeqs"));
		selectParam(idAndSeqs);
		console.log(idAndSeqs);
		window.location.href="/localQuickPurchase/distributionVA/submitOrder";
	}
});

//讲所选的商品参数传到后台
function selectParam(idAndSeqs) {
	$.ajax({
		type : "post",// 定义提交的类型
		url : "/cart/cart/selectParam",
		//traditional :true,
		contentType : "application/json;charset=utf-8",
		dataType : "json",// 设置返回值得类型
		data : JSON.stringify(idAndSeqs),
		async : false,// 是否异步请求，false为同步
		success : function(data) {// 成功返回值执行函数
			if (data.code == 1000) {
				
			} else {
				hui.toast("跳转失败,系统异常请稍后再试!");
			}
		}
	});
}

//清空购物车
function emptyCart(){
	$.ajax({
		type : "post",// 定义提交的类型
		url : "/cart/cart/emptyCart",
		//traditional :true,
		//contentType : "application/json;charset=utf-8",
		dataType : "json",// 设置返回值得类型
		data : {"userName" : userName},
		async : false,// 是否异步请求，false为同步
		success : function(data) {// 成功返回值执行函数
			if (data.code == 1000) {
//				/window.location.load();
				$(".goods-list").html("");
				initFindCart();// 重新加载购物车
			} else {
				hui.toast("操作失败!");
			}
		}
	});
}

//删除购物车商品
function deleteGoods(){
	var idAndSeqs =new Array();
	var list = $(".checked");// 所有选择的商品
	if (list.length == 0) {
		hui.toast("请选择商品!");
		return;
	}else{
		hui.confirm('确定删除选中的商品？', ['返回','确认'], function(){
			$(".checked").each(// 所有选择的商品
					function() {
						var shopSeqD = $(this).children(".good-content")
						.children(".good-info").children(
						".good-price-info").children(
						".good-num-handle").children(
						".good-amount-box").find(
						"input[name='shopSeq']").val();
						var goodsIdD = $(this).children(".good-content")
						.children(".good-info").children(
						".good-price-info").children(
						".good-num-handle").children(
						".good-amount-box").find(
						"input[name='goodsId']").val();
						var supplierSeqD = $(this).children(".good-content").children(".good-info").children(
						".good-price-info").children(".good-num-handle").children(
						".good-amount-box").find("input[name='supplierSeq']").val();

						var userNameD = $(this).children(".good-content")
						.children(".good-info").children(
						".good-price-info").children(
						".good-num-handle").children(
						".good-amount-box").find(
						"input[name='userName']").val();
						var goodsSku = $(this).children(".good-content")
						.children(".good-info").children(
						".good-price-info").children(
						".good-num-handle").children(
						".good-amount-box").find(
						"input[name='goodsSku']").val();
						var data = {};
						data.shopSeq=shopSeqD;
						data.goodsId=goodsIdD;
						data.userName=userNameD;
						data.goodsSku=goodsSku;
						if(supplierSeqD =="null"){
							supplierSeqD=0;
						}
						data.supplierSeq=supplierSeqD;
						idAndSeqs.push(data);
					});
			$.ajax({
				type : "post",// 定义提交的类型
				url : "/cart/cart/deleteGoods",
				traditional :true,
				contentType : "application/json;charset=utf-8",
				dataType : "json",// 设置返回值得类型
				data : JSON.stringify(idAndSeqs),
				async : false,// 是否异步请求，false为同步
				success : function(data) {// 成功返回值执行函数
					if (data.code == 1000) {
//						/window.location.load();
						$(".goods-list").html("");
						initFindCart();// 重新加载购物车
						$(".heji-num").html("0.00");
						findCheckboxList();
					} else {
						hui.toast("操作失败!");
					}
				}
			});
		});
	}			
}

//点击移除购物车商品
$("body").on('click','#btn_del',function() {
	//如果点了全选就清空购物车
	if($("#sel_all").hasClass("active")){
		emptyCart();
	}else{
		deleteGoods();
	}
});

//商品数量-1
$(document).on('click','.btn-muins',function() {//alert("111")
	var quantity = $(this).parent(".good-amount-box").find(
	"input[name='goodnum']").val(); // 当前输入框的数量
	var salesVolume =  $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").prev(".unit-price").find(".salesVolume").html();
	if (parseInt(quantity) <= parseInt(salesVolume)) {
		hui.alert("购买数量不能低于起卖量!");
		return;
	}else{
		$(this).parent(".good-amount-box").find("input[name='goodnum']").val(parseInt(quantity)-1);
		var $parent = $(this).parent(".good-amount-box");
		var count = parseInt(quantity)-1;
		$parent.find("input[name='goodnum']").val();

		var danjia = parseFloat($(this).attr("price")).toFixed(2);//单价

		var totalPrice = parseFloat(danjia * count).toFixed(2);//总价

		var $price = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").find(".good-price .price-num");
		$price.html(totalPrice);
		//ture 为被选中,false先中
		var flg = false;
		flg = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").parent(".good-info").parent(".good-content").parent(".goods-list-item").hasClass("checked");
	}
	var shopSeq = $(this).parent(".good-amount-box").find(
	"input[name='shopSeq']").val();
	var goodsId = $(this).parent(".good-amount-box").find(
	"input[name='goodsId']").val();
	var userName = $(this).parent(".good-amount-box").find(
	"input[name='userName']").val();
	var supplierSeq = $(this).parent(".good-amount-box").find(
	"input[name='supplierSeq']").val();
	var goodsSku = $(this).parent(".good-amount-box").find(
	"input[name='goodsSku']").val();
	var goodsSpec = $(this).parent(".good-amount-box").find(
	"input[name='goodsSpec']").val();
	var seckillPrice = $(this).parent(".good-amount-box").find(
	"input[name='seckillPrice']").val();
	var isActivityGoods = $(this).parent(".good-amount-box").find(
	"input[name='isActivityGoods']").val();
	console.info("goodsSku :" + goodsSku);
	var idAndSeq={
		userName:userName,
		goodsId:goodsId,
		shopSeq:parseInt(shopSeq),
		supplierSeq:parseInt(supplierSeq),
		goodsSku:goodsSku,
		goodsSpec:goodsSpec,
		isActivityGoods:isActivityGoods
	}
	$.ajax({
		type : "post",// 定义提交的类型
		url : "/cart/cart/sub",
		dataType : "json",// 设置返回值得类型
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify(idAndSeq),
		async : false,// 是否异步请求，false为同步
		success : function(data) {// 成功返回值执行函数
			if (data.code == 1000) {
				--countGoodsNum;
				console.log("countGoodsNum: " + countGoodsNum);
				$("#good_num").html("(" + countGoodsNum + ")");
				var amount = parseFloat($(".heji-num").html()).toFixed(2);
				if(flg){
					$(".heji-num").html(parseFloat(amount - danjia).toFixed(2));
				}
			} else {
				
			}
		}

	});
})

//商品数量+1
$(document).on('click','.btn-add',function() {
	var quantity = $(this).parent(".good-amount-box").find(
	"input[name='goodnum']").val(); // 当前输入框的数量
	if (parseInt(quantity) >= 999) {
		hui.alert("最大下单数为999!");
		return;
	}else{
		$(this).parent(".good-amount-box").find("input[name='goodnum']").val(parseInt(quantity)+1);
		var $parent = $(this).parent(".good-amount-box");
		var count = parseInt(quantity)+1;
		$parent.find("input[name='goodnum']").val();

		var danjia = parseFloat($(this).attr("price")).toFixed(2);
		var totalPrice = parseFloat(danjia * count).toFixed(2); //总价
		//console.info("totalPrice :" +totalPrice);
		var $price = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").find(".good-price .price-num");
		$price.html(totalPrice);

		//ture 为被选中,false先中
		var flg = false;
		flg = $(this).parent(".good-amount-box").parent(".good-num-handle").parent(".good-price-info").parent(".good-info").parent(".good-content").parent(".goods-list-item").hasClass("checked");
	}
	var shopSeq = $(this).parent(".good-amount-box").find("input[name='shopSeq']").val();
	var goodsId = $(this).parent(".good-amount-box").find("input[name='goodsId']").val();
	var userName = $(this).parent(".good-amount-box").find("input[name='userName']").val();
	var supplierSeq = $(this).parent(".good-amount-box").find("input[name='supplierSeq']").val();
	var goodsSku = $(this).parent(".good-amount-box").find("input[name='goodsSku']").val();
	var goodsSpec = $(this).parent(".good-amount-box").find("input[name='goodsSpec']").val();
	var isActivityGoods = $(this).parent(".good-amount-box").find("input[name='isActivityGoods']").val();
	var seckillPrice = $(this).parent(".good-amount-box").find("input[name='seckillPrice']").val();
	var activityState = $(this).parent(".good-amount-box").find("input[name='activityState']").val();
	var th = $(this);
	$.ajax({
		type : 'POST',
		dataType : 'json',
		contentType: "application/json;charset=utf-8",
		url : '/cart/cart/add',
		
		data : JSON.stringify({
			"supplierSeq" : parseInt(supplierSeq),
			"userName" : userName,
			"goodsId" : goodsId,
			"shopSeq" : parseInt(shopSeq),
			"goodsNum" : 1,// 默认为1
			"distributorType" : parseInt(distributorType),
			"sku" : goodsSku,
			"spec" : goodsSpec,
			"isActivityGoods" : isActivityGoods,
			"seckillPrice" : seckillPrice,
			"activityState" : activityState
		}),
		async : false,// 是否异步请求，false为同步
		success : function(data) {// 成功返回值执行函数
			if (data.code == 1000) {
				var amount = parseFloat($(".heji-num").html()).toFixed(2);
				++countGoodsNum;
				console.log("countGoodsNum: " + countGoodsNum);
				$("#good_num").html("(" + countGoodsNum + ")");
				if(flg){

					$(".heji-num").html((parseFloat(amount)+parseFloat(danjia)).toFixed(2));
				}
			} else if(data.code == 1002){
				hui.toast(data.data);
			} else {
				hui.toast("加入购物车失败");
			}
		}

	});
})

var pageIndex = 1;
hui.refresh('.goods-content', downMove);
hui.loadMore(listMove);
var isLoading = false;	
var first = true;	

//为你推荐列表
function listMove(){
	if(isLoading){
		return;
	}
	isLoading = true;
	$.ajax({ 
		type: "POST", 
		url : '/cart/cart/recommendShop', 
		data :{
			"pageIndex":pageIndex,
			"userType" : 1,
			"seq":seq,
			"userName":userName
		}, 
		async : true, 
		success :function(data) {
			if(data.code == 1000){
				console.info(data);
				var _html="";
				console.info(data);
				var goodsList =data.data;
				if(goodsList.length > 0){
					for(var i = 0 ; i < goodsList.length;i++){
						goodsName = goodsList[i].goodsName;
						var goodsId = goodsList[i].goodsId;
						var thumbnail = goodsList[i].thumbnail;//图片
						var goodsProStandard = goodsList[i].goodsProStandard;
						distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
						unit = goodsList[i].unit;
						_html+=' <div class="recommend-good-item">';
						_html+=' <div class="recommend-good-pic" >';//onclick="goodsDetail('+goodsId+')"
						_html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
						_html+=' <img src="'+thumbnail+'" alt="" /></div>';
						
						var presellType = goodsList[i].presellType;
						if(presellType != null && presellType == 1) {
							var endTime = goodsList[i].endTime;
							var date = Date.parse(new Date());
							if(endTime > date) {
								_html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;"><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
							} else {
								_html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
							}
						} else {
							_html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
						}
						
						_html+=' <div class="recommend-sale">';
						_html+=' <div class="recommend-good-price txt-red">';
						_html+=' <span class="rmb">￥</span>';
						_html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span></div>';
						_html+=' </div></div>';
					}
					$(".goods-content").append(_html);

					pageIndex++;
					hui.endLoadMore(false);
					isLoading = false;
				}else{
					hui.endLoadMore(true, '已经到头了...');
					return false;
				}
			}
		}, 
		error : function(err) { 
			//alert("网络错误"); 
		}
	});
};

//下拉加载....
function downMove(){
	hui.loading('加载中...');
	isLoading = true;
	$.ajax({ 
		type: "POST", 
		url : '/cart/cart/recommendShop', 
		data :{
			"pageIndex":pageIndex,
			"userType" : 1,
			"seq":seq
		}, 
		async : true, 
		success :function(data) {
			console.info(data);
			if(data.code == 1000){
				var _html="";
				var goodsList =data.data;
				for(var i = 0 ; i < goodsList.length;i++){
					goodsName = goodsList[i].goodsName;
					/*if(goodsName == null || goodsName == ''){
						 continue;
					 }*/
					var goodsId = goodsList[i].goodsId;
					var thumbnail = goodsList[i].thumbnail;//图片
					var goodsProStandard = goodsList[i].goodsProStandard;
					distributionPrice = parseFloat(getDistributionPrices(goodsProStandard)).toFixed(2);
					/*distributionPrice = parseFloat(goodsList[i].distributionPrice).toFixed(2);*/
					unit = goodsList[i].unit;
					_html+=' <div class="recommend-good-item">';
					_html+=' <div class="recommend-good-pic" >';//onclick="goodsDetail('+goodsId+')"
					_html+=' <input type="hidden" name="goodsId" class="goodsId" value="'+goodsId +'">';
					_html+=' <img src="'+thumbnail+'" alt="" /></div>';
					
					var presellType = goodsList[i].presellType;
					if(presellType != null && presellType == 1) {
						var endTime = goodsList[i].endTime;
						var date = Date.parse(new Date());
						if(endTime > date) {
							_html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;"><span style="color: red">(预售商品)</span>'+goodsName+'</div>';
						} else {
							_html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
						}
					} else {
						_html+=' <div class="recommend-good-name" style="-webkit-line-clamp: 1;">'+goodsName+'</div>';
					}
					
					_html+=' <div class="recommend-sale">';
					_html+=' <div class="recommend-good-price txt-red">';
					_html+=' <span class="rmb">￥</span>';
					_html+=' <span class="price-num">'+distributionPrice+'/'+unit+'</span></div>';
					_html+=' </div></div>';
				}
				pageIndex++;
				setTimeout(function(){
					$(".goods-content").append(_html);
					//结束刷新
					hui.endRefresh();
					//重置加载更多状态
					hui.resetLoadMore();
					hui.loading('加载中...', true);
					if(!first){
						hui.toast("下拉刷新成功");	            	
					}
					first = false;
				},500)
			}else{
				//结束刷新
				hui.endRefresh();
				hui.loading('加载中...', false);
			}
		}, 
		error : function(err) { 
			hui.alert("网络错误"); 
		}
	});
};

//单选商品
$(document).on("click",".check-box",function(){
	$(this).closest(".goods-list-item").toggleClass("checked");
	setBtn();
	if($(".goods-list-item.checked").length == $(".goods-list-item").length){
		$("#sel_all").addClass("active");
	}else{
		$("#sel_all").removeClass("active");
	}
	var state = $(this).attr("state");
	//console.info(state);
	if(state == "0"){ //选中
		var goodsAmount = parseFloat($(this).parent(".goods-list-item").children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
		console.info(goodsAmount);
		//var add_amount=parseFloat($(this)["0"].dataset.goodsamount);//得到当前的总额.toFixed(2)
		//var goodsAmount = parseFloat($(this).attr("goodsAmount"));
		var hejiPrice = parseFloat($(".heji-num").html());
		$(".heji-num").html((parseFloat(hejiPrice)+parseFloat(goodsAmount)).toFixed(2));
		$(this).attr("state","1");
	}else if(state == "1"){//取消
		var goodsAmount = parseFloat($(this).parent(".goods-list-item").children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
		console.info(goodsAmount);

		//var sub_amount = parseFloat($(this)["0"].dataset.goodsamount);//得到当前的总额.toFixed(2)
		//console.info($(this)["0"].dataset.goodsamount);
		//var goodsAmount = parseFloat($(this).attr("goodsAmount"));
		var hejiPrice = parseFloat($(".heji-num").html());//.toFixed(2)
		$(".heji-num").html((parseFloat(hejiPrice)-parseFloat(goodsAmount)).toFixed(2));
		$(this).attr("state","0");
	}
	findCheckboxList();
});

//全选
$("#sel_all").on("click",function(){	
	var $self = $(this)
	$self.toggleClass("active");
	console.info($self);
	$(".heji-num").html(totalAmount);
	if($self.hasClass("active")){
		$(".goods-list-item").addClass("checked");
		var shopAmount = 0 ;
		$(".goods-list-item").each(function(){
			shopAmount += parseFloat($(this).children(".good-content").children(".good-info").children(".good-price-info").children(".good-price").children(".price-num").html()).toFixed(2);
		});

		$(".heji-num").html(shopAmount);

		$(".goods-list-item").each(function(){
			$(this).children().attr("state","1");
		});
		var price = 0;
		$("span[name='gprice']").each(function(){
			price += parseFloat($(this).html());//.toFixed(2)
		});
		$(".heji-num").html(price.toFixed(2));
	}else{
		$(".goods-list-item").removeClass("checked");
		$(".goods-list-item").each(function(){
			$(this).children().attr("state","0");
		});
		$(".heji-num").html("0");
	}
	findCheckboxList();
	setBtn();
})

//商品详情
$('body').on("click",".recommend-good-pic",function(){
	/*if(isRoleAgent()){//登录的用户类型（1 普通用户,2 代理商,3 线下服务中心
		distributorSeq = seq;
	}else {
		distributorSeq = 0;
	}*/

	var goodsId = $(this).children(".goodsId").val();
	if(seq == null || seq == 0) {
		seq = 0;
	}
	//暂时默认取平台商品
	window.location.href="/goods/goods/goodsDetail/goodsDetail.html?goodsId="+goodsId+"&distributorSeq=0&shareSeq="+seq;
});

$('body').on("click",".good-pic",function(){
	/*if(isRoleAgent()){//登录的用户类型（1 普通用户,2 代理商,3 线下服务中心
		distributorSeq = seq;
	}else {
		distributorSeq = 0;
	}*/
	var goodsId = $(this).attr("goodsid");
	var isActivityGoods = $(this).attr("num");
	if(seq == null || seq == 0) {
		seq = 0;
	}
	//暂时默认取平台商品
	if (isActivityGoods != null && isActivityGoods == "1") {
		window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq;
	} else {
		window.location.href="/goods/goods/goodsDetail/goodsDetail.html?goodsId="+goodsId+"&distributorSeq=0&shareSeq="+seq;
	}
});

/**
 * 获取分销价
 * @returns
 */
function getDistributionPrices(data) {
	var distributionPrice = data[0].distributionPrice;
	if(distributionPrice == null) {
		var costPrice = (data[0].platformPrice*1.15).toFixed(2);;
		distributionPrice = (costPrice*1.2).toFixed(2);
	}
	return distributionPrice;
}

findCheckboxList();
function findCheckboxList(){
	var length = $(".check-box[state=1]").length;
	if(length <= 0 ){
		$("#btn_del").hide();
		$("#msg").show();
	}else {
		$("#msg").hide();
		$("#btn_del").show();
	}
}

//点击消息时间
$("#msg").click(function(){
	location.href = "/localQuickPurchase/distributionVA/customer/menu";
});
