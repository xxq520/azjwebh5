var ordernos = [];	//多个订单号,合并支付用
var payHint = "付款成功后,支付状态稍等片刻后更新...";	//待付款提示
var popupDistriOrder = getCookie("popupDistriOrder");//代理商升级弹窗控制
//payHint = "支付状态更新可能存在延迟...";
$(".mestips").html(payHint);
//返回个人中心页面
function backPersonalCenter() {
    // 部分原始app 返回原生界面
    try {
        //app 首页返回链接
        window.action.app_back();
    } catch (e) {
    }
    var _thisURl = document.referrer;
    if (_thisURl.indexOf("onlyRefund") > 0 || _thisURl.indexOf("refundDetail") > 0) {
        personalCenter();
    } else if (_thisURl.indexOf("distributionVA") > 0) {
        hui.back();
    } else {
        personalCenter();
    }
}

/**
 * 判断是否登录
 */
if (!isLogin()) {
    personalCenter();
}
/**
 * 获取登录的用户类型
 */
var userType = getLoginUserType();
var distributorType = getLoginUserType();

//买卖的状态：1 买, 2卖(代理商和服务商才有的状态)
if (isRoleAgent() || isRoleDealer()) {
    var buyAndSellStatus = 1;//默认为：1 买
    var isReset = false;
    $(".order-title-sell.color_red").show();
} else {
    var buyAndSellStatus = 1;//默认为：1 买
    //消费者就清除买卖按钮
    $(".order-title-sell.color_red").remove();

}

/*初始化轮播*/
var swiper=new Swiper('#swiper', {
    onTransitionEnd: function(swiper){
        var i=swiper.activeIndex;//轮播切换完毕的事件
        changePage(i);
    }
});

/*优先获取链接的值*/
var tabNum = getQueryString("tabNum");
if (tabNum == "" || tabNum == null) {
    var i = getCookie("tabNum");//首页0; 奶粉1; 面膜2; 图书3;
    setCookie("tabNum","",-1);
} else {
    var i = tabNum;
}
var curNavIndex = i;

/*初始化菜单*/
$("#nav p").click(function(){
    i=Number($(this).attr("i"));
    swiper.slideTo(i);//以轮播的方式切换列表
})
//var no = getQueryString("num");//首页0; 奶粉1; 面膜2; 图书3;
/*点击店铺订单分类进来的选中事件*/
if (i != "" && tabNum == null) {
    $("#orderSell").addClass("active").siblings("a").removeClass("active");
    if (isRoleAgent() || isRoleDealer()) {
        buyAndSellStatus = 2;
    }
    $("#nav p[i="+i+"]").trigger("click");
    isReset = false;
}
if (curNavIndex == "") {
    curNavIndex = 0;
    i = 0;
}

//支付回来的tab切换
if(tabNum != null && tabNum != ""){
    buyAndSellStatus = 1;
    //$("#orderSell").addClass("active").siblings("a").removeClass("active");
}
//切换选中样式的Class
/*setTimeout(function(){*/
if (i == 0 || i == null) {
    $("#nav p[i="+i+"]").removeClass("active");
    $("#nav p[i="+i+"]").addClass("active").trigger("click");
}else{
    $("#nav p").removeClass("active");
    $("#nav p[i="+i+"]").addClass("active").trigger("click");
}
/*},100)*/
var mescrollArr = new Array(6);//4个菜单所对应的4个mescroll对象

//初始化首页
if (curNavIndex == 0) {
    mescrollArr[0]=initMescroll("mescroll0", "dataList0");
} else if (curNavIndex == 1) {
    mescrollArr[1]=initMescroll("mescroll1", "dataList1");
} else if (curNavIndex == 2) {
    mescrollArr[2]=initMescroll("mescroll2", "dataList2");
} else if (curNavIndex == 3) {
    mescrollArr[3]=initMescroll("mescroll3", "dataList3");
} else if (curNavIndex == 4) {
    mescrollArr[4]=initMescroll("mescroll4", "dataList4");
} else if(curNavIndex == 5) {
    mescrollArr[5]=initMescroll("mescroll5", "dataList5");
} else if(curNavIndex == 6) {
    mescrollArr[6]=initMescroll("mescroll6", "dataList6");
}

