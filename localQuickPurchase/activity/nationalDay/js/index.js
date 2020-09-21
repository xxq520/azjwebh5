var indexSeckill = 0;
var indexPage;
(function(){
    indexPage = {
        init: function () {
            this.initData();
           /* this.tabTaggle();*/
            this.tabToggleData();
        },
        navSwiper: function (swiperName,size,space) {
            var swiper = new Swiper('.' + swiperName, {
                slidesPerView: size,
                spaceBetween: space,
            });
        },
       /* tabTaggle: function () {
            $('.nav-item').each(function (i) {
                $(this).click(function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    var text = $(this).text();
                    $('.tabTitle').text(text);
                })
            })
        },*/
        initData: function () {
            $.ajax({
                type: 'get',
                url: "/localQuickPurchase/sgMongoAction/seckillField",
                data: {},
                success: function (result) {
                    if (result.data != null && result.data.length > 0) {
                        var seckillField = result.data;
                        var seckill_html = "";
                        var field_html = "";
                        var param = {
                            "seckillId": seckillField[indexSeckill].seckillFieldId,
                            "countDownText": seckillField[indexSeckill].countDownText,
                            "beginTime": seckillField[indexSeckill].seckillFieldBeginTime,
                            "endTime": seckillField[indexSeckill].seckillFieldEndTime,
                            "activity": seckillField[indexSeckill].activity,
                            "fieldSize": seckillField.length
                        };
                        for (var i = 0; i < seckillField.length; i++) {
                            var currentTime = result.equipmentData;
                            //场次ID
                            var seckillId = seckillField[i].seckillFieldId;
                            //开始和结束区间
                            var intervalText = seckillField[i].intervalText;
                            //tab说明
                            var writing = seckillField[i].writing;
                            //倒计时说明
                            var countDownText = seckillField[i].countDownText;
                            //活动开始时间
                            var beginTime = seckillField[i].seckillFieldBeginTime;
                            //活动结束时间
                            var endTime = seckillField[i].seckillFieldEndTime;
                            //是否在活动中
                            var activity = seckillField[i].activity;
                            var _isOn = "";
                            if (i == 0) {
                                _isOn = "isOn";
                                indexPage.initSeckillGoods(seckillId);
                            }
                            var _html = `<li class="countDown-item seckill-item ${_isOn} swiper-slide" seckllId="${seckillId}"  onclick="selectSeckill(this)">
                                        <p class="time fs30">${intervalText}</p>
                                        <p class="status fs26">${writing}</p>
                                    </li>`;
                            $(".countDown").append(_html);
                        }
                        indexPage.navSwiper("swiper-container1",3,10);
                    }
                },
                error: function (data) {
                    hui.toast("网络错误,稍后重试");
                }
            });
        },
        initSeckillGoods: function (seckillId) {
            //参数
            var param = {"seckillId": seckillId, "pageIndex": 1, "pageSize": 2};

            //延时一秒,模拟联网
            $.ajax({
                type: 'GET',
                url: '/localQuickPurchase/sgMongoAction/seckillGoods',
                data: param,
                dataType: 'json',
                success: function (data) {
                    if (data.code == 200) {
                        $('.seckill-list').html("");
                        var goodsList = data.data.list;
                        if (goodsList == null || goodsList.length == 0) {
                            $('.seckill-list').html('<p style="font-size: 0.7rem;text-align: center;color: #e3e3e3;">暂时没有更多了!!</p>');
                        }
                        for (var i = 0; i < goodsList.length; i++) {
                            var goods = goodsList[i];

                            var seckillPrice = goods.goodsProStandard[0].seckillPrice;
                            var goodsPrice = getGoodsPrice(goods.goodsProStandard);
                            var hc = 0;//货存
                            var ys = 0;//已售
                            $.map(goods.goodsProStandard, function (index) {
                                //已售
                                hc += index.activityQuantity;
                                ys += index.sellActivityQuantity;
                            });
                            var _selledAll = '';
                            if (hc <= ys) {
                                //售完 遮罩层
                                _selledAll = '<img src="./images/selled-all.png" class="selledAll">';
                            }
                            var _html = `<li class="seckill-item" onclick="goodsJump('${goods.goodsId}',1)">
                                                <div class="pro-img">
                                                    <img src="${goods.thumbnail}">
                                                    ${_selledAll}
                                                </div>
                                                <div class="pro-details">
                                                    <p class="pro-title fs30 limit2">${goods.goodsName}</p>
                                                    <p class="pro-price">
                                                        <span class="price fs32 fw700">￥${seckillPrice}</span><span class="oldPrice fs24">￥${goodsPrice}</span>
                                                    </p>
                                                    <span class="jumpToDetail fs30">立即购买</span>
                                                </div>
                                            </li>`;
                            $('.seckill-list').append(_html);
                        }
                    }
                }
            });
        },
        tabToggleData: function () {
            $.ajax({
                url: "/localQuickPurchase/selectionGoods/actityColumn",
                type: "GET",
                dataType: "json",
                data: {
                    'actityType': 3,
                    'pageSize':8
                },
                success: function (res) {
                    if (res.code != 200) return;
                    getColumnHtml(res.data)
                }
            })
        },
        //加载更多
        getMore:function(columnName,columnId,pageIndex){
            var param = indexPage.getParame(pageIndex,columnName);
            $.ajax({
                url: '/localQuickPurchase/selectionGoods/SelectionGoodsCom',
                type: 'POST',
                data: param,
                contentType:'application/json;charset=UTF-8',
                success:function(result){
                    var data = {
                        list :　result.data.list
                    }
                    console.log(data.list);
                    if(data.list == null){
                        $("."+columnId+" .more-btn").html("没有更多了...");
                        hui.endLoadMore(true, '没有更多了...');
                        return false;
                    }
                    for(var i=0;i<data.list.length;i++){
                        var goods = data.list[i]
                        $('.'+columnId+' .pro-list').append(getGoodsHtml(goods));
                    }

                    hui.endLoadMore();
                },
                error:function(result){
                    hui.closeLoading();
                    //hui.upToast('连接服务器失败！');
                    hui.endRefresh();
                }
            })
        },
        getParame:function(pageIndex,columnName){
            return '{"columnName":"'+columnName+'" ,"pageIndex":'+pageIndex+',"pageSize":8}'
        }
    }
    indexPage.init();
})(jQuery);
function selectSeckill(obj){
    $(".seckill-item").removeClass("isOn");
    $(obj).addClass("isOn");
    var seckillId = $(obj).attr("seckllId");
    indexPage.initSeckillGoods(seckillId);
}
function changeColumn(obj){
    $(".column-item").removeClass("active");
    $(obj).addClass("active");
    var columnId = $(obj).attr("columnId");
    $(".column-goodsList").hide();
    $("."+columnId).show();
    var text = $(obj).text();
    $('.tabTitle').text(text);
}

