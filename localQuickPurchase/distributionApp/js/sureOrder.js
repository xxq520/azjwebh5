var addressId;//收货地址Id
var logisticsPrice = 0.0;
var profitAmout = 0.0;
var profitAmount = 0.0;//订单优惠金额
var logisticsPriceAmonut = 0.0;
var profitAmountCount = 0.0;//订单优惠总金额
var totalFreigthTmpe = 0.0;//临时计算运费
var totalAmount = 0.0;//购物车计算总金额
var profitAmountCountTemp = 0.0;//订单优惠
var goodsPricesAmount = 0.0;//订单金额累加
var amtFullReduceAmount = 0.0; //点击使用优惠券价格
var couponUserId = null; //当前使用优惠劵的id
var shopCartsList = null; //购物车商品信息
var addressLocation = null; //当前收货地址经纬度
var countMark = 0;
var amtDiscount = 0; //优惠券折扣
var shopCartsLength = 0; //购物车商品长度
var freigthTmpeValue = 0.0; //总运费
var goodsCode = "";//商品code集合
var returnPrice = 1;
var minSpendMoney = 0.0//优惠券满减金额
var couponsType = 0;//优惠券类型
var supplierSeqs = []; //供应商SEQ  有传就表示顺丰发货
var totalFreigthForCount = 0.0;
var couponsId = null;
var balance = 0.0;
var discount = 0.0;
var couponsType = null;
var amount = 0.0;
var ifOverseas = 0;//境外商品标识 0:普通商品 1:境外商品
var autonymVerify = "";//境外商品实名验证
var freightModel = 0;

