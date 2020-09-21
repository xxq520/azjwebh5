var orderno = getQueryString("orderNo"); //订单编号
var seq = getQueryString("seq");
var userType = getQueryString("userType");
var buyAndSellStatus = getQueryString("buyAndSellStatus");
var profitPrice = 0.0;//优惠价
var systemTime = null;
var Coums=shopgd(seq);  //seq用户的ID
var skuArr=[];
var goodsOrder;
var orderDetail = true;

//订单快照
function snapShop (num){
    var newSku=skuArr[num].slice(1);
    window.location.href = "/localQuickPurchase/orderSnapshot/snapshot.html?orderno="+orderno+ "&orderSku=" + newSku;
}



function getYhqHtm(data) {
    var goodsYhq = data.yHQ;
    var type=getRoleType();
    var yhqHtml = "";
    console.info("type===="+type+"Coums==="+Coums+"seq===="+seq);
    if (goodsYhq) {
        if (type==1||type==2||!type) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else if ((type==3|| type==4) && Coums<=100) {
            yhqHtml+='<img style="height: 25px;" class="haha"  src="/localQuickPurchase/coupons/images/home_icon_label_2@2x.png" onclick=jumpCoupon()>'
        }else {
            yhqHtml+=""
        }
    } else {yhqHtml+=""}
    return yhqHtml;
}