/*切换列表*/
function changePage(i) {
    if(i==1 && buyAndSellStatus == 1){
        $(".footer-paid").hide();
    }else{
        $(".footer-paid").hide();
    }
    if(curNavIndex!=i) {
        //更改列表条件
        $("#nav p").each(function(n,dom){
            if (dom.getAttribute("i")==i) {
                dom.classList.add("active");
                //console.log(i)
            } else{
                dom.classList.remove("active");
            }
        })
        //隐藏当前回到顶部按钮
        //mescrollArr[curNavIndex].hideTopBtn();
        //取出菜单所对应的mescroll对象,如果未初始化则初始化
//		if(mescrollArr[i]==null){
        $(".mescroll-downwarp").remove();
        $(".mescroll-upwarp").remove();
        mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
//		}else{
        //检查是否需要显示回到到顶按钮
//			var curMescroll=mescrollArr[i];
        /*var curScrollTop=curMescroll.getScrollTop();
        if(curScrollTop>=curMescroll.optUp.toTop.offset){
            curMescroll.showTopBtn();
        }else{
            curMescroll.hideTopBtn();
        }*/
//		}
        //更新标记
        curNavIndex=i;
    }
}

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
    var dataIndex=curNavIndex; //记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
    getListDataFromNet(dataIndex, page.num, page.size, function(pageData){
        console.log("dataIndex="+dataIndex+", curNavIndex="+curNavIndex+", page.num="+page.num+", page.size="+page.size+", pageData.length="+pageData.length);
        console.log(pageData);
        mescrollArr[dataIndex].endSuccess(pageData.data.distrOrders.pageSize,pageData.data.distrOrders.hasNextPage);

        //设置列表数据
        setListData(pageData,dataIndex);
    }, function(){
        //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescrollArr[dataIndex].endErr();
    });
}

/*设置列表数据
 * pageData 当前页的数据
 * dataIndex 数据属于哪个nav */
