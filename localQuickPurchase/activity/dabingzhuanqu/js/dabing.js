
function initData(){
    $.ajax({
        type : 'post',
        dataType : 'json',
        url : "/localQuickPurchase/homePageIntegrationAction/findColummGoods",
        data : {},
        success : function(result){
            console.info(result);
            if(result.code == 200){
                var rsMap = result.data;
                $.each(rsMap, function (key, value) {
                    chooseData(key, value)
                });
            }
        },
        error : function(data){
            hui.toast("网络错误,稍后重试");
        }
    });
}
/**
 * 选择对应栏目的数据
 * @param map
 * @param colmnIndex
 * @returns
 */
function chooseData(key,goodsList){
    var _html = initPage(goodsList);
    /*DABINGGRIN("dabingGrin", "大兵-笑工优选"),//大兵-笑工优选
    DABINGSAGAWA("dabingSagawa", "大兵-天天特价"),//大兵-天天特价
    DABINGARRIVAL("dabingArrival", "大兵-每日上新"),//大兵-每日上新
    HONGYANGJIU("dabingQuality", "大兵-严选精品"),//红洋酒篇
    DABINGHOST("dabingGost", "大兵-热销榜"),//热销榜
    DABINGTANGIBLE("dabingTangible", "大兵-真实惠"),//真实惠
    DABINGBIUNDS("dabingBounds", "大兵-限量购");//限量购*/
    switch(key){
        case "dabingGrin":
        case "dabingSagawa":
        case "dabingArrival":
        case "dabingQuality":
            var _html1 = initPage(goodsList,1);
            $("#"+key).append(_html1);
            break;
        case   "dabingGost":
        case   "dabingTangible":
        case   "dabingBounds":
            var _html2 = initPage(goodsList,2);
            $("#"+key).append(_html2);
            break;
        default:
            break;
    }
}

function initPage(goodsList,type){
    var _html = "";
    if(goodsList == null)
        return _html;
    if(type == 1){
        for(var i = 0 ; i < goodsList.length ; i++){
            var goods = goodsList[i];
            _html += initHtml1(goods);
        }
    }else if(type == 2){
        for(var i = 0 ; i < goodsList.length ; i++){
            var goods = goodsList[i];
            _html += initHtml2(goods);
        }
    }
    return _html;
}
/**
 * 拼接html字符串
 * @param goods 商品
 * @returns
 */
function initHtml1(goods){
    var distributionPrice = getDistributionPrice(goods.goodsProStandard);
    var goodsPrice = getGoodsPrice(goods.goodsProStandard);
    var _html = `<li class="shop-item" onclick="goodsDetail('${goods.goodsId}')">
                    <div class="img-box">
                        <img src="${goods.thumbnail}" alt="">
                    </div>
                    <div class="shop-text">
                        <p class="text">${goods.goodsName}</p>
                        <p class="price-box"><span class="cur-price">&yen;${distributionPrice}</span><span class="old-price">&yen;${goodsPrice}</span></p>
                        <a href="javascript:void(0);" class="buy-btn">立即购买</a>
                    </div>
                </li>`;
    return _html;
}
/**
 * 拼接html字符串
 * @param goods 商品
 * @returns
 */
function initHtml2(goods){
    var distributionPrice = getDistributionPrice(goods.goodsProStandard).toString();
    var goodsPrice = getGoodsPrice(goods.goodsProStandard);
    var distributionPriceArr = distributionPrice.split(".");
    var distributionPrice1;
    var distributionPrice2;
    if(distributionPriceArr.length == 2){
        distributionPrice1 = distributionPriceArr[0]
        distributionPrice2 = "." + distributionPriceArr[1]
    }else{
        distributionPrice1 = distributionPriceArr[0];
        distributionPrice2 = ".00";
    }
    var _html = `<div class="goods-item"  onclick="goodsDetail('${goods.goodsId}')" >
                <a href="javascript:void(0);">
                    <div class="img-box">
                        <img src="${goods.thumbnail}" alt="">
                    </div>
                <div class="desc-con">
                    <p class="goods-desc">${goods.goodsName}</p>
                    <p><span class="cur-price"><i class="sm">&yen;</i>${distributionPrice1}<i class="sm">${distributionPrice2}</i></span><span class="old-price">&yen;${goodsPrice}</span></p>
                </div>
                </a>
            </div>`;
    return _html;
}

//跳转商品详情
function switchTab(obj,clazz){
    $("."+clazz).hide();
    $(obj).siblings().removeClass("cur");
    $(obj).addClass("cur");
    var goodsListClazz = $(obj).attr("marker");
    $("."+goodsListClazz).show();
}

