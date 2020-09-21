var seq = getQueryString("seq");
var addressId = getQueryString("addressId");
var billHead = getQueryString("invoiceHead");
var billCont = getQueryString("invoiceContent");
var sku = getQueryString("sku");//商品规格对应的sku
var spec = getQueryString("spec");//商品规格
var isLocaleRecruitOrders = getQueryString("isLocaleRecruitOrders");//判断是什么商品 0 普通  1 现场招商
var freight=0;
var amount=0;
var addressObj=null;
var flag = false;	//防止或重复提交
// 模拟参数
var dGoodsId = getQueryString("goodsId");
var goodsNum = getQueryString("quantity");
var shareSeq = getQueryString("shareSeq");
if (shareSeq == null || shareSeq == "undefined") {
	shareSeq = 0;
}
var shopLats;
var shopLngs;
var isDistrbutionGoodsMark;
var addressId;
var isPlatform; //是否是平台商品
var profitPrice = 0.0;//优惠价格
var salePrice = 0.0;//下单价格
var profitMoney = 0.0; //下单总优惠价
var userLocation = ""; //用户收货地址经纬度
var serverLocation = "";//线下服务中心经纬度
var isAgent = false;//判断用户是否为伙伴代理商标识
var serverScope = "";//线下服务中心服务范围
var seckillPrice = 0.0;//秒杀价
var activityState;//秒杀状态 12 正常商品上下架	34 秒杀商品上下架
var isActivityGoods = getQueryString("isActivityGoods");//商品标识 == "1":秒杀商品;	"0":普通商品
var profitPrice = 0.0;//代理商佣金
var distributionProfit = 0.0;//分销商佣金
var judgeFlag = false; //偏远地区弹窗标识
var totalWeight; //总重量
var amtFullReduceOrPrice = 0.0; //未使用优惠劵前总价格
var couponAmount = 0.0; //点击使用优惠券价格
var couponUserId = null; //当前使用优惠劵的id
var localServerCenterSeq = null; //线下服务中心seq
var amtDiscount = 0; //优惠券折扣
var logisticsPricePointNew = 0.0;
var isSf = false; //true 顺丰发货
var sfFreight; //顺丰运费
var nosfFreight; //普通运费
var totalAmount; //计算  优惠后的价格 或  计算使用优惠券后的优惠价格
var amount;//角色下单总计 没有优惠的价格
var goodsTotal;//商品总价
var sfAlert;
var countType  = 0; //优惠券类型
var amtFullReduceAmount = 0;//优惠券金额
var logisticsPriceForCount = 0; //运费临时计算用
var couponsId = null;
var hasFreightMark = "";
var ifOverseas = 0;//境外商品标识 0:普通商品 1:境外商品
var autonymVerify = "";//境外商品实名验证
var freightIstrue = 0
/*
 * if(!userInfo){ window.location.href = 'login.jsp'; }
 */
$(function(){
	initPage();
});
$(".backToPrev").on("click",function(){
	history.go(-1);
});