function getGoodsHtml(goods,listIndex){
    //listIndex  为 0开始
    var _html = "";
    if(goods == null){
        return _html;
    }
    var distributionPrice = getDistributionPrice(goods.goodsProStandard);
    var goodsPrice = getGoodsPrice(goods.goodsProStandard);
    _html = `<li class="pro-item" onclick="goodsJump('${goods.goodsId}',0)">
        <div class="pro-img"><img src="${goods.thumbnail}"></div>
        <div class="pro-details">
        <p class="pro-title limit2 fs26">${goods.goodsName}</p>
        <p class="pro-price">
        <span class="price fs30">￥${distributionPrice}</span>
    <span class="oldPrice fs24">￥${goodsPrice}</span>
    </p>
    <p class="pro-bottom">
        <!--<span class="selled fs26">已售999件</span>-->
        <span class="jumpToDetails fs26">立即购买</span>
        </p>
        </div>
        </li>`;
    return _html;
}

function getColumnHtml(listCloumn){
    if(listCloumn == null || listCloumn.length ==0){
        return ;
    }
    for(var i = 0;i < listCloumn.length;i++){
        var  columnName = listCloumn[i].columnName;
        var  columnId = listCloumn[i].id;
        var _active = ''
        var _cloumnHtmlStyle = "display:none;";
        if(i==0){
            _active =  'active';
            _cloumnHtmlStyle ="";
            $('.tabTitle').text(columnName);
        }
        var _html = `<li class="nav-item column-item swiper-slide fs32 ${_active}" columnId="${columnId}" onclick="changeColumn(this)">${columnName}</li>`;
        $(".column").append(_html);
        var listGoods = listCloumn[i].listGoods;
        if(listGoods == null || listGoods.length == 0){
        }else{
            var _goodsHtml =""
            for(var j = 0;j <= listGoods.length;j++){
                _goodsHtml += getGoodsHtml(listGoods[j],j);
            }

            var _moreHtml = `<p class="more-btn radius-b" pageIndex="1" onclick="getMoreData('${columnName}','${columnId}',this )" >点击加载更多</p></div></div>`;
            var _cloumnHtml = `<div class="${columnId} column-goodsList" style="${_cloumnHtmlStyle}" ><ul class="pro-list" >
                    ${_goodsHtml}
                </ul> ${_moreHtml}</div>`;
            $('.main').after(_cloumnHtml)
        }
    }
    indexPage.navSwiper("swiper-container2",4.5,0);
}
function getMoreData(columnName,columnId,obj ){
    var pageIndexStr = $(obj).attr("pageIndex");
    var pageIndex = parseInt(pageIndexStr)+1
    $(obj).attr("pageIndex",pageIndex);
    indexPage.getMore(columnName,columnId,pageIndex)
}

