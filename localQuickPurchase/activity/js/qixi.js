var actityType = getQueryString("actityType");
var ale = "<p style='text-align: center;'>没有更多了</p>";
var moreGoodsPState = 0;
var params = {}
params.columnName= "七夕专宠";
params.seckill= 1;
params.pageIndex = 1;
params.pageSize = 30;
function tabToggleData(index) {
    switch(index){
        case 0:
            // .zca  7.7专场  
            $.ajax({
                url:"/localQuickPurchase/selectionGoods/actityColumn",
                type:"GET",
                dataType:"json",
                data:{
                    'actityType': index//index = 0
                },
                success:function(res){
                    if(res.code != 200) return;
                    $(".zca").html(getColumnHtml(res.data));
                }
            })
            break;
        case 1:
            // .yh   满减优惠  
            $.ajax({
                url:"/localQuickPurchase/selectionGoods/actityColumn",
                type:"GET",
                dataType:"json",
                data:{
                    'actityType': index//index = 1
                },
                success:function(res){
                    if(res.code != 200) return;
                    $(".yh").html(getColumnHtml(res.data));
                }
            })
            break;
        case 2:
            // .zc-content   七夕专宠
            //加载数据
            $.ajax({
                url:"/localQuickPurchase/selectionGoods/SelectionGoodsCom",
                type:"POST",
                contentType:"application/json",
                dataType:"json",
                data:JSON.stringify(params),
                success:function(res){
                    if(res.code != 200) return;
                    if(res.data.list != null ){
                        for(var i = 0;i < res.data.list.length;i++){
                            var goods = res.data.list[i];
                            getSGoodsHtml(goods,i,params.pageIndex);
                        }
                    }else{
                        _html = ale;
                        $(".zc-content").html(ale);
                    }
                   
                }
            })
            break;
        //否则   
        default:
        break;
   }
}

function tabToggle(index) {
    if(index == "undefined" || index == null){
        index = 0;
    }else{
        index = Number(index);
    }
    $('.nav-con span').siblings().removeClass("cur");
    $('.nav-con span').eq(index).addClass("cur");
    $(".nav-list .con-item").eq(index).show().siblings().hide();
}

function getGoodsHtml(goods,listIndex){
    //listIndex  为 0开始
    var _html = "";
    if(goods == null){
        return _html;
    }
    //position  为 class 
    var position_1 = "lf ";//左边显示
    var position_2 = "rf ";//右边显示
    if((listIndex+1)%2==0){//被2整除的时候  左右切换位置
        position_1 = "rf ";//右边显示
        position_2 = "lf ";//左边显示
    }
    var distributionPrice = getDistributionPrice(goods.goodsProStandard);
    var goodsPrice = getGoodsPrice(goods.goodsProStandard);
    _html = '<div class="con-items"  onclick="goodsJump(\''+goods.goodsId +'\',0)">'+
    '<div class="'+position_1+' img-con">'+
    '<img src="'+ goods.thumbnail +'" alt="" onerror="this.src=\'/localQuickPurchase/distributionApp/images/goodsImg.png\'" />'+
    ' </div>'+
    '<div class="'+position_2+' prod-con">'+
    '<p class="prod-name">'+ goods.goodsName +'</p>'+
    '<p><span class="n-price">&yen;'+ distributionPrice +'</span><span class="o-price">&yen;'+ goodsPrice +'</span></p>'+
    '<a href="javascript:void(0);" class="buy-btn">立即抢购</a>'+
    '</div>'+
    '</div>';
    return _html;
}