function setListData(data,dataIndex){
    var orders = data.data.distrOrders.list;
    var ordersLength = data.data.distrOrders.list.length;
    /*待支付没有订单就隐藏合并支付按钮*/
    if (dataIndex ==1 && ordersLength != 0 && (buyAndSellStatus == null || buyAndSellStatus == 1)) {
        $(".footer-paid").show();
    }
    var html = "";
    for (var i = 0; i < orders.length; i++) {
        var num = i;
        var orderId = orders[i].orderId;//订单ID
        var orderno = orders[i].orderno;//订单号
        var goodsNum = orders[i].goodsNum;//商品数量
        var totalAmmount = orders[i].totalAmmount;//订单金额
        var useCash = orders[i].useCash; //使用的现金
        var useBalance = orders[i].useBalance; //使用的现金
        /*if (useCash != null) {
            totalAmmount = useCash; //实付金额
        }*/
        var freight = orders[i].logisticsPrice;//运费
        var orderStatus = orders[i].orderStatus;//订单状态：0未支付,1待接,4已接,8已收货
        var deliverStatus = orders[i].deliverStatus;//发货状态：0 全部(包括待付款(普通用户才展示待付款)) 1 待发货,4 待收货,5 售后/退换货
        var orderId = orders[i].orderId;//订单ID
        var waybill = orders[i].waybill;//物流单号
        var bEvaluation = orders[i].bEvaluation;//是否评价
        var carrier = orders[i].carrier;//承运公司
        var amount = orders[i].amount;//商品总价(不包含运费)
        var trackingNo = waybill;
        var totalAgentProfit = orders[i].totalAgentProfit;//每单订单经销商利润
        var profitAmount = orders[i].profitAmount;//每单订单代理商利润金额
        var operationButtonsOne = orders[i].operationButtonsOne;//订单操作按钮1
        var operationButtonsTwo = orders[i].operationButtonsTwo;//订单操作按钮2
        var operationButtonsThree = orders[i].operationButtonsThree;//订单操作按钮3
        var headWriting = orders[i].headWriting;//订单文案
        var unionPayPushBackMark = orders[i].unionPayPushBackMark;//订单文案
        var ifBrandProduct = orders[i].ifBrandProduct;//是否为品牌订单  1：是 ；0：不是
        totalAgentProfit = Number(parseFloat(totalAgentProfit)).toFixed(2);
        profitAmount = Number(parseFloat(profitAmount)).toFixed(2);
        /*
        if (supplierSeq == seq) {
            isItlocalProduct = true;
        } else {
            isItlocalProduct = false;
        }
        */
        var sSeq = orders[i].seq;
        html +='<div class="full-container" num="'+i+'"><div class="all">';
        /*店铺开始...*/
        // html += '<div class="shqshopping">';
        // if(null ==orders[i].ifBrandProduct  || 0 == orders[i].ifBrandProduct || '4' != orders[i].isLocaleRecruitOrders){
        if(null ==orders[i].ifBrandProduct  || 0 == orders[i].ifBrandProduct){
            html +='<div class="spn"><div class="spa_img">' +
                '<img src="'+orders[i].shopImgUrl+'" alt="">' +
                '</div>' +
                '<div>'+orders[i].shopName+'</div>';
        }else{
            var shopImgUrl = orders[i].shopImgUrl;
            html +='<div class="spn"><div class="spa_img">' +
                // '<img src="'+orders[i].shopImgUrl+'" alt="">' +
                '<img src="/localQuickPurchase/distributionApp/images/icon_1.png" alt="">' +
                '</div>' +
                '<div><a class="orderahref"  href="'+orders[i].brandProductUrl+'">'+orders[i].shopName+'</a></div>'+
                '<div class="more"><a class="shopList" href="'+orders[i].brandProductUrl+'"></a></div>';
        }
        console.log(orders[i].brandProductUrl);
        html+= '</div>';
        /*店铺结束...*/


        html +='<div class="all-header">';

// =================== 头部渲染的数据 ================ begin ================== 2018-5-26 重构===========================================
        html += getHeadwriting(buyAndSellStatus,orderno,orderStatus,dataIndex,headWriting,orderId,num);
// =================== 头部渲染的数据 ================  end  ================== 2018-5-26 重构===========================================

        html +='</div>';
        html +='<div class="good-detail" onclick=checkOrderDetail("'+orderno+'","'+buyAndSellStatus+'")>';
        var goods = orders[i].listOrderDetails;
        var isUserCoupon = orders[i].isUserCoupon;
        var goodsCountPrice = 0;
        for (var j = 0; j < goods.length; j++) {
            html +='<div class="goods-info" style="display: none">';
            console.info(goods[j]);
            var goodsName = goods[j].goodsName;//商品名
            var goodsImgUrl = goods[j].goodsImgUrl;//缩略图
            var count = goods[j].count;//商品数量
            var price = goods[j].price;//商品单价
            var amount = goods[j].amount;//商品总价
            var unit = goods[j].unit;//单位
            var spec = goods[j].spec;//规格
            var logisticsNo = goods[j].waybill;//物流号
            var logisticsName = goods[j].carrier;//物流名称

            var isActivityGoods = goods[j].isActivityGoods;//标识是什么商品  "1":秒杀商品 ; "0":普通商品
            isDistrbutionGoods = goods[j].isDistrbutionGoods;
            goodsCountPrice += amount;

            if (isActivityGoods == null) {
                isActivityGoods = "0";
            }
            if (logisticsNo != null && trackingNo == null){
                trackingNo = logisticsNo;
            }
            if (logisticsName != null && carrier == null){
                carrier = logisticsName;
            }
            html +='<img src="'+goodsImgUrl+'">';
            html +='<div class="order-detail"><div class="clearfix">';
            html +='<span class="order-name font-lg">'+goodsName+'</span>';
            html +='<span class="order-price font-md">￥'+amount.toFixed(2)+'</span>';//totalAmmount.toFixed(2)
            html +='</div>'
            html +='<div class="clearfix">'
            html +='<span class="color_gray order-attr">x'+count+(unit==null?"个":unit)+'</span>';
            if (spec != null) {//规格不为null的时候才展示规格
                html +='<span class="color_red order-promise">规格：'+spec+'</span>';
            }
            html +='</div>';
            //第一个商品
            if (j == 0) {
                html += '<div>下单时间: '+ formatDateTime(orders[i].purchaseDate) +'</div>';
            }
            html +='</div>';
            html +='</div>';
        }
        html +='</div>';
        html +='<div class="order-info">';
        if (ifBrandProduct == 1){
            html +='<span class="order-ifBrand">品牌订单</span>';
        }
        html +='<span class="font-lg">共'+(goods == null?0:goods.length)+'件商品</span>';
        var total_Amount = Number(goodsCountPrice==null?amount:goodsCountPrice);
        var freight = Number(freight==null?0:freight);
        console.info(freight);
        html +='<span class="font-lg">  实付: <span class="color_red">￥'+(parseFloat(totalAmmount).toFixed(2))+'</span></span>';
        html +='<span class="font-sm color_gray">(含运费: '+(freight.toFixed(2))+')</span>';
        html +='</div>';
        //利润
        if (isRoleAgent() && buyAndSellStatus == 2) {//代理商赚每单订单的利润
            html +='<div class="color_darkred pull-left font-md profitDiv"> 赚 ￥'+(profitAmount == "NaN"?0:profitAmount)+'</div>';
        } else if(isRoleDealer() && buyAndSellStatus == 2){//经销商赚每单订单的利润
            html +='<div class="color_darkred pull-left font-md profitDiv">代理商 赚 ￥'+(profitAmount == "NaN"?0:profitAmount)+'</div>';
            html +='<div class="color_darkred pull-left font-md profitDiv" id="profit">经销商 赚 ￥'+(totalAgentProfit == null?0:totalAgentProfit)+'</div>';
        }
// ==================== 订单列表--底部判断 ========================== begin =============================================================
        html +='<div class="order-btn font-md">';
        //状态文案
        if (headWriting != null && orderStatus != 0 && deliverStatus != 4 && curNavIndex != 5) {
            html +='<span class="check-receive color_red">'+headWriting+'</span>';
        }
        //订单状态操作按钮
        // if(unionPayPushBackMark && unionPayPushBackMark == 1) {
            if (operationButtonsOne != null) {
                html += operationButtonsOne;
            }
        // }
        if (operationButtonsTwo != null){
            html += operationButtonsTwo;
        }
        if (headWriting != null && orderStatus != 0 && deliverStatus != 4 && curNavIndex == 5) {
            html +='<span class="check-receive color_red">'+headWriting+'</span>';
        }
        if (operationButtonsThree != null){
            html += operationButtonsThree;
        }
        html += '</div>';
// ==================== 订单列表--底部判断 ========================== begin =============================================================

        if (useBalance != null && orderStatus != 0 ) {
            html +='<div class="color_darkred pull-left font-md profitDiv">零钱使用 ￥'+useBalance+'</div>';
            html +='<div class="color_darkred pull-left font-md profitDiv" id="profit">现金使用 ￥'+useCash+'</div>';
        }
        html += '</div></div>';

// ==================== 订单列表--底部判断 ========================== begin =============================================================

    }
    $("#dataList"+dataIndex).append(html);
    if (buyAndSellStatus != 2){
        $('.goods-info').show();
    }
}