//console.log("当前登录用户的手机号: " + userName);
var entity = [];
// 判断是否是微信小程序支付
var isMiniprogramIs = false;
isMiniprogram().then(function (mini) {


    isMiniprogramIs = true
}).catch(function (err) {


});
//加载地址和购物车已选商品
 function init() {
     // 获取当前省份
     getLocation().then(function (locationCity) {
         $.ajax({
             type: "post",//定义提交的类型
             //contentType: "application/json;charset=utf-8",
             url: "/localQuickPurchase/dOrders/confirmOrderV1",
             dataType: "json",//设置返回值得类型
             data: {
                 "userName": userName,
                 "userSeq": seq,
                 province: locationCity.province,
                 "couponsType": couponsType,
                 "from": "h5"
             },//province 省份
             traditional: true,
             async: false,//是否异步请求，false为同步
             success: function (data) {//成功返回值执行函数
                 if (data.code == 200) {
                     hasFreightMark = data.data.hasFreight;
                     address = data.data.address;
                     var discount = data.data.discount;
                     if (discount != null && discount > 0.0) {
                         balance = data.data.balance;
                         discount = data.data.discount;
                         couponsId = data.data.couponsId;
                         discountMoneyForCount = discount;
                         coupons[0] = new Object();
                         coupons[0].couponsId = couponsId;
                         coupons[0].couponsPrice = discount;
                         coupons[0].couponsType = 5;
                         $('.coin-price').html(balance);
                         $('.wfymoney').html(discount);
                         $('#wfy').show();
                     }
                     if (address != null) {
                         addressLocation = address.tipLocation;
                     }
                     entity = data.data.idAndSeqs;
                     logisticsPriceAmonut = data.data.dCart.totalFreigth;
                     totalAmount = data.data.dCart.totalAmount;
                     profitAmountCount = data.data.dCart.discountsTotalAmount;
                     //计算结算中的总金额数
                     shopCartsList = data.data.dCart.shopCarts;
                     shopCartsLength = shopCartsList.length;
                     amount = numSub(totalAmount, logisticsPriceAmonut);
                     for (var i = 0; i < shopCartsList.length; i++) {
                         var localItemsList = shopCartsList[i].localItems;
                         for (var j = 0; j < localItemsList.length; j++) {
                             var distributionPrice = localItemsList[j].distributionPrice;
                             var goodsCodeStr = localItemsList[j].goodsCode;
                             if (j == localItemsList.length - 1 && i == shopCartsLength - 1) {
                                 goodsCode = goodsCode + goodsCodeStr;
                             } else {
                                 goodsCodeStr = goodsCodeStr + ",";
                                 goodsCode = goodsCode + goodsCodeStr;
                             }
                             var quantity = localItemsList[j].quantity;
                             var goodPriceAmount = distributionPrice * quantity;
                             goodsPricesAmount = (parseFloat(goodsPricesAmount) + parseFloat(goodPriceAmount)).toFixed(2);
                             var dInvoice = localItemsList[j].invoice;//商品是否可以开发票
                             if (!dInvoice) {//不能开发票
                                 $(".invoiceLi").hide();//隐藏发票按钮
                             }
                             var ifOverseasValue = localItemsList[j].ifOverseas;//是否境外商品 1:是 0:不是
                             if (ifOverseasValue != null && ifOverseasValue == 1) {
                                 ifOverseas = ifOverseasValue;
                             }
                         }
                     }
                     var autonymVerifyValue = data.data.autonymVerify;
                     if (null != autonymVerifyValue) {
                         autonymVerify = autonymVerifyValue;
                     }
                     if (ifOverseas == 1) {
                         $(".autonymVerify").show();
                         $(".autonymVerifyValue").text(autonymVerify);//有效证件号
                     }
                     appendAddress(address);
                     appendCart(data.data.dCart);
                     if (isRoleConsumer() || isRoleVip()) {
                         $(".profit").hide();
                     } else {
                         $(".profit").show();
                     }
                 } else {
                     hui.toast("加载失败!");
                     //window.location.href = "/localQuickPurchase/distributionVA/shopCar/shopCar2";
                 }
             },
             error: function (jqXHR, textStatus, errorThrown) {
             }
         });
         var data = {};
         //用户seq
         data.userSeq = seq;
         //商品code
         data.goodsCodeList = goodsCode;
         //商品总价
         data.goodsPrice = parseFloat(amount);
         //有抵扣券的时候不展示优惠券
         if (couponsId == null) {
             $.ajax({
                 type: 'POST',
                 url: '/localQuickPurchase/couponCardBagAction/getCouponsForPay',
                 contentType: "application/json;charset=utf-8",
                 dataType: 'json',
                 data: JSON.stringify(data),
                 success: function (data) {
                     //模拟调用接口返回200
                     if (data.code == 200) {
                         var couponsList = data.data;
                         if (couponsList != null) {
                             var dataStr = couponsList.result;
                             dataStr = eval('(' + dataStr + ')');
                             var dataList = dataStr[1003].datas;
                             console.log(dataList);
                             if (dataList.length > 0) {
                                 var allPopInfo = "";
                                 for (var i = 0; i < dataList.length; i++) {
                                     var couponsTypeDesc = dataList[i].couponsTypeDesc;
                                     var couponsType = dataList[i].couponsType;
                                     var receiveSrc = dataList[i].receiveSrc;
                                     if (dataList[i].couponsStatus == "1") {
                                         var timeResult = handleCouponTime(dataList[i].valiDayStart, dataList[i].valiDayEnd);
                                         if (couponsType != null && couponsType == 4) {
                                             //该用户有可用优惠劵
                                             $(".showCoupon").css("display", "block");

                                             //弹出层赋值
                                             var balance = dataList[i].balance; //抵扣券剩零钱
                                             var amount = dataList[i].amount; //代金券金额
                                             var amtSub = dataList[i].amtSub; //代金券可用金额
                                             var couponsId = dataList[i].couponsId; //优惠券Id

                                             var popInfo = "<div class='couponInfo'>" +
                                                 couponsTypeDesc +
                                                 "<div class='comfirmBtn' onclick='select(this,\"" + receiveSrc + "\"," + couponsType + ")'></div> " +
                                                 "<div class = 'couponsUserId' style='display:none'>" +
                                                 couponsId +
                                                 "</div>" +
                                                 "<div class = 'couponsType' style='display:none'>" +
                                                 couponsType +
                                                 "</div>" +
                                                 "<div class='amtFullReduceAmount' style='display:none'>" +
                                                 amtSub +
                                                 "</div>" +
                                                 "</div> <hr class='blockLine'/>";

                                             allPopInfo += popInfo;
                                         }
                                         /*if(timeResult == 1){*/
                                         if (dataList[i].couponsType == 1) {
                                             //该用户有可用优惠劵
                                             $(".showCoupon").css("display", "block");
                                             //弹出层赋值
                                             var minSpendMoney = dataList[i].minSpendMoney; //满足多少
                                             var amtFullReduce = dataList[i].amtFullReduce//优惠金额
                                             var couponsType = dataList[i].couponsType//优惠券类型
                                             if (amtFullReduce == undefined || amtFullReduce == "") {
                                                 amtFullReduce = dataList[i].amtSub;
                                             }
                                             var discountInfo = "满" + minSpendMoney + "减" + amtFullReduce;
                                             var couponsUserId = dataList[i].couponsUserId; //优惠券Id

                                             var popInfo = "<div class='couponInfo'>" +
                                                 couponsTypeDesc +
                                                 "<div class='comfirmBtn' onclick='select(this," + receiveSrc + ")'></div> " +
                                                 "<div class = 'couponsUserId' style='display:none'>" +
                                                 couponsUserId +

                                                 "</div>" +
                                                 "<div class='amtFullReduceAmount' style='display:none'>" +
                                                 amtFullReduce +
                                                 "</div>" +
                                                 "<div class='minSpendMoney' style='display:none'>" +
                                                 minSpendMoney +
                                                 "</div>" +
                                                 "<div class='couponsType' style='display:none'>" +
                                                 couponsType +
                                                 "</div>" +
                                                 "</div> <hr class='blockLine'/>";
                                             allPopInfo += popInfo;

                                         } else if (dataList[i].couponsType == 2) {
                                             //该用户有可用优惠劵
                                             $(".showCoupon").css("display", "block");
                                             //弹出层赋值
                                             var amtFullReduce = dataList[i].amtFullReduce//优惠金额
                                             if (amtFullReduce == undefined || amtFullReduce == "") {
                                                 amtFullReduce = dataList[i].amtSub;
                                             }

                                             var discountInfo = "立减" + amtFullReduce;
                                             var couponsUserId = dataList[i].couponsUserId; //优惠券Id
                                             var popInfo = "<div class='couponInfo'>" +
                                                 couponsTypeDesc +
                                                 "<div class='comfirmBtn' onclick='select(this," + receiveSrc + ")'></div> " +
                                                 "<div class = 'couponsUserId' style='display:none'>" +
                                                 couponsUserId +
                                                 "</div>" +
                                                 "<div class = 'couponsType' style='display:none'>" +
                                                 couponsType +
                                                 "</div>" +
                                                 "<div class='amtFullReduceAmount' style='display:none'>" +
                                                 amtFullReduce +
                                                 "</div>" +
                                                 "</div> <hr class='blockLine'/>";
                                             allPopInfo += popInfo;
                                         }

                                         if (shopCartsLength == 1) {
                                             // if(dataList[i].couponsType == 3){
                                             //     //该用户有可用优惠劵
                                             //     $(".showCoupon").css("display","block");
                                             //     //弹出层赋值
                                             //     var amtFullReduce = dataList[i].amtFullReduce//优惠金额
                                             //     if(amtFullReduce == undefined || amtFullReduce == ""){
                                             //         amtFullReduce = dataList[i].amtSub;
                                             //     }
                                             //
                                             //     var amtDiscount = dataList[i].amtDiscount; //折扣
                                             //     amtDiscount = (parseFloat(amtDiscount) / parseFloat(10)).toFixed(1);
                                             //     var discountInfo = amtDiscount+"折优惠";
                                             //     var couponsUserId = dataList[i].couponsUserId; //优惠券Id
                                             //     var popInfo = "<div class='couponInfo'>"+
                                             //         couponsTypeDesc +
                                             //         "<div class='comfirmBtn' onclick='select(this,"+receiveSrc+")'></div> "+
                                             //         "<div class = 'couponsUserId' style='display:none'>" +
                                             //         couponsUserId +
                                             //         "</div>" +
                                             //         "<div class = 'couponsType' style='display:none'>" +
                                             //         couponsType +
                                             //         "</div>" +
                                             //         "<div class='amtDiscount' style='display:none'>" +
                                             //         amtDiscount +
                                             //         "</div>"+
                                             //         "</div> <hr class='blockLine'/>";
                                             //     allPopInfo +=  popInfo;
                                             // }
                                         }
                                         /*}*/
                                     }
                                 }

                                 if (allPopInfo != null && allPopInfo != "") {
                                     document.getElementById("closeBtn").innerHTML = allPopInfo;

                                 }
                             }
                         }
                     }
                 }

             });
         }


         //立即购买
         $(".showCoupon").click(function () {
             sltShow();
             $(".specBtn").show();
         });

         function sltShow() {
             $(".mask").fadeIn("slow");
             $(".popChose").css("bottom", 0);
         };

         $(".close").click(function () {
             $(".mask").css("display", "none");
             $(".popChose").css("bottom", -800);
         })

    //两时间大小比较

         function compareTime(startTime, endTime) {
             var startTimes = startTime.substring(0, 10).split('-');
             var endTimes = endTime.substring(0, 10).split('-');
             var startTime1 = startTimes[0] + '-' + startTimes[1] + '-' + startTimes[2] + startTime.substring(10, 19);
             var endTime1 = endTimes[0] + '-' + endTimes[1] + '-' + endTimes[2] + endTime.substring(10, 19);
             startTime1 = startTime1.replace(/-/g, "/");
             endTime1 = endTime1.replace(/-/g, "/");
             var thisResult = (Date.parse(endTime1) - Date.parse(startTime1)) / 3600;
             if (thisResult < 0) {
                 return 1;
             } else if (thisResult > 0) {
                 return -1;
             } else if (thisResult == 0) {
                 return 0;
             } else {
                 return '异常';
             }
         }

         //获取当前时间
         function getNowFormatDate() {
             var date = new Date();
             var seperator1 = "-";
             var seperator2 = ":";
             var month = date.getMonth() + 1;
             var strDate = date.getDate();
             if (month >= 1 && month <= 9) {
                 month = "0" + month;
             }
             if (strDate >= 0 && strDate <= 9) {
                 strDate = "0" + strDate;
             }
             var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                 + " " + date.getHours() + seperator2 + date.getMinutes()
                 + seperator2 + date.getSeconds();
             return currentdate;
         }

         //判断当前优惠劵是否处于时间范围内
         function handleCouponTime(startTime, endTime) {
             var nowTime = getNowFormatDate();
             var result1 = compareTime(startTime, nowTime);
             var result2 = compareTime(nowTime, endTime);
             if (result1 == -1 && result2 == -1) {
                 return 1;
             } else {
                 return -1;
             }
         }
     })
 }
