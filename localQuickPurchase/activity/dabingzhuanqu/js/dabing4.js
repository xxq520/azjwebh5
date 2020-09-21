
function initData(channel){
    $.ajax({
        type : 'get',
        url : "/localQuickPurchase/homePageIntegrationAction/getChannel",
        data : {"channel":channel},
        success : function(result){
            console.info(result);
            if(result.code == 200){
                var rsMap = result.data;
                var models = rsMap.models;
                for(var i=0;i< models.length;i++){
                        if(i == (models.length-1)){
                            tuijian(models[i]);
                        }else{
                            modelsHtml(models[i],i)
                        }
                }
                if(rsMap.brandDescImg != null){
                    var brandDescHtml = '<img src="'+rsMap.brandDescImg+'" alt="">';
                    //品牌介绍
                    $('.brandDesc').html(brandDescHtml);//
                }
                if(rsMap.description != null && rsMap.description != ""){
                    //爱之家简介
                    $('.desc').html(rsMap.description);
                }

            }
        },
        error : function(data){
            hui.toast("网络错误,稍后重试");
        }
    });
}

function goodsHtml(goods){
    if(goods == null){
        return "";
    }
    var distributionPrice = getDistributionPrice(goods.goodsProStandard).toString();
    var goodsPrice = getGoodsPrice(goods.goodsProStandard);
    var _html = `<li class="goods-item"   onclick="goodsDetail('${goods.goodsId}')">
                    <div class="img-box">
                        <img src="${goods.thumbnail}" alt="">
                    </div>
                    <div class="goods-desc">
                        <p class="goods-name">${goods.goodsName}</p>
                        <div class="price-box">
                            <span>价值:</span>
                            <span class="price">${distributionPrice}元</span>
                        </div>
                    </div>
                </li>`;
    return _html;

}
//  models   渲染整个栏目
function modelsHtml(models, index){
    var style = 'display: none;'
    var clazz = ''
    if(index == 0){
        style = '';
        clazz = 'cur';
    }
    var _imgUrl = `images/banner2.png`;
    if(models.banner != null && models.banner.imgUrl != null || models.banner.imgUrl != ""){
        _imgUrl = models.banner.imgUrl;
    }
    //banner 图片 点击栏目切换
    var _img = `<img src="${_imgUrl}" class="marker ${models.id}"  style="${style}"  alt="">`;
    $('.banner-con').append(_img);
    var _goodsHtml = '';
    var listGoods = models.listGoods;
    if(listGoods != null){
        for(var i=0;i< listGoods.length;i++){
            _goodsHtml += goodsHtml(listGoods[i]);
        }
    }
    var _html = `<div class="goods-con   ${models.id}">
            <h5 class="goods-title">${models.modelName}</h5>
            <ul class="goods-list flex">
                 ${_goodsHtml}
            </ul>
        </div>`;
    $('.jianjie').before(_html);
}
//推荐  或者 其他栏目
function tuijian(models){
    var listGoods = models.listGoods;
    $('.azj-zq .goods-title').html(models.modelName);

    if(listGoods != null){
        for(var i=0;i< listGoods.length;i++){
            var goods = listGoods[i];
            if(goods == null){
                continue;
            }
           var distributionPrice = getDistributionPrice(goods.goodsProStandard).toString();
            var goodsPrice = getGoodsPrice(goods.goodsProStandard);
            var distributionPriceArr = distributionPrice.split(".");
            var distributionPrice1;
            var distributionPrice2;
            if(distributionPriceArr.length == 2){
                distributionPrice1 = distributionPriceArr[0]
                distributionPrice2 = distributionPriceArr[1]
            }else{
                distributionPrice1 = distributionPriceArr[0];
                distributionPrice2 = "00";
            }
            var _html = `<li class="goods-item" onclick="goodsDetail('${goods.goodsId}')">
                <div class="goods-desc">
                <p class="name">${goods.goodsName}</p>
                <div class="price-box">
                <span class="flag">热卖特惠</span>
                <p class="price-y">${distributionPrice1}.<span class="sm">${distributionPrice2}RMB</span> </p>
                </div>
                </div>
                <div class="img-box">
                    <img src="${goods.thumbnail}" alt="">
                    </div>
                    </li>`;
           $('.azj-zq .goods-list').append(_html);
        }
    }
}
function slide(obj){
    $(obj).siblings().removeClass("cur");
    $(obj).addClass("cur");
    $(".marker").hide();
    var goodsListClazz = $(obj).attr("marker");
    $("."+goodsListClazz).show();
}