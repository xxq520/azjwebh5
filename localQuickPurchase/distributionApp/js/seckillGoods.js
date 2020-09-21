var indexSeckill = getQueryString("index");
if (indexSeckill == null || indexSeckill == ""){
    indexSeckill = 0;
}
$(function () {
    indexPage = {
        init:function(){
            this.field();

        },
        field:function(){
            $.ajax({
                type: 'GET',
                url: '/localQuickPurchase/sgMongoAction/seckillField',
                dataType: 'json',
                success:function(data){
                    if (data.data != null && data.data.length > 0){
                        var seckillField = data.data;
                        var seckill_html = "";
                        var field_html = "";
                        var param = {
                            "seckillId": seckillField[indexSeckill].seckillFieldId,
                            "countDownText": seckillField[indexSeckill].countDownText,
                            "beginTime": seckillField[indexSeckill].seckillFieldBeginTime,
                            "endTime": seckillField[indexSeckill].seckillFieldEndTime,
                            "activity": seckillField[indexSeckill].activity,
                            "fieldSize" : seckillField.length
                        };
                        for (var i = 0; i < seckillField.length; i++) {
                            var currentTime = data.equipmentData;
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
                            field_html += '<div id="mescroll'+i+'" class="mescroll">';
                            field_html += '<div class="date-con">';
                            field_html +='<span class="date-title">活动时间</span>';
                            field_html +='<div class="date-info"><span class="date-info-text">'+countDownText+'</span>';
                            field_html +='<span class="date-text" id="hour'+i+'">00</span>';
                            field_html +='<i class="date-icon">:</i>';
                            field_html +='<span class="date-text" id="minute'+i+'">00</span>';
                            field_html +='<i class="date-icon">:</i>';
                            field_html +='<span class="date-text" id="second'+i+'">00</span></div>';
                            field_html +='</div>';
                            field_html += '<ul id="dataList'+i+'" class="data-list">';
                            field_html += '</ul>';
                            field_html += '</div>';
                            /*=============== 定时器执行的参数 =============== begin ================*/
                            // --->>> 1.开始时间  2.现在的时间	3.结束时间	4.客户端的服务器的时间	5.定时器ID <<<---


                            var timeNow,finalTime,timeServerClient,timerID;
                            finalTime = beginTime;//开始的时间
                            if (!!activity){
                                finalTime = endTime;//开始的时间
                            }
                            timeNow = currentTime;//当前时间 -- 获取
                            timeServerClient = finalTime-timeNow;  //结束时间 - 当前时间 = 距离活动结束的时间

                            setTimeout("showTime("+finalTime+","+timeServerClient+","+i+","+activity+")",1000);
                            /*=============== 定时器执行的参数 ===============  end  ================*/

                            if (i == 0) {
                                seckill_html += '<p class="swiper-slide seckill-list" i="'+i+'" style="width: 33.3%!important;" ' +
                                    'id="'+seckillId+'" down="'+countDownText+'" begin="'+beginTime+'" end="'+endTime+'"  activity="'+activity+'">';
                            } else {
                                seckill_html += '<p class="swiper-slide seckill-list" i="'+i+'" style="width: 33.3%!important;"' +
                                    'id="'+seckillId+'" down="'+countDownText+'" begin="'+beginTime+'" end="'+endTime+'"  activity="'+activity+'">';
                            }
                            seckill_html += '<span class="font-md">'+intervalText+'</span>';
                            seckill_html += '<span class="padding-t-1">'+writing+'</span>';
                            seckill_html += '<span class="sale-active"></span>';
                            seckill_html += '</p>';
                        }
                        $(".bg_white").html(field_html);
                        $("#nav .swiper-wrapper").html(seckill_html);
                        indexPage.goodsList(param.seckillId,param.countDownText,param.beginTime,param.endTime,param.fieldSize,param.activity);
                    }
                }
            })
        },
        navList:function(){
            var swiper = new Swiper('#nav', {
                slidesPerView: 3.5,
                spaceBetween: 0,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        },
        goodsList:function (seckillId,countDownText,beginTime,endTime,fieldSize,activity) {
            $(".bg_white .mescroll").eq(0).show();
            /*初始化轮播 -- 商品列表*/
            var swiper=new Swiper('#swiper', {
                onTransitionEnd: function(swiper){
                    var i=swiper.activeIndex;//轮播切换完毕的事件
                    changePage(i);
                }
            });
            if (indexSeckill != "" || indexSeckill != null) {
                var i = indexSeckill;
                // swiper.slideTo(i);
                indexPage.navList();
            } else {
                indexSeckill = 0;
            }

            var curNavIndex = indexSeckill;
            if (i != null || i != "") {
                $("#nav p[i="+i+"]").removeClass("active");
                $("#nav p[i="+i+"]").addClass("active").trigger("click");
            }

            var mescrollArr=new Array(fieldSize);//4个菜单所对应的4个mescroll对象
            $(".mescroll-downwarp").remove();
            $(".mescroll-upwarp").remove();
            //初始化首页
            if (curNavIndex != null) {//活动中
                mescrollArr[curNavIndex]=initMescroll("mescroll"+curNavIndex, "dataList"+curNavIndex);
            }
            /*初始化菜单*/
            $("#nav .swiper-wrapper p").click(function(){
                $(".sltBox").hide();
                i=Number($(this).attr("i"));
                $(".data-list").html("");
                seckillId = $(this).attr("id");
                countDownText = $(this).attr("down");
                beginTime = $(this).attr("begin");
                endTime = $(this).attr("end");
                activity = $(this).attr("activity");
                changePage(i);
                // swiper.slideTo(i);//以轮播的方式切换列表
            })
            /*切换列表*/
            function changePage(i) {
                /*if(curNavIndex!=i) {*/
                $(".data-list").html("");
                $(".mescroll-downwarp").remove();
                $(".mescroll-upwarp").remove();
                //更改列表条件
                $("#nav p").each(function(n,dom){
                    $(".bg_white .mescroll").eq(i).show().siblings().hide();

                    if (dom.getAttribute("i")==i) {
                        dom.classList.add("active");
                        seckillId = dom.getAttribute("id");
                        countDownText = dom.getAttribute("down");
                        beginTime = dom.getAttribute("begin");
                        endTime = dom.getAttribute("end");
                        activity = dom.getAttribute("activity");
                        console.log(i)
                    } else{
                        dom.classList.remove("active");
                    }
                })
                //隐藏当前回到顶部按钮
                mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
                //更新标记
                curNavIndex=i;
            }
            /* }*/

            /*创建MeScroll对象*/
            function initMescroll(mescrollId,clearEmptyId){
                //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;

                var mescroll = new MeScroll(mescrollId, {
                    //上拉加载的配置项
                    up: {
                        callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                        isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
                        noMoreSize: 10, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                        empty: {
                            tip: "暂无相关数据~", //提示
                        },
                        clearEmptyId: clearEmptyId, //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
                    }
                });
                return mescroll;
            }

            /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
            function getListData(page){
                //清除列表数据
                /*$(".data-list").html("");*/
                //联网加载数据
                var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
                getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
                    console.log("dataIndex="+dataIndex+", curNavIndex="+curNavIndex+", page.num="+page.num+", page.size="+page.size+", pageData.length="+pageData.length);
                    mescrollArr[dataIndex].endSuccess(pageData.data.pageSize,pageData.data.hasNextPage);

                    //设置列表数据
                    setListData(pageData,dataIndex);
                }, function(){
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    mescrollArr[dataIndex].endErr();
                });
            }

            function setListData(data,dataIndex){
                /*$(".date-con").remove();*/
                goodsList = data.data.list;
                var index = data.data.pageIndex;
                var curTime = data.equipmentData;
                console.log(goodsList);
                var html = "";
                    // html +='<div class="date-con">';
                    // html +='<span class="date-title">活动时间</span>';
                    // html +='<div class="date-info"><span class="date-info-text">'+countDownText+'</span>';
                    // html +='<span class="date-text" id="hour'+dataIndex+'">00</span>';
                    // html +='<i class="date-icon">:</i>';
                    // html +='<span class="date-text" id="minute'+dataIndex+'">00</span>';
                    // html +='<i class="date-icon">:</i>';
                    // html +='<span class="date-text" id="second'+dataIndex+'">00</span></div>';
                    // html +='</div>';
                var timrBool = getTimeBool(curTime,beginTime);

                for (var i = 0; i < goodsList.length; i++) {
                    var thumbnail = goodsList[i].thumbnail;//缩略图路径
                    var goodsName = goodsList[i].goodsName;//商品名
                    var goodsId = goodsList[i].goodsId;//商品名
                    // ============== 默认取第一个规格的参数来比较 ================================================
                    var seckillPrice = goodsList[i].goodsProStandard[0].seckillPrice;//秒杀价
                    var seckillUnivalence = goodsList[i].goodsProStandard[0].seckillUnivalence;//秒杀出厂单价
                    var goodsPrice = goodsList[i].goodsProStandard[0].goodsPrice;//原价、零售价
                    var distributionProfit = goodsList[i].goodsProStandard[0].distributionProfit;//分销商佣金
                    var profitPrice = goodsList[i].goodsProStandard[0].profitPrice;//代理商佣金


                    /* ============== 判断该商品是否还有活动量 ======= begin ================*/
                    var goodsExists = checkGoodsExists(goodsList[i].goodsProStandard);

                    /* ============== 判断该商品是否还有活动量 =======  end  ================*/
                    html += '<div class="good-detail">';
                    html += '<div class="goods-info" style="border-bottom:none">';
                    html += '<img src="'+thumbnail+'" class="goodsDetail" goodsId="'+goodsId+'">';
                    html += '<div class="order-detail font-md-3">';
                    html += '<span class="order-name font-md-3 margin-t-3">'+goodsName+'</span>';
                    html += '<span class="margin-t-3 font-sm" style="width: 70%;">';
                    html += '秒杀价：<span class="color_red ">￥'+seckillPrice+'</span>';
                    html += '原价：<span class="text-de">￥'+goodsPrice+'</span>';
                    html += '</span>';
                    if (timrBool) {
                        if (goodsExists){
                            html += ' <span class=" pull-right order-price font-md" num="'+i+'" timrBool="'+timrBool+'" activity="'+activity+'">立即下单</span>';
                        } else {
                            html += ' <span class=" pull-right out-of-stock font-md" num="'+i+'" timrBool="'+timrBool+'">已售罄</span>';
                        }
                    }
                    /*if (isRoleAgent()) {
                        html += '<p class="earn">赚:￥'+distributionProfit+'</p>';
                    } else if (isRoleDealer()) {
                        html += '<p class="earn">赚:￥'+numAdd(profitPrice,distributionProfit)+'</p>';
                    }*/
                    //html += '<div class="timer" id="timer'+dataIndex+index+i+'"></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';


                }
                $("#dataList"+dataIndex).append(html);
            }


            function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {

                //参数
                var param ={"seckillId":seckillId,"pageIndex":pageNum,"pageSize":pageSize};

                //延时一秒,模拟联网
                setTimeout(function () {
                    $.ajax({
                        type: 'GET',
                        url: '/localQuickPurchase/sgMongoAction/seckillGoods',
                        data : param,
                        dataType: 'json',
                        success: function(data){
                            if (data.code == 200) {
                                var listData=[];
                                var goodsList = data.data.list;
                                if(curNavIndex==0){
                                    //首页 (模拟分页数据)
                                    for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
                                        if(i==goodsList.length) break;
                                        listData.push(goodsList[i]);
                                    }

                                }else if(curNavIndex==1){
                                    //待付款
                                    for (var i = 0; i < goodsList.length; i++) {
                                        //if (data[i].pdName.indexOf("待付款")!=-1) {
                                        listData.push(goodsList[i]);
                                        //}
                                    }
                                }else if(curNavIndex==2){
                                    //待发货
                                    for (var i = 0; i < goodsList.length; i++) {
                                        //if (data[i].pdName.indexOf("待发货")!=-1) {
                                        listData.push(goodsList[i]);
                                        //}
                                    }
                                }
                                //回调
                                successCallback(data);
                            } else {
                                hui.iconToast("请求失败！",'error');
                            }
                        },
                        error: errorCallback
                    });
                },500)
            }

        }
    }
    indexPage.init();
})