//百业惠盟金币的选中事件
function changeStatus(ev){
    $(ev).toggleClass('checkboxchecked');
    //有选中的时候
    if($(ev).hasClass('checkboxchecked')){
        couponsType = 5;
        countType = 5;
        init();
        expressSelect();
        $(ev).attr("src","/localQuickPurchase/coupons/images/choose.png");
    } else {
        couponsType = 3;
        countType = 3;
        init();
        expressSelect();
        coupons = [];
        discountMoneyForCount = null;
        $(ev).attr("src","/localQuickPurchase/coupons/images/cho0se2.png");
    }
}
//append地址
function appendAddress(address) {
	if (address != null) {
		addressId = address.shippingAddressId;
		var shipInfo = address.shippingName + "(" + address.shippingTelephone + ")";
		var addressInfo = "收货地址: " + getAddressStr(address.tipName, address.address);
		$(".userinfo").html(shipInfo + '<i class="redico">默认信息</i>');	//收货信息
		$(".useraddress").html(addressInfo);	//详细地址
		if(judgeTipProvinceOld(address.tipProvince)){
			hui.confirm("您的收货地址不完整,请重新填写!",[ '取消', '确认' ],function() {
				window.location.href = "/localQuickPurchase/generalStore/html/address.jsp";
			});
			judgeTipProvince = true;
			return;
		};
	} else {
		$(".userinfo").html("请先设置默认地址");	//收货信息
	}
}

