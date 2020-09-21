
function initData(){
    $.ajax({
        type : 'post',
        dataType : 'json',
        url : "/localQuickPurchase/homePageIntegrationAction/getChannel",
        data : {},
        success : function(result){
            console.info(result);
            if(result.code == 200){
                var rsMap = result.data;
                var models = rsMap.models;
                for(var i=0;i< models.length;i++){
                    if(i > (models.length-4)){// 最后三个 栏目显示在爱之家专区
                        tuijian(models[i],i,models.length-4);
                    }else{
                        modelsHtml(models[i],i)
                    }
                }
                if(rsMap.brandDescImg != null){
                    var brandDescHtml = '<img src="'+rsMap.brandDescImg+'" alt="">';
                    //品牌介绍
                    $('.brandDesc').html(brandDescHtml);//
                }
                if(rsMap.description != null){
                    //爱之家简介
                    $('.desc-content').html(rsMap.description);
                }
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 4,
                    spaceBetween: 10,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }
        },
        error : function(data){
            hui.toast("网络错误,稍后重试");
        }
    });
}
/**
 * 拼接html字符串
 * @param goods 商品
 * @returns
 */
function goodsHtml(goods){
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
function goodsHtml2(goods){
    if(goods == null){
        return "";
    }
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
    var _html = `<div class="goods-item" onclick="goodsDetail('${goods.goodsId}')">
                <a href="javascript:void(0);">
                    <div class="img-box">
                        <img src="${goods.thumbnail}" alt="">
                    </div>
                <div class="desc-con">
                    <p class="goods-desc">${goods.goodsName}</p>
                    <p><span class="cur-price"><i class="sm">¥</i>${distributionPrice1}<i class="sm">${distributionPrice2}</i></span><span class="old-price">¥${goodsPrice}</span></p>
                </div>
                </a>
            </div>`;
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
    var _imgUrl = `images/banner-img.png`;
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
    var _li = `<li class="swiper-slide nav-item ${clazz}" marker="${models.id}" onclick="slide(this)">${models.modelName}</li>`;
    $(".dbzq .nav-box .swiper-wrapper").append(_li);
    var _html = `<div class="item dabingzhuanqu ${models.id}"  style="${style}">
            <p class="title">[${models.modelName}]</p>
            <ul class="shop-list " id="dabingGrin">
                 ${_goodsHtml}
            </ul>
        </div>`;
    $('.item-list').after(_html);
}
//推荐  或者 其他栏目
function tuijian(models, index, beginSize){
    var listGoods = models.listGoods;
    var style = 'display: none;'
    var clazz = ''
    if(index == beginSize+1){
        style = '';
        clazz = 'cur';
    }
    $('.azj-zq .goods-title').html(models.modelName);
    var _li = `<li class="swiper-slide nav-item ${clazz}"  marker="${models.id}"  onclick="slide2(this)">${models.modelName}</li>`;
    $(".dbzq .nav-box .nav-azj").append(_li);
    var _goodsHtml = '';
    if(listGoods != null){
        for(var i=0;i< listGoods.length;i++){
            _goodsHtml += goodsHtml2(listGoods[i]);
        }
    }
    var _html = `<div class="aizhijiazhuanqu item goods-list ${models.id}"  style="${style}">
                   ${_goodsHtml}     
        </div>`;
    $('.azj').append(_html)
}
function slide(obj){
    $(obj).siblings().removeClass("cur");
    $(obj).addClass("cur");
    $(".dabingzhuanqu").hide();
    //banner 切换
    $(".marker").hide();
    var goodsListClazz = $(obj).attr("marker");
    $("."+goodsListClazz).show();
}
function slide2(obj){
    $(obj).siblings().removeClass("cur");
    $(obj).addClass("cur");
    $(".aizhijiazhuanqu").hide();
    var goodsListClazz = $(obj).attr("marker");
    $("."+goodsListClazz).show();
}