function getColumnHtml(listCloumn){
    var _html = '';
    if(listCloumn == null || listCloumn.length ==0){
        _html = ale;
        return _html;
    }
    for(var i = 0;i < listCloumn.length;i++){
        var  columnName = listCloumn[i].columnName;
        _html += '<div class="con-body">'+
        '<div class="con-header">'+
        '<p class="con-title">'+ columnName +'</p>'+
        '</div>'+
        '<div class="con-list">';
        var listGoods = listCloumn[i].listGoods;
        if(listGoods == null || listGoods.length == 0){
            _html += ale;
        }else{
            for(var j = 0;j <= listGoods.length;j++){
                _html += getGoodsHtml(listGoods[j],j);
            }
        }
        _html += '<p class="more-btn radius-b">更多惊喜<a href="/localQuickPurchase/activity/moreList.html?columnName='+ columnName +'"></a></p></div></div>';
    }
    return _html;
}
//秒杀商品
function getSGoodsHtml(goods,listIndex,pageIndex){
        //listIndex  为 0开始
        var _html = "";
        if(goods == null){
            return _html;
        }
        var dataIndex = 1;//文案 活动已开始
        //position  为 class 
        var position_1 = "lf ";//左边显示
        var position_2 = "rf ";//右边显示
        if((listIndex+1)%2==0){//被2整除的时候  左右切换位置
            position_1 = "rf ";//右边显示
            position_2 = "lf ";//左边显示
        }
        var filds = 2;
        var seckillPrice = goods.goodsProStandard[0].seckillPrice;
        var goodsPrice = getGoodsPrice(goods.goodsProStandard);
        // --->>> 1.开始时间  2.现在的时间	3.结束时间	4.客户端的服务器的时间	5.定时器ID <<<---
        var beginTime,timeNow,endTime,timeServerClient,timerID;
        var  activityStartTime = goods.goodsProStandard[0].activityStartTime;
        var  activityFinishTime = goods.goodsProStandard[0].activityFinishTime
        var activityTime;
        timeNow = new Date().getTime();//当前时间
        var timestamp =Date.parse(new Date());
        if(activityStartTime > timestamp){
            filds = 1;
            dataIndex = 2;//活动未开始
            activityTime = new Date(activityStartTime).getTime();
        }else if(activityFinishTime >= timestamp){
            dataIndex = 3;//活动已开始
            activityTime = new Date(activityFinishTime).getTime();
            filds = 0;
        }
        var mask = "";
        var timerid ="timer01"+ listIndex;;
        if(judgeSales(goods)){
            mask = '<!-- 已售完遮罩层 -->  '+
            '<div class="mask-con"></div>';
            timerid ="";//
        }
        //var endTime = (new Date(goods.goodsProStandard[0].activityFinishTime).getTime());//结束时间
        //timeServerClient = activityTime - timeNow;//剩余结束时间 = 结束时间 - 当前时间
        //timeServerClient = endTime - timeNow;//剩余时间 = 结束时间 - 当前时间
        
        price = goods.goodsProStandard[0].seckillPrice;
        oldPrice = goods.goodsProStandard[0].goodsPrice;
        goods.seckillPrice = price;
        goods.goodsPrice = oldPrice;
       
        _html = '<div class="con-list">'+
        '<div class="con-items" onclick="goodsJump(\''+goods.goodsId +'\',1,'+filds+')">'+
        '<div class="img-con '+ position_1 +'">'+
        '<img src="'+ goods.thumbnail +'" alt=""  onerror="this.src=\'/localQuickPurchase/distributionApp/images/goodsImg.png\'" />'+
        '</div>'+
        '<div class="prod-con '+ position_2 +'">'+
        '<p class="prod-name">'+ goods.goodsName +'</p>'+
        '<p class="time-con" id="timer'+ dataIndex + pageIndex + listIndex +'">'+
        '<span class="time-text">倒计时:</span>'+
        '<input type="number" value="10" class="inputs">'+
        '<i>:</i>'+
        '<input type="number" value="21" class="inputs">'+
        '<i>:</i>'+
        '<input type="number" value="00" class="inputs">'+
        '</p>'+
        '<div class="price-con">'+
        '<p class="'+ position_1 +'">'+
        '<span class="n-price">¥'+ seckillPrice +'</span>'+
        '<span class="o-price">¥'+ goodsPrice +'</span>'+
        '</p>'+
        '<a href="javascript:void(0);" class="buy-btn rf">立即抢购</a>'+
        '</div>'+
        '</div>'+
        mask +
        '</div>'+
        '</div>';
        $(".zc-content").append(_html);
        setTimeout("qixi_show_time("+activityTime+","+dataIndex+","+pageIndex+","+listIndex+","+filds+")",1000);
    }
    //判断秒杀商品是否卖完
    function judgeSales(seckillGoods){
        var  goodsProStandard = seckillGoods.goodsProStandard;
        var activityQuantity = 0;
        for (let index = 0; index < goodsProStandard.length; index++) {
            var proStandard = goodsProStandard[index];
            activityQuantity += proStandard.activityQuantity;
        }
        console.log(activityQuantity   +  "     " + seckillGoods.activitySales)
        if(activityQuantity <= seckillGoods.activitySales){
            return true;
        }
        return  false;
    }
    function goodsJump(goodsId,index,filds){
        if (index == 1) {
            window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq+"&num="+filds+"&indexNum="+filds;
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
            history.go(-1);
        }, 200);
    }
    function goBack2(){
            history.go(-1);
    }
    function moreGoods(goods){
         //position  为 class 
        var position_1 = "lf ";//左边显示
        var position_2 = "rf ";//右边显示

        if((moreGoodsPState+1)%2==0){//被2整除的时候  左右切换位置
            position_1 = "rf ";//右边显示
            position_2 = "lf ";//左边显示
        }
        moreGoodsPState ++;//更新 更多商品左边右边显示的标记
        var distributionPrice = getDistributionPrice(goods.goodsProStandard);
        var goodsPrice = getGoodsPrice(goods.goodsProStandard);
        _html = '<div class="con-items"  onclick="goodsJump(\''+goods.goodsId +'\',0)">'+
        '<div class="'+position_1+' img-con">'+
        '<img src="'+ goods.thumbnail +'" alt="" onerror="this.src=\'/localQuickPurchase/distributionApp/images/goodsImg.png\'" />'+
        ' </div>'+
        '<div class="'+position_2+' prod-con">'+
        '<p class="prod-name">"'+ goods.goodsName +'"</p>'+
        '<p><span class="n-price">&yen;'+ distributionPrice +'</span><span class="o-price">&yen;'+ goodsPrice +'</span></p>'+
        '<a href="javascript:void(0);" class="buy-btn">立即抢购</a>'+
        '</div>'+
        '</div>';
        return _html;
    }