//append购物车已选商品
function appendCart(dCart) {
    totalFreigthTmpe = 0.0;
	var shopCarts = dCart.shopCarts;
	//profitAmountCountTemp = dCart.dCart;
	// 当前购买商品展示 多个商品展示 多个不同供应商商品展示
	var manyGoods = "";
	for (var i = 0; i < shopCarts.length; i++) {
        var shopListStr = "";
		var localItems = shopCarts[i].localItems;
        freightModel = shopCarts[i].freight;
		if (shopCarts[i].freight==-1){
            shopCarts[i].freight = 0;
            hui.alert(shopCarts[i].ordinaryMsg||"超出可配送区域，请修改收货地址");
            $(".paylayer .J-pay-but").removeClass("hui-danger");
            $(".paylayer .J-pay-but").css({background:"#ccc",border:"1px solid #ccc"});
		} else {
            $(".paylayer .J-pay-but").addClass("hui-danger");
            $(".paylayer .J-pay-but").css({background:"##EF4F4F",border:"1px solid ##EF4F4F"});
        }
		if (localItems != null && localItems.length > 0) {
		    var shqshopping = '';
            shqshopping += '<div class="shqshopping">' +
                '                <div class="spn">' +
                '                    <div class="spa_img">\n';
            if(shopCarts[i].shopName!="爱之家自营"){
                // shqshopping+=  '<img src="'+shopCarts[i].shopPictureName+'" alt=""></div>';
                shqshopping+=  '<img src="/localQuickPurchase/distributionApp/images/icon_1.png" alt=""></div>';
                shqshopping+=   '<a href="'+shopCarts[i].shopUrlName+'"><div>'+shopCarts[i].shopName+'</div></a>';
                shqshopping+= ' <div class="more"><a class="shopLists" href="'+shopCarts[i].shopUrlName+'"></a></div>';
            }else{
                shqshopping+=  '<img src="/localQuickPurchase/distributionApp/images/icon_logo.png" alt=""></div>';
                shqshopping+=   ' <div>'+shopCarts[i].shopName+'</div>';
            }

            $(".shopList").append(shqshopping);
            shopListStr += foreachShopCart(shopCarts[i], localItems,i);
            shopListStr+='</div></div>';
			/*if(countMark == 0){
				var couponInfo = '<div class="priceItem showCoupon" style="display:none" <!--onclick="showCoupon()"-->'+
									'<span class="itemL">优惠券</span> <span class="itemr red couponDiscount">></span>'+
								'</div>'+
								'</div>';

						shopListStr = shopListStr + couponInfo;
						countMark++;
			}*/
			// shopListStr +="</div></div>";
            manyGoods += shopListStr;

            if(null != ifOverseas && 1 == ifOverseas){
            	$('.tariffFee').show();
            }
		}
	}
	// 将拼接好的商品展示在页面
    $(".shopList").html(manyGoods);
	// 绑定运费点击事件
    expressSelect();
	$(".pricestop").html("实付金额:&yen;" + totalAmount.toFixed(2));
	$(".pricesCount").html("总优惠:&yen;" + profitAmountCount.toFixed(2));
	//$(".pricesbot").html("总运费(￥"+ logisticsPriceAmonut +")");
	$(".pricesbot").html("总运费(￥"+ totalFreigthTmpe.toFixed(2) +")");
	$(".pricesCount .pricesbot").html("总运费(￥"+ totalFreigthTmpe.toFixed(2) +")");
}