$(".payMethod-item").click(function(){
	if(!$(this).hasClass('checked')){
		$(this).addClass('checked').siblings().removeClass('checked');
	}
});
$(".sub-item.address").click(function() {
	window.location.href = _content + "/generalStore/html/address.jsp";
});
$(".submitBtn").click(function(){
    if(freightIstrue==-1){
        $.alert("超出可配送区域，请修改收货地址");

        return
    }
	var judgeTipProvince;
	if(addressObj == null){
		hui.confirm("请先添加收货地址!",[ '取消', '好的' ],function() {
			window.location.href = _content + "/generalStore/html/address-add.jsp";
		});
		return;
	}
	//提交前判断是否为偏远地区111
	if(addressObj.tipProvince != null){
		judgeTipProvince = addressObj.tipProvince;
	}

	//省份无法定位时出现null,直接或许详细地址判断
	if(addressObj.tipProvince == null){
		judgeTipProvince = addressObj.addRessDetail;
	}

	//省份无法定位时出现null,直接或许详细地址判断
	if(addressObj.addRessDetail == null){
		judgeTipProvince = addressObj.address;
	}
	//旧数据要求用户重新填写地址
	if(judgeTipProvinceOld(judgeTipProvince)){
		hui.confirm("您的收货地址不完整,请重新填写!",[ '取消', '确认' ],function() {
			window.location.href = _content + "/generalStore/html/address.jsp";
			//window.location.href = '/localQuickPurchase/generalStore/html/address-add.jsp';
		});
		return;
	};

	// //新疆、西藏、宁夏、青海、内蒙古、甘肃、黑龙江、吉林、辽宁、香港、台湾、澳门等偏远地区限制
	// if(judgeTipProvince.indexOf("新疆") >= 0 || judgeTipProvince.indexOf("西藏") >= 0 || judgeTipProvince.indexOf("宁夏") >= 0 ||
	// 		judgeTipProvince.indexOf("青海") >= 0 || judgeTipProvince.indexOf("内蒙古") >= 0 || judgeTipProvince.indexOf("甘肃") >= 0 ||
	// 		judgeTipProvince.indexOf("黑龙江") >= 0 || judgeTipProvince.indexOf("吉林") >= 0 || judgeTipProvince.indexOf("辽宁") >= 0 || judgeTipProvince.indexOf("海南") >= 0){
	// 	//是否已经弹窗
	// 	if(judgeFlag == false){
	// 		var freightTemp = $(".good-freight").text();
	// 		if(freightTemp != 0){
	// 			hui.alert('您的收货地址为偏远地区,需要加收运费!','好的');
	// 			judgeFlag = true;
	// 			return;
	// 		}
	// 		judgeFlag = true;
	// 	}
	// 	if(judgeFlag == true){
	// 		submitOrder();
	// 	}
	// }else{
	// 	submitOrder();
	// }

	//新疆、西藏、宁夏、青海、内蒙古、甘肃、黑龙江、吉林、辽宁、香港、台湾、澳门等偏远地区限制
	if(hasFreightMark == true){
        if(judgeFlag == false){
            hui.alert('您的收货地址为偏远地区,需要加收运费!','好的');
			judgeFlag = true;
			return;
		}else{
            submitOrder();
		}
	}else{
        submitOrder();
	}

	/*if(judgeFlag == false){
		//submitOrder();
	}*/
});