function goodsJump(goodsId,index){
    if (index == 1) {
        window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq;
    } else {
        window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0/"+seq;
    }
}
function goBack(obj){
    try{
        // 调app原生返回
        window.action.app_back();
    }catch(e){
    }
    setTimeout(function(){
        if(document.referrer == ""){
            window.location.href="/localQuickPurchase/distributionVA/index";
        }else{
            history.go(-1);
        }
    }, 200);
}
// 商品二维码
var urlVal = window.location.href;//活动页的地址
var appUrl = urlVal+"?checkShare=1&shareSeq="+seq;
var urlValStr =  escape(appUrl);
$(".ewmcode img").attr("src","/localQuickPurchase/shareQRCode/stringQRCode?urlVal="+urlValStr);
function qrCode(){
    var ewmcodeVal = $(".ewmcode").attr("value");
    if(ewmcodeVal == "0"){
        $(".mask").show();
        $(".ewmcode").show();
        $(".ewmcode").attr("value","1");
    } else{
        $(".mask").hide();
        $(".ewmcode").hide();
        $(".ewmcode").attr("value","0");
    }
}
// 复制链接
var clipboard = new Clipboard('.copylink', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function() {
        var link = urlVal+"?checkShare=1&shareSeq="+seq;
        return link;
    }
});
clipboard.on('success', function(e) {
    var $copysuc = $("<div class='copy-tips'><div class='copy-tips-wrap'>☺ 复制成功</div></div>");
    $("body").find(".copy-tips").remove().end().append($copysuc);
    $(".copy-tips").fadeOut(2000);
    e.clearSelection();
});
clipboard.on('error', function(e) {
    hui.toast('复制失败!');
});
function hiddend() {
    $("html,body").css("overflow", "visible");
    hui.dialogClose();
    $(".share-block").slideUp(200);
    qeCodehiddend()
}

function qeCodehiddend() {
    $(".ewmcode").hide();
    $(".mask").hide();
    $(".ewmcode").attr("value","0");
}

//点击分享按钮
function share() {
    // 分享
    //判断是否是app
    var u = navigator.userAgent;
    //var shareGoodsPic = $(".hui-swipe-item").find("img:first").attr("src");
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        //点击分享
        share520Love(appUrl,'爱之家商城中秋专题活动','','','.share-content');
    } else{
        share520LoveWeb(appUrl,'爱之家商城中秋专题活动','','','.share-content');
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
}