//循环购物车商品,然后返回string
function foreachLocalItems(localItems) {
	var goodsList = "";
	var countMark = 0;
	for (var y = 0; y < localItems.length; y++) {
		console.info(localItems[y]);
		var goodsPirce = localItems[y].distributionPrice;
		var logisticsPrice = localItems[y].logisticsPrice;
		var platformPrice = localItems[y].platformPrice;
		var distributionPrice = localItems[y].distributionPrice;
		var isDistrbutionGoods = localItems[y].isDistrbutionGoods;
		var isDistrbutionGoods = localItems[y].isDistrbutionGoods;
		var quantity = localItems[y].quantity;
		
		var distributionProfit = localItems[y].distributionProfit;//分销商佣金
		var profitPrice = localItems[y].profitPrice;//代理商佣金
		var seckillPrice = localItems[y].seckillPrice;//秒杀价格
		var isActivityGoods = localItems[y].isActivityGoods;//标识是什么商品 --- "1":秒杀商品 ; "0":普通商品
		var activityState = localItems[y].activityState;//"秒杀商品"的上下架状态 -- 3:上架 ; 4:下架

		//下单价格
		var profit;
		if(distributionProfit != null && distributionProfit > 0.0 && profitPrice != null && profitPrice > 0.0) {
			//下单价格
			if (isActivityGoods != null && isActivityGoods == "1") {//秒杀商品下单计价方式,如下:
				if (isRoleAgent()) {
					profit = numSub(seckillPrice,distributionProfit);
				} else if (isRoleDealer()) {
					profit = numSub(seckillPrice,numAdd(distributionProfit,profitPrice));
				} else {
					profit = seckillPrice;
				}
			} else {//普通商品下单计价方式,如下
				if(isRoleAgent()) {
					profit = numSub(distributionPrice, distributionProfit);
				} else if(isRoleDealer()) {
					profit = numSub(distributionPrice,numAdd(distributionProfit,profitPrice));
				} else {
					profit = distributionPrice;
				}
			}
		}

		//已优惠金额
		if (isActivityGoods != null && isActivityGoods == "1") {
			profitAmount = numMulti(numSub(seckillPrice,profit),quantity);
		} else {
			profitAmount = numMulti(numSub(distributionPrice,profit),quantity);
		}
		var goodsSku = localItems[y].goodsSku;

		entity[y] = new Object();
		entity[y].preferentialHowMany = profitAmount;
		entity[y].goodsSku = goodsSku;

		//原价总金额
		var goodsPrices = goodsPirce*quantity;
		//优惠劵弹出选项判断
		console.info("下单价格 : "+profit);
		profitAmout += profit*quantity+logisticsPrice;
		goodsList += '<div class="goodsItem">';
		goodsList += '<div class="itemImg"><img src="'+ localItems[y].imgUrl +'"></div>';
		goodsList += '<div class="itemInfo">';
		goodsList += '<p class="infoTit">'+ localItems[y].goodsName +'</p>';
				                //'<p class="infoSpecificat">规格:500ML×24</p>'+
		goodsList += '<p class="infoNum">数量:'+ localItems[y].quantity +'</p>';
		if (isActivityGoods != null && isActivityGoods == "1") {
		var seckillPrices = seckillPrice*quantity;	
		goodsList += '<p class="infoPrice">秒杀价:&yen;'+ seckillPrices.toFixed(2) +'</p>';
		} 
		goodsList += '<p class="infoPrice">原价:&yen;'+ goodsPrices.toFixed(2) +'</p>';
		//goodsList += '<p class="infoPrice profit">已优惠:&yen;'+ profitAmount.toFixed(2) +'</p>';
		// goodsList += '<p class="infoPrice profit">已优惠:&yen;'+ (localItems[y].goodsDiscountsAmount).toFixed(2) +'</p>';
		goodsList += '<p class="infoPrice profit">优惠金额:&yen;'+ (localItems[y].goodsDiscountsAmount).toFixed(2) +'</p>';
		goodsList += '<input type="hidden" name="logisticsPrice" class="logisticsPrice" value="'+ logisticsPrice +'">';
		goodsList += '<input type="hidden" name="profit" class="profit" value="'+ profit +'">';
		goodsList += '</div>';
		goodsList += '</div>';
	}
	return goodsList;
}