var data = {
    "url":"/localQuickPurchase/dOrders/findDetail",
    "functions":{
        "init":function(){
            var param = {"seq":seq,"userType":userType,"orderno":orderno,"dealStatus":buyAndSellStatus,"from":"h5"};
            var url = "/localQuickPurchase/dOrders/findDetail";
            $.post(url,param,function(result){
                if(result.code != 200){
                    $(".main_container").html("请求失败");
                    return;
                }
                if(result.data == null || result.data == ''){
                    $(".main_container").html("请求失败");
                    return;
                }
                data.functions.initDate(result.data);
            });
        },
        "initDate":function(order){
            systemTime = order.currentTime;
            var imgIdArr = order.dOrders.imgIdArr;
            var html = "";
            var reviewStatus = order.dOrders.reviewStatus;
            var refusedAfterWhy = order.dOrders.refusedAfterWhy;//审核状态
            var afterReason = order.dOrders.afterReason;//申请售后原因
            var afterWhy = order.dOrders.afterWhy;//申请售后理由
            var refundNo = order.dOrders.refundNo;//售后单号
            var afterBeginTime = order.dOrders.afterBeginTime;//售后发起的时间

            var totalAgentProfit = order.dOrders.totalAgentProfit;//每单订单代理商利润
            var profitAmount = order.dOrders.profitAmount;//每单订单网络店主利润金额
            var route = order.dOrders.route;
            var totalAmmount = order.dOrders.totalAmmount;//应付总计金额(现金+零钱)
            var useCash = order.dOrders.useCash;//应付金额
            var useBalance = order.dOrders.useBalance; //零钱
            var couponDiscountMoney = Number(parseFloat(order.dOrders.couponDiscountMoney)).toFixed(2); //优惠券
            var couponRebate = Number(parseFloat(order.dOrders.couponRebate) / 10).toFixed(2);
            var supplierSeq = order.dOrders.supplierSeq;//供应商seq
            var orderno =order.dOrders.orderno;//订单号
            var isSingleLock = order.dOrders.isSingleLock; // 锁单状态
            var buyersType = order.dOrders.buyersType;//购买者的类型
            var orderStatus = order.dOrders.orderStatus; //订单状态 ：待接1，已取消2(用户取消)， 已拒绝3，已接4，已完成5, 支付过期6, 支付完成待接过期7 ,确认收货8   已删除  37   供应商取消9
            var deliverStatus = order.dOrders.deliverStatus;//发货状态
            var isConsumptionOrder = order.dOrders.isConsumptionOrder;//7960特殊订单,不能申请售后
            var headWriting = order.dOrders.headWriting;
            totalAgentProfit = Number(parseFloat(totalAgentProfit)).toFixed(2);
            profitAmount = Number(parseFloat(profitAmount)).toFixed(2);
            var userSeq = order.dOrders.seq;
            var userName = order.dOrders.userName;
            var waybill = order.dOrders.waybill;//物流号
            var carrier = order.dOrders.carrier;//物流公司
            var operationButtonsOne = order.dOrders.operationButtonsOne;//订单操作按钮1
            var operationButtonsTwo = order.dOrders.operationButtonsTwo;//订单操作按钮2
            var operationButtonsThree = order.dOrders.operationButtonsThree;//订单操作按钮3
            //console.log(order.dOrders.listOrderDetails);
            //获取
            var imgsrc = order.dOrders.listOrderDetails[0].goodsImgUrl;
            goodsName = order.dOrders.listOrderDetails[0].goodsName;
            var count = order.dOrders.listOrderDetails[0].count;
            goodsOrder = {
                orderGoodsName: goodsName,
                //订单的金额
                orderMonery: useCash.toFixed(2),
                //订单的创建时间
                orderCreateTime: formatDateTime(order.dOrders.purchaseDate),
                //订单的文案
                deliverStatusStr: headWriting,
                //订单规格的数量
                orderCount: count,
                orderNo: orderno,
                goodsImgUrl: imgsrc
            };
            var goodsOrderJSON = "";
            if (goodsOrder != userName) {
                goodsOrderJSON = JSON.stringify(goodsOrder);
                sessionStorage.setItem("goodsOrder", goodsOrderJSON);
                goodsOrder = "";
            }
            open();
            html += '<div class="hui-list bg_white margin-t-3 personal_list">';
            html += '<div class="pull-left" style="width: 8%;">';
            html += '</div>';

            html+='<div class="pull-right" style="width: 92%;">';
            html+='<div class="personal_tel">';
            //html+='<span class="font-lg">'+order.dOrders.shopName+'（'+order.dOrders.userName+'）</span>';
            var shippingName = order.dOrders.shippingAddress.shippingName; //收件人姓名
            var shippingTelephone = order.dOrders.shippingAddress.shippingTelephone; //收件人姓名
            var tipName = order.dOrders.shippingAddress.tipName; //收件人姓名
            var tipCity = order.dOrders.shippingAddress.tipCity; //收件人姓名
            var tipProvince = order.dOrders.shippingAddress.tipProvince; //收件人姓名
            var address = order.dOrders.shippingAddress;
            if(tipName == null){
                tipName = "";
            }
            if(tipProvince == null){
                tipProvince = "";
            }

            /**
             * 查看卖单时屏蔽物流信息 收货人信息及收货地址 屏蔽部分关键信息
             */
            var consigneesAddress;//收货人地址
            var consigneeInformation;//收货人信息

            consigneesAddress = getAddressStr(address.tipName, address.address);
            consigneeInformation = shippingName + (shippingTelephone);
            /**
             * 设置图文信息
             * @type {jQuery|undefined}
             */


            html += '<span class="font-lg">' + consigneeInformation + '</span>';
            html += '<i class="redico">默认信息</i>';
            html += '</div>';
            html += '<div class="font-md margin-t-3">收货地址：' + consigneesAddress + '</div>';
            html += '</div>';
            html += '</div>';

            //11111
            html+='<div class="hui-list bg_white margin-t-3 ordergood_list">';
            var goods  = order.dOrders.listOrderDetails;
            console.log(goods);
            var totalAmountForCount1 = order.dOrders.amount;
            var totalPreferentialHowManyCount = order.dOrders.totalPreferentialHowManyCount;
            var goodsTotalAmmount = 0.0;
            var preferentialHowManyTotal = 0.0;//总优惠
            var goodsPriceCount = 0.0;//总商品金额
            var goodsPriceAmountForCount = order.dOrders.amount;//订单总商品金额
            if(goods != null && goods != '') {
                for (var i = 0; i < goods.length; i++) {

                    //处理订单商品SKU数据过长
                    var strGood=JSON.stringify(goods[i]);
                    var strGoodsTwo=strGood;
                    var strPrev=strGood.slice(0,strGood.indexOf("orderSku")+11)+"A";
                    var strNext=strGoodsTwo.slice(strGoodsTwo.indexOf("orderSku")+11,strGoodsTwo.length);
                    goods[i]=JSON.parse(strPrev+strNext);
                    skuArr.push(goods[i].orderSku);

                    var amount = (goods[i].amount == null ? 0.0 : goods[i].amount);
                    var goodsId = goods[i].goodsId;
                    var goodsCode = goods[i].goodsCode;
                    var sku = goods[i].orderSku;
                    var goodsName = (goods[i].goodsName == null ? "暂无商品名" : goods[i].goodsName);
                    var spec = (goods[i].spec == null ? "暂无规格信息" : goods[i].spec);
                    var count = (goods[i].count == null ? 0 : goods[i].count);
                    var preferentialHowMany = goods[i].preferentialHowMany;
                    goodsPriceAmountForCount = numAdd(goodsPriceAmountForCount,preferentialHowMany);
                    var price = goods[i].price;//商品原价
                    var isActivityGoods = goods[i].isActivityGoods;//标识是什么商品  "1":秒杀商品 ; "0":普通商品
                    var agentProfit = goods[i].agentProfit;// 代理商利润
                    var distributorProfit = goods[i].distributorProfit;// 分销商利润
                    var logisticsNo = goods[i].waybill;//物流号
                    var logisticsName = goods[i].carrier;//物流名称
                    var partialRefund = goods[i].partialRefund;//部分退款
                    goodsPriceCount = (goodsPriceCount + price);
                    if (amount != null && amount != '') {
                        goodsTotalAmmount += amount;
                    }
                    if (isActivityGoods == null) {
                        isActivityGoods = "0";
                    }
                    if (logisticsNo != null && waybill == null) {
                        waybill = logisticsNo;
                    }
                    if (logisticsName != null && carrier == null) {
                        carrier = logisticsName;
                    }
                    //外加上优惠劵金额
                    if (couponDiscountMoney != null && couponDiscountMoney > 0) {
                        preferentialHowManyTotal = numAdd(preferentialHowManyTotal, couponDiscountMoney);
                    }
                    if (couponRebate != null && couponRebate > 0) {
                        preferentialHowManyTotal = numSub(goodsPriceCount, numMulti(goodsPriceCount, couponRebate / 10));
                    }
                    html += '<div class="orderlist" style="padding-bottom: 0.5rem;"><div class="pull-left" style="width: 32%;">';
                    html += '<div class="ordergood-img" goodsId="' + goodsId + '" num="' + isActivityGoods + '">';
                    html += '<img src="' + goods[i].goodsImgUrl + '" />';
                    html += '</div>';
                    html += '</div>';

                    html += '<div class="pull-right" style="width: 68%; position: relative;">';
                    html += '<p class="order_p_1">' + goodsName + '</p>';
                    html += '<p class="order_p_2">规格:' + spec + '</p>';
                    html += '<p class="order_p_2">数量:' + count + '</p>';
                    html += '<p class="order_p_3">金额:￥' + amount.toFixed(2) + '</p>';
                    html += '<p class="order_p_4" style="padding-left: 0.64rem;color: #e4393c;font-size: 0.512rem;padding-bottom: 0.1rem;">优惠:￥' + preferentialHowMany.toFixed(2) +
                        '<button class="snapShop" data-id="'+ sku+'" onclick="snapShop('+i+')">交易快照</button></p>';
                    if (isRoleAgent() && buyAndSellStatus == 2) {//网络店主赚每单订单的利润
                        html += '<p class="color_darkred pull-left margin-l-5 font-md font-weight"> 赚 ￥' + (distributorProfit == null ? (profitAmount == null ? 0 : profitAmount) : distributorProfit) + '</p>';
                    } else if (isRoleDealer() && buyAndSellStatus == 2) {//代理商赚每单订单的利润
                        html += '<p class="color_darkred pull-left margin-l-5 font-md font-weight"> 赚 ￥' + (agentProfit == null ? (totalAgentProfit == null ? 0 : totalAgentProfit) : agentProfit) + '</p>';
                    }

                    html += '</div><div style="" class="operation">';
                    if(seq == order.dOrders.seq && !isSingleLock  && route == 4 &&  (orderStatus == 5 || orderStatus == 4) && !partialRefund ){//已完成或待收货的单显示部分退款按钮
                        html +=
                            '<span class="eva refund" onclick="applyAfterSale(\'' + orderno + '\',' + isConsumptionOrder + ',\'' + goods[i].orderSku + '\')">部分退款</span>';
                    }
                    if (seq == order.dOrders.seq && orderStatus == 4) {//显示查看物流
                        html +=
                            '<a href=\'/localQuickPurchase/distributionVA/order/checkLogistics?trackingNo=' + logisticsNo + '&orderno=' + orderno + '&carrier=' + carrier + '\'><span class="eva refund">查看物流</span></a>';
                    }
                    //订单评论 按钮  start
                    if (seq == order.dOrders.seq && route == 4 && orderStatus == 5 && goods[i].bEvaluation != null && !(goods[i].bEvaluation)) {
                        html +=
                            '<span class="eva" onclick="orderEva(\'' + goodsCode + '\',\'' + orderno + '\',' + seq + ',\'' + goods[i].orderSku + '\')">评论</span>';
                    } else {
                    }
                    html += '</div></div>';
                    //插入物流详情
                    var logistcsInfo = goods[i].logistcsInfo;
                    if (logistcsInfo != null) {
                        html += '<div class="hui-list bg_white margin-t-3 phy_list font-sm" id="logisticsList">';
                        html += '<a class="hui-arrow" onclick=logistics("' + logisticsNo + '","' + logisticsName + '")>';
                        html += '<span class="font-md">' + logistcsInfo + '</span>';
                        html += '</a>';
                        html += '</div>';
                    }
                }
            }
            /*售后类型*/
            if (route != 4) {
                html += '<div class="order_remark font-md">售后类型：';
                var afterText = "";
                if (route == 1) {//换货
                    afterText = "换货";
                } else if (route == 2) {//退货/退款
                    afterText = "退货/退款";
                } else if (route == 3) {//仅退款
                    afterText = "仅退款";
                }
                html += '<span>' + afterText + '</span>';//class="order_p_btn"
                html += '</div>';
                html += '<div style="clear:both"></div>';//清除浮动
            }
            /*售后单号*/
            if (refundNo != null) {
                html += '<div class="order_remark font-md">售后单号：';
                html += '<span>' + refundNo + '</span>';//class="order_p_btn"
                html += '</div>';
                html += '<div style="clear:both"></div>';//清除浮动
            }
            /*售后原因*/
            if (afterReason != null) {
                html += '<div class="order_remark font-md">售后原因：';
                html += '<span>' + afterReason + '</span>';//class="order_p_btn"
                html += '</div>';
                html += '<div style="clear:both"></div>';//清除浮动
            }
            /*售后理由*/
            if (afterWhy != null) {
                html += '<div class="order_remark font-md">售后理由：';
                html += '<span>' + afterWhy + '</span>';//class="order_p_btn"
                html += '</div>';
                html += '<div style="clear:both"></div>';//清除浮动
            }
            /*发起售后的时间2222*/
            if (afterBeginTime != null) {
                html += '<div class="order_remark font-md">售后开始时间：';
                html += '<span>' + formatDateTime(afterBeginTime) + '</span>';//class="order_p_btn"
                html += '</div>';
                html += '<div style="clear:both"></div>';//清除浮动
            }

            /*图片*/
            if (imgIdArr != null && imgIdArr.length > 0) {
                //console.log(imgIdArr.length);
                html += '<div class="order_remark font-md">图片：';
                html += '<ul>';
                for (var i = 0; i < imgIdArr.length; i++) {
                    var src = imgIdArr[i];
                    //<img src="/i/eg_tulip.jpg">
                    html += '<li style="display : inline;">';
                    html += '<img style="height : 3rem;width : 4rem;" onclick="showImg(src)" src=' + src + '>';
                    html += '</li>';
                    html += '&nbsp;&nbsp;';
                }
                html += '</ul>';
                html += '</div>';
                html += '<div style="clear:both"></div>';//清除浮动
                html += '<div class="mask2" onclick="cancelMask2()"></div>';
                html += '<div class="blow_up"></div>';

            }

            /*if (orderStatus == 4 && isItlocalProduct == false) {//已接单
                if (deliverStatus == 1 || deliverStatus == 4) {
                    // 判断是否锁单
                    if(isSingleLock == false && isItlocalProduct == false && buyAndSellStatus == 1 && isConsumptionOrder == false){
                        html+='<div class="order_remark font-md">';
                        html+='<button class="order_p_btn" onclick=afterSales("'+order.dOrders.orderno+'")>申请售后</button>';//class="order_p_btn"
                        html+='</div>';
                    }
                }
            }*/
            /*审核备注*/
            if (refusedAfterWhy != null) {
                html += '<div class="order_remark font-md">审核备注：';
                html += '<span>' + refusedAfterWhy + '</span>';//class="order_p_btn"
                html += '</div>';
                html += '<div style="clear:both"></div>';//清除浮动
            }
            html += '<div class="order_remark font-md">';
            html += '备注：<span>' + ((order.dOrders.remark == "" || order.dOrders.remark == null) ? "暂无备注！" : order.dOrders.remark) + '</span>';
            html += '</div>';
            //判断是否错单
            //var receivingTime = order.receivingTime;//用户签收时间
            var deliverTime = order.dOrders.deliverTime;//收货时间
            //receivingTime = "2018-2-26 19:57:06";
            var oldTime = null;
            var newTime = null;
            if (orderStatus == 4 && deliverStatus == 4) { //待收货
                if (deliverTime != null && deliverTime != "") {
                    if (isSingleLock == false) {
                        oldTime = fun_date(deliverTime, 7);
                        newTime = changeToData(oldTime) - systemTime;
                        if (newTime > 0) {
                            countDowns(newTime / 1000, "receivingTime");
                            html += '<div class="order_remark font-md">';
                            html += '系统自动收货倒计时：<span id="receivingTime"></span>';
                            html += '</div>';
                        }
                    }
                }
            }
            // ================== 预售商品预计发货时间 ============== begin ==============================

            /* 标识是什么订单订(只针对快速下单)： 1 ：现场招商 ; 0 or null 普通商品订单 ; 2 ：限时秒杀   ; 3:预售商品下单 */
            var isLocaleRecruitOrders = order.dOrders.isLocaleRecruitOrders;
            if (isLocaleRecruitOrders != null && isLocaleRecruitOrders == "3") {
                var expectedDeliveryTime = order.dOrders.expectedDeliveryTime;
                if (expectedDeliveryTime != null) {
                    html += '<div class="order_remark font-md">';
                    html += '预售订单预计发货时间：<span class="timer" id="timer">' + formatDateTime(expectedDeliveryTime) + '</span>';
                    html += '</div>';
                }
            }
            // ================== 预售商品预计发货时间 ==============  end  ==============================
            html += '</div>';


            html += '<div class="hui-list bg_white margin-t-3 font-md ordermoeny_list">';
            html += '<ul>';
            html += '<li>';
            html += '<p class="pull-left moeny_text">商品金额</p>';

            html += '<p class="pull-right">￥' + goodsPriceAmountForCount.toFixed(2) + '</p>';
            html += '</li>';
            html += '<li>';
            html += '<p class="pull-left moeny_text">运费</p>';
            html += '<p class="pull-right">￥' + (order.dOrders.logisticsPrice.toFixed(2) == null ? 0 : order.dOrders.logisticsPrice.toFixed(2)) + '</p>';
            html += '</li>';
            if (couponDiscountMoney != null && couponDiscountMoney > 0) {
                html += '<li>';
                html += '<p class="pull-left moeny_text">优惠劵</p>';
                html += '<p class="pull-right moeny_all">￥<span>' + profitsMath(couponDiscountMoney).toFixed(2) + '</span></p>';
                html += '</li>';
            }
            if (couponRebate != null && couponRebate > 0) {
                html += '<li>';
                html += '<p class="pull-left moeny_text">优惠劵</p>';
                html += '<p class="pull-right moeny_all"><span>' + profitsMath(couponRebate) + '折优惠</span></p>';
                html += '</li>';
            }
            /* //if (distributorType != 1) {
                html+='<li>';
                html+='<p class="pull-left moeny_text">总优惠</p>';
                html+='<p class="pull-right moeny_all">￥<span>'+profitsMath(totalPreferentialHowManyCount).toFixed(2)+'</span></p>';
                html+='</li>';
            // }*/
            if (useBalance != null && useBalance > 0) {
                html += '<li>';
                html += '<p class="pull-left moeny_text">零钱使用</p>';
                html += '<p class="pull-right moeny_all">￥<span>' + useBalance.toFixed(2) + '</span></p>';
                html += '</li>';
            }
            //配送方式
            html += '<li>';
            html += '<p class="pull-left moeny_text">配送方式</p>';
            html += '<p class="pull-right moeny_all"><span>' + order.dOrders.deliveryWay + '</span></p>';
            html += '</li>';

            html += '<li>';
            html += '<p class="pull-left moeny_text">实付金额</p>';
            html += '<p class="pull-right moeny_all">￥<span>' + useCash.toFixed(2) + '</span></p>';
            html += '</li>';
            html += '</ul>';
            html += '</div>';


            html += '<div class="hui-list margin-t-3 font-md orderNo_list">';
            var payTime = order.dOrders.payTime; //订单支付时间

            console.log(orderStatus + "::" + deliverStatus);
            html += '<p>订单编号：<span class="copyno">' + order.dOrders.orderno + '</span></p>';
            if (order.invoiceType != null) {
                html += '<p>发票类型：<span>' + order.invoiceType + '</span></p>';
                html += '<p>发票抬头：<span>' + order.invoicetitle + '</span></p>';
                html += '<p>发票内容：<span>' + order.invoicecontent + '</span></p>';
                html += '<p><button class="invoice">查看发票</button></p>';
            }
            if (orderStatus == 0 && deliverStatus == 1) {//待付款
                html += '<p>订单状态：<span class="state">' + "待付款" + '</span></p>';
            } else if (orderStatus == 1 && deliverStatus == 1) {//待发货
                html += '<p>订单状态：<span class="state">' + "待发货" + '</span></p>';
            } else if (orderStatus == 4 && deliverStatus == 4) {//待收货
                html += '<p>订单状态：<span class="state">' + "待收货" + '</span></p>';
            } else if (orderStatus == 4 && deliverStatus == 5) {//退换货
                html += '<p>订单状态：<span class="state">' + "退换货" + '</span></p>';
            } else if (orderStatus == 5 && deliverStatus == 3) {//已完成
                html += '<p>订单状态：<span class="state">' + "已完成" + '</span></p>';
            }
            html += '<p>订单创建时间：<span>' + formatDateTime(order.dOrders.purchaseDate) + '</span></p>';
            if (payTime != null && payTime != "") {
                html += '<p>订单支付时间：<span>' + formatDateTime(payTime) + '</span></p>';
            }
            if (orderStatus == 4 && deliverStatus == 4) {//发货时间
                var deliverTimes = order.dOrders.deliverTime;//收货时间
                html += '<p>订单发货时间：<span>' + formatDateTime(order.dOrders.deliverTime) + '</span></p>';
            }
            //html+='<p>订单交易时间：<span>'+order.dOrders.deliverTime+'</span></p>';
            html += '<p><button class="orderNo_p_btn">复制</button></p>';
            html += '<p><button class="customer" onclick=customer()>客服</button></p>'
            html += '</div>';

            html += '<div class="hui-list bg_white margin-t-3 font-md orderrecom_list">';
            html += '<div class="recom_header">';
            html += '商品推荐';
            html += '</div>';
            /*推荐列表*/
            html += '</div>';

            /* ------------- 订单底部操作按钮 ---------------- begin ---------------------*/
            html += '<div class="bg_white order_btn order-btn">';
            //状态文案
            if (headWriting != null && orderStatus != 0 && deliverStatus != 4) {
                // html +='<span class="check-receive color_red">'+headWriting+'</span>';
                html += '<button class="btn_order_2">' + headWriting + '</button>';
            }
            //订单状态操作按钮
            if (operationButtonsOne != null) {
                html += operationButtonsOne;
            }
            if (operationButtonsTwo != null) {
                html += operationButtonsTwo;
            }
            if (operationButtonsThree != null) {
                html += operationButtonsThree;
            }
            html += '</div>';


            /* ------------- 订单底部操作按钮 ----------------  end  ---------------------*/
            $(".main_container").append(html);

            //推荐商品
            data.functions.recommend();
        },
        "recommend": function () {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: '/localQuickPurchase/selectionGoods/v2/selectionGoodsCom',
                data: JSON.stringify({"pageSize": 10, "pageIndex": 1, 'columnName': '为您推荐'}),
                contentType: "application/json;charset=utf-8",
                async: true,
                success: function (result) {
                    if (result.code != 200) {
                        hui.alert(result.message);
                        return;
                    }
                    var list = result.data;
                    var _html = ""
                    for (var i = 0; i < list.length; i++) {
                        var goods = list[i];
                        if (i % 2 == 0) {
                            _html += '<div class="recom_all">';
                        }
                        _html += '<div class="recom_goods" goodId="' + goods.goodsId + '">';
                        _html += '<div class="good-pic">';
                        _html += '<img src="' + goods.thumbnail + '" />';
                        _html += getYhqHtm(goods);
                        _html += '</div>';
                        var presellType = goods.presellType;
                        if (presellType != null && presellType == 1) {
                            var endTime = goods.endTime;
                            var date = Date.parse(new Date());
                            if (endTime > date) {
                                _html += '<p class="font-sm overflow good_name"><span style="color: red">(预售商品)</span>' + goods.goodsName + '</p>';
                            } else {
                                _html += '<p class="font-sm overflow good_name">' + goods.goodsName + '</p>';
                            }
                        } else {
                            _html += '<p class="font-sm overflow good_name">' + goods.goodsName + '</p>';
                        }
                        if (goods.listLabel != null) {
                            _html += '<div class="label">'
                            var listLabel = goods.listLabel;
                            for (var j = 0; j < listLabel.length; j++) {
                                var label = listLabel[j];
                                _html += ' <span style="color:' + label.colour + ';border: 1px solid ' + label.colour + ';border-radius: 0.59rem;padding: 0 4px;">' + label.labelValue + '</span>'
                            }
                            _html += '</div>'
                        }
                        var goodsProStandards = goods.goodsProStandard;
                        for (var k = 0; k < goodsProStandards.length; k++) {
                            //_html+='<p class="font-lg good_money">￥'+goods.goodsProStandard.platformPrice+'<span>￥'+goods.goodsProStandard.buyingPrice+'</span></p>';
                            _html += '<p class="font-lg good_money">￥' + goodsProStandards[k].distributionPrice + '<span>￥' + goodsProStandards[k].goodsPrice + '</span></p>';
                            break;
                        }
                        if (i % 2 == 1) {
                            _html += '</div>';
                        }
                        _html += '</div>';
                    }
                    $(".orderrecom_list").append(_html);
                }
            })
        }
    }
};