function getMore(){
    $.ajax({
        url: '/localQuickPurchase/selectionGoods/SelectionGoodsCom',
        type: 'POST',
        data: '{"columnName": "'+ columnName +'","pageIndex":'+page+',"pageSize":10}',
        contentType:'application/json;charset=UTF-8',
        success:function(result){
            var com = result.data.list;
            if(com != null){
                var  _html = "";
                for(var i=0;i<com.length;i++){
                    _html += moreGoods(com[i]);
                };
                page ++;
                $('.con-list').append(_html);
                //重置加载更多状态
                hui.resetLoadMore();
            } else{
                hui.endRefresh();
                hui.endLoadMore(true, '没有更多了...');
            } 
                //结束刷新
            hui.endRefresh();
        },
        error:function(result){
            hui.closeLoading();
            //hui.upToast('连接服务器失败！');
            hui.endRefresh();
        }
    })
}
//下拉刷新
function refresh(){
    page =1;
    $('.con-list').html("");
    $.ajax({
        url: '/localQuickPurchase/selectionGoods/SelectionGoodsCom',
        type: 'POST',
        data: '{"columnName": "'+ columnName +'","pageIndex":'+page+',"pageSize":10}',
        contentType:'application/json;charset=UTF-8',
        success:function(result){
            var com = result.data.list;
            if(com != null){
                var  _html = "";
                for(var i=0;i<com.length;i++){
                    _html += moreGoods(com[i])
                };
                page ++;
                $('.con-list').append(_html);
                //重置加载更多状态
                hui.resetLoadMore();
            }else{
                hui.endRefresh();
                hui.endLoadMore(true, '没有更多了...');
            }
            //结束刷新
            hui.endRefresh();
            
        },
        error:function(result){
            hui.closeLoading();
            //hui.upToast('连接服务器失败！');
            hui.endRefresh();
        }
    })
    
}
function findDetailByActBatch(acBatch){
    if(acBatch == null || acBatch == ""){
        return;
    }
    $.ajax({
        type : 'POST',
        url : '/localQuickPurchase/couponCardBagAction/findDetailByActBatch',
        async : false,
        data : {
            "acBatch" : acBatch,
            "page" : 1,
            "userSeq" : seq
        },
        success: function (data) {
            if (data.code == 200) {
                var couponsList = data.data;
                if (couponsList != null) {
                    var dataStr = couponsList.result;
                    dataStr = eval('(' + dataStr + ')');
                    if(dataStr != null){
                        var dataList = dataStr[1008].datas;
                        console.log(dataList);
                        if(dataList.length > 0){
                            var _html ="";
                            for (var i = 0; i < dataList.length; i++){
                                console.log(dataList[i]);
                                if(i==2){
                                    break;
                                }
                                _html +='<a href="javascript:void(0);" class="coupon-item">'+
                                '<span class="text1">'+dataList[i].couponsTypeDesc +'</span>'+
                                '<span class="text2" actbatchno="'+dataList[i].actBatchNo +'" onclick="receiceCoupon(this);">立即领取</span>'+
                                '<span class="hidenPlace" style="display:none">'+dataList[i].couponsId +'</span>'+
                                '<span class="text3">'+dataList[i].name +'</span>'+
                                '</a>';
                            }
                            _html+='<a href="/localQuickPurchase/distributionVA/receiveCoupons" class="coupon-more">'+
                                '<span>更多优惠券</span>'+
                            '</a>';
                            $(".coupon-con").html(_html);
                        }else{
                            
                        }
                    }else{
                        
                    }
                }
            }
        }
    });
}
/**
 * 领取优惠券
 */