//循环购物车商品,然后返回运费
function foreachlogisticsPrice(localItems) {
	var logisticsPrice = 0.0;
	for (var y = 0; y < localItems.length; y++) {
		logisticsPrice += parseFloat(localItems[y].logisticsPrice);
	}
	return logisticsPrice;
}

//循环购物车商品,然后返回总金额
function foreachAmount(localItems) {
	var logisticsPrice = 0.0;
	var goodsAmount = 0.0;
	for (var y = 0; y < localItems.length; y++) {
		console.info(localItems[y]);
		//logisticsPrice += parseFloat(localItems[y].logisticsPrice);
		goodsAmount += parseFloat(localItems[y].goodsAmount);
	}
	var amount = parseFloat(goodsAmount/* + logisticsPrice*/).toFixed(2);
	return amount;
}

//循环购物车店家,然后返回string
function foreachShopCart(shopCart, localItems,index) {
	var shopAmount = shopCart.shopAmount;
	var tariffFee = shopCart.tariffFee;
	shopAmountValue = shopCart.shopAmount.toFixed(2);
	console.info(shopCart);
	//var freigthTmpe = foreachlogisticsPrice(localItems);
	var freigthTmpe = shopCart.freight;
	freigthTmpeValue = foreachlogisticsPrice(localItems).toFixed(2);
	//profitAmountCountTemp += shopCart.shopDiscountsAmount;
		var shopList = '<div class="goodsInfo">';

		 /*   shopList += '<div class="shqshopping">\n' +
                '                <div class="spn">\n' +
                '                    <div class="spa_img">\n';
            shopList+=  '<img src="'+shopCart.shopPictureName+'" alt=""></div>';
            shopList+=   ' <div>'+shopCart.shopName+'</div>\n';
        if(shopCart.shopName!="爱之家自营"){
            shopList+= ' <div class="more"><a class="shopList" href="'+shopCart.shopUrlName+'"></a></div>';
        }
        shopList+='</div></div>';*/
        shopList+=foreachLocalItems(localItems)+
							'<div class="goodsPs">'+
								'<span class="psTit">备注:</span>'+
								'<p class="psCon" id="'+ shopCart.supplierSeq +'">'+
									'<input style="width:100%;padding: 0;"  placeholder="不接受指定快递，特殊需求请求联系卖家(20字)" class="psCon" maxlength=20/>'+
								'</p>'+
							'</div>'+
						'<div class="goodsPrices">'+						
							'<div class="priceItem">'+
								'<span class="itemL">商品金额</span> <span class="itemr">&yen;'+  shopAmount.toFixed(2)+'</span>'+
							'</div>'+
							'<div class="statement-item express" value="'+index+'">'+
								'<span class="s-txt" id="logisticsType'+index+'">运费</span>'+
								'<span class="s-cont"> <i>&yen;</i><em'+
									'class="good-freight" id="freight'+index+'">'+ freigthTmpe +'</em><i class="rightIcon">&gt;</i>'+
								'</span>'+
							'</div>'+
							//运费选择
							'<div class="expressFee-mask" supplierSeq="'+ shopCart.supplierSeq +'" style="display:none">'+
								'<div>'+
									'<p class="expressFee"><span class="nosf">配送费(运费:￥'+ shopCart.freight +')</span><span class="select-btn selected" mask="'+index+'"></span></p>'+
									'<p class="expressFee"><span class="sf" sfFreight="'+ shopCart.sfFreight +'">顺丰速运(运费:￥'+ shopCart.sfFreight +')</span><span class="select-btn" mask="'+index+'"></span></p>'+
									'<p class="cancel-btn">取消</p>'+	
								'</div>'+	
							'</div>'+
							'<div class="priceItem tariffFee" style="display: none">'+
							'<span class="itemL">进口税</span> <span class="itemr red shopTotalAmount" id="shopTotalAmount'+index+'">&yen;'+tariffFee +'</span>'+
							'</div>'+
							'<div class="priceItem">'+
								'<span class="itemL">合计金额</span> <span class="itemr red shopTotalAmount" id="shopTotalAmount'+index+'">&yen;'+(shopAmount+freigthTmpe).toFixed(2) +'</span>'+
							'</div>';
	totalFreigthTmpe += freigthTmpe;
	return shopList;
}