$(function () {

//初始化订单详情
    data.functions.init();
});



//点击跳转商品详情
$(document).on("click", ".recom_goods", function () {
    var goodsId = $(this).attr("goodId");
    if (seq == null || seq == 0) {
        seq = 0;
    }
    location.href = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/0" + "/" + seq + "?goodsId=" + goodsId + "&seq=" + seq;
});

//单件去支付
function payment(orderno) {
    hui.confirm('确定去付款吗？', ['返回', '确认'], function () {
        var data = {};
        data.orderno = orderno;
        data.payStatus = 1;
        data.serialNumber = orderno;
        hui.confirm('确定去付款吗？', ['返回', '确认'], function () {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                url: '/localQuickPurchase/pay/updatePayStatusByOrderno',
                data: JSON.stringify(data),
                success: function (data) {
                    if (data.status == 200) {
                        hui.alert(data.message);
                        setTimeout(function(){
                            window.location.reload();
                        },500);
                    } else {
                        hui.alert(data.message);
                    }
                },
                error : function(error){
                    hui.alert(error.message);
                }
            })
        });
    });
}
//取消订单
function cancelOrder(orderId) {
    hui.confirm('真的要取消这笔订单吗？', ['返回','确定取消'], function(){
        //取消订单操作
        //参数：seq=3751621&orderId=5a4c9a6d424d6a6119d18963&status=3
        seq = seq;
        var status = 2;
        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : '/localQuickPurchase/dOrders/confirm',
            data :{"seq":seq,"orderId":orderId,"status":status},
            success : function(data){
                if (data.code==200) {
                    hui.alert(data.message);
                    //初始化订单详情
                    setTimeout(function(){
                        window.location.reload();
                    },500);
                }else{
                    hui.alert(data.message);
                }
            },
            error : function(data){
                hui.alert(data.message);
            }
        });
    });
}
//确定收货
function receiptOrder(orderId) {
    console.log(orderId);
    hui.confirm('是否确认收货？', ['返回','确认收货'], function(){
        //确定收货操作
        seq = seq;
        var status = 1;
        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : '/localQuickPurchase/dOrders/confirm',
            data :{"seq":seq,"orderId":orderId,"status":status},
            success : function(data){
                if (data.code==200) {
                    hui.alert("确认收货成功！");
                    //初始化订单详情
                    setTimeout(function(){
                        window.location.reload();
                    },500);
                }else{
                    hui.alert("确认收货失败！");
                }
            },
            error : function(data){
                hui.alert(data.message);
            }
        });
    });
}
//删除订单
function deleteOrder(orderId) {
    console.log(orderId);
    hui.confirm('真的要删除这笔订单吗？', ['返回','确认删除'], function(){
        //删除订单操作
        seq = seq;
        var status = 3;
        $.ajax({
            type : 'GET',
            dataType : 'json',
            url : '/localQuickPurchase/dOrders/confirm',
            data :{"seq":seq,"orderId":orderId,"status":status},
            success : function(data){
                if (data.code==200) {
                    hui.alert("删除成功！！");
                    //初始化订单详情
                    setTimeout(function(){
                        //window.location.reload();
                        location.href="/localQuickPurchase/distributionVA/order/index";
                    },500);
                }else{
                    hui.alert("删除失败！！");
                }
            },
            error : function(data){
                hui.alert(data.message);
            }
        });
    });
}
//求商品的优惠价
function getProfitPrice(dGoodsId,sku){

    $.ajax({
        url:'/localQuickPurchase/dOrders/goodsProfit',
        type: 'get',
        dataType: 'json',
        async : false,
        data: {
            "seq" : seq,
            "shareSeq" : shareSeq,
            "goodsId" : dGoodsId,
            "sku" : sku
        },
        success : function(data){
            console.info(data);
            if (data.code == 200) {
                profitPrice = data.data.profits;//优惠价格
            } else {
                hui.alert(data.message);
            }

        }
    })
}
/*申请售后的操作*/
function afterSales(orderno){
    window.location.href = "/localQuickPurchase/distributionVA/order/applyAfterSale?orderno="+orderno;
}
//升级订单不能申请退款、退货退款(待发货)
function emsRefund(orderno,saleType,totalAmmount,supplierSeq,route,isConsumptionOrder){
    if(isConsumptionOrder == "true"){
        hui.alert("升级订单不能退款");
    }else{
        window.location.href="/localQuickPurchase/distributionVA/order/onlyRefund?orderno="+orderno+"&saleType="+saleType+"&totalAmmount="+totalAmmount+"&supplierSeq="+supplierSeq+"&route="+route+"";
    }
}
/*$(document).on('click','.order_p_btn',function(){
	window.location.href = "/localQuickPurchase/distributionVA/order/applyAfterSale";
});*/
/*复制订单号*/
var clipboard = new Clipboard('.orderNo_p_btn', {
    // 点击copy按钮，直接通过text直接返回复印的内容
    text: function() {
        var link = $(".copyno").text();
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
    console.log(e);
    alert('请选择“拷贝”进行复制!');
});
//商品图片点击  进入商品详情
$("body").on('click', '.ordergood-img', function() {
    var goodsId = $(this).attr('goodsId');
    var isActivityGoods = $(this).attr('num');
    // addGoodsHistoryBySeq(seq,goodsId);//暂时注释
    if(seq == null || seq == 0) {
        seq = 0;
    }
    if (isActivityGoods != null && isActivityGoods == "1") {
        window.location.href="/localQuickPurchase/distributionVA/seckill/sgDetail?goodsId="+goodsId+"&distributorSeq="+seq+"&shareSeq="+seq;
    } else {
        window.location.href="/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/"+seq+"/"+seq +"?goodsId="+goodsId+"&seq="+seq;
    }

});
//检查物流详情
function logistics(waybill,carrier){
    window.location.href="/localQuickPurchase/distributionVA/order/checkLogistics?trackingNo="+waybill+"&orderno="+orderno+'&carrier='+(carrier == null?"申通快递":carrier);
}

//去付款
$("body").on('click','.payment',function(){
    var payFlag = true;
    var orderno = $(this).attr('id');
    console.log("orderno: " + orderno);
    $.ajax({
        type : 'POST',
        dataType : 'json',
        async : false,	//是否异步请求，false为同步
        //contentType: "application/json;charset=utf-8",
        url : '/localQuickPurchase/pay/verifyPayStatus',
        data :{
            "orderno" : orderno
        },
        success : function(data){
            if (data.status == 200) {
                //hui.iconToast(data.message, 'success');
                payFlag = data.data.payFlag;
            } else {
                payFlag = false;
                hui.iconToast("系统正在更新支付状态中,请勿重复支付!", 'error');
            }
        },
        error : function(error){
            hui.iconToast(error.message, 'error');
        }
    });
    if (payFlag) {
        isMiniprogram().then(function (mini) {
            $.ajax({
                url: '/localQuickPurchase/small/pay/toPay',
                type: 'post',
                async: false,
                contentType: "application/json;charset=utf-8",
                dataType: 'json',
                data: JSON.stringify({
                    "orderNo": orderno,
                    "userSeq": seq
                })
            }).done(function (miniPay) {
                // 判断该用户是否绑定微信是否有openid
                if (miniPay.code == 403001) {
                    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录', '马上登录'], function () {
                        setCookie("loginRetrunUrl", location.href);
                        var url = loginPageUrl();
                        window.location.href = url;
                    });
                } else {
                    var payData = miniPay.data;
                    // 在微信小程序中唤起支付
                    wx.miniProgram.navigateTo({url: "/pages/pay/pay?data=" + encodeURIComponent(JSON.stringify(payData))});
                }
            })
        }).catch(function (err) {
            payUrl(orderno, seq);
        });

    }
});