function initPage(countType,discountMoney){
	shareSeq = shareSeq == "null" ? 0 : shareSeq;
    //判断当前页面是否有选择按钮是否被选中
    var btnList = $(".comfirmBtn");
    if(btnList.length > 0) {
        //按钮中已经有被选中按钮
        var selectMark = 0;
        for (var i = 0; i < btnList.length; i++) {
            if ($(btnList[i]).attr("class").indexOf("check") >= 0) {
                selectMark = 1;
            }
        }
        if(selectMark == 0){
            discountMoney = 0.0;
		}
    }
    // 获取当前省份
    getLocation().then(function (locationCity) {
        $.ajax({
            url:_content+'/dOrders/affirmPageV2',
            type: 'POST',
            dataType: 'json',
            async : false,
            data: {
                "dGoodsId" : dGoodsId,
                "shareSeq" : shareSeq,
                "userName" : userName,
                "time" : Math.random(),
                "isActivityGoods" : isActivityGoods,
                "goodsNum" : goodsNum,
                "sku":sku,
                "countType": countType,
                "discountMoney":discountMoney,
                "sf":isSf,
                "from":"h5",
                "userSeq" : seq,
                "province" : locationCity.province
            },
            success : function(res) {//成功返回值执行函数
                if(res.code == 200){
                    var data = res.data;
                    hasFreightMark = data.hasFreight;
                    //抵扣券的使用
                    var discount = data.discount;
                    if (discount != null && discount > 0.0){
                        var balance = data.balance;
                        var discount = data.discount;
                        coupons[0] = new Object();
                        coupons[0].couponsId = couponsId;
                        coupons[0].couponsPrice = discount;
                        coupons[0].couponsType = 5;
                        couponAmount = discount;
                        $('.coin-price').html(balance);
                        $('.wfymoney').html(discount);
                        $('#wfy').show();
                    }/* else {
					coupons = [];
				}*/
                    console.log(data,8899)
                    // 判断当前选择的运费是否是偏远地区
                    if(data.freight==-1){
                        freightIstrue = -1;
                        $.alert("超出可配送区域，请修改收货地址");
                        // 更改为不可提交订单状态
                        $(".statementBox .statementBtn").css({"background":"#b8b5b5"})
                    }else{
                        freightIstrue = 0;
                        // 更改为可提交订单
                        $(".statementBox .statementBtn").css({"background":"#e4393c"})
                    }
                    //获取用户收货地址经纬度并重新封装
                    var address = data.address
                    if(address != null){
                        if(address.tipLocation != null) {
                            var userTipLocation = data.address.tipLocation;
                            var arr = userTipLocation.split(",");
                            var lng = arr[0];
                            var lat = arr[1];
                            //调整经纬度前后位置
                            userLocation = lng+","+lat;
                        }
                    }
                    //获取线下服务中心的seq
                    var dGoodsList = res.data.dGoods;
                    if(dGoodsList.seq != undefined && dGoodsList.seq != null){
                        localServerCenterSeq = dGoodsList.seq;
                    }
                    console.log("线下服务中心seq------------------"+localServerCenterSeq);
                    goodsCode = data.dGoods.goodsCode;
                    // 获取优惠金额
                    getcouponsId();
                    //计算当前订单的总重量
                    var goodWeight = data.dGoods.weight;
                    console.log(goodWeight * goodsNum + "kg");
                    //模拟调用net接口返回价格

                    var _html = '';
                    //品牌信息
                    var _htmlShop = '';
                    var shopSupplierName = '';
                    var shopPictureName = '';
                    var shopUrlName = '';
                    if(data.sdn!=null){
                        shopSupplierName = data.sdn.shopSupplierName;//店铺名称
                        shopPictureName = data.sdn.shopPictureName;//店铺图片
                        shopUrlName = data.sdn.shopUrlName;//店铺地址
                    }

                    var goodsName = data.dGoods.goodsName; // 商品名
                    isDistrbutionGoodsMark = data.dGoods.isDistrbutionGoods; //是否为网络店主商品
                    var activityState = data.dGoods.activityState;//秒杀商品上下架状态
                    var dInvoice = data.dGoods.invoice;//商品是否可以开发票
                    if(!dInvoice){//不能开发票
                        $(".invoiceLi").hide();//隐藏发票按钮
                    }
                    ifOverseas = data.dGoods.ifOverseas;//是否境外商品 1:是 0:不是
                    var autonymVerifyValue = data.autonymVerify;
                    if (null != autonymVerifyValue) {
                        autonymVerify = autonymVerifyValue;
                    }
                    if (ifOverseas == 1) {
                        $(".autonymVerify").show();
                        $(".autonymVerifyValue").text(autonymVerify);//有效证件号
                    }
                    console.info(data);
                    //isPlatform = false;
                    var address = data.address; // 收货地址
                    if(data.address != null){
                        var tipCity = address.tipCity; // 收货地址
                        var tipProvince = address.tipProvince; // 收货地址
                        if(tipProvince == null){
                            tipProvince = "";
                        }
                    }
                    var shop = res.data.shop;
                    if (shop != null) {
                        shopLats = shop.lat;
                        shopLngs = shop.lng;
                        console.log("shopLats: " + shopLats);
                        console.log("shopLngs: " + shopLngs);
                        $(".shopImg").attr("src",shop.shopHeadImgPath);
                        $(".shopName").text(shop.shopName);
                    }

                    var dprice = 0.0; // 分销价
                    var platformPrice = 0.0; // 平台价
                    var goodsPrice = 0.0; // 秒杀零售价
                    //比较sku，获取规格对应的分销价、平台价
                    var goodsProStandard = data.dGoods.goodsProStandard;
                    if (goodsProStandard != null) {
                        for(var i = 0; i < goodsProStandard.length; i++) {
                            if (sku == goodsProStandard[i].sku) {
                                dprice = goodsProStandard[i].distributionPrice;// 分销价
                                seckillPrice = goodsProStandard[i].seckillPrice;//秒杀价
                                platformPrice = goodsProStandard[i].platformPrice;// 分销价
                                distributionProfit = goodsProStandard[i].distributionProfit;// 秒杀：分销商佣金
                                profitPrice = goodsProStandard[i].profitPrice;// 秒杀：代理商佣金
                                goodsPrice = goodsProStandard[i].goodsPrice;// 秒杀：代理商佣金
                                if(isRoleAgent()) {
                                    profitMoney = goodsProStandard[i].distributionProfit;//分销商佣金
                                } else if(isRoleDealer()) {
                                    profitMoney = goodsProStandard[i].profitPrice;//代理商佣金
                                }

                                //先不向下取整 ,
                                break;
                            }
                        }
                    }
                    var isDistrbutionGoods = data.dGoods.isDistrbutionGoods;
                    if(isRoleVip() || isRoleConsumer()){//消费者
                        $(".discounts").hide();
                    }else{
                        $(".discounts").show();
                    }
                    amount = (data.amount).toFixed(2);
                    goodsTotal = (data.goodsTotal).toFixed(2);
                    totalAmount = (data.totalAmount).toFixed(2);
                    isPlatform = data.dGoods.isDistrbutionGoods;
                    if (ifOverseas == 1) {
                        $(".good-tariffFee").html((data.tariffFee).toFixed(2));//关税
                        $(".tariffFee").show();
                    }
                    $(".good-discount").html((data.totalDiscount).toFixed(2));//优惠多了多少
                    $(".good-total").text(goodsTotal);//商品总价
                    if(isSf){
                        $("#logisticsType").html("顺丰速运");
                    }else{
                        $("#logisticsType").html("配送费");
                    }
                    $(".good-freight").text((data.logisticsPrice).toFixed(2));
                    var logisticsPrice = data.dGoods.logisticsPrice;
                    if (logisticsPrice == null || logisticsPrice == "") {
                        logisticsPrice = 0.0;
                    }
                    logisticsPriceForCount = data.logisticsPrice;
                    $(".nosf").html("配送费            ¥" + logisticsPrice);
                    //大于0表示能用顺丰快递
                    if (data.sfFreight > 0) {
                        if (data.sfFreight != null && data.sfFreight != "") {
                            $(".sf").html("顺丰速运(运费:￥"+ data.sfFreight +")");
                            $(".sf").parent(".expressFee").attr("sfFreight", data.sfFreight);
                        }
                        if(isSf){
                            $("#logisticsType").html("顺丰速运");
                        }else{
                            $("#logisticsType").html("配送费");
                        }
                    }else{
                        $("#sf").hide();
                        $("#logisticsType").html("配送费");
                    }
                    sfFreight = data.sfFreight;
                    nosfFreight = data.dGoods.logisticsPrice;
                    console.log("logisticsPrice: " + logisticsPrice);
                    amtFullReduceOrPrice = amount;
                    //logisticsPriceForCount
                    //$(".orPrice").html(parseFloat(amtFullReduceOrPrice)+parseFloat(logisticsPriceForCount));//订单总价  包含运费
                    $(".orPrice").html(totalAmount);
                    var _address = '';
                    if(userData != null && userData != "" && userData != "null") {
                        if(isJSON(userData)) {
                            userData = JSON.parse(userData);
                        }
                        addressId = userData.id;	// 收货地址id
                        addressObj = userData;
                        var isDefaut = '';
                        /*if(userData.isDefault == "true") {*/
                        idDefault = '<i class="remark">默认地址</i>';
                        /*} else {
                            idDefault = '';
                        }*/
                        _address = '<p><input type="hidden" name="l_address" /><input type="hidden" name="l_tel" value="'+ userData.shippingTelephone +'"/><input type="hidden" name="l_name" value="'+ userData.userName +'"/><input type="hidden" name="l_sex" value="'+userData.sex+'"/>'+
                            '<span  class="consignerMsg" data-value="'+ userData.isDefault +'">'+ userData.userName + '('+ userData.shippingTelephone +')'+'</span>'+ idDefault +'</p><p>收货地址：<span class="addressMsg">'+ getAddressStr(userData.tipName, userData.address) +'</span></p><i class="rightIco"></i>';
                    } else {
                        if(address != null){
                            addressId = address.shippingAddressId;	// 收货地址id
                            var isDefaut = '';
                            idDefault = (address.bDefault)?'<i class="remark">默认地址</i>':'';
                            _address = '<p><input type="hidden" name="l_address" value="'+ address +'"/><input type="hidden" name="l_tel" value="'+ address.shippingTelephone +'"/><input type="hidden" name="l_name" value="'+ address.shippingName +'"/><input type="hidden" name="l_sex" value="'+ address.shippingSex +'"/>'+
                                '<span  class="consignerMsg" data-value="'+ address.bDefault +'">'+ address.shippingName + '('+ address.shippingTelephone +')'+'</span>'+ idDefault +'</p><p>收货地址：<span class="addressMsg">'+ getAddressStr(address.tipName, address.address) +'</span></p><i class="rightIco"></i>';
                            addressObj = data.address;
                        }else{
                            _address = '收货信息：暂无地址，去新增地址吧';
                        }
                    }
                    _html += '<div class="good-item"><div class="good-name item-item"><span>'+ goodsName+"  ,"+spec+'</span></div><div class="good-num item-item">x<span>'+ goodsNum +'</span></div><div class="good-price item-item"><i>&yen;</i><span>'+ (activityState == 0?goodsPrice:dprice) +'</span></div></div>';
                    if (activityState == 0){
                        _html += '<div><span>秒杀价</span><span style="float: right;"><i>&yen;</i>'+seckillPrice+'</span></div>';
                    }


                    /*_htmlShop += '<div class="spa_img">\n';
                    _htmlShop+='<img src="'+shopPictureName+'" alt="">';
                    _htmlShop+= '</div>';
                    _htmlShop+='<div>'+shopSupplierName+'</div>';*/
                    if(shopSupplierName!='' && shopSupplierName!="爱之家自营"){

                        _htmlShop += '<div class="spa_img">\n';
                        _htmlShop+='<img src="/localQuickPurchase/distributionApp/images/icon_1.png" alt="">';
                        _htmlShop+= '</div>';
                        _htmlShop+='<div><a href="'+shopUrlName+'">'+shopSupplierName+'</a></div>';
                        _htmlShop+='<div class="more" style="width: 1rem"><a class="shopList" href="'+shopUrlName+'"></a></div>';
                    }else{
                        _htmlShop += '<div class="spa_img">\n';
                        _htmlShop+='<img src="/localQuickPurchase/distributionApp/images/icon_logo.png" alt="">';
                        _htmlShop+= '</div>';
                        // _htmlShop+='<div>'+shopSupplierName+'</div>';
                        _htmlShop+='<div>爱之家自营</div>';
                        _htmlShop+='<div class="more"  style="width: 1rem"></div>';
                    }


                    $(".address").html(_address);
                    $(".sub-item .good-list").html(_html);
                    //品牌信息
                    $(".sub-item .spn").html(_htmlShop);

                    $(".payment-con").show();
                    var totalPrice = numAdd(amount,logisticsPriceForCount);
                    returnPrice = numSub(totalPrice,totalAmount);
                } else {
                    hui.alert("获取商品失败!");
                }
            }
        });
    });

}

