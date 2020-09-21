
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

function goodsHtml(goods){
    var distributionPrice = getDistributionPrice(goods.goodsProStandard).toString();
    var goodsPrice = getGoodsPrice(goods.goodsProStandard);
    var _html = `<li class="goods-item"   onclick="goodsDetail('${goods.goodsId}')">
                        <div class="img-con">
                            <img src="${goods.thumbnail}" alt="">
                        </div>
                        <div class="goods-desc">
                            <p class="desc">${goods.goodsName}</p>
                            <div class="price-box">
                                <span class="cur-price">¥${distributionPrice}</span>
                                <span class="old-price">¥${goodsPrice}</span>
                                <button class="btn">立即购买</button>
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
    var _li = `<li class="swiper-slide nav-item ${clazz}" marker="${models.id}" onclick="slide(this)">${models.modelName}</li>`;
    $(".dbzq .nav-con .swiper-wrapper").append(_li);
    var _html = `<div class="nav-con marker ${models.id}" style="${style}" >
            <div class="nav-con-item ">
                <h5 class="title">${models.modelName}</h5>
                <ul class="goods-list flex">
                     ${_goodsHtml}
                </ul>
            </div>
        </div>`;
    $('.nav-swiper').after(_html);
}
//推荐  或者 其他栏目
function tuijian(models){
    var listGoods = models.listGoods;
    $('.azj-zq .goods-title').html(models.modelName);

    if(listGoods != null){
        for(var i=0;i< listGoods.length;i++){
            var goods = listGoods[i];
           var distributionPrice = getDistributionPrice(goods.goodsProStandard);
            console.log(goods);
            var goodsPrice = getGoodsPrice(goods.goodsProStandard);
            var _html = `<li class="goods-item"  onclick="goodsDetail('${goods.goodsId}')">
                    <div class="img-con">
                        <img src="${goods.thumbnail}" alt="">
                    </div>
                    <div class="goods-desc">
                        <p class="desc">${goods.goodsName}</p>
                        <div class="price-box">
                            <span class="cur-price">&yen;${distributionPrice}</span>
                            <span class="old-price">&yen;${goodsPrice}</span>
                          <!-- <button class="btn">立即购买</button>-->
                        </div>
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