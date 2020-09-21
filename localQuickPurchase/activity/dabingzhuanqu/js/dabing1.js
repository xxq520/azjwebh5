
function initData1(channel){
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
                var brandDescHtml = '<img src="images/img_ppjs.png" alt="">';
                if(rsMap.brandDescImg != null){
                    brandDescHtml = '<img src="'+rsMap.brandDescImg+'" alt="">';
                }
                if(rsMap.description != null && rsMap.description != ""){
                    $('.desc').html(rsMap.description;
                }
                $('.jj').html(brandDescHtml);
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
    if(goods == null){
        return "";
    }
    var distributionPrice = getDistributionPrice(goods.goodsProStandard);
    var goodsPrice = getGoodsPrice(goods.goodsProStandard);
    var _html = ` <li class="goods-item"  onclick="goodsDetail('${goods.goodsId}')">
                    <div class="img-box">
                        <img src="${goods.thumbnail}" alt="">
                    </div>
                    <p class="goods-desc">${goods.goodsName}</p>
                    <p class="price">¥${distributionPrice}&nbsp;<span class="old-price">&yen;${goodsPrice}</span></p>
                    <button class="btn">立即购买</button>
                </li>`;
    return _html;

}
function modelsHtml(models, index){
    var style = 'display: none;'
    var clazz = ''
    if(index == 0){
        style = '';
        clazz = 'cur';
    }
    var _imgUrl = `images/banner1.png`;
    if(models.banner != null){
        _imgUrl = models.banner.imgUrl;
    }
    var _li = `<li class="swiper-slide nav-item ${clazz}" marker="${models.id}" onclick="slide(this)">${models.modelName}</li>`;
    var _img = `<img src="${_imgUrl}" class="marker ${models.id}"  style="${style}"  alt="">`;
    $('.banner-con').append(_img);
    $(".dbzq1 .nav-box .swiper-wrapper").append(_li);
    var _goodsHtml = '';
    var listGoods = models.listGoods;
    if(listGoods != null){
        for(var i=0;i< listGoods.length;i++){
            _goodsHtml += goodsHtml(listGoods[i]);
        }
    }
    var _html = `<div class="marker nav-con ${models.id}" style="${style}">
            <h5 class="title">${models.modelName}</h5>
            <ul class="goods-list flex">
               ${_goodsHtml}
            </ul>
        </div>`
    $('.nav-box').after(_html);
}
function tuijian(models){
    var listGoods = models.listGoods;
    $('.tuijian .title').html(models.modelName);

    if(listGoods != null){
        for(var i=0;i< listGoods.length;i++){
            var goods = listGoods[i];
            var distributionPrice = getDistributionPrice(goods.goodsProStandard);
            var goodsPrice = getGoodsPrice(goods.goodsProStandard);
            var _html = `<li class="goods-item"  onclick="goodsDetail('${goods.goodsId}')">
                    <div class="img-box">
                        <img src="${goods.thumbnail}" alt="">
                    </div>
                    <p class="goods-desc">${goods.goodsName}</p>
                    <p class="price-box">
                        <span class="cur-price">&yen;${distributionPrice}</span>
                        <span class="old-price">&yen;${goodsPrice}</span>
                    </p>
                </li>`;
           $('.tuijian ul').append(_html);
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