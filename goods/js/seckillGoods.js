var indexSeckill = getQueryString("index");
if (indexSeckill == null || indexSeckill == ""){
    indexSeckill = 0;
}
var data;
$(function () {
    indexPage = {
        init:function(){
            this.field();

        },
        field:function(){
            $.ajax({
                type: 'GET',
                url: '/goods/seckillGoods/fieldInfo',
                dataType: 'json',
                success:function(data){
                    if (data.data != null && data.data.length > 0){
                        var seckillField = data.data;
                        var seckill_html = "";
                        var field_html = "";
                        var param = {
                            "seckillId": seckillField[indexSeckill].seckillFieldId,
                            "countDownText": seckillField[indexSeckill].countDownText,
                            "beginTime": new Date(seckillField[indexSeckill].seckillFieldBeginTime).getTime(),
                            "endTime": new Date(seckillField[indexSeckill].seckillFieldEndTime).getTime(),
                            "activity": seckillField[indexSeckill].activity,
                            "fieldSize" : seckillField.length
                        };
                        for (var i = 0; i < seckillField.length; i++) {
                            var currentTime = new Date(data.equipmentData).getTime();
                            //场次ID
                            var seckillId = seckillField[i].seckillFieldId;
                            //开始和结束区间
                            var intervalText = seckillField[i].intervalText;
                            //tab说明
                            var writing = seckillField[i].writing;
                            //倒计时说明
                            var countDownText = seckillField[i].countDownText;
                            //活动开始时间
                            var beginTime = new Date(seckillField[i].seckillFieldBeginTime).getTime();
                            //活动结束时间
                            var endTime = new Date(seckillField[i].seckillFieldEndTime).getTime();
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
                var i = Number(indexSeckill);
                $(".bg_white .mescroll").eq(i).show().siblings().hide();
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
                //联网加载数据
                var dataIndex=curNavIndex;
                //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
                getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
                    console.log("dataIndex="+dataIndex+", curNavIndex="+curNavIndex+", page.num="+page.num+", page.size="+page.size+", pageData.length="+pageData.length);
                    // hasNextPage 是否有下一页返回undefined的时候，底部的“没有更多数据”将不会展示出来，所以必须有下一页的判断返回
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
                goodsList = data.data.rows;
                var index = data.data.pageIndex;
                var curTime = new Date(data.equipmentData).getTime();
                console.log(goodsList);
                var html = "";
                var timrBool = getTimeBool(curTime,beginTime);

                for (var i = 0; i < goodsList.length; i++) {
                    var thumbnail = goodsList[i].thumbnail;//缩略图路径
                    var goodsName = goodsList[i].goodsName;//商品名
                    var goodsId = goodsList[i].goodsId;//商品名
                    // ============== 默认取第一个规格的参数来比较 ================================================
                    var seckillPrice = goodsList[i].goodsProStandard[0].seckillPrice;//秒杀价
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
                    if (isRoleAgent()) {
                        html += '<p class="earn">赚:￥'+distributionProfit+'</p>';
                    } else if (isRoleDealer()) {
                        html += '<p class="earn">赚:￥'+numAdd(profitPrice,distributionProfit)+'</p>';
                    }
                    //html += '<div class="timer" id="timer'+dataIndex+index+i+'"></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';



        /*beginTime=new Date("2018-04-17 21:17:10");//开始的时间
        beginTime=beginTime.getTime();*/



        timeServerClient = endTime-timeNow;  //结束时间 - 当前时间 = 距离活动结束的时间

        setTimeout("show_time("+endTime+","+timeServerClient+","+dataIndex+","+index+","+i+","+filds+")",1000);

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
                        url: '/goods/seckillGoods/goodsInfo',
                        data : param,
                        dataType: 'json',
                        success: function(data){
                            if (data.code == 1000) {
                                var listData=[];
                                var goodsList = data.data.rows;
                                if(curNavIndex==0){
                                    //首页 (模拟分页数据)
                                    for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
                                        if(i==goodsList.length) break;
                                        listData.push(goodsList[i]);
                                    }

                                } else {
                                    for (var i = 0; i < goodsList.length; i++) {
                                        //if (data[i].pdName.indexOf("待付款")!=-1) {
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
var goodsList;
var goodsSkuList = [];
/*规格弹出层商品购买*/
var salesVolume = 1;// 起卖量
var spec = "";//商品规格
var proStandardsMap;//Map对象
var checkShare = 0;

function sltHide(){
    $(".sltBox").hide();
}
function sltShow(){
    $(".sltBox").show();
};
var supplierSeq,shopSeq,goodsCode,goodsNum,shareSeq,orderSku,spec,seckillPrice,activityState;
//点击页面选择规格
$(document).on('click','.order-price',function(){
    sltShow();
    //初始化规格选中
    setTimeout(function(){ $(".numBox").show(); }, 400);
    //关闭弹出层
    $(".closeBtn").click(function(){
        sltHide();
        $(".slt-spec").html("选择规格");
        $(".specBtn-item.buyNow").removeClass("buyyel");
        $(".specBtn-item.buyNow").html("立即购买");
    });

    // ======= 点击立即下单规格信息弹出层 ============
    /* ================ 获取商品参数 =============== begin =============== */
    var num = $(this).attr("num");
    var activity = $(this).attr("activity");
    console.log("goodsList:"+goodsList[num].goodsName);
    salesVolume = goodsList[num].salesVolume;//起卖量
    var goodsId = goodsList[num].goodsId;//对应规格下标展示的规格归类
    activityState = goodsList[num].activityState;

    goodsInit(goodsId);
    initgoodsAttr();

    $(".buyNow").attr("num",goodsId);
    $(".buyNow").attr("activity",activity);
    /* ================ 获取商品参数 ===============  end  =============== */

});

function goodsInit(goodsId) {
    // 商品信息
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : '/goods/seckillGoods/loveHouseGoodsDetail',
        data : {
            goodsId : goodsId,
        },
        async : false,
        success : function(data) {
            if(null == data.data || null == data.data.goodsInfo){
                hui.alert('该商品已经下架！', ['返回首页'], function(){
                    window.location.href="/localQuickPurchase/distributionVA/index";
                });
            }
            var shop = data.data.shopInfo;
            goods = data.data.goodsInfo;

            //分销商品库存赋值
            distributionStock = goods.goodsProStandard[0].stock;
            if(distributionStock == null || distributionStock == 0){
                distributionStock = 999;
            }

            //商品规格处理数据
            list = data.data.props;
            goodsSkuList = list.goodsList;

            if (goods != null) {
                shopSeq = goods.seq;
                //false 为本地商品,
                if (goods.isDistrbutionGoods) {
                    supplierSeq = goods.supplierSeq;
                } else {
                    supplierSeq = goods.seq;
                }
                var goodsImg = goods.listGoodsImg;
                var thumbnail = goods.thumbnail;
                if(goodsImg == null || goodsImg.length == 0) {
                    goodsImgFirst = thumbnail;
                } else {
                    goodsImgFirst = goodsImg[0].goodsImgPath;
                }

                var goodsProStandard = goods.goodsProStandard;

                if(goodsProStandard != null) {
                    var length = goodsProStandard.length;
                    proStandardsMap = new Array(length);
                    for(var i = 0; i < length; i++) {
                        var goodsProStandards = {};//对象
                        goodsProStandards.sku = goods.goodsProStandard[i].sku;//goodsSku
                        goodsProStandards.distributionPrice = goods.goodsProStandard[i].distributionPrice;//分销价
                        goodsProStandards.platformPrice = goods.goodsProStandard[i].platformPrice;//平台价
                        goodsProStandards.salesVolume = goods.goodsProStandard[i].salesVolume;//起卖量

                        goodsProStandards.companyName = goods.companyName;//供应商名称
                        goodsProStandards.goodsCode = goods.goodsCode;//商品Code
                        goodsProStandards.factoryPrice = goods.goodsProStandard[i].factoryPrice;//出厂价
                        goodsProStandards.cost_unit_price = goods.goodsProStandard[i].cost_unit_price;//出厂单价
                        goodsProStandards.primitiveFactoryPrice = goods.goodsProStandard[i].primitiveFactoryPrice;//原始出厂价
                        goodsProStandards.goodsPrice = goods.goodsProStandard[i].goodsPrice;//划线价

                        goodsProStandards.distributionProfit = goods.goodsProStandard[i].distributionProfit;//分销商佣金
                        goodsProStandards.profitPrice = goods.goodsProStandard[i].profitPrice;//代理商佣金

                        goodsProStandards.seckillPrice = goods.goodsProStandard[i].seckillPrice;//秒杀价
                        goodsProStandards.activityQuantity = goods.goodsProStandard[i].activityQuantity;//活动总数量
                        goodsProStandards.sellActivityQuantity = goods.goodsProStandard[i].sellActivityQuantity;//卖出的数量

                        var selectSpec = "";
                        var specs = goods.goodsProStandard[i].proStandAttached;
                        if(specs != null) {
                            var standardName1 = specs.standardName1;
                            if(standardName1 != null) {
                                selectSpec += standardName1 + ",";
                            }
                            var standardName2 = specs.standardName2;
                            if(standardName2 != null) {
                                selectSpec += standardName2 + ",";
                            }
                            var standardName3 = specs.standardName3;
                            if(standardName3 != null) {
                                selectSpec += standardName3 + ",";
                            }
                            var standardName4 = specs.standardName4;
                            if(standardName4 != null) {
                                selectSpec += standardName4 + ",";
                            }
                            var standardName5 = specs.standardName5;
                            if(standardName5 != null) {
                                selectSpec += standardName5 + ",";
                            }
                            var standardName6 = specs.standardName6;
                            if(standardName6 != null) {
                                selectSpec += standardName6 + ",";
                            }
                            var standardName7 = specs.standardName7;
                            if(standardName7 != null) {
                                selectSpec += standardName7 + ",";
                            }
                            var standardName8 = specs.standardName8;
                            if(standardName8 != null) {
                                selectSpec += standardName8 + ",";
                            }
                        }

                        selectSpec = selectSpec.substring(0, selectSpec.length -1);
                        goodsProStandards.selectSpec = selectSpec;//规格信息
                        proStandardsMap[i] = goodsProStandards;
                    }
                }

                /**
                 * 默认取第一个....
                 */
                var goodsPsd = goods.goodsProStandard[0];
                //秒杀价展示
                seckillPrice = goodsPsd.seckillPrice;//平台价
                $(".slt-price").html("秒杀价:￥" + (seckillPrice));
                // 商品描述展示
                var introduction = goods.introduction;
                $(".imgAndTxt").html(introduction);
                //起卖量展示
                salesVolume = goodsPsd.salesVolume;
                $('.stock-num').html(salesVolume);
                //商品名展示
                goodsName = goods.goodsName;
                $(".name-txt").html(goodsName);
                //物流费展示
                var logisticsPrice = goods.logisticsPrice;
                if (logisticsPrice == null || logisticsPrice == 0) {
                    $(".logisticsPrice").html("免运费");
                } else {
                    $(".logisticsPrice").html("物流运费:" + logisticsPrice + "元");
                }

                //获取下单优惠价
                if(isRoleAgent() || isRoleDealer()){
                    var _distributionProfit = goodsPsd.distributionProfit;//分销商佣金
                    var _profitPrice = goodsPsd.profitPrice;//代理商佣金
                    //佣金显示
                    showCommission(_distributionProfit, _profitPrice);
                }

                // 规格展示
                var chooseSpec = '';
                var attrList = list.attrList;
                for(var i = 0; i < attrList.length; i++) {
                    var name = attrList[i].name;
                    var attrValues = attrList[i].attrValues;
                    chooseSpec +='<div class="spec-list attr-row">';
                    chooseSpec += '<div class="spec-title">' + name + '</div>';
                    for (var j = 0; j < attrValues.length; j++) {
                        var attrValue = attrValues[j];
                        var prime = attrValue.prime;
                        var attrValue = attrValue.attrValue;
                        chooseSpec += '<div class="spec-item" data-prime='+prime+' onclick="getSpces(this)" >' + attrValue + '</div>';
                    }
                    chooseSpec += '</div>';
                }
                $("#wrap1").html(chooseSpec);

                //商品图片的展示
                if(goodsImg == null) {
                    $(".goodsImg").find("img").attr("src", thumbnail);
                } else {
                    $(".goodsImg").find("img").attr("src", goodsImg[0].goodsImgPath);
                }


                var parameter = data.data.goodsInfo.parameter;
                var specText = null;
                if(parameter != null && parameter.length > 0){
                    for(var i = 0; i < parameter.length; i++){
                        specText = '<li class="paramItem">'
                            + '<label class="paramName">' + (parameter[i].pName == null ? "" : parameter[i].pName) + '</label>'
                            + '<span class="paramValue checked">' + (parameter[i].pDName == null ? "" : parameter[i].pDName)
                            + '</span>' + '</li>';
                        $(".paramList").append(specText);
                    }
                }
            }
        },
        error : function(err) {

        }
    });
}
function initgoodsAttr() {
    goodsAttr = new GoodsAttr({
        jqWrap: $('#wrap1'),
        goodsList: goodsSkuList,
        success(product) {
            console.log(product.sku);
            orderSku = product.sku;
            getPriceForSelectSku(orderSku);
        }
    })
}
//根据选中商品sku获取价格
function getPriceForSelectSku(sku) {
    for(var i = 0; i < proStandardsMap.length; i++) {
        var getProStandard = proStandardsMap[i];
        var getSku = getProStandard.sku;
        if (getSku == sku) {
            spec = getProStandard.selectSpec;
            showSpecs(spec);
            var seckillPrice = getProStandard.seckillPrice;
            var getSalesVolume = getProStandard.salesVolume;
            var activityQuantity = getProStandard.activityQuantity;//活动总数量
            var sellActivityQuantity = getProStandard.sellActivityQuantity;//卖出量
            var totalNum = numSub(activityQuantity, sellActivityQuantity);
            $(".buyNow").attr("residual",totalNum);//插上剩余量
            if(totalNum != null ) {
                $(".selfConfessed").show();
                if(totalNum == 0) {
                    //商品日供量已售完
                    $(".specBtn-item.buyNow").addClass("buyyel");
                    $(".specBtn-item.buyNow").html("该秒杀商品已被抢光~");
                } else {
                    $(".specBtn-item.buyNow").removeClass("buyyel");
                    $(".specBtn-item.buyNow").html("立即购买");
                }
            }
            $('.stock-num').html(getSalesVolume);//起卖量
            $(".slt-price").html("￥" + (seckillPrice));//秒杀价
            $(".distributionPrice").html(seckillPrice);
            $("input[name=numValue]").val(getSalesVolume);//
            //显示
            var getDisProfit = getProStandard.distributionProfit;
            var getProfitPrice = getProStandard.profitPrice;
            showCommission(getDisProfit, getProfitPrice);
        }
    }
}
//显示佣金
function showCommission(distributionProfit, profitPrice) {
    var preferentialPrice = getCommission(distributionProfit, profitPrice);
    if(isRoleAgent() || isRoleDealer()) {
        if (isRoleAgent()) {
            $('.pull-left').html("分享好友下单立赚"+cutPriceDown(preferentialPrice)+"元")
        } else if (isRoleDealer()){
            $('.pull-left').html("分享好友下单立赚"+cutPriceDown(preferentialPrice)+"元")
        }
        var preferentialHtml = '<div class="slt-txt styleColor slt-price">优惠:'+cutPriceDown(preferentialPrice)+'</div>';
        $('.slt-price').append(preferentialHtml);
    }
}

/**
 * 根据当前用户类型获取佣金
 * @param distributionProfit
 * @param profitPrice
 */
function getCommission(distributionProfit, profitPrice) {
    var preferentialPrice;
    if(isRoleAgent()) {
        preferentialPrice = distributionProfit;//分销商佣金
    } else if(isRoleDealer()) {
        preferentialPrice = numAdd(profitPrice, distributionProfit);//代理商佣金
    }
    return preferentialPrice;
}
/**
 * 规格显示
 * @param showSpec
 */
function showSpecs(showSpec) {
    $(".slt-spec").text("已选择 " + showSpec);
    $(".specBox.buyBtn").html("已选择");
    $(".specBox.buyBtn").append('<span class="checkedSpec">'+showSpec+'</span>');
}

/* 获取规格的内容 */
function getSpces(obj){
    if($(obj).hasClass("disabled")) {
        return;
    }
    $(".slt-spec").html("选择规格");

    $(".specBox.buyBtn").html("选择规格");
    var moreHtml = '<span class="checkedSpec"></span>' +
        '<span class="checkedMore"><img src="/localQuickPurchase/distributionApp/images/gd_spec.png"></span>';
    $(".specBox.buyBtn").append(moreHtml);
}

//立即购买
$(".buyNow").click(function(){
    var goodsId = $(this).attr("num");
    var activity = $(this).attr("activity");
    if (!activity){
        hui.alert("该商品活动还没开始，请留意活动开始时间！");
        return;
    }
    console.log(goodsId);
    if(!isLogin()){noLogin();return;}

    var num = Number($("input[name=numValue]").val());//商品数量
    var an = $(".spec-list").length;
    var sn = $(".spec-item.active").length;
    if(an != sn) {
        hui.toast("请选择商品规格");
        return;
    }

    goodsNum = num;
    if(num <= 0){
        //hui.toast("请选择购买数量!");
        hui.toast("该商品的起卖量是"+salesVolume);
        $("input[name=numValue]").val(salesVolume);
    } else if(num < salesVolume){
        //hui.toast("购买数量要大于起卖量!");
        hui.toast("该商品的起卖量是"+salesVolume);
        $("input[name=numValue]").val(salesVolume);
    } else if(num > 1000){
        hui.toast("最大订单数量为999");

    } else{
        //doAsync();
        if(checkShare == ""){
            shareSeq = 0;
        }
        var quantity = $(this).attr("residual");
        console.log(quantity);
        if (Number(num) > Number(quantity)) {
            hui.toast("最大订单数量为:"+quantity);
            $("input[name=numValue]").val(quantity);
            return;
        }
        if (goodsId != null && quantity > 0) {
            shopSeq = shopSeq == null ? 0 : shopSeq;
            supplierSeq = supplierSeq == null ? 0 : supplierSeq;
            var url = "/localQuickPurchase/distribution/html/placeOrder.jsp"+
                "?goodsId="+goodsId+"&shareSeq="+ shareSeq +"&quantity="+goodsNum+"&seq="+seq+"&shopSeq="+shopSeq+"&spec="+spec+"&sku="+orderSku+"&isActivityGoods=1";
            window.location.href=url;
        } else {
            hui.alert("该规格已售罄~,请选择其他规格！");
        }
    }
});

var Num = {
    num:salesVolume == null ? 1 : salesVolume,
    maxNum:999,
    init:function(){
        $("input[name=numValue]").val(Num.num);
    },
    handle:function(){
        $("input[name=numValue]").change(function(){
            if(!checkNum($(this).val())){$(this).val(0);}
            if($(this).val()>=Num.maxNum){$(this).val(Num.maxNum);}
            Num.num = $(this).val();
        });
        $(".nbox-reduce").click(function(){
            if(!checkNum(Num.num)){$("input[name=numValue]").val(0);}
            if(Num.num==salesVolume){return;}
            var numNum = $("input[name=numValue]").val();
            numNum--;
            Num.num = numNum;
            if(numNum < salesVolume){
                hui.toast("购买数量不能小于起卖量");
                return;
            }
            $("input[name=numValue]").val(numNum);
        });
        $(".nbox-add").click(function(){
            if(!checkNum(Num.num)){$("input[name=numValue]").val(0);}
            if(Num.num>=Num.maxNum){hui.toast("已经是最大购买量");return;}
            var numNum = $("input[name=numValue]").val();
            numNum++;
            Num.num = numNum;
            if(numNum > Num.maxNum){
                hui.toast("购买量不能大于999");
                return;
            }
            $("input[name=numValue]").val(numNum);
        });
        function checkNum(n){
            var reg = /^[0-9]\d*$/;
            if(reg.test(n)){
                return true;
            }else{
                return false;
            }
        }
    }
};

var urlVal = window.location.href;
//判断是否登录
function noLogin(){
    sltHide();
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        setCookie("loginRetrunUrl",urlVal);
        loginPage()
    });
}
$(function(){
    $(".sltBox").hide();
    Num.init();
    Num.handle();
});

hui(".hui-tab-title div").click(function(){
    var currentIndex=$(".hui-tab-body .hui-tab-item").eq($(this).index()).height()+54
    //var index = $(".hui-tab-title div.current").index() + 2;
    //var aH = $(".hui-tab-item").eq(index).height() + 10;
    $(".hui-tab-body").css("height",currentIndex);
});

//商品图片点击  进入商品详情
$("body").on('click', '.goodsDetail', function() {
	var goodsId = $(this).attr('goodsId');
	var num = $(this).attr('num');
	var indexNum = $(this).attr("indexNum");
	if(seq == null || seq == 0) {
		seq = 0;
	}
	window.location.href="/goods/goods/goodsDetail/goodsDetail.html?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq+"&num="+num+"&indexNum="+indexNum;///"+goodsId+"/"+seq+"/"+seq
});