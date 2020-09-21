var seckill_param ={"state":1,"pageIndex":1,"pageSize":10};

(function () {
    var indexPage = {
        init: function () {
            this.initDate()
            //this.banner();
            //this.onSale();
            //this.secTab();
            //this.brandBanner();
            //this.footerTabTaggle();
        },
        //首页初始化数据
        initDate: function () {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/goods/homePageIntegrationAction/v4/homePage',
                data: {
                    'seq': seq
                },
                async: false,
                success: function (result) {
                    if (result.code == 1000) {
                        for (var i = 0; i < result.data.homePageColumn.length; i++) {
                            var column = result.data.homePageColumn[i];
                            var _html = "";
                            if (column.celoveColumnStyle == 1) {//banner
                                _html = indexPage.getBannerHtml(column);
                                $(".main").append(_html);
                                indexPage.banner();
                            } else if (column.celoveColumnStyle == 2 || column.celoveColumnStyle == 3) {//优惠券
                                _html = indexPage.getCouponHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 4) {//画廊  商品(左右滑动)
                                _html = indexPage.getOnSaleHtml(column);
                                $(".main").append(_html);
                                indexPage.onSale();
                            } else if (column.celoveColumnStyle == 5) {//做一右二
                                _html = indexPage.getBenefitHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 6) {//上一下二
                                _html = indexPage.getSelectionHtml(column)
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 7) {//画廊  (banner + 商品为一个Item)  (左右滑动)
                                _html = indexPage.getBrandHtml(column);
                                $(".main").append(_html);
                                // indexPage.brandBanner();
                            } else if (column.celoveColumnStyle == 8) {// 秒杀
                                _html = indexPage.getSeckillHtml(column);
                                $(".main").append(_html);
                            } else if (column.celoveColumnStyle == 9) {//商品列表 每行两个
                                _html = indexPage.getHotionHtml(column);
                                $(".main").append(_html);
                            }else if(column.celoveColumnStyle == 10){
                                _html = indexPage.getBoomHtml(column);
                                $(".main").append(_html);
                            }else if(column.celoveColumnStyle == 11){
                                _html = indexPage.getRecommendHtml(column);
                                $(".main").append(_html);
                                indexPage.countDown();
                            }
                        }
                    }
                },
            });
        },
        //轮播广告
        banner: function () {
            var swipe1 = new huiSwpie('#swipe1');
            swipe1.autoPlay = true;
            swipe1.indicatorOn = true;
            swipe1.delay = 5000;
            swipe1.speed = 200;
            swipe1.run();
        },
        //倒计时
        countDown:function(){
            $.leftTime("2019/01/22 23:45:24",function(d){
                if(d.status){
                    var $dateShow=$(".timeOut");
                    $dateShow.find(".day").html(d.d);
                    $dateShow.find(".hour").html(d.h);
                    $dateShow.find(".min").html(d.m);
                    $dateShow.find(".sec").html(d.s);
                }
            });
        },
        //天天特价
        onSale: function () {
            var swiper2 = new Swiper('#swiper2', {
                slidesPerView: 3.5,
                paginationClickable: true,
                freeMode: false,
                loop: false
            });
        },
        //品牌广场轮播
        brandBanner: function () {
            var swipe2 = new huiSwpie('#swipe2');
            swipe2.indicatorOn = false;
            swipe2.loop = false;
            swipe2.autoPlay = false;
            swipe2.speed = 200;
            swipe2.run();
        },
        //获取banner html
        getBannerHtml: function (column) {
            if (column.listBanner == null) {
                console.log("getCouponHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return _html;
            }
            var _html = '<!--轮播模块-->' +
                '<div class="banner">' +
                indexPage.columnFun(column)+
                '<div class="hui-swipe" id="swipe1">' +
                '<div class="hui-swipe-items">';
            for (var i = 0; i < column.listBanner.length; i++) {
                var itemc = column.listBanner[i];
                var jumpTarget = itemc.jumpTarget;
                if (jumpTarget == null || jumpTarget == "#") {
                    jumpTarget = "JavaScript:;";
                }
                _html += '<div class="hui-swipe-item"><a href="' + jumpTarget + '" ><img src="' + itemc.imageLocation + '"/></a></div>';
            }
            _html += '</div>' +
                //'<div class="swiper-pagination"></div>'+
                '</div></div>';
            return _html;
        },
        //获取优惠券 html
        getCouponHtml: function (column) {
            if(column.listBanner == null || column.listBanner.length == 0){
                console.log("getCouponHtml 数据不满住数据渲染页面,跳过  不显示此栏目:"+column.columnName)
                return "";
            }
            var jumpTarget = "javascript:;"
            if (column.celoveColumnStyle == 2) {
                jumpTarget = "/localQuickPurchase/distributionVA/receiveCoupons";
            } else if (column.listBanner[0].jumpTarget != null && column.listBanner[0].jumpTarget != "#") {
                jumpTarget = column.listBanner[0].jumpTarget;
            }
            var _html = '<!--优惠券-->' +
                '<div>'+
                indexPage.columnFun(column)+
                '<div class="coupon-box wBg">' +
                '<a href="' + jumpTarget + '"> <img src="' + column.listBanner[0].imageLocation + '"/></a></div>' +
                '</div>';
            return _html;
        },
        //推荐模块
        getRecommendHtml:function(column){

            if(column.listBanner == null || column.listBanner.length == 0){
                console.log("getCouponHtml 数据不满住数据渲染页面,跳过  不显示此栏目:"+column.columnName)
                return "";
            }
            var jumpTarget ="javascript:;"
            if(column.celoveColumnStyle == 2){
                jumpTarget = "/localQuickPurchase/distributionVA/receiveCoupons";
            }else if(column.listBanner[0].jumpTarget != null && column.listBanner[0].jumpTarget !="#"){
                jumpTarget = column.listBanner[0].jumpTarget;
            }
            var _html =`
				<!--推荐专区-->
				<div class="recommend wBg mgTop">`+
                indexPage.columnFun(column)+
                `<div class="recommend1">
						<div class="secKill">
							<!--<p class="sec-title fs28 fw7">秒杀专区</p>
							<p class="sec-info fs20 c9 limit1">每天特价商品 好货不断</p>
							<p class="timeOut fs24"><span class="day fs24">01</span>天<span class="hour fs24">01</span>:<span class="min fs24">54</span>:<span class="sec fs24">32</span></p>
							<div class="sec-img">
								<a href="${column.listBanner[0].jumpTarget}">
									<img src="${column.listBanner[0].imageLocation}"/>
									<span class="sec-price fs30 wclor">19.9</span>
								</a>
							</div>-->
							<a href="${column.listBanner[0].jumpTarget}">
								<img src="${column.listBanner[0].imageLocation}"/>
							</a>
						</div>
						<div class="big">
							<div class="onSale">
								<!--<div class="onSale-text">
									<p class="onSale-title fs28 fw7">天天特价</p>
									<p class="onSale-info fs20 c9 limit1">进口泰国芒果，低至2.9元</p>
									<p class="onSale-price">
										<span class="price fs30 money fw7">16</span>
										<span class="oldPrice fs20 money c9">31.99</span>
									</p>
								</div>
								<div class="onSale-img">
									<a href="${column.listBanner[1].jumpTarget}">
										<img src="${column.listBanner[1].imageLocation}"/>
									</a>
								</div>-->
								<a href="${column.listBanner[1].jumpTarget}">
									<img src="${column.listBanner[1].imageLocation}"/>
								</a>
							</div>
							<div class="small">
								<div class="fine">
									<!--<p class="fine-title fs28 fw7">严选精品</p>
									<p class="fine-info fs20 c9 limit1">MSD淡化痘印祛斑膏</p>
									<div class="desc">
										<div class="text">
											<p class="spec fs20">2支装</p>
											<p class="price money fs30 fw7">69</p>
											<p class="oldPrice c9 money fs20">80.99</p>
										</div>
										<div class="fine-img">
											<a href="${column.listBanner[2].jumpTarget}">
												<img src="${column.listBanner[2].imageLocation}"/>
											</a>
										</div>
									</div>-->
									<a href="${column.listBanner[2].jumpTarget}">
										<img src="${column.listBanner[2].imageLocation}"/>
									</a>
								</div>
								<div class="benefit">
									<!--<p class="benefit-title fs28 fw7">真实惠</p>
									<p class="benefit-info fs20 c9 limit1">特推优惠商品</p>
									<div class="benefit-img">
									</div>-->
									<a href="${column.listBanner[3].jumpTarget}">
										<img src="${column.listBanner[3].imageLocation}"/>
									</a>
								</div>
							</div>
						</div>
					</div>
					<div class="recommend2">
						<div class="cutPrice">
							<!--<div class="cutPrice-desc">
								<p class="cutPrice-title fs28 fw7 wclor">砍价专区</p>
								<p class="cutPrice-info fs24 wclor limit1">进口儿童牛奶6盒</p>
								<p class="goBuy">
									<span class="goBuy-btn fs20 wBg">立即进入<img src="images/icon2/ios/ljjr_icon@3x.png"/></span>
								</p>
							</div>
							<div class="cutPrice-img">
								<a href="${column.listBanner[4].jumpTarget}">
									<img src="${column.listBanner[4].imageLocation}"/>
									<span class="rt fs18 wclor texcen">免费</span>
								</a>
							</div>-->
							<a href="${column.listBanner[4].jumpTarget}">
								<img src="${column.listBanner[4].imageLocation}"/>
							</a>
						</div>
						<div class="newest">
							<!--<div class="newest-desc">
								<p class="newest-title fs28 fw7 wclor">每日上新</p>
								<p class="newest-info fs24 limit1 wclor">跨品牌2件6折</p>
								<p class="goBuy">
									<span class="goBuy-btn fs20 wBg">立即进入<img src="images/icon2/ios/ljjr_icon2@3x.png"/></span>
								</p>
							</div>
							<div class="newest-img">
								<a href="${column.listBanner[5].jumpTarget}">
									<img src="${column.listBanner[5].imageLocation}"/>
								</a>
							</div>-->
							<a href="${column.listBanner[5].jumpTarget}">
								<img src="${column.listBanner[5].imageLocation}"/>
							</a>
						</div>
					</div>
				</div>
			`;
            return _html;
        },
        //获取天天特价 html
        getOnSaleHtml: function (column) {
            if (column.listGoods == null) {
                console.log("getOnSaleHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return _html;
            }
            var _html = '<!--天天特价-->' +
                '<div class="on-sale wBg mgTop">' +
                '<div class="on-sale-top common">' +
                '<span class="ost ct">' + column.columnName + '</span>' +
                '<span onclick="selectionJump(\'' + column.columnName + '\')" class="more">更多 <img src="/goods/images/right.png"/></span>' +
                '</div>' +
                '<div class="on-sale-swiper swiper-container swiper-container-horizontal" id="swiper2">' + '<div class="on-sale-list swiper-wrapper">';
            for (var i = 0; i < column.listGoods.length; i++) {
                var goods = column.listGoods[i];
                var goodsId = goods.goodsId;
                var goodsProStandard = goods.goodsProStandard;
                _html +=
                    '<div class="on-sale-item swiper-slide"   onclick="goodsJump(\'' + goodsId + '\',null)" >' +
                    '<div class="on-sale-img"><img src="' + goods.thumbnail + '"/></div>' +
                    '<div class="on-sale-details">' +
                    '<p class="on-sale-title limit1">' + goods.goodsName + '</p>' +
                    '<p class="on-sale-price">' +
                    '<span class="price">￥' + getDistributionPrice(goodsProStandard) + '</span>' +
                    '<span class="oldPrice">￥' + getGoodsPrice(goodsProStandard) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>';
            }
            _html += '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        //获取大兵爆款 html
        getBoomHtml:function(column){
            if(column.group.listGoods == null){
                console.log("getHotionHtml 数据不满住数据渲染页面,跳过  不显示此栏目:"+column.columnName)
                return "";
            }
            var _html =`
				<!--爆款专区-->
				
				<div class="boom mgTop wBg" style="background-image:url(${column.group.banner.imageLocation})">
					<!--<p class="boom-title fs36 fw7">大兵·爆款专区<img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></p>
					<p class="boom-info fs26">让你的生活有点不一样~</p>-->
					<a href = "${column.group.banner.jumpTarget}">
						<div class="clickSquare"></div>
					</a>
					<div class="boomList wBg">
			`;
            for (var i = 0; i < column.group.listGoods.length; i++) {
                _html +=`
							<div class="boomItem"   onclick="goodsJump('${column.group.listGoods[i].goodsId}',null)" >
								<div class="pro-img"><img src="${column.group.listGoods[i].thumbnail}"/></div>
								<p class="pro-title limit1 fs22">${column.group.listGoods[i].goodsName}</p>
								<p class="pro-price money pricecolr fs20">${column.group.listGoods[i].goodsProStandard[0].goodsPrice}</p>
							</div>
						`;
            }
            _html +='</div>'+
                '</div>' ;


            return _html;
        },
        //获取真实惠 html
        getBenefitHtml: function (column) {
            var _html = "";
            if (column.listBanner == null || column.listBanner.length != 3) {
                console.log("getBenefitHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            _html = '<!--臻实惠-->' +
                '<div class="benefit wBg mgTop">' +
                '<div class="benefit-top common">' +
                '<span class="bt ct">' + column.columnName + '</span>' +
                '<span onclick="selectionJump(\'' + column.columnName + '\')" class="more">更多 <img src="/goods/images/right.png"/></span>' +
                '</div>' +
                '<div class="benefit-box">' +
                '<div class="big">' +
                '<a href="' + column.listBanner[0].jumpTarget + '" ><img src="' + column.listBanner[0].imageLocation + '"/></a>' +
                '</div>' +
                '<div class="small">' +
                '<div>' +
                '<a href="' + column.listBanner[1].jumpTarget + '" ><img src="' + column.listBanner[1].imageLocation + '"/></a>' +
                '</div>' +
                '<div>' +
                '<a href="' + column.listBanner[2].jumpTarget + '" ><img src="' + column.listBanner[2].imageLocation + '"/></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        //获取严选精品 html
        getSelectionHtml: function (column) {
            if (column.listBanner == null || column.listBanner.length != 3) {
                console.log("getSelectionHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<!--严选精品-->' +
                '<div class="fine wBg mgTop">' +
                '<div class="fine-top common">' +
                '<span class="ct">' + column.columnName + '</span>' +
                '<span onclick="selectionJump(\'' + column.columnName + '\')" class="more">更多 <img src="/goods/images/right.png"/></span>' +
                '</div>' +
                '<div class="fine-box">' +
                '<div class="big"><a href="' + column.listBanner[0].jumpTarget + '" ><img src="' + column.listBanner[0].imageLocation + '"/></a></div>' +
                '<div class="small">' +
                '<div><a href="' + column.listBanner[1].jumpTarget + '" ><img src="' + column.listBanner[1].imageLocation + '"/></a></div>' +
                '<div><a href="' + column.listBanner[2].jumpTarget + '" ><img src="' + column.listBanner[2].imageLocation + '"/></a></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        //获取热销商品 html
        getHotionHtml: function (column) {
            if (column.listGoods == null) {
                console.log("getHotionHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<!--热销商品-->' +
                '<div class="hot mgTop wBg">' +
                '<div class="hot-top common">' +
                '<span class="ct">' + column.columnName + '</span>' +
                '<span onclick="selectionJump(\'' + column.columnName + '\')" class="more">更多 <img src="/goods/images/right.png"/></span>' +
                '</div>' +
                '<div class="hot-list">';
            for (var i = 0; i < column.listGoods.length; i++) {
                var goods = column.listGoods[i];
                var goodsId = goods.goodsId;
                var goodsProStandard = goods.goodsProStandard;
                var distributionPrice = getDistributionPrice(goodsProStandard).toString();
                var distributionPriceArr = distributionPrice.split(".");
                var distributionPrice1;
                var distributionPrice2;
                if (distributionPriceArr.length == 2) {
                    distributionPrice1 = distributionPriceArr[0]
                    distributionPrice2 = distributionPriceArr[1]
                } else {
                    distributionPrice1 = distributionPriceArr[0];
                    distributionPrice2 = "00";
                }
                _html += '<div class="hot-item">' +
                    '<div class="hot-img"  onclick="goodsJump(\'' + goodsId + '\',null)" ><img src="' + goods.thumbnail + '"/></div>' +
                    '<div class="hot-details">' +
                    '<p class="hot-title limit2 fs12">' + goods.goodsName + '</p>' +
                    '<p class="hot-price pcolr">' +
                    '<span class="yuan pcolr fs11">￥</span>' +
                    '<span class="int pcolr fs16">' + distributionPrice1 + '</span>.' +
                    '<span class="float pcolr fs11">' + distributionPrice2 + '</span>' +
                    '<span class="oldPrice opcolr fs11">￥' + getGoodsPrice(goodsProStandard) + '</span>' +
                    '</p>' +
                    '</div>' +
                    '</div>';
            }
            _html += '</div>' +
                '</div>';
            return _html;
        },
        //获取秒杀 html
        getSeckillHtml: function (column) {
            if (column.group == null) {
                console.log("getSeckillHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var banner = column.group.banner;
            var field = column.group.seckillField;
            var seckill_html = "";
            var jumpTarget = "javascript:;"
            if (banner.jumpTarget != null && banner.jumpTarget != "#") {
                jumpTarget = banner.jumpTarget;
            } else {
                jumpTarget = "/goods/saleLimit";
            }
            seckill_html += '<a href="' + jumpTarget + '" > <img class="salaindex_col mgTop" src="' + banner.imageLocation + '" /></a>';
            seckill_html += '<div class="hui-tab wbg">';
            seckill_html += '<div class="hui-tab-title">';

            var listSize = 0;
            if (field != null && field != undefined && field.length > 0){
                if (field.length > 3){
                    listSize = 3
                } else {
                    listSize = field.length;
                }
                /*渲染秒杀场次*/
                for (var i = 0; i < listSize; i++) {
                    //场次ID
                    var seckillId = field[i].seckillFieldId;
                    //开始和结束区间
                    var intervalText = field[i].intervalText;
                    //tab说明
                    var writing = field[i].writing;
                    if (i == 0) {
                        seckill_html += '<div class="seckill-list hui-tab-active" num="'+i+'" onclick="getSaleLimit(this,'+i+','+seckillId+')" style="width: 33.3%!important;">';
                    } else {
                        seckill_html += '<div class="seckill-list" num="'+i+'" onclick="getSaleLimit(this,'+i+','+seckillId+')" style="width: 33.3%!important;">';
                    }
                    seckill_html += '<span class="font-md">'+intervalText+'</span>';
                    seckill_html += '<span class="padding-t-1">'+writing+'</span>';
                    seckill_html += '<span class="sale-active"></span>';
                    seckill_html += '</div>';
                }
            } else{
                return;
            }
            seckill_html += '</div>';
            seckill_html += '<div class="index_line"></div>';
            seckill_html += '<div class="hui-list index_list_content" style="padding-bottom:0 ;">';
            seckill_html += '<div class="set-goods set-goods-seckill">';

            seckill_html += '</div>';
            seckill_html += '</div>';
            $(".salaindex").html(seckill_html);
            getSaleLimit(seckill_html,0,field[0].seckillFieldId)
            return seckill_html;
        },
        //获品牌广场 html
        getBrandHtml: function (column) {
            if (column.groups == null) {
                console.log("getBrandHtml 数据不满住数据渲染页面,跳过  不显示此栏目:" + column.columnName)
                return "";
            }
            var _html = '<!-- 品牌广场 -->' +
                '<div class="brand mgTop wBg">' +
                '<div class="brand-top common">' +
                '<span class="ct">' + column.columnName + '</span>' +
                '<a href ="' + column.jumpTarget + '"<span class="more">更多 <img src="/goods/images/right.png"/></span></a>' +
                '</div>' +
                '<div class="brand-box hui-swipe" id="swipe2" style="height: 340px;">' +
                '<div class="hui-swipe-items">';
            for (var i = 0; i < column.groups.length; i++) {
                var banner = column.groups[i].banner;
                var listGoods = column.groups[i].listGoods;
                _html += '<div class="brand-box-item hui-swipe-item">' +
                    '<div class="brand-banner"><img src="' + banner.imageLocation + '"></div>' +
                    '<div class="brand-list">';
                for (var j = 0; j < listGoods.length; j++) {
                    //console.log("品牌广场  "+listGoods.length);
                    var goods = listGoods[j]
                    var goodsId = goods.goodsId;
                    var goodsProStandard = goods.goodsProStandard;
                    _html += '<div class="brand-item"  onclick="goodsJump(\'' + goodsId + '\',null)" >' +
                        '<div class="brand-img"><img src="' + goods.thumbnail + '"></div>' +
                        '<div class="brand-desc">' +
                        '<p class="brand-price pcolr">￥' + getDistributionPrice(goodsProStandard) + '</p>' +
                        '<p class="selled">已售：' + goods.sales + '</p>' +
                        '</div>' +
                        '</div>';
                }
                _html += '</div>' +
                    '</div>';
            }

            _html += '</div>' +
                '</div>' +
                '</div>';
            return _html;
        },
        secTab: function () {
            $('.seckill-list').each(function (i) {
                $(this).on('click', function () {
                    $('.seckill-list').eq(i).addClass('hui-tab-active').siblings().removeClass('hui-tab-active');
                })
            })
        },
        columnFun:function (column){
            var columnHtml = '';
            //   column.followingBlank = 20 为APP的空白高度   需要除以 2  才能显示正常高度   转换为rem  需要再除以 16
            var heightRem = column.followingBlank/60;
            if(!column.columnNameShow && !column.hasloadMore){
                columnHtml += '<div style="height:'+ heightRem +'rem;background-color:#F0F0F0;"></div><div class="brand-top common" style="height:0;">';
            }else{
                columnHtml += '<div style="height:'+ heightRem +'rem;background-color:#F0F0F0;"></div><div class="brand-top common" >';
            }
            if(column.columnNameShow){

                columnHtml += '<span class="bt ct">'+column.columnName+'</span>';
            }
            if(column.hasloadMore){
                if(column.jumpTarget !="" && column.jumpTarget != null){
                    columnHtml +=  '<a href ="'+ column.jumpTarget +'" ><span class="more">更多 <img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></span></a>';
                }else{
                    columnHtml += '<span onclick="selectionJump(\''+ column.columnName +'\')" class="more">更多 <img src="/localQuickPurchase/distributionApp/images/icon/right.png"/></span>';
                }
            }
            columnHtml += '</div>';
            return columnHtml;
        }
    }
    indexPage.init();
})(jQuery);

function getSaleLimit(obj,index,seckillId){
    if (seckillId == null || seckillId == undefined){
        return;
    }
    console.log("tab=============list:1");
    seckill_param ={"seckillId":seckillId,"pageIndex":1,"pageSize":2};
    $(obj).siblings().removeClass("hui-tab-active");
    $(obj).addClass("hui-tab-active");
    $.ajax({
        type: 'GET',
        url: '/goods/seckillGoods/goodsInfo',
        data : seckill_param,
        dataType: 'json',
        success : function(data){
            if (data.code == 1000) {
                if (data.data.rows != null && data.data.rows.length > 0) {
                    var sale_html = "";
                    var sort = 0;
                    var saleList = data.data.rows;
                    for (var i = 0; i < saleList.length; i++) {
                        var thumbnail = saleList[i].thumbnail;//缩略图
                        var goodsName = saleList[i].goodsName;//商品名
                        var goodsId = saleList[i].goodsId;//商品名
                        //var distributionPrice = saleList[i].goodsProStandard[0].distributionPrice;//分销价
                        var seckillPrice = saleList[i].goodsProStandard[0].seckillPrice;//秒杀价格
                        var goodsPrice = saleList[i].goodsProStandard[0].goodsPrice;//原价、零售价
                        var activityStartTime = saleList[i].goodsProStandard[0].activityStartTime;//活动开始时间
                        //var activityFinishTime = saleList[i].goodsProStandard[0].activityFinishTime;//活动结束时间
                        var filds = 0;
                        var timeNow = new Date();//当前时间 -- 获取;
                        if (index == 3) {
                            filds = 1;
                        }
                        if (index == 0){
                            if (activityStartTime > timeNow) {
                                filds = 1;
                            }
                        }
                        sale_html += '<div onclick="goodsJump(\''+ goodsId +'\','+index+')" ';
                        if (sort == 0) {
                            sale_html += ' class="set_left">';

                            sort = 1;
                        } else {
                            sale_html += ' class="set_right">';

                            sort = 0;
                        }
                        sale_html += '<img src="'+thumbnail+'" class="goodsDetail" goodsId="'+goodsId+'" num="'+index+'" indexNum="'+filds+'"/>';
                        sale_html += '<p class="margin-t-3 set-goods-price">¥'+seckillPrice+'<span class="dis-price"><s>¥'+goodsPrice+'</s></span></p>';
                        sale_html += '<p class="margin-t-3 set-goods-title">'+goodsName+'</p>';
                        /* sale_html += '<span class="margin-t-3">严选</p>'; */
                        sale_html += '</div>';
                    }
                    $(".set-goods-seckill").html(sale_html);
                } else {
                    //hui.alert("-- 秒杀列表暂无更多数据 --");
                    var html_null = '<span class="downList">--- 暂无更多数据 ---</span>';
                    $(".set-goods-seckill").html(html_null);
                }
            } else {
                hui.alert("-- 秒杀列表请求数据失败 --");
            }
        }
    })
}

function goodsJump(goodsId,index){
	if (index != null) {
        window.location.href="/goods/goods/saleLimit.html?index="+index;
	} else {
        window.location.href="/goods/goods/goodsDetail/goodsDetail.html?goodsId="+goodsId;
	}
}

function selectionJump(selection){
	window.location.href="/goods/goods/selectionGoodsCom.html?name="+selection;
}