//百业惠盟金币的选中事件
function changeStatus(ev){
    $(ev).toggleClass('checkboxchecked');
    //有选中的时候
    if($(ev).hasClass('checkboxchecked')){
        countType = 5;
        initPage(countType,0.0);
        $(ev).attr("src","../../coupons/images/choose.png");
    } else {
        countType = 3;
        initPage(countType,null);
        coupons = [];
        couponAmount = null;
        $(ev).attr("src","../../coupons/images/cho0se2.png");
	}
}
// var flagType;
$(".payMethod-item").click(function(event) {
	if($(this).hasClass('payInWechat')) {
		$(".orPrice").html(amount.toFixed(2));
		$(".good-freight").html("0.00");
	}else{
		$(".good-freight").html(freight.toFixed(2));
		$(".orPrice").html((amount+freight).toFixed(2));
	}
});
// 判断是否是微信小程序支付
var isMiniprogramIs = false;
isMiniprogram().then(function (mini) {
    isMiniprogramIs = true
}).catch(function (err) {
});
function comfirmOrder(){
	if(addressObj==null){
		$.alert("请绑定收货地址");
		return;
	}
   /* if($(".orPrice").html() > 0) {*/
        if (flag) {
            return console.log("请勿重复提交!");
        }
        flag = true;
        var str=addressObj.tipLocation.split(",");
        var lat1=str[1];
        var lng1=str[0];
        var lat2=shopLats;
        var lng2=shopLngs;
        console.log(lat1+";"+lng1+";"+lat2+";"+lng2);
        var distance=getGreatCircleDistance(lat1,lng1,lat2,lng2);
        // true 平台商品 ,false 本地商品
        console.log("isPlatform: " + isPlatform);

        var remark = $(".good-remark").val();
        var mode = $(".payMethod").find(".checked").find("span").text();

        //商品详情的集合
        var listOrderDetails = [];
        listOrderDetails[0] = new Object();
        listOrderDetails[0].orderSku = sku;
        listOrderDetails[0].spec = spec;
        listOrderDetails[0].isActivityGoods = isActivityGoods;
        var data = {};
        data.shippingSex = addressObj.shippingSex;
        data.shippingTelephone = addressObj.shippingTelephone;
        data.address = addressObj.tipCity + addressObj.tipDistrict + addressObj.tipName +  addressObj.address ;
        data.shippingName = addressObj.shippingName;
        data.addressId = addressId;
        data.goodsId = dGoodsId;
        //data.distributorSeq = distributorSeq;
        data.goodsNum = goodsNum;
        data.seq = userSeq;
        //data.seqSeller = shopSeq;
        data.userName = userName;
        data.shareSeq = shareSeq;
        data.isSf = isSf;
        data.pickUpWay = mode;
        data.invoiceHead = billHead;
        data.remark = remark;
        data.invoice = invoice;
        data.listOrderDetails = listOrderDetails;
        data.autonymVerify = autonymVerify;
        if(coupons != null && coupons != ""){
            data.coupons = coupons;
        }
        if(couponAmount != null && couponAmount != ""){
            data.couponMoney = couponAmount;
        }
        if(amtDiscount != null && amtDiscount != ""){
            data.amtDiscount = parseInt(amtDiscount * 10).toFixed(2);
        }
        if (isLocaleRecruitOrders == 1) {//标识是什么商品去下单
            data.isLocaleRecruitOrders = isLocaleRecruitOrders;
        } else {
            data.isLocaleRecruitOrders = 0;
        }
        data.preferentialHowMany = profitMoney;
        $(".submitBtn").addClass("lock");
        data.from = isMiniprogramIs ? "smallProgram" : "h5";
        console.log(data);
        $.ajax({
            url:_content+'/dOrders/insertOrders',
            type: 'post',
            async:true,
            contentType: "application/json;charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(data),
        })
            .done(function(res) {
                if(res.code == 200){
                	setCookie("invoice","",-1);
                    console.log("orderno: " + res.data.orderno);
                    //var flag = is_weixin();
                    var flagW = is_weixin();
                    //本地商品不能在微信里打开支付
                    if (flagW) {
                        //alert("微信里打开的!" + flagW);
                        if (!isPlatform) {
                            //alert("这是本地商品!!");
                            var goodsName = $(".good-name span").html();
                            //alert("商品: " + goodsName + "为本地商品.请在外部浏览器打开并支付!");
                            return window.location.href = '/localQuickPurchase/distributionVA/order/index';
                        } else {
                            //alert("这是平台商品!!");
                            // 如果是在小程序中打开支付
                            isMiniprogram().then(function (mini) {


                                $.ajax({
                                    url:_content+'/small/pay/toPay',
                                    type: 'post',
                                    async:false,
                                    contentType: "application/json;charset=utf-8",
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        "orderNo":res.data.orderno,
                                        "userSeq":userSeq
                                    })
                                }).done(function (miniPay) {
                                    // 判断该用户是否绑定微信是否有openid
                                    if (miniPay.code==403001){
                                        hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
                                            setCookie("loginRetrunUrl",location.href);
                                            var url =  loginPageUrl();
                                            window.location.href = url;
                                        });
                                    } else {
                                        var payData = miniPay.data;
                                        // 在微信小程序中唤起支付
                                        wx.miniProgram.navigateTo({url:`/pages/pay/pay?data=${encodeURIComponent(JSON.stringify(payData))}`});
                                    console.log(payData,3344)
                                    }
                                })
                            }).catch(function (err) {


                                payUrl(res.data.orderno, userSeq);
							});
                            // window.location.href =  "https://payts.520shq.com/home/indexwap" +
                            //     "?salenumber="+ res.data.orderno +"&seq="+ userSeq +"&comefrom=10026&busimode=0";
                        }
                    } else {
                        var  totalAmmount = $(".orPrice").text();
                        if(totalAmmount =="0.00"){
                            window.location.href = '/localQuickPurchase/distributionVA/order/index';
						}else{
                            //alert("不是微信里打开的!");
                            //去支付站点
                            payUrl(res.data.orderno, userSeq);
                            // window.location.href =  "https://payts.520shq.com/home/indexwap" +
                            //     "?salenumber="+ res.data.orderno +"&seq="+ userSeq +"&comefrom=10026&busimode=0";

                        }
                    }
                }else{
                    flag = false;
                    if (res.message != null) {
                        $.alert(res.message);
                    } else {
                        $.alert("提交订单失败,请稍后再试!");
                    }
                }
            })
            .fail(function() {
                // console.log("error");
            })
            .always(function() {
                $(".submitBtn").removeClass("lock");
                // console.log("complete");
            });
   /* }else{

        hui.alert("该商品实际支付金额与优惠金额不符，请重新选择优惠券!","确认");

    }*/
}