//升级订单不能申请退款、退货退款(待发货)
function emsRefund(orderno,saleType,totalAmmount,supplierSeq,route,isConsumptionOrder){
    if(isConsumptionOrder == "true"){
        hui.alert("升级订单不能退款");
    }else{
        var sku = "";
        if(sku != null && sku != ""){
            sku="&sku="+sku;
        }
        window.location.href="/localQuickPurchase/distributionVA/order/onlyRefund?orderno="+orderno+"&saleType="+saleType+"&totalAmmount="+totalAmmount+"&supplierSeq="+supplierSeq+"&route="+route+sku;
    }
}
//升级订单不能申请退款、退货退款(待发货)
function applyAfterSale(orderno,isConsumptionOrder,sku){
    if(isConsumptionOrder == "true"){
        hui.alert("升级订单不能退款");
    }else{
        var skuParam = "&partialRefund=true";
        if(sku != null && sku != ""){
            skuParam += "&sku="+sku;
        }
        window.location.href="/localQuickPurchase/distributionVA/order/applyAfterSale?orderno="+orderno+"&isConsumptionOrder="+isConsumptionOrder+skuParam;
    }
}
/*跳转发票详情*/
$('body').on('click','.invoice',function () {
    window.location.href = "/localQuickPurchase/invoice/invoiceDetails.html?orderno="+orderno;
});
//客服
/*$(function () {
	$.getScript("//kefu.easemob.com/webim/easemob.js?tenantId=35647&hide=true&sat=false");
})
function customer(){
	Airlines();
};*/