/*联网加载列表数据
			 在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
			 请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
			 实际项目以您服务器接口返回的数据为准,无需本地处理分页.
 * */
function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
    if (isReset) {
        curNavIndex = 0;
        isReset = false;
    }
    var param;
    //参数
    if (isRoleConsumer() || isRoleVip()) {//消费者
        if (curNavIndex == 0) {//全部
            param ={"seq":seq,"userType":distributorType,"orderStatus":null,"deliverStatus":0,"pageIndex":pageNum,"pageSize":pageSize};
        } else if(curNavIndex == 1){//待付款
            param ={"seq":seq,"userType":distributorType,"orderStatus":0,"deliverStatus":0,"pageIndex":pageNum,"pageSize":pageSize};
        } else if (curNavIndex == 2) {//待发货
            param ={"seq":seq,"userType":distributorType,"orderStatus":1,"deliverStatus":1,"pageIndex":pageNum,"pageSize":pageSize};
        } else if(curNavIndex == 3){//待收货
            param ={"seq":seq,"userType":distributorType,"orderStatus":4,"deliverStatus":4,"pageIndex":pageNum,"pageSize":pageSize};
        } else if (curNavIndex == 4) {//退换货
            param ={"seq":seq,"userType":distributorType,"orderStatus":4,"deliverStatus":5,"pageIndex":pageNum,"pageSize":pageSize};
        } else if(curNavIndex == 5) {//待评价
            param = {"seq":seq,"userType":distributorType,"eva":1, "orderStatus":5,"deliverStatus":3,"pageIndex":pageNum,"pageSize":pageSize};
        } else if(curNavIndex == 6) {//已完成
            param = {"seq":seq,"userType":distributorType,"orderStatus":5,"deliverStatus":3,"pageIndex":pageNum,"pageSize":pageSize};
        };
    } else {//代理商、服务商
        if (curNavIndex == 0) {//全部
            param ={"seq":seq,"userType":distributorType,"orderStatus":null,"deliverStatus":0,"buyAndSellStatus":buyAndSellStatus,"pageIndex":pageNum,"pageSize":pageSize};
        } else if(curNavIndex == 1){//待付款
            param ={"seq":seq,"userType":distributorType,"orderStatus":0,"deliverStatus":0,"buyAndSellStatus":buyAndSellStatus,"pageIndex":pageNum,"pageSize":pageSize};
        } else if (curNavIndex == 2) {//待发货
            param ={"seq":seq,"userType":distributorType,"orderStatus":1,"deliverStatus":1,"buyAndSellStatus":buyAndSellStatus,"pageIndex":pageNum,"pageSize":pageSize};
        } else if (curNavIndex == 3){//待收货
            param ={"seq":seq,"userType":distributorType,"orderStatus":4,"deliverStatus":4,"buyAndSellStatus":buyAndSellStatus,"pageIndex":pageNum,"pageSize":pageSize};
        } else if (curNavIndex == 4) {//退换货
            param ={"seq":seq,"userType":distributorType,"orderStatus":4,"deliverStatus":5,"buyAndSellStatus":buyAndSellStatus,"pageIndex":pageNum,"pageSize":pageSize};
        } else if(curNavIndex == 5) {//待评价
            param = {"seq":seq, "userType":distributorType,"eva":1, "orderStatus":5, "deliverStatus":3,"buyAndSellStatus":buyAndSellStatus,"pageIndex":pageNum,"pageSize":pageSize};
        } else if(curNavIndex == 6) {//已完成
            param = {"seq":seq, "userType":distributorType, "orderStatus":5, "deliverStatus":3,"buyAndSellStatus":buyAndSellStatus,"pageIndex":pageNum,"pageSize":pageSize};
        };
    }
    var isMin = false;
    isMiniprogram().then(function (mini) {
        isMin = true
    }).catch(function () {});
    //延时一秒,模拟联网
    setTimeout(function () {
        param.from=isMin?"smallProgram" : "h5";
        $.ajax({
            type: 'GET',
            url: _content+'/dOrders/checkOrderInfoV1',
            data : param,
            dataType: 'json',
            success: function(data){
                if (data.code == 200) {
                    var listData=[];
                    var orderList = data.data.distrOrders.list;
                    //curNavIndex 首页0; 待付款1; 待发货2; 待收货3; 退换货4; 待评价5;
                    if(curNavIndex==0){
                        //首页 (模拟分页数据)
                        for (var i = (pageNum-1)*pageSize; i < pageNum*pageSize; i++) {
                            if(i==orderList.length) break;
                            listData.push(orderList[i]);
                        }

                    }else if(curNavIndex==1){
                        //待付款
                        for (var i = 0; i < orderList.length; i++) {
                            //if (data[i].pdName.indexOf("待付款")!=-1) {
                            listData.push(orderList[i]);
                            //}
                        }
                    }else if(curNavIndex==2){
                        //待发货
                        for (var i = 0; i < orderList.length; i++) {
                            //if (data[i].pdName.indexOf("待发货")!=-1) {
                            listData.push(orderList[i]);
                            //}
                        }
                    }else if(curNavIndex==3){
                        //待收货
                        for (var i = 0; i < orderList.length; i++) {
                            //if (data[i].pdName.indexOf(" 待收货")!=-1) {
                            listData.push(orderList[i]);
                            //}
                        }
                    }else if(curNavIndex==4){
                        //退换货
                        for (var i = 0; i < orderList.length; i++) {
                            //if (data[i].pdName.indexOf("退换货")!=-1) {
                            listData.push(orderList[i]);
                            //}
                        }
                    } else if(curNavIndex==5) {
                        //未完成
                        for (var i = 0; i < orderList.length; i++) {
                            listData.push(orderList[i]);
                        }
                    } else if(curNavIndex==6) {
                        //未完成
                        for (var i = 0; i < orderList.length; i++) {
                            listData.push(orderList[i]);
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
//}
//});

//改变订单类型
function changeOrderStatus(ovj,index){
    $(ovj).addClass("active").siblings("a").removeClass("active");
    $(".mescroll-downwarp").remove();
    $(".mescroll-upwarp").remove()
    //$("#orderBuy").toggle();
    //$("#orderSell").toggle();
    buyAndSellStatus = index;
    $("#nav p[i='0']").trigger("click");
    isReset = true;
    //checkOrders();
    var page = {"num":1,"size":10};
    getListData(page);
    setTimeout(function(){
        $(".mescroll-downwarp").remove();
        $(".mescroll-upwarp").remove();
        mescrollArr=new Array(6);
        mescrollArr[0]=initMescroll("mescroll0", "dataList0");
        $(".footer-paid").hide();
    },1000)
}

//勾选
function changeStatus(ev){
    $(ev).toggleClass('checkboxchecked');
}


/**
 * 合并支付并去到支付页面
 * @returns
 */
function mergePay(data) {
    console.log("ordernos: " + ordernos);
    console.log("userSeq: " + seq);
    console.log("mergePay(data) data: " + JSON.stringify(data));
    var code;
    $.ajax({
        type : "post",//定义提交的类型
        url : "/localQuickPurchase/pay/mergePay",
        dataType : "json",//设置返回值得类型
        contentType : "application/json;charset=utf-8",
        data : JSON.stringify(data),
        async : true,//是否异步请求，false为同步
        success : function(data) {//成功返回值执行函数
            console.log(data);
            if (data.status == 200) {
                var orderno = data.data.orderno;
                console.log("汇总订单号: " + orderno);
                payUrl(orderno, seq);
            } else {
                clearLoading();
                var message = data.message;
                if (message.indexOf("无法在微信里下单") > 0) {
                    code = 87;	//代表在本地商品在微信里不能支付
                }
                hui.alert(data.message);
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            clearLoading();
            console.log('error');
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return code;
}

//合并付款
function combinePaid() {
    loadingdate("正在跳转至支付页面!");
    ordernos = [];
    $('.checkbox').each(function () {
        if(!$(this).hasClass('checkboxchecked')){
            // 	//没有勾选
            // 	//hui.toast("请勾选要合并的订单(至少两个订单)！！");
            //    var order = $(this).next('.pull-left').children('.orderNum').text();
            //    ordernos.forEach(function(item,index){
            //    	if(item == order){
            //    		ordernos.splice(index,1);
            // 		}
            // 	})
            // } else {
            //有勾选
            var orNum = $(this).next('.pull-left').children('.orderNum').text();
            console.info(ordernos);
            ordernos.push(orNum);
        }
    });
    if (ordernos.length > 0) {
        var data = {};
        data.ordernos = ordernos;
        data.userSeq = seq;
        mergePay(data);

        /*if (payUrl != null && payUrl != "") {
            //window.location.href = payUrl;
        } else {
            var payUrl = mergePay();
            window.location.href = payUrl;
        }*/
        console.log("payUrl: " + payUrl);
    } else {
        clearLoading();
        hui.iconToast('至少勾选1个订单！', 'error');
    }
    console.log(ordernos);
}
//取消订单
function cancelOrder(orderId,num) {
    //var a=$('.full-container:eq('+num+')').children().children().children().html();
    //alert(a);
    hui.confirm('确定要取消吗?', ['返回','确定取消'], function(){
        //取消订单操作
        //参数：seq=3751621&orderId=5a4c9a6d424d6a6119d18963&status=3
        seq = seq;
        var status = 2;
        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : _content+'/dOrders/confirm',
            data :{"seq":seq,"orderId":orderId,"status":status},
            success : function(data){
                if (data.code==200) {
                    hui.iconToast("取消成功！！",'success');
                    updatehtml(num,orderId);
                }else{
                    hui.iconToast("取消失败！！",'error');
                }
            },
            error : function(data){
                hui.toast(data.message);
            }
        });
    });
    function updatehtml(num,orderId){
        $(".full-container").each(function(){
            if($(this).attr("num") == num){
                //头部插入删除按钮
                var _html = '<div class="color_darkred font-md pull-right" onclick="deleteOrder(\''+orderId+'\',\''+num+'\')" style="height:100%;padding-left:5px;display:flex;flex-direction: column;justify-content:center; ">';
                _html += '<span style="padding: 5px;    background: #e43a3d;color: white;border-radius: 4px;height: 1.2em;line-height: 1.2em;">删除</span>';
                _html += '</div>';
                _html += '<div class="color_darkred font-md pull-right">订单已取消</div>';

                //底部插入订单状态说明
                $(this).find(".all-header").find(".color_darkred").html(_html);
                var html ='<div class="order-btn font-md">';
                html += '<span class="check-receive color_red">订单已取消</span>';
                html +='</div>';
                $(this).find(".order-btn.font-md").html(html);
            }
        });
    }
}
//确定收货
function receiptOrder(orderId,num,orderno) {
    console.log(orderId);
    hui.confirm('是否确认收货？', ['返回','确认收货'], function(){
        //确定收货操作
        seq = seq;
        var status = 1;
        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : _content+'/dOrders/confirm',
            data :{"seq":seq,"orderId":orderId,"status":status},
            success : function(data){
                if (data.code==200) {
                    hui.iconToast("收货成功！！",'success');
                    $(".full-container").each(function(){
                        if($(this).attr("num") == num){
                            var html ='<div class="order-btn font-md">';
                            html +='<span class="check-ems"><a href="/localQuickPurchase/distributionVA/order/applyAfterSale?orderno='+orderno+'">申请售后</a></span>';
                            html +='</div>';
                            $('.order-btn.font-md:eq('+num+')').html(html);
                        }
                    });
                    window.location.reload();
                }else{
                    hui.iconToast("收货失败！！",'error');
                }
            },
            error : function(data){
                hui.toast(data.message);
            }
        });
    });
}
//删除订单
function deleteOrder(orderId,num) {
    console.log(orderId);
    hui.confirm('真的要删除这笔订单吗？', ['返回','确认删除'], function(){
        //删除订单操作
        var status = 3;
        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : _content+'/dOrders/confirm',
            data :{"userType":distributorType,"orderId":orderId,"status":status},
            success : function(data){
                if (data.code==200) {
                    hui.iconToast('删除成功！！', 'success');
                    setTimeout(function(){
                        $(".full-container").each(function(){
                            if($(this).attr("num") == num){
                                $(this).css("display","none");
                            }
                        });
                    },500);
                }else{
                    hui.iconToast('删除失败！！', 'error');
                }
            },
            error : function(data){
                hui.toast(data.message);
            }
        });
    });
}
//经销商本地商品需要经销商发货
var paySeq = 0;
var payOrderno = null;
function payOrders(supplierSeq,orderno){
    //hui.iconToast('请等待发货！', 'error');
    paySeq = supplierSeq;
    payOrderno = orderno;
    $(".popup_box").css("display","block").show();
}
//售后详情
function checkDetails(){
    hui.iconToast('该功能暂未开放！', 'error');//'success'
}
//单件去支付
function payment(orderno){
    /*var data = {};
    data.orderno = orderno;
    data.payStatus = 1;
    data.serialNumber = orderno;
    hui.confirm('确定去付款吗？', ['返回','确认'], function(){
        $.ajax({
            type : 'POST',
            dataType : 'json',
            contentType: "application/json;charset=utf-8",
            url : _content+'/pay/updatePayStatusByOrderno',
            data :JSON.stringify(data),
            success : function(data){
                if (data.status == 200) {
                    hui.iconToast(data.message, 'success');
                    //setTimeout(function(){
                        $(".full-container").each(function(){
                            if($(this).attr("num") == num){
                                $(this).css("display","none");
                            }
                        });
                    //},500);
                } else {
                    hui.iconToast(data.message, 'error');
                }
            },
            error : function(error){
                hui.iconToast(error.message, 'error');
            }
        });
    });*/
}
//订单详情
function checkOrderDetail(orderno,buyAndSellStatus){
    if (buyAndSellStatus != 2) {
        window.location.href = _content+"/distributionVA/order/orderDetail?orderNo="+orderno+"&seq="+seq+"&userType="+distributorType+"&buyAndSellStatus="+buyAndSellStatus+"&type=1";
    }
}
//检查售后审核状态
function getReviewStatus(orderno){
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : _content+'/afterSales/findOneAfter',
        data :{"orderno":orderno},
        success : function(data){
            var after = data.data;
            return after;
        },
        error : function(error){
            hui.iconToast(error.message, 'error');
        }
    });
}
/*经销商确认发货*/
$("#delivery").on('click',function(){
    var funType = 1;
    var waybillNo = $("#waybillNo").val();
    if (waybillNo == null || waybillNo == "") {
        hui.toast("请输入快递单号");
        return;
    }
    var company = $("#company").val();
    var bool = checkNum(waybillNo);
    if (bool) {
        var param = {};
        param.supplierSeq = paySeq;
        param.orderno = payOrderno;
        param.waybill = waybillNo;
        param.funType = funType;
        $.ajax({
            type : 'POST',
            dataType : 'json',
            url : _content+'/dOrders/updateDeliverInfoByOrderno',
            contentType: "application/json;charset=utf-8",
            data :JSON.stringify(param),
            success : function(data){
                if (data.code == 200) {
                    hui.alert("发货成功");
                    $(".popup_box").hide();
                } else {
                    hui.alert(data.message);
                    $(".popup_box").hide();
                }
            },
            error : function(data){
                hui.iconToast(data.message, 'error');
            }
        });
    } else {
        hui.toast("快递单号只能输入数字");
    }
});
function checkNum(obj){
    var reg = new RegExp("^[0-9]*$");
    var obj = document.getElementById("waybillNo");
    if(!reg.test(obj.value)){
        return false;
    }
    return true;
}
/*新付款的订单限定1小时内的操作*/
function comptime(beginTime, endTime){
    //时间的字符串格式“yyyy-MM-dd”
    var beginTimes=beginTime.substring(0,10).split('-');
    var endTimes=endTime.substring(0,10).split('-');
    var d1 = new Date();
    var d2 = new Date();
    d2.setFullYear(parseInt(endTimes[0]),parseInt(endTimes[1])-1,parseInt(endTimes[2]));
    d1.setFullYear(parseInt(beginTimes[0]),parseInt(beginTimes[1])-1,parseInt(beginTimes[2]));
    var a =(Date.parse(d2+"")-Date.parse(d1+""))/3600/1000;
    if(a > 1){
        alert("结束时间和开始时间的间隔须小时");
    } else if(a < 0){
        alert("结束时间要大于开始时间");
    }
}

function isComplain(orderno,userSeq,userName){
    $.ajax({
        type : 'POST',
        dataType : 'json',
        url : _content+'/complainAction/findAllComplain',
        contentType: "application/json;charset=utf-8",
        data : JSON.stringify( {
            "orderno" : orderno
        }),
        success : function(data){


            if(data.code == 200){
                console.log(data.data);

                if(data.data == ""){
                    //投诉表中查不到该订单数据，没有投诉过
                    window.location.href = "/localQuickPurchase/distributionVA/order/complain?orderno="+orderno+"&userSeq="+userSeq+"&userName="+userName+"";
                }else{
                    //投诉表中查到该订单数据，已经投诉过
                    hui.confirm("该订单只能投诉一次，请不要重复投诉！");
                }

            }




        },
        error : function(error){
            hui.iconToast(error.message, 'error');
        }
    });
}
/**
 * 查询用户是否满足升级条件
 * @returns
 */
if(isLogin()) {
    findUserConsumptionOrder();
}
function findUserConsumptionOrder() {
    var loginUserType = getLoginUserType();
    $.ajax({
        type : 'POST',
        contentType: "application/json;charset=utf-8",
        dataType : 'json',
        url : _content+'/dOrders/findUserConsumptionOrder',
        data : JSON.stringify({"seq" : seq, "userTypeApp":loginUserType, "isNewType" : true}),
        success : function(data){
            if(data.code == 200){
                var data = data.data;
                isConsumption = data.isConsumption;
                superiorType = data.superiorType;
                choiceWay = data.choiceWay;
                userType = data.userType;
                upgradeApplyState = data.upgradeApplyState
                specialUpgrade = data.specialUpgrade;

                //非会员和没有上级的代理商弹窗引导去绑定关系
                if (superiorType == 0 || userType == 1) {
                    //获取用户绑定弹窗次数
                    var bindingWindows = getCookie("bindingWindows");
                    if(bindingWindows != "three"){
                        //修改绑定弹窗次数的值
                        setBindingWindowsVal(bindingWindows);
                        hui.confirm(alertMessage, ['下次再说', '立即绑定'], function() {
                            window.location.href = "/localQuickPurchase/distributionVA/personal/bindingRole";
                        });
                    }
                }
                //state: 0 无操作, 1 已经提交申请, 2 上级拒绝(没有三次), 3 上级拒绝了三次 , 4 升级经销商已经填写资料, 5 达到条件可以去填写资料 ,6 还没达到升级条件
                if(specialUpgrade && upgradeApplyState == 0) {
                    hui.confirm('您已满足升级经销商条件,是否去填写资料升级', ['取消','确定'], function() {
                        submitApply();
                        window.location.href="/localQuickPurchase/distributionVA/upgradeAgent?distributorSeq="+seq+"&upgradeType=1";
                    },function(){
                    });
                } else {
                    if(userType != 3) {
                        if(isConsumption && popupDistriOrder != "true") {
                            setCookie("popupDistriOrder","true",30);
                            $("#popup").css('display','block');
                        }
                    }
                    var upgTypeMessage;
                    if (userType == 1 || userType == 2) {
                        upgTypeMessage = '代理商';
                    }
                    if (userType == 3) {
                        upgTypeMessage = choiceWayMessage(choiceWay);
                    }
                    if(upgradeApplyState == 2) {
                        hui.confirm('您申请成为'+ upgTypeMessage +'的请求被拒绝,您还可以再次申请', ['取消','确定'], function() {
                            if (userType == 1 || userType == 2) {
                                submitApply();
                            }else{
                                $("#distributorScancode").show();

                            }
                        },function(){
                        });
                    }
                    if(upgradeApplyState == 3) {
                        hui.confirm('您申请成为'+ upgTypeMessage +'的请求被拒绝被拒绝三次了,您可以向平台投诉', ['取消','确定'], function() {
                            window.location.href='/localQuickPurchase/distributionVA/applyComplaint';
                        },function(){
                        });
                    }
                    //升级成功
                    if(upgradeApplyState == 9) {
                        hui.alert("升级成功,请退出重新登录", "确认", function(){
                            loginOffByBack();
                            setTimeout(function () {
                                noLoginPage();
                            }, 1000);
                        });
                    }

                    if(upgradeApplyState == 11) {
                        hui.alert("当前角色发生变化，请重新登录", "确认", function(){
                            loginOffByBack();
                            setTimeout(function () {
                                noLoginPage();
                            }, 1000);
                        });
                    }
                }

            }
        },
    });
}

//获取头部文案
function getHeadwriting(buyAndSellStatus,orderno,orderStatus,dataIndex,headWriting,orderId,num){
    var orderStype ="height:100%;"+
        "padding-left:5px;"+
        "display:flex;"+
        "flex-direction: column;"+
        "justify-content:center; ";
    var orderStypeSpan =  "padding: 5px;" +
        "    background: #e43a3d;" +
        "    color: white;" +
        "    border-radius: 4px;" +
        "    height: 1.2em;"+
        "    line-height: 1.2em;";
    var html = '';
    if (orderStatus == 0) {
        if ((buyAndSellStatus == 1 || buyAndSellStatus == undefined) && dataIndex == 1) {//买的订单
            // html +='<div class="checkbox checkboxchecked" onclick="changeStatus(this)"></div>';
        }
        if (buyAndSellStatus == 2) {//卖的订单
            html +='<div class="color_darkgray pull-left"><span class="order-budge-sell">卖</span>订单号：<span class="orderNum">'+orderno+'</span></div>';
        } else {//买的订单
            html +='<div class="color_darkgray pull-left"><span class="order-budge-buy">买</span>订单号：<span class="orderNum">'+orderno+'</span></div>';
        }
    } else {
        if (buyAndSellStatus == 2) {//卖
            html +='<div class="color_darkgray pull-left"><span class="order-budge-sell">卖</span>订单号：'+orderno+'</div>';
        } else {//买
            html +='<div class="color_darkgray pull-left"><span class="order-budge-buy">买</span>订单号：'+orderno+'</div>';
        }
    }
    if (orderStatus == 2 && buyAndSellStatus != 2){
        html +='<div class="color_darkred font-md pull-right" onclick="deleteOrder(\''+orderId+'\',\''+num+'\')" style="'+orderStype+'"><span style="'+orderStypeSpan+'">删除</span></div>';
    }
    html +='<div class="color_darkred font-md pull-right">'+headWriting+'</div>';
    return html;
}

//升级订单不能申请退款、退货退款(待发货)
function emsRefund(orderno,saleType,totalAmmount,supplierSeq,route,isConsumptionOrder){
    if(isConsumptionOrder == "true"){
        hui.alert("升级订单不能退款");
    }else if(isConsumptionOrder && isConsumptionOrder != "false"){
        hui.alert("升级订单不能退款");
    }else {
        window.location.href="/localQuickPurchase/distributionVA/order/onlyRefund?orderno="+orderno+"&saleType="+saleType+"&totalAmmount="+totalAmmount+"&supplierSeq="+supplierSeq+"&route="+route+"";
    }
}
//跳转订单评论
function orderEva(goodsCode,orderno,seq){
    if(alreadyEva(orderno,goodsCode)){
        hui.confirm("该订单已评价,是否去查看评论",['取消','确定'],function(){
            window.location.href="/localQuickPurchase/distributionVA/orderEva/mycomment";
        });
        return;
    };
    window.location.href="/localQuickPurchase/distributionVA/orderEva/postcomment?orderno="+orderno+"&goodsCode="+goodsCode+"&seq="+seq;
}

//查找该订单是否已评论
function alreadyEva(orderno,goodsCode){
    var ifAlready = false;
    $.ajax({
        type : 'POST',
        url : '/localQuickPurchase/api/eva/findEvaByOrderno',
        dataType : "json",	//设置返回值得类型
        data : {
            "orderno" : orderno,
            "goodsCode" : goodsCode
        },
        async : false,
        success : function(result) {
            if(result.code == 200){
                ifAlready =  result.data;
            }
        }
    });
    return ifAlready;
};