// 获取微信支付所需参数
function getWXpay(orderNo, paySeq) {

    //公众号的唯一标识
    var appid;
    //微信授权回调地址
    var weixinRedirectUrl;
    //获取微信授权回调地址和APPID
    function getWeChatOAuthRedirect() {
        $.ajax({
            type : "get",//定义提交的类型
            url : "/upms/basic/getWeChatAuthorize",
            dataType : "json",//设置返回值得类型
            data : {},
            async : false,//是否异步请求，false为同步
            success : function(data) {//成功返回值执行函数
                appid = data.data.appId;
                weixinRedirectUrl = data.data.redirectUrl;
                //微信授权地址
                var weixin_loginURL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri=";
                //微信授权参数
                var weixin_param = "&response_type=code&scope=snsapi_userinfo&state=weixinToken#wechat_redirect";
                window.location.href = weixin_loginURL + weixinRedirectUrl + weixin_param;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {}
        });
    }
    // 获取用户是否存在微信登录openid
    $.ajax({
        url:`/upms/weChat/getByUserId?userId=${paySeq}`,
        type: 'get',
        async:true,
        contentType: "application/json;charset=utf-8",
        dataType: 'json',
        success(res){
            console.log(res,"seq数据");
            // 判断是否有数据
            if (res.data) {
                getPayData(res.data);
            } else {
                // 如果用户没有授权过微信登录则先让用户去授权
                hui.alert('请先微信登录授权', '好的', getWeChatOAuthRedirect)
            }
        }
    });
    // 获取调取微信小程序支付所需的参数
    function getPayData(userInfo){
        console.log(userInfo,222);
        var wxPay = {
            useBalance:0.0,
            orderNo : orderNo,
            comeFrom : '10029',
            balanceSign : 0,
            umsPayMsgType : 'wx.appPreOrder',
            seq : paySeq,
            subAppId : 'wxe9210973e5221545',
            subOpenId:"o4MaV5Ph7kRjzZNmjCJoSOY_pIVE"
        };
        $.ajax({
            url:`https://payts.520shq.com/api/ums/OpreationMiniBalance`,
            type: 'POST',
            async:true,
            contentType: "application/json;charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(wxPay),
            success(res){
                console.log(res);
            }
        });
    }
}


function submitOrder(){
	console.log(addressObj);
	if(addressObj==null){
		$.alert("请绑定收货地址");
		return;
	}

	/*境外商品要添加实名验证*/
	if (ifOverseas == 1 || ifOverseas == "1") {
		if (autonymVerify == null || autonymVerify == "") {
			hui.alert("因为境外商品需要实名验证,请填入有效的身份证号码或者有效的证件号码!","确定",function(){
                pro();
			});
            return;
		}
	}
	
	//判断是否为线下服务中心商品111
	console.log("//------判断线下服务中心商品和距离信息----------//");
	console.log("isDistrbutionGoods--------->"+isDistrbutionGoodsMark);
	//模拟线下服务中心商品
	if(isDistrbutionGoodsMark == false && seq != null){
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
				url:_content+'/homePageIntegrationAction/findShopInfoBynbh',
				type: 'post',
				async : false,
				data: {
					"seq" : localServerCenterSeq
				},
				success : function(data){
					console.log(data.data.shopInfo);
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
				url:_content+'/dOrders/countDistance',
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
					if(data.data <= serverScope){
						//alert("继续下单流程");
						comfirmOrder();
					}else{
						//超出服务范围
						hui.alert("超出当前服务中心服务范围,当前距离线下服务中心"+data.data+"公里,请重新选择地址");
					}
					 
				}
			})
		}
	}else{
		//正常购买下单流程
		//alert("继续下单流程");
		comfirmOrder();
	}
}

