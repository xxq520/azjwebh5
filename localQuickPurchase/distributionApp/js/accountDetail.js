// 查询订单参数(分销业绩)
var pageIndex; // 当前页码
//登录的用户类型（1 普通用户，2 网络店主，3 线下服务中心，4 成为网络店主的线下服务中心）
var pageSize = 10; // 一页显示多少条
var userType = getRoleType(); //  角色类型: 1 顾客,2 网络店主, 3 线下服务中心
var bTime; // true 时间查询, false 普通查询
var seq = seq;	// 用户Seq
var totalPage; // 总页数
var globalpagenum = 1;
var stimeA; // 账户明细开始时间
var etimeA;	// 账户明细结束时间

/*获取账户明细列表*/
function getDetailedlist(globalpagenum, obj) {
    var code;
    code = initOrders2(true, globalpagenum, stimeA, etimeA); // index 页码
    if (globalpagenum < totalPage) {
        obj.endPullupToRefresh(false);
    } else {
        // code = initOrders2(false, globalpagenum); // bTime false 不带时间查询, true 带时间查询. index 页码
        setTimeout(function () {
            obj.endPullupToRefresh(true);
        }, 1000);
    }
    return code;
}

/*账户明细列表加载更多数据*/
function moreDetailedData() {
    var obj = this;
    var code = getDetailedlist(globalpagenum, obj);
    if (code == 200) {
        ++globalpagenum;
    }
}

function detection() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/localQuickPurchase/dApplicationAction/isPay',
        data: {
            seq: seq
        },
        async: false,
        success: function (data) {
            if (data.data) {
                return true;
            } else {
                return false;
            }
        }
    });
}

/*账户明细下拉加载*/
mui.init({
    pullRefresh: {
        container: "#muiscroll",
        down: {
            callback: function () {
                window.location.reload(true);
            }
        },
        up: {
            height: 50,
            auto: true,
            contentrefresh: "正在加载...",
            contentnomore: '没有更多数据了',
            callback: moreDetailedData
        }
    }
});

//初始化查询确认订单(网络店主查询业绩)
function initOrders2(bTime, pageIndex, begindate, enddate, bempty) {
    var code;
    $.ajax({
        type: "post",//定义提交的类型
        url: _content + "/dOrders/findOrders",
        dataType: "json",//设置返回值得类型
        data: {
            "seq": seq,
            "status": 1,
            "bTime": bTime,
            "userType": userType,
            "pageIndex": pageIndex,
            "pageSize": pageSize,
            "begindate": begindate,
            "enddate": enddate

        },
        async: false,//是否异步请求，false为同步
        success: function (data) {//成功返回值执行函数
            code = data.code;
            if (data.code == 200) {
                var orders = data.data.distrOrders.list;
                totalPage = data.data.distrOrders.totalPage; // 总页数
                $("#balance").html(profitsPoint(data.data.balance)); //可提现 金额
                //$("#totalEarnings").html(profitsPoint(data.data.totalEarnings));//总收益
                $("#histortTotalEarnings").html(profitsPoint(data.data.histortTotalEarnings)); //利润总金额
                var totalAmount = data.data.totalAmount;//总销售额
                $("#totalAmount").html(totalAmount == 0.0 ? 0.0 : profitsPoint(totalAmount)); //总销售额
                if (bempty) {
                    $("#accountlist").empty();
                }
                /*if (orders.length == 0 || orders == null) {
                 $("#accountlist").html("<span style='color:red;'>没有查询到数据!</span>");
                 }*/
                for (var i = 0; i < orders.length; i++) {
                    var orderno = orders[i].orderno; // 订单号
                    var date = orders[i].purchaseDate; // 下单时间
                    var purchaseDate = formatDateTime(date);
                    //var shopImgUrl = orders[i].shopImgUrl; // 店家图片
                    //var shopName = orders[i].shopName; // 店家名字
                    var totalAmount = orders[i].totalAmmount.toFixed(2); // 支付金额
                    var profitAmount = 0;
                    if (isRoleAgent()) {// 店主利润金额
                        var profitAmountN = orders[i].profitAmount;
                        profitAmount = profitAmountN == null ? 0 : profitAmountN.toFixed(2); // 店主利润金额
                    } else if (isRoleDealer()) {// 代理商利润金额
                        var profitAmountN = 0.0;//利润

                        var distributorSeq = orders[i].distributorSeq;//网络店主Seq
                        var seqSeller = orders[i].seqSeller;//卖家Seq即代理商Seq

                        if (distributorSeq != seqSeller) {
                            //在还是网络店主时卖出去的订单
                            if (distributorSeq == seq) {
                                profitAmountN = orders[i].profitAmount;
                            } else if (seqSeller == seq) {//代理商卖出去的
                                profitAmountN = orders[i].totalAgentProfit;
                            }
                        } else {
                            profitAmountN = orders[i].totalAgentProfit;
                        }
                        profitAmount = profitAmountN == null ? 0 : profitAmountN.toFixed(2); // 代理商利润金额
                    }

                    var serverStatus = orders[i].serverStatus; // 线下服务中心确认状态: 0 待确认, 1 确认
                    var quantity = orders[i].listOrderDetails[0].count; // 商品数量
                    var shopImgUrl = orders[i].listOrderDetails[0].goodsImgUrl; // 商品数量
                    var shopName = orders[i].listOrderDetails[0].goodsName; // 商品数量
                    if (profitAmount < 0) {
                        var list = '<li class="mui-table-view-cell list-item">' +
                            '<div class="item-head">' +
                            '<div class="order-time">' + purchaseDate + '</div>' +
                            '<div class="order-num">订单号:' + orderno + '</div>' +
                            '</div>' +
                            '<div class="item-content mui-tab-item" target="shopDetail.html">' +
                            '<div class="content-media">' +
                            '<img src="' + shopImgUrl + '" />' +
                            '</div>' +
                            '<div class="content-info">' +
                            '<div class="shop-name">' + shopName + '</div>' +
                            '<div>' +
                            '<div class="order-money">订单总金额:' + totalAmount + '元</div>' +
                            '<div class="order-amount">商品数量:' + quantity + '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="content-handle">' +
                            '<div class="profit">利润: <span class="profit-num txt-red">' + profitAmount + '</span></div>' +
                            //'<a href="orderDetail.html" class="btn-sure-order alink">确认订单</a>'+
                            '</div>' +
                            //serverS +
                            '</div>' +
                            '</li>';
                    } else {
                        var list = '<li class="mui-table-view-cell list-item">' +
                            '<div class="item-head">' +
                            '<div class="order-time">' + purchaseDate + '</div>' +
                            '<div class="order-num">订单号:' + orderno + '</div>' +
                            '</div>' +
                            '<div class="item-content mui-tab-item" target="shopDetail.html">' +
                            '<div class="content-media">' +
                            '<img src="' + shopImgUrl + '" />' +
                            '</div>' +
                            '<div class="content-info">' +
                            '<div class="shop-name">' + shopName + '</div>' +
                            '<div>' +
                            '<div class="order-money">订单总金额:' + totalAmount + '元</div>' +
                            '<div class="order-amount">商品数量:' + quantity + '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="content-handle">' +
                            '<div class="profit">利润: <span class="profit-num txt-red">' + profitAmount + '</span></div>' +
                            //'<a href="orderDetail.html" class="btn-sure-order alink">确认订单</a>'+
                            '</div>' +
                            //serverS +
                            '</div>' +
                            '</li>';
                    }
                    $("#accountlist").append(list);
                }
            } else {
                //alert(data.message);
            }
        }
    });

    return code;
}
/*日期控件示例*/

