var Coums=shopgd(seq);
function  jumpCoupon(){
    window.location.href="/localQuickPurchase/activity/baiye.html";
}
//获取优惠券图标
function getYhqHtml(data){
    var goodsYhq = data.yHQ;
    var type=getRoleType();
    var yhqHtml = "";
    if (goodsYhq) {
        if (type==1||type==2||!type) {
            yhqHtml+='<img style="  height: 20px; width: 95%;position: absolute; bottom: 5px;right: 0;"src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else if ((type==3 ||type==4)&& Coums<=100) {
            yhqHtml+='<img style="  height: 20px; width: 95%;position: absolute; bottom: 5px;right: 0;" src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else {
            yhqHtml+=""
        }
    } else {yhqHtml+=""}
    return yhqHtml;
}
$(function () {
    $.ajax({
        type: 'GET',
        url: '/localQuickPurchase/sgMongoAction/seckillField',
        dataType: 'json',
        success:function(data){
            var dataInfo = data.data;
            if (dataInfo != null && dataInfo.length>0){
                var rushToBuyText = dataInfo[0].rushToBuyText;
                var seckillFieldId = dataInfo[0].seckillFieldId;
                var seckillFieldBeginTime = dataInfo[0].seckillFieldBeginTime;
                var seckillFieldEndTime = dataInfo[0].seckillFieldEndTime;
                $('.countdownTimeText').html(rushToBuyText);
                countdown(seckillFieldEndTime);
                goodsInfo(seckillFieldId);
            } else {
                //没有数据执行操作
                goodsInfo()
            }
        }
    })

    //初始化商品数据
    function goodsInfo(seckillFieldId) {
        //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,重置列表数据;
        var mescroll = new MeScroll("mescroll", {
            up: {
                callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
                clearEmptyId: "newsList", //1.下拉刷新时会自动先清空此列表,再加入数据; 2.无任何数据时会在此列表自动提示空
                toTop: { //配置回到顶部按钮
                    src: "/localQuickPurchase/coupons/images/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                    //offset : 1000
                }
            }
        });
        /*商品剩余量进度条实现*/
        function progress() {
            var length = $(".productList li").length;
            console.log(length)
            $(".productList li").each(function () {
                // 获取当前的li 的index
                var thatindex = ($(this).index());
                thatindex=$(this).find(".hui-progress").eq(0).prop("id");
                //每个进度条添加一个id属性
                //    console.log($(this).children($('.hui-progress'))) ;
                //$(this).children($('.hui-progress')).attr('id','progress'+thatindex);
                var num = $(this).attr("num");
                //通过进度条对象的 progressBar()函数来设置进度 (0 - 100)
                hui('#' + thatindex).progressBar(num);
            })
        }
        /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
        function getListData(page) {
            //联网加载数据
            getListDataFromNet(page.num, page.size, function (curPageData) {
                //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
                console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.list.length);

                //方法一(推荐): 后台接口有返回列表的总页数 totalPage
                //mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

                //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
                //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

                //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
                mescroll.endSuccess(curPageData.pageSize, curPageData.hasNextPage); //必传参数(当前页的数据个数, 是否有下一页true/false).hasNextPage

                //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
                // mescroll.endSuccess(curPageData.list.length);

                //设置列表数据,因为配置了emptyClearId,第一页会清空dataList的数据,所以setListData应该写在最后;
                setListData(curPageData);
            }, function () {
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                mescroll.endErr();
            });
        }

        /*设置列表数据*/
        function setListData(data) {
            var pageIndex = data.pageIndex;
            var commodity = data.list;
            var type = getRoleType();
            console.log(data)
            var html = "";
            if (commodity != null && commodity.length>0){
                for (var i = 0; i < commodity.length; i++) {
                    var goodsName = commodity[i].goodsName;//商品名字
                    var goodsImg = commodity[i].thumbnail;//商品图片
                    var goodsId = commodity[i].goodsId;//商品ID
                    var goodsProStandard = commodity[i].goodsProStandard;
                    var sellPercentage = commodity[i].sellPercentage;//已抢百分比
                    var totalPseudoSales = commodity[i].totalPseudoSales;//已抢总数量
                    var actualPrice = commodity[i].actualPrice;//已抢总数量
                    var comparativePrice = commodity[i].comparativePrice;//已抢总数量

                    var distributionPrice = goodsProStandard[0].distributionPrice;//分销价
                    var goodsPrice = goodsProStandard[0].goodsPrice;//商品原价
                    var seckillPrice = goodsProStandard[0].seckillPrice;//秒杀价
                    var seckillUnivalence = goodsProStandard[0].seckillUnivalence;//秒杀出厂单价
                    var sellActivityQuantity = goodsProStandard[0].sellActivityQuantity;//已抢件数
                    var discount = getDiscount(seckillPrice,goodsPrice);
                    html +='<li num="'+sellPercentage+'">';
                    html +='<div class="img_box">';
                    html +='<img src="'+goodsImg+'" num="'+goodsId+'" onclick="robberyNow(this)" alt="">';
                    html +='<i>'+discount+'折</i>';

                    if (type==1||type==2||!type) {
                        html += '<img style="  height: 20px; width: 35%;position: absolute; bottom: 10px;right: 0;"  src="/localQuickPurchase/coupons/images/home_icon_label_1@2x.png" onclick=jumpCoupon()>';
                    }else if ((type==3 ||type==4)&& Coums<=100) {
                        html += '<img style="  height: 20px; width: 35%;position: absolute; bottom: 10px;right: 0;"  src="/localQuickPurchase/coupons/images/home_icon_label_1@2x.png" onclick=jumpCoupon()>';
                    }else {
                        html+=""
                    }
                    html +='</div>';
                    html +='<div class="product_info">';
                    html +='<p>'+goodsName+'</p>';
                    html +='<div class="items">';
                    <!-- 进度条 -->
                    html +='<div class="hui-progress" id="progress'+commodity[i].goodsId+'">';
                    html +='<i>'+sellPercentage+'%</i>';
                    html +='<span></span>';
                    html +='</div>';

                    if(totalPseudoSales != null && totalPseudoSales != 0){

                        var hotValue=parseInt(totalPseudoSales);
                        var showValue=hotValue;
                        if(hotValue>=10000){
                            showValue="";
                            var wan=(hotValue+"").slice(0,1);
                            var qian=(hotValue+"").slice(1,2);
                            showValue=wan+"."+qian+"万";
                        }
                        if(hotValue>=300){
                            html +='<p class="count" ><img src="/localQuickPurchase/activity/images/page2_bkms_icon_hot_1.png" style="width: 48px;height: 20px; display: inline-block;margin-right: 5px;"><span style="position: relative;top: -5px;">'+showValue+'</span></p>';
                        }else if(hotValue>=150&&hotValue<300){
                            html +='<p class="count" ><img src="/localQuickPurchase/activity/images/page2_bkms_icon_hot_2.png" style="width: 48px;height: 20px; display: inline-block;margin-right: 5px;"><span style="position: relative;top: -5px;">'+showValue+'</span></p>';
                        }else{
                            html +='<p class="count" ><img src="/localQuickPurchase/activity/images/page2_bkms_icon_hot_3.png" style="width: 48px;height: 20px; display: inline-block;margin-right: 5px;"><span style="position: relative;top: -5px;">'+showValue+'</span></p>';
                        }

                   }
                    html +='</div>';
                    html +='<div class="items">';
                    html +='<div class="price">';
                    html +='<p class="special">￥'+actualPrice+'</p>';
                    html +='<p class="normal">￥'+comparativePrice+'</p>';
                    html +='</div>';
                    html +='<div class="btn_box">';
                    html +='<button class="shareBtn" id="'+goodsId+'" name="'+goodsName+'" onclick="goDownBottom();"><i class="share_icon"></i>分享</button>';
                    html +='<button class="buyBtn" id="'+goodsId+'" onclick="robberyNow(this)">马上抢</button>';
                    html +='</div>';
                    html +='</div>';
                    html +='</div>';
                    html +='</li>';
                }

                $(".news-list").append(html);
                progress()
                $('.haveData').show();
                if (type==5|| type==6 ) {
                    $(".hehe").hide();
                }
                if ((type==3 ||type==4)&& Coums>100){
                    $(".hehe").hide();
                }
            } else {
                hui.refresh('#refreshContainer', refresh);	//绑定下拉刷新
            }
        }

        /*联网加载列表数据
        在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
            请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
        实际项目以您服务器接口返回的数据为准,无需本地处理分页.
        * */
        function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
            var param = {"seckillId":seckillFieldId,"pageIndex": pageNum, "pageSize": pageSize}
            //延时一秒,模拟联网
            setTimeout(function () {
                $.ajax({
                    type: 'GET',
                    url: '/localQuickPurchase/sgMongoAction/seckillGoods',
                    data: param,
                    dataType: 'json',
                    success: function (data) {
                        //请求成功回调
                        var code = data.code;
                        if(code == 200){
                            successCallback(data.data);
                        }else{
                            // selectionGoods()
                            hui.refresh('#refreshContainer', refresh);	//绑定下拉刷新
                        }
                    },
                    error: errorCallback
                });
            }, 1000)
        }

        /**
         * 调用iframe父级发圈页面中的方法
         */
        goDownBottom = function(){
            parent.goDownBottomParent();
        }

        /**
         * 获取为您推荐商品
         */
        /*function selectionGoods() {
            $.ajax({
                type : 'post',
                dataType : 'json',
                contentType: "application/json;charset=utf-8",
                url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
                data : JSON.stringify({
                    columnName: "为您推荐",
                    pageIndex : 1,
                    pageSize : 2
                }),
                async : true,
                success : function(data) {
                    var code = data.code;
                    var listData = data.data;
                    if(code == 200 && listData != null && listData.length > 0) {
                        var html = "";
                        for(var i = 0; i < listData.length; i++){
                            var thumbnail = listData[i].thumbnail;
                            var goodsName = listData[i].goodsName;
                            var id = listData[i].goodsId;
                            var goodsPrice = listData[i].goodsProStandard[0].goodsPrice;//商品原价
                            var distributionPrice = listData[i].goodsProStandard[0].distributionPrice;//商品分销价
                            html +='<li>';
                            html +='<div class="imgBox">';
                            html +='<img src="'+thumbnail+'" id="'+id+'" onclick="detailInfo(this)" alt="">';
                            html +='</div>';
                            html +='<div class="prodcitInfo">';
                            html +='<p class="name">'+goodsName+'</p>';
                            html +='<div class="price">';
                            html +='<p>';
                            html +='<span class="special">￥'+distributionPrice+'</span>';
                            html +='<span class="oldprice">￥'+goodsPrice+'</span>';
                            html +='</p>';
                            if(listData[i].listLabel != null){
                                var  listLabel = listData[i].listLabel;
                                var label = listLabel[0];
                                if (label != null){
                                    html += ' <span class="tag" style="color:'+label.colour+';border: 1px solid '+ label.colour +';border-radius: 0.59rem;padding: 0 4px;">'+ label.labelValue +'</span>';
                                }
                            }
                            html +='</div>';
                            html +='</div>';
                            html +='</li>';
                        }
                        $('#selection').append(html);
                    } else {
                        var _html = '<div class="noGoods">--暂无推荐商品--</div>';
                        $('#selection').append(_html);
                    }
                    $('.noData').show();
                }
            });
        }*/

        //下拉刷新   页面加载时  加载的方法
        function refresh(){
            setTimeout(function () {
                $.ajax({
                    type : 'post',
                    dataType : 'json',
                    contentType: "application/json;charset=utf-8",
                    url : '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
                    data : JSON.stringify({
                        columnName: "为您推荐",
                        pageIndex : 1,
                        pageSize : 10
                    }),
                    async : true,
                    success : function(data) {
                        if(data!=null && data.code == 200){
                           getSelectGoodsHtml(data)
                        }else{
                            hui.endLoadMore(true, '没有更多了...');
                            return false;
                        }
                    },
                    error : function(error) {
                        hui.toast(error);
                    }
                });
            },200)
        }
        function getSelectGoodsHtml(data) {
            var code = data.code;
            var listData = data.data;
            if(code == 200 && listData != null && listData.length > 0) {
                var html = "";
                for(var i = 0; i < listData.length; i++){
                    var thumbnail = listData[i].thumbnail;
                    var goodsName = listData[i].goodsName;
                    var id = listData[i].goodsId;
                    var actualPrice = listData[i].actualPrice;//实际价格
                    var comparativePrice = listData[i].comparativePrice;//对比价格
                    var isActivityGoods = listData[i].isActivityGoods;
                    var goodsPrice = listData[i].goodsProStandard[0].goodsPrice;//商品原价
                    var distributionPrice = listData[i].goodsProStandard[0].distributionPrice;//商品分销价
                    html +='<li>';
                    html +='<div class="imgBox">';
                    html +='<img src="'+thumbnail+'" id="'+id+'" isActivityGoods="'+isActivityGoods+'" onclick="detailInfo(this)" alt="">';
                    html +='</div>';
                    html +=getYhqHtml(listData[i]);
                    html +='<div class="prodcitInfo">';
                    html +='<p class="name">'+goodsName+'</p>';
                    html +='<div class="price">';
                    html +='<p>';
                    html +='<span class="special">￥'+actualPrice+'</span>';
                    html +='<span class="oldprice">￥'+goodsPrice+'</span>';
                    html +='</p>';
                    if(listData[i].listLabel != null){
                        var  listLabel = listData[i].listLabel;
                        var label = listLabel[0];
                        if (label != null){
                            html += ' <span class="tag" style="color:'+label.colour+';border: 1px solid '+ label.colour +';border-radius: 0.59rem;padding: 0 4px;">'+ label.labelValue +'</span>';
                        }
                    }
                    html +='</div>';
                    html +='</div>';
                    html +='</li>';
                }
                $('#selection').append(html);
            } else {
                var _html = '<div class="noGoods">--暂无推荐商品--</div>';
                $('#selection').append(_html);
            }
            $('.noData').show();
        }
        /**
         * 获取商品折扣
         * @param seckillPrice
         * @param distributionPrice
         * @returns {*}
         */
        function getDiscount(seckillPrice,goodsPrice){
            var discount = numMulti(numDiv(seckillPrice, goodsPrice), 10);
            discount = getnum(discount);
            return discount;
        }

        /**
         * 处理折扣小数点（直接截取），只保留一位
         * @param discount
         * @returns {string}
         */
        function getnum(discount){
            discount = parseFloat(discount).toFixed(3);
            //先把数据转成字符串
            var priceStr = discount.toString();
            //确定小数在第几位
            var index = priceStr.lastIndexOf(".");
            //把小数点后几位去掉
            var priceNew=priceStr.slice(0,index+2);
            //返回只舍不入的结果
            return priceNew;
        }

        // $("body").on('click', '.buyBtn', function () {
        //     var urlValue = window.location.href;
        //     //判断url中是否有识别标识
        //     if(!urlValue.indexOf("mark") > 0) {
        //         var goodsId = $(this).attr('id');
        //         window.location.href = "/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId=" + goodsId + "&distributorSeq=0&shareSeq=0";
        //     }
        // });
        //点击分享按钮
        $("body").on("click",".shareBtn",function() {
            // 判断是否登录
            function noLogin(){
                hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
                    setCookie("loginRetrunUrl",window.location.href);
                    loginPage();
                });
            }
            if(!isLogin()){
                noLogin();
                return;
            }
            var goodsId = $(this).attr("id");
            var goodsName = $(this).attr("name");
            var urlVal,appUrl,shareGoodsPic;
            if (goodsId == null || goodsId == undefined){
                //展示二维码和复制链接
                $('.copyCode').show();
                // 商品二维码
                $(".ewmcode img").attr("src","/localQuickPurchase/sgMongoAction/fieldShare/"+seq);
                $(".ewmcode").hide();
                // 分享
                var _href = window.location.href;
                urlVal = _href;
                goodsName = "天天爆款特价";
                shareGoodsPic = _href.substring(0,_href.indexOf("activity"))+"distributionApp/images/azj.png";
                urlVal = urlVal+"?shareSeq="+seq;
                appUrl = urlVal;
                console.log("appurl:"+appUrl);
            }else{
                // 商品二维码
                $(".ewmcode img").attr("src","/localQuickPurchase/sgMongoAction/goodsCode/"+goodsId+"/" + seq+"/"+seq);
                $(".ewmcode").hide();
                // shareGoodsPic = $("li").find("img:first").attr("src");
                //海报图片
                var href = window.location.href;
                appUrl = href + "?sharePic=1"+"&shareSeq="+seq;
                console.log("appurl:"+appUrl);
                var urlsub= href.substring(0,href.indexOf("activity/"));
                shareGoodsPic = urlsub + "sgMongoAction/makePostersIO"+"?seq="+seq+"&goodsId="+goodsId + "&url=" + appUrl;
            }
            //判断是否是app
            var u = navigator.userAgent;
            var isappwebview = u.indexOf('app_webview') > -1
            if(isappwebview){
                //点击分享
                share520Love(appUrl,'爆款特价商品',goodsName,shareGoodsPic,'.share-content');
            } else{
                share520LoveWeb(appUrl,'爆款特价商品',goodsName,shareGoodsPic,'.share-content');
                hui.dialogBase();
                $(".share-block").slideDown(200);
            }
            // 复制链接
            var clipboard = new Clipboard('.copylink', {
                // 点击copy按钮，直接通过text直接返回复印的内容
                text: function() {
                    var link = urlVal+"&checkShare=1";
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

            $("#closeShare").click(function() {
                hiddend();
            });

            function hiddend() {
                $("html,body").css("overflow", "visible");
                hui.dialogClose();
                $(".share-block").slideUp(200);
                $(".ewmcode").hide();
                $('.copyCode').hide();
            }

            $(".shopCode").click(function(){
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
            });

            $(".makePosters").click(function(){
                var href = window.location.href;
                var urlsub= href.substring(0,href.indexOf("activity"))
                var urlstr= urlsub + "distributionVA/seckill/sgDetail?goodsId="+goodsId+"&checkShare=1&shareSeq="+seq+"&distributorSeq="+seq;
                //调手机原生去下载；
                var u = navigator.userAgent;
                var isappwebview = u.indexOf('app_webview') > -1
                if(isappwebview){
                    // 调app原生图片保存
                    var  downImgParam= urlsub + "sgMongoAction/makePostersIO"+"?seq="+seq+"&goodsId="+goodsId + "&url="+urlstr;
                    window.action.downImg(downImgParam);
                }else{
                    downLoadImg("/localQuickPurchase/sgMongoAction/makePostersIO"+"?seq="+seq+"&goodsId="+goodsId + "&url="+urlstr,"shareRecuit.png");
                }
            });
            // 点击分享后弹出的背景层
            $(".mask").click(function(){
                $(".sharebox").removeClass('active');
                $(".specBtn").hide();
                $(".numBox").hide();
                $(".ewmcode").hide();
                $(".ewmcode").attr("value","0");
            });
        });
    }
})