// 根据两点的经纬度算距离，单位米
var EARTH_RADIUS = 6378137.0;    // 单位M
var PI = Math.PI;

function getRad(d){
    return d*PI/180.0;
}
// 纬度，经度
function getGreatCircleDistance(lat1,lng1,lat2,lng2){
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);
    
    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);
    
    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*EARTH_RADIUS;
    s = Math.round(s*10000)/10000.0;
            
    return s;
}
	// var flagType;
	$(".payMethod-item").click(function(event) {
		if($(this).hasClass('payInWechat')) {
			$(".orPrice").html(amount.toFixed(2));
			$(".good-freight").html("0.00");
		}else{
			$(".good-freight").html(freight.toFixed(2));
			$(".orPrice").html((amount+freight).toFixed(2));
		}
	});
	
	
	//处理利润的小数点（原则：只舍不入）
	function profitsPoint(profits){
		if(profits == null || profits == ""){
			return "0";
		} else{
			  var f = Math.floor(accMul(profits, 100)) / 100;	 
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
	
  function accMul(arg1, arg2) {   
	  var m=0,s1=arg1.toString(),s2=arg2.toString();   
	  try{m+=s1.split(".")[1].length}catch(e){}   
	  try{m+=s2.split(".")[1].length}catch(e){}   
	  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)   
  }

  //判断是否为json
	function isJSON(str) {
		if (typeof str == 'string') {
			try {
				var obj=JSON.parse(str);
				if(str.indexOf('{')>-1){
					return true;
				}else{
					return false;
				}

			} catch(e) {
				console.log(e);
				return false;
			}
		}
		return false;
	}

    // $("body").on('click','.autonymVerify',function () {
    //     var prompt = window.prompt("请输入身份证号码或者有效证件号码");
    //     if (null == prompt || "" == prompt) {
    //         prompt = window.prompt("请输入身份证号码或者有效证件号码");
		// }
		// console.log(prompt)
    //     autonymVerify = prompt;
    //     $(".autonymVerifyValue").text(autonymVerify);//有效证件号
    // })

	function pro() {
        hui.prompt('请输入身份证号码或者有效证件号码',['取消','确认'],function (autonym) {
            /*判断是否是数字或者字母*/
        	if (checkPassWord(autonym) && verifyAutonymVerify(autonym)) {
                autonymVerify = autonym;
                $(".autonymVerifyValue").text(autonym);//有效证件号
			}else {
        		hui.alert("请输入有效的身份证号码或者有效证件号码")
			}
        })
	}