/*判断开始结束日期*/
function judgeDate(stime, etime) {
    var d1 = new Date(stime.replace(/\-/g, "\/"));
    var d2 = new Date(etime.replace(/\-/g, "\/"));
    if (stime != "" && etime != "" && d1 > d2) {
        return false;
    }
}

/*日期控件*/
(function ($) {
    /*账户明细日期选择*/
    $("#detailForm .datebtn").each(function (i, btn) {
        btn.addEventListener('tap', function () {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var id = this.getAttribute('id');
            /*
             * 首次显示时实例化组件
             * 示例为了简洁，将 options 放在了按钮的 dom 上
             * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
             */
            var picker = new $.DtPicker(options);
            picker.show(function (rs) {
                /*
                 * rs.value 拼合后的 value
                 * rs.text 拼合后的 text
                 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                 * rs.m 月，用法同年
                 * rs.d 日，用法同年
                 * rs.h 时，用法同年
                 * rs.i 分（minutes 的第二个字母），用法同年
                 */
                /*
                 * 返回 false 可以阻止选择框的关闭
                 * return false;
                 */
                /*
                 * 释放组件资源，释放后将将不能再操作组件
                 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
                 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
                 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
                 */
                $('#' + id)[0].value = rs.text;
                stimeA = $('#stardate')[0].value;
                etimeA = $('#enddate')[0].value;
                console.log(stimeA + " | " + etimeA);
                var datestate = judgeDate(stimeA, etimeA);
                //console.log(datestate);
                if (datestate == false) {
                    mui.toast('开始时间不能大于结束时间!', {duration: 'long', type: 'div'});
                    $('#' + id)[0].value = "";
                    return false;
                } else {
                    picker.dispose();
                    if (etimeA == "" || stimeA == "") {
                        return;
                    }
                    // console.log(globalpagenum);
                    globalpagenum = 1; // 重置页码
                    var code = initOrders2(true, globalpagenum, stimeA, etimeA, true);
                    if (code == 200) {
                        globalpagenum++;
                    }
                    // alert("开始请求!");
                }
            });
        }, false);
    });
    /*个人业绩日期选择*/
    $("#resultsForm .datebtn").each(function (i, btn) {
        btn.addEventListener('tap', function () {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var id = this.getAttribute('id');
            /*
             * 首次显示时实例化组件
             * 示例为了简洁，将 options 放在了按钮的 dom 上
             * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
             */
            var picker = new $.DtPicker(options);
            picker.show(function (rs) {
                /*
                 * rs.value 拼合后的 value
                 * rs.text 拼合后的 text
                 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
                 * rs.m 月，用法同年
                 * rs.d 日，用法同年
                 * rs.h 时，用法同年
                 * rs.i 分（minutes 的第二个字母），用法同年
                 */
                /*
                 * 返回 false 可以阻止选择框的关闭
                 * return false;
                 */
                /*
                 * 释放组件资源，释放后将将不能再操作组件
                 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
                 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
                 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
                 */
                $('#' + id)[0].value = rs.text;
                var stime = $('#stardate')[0].value;
                var etime = $('#enddate')[0].value;
                console.log(stime + " | " + etime);
                var datestate = judgeDate(stime, etime);
                console.log(datestate);
                if (datestate == false) {
                    mui.toast('开始时间不能大于结束时间', {duration: 'long', type: 'div'});
                    $('#' + id)[0].value = "";
                    return false;
                } else {
                    picker.dispose();
                }
            });
        }, false);
    });
})(mui);