function sltShow() {
    $(".mask2").fadeIn("slow");
    $(".blow_up").show();
};
//
function showImg(src){
    sltShow();
    $(".blow_up").append("<img src='"+src+"' />");
}

function cancelMask2(){
    $(".mask2").css('display','none');
    $(".blow_up").hide();
}

//设置的定时器
function show_time(endTime,timeServerClient){
    var timer = document.getElementById("timer");
    if(!timer){
        return ;
    }
    timer.innerHTML = timeServerClient;

    var time_now,timeDistance,strTime;  //1.当前时间		2.时间距离		3.拼接输出时间
    var day,hour,minute,second;  //1.天数		2.小时		3.分钟	4.秒
    //每秒钟都获取一次当前时间
    var time_now = new Date();
    //time_now = time_now.getTime();
    // 剩余时间 = 结束(开始)时间 - 当前时间
    timeDistance = endTime-time_now;

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
        strTime="距离开始发货："+day+"天  "+hour+":"+minute+":"+second;
        //定时器输出时间
        timer.innerHTML=strTime;
        //每秒循环执行
        setTimeout("show_time("+endTime+","+timeServerClient+")",1000);
    } else {//倒计时结束执行的操作
        timer.innerHTML ="该订单已发货！！！";
        //clearTimeout(timerID);
        clearTimeout("该订单已发货！！！");
    }
}

//跳转订单评论
function orderEva(goodsCode,orderno,seq,sku){
    window.location.href="/localQuickPurchase/distributionVA/orderEva/postcomment?orderno="+orderno+"&goodsCode="+goodsCode+"&seq="+seq+"&sku="+sku;
}

function isComplain(orderno,userSeq,userName){
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/localQuickPurchase/complainAction/findAllComplain',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            "orderno": orderno
        }),
        success: function (data) {
            if (data.code == 200) {
                console.log(data.data);
                if (data.data == "") {
                    //投诉表中查不到该订单数据，没有投诉过
                    window.location.href = "/localQuickPurchase/distributionVA/order/complain?orderno=" + orderno + "&userSeq=" + userSeq + "&userName=" + userName + "";
                } else {
                    //投诉表中查到该订单数据，已经投诉过
                    hui.confirm("该订单只能投诉一次，请不要重复投诉！");
                }
            }
        },
        error: function (error) {
            hui.iconToast(error.message, 'error');
        }
    });
}