function receiceCoupon(obj){
    //当前点击对象id
    if(seq == 0 || seq == ''){
        noLogin(0);
        return ;
    }
    var couponsId = $(obj).next()[0].innerText;
    var actBatchNo = $(obj).attr("actBatchNo");
    if(couponsId != null && couponsId != ""){
        $.ajax({
            type: 'POST',
            url: '/localQuickPurchase/couponCardBagAction/receiveAllcoupon',
            async: false,
            data : {
                userSeq : seq,
                couponsId : couponsId,
                actBatchNo : actBatchNo
            },
            success: function (data) {
                if (data.code == 200) {
                    if(data.data.code == "200"){
                        hui.toast("领取优惠券成功",800);
                    }else{
                        hui.toast(data.data.msg,800);
                       
                    }
                }else{
                    hui.toast(data.data.msg,800);
                }
            }
        });
    }
}
//点击分享按钮
var urlVal = window.location.href;//活动页的地址
var appUrl = urlVal+"&checkShare=1&shareSeq="+seq;
function share() {
    // 分享
    //判断是否是app
    var u = navigator.userAgent;
    //var shareGoodsPic = $(".hui-swipe-item").find("img:first").attr("src");
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        //点击分享
        share520Love(appUrl,'七夕专题活动','','','.share-content');
    } else{
        share520LoveWeb(appUrl,'七夕专题活动','','','.share-content');
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
}
// 商品二维码
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
        var link = urlVal+"&checkShare=1&shareSeq="+seq;
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
//设置的定时器  dataIndex(1:已结束,2:未开始,3:已开始)
function qixi_show_time(timeServerClient,dataIndex,index,i,filds){
    var text = "活动时间已结束！！！";
    
    var timer = document.getElementById("timer"+dataIndex+index+i);
    if(!timer){
        return ;
    }
    if (dataIndex == 1) {
        timer.innerHTML ="活动时间已结束！！！";
        return;
    }else if (dataIndex == 2){
        text = "距离活动开始:";
    } else if(dataIndex == 3){
        text = "距离活动结束:";
    }
    var time_now,timeDistance,strTime;  //1.当前时间		2.时间距离		3.拼接输出时间
    var day,hour,minute,second;  //1.天数		2.小时		3.分钟	4.秒
    //每秒钟都获取一次当前时间
    var time_now = new Date();
    //time_now = time_now.getTime();
    // 剩余时间 = 结束(开始)时间 - 当前时间
    //timeDistance = endTime-time_now;
    timeDistance = timeServerClient - time_now;
    timeServerClient = timeServerClient-1000;
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
        strTime=text  +"<span class='day'>"+day+"</span>天<span class='hour'>"+hour+"</span>时<span class='min'>"+minute+"</span>分<span class='sec'>"+second+"</span>秒";
        //定时器输出时间
        timer.innerHTML=strTime;
        //每秒循环执行
        setTimeout("qixi_show_time("+timeServerClient+","+dataIndex+","+index+","+i+","+filds+")",1000);
    } else {//倒计时结束执行的操作
        if(filds == 1 && dataIndex != 1){
            var page = {"num":1,"size":10};
            getListData(page);
        }else{
            timer.innerHTML ="活动时间已结束！！！";
            //clearTimeout(timerID);
            clearTimeout("活动时间已结束！！！");
        }
    }
}