//获取提交订单参数
function getSubmitOrderParme() {
	var userSeq = seq;
	var dovo = {};
	dovo.seq = userSeq;
	dovo.userName = userName;
	dovo.addressId = addressId;
	dovo.remarkAndSeq = getRemarkAndSeq();
	
	dovo.idAndSeqs = JSON.parse(JSON.stringify(entity));
	dovo.preferentialHowMany = profitAmount;
	dovo.coupons = coupons;
	dovo.couponMoney = discountMoneyForCount;
	dovo.amtDiscount = amtDiscount;
	dovo.totalFreigthTmpe = totalFreigthTmpe;
	dovo.invoice = invoice;
	dovo.minSpendMoney = minSpendMoney;
	dovo.couponsType = couponsType;
	dovo.supplierSeqs = getSupplierSeqs();
	dovo.autonymVerify = autonymVerify;
    dovo.from = isMiniprogramIs ? "smallProgram" : "h5";
	return dovo;
}

//获取remarkAndSeq
function getRemarkAndSeq() {
	var remarkAndSeqs = [];
	$(".goodsInfo").each(function(ine, obj) {
		var remarkAndSeq = {};
		var $psCin = $(this).find(".goodsPs").children(".psCon");
		remarkAndSeq.remark = $psCin.children("input").val();
		remarkAndSeq.supplierSeq = $psCin.attr("id");
		console.log(remarkAndSeq.remark);
		console.log(remarkAndSeq.supplierSeq);
		remarkAndSeqs.push(remarkAndSeq);
	});
	console.log(remarkAndSeqs);
	return remarkAndSeqs;
}


function submitOrder(userLocation,localServerCenterSeq){
		console.log("当前收货地址经纬度:"+userLocation+"------------"+"线下服务中心seq:"+localServerCenterSeq);
		//判断当前代理商是否属于线下服务中心
		$.ajax({
			type : "post",	//定义提交的类型9
			url : "/localQuickPurchase/shopper/isPartner",
			async : false,
			data : {
				"seq" : localServerCenterSeq
			},
			success : function(data) {
				if(data.code == 200){
					if(data.data == true){
						isAgent = true;
					}
				}
			}
			})
			console.log("isAgent="+isAgent);
		
		//如果该商品为百货分销推送商品且代理商为线下服务中心
		if(isAgent == true){	
		
			//获取线下服务中心信息
			$.ajax({
				url: '/localQuickPurchase/homePageIntegrationAction/findShopInfoBynbh',
				type: 'post',
				async : false,
				data: {
					"seq" : localServerCenterSeq
				},
				success : function(data){
					console.log(data);
					if(data.code == 200){
						//为线下服务中心赋值
						var lat = data.data.shopInfo.lat;
						var lng = data.data.shopInfo.lng;
						serverLocation = lat+","+lng;
						console.log("线下服务中心经纬度坐标------>"+serverLocation);
						
						//为线下服务中心服务范围赋值
						var scope = data.data.serverScope;
						serverScope = scope;
						console.log("线下服务中心的服务范围为----->"+serverScope+"公里");
						
					}
				}
			})
			//获取用户收货地址(模拟)
			console.log("用户收货地址经纬度-------->"+userLocation);
			//var userLocation = "23.135506,113.434126";
			//获取线下服务中心地址(模拟)
			//var serverLocation = "23.158336,113.358407";
			$.ajax({
				url: '/localQuickPurchase/dOrders/countDistance',
				type: 'post',
				async : false,
				data: {
					"userLocation" : userLocation,
					"serverLocation" : serverLocation
				},
				success : function(data){
					console.info("当前收货地址距离线下服务中心"+data.data+"公里");
					console.log("//------判断线下服务中心商品和距离信息----------//");
					//模拟线下服务中心的服务半径
					//var serverScope = 10;
					if(data.data > serverScope){
						//超出服务范围
						hui.alert("超出当前服务中心服务范围,当前距离线下服务中心"+data.data+"公里,请重新选择地址");
					}

				}
			})
		}
}

/**
 * 获取选择顺丰发货的供应商seq
 */