function pageIndex() {
    indexPage.init();
}


//设置的定时器
function showTime(endTime,timeServerClient,dataIndex,activity){

    var timerHour = document.getElementById("hour"+dataIndex);
    var timerMinute = document.getElementById("minute"+dataIndex);
    var timerSecond = document.getElementById("second"+dataIndex);
    if(!timerHour || !timerMinute || !timerSecond){
        return ;
    }
    timerHour.innerHTML = timeServerClient;
    timerMinute.innerHTML = timeServerClient;
    timerSecond.innerHTML = timeServerClient;

    var time_now,timeDistance,strTime;  //1.当前时间		2.时间距离		3.拼接输出时间
    var day,hour,minute,second;  //1.天数		2.小时		3.分钟	4.秒
    //每秒钟都获取一次当前时间
    var time_now = new Date();
    //time_now = time_now.getTime();
    // 剩余时间 = 结束(开始)时间 - 当前时间
    //timeDistance = endTime-time_now;
    timeDistance = timeServerClient;
    timeServerClient = endTime-time_now;
    if(timeDistance>0){
        day = Math.floor(timeDistance/86400000)  //计算天数
        timeDistance -= day*86400000;
        hour = Math.floor(timeDistance/3600000)  //计算小时
        timeDistance -= hour*3600000;
        minute = Math.floor(timeDistance/60000)  //计算分钟
        timeDistance -= minute*60000;
        second = Math.floor(timeDistance/1000)  //计算秒数

        //如果只剩下个位数，则在十位数加上0
        if(hour<10)
            hour="0"+hour;
        if(minute<10)
            minute="0"+minute;
        if(second<10)
            second="0"+second;

        //拼接时间
        //strTime=day+"天"+hour+"小时"+minute+"分钟"+second+"秒";

        //定时器输出时间
        timerHour.innerHTML = hour;
        timerMinute.innerHTML = minute;
        timerSecond.innerHTML = second;
        //每秒循环执行
        setTimeout("show_time("+endTime+","+timeServerClient+","+dataIndex+")",1000);
    } else {//倒计时结束执行的操作
        timerHour.innerHTML = "00";
        timerMinute.innerHTML = "00";
        timerSecond.innerHTML = "00";
        clearTimeout("活动时间已结束！！！");
        if (!!activity){
            indexPage.init();
        }
    }
}
$(function(){
    $(".sltBox").hide();
});

