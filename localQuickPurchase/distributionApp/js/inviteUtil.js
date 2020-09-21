
function generalSend(_url,_paramData,rquest_method){
    $.ajax({
        type : rquest_method,
        dataType : 'json',
        url : _url,
        data : _paramData,
        success : function(data){
            console.info(data);
            if(data.code == 200){
                initData();
            }
        },
        error : function(data){
            hui.toast(data.message);
        }
    });
}

/**
 * 获取商品
 * @returns
 */
function send(){
    $.ajax({
        type : 'post',
        dataType : 'json',
        url : "/localQuickPurchase/homePageIntegrationAction/findColummGoods",
        data : {},
        success : function(result){
            console.info(result);
            if(result.code == 200){
                var rsMap = result.data;
                initData(rsMap);
            }
        },
        error : function(data){
            hui.toast(data.message);
        }
    });
}

/**
 * 选择对应栏目的数据
 * @param map
 * @param colmnIndex
 * @returns
 */
function chooseData(map,colmnIndex){
    var colummData;
    if(colmnIndex == 1){
        colummData = map.sagawa;
    }else if(colmnIndex == 2){
        colummData = map.tangible;
    }else if(colmnIndex == 3){
        colummData = map.strict;
    }else if(colmnIndex == 4){
        colummData = map.arrival;
    }else if(colmnIndex == 5){
        colummData = map.hostProduct;
    }else if(colmnIndex == 6){
        colummData = map.toneluck;
    }
    return colummData;
}



function initData(map){
    $(".colmn").each(function(i){
        var colmnIndex =  $(this).attr("colmnIndex");
        var columnData = chooseData(map,colmnIndex);
        var html = init(columnData);
        $(this).find(".pro-list").html(html);
    });
}


/**
 * 初始化html
 * @param goodsList  商品集合
 * @returns
 */
function init(goodsList){
    var html = "";
    if(goodsList == null)
        return html;
    for(var i = 0 ; i < goodsList.length ; i++){
        var goods = goodsList[i];
        var thumbnail = goods.thumbnail;//商品图
        var goodsPrice = goods.goodsProStandard[0].goodsPrice;//市场价
        var promotionPrice = goods.goodsProStandard[0].distributionPrice;//促销价格,优惠价
        var goodsName = goods.goodsName;//商品名
        var goodsId = goods.goodsId;
        html += initHtml(thumbnail,goodsName,goodsPrice,promotionPrice,goodsId);
    }
    return html;
}

/**
 * 拼接html字符串
 * @param thumbnail 商品图
 * @param goodsName 商品名
 * @param marketPrice  市场价
 * @param promotionPrice  优惠价
 * @returns
 */
function initHtml(thumbnail,goodsName,marketPrice,promotionPrice,goodsId){
    var _html = "";
    _html += '<div class="pro-item pr wbg bcolr" style="width:40%" onclick=goodDetail("'+goodsId+'") >';
    _html += '<div class="pro-img texcen">';
    _html += '<img src="'+thumbnail+'"/>';
    _html += '</div>';
    _html += '<div class="pro-desc">';
    _html += '<p class="pro-title limit2 fs22">'+goodsName+'</p>';
    _html += '<div class="oldPrice fs16">市场价：'+marketPrice+'元</div>';
    _html += '<div class="distributionPrice"><span class="yuan fs16">￥ </span><span class="fw700 fs30"> '+promotionPrice+' </span><span class="yuan fs16"> 元</span></div>';
    _html += '<div class="pro-spec">';
    _html += '<div>';
    // _html += '<p class="coupon fs16 wcolr couponbg texcen">爱之家商城优惠价</p>';
    _html += '</div>';
    // _html += '<p class="price pricecolr"><span class="yuan fs16">￥ </span><span class="fw700 fs30"> '+promotionPrice+' </span><span class="yuan fs16"> 元</span></p>';
    _html += '</div>';
    _html += '</div>';
    _html += '<span class="a">+</span>';
    _html += '<span class="b">+</span>';
    _html += '<span class="c">x</span>';
    _html += '<span class="d">x</span>';
    _html += '</div>';
    return _html;
}
//跳转商品详情
function goodDetail(gId){
    var url = '/localQuickPurchase/distributionVA/goodsDetail/'+gId+'/0/'+seq;
    location.href = url;
}

//进入首页
$("#goShore").click(function(){
    location.href = "/localQuickPurchase/distributionVA/index";
});