function getSupplierSeqs() {
	var supplierSeqs = [];
	$('.sfFlag').each(function(){
		var supplierSeq = $(this).parents('div').parent('.expressFee-mask').attr('supplierSeq');
		supplierSeqs.push(supplierSeq);
	});
	//去重并返回
	return dedupe(supplierSeqs);
}

/**
 * 选择物流方式
 */
async function checkLogistics(cartIndex) {
    var locationCity = await getLocation();
    expressSelect()
	$.ajax({
		url : "/localQuickPurchase/dOrders/confirmOrderV1",
		dataType : "json",//设置返回值得类型
		data : {"userName" : userName, "supplierSeqs" : getSupplierSeqs(),province : locationCity.province,"userSeq" : seq,"couponsType" : couponsType,"from":"h5"},//province 省份
		traditional: true,
		sync : false,
		success : function (data) {
            checkLogisticsCallback(data,cartIndex);
        }
	});
	
}

/**
 * 切换物流类型的回调函数
 * @param {} data 
 */
function checkLogisticsCallback(data,cartIndex){
	if (data.code == 200) {
		var shopCarts = data.data.dCart.shopCarts;
		for (var i = 0; i < shopCarts.length; i++) {
            // 判断当前地址是否不在配送范围内

            freightModel = shopCarts[i].freight;
            // 根据配送范围修改按钮的状态
            if (shopCarts[i].freight==-1){
                hui.alert(shopCarts[i].ordinaryMsg||"超出可配送区域，请修改收货地址");
                $(".paylayer .J-pay-but").removeClass("hui-danger");
                $(".paylayer .J-pay-but").css({background:"#ccc",border:"1px solid #ccc"});
            } else {
                $(".paylayer .J-pay-but").addClass("hui-danger");
                $(".paylayer .J-pay-but").css({background:"##EF4F4F",border:"1px solid ##EF4F4F"});
            }
			$(".goodsPrices").each(function(i, obj){
				var yf; //运费
				var yfType; //运费类型
				//顺丰发货
				if (shopCarts[cartIndex].isSf) {
					yf = shopCarts[cartIndex].sfFreight;
					yfType = "顺丰速运";
					// 修改合计金额总计
                    $(".shopTotalAmount").text('¥'+(parseFloat(yf) + shopCarts[cartIndex].shopAmount).toFixed(2))
                    // -shopCarts[cartIndex].shopDiscountsAmount
				} else {
					//普通物流
					yf = shopCarts[cartIndex].freight<0?0:shopCarts[cartIndex].freight;
					yfType = "配送费";
                    $(".shopTotalAmount").text('¥'+(parseFloat(yf) + shopCarts[cartIndex].shopAmount).toFixed(2))
                    // -shopCarts[cartIndex].shopDiscountsAmount
				}
				//修改一个供应商的合计
				// var $express = $(this).find(".express");
				// $express.find("#logisticsType"+cartIndex+"").html(yfType);
				// $express.find("#freight"+cartIndex+"").html(yf+'<i class="rightIcon">&gt;</i>');
				//$(this).find(".priceItem").find(".shopTotalAmount").html("¥" + (parseFloat(yf) + shopCarts[i].shopAmount).toFixed(2));
                $("#logisticsType"+cartIndex+"").html(yfType);
                $("#freight"+cartIndex+"").html(yf+'<i class="rightIcon"></i>');
                $("#shopTotalAmount"+cartIndex+"").html("¥" + (parseFloat(yf) + shopCarts[cartIndex].shopAmount).toFixed(2));
				//修改总金额
				totalAmount = data.data.dCart.totalAmount; //重新赋值,拿最新的价格计算使用使用优惠券后的金额
				$(".pricestop").html("实付金额:&yen;" + data.data.dCart.totalAmount);
				$(".pricesCount").html("总优惠:&yen;" + data.data.dCart.discountsTotalAmount);
				//$(".pricesbot").html("总运费(￥"+ logisticsPriceAmonut +")");
				$(".pricesbot").html("总运费(￥"+ data.data.dCart.totalFreigth +")");
                totalFreigthForCount = data.data.dCart.totalFreigth;

                //选择运费后重新计算价格
                var comfirmBtnObj = $(".comfirmBtn")[0];
                // select(comfirmBtnObj);
			});
		}
	 }
}

function pro() {
    hui.prompt('请输入身份证号码或者有效证件号码',['取消','确认'],function (autonym) {
        /*判断是否是数字或者字母,而且位数不超过18位*/
        if (checkPassWord(autonym) && verifyAutonymVerify(autonym)) {
            autonymVerify = autonym;
            $(".autonymVerifyValue").text(autonym);//有效证件号
        }else {
            hui.alert("请输入有效的身份证号码或者有效证件号码")
        }
    })
}