function sltHide(){
    $(".sltBox").hide();
}
function sltShow(){
    $(".sltBox").show();
};

$(document).on('click','.order-price',function(){
    setTimeout(function(){ $(".numBox").show(); }, 400);

    // ======= 点击立即下单规格信息弹出层 ============
    /* ================ 获取商品参数 =============== begin =============== */
    var num = $(this).attr("num");
    var activity = $(this).attr("activity");
    console.log("goodsList:"+goodsList[num].goodsName);
    var goodsName;//商品名
    salesVolume = goodsList[num].salesVolume;//起卖量
    var propertyStandards = goodsList[num].propertyStandards;//对应规格下标展示的规格归类
    var goodsId = goodsList[num].goodsId;//对应规格下标展示的规格归类
    activityState = goodsList[num].activityState;

    goodsInit(goodsId);
    // 显示选择规格 面板  开始
    sltShow();
    $(".specBtn").show();
    setTimeout(function(){ $(".numBox").show(); }, 400);
    //关闭弹出层
    $(".closeBtn").click(function(){
        sltHide();
        $(".specBtn").hide();
        $(".numBox").hide();
        //清空规格面板  重置选择规格
        $('.slt-txt.slt-spec').html('选择规格');
        $('#wrap1').remove();
        $(".numBox").before('<div class="spec-box" id="wrap1"></div>');

    });
    $(".specBtn-item.buyNow").attr("num",goodsId);
    $(".specBtn-item.addCart").attr("num",goodsId);
    // 显示选择规格 面板结束
    $(".buyNow").attr("num",goodsId);
    $(".buyNow").attr("activity",activity);
    /* ================ 获取商品参数 ===============  end  =============== */

});
//添加购物车事件
function addCart(goodsId){
    if(checkShare == null || checkShare == ""){
        shareSeq = 0;//分享者seq
    }
    var isActivityGoods = "1";
    $.ajax({
        type : 'POST',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/dCart/add',
        data : JSON.stringify({
            "supplierSeq" : parseInt(supplierSeq),
            "shopSeq" : parseInt(shopSeq),
            "goodsId" : goodsId,
            "goodsCode": goodsCode,
            "factoryPrice": parseInt(factoryPrice),
            "cost_unit_price": parseInt(gcost_unit_price),
            "primitiveFactoryPrice" : parseInt(primitiveFactoryPrice),
            "companyName" : companyName,
            "goodsNum" : parseInt(goodsNum),
            "distributorType" : parseInt(distributorType),
            "userName" : userName,
            "shareSeq" : parseInt(shareSeq),
            "sku" : orderSku,
            "spec" : spec,
            "isActivityGoods" : isActivityGoods,
            "seckillPrice" : seckillPrice,
            "activityState" : activityState
        }),
        async : true,
        success : function(data) {
            var code = data.code;
            //操作完之后清空
            spec = '';
            $(".slt-spec").text("选择规格 " + spec);
            $(".checkedSpec").text(spec);
            if(code == 200){
                hui.toast("加入购物车成功");
            } else if(code == 501){
                hui.toast(data.message);
            }else{
                hui.toast("加入购物车失败");
            }
            sltHide();
        }
    });
}
var urlVal = window.location.href;
//判断是否登录
function noLogin(){
    sltHide();
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        //setCookie("loginRetrunUrl",urlVal);
        var url = loginPageUrl();
        if (shareSeq != null && shareSeq != "") {
            url += "?rdSeq=" + shareSeq;
        }
        window.location.href = url;
    });
}


hui(".hui-tab-title div").click(function(){
    var currentIndex=$(".hui-tab-body .hui-tab-item").eq($(this).index()).height()+54
    //var index = $(".hui-tab-title div.current").index() + 2;
    //var aH = $(".hui-tab-item").eq(index).height() + 10;
    $(".hui-tab-body").css("height",currentIndex);
});
//商品图片点击  进入商品详情
$("body").on('click', '.goodsDetail', function() {
    var goodsId = $(this).attr('goodsId');
    if(seq == null || seq == 0) {
        seq = 0;
    }
    //去掉分享seq  兼容原始扫二维码不能绑定关系  android少 "&shareSeq="这个会闪退
    window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+  seq +"&shareSeq="
});