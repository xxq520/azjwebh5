var list = [];
var userSeq = seq;//当前用户的seq
var _html = '';
var distributionStock = "";//分销商品库存
var goods;
var presellType = "";//商品标识
var statrtTime;//开始时间
var endTime;//结束时间
var presellDay = -1; //预计发货天数

// 判断是否登录
function noLogin(){
    sltHide();
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        setCookie("loginRetrunUrl",urlVal);
        loginPage();
    });
}
	
// 添加购物车事件
function addCart(){
    var add = {
        type: 'POST',
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        url: '/localQuickPurchase/dCart/add',
        data: JSON.stringify({
            "supplierSeq": parseInt(supplierSeq),
            "shopSeq": parseInt(shopSeq),
            "goodsId": goodsId,
            "companyName": companyName,
            "goodsNum": parseInt(goodsNum),
            "shareSeq": parseInt(shareSeq),
            "sku": orderSku,
            "spec": spec
        }),
        async: true,
        success: function (data) {
            var code = data.code;
            //操作完之后清空
            spec = '';
            $(".slt-spec").text("选择规格 " + spec);
            $(".checkedSpec").text(spec);
            if (code == 200) {
                hui.toast("加入购物车成功");
            } else if (code == 501) {
                hui.toast(data.message);
            } else {
                hui.toast("加入购物车失败");
            }
            $(".specBtn").hide();
            $(".numBox").hide();
            sltHide();
        }
    };
    refresh(add);
}

// 商品推荐
function hotSale(){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : '/goods/onlineGoods/recommendShop',
		data : {
			pageSize : 4,
            pageIndex : 1,
            seq : seq
		},
		async : false,
		success : function(data) {
			if(data.code == 1000){
				var goodsText = '';
                var list = data.data;
                var length = list.length;
				for (var i = 0; i < length; i++) {
					var goods = list[i];
					var goodsName = goods.goodsName;
					var goodsProStandard = goods.goodsProStandard;
					var distributionPrice = getDistributionPrices(goodsProStandard);//分销价
					var listImg = goods.listGoodsImg;
					var goodsId = goods.goodsId;
					var goodsImg = '';
					if(null != listImg && listImg.length > 0){
						goodsImg = listImg[0].goodsImgPath;
					} else {
						goodsImg = goods.thumbnail;
					}
					goodsText += '<div class="goodsItem"><div class="gImg">';
					goodsText += '<img class="good-pic" src="'+ goodsImg+'" id='+goodsId+'></div>';
					
					var presellTypes = goods.presellType;
					if(presellTypes != null && presellTypes == 1) {
						var endTime = goods.endTime;
						var date = Date.parse(new Date());
						if(endTime > date) {
							goodsText += '<div class="gDetail"><div class="gName"><span style="color: red">(预售商品)</span>'+ goodsName+'</div>';
						} else {
							goodsText += '<div class="gDetail"><div class="gName">'+ goodsName+'</div>';
						}
					} else {
						goodsText += '<div class="gDetail"><div class="gName">'+ goodsName+'</div>';
					}
					goodsText += '<div class="gPrice"><span class="rPrice">￥'+ distributionPrice+'</span> </div></div></div>';
				}
				$(".goodsList").html(goodsText);
			}
		},
		error : function(error) {

		}
	});
}

function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

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

var preselType = 0;
function checkGoodsType() {
    if (presellType == 1) {
        var code = checkGoodsToBuy(presellType, statrtTime, endTime);
        var now = getToData();
        if (now < endTime) {
            preselType = 1;
            $(".hasDisplay").removeClass("hasDisplay");
            var expectedDeliveryTime = formatDateTime_(fun_date(endTime, presellDay));
            $(".expectedDelivery").html(expectedDeliveryTime);
        }
    }
}

//获取访问链接中的goodsId
function getGoodsId() {
    var goodsId = getQueryString("goodsId");
    return goodsId;
}
//获取登录的seq
function getDistributorSeq() {
    var distributorSeq = getQueryString("distributorSeq");
    return distributorSeq;
}
//获取分享者的seq
function getShareSeq() {
    var shareSeq = getQueryString("shareSeq");
    var shareSeqCK = getCookie('shareSeq');

    if(isRoleConsumer()) {
        if(shareSeq != null && shareSeq != 0) {
            setCookie("shareSeq",shareSeq,1);
        }
    }
    if(shareSeqCK != null && shareSeqCK != "") {
        shareSeq = shareSeqCK;
    }
    if (shareSeq == undefined || shareSeq == ""){
    	shareSeq = 0;
	}
    return shareSeq;
}
//现场招商底部买卖按钮的判断
function getLocaleRecruit() {
    var isLocaleRecruitOrders = getQueryString("isLocaleRecruitOrders");
    if (isLocaleRecruitOrders == "1"){
    	$(".manage-footer").show();
    	$(".manageBottominvestment").show();
	} else {
    	$(".goods-footer").show();
    	$(".specBtn").show();
	}
    return isLocaleRecruitOrders;
}