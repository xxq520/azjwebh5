
var orderno = getUrlParams('orderno',location.href);

var deilver = getQueryString("deilver");//1 已发货进来的
// console.log(deilver);
if (deilver == 1) {//已发货进来隐藏
    $('.topBarsearch').find("h1").text("订单详情")
    $('.edit').hide()
    $('.determine').hide()

}

// <!--1为同意退款 2为拒绝退款-->
var refund=1;
var refundDom=$(".change-refund");
for(let i=0;i<refundDom.length;i++){
    $(refundDom).eq(i+1).on("click",function () {
        refund=i+1;
        $(this).children("img").attr("src","./images/active.png");
        $(this).siblings("div").children("img").attr("src","./images/noactive.png")
    })
}


var formData;

/**
 * 获取售后订单详情
 * @param orderno 订单号
 */
function getOrderDetail(orderno) {
    var url = "/localQuickPurchase/business/order/details";
    var obj = {
        supplierSeq: seq,
        orderno: orderno
    }

    $.ajax({
        type : 'POST',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : url,
        data : JSON.stringify(obj),
        async : false,
        success : function(ret) {
            if (ret.code === 200) {
                formData = ret.data;
                var heaedHtml = createHeadHtml(ret.data);
                $(".Pendingrefund").append(heaedHtml);

                var userInfoHtml = buildUserInfoHtml(ret.data);
                $('.order-consignee').append(userInfoHtml);

                var receiveHtml = buildReceiveHtml(ret.data);
                $('.wuliu').append(receiveHtml);
            } else if (ret.code===400) {
                hui.toast(ret.message)
            }
        }
    });
}





function createHeadHtml(data) {
    var html = '';
    html += `<div class="order-good-header">
        <span class="buy">买</span>
        订单号：<span class="order-num">${data.orderno}</span>
    </div>`;
    for (var i=0;i<data.detailsResultList.length;i++) {
        html += `<div class="order-list flex">
            <img src="${data.detailsResultList[i].goodsImgUrl || '无'}" alt="" class="order-img">
            <div class="goods">
                <div class="goods-name">${data.detailsResultList[i].goodsName}</div>
                <div class="goods-guige">规格:${data.detailsResultList[i].spec}</div>
                <div class="goods-num">数量:${data.detailsResultList[i].count}</div>
                <div class="goods-price">原出厂价:￥${data.detailsResultList[i].primitiveFactoryPrice}</div>
            </div>
        </div>`
    }
    html += `<div class="remarks">
            <span>备注:${data.remark}</span>
            <span style="font-size:0.55rem; color:#9A9899;">不接受指定快递,特殊需求请联系卖家</span>
<!--            <input type="text" disabled placeholder="不接受指定快递，特殊需求请联系卖家">-->
        </div>`

    return html
}

function buildUserInfoHtml(data) {
    var html = '';
    html +=
            `<!--<div class="Code">邮政编码：<span>${""}</span></div>-->
        <div class="order-time">下单时间：<span>${data.purchaseDate ? data.purchaseDate : '无'}</span></div>
        <div class="order-people">收  货  人：<span>${data.shippingName || '无'}</span></div>
        <div class="order-phone">联系电话：<span>${data.shippingTelephone || '无'}</span></div>
        <div class="order-address">收货地址：<span>${data.address || '无'}</span></div>`
    return html;
}



function buildReceiveHtml (data) {
    var html = ''

    html += `<div class="order-consignee">
<!--                <div class="opt-bill__btn" onclick="goEditDeliver()">修改信息</div>-->
                <div class="Code">发货时间：<span>${data.acceptTime ? data.acceptTime : '无'}</span></div>
                <div class="order-time">物流公司：<span>${data.carrier || '无'}</span></div>
                <div class="order-people">快递单号：<span>${data.waybill || '无'}</span></div>
            </div>`

    return html
}


getOrderDetail(orderno);

// console.log(JSON.stringify(formData));

//提交审核
function submitAudit () {
    // var url = "http://192.168.1.84:10000/localQuickPurchase/afterSales/update";
    var obj = {
        orderno: orderno,//订单号
        afterNo:formData.afterNo,//	申请售后单号
        isContainsAmount: formData.isContainsAmount,//是否包含运费 0:不包含,1:包含
    }

    if (formData.partialRefundPrice) obj.partialRefundPrice = formData.partialRefundPrice;//部分退款金额
    if (formData.partialRefundGoodsNum) obj.partialRefundGoodsNum = formData.partialRefundGoodsNum;//部分退款数量
    

    if (refund == 1) {
        obj.reviewStatus = 3
    } else if (refund == 2) {
        obj.reviewStatus = -3
    }

    var refusedAfterWhy = $('.refund-title').find('input').val().trim();

    if (refusedAfterWhy) obj.refusedAfterWhy = refusedAfterWhy;

    $.ajax({
        type : 'POST',
        dataType : 'json',
        contentType: "application/json;charset=utf-8",
        url : "/localQuickPurchase/afterSales/update",
        data : JSON.stringify(obj),
        async : false,
        success : function(ret) {
            if (ret.code === 200) {
                $('.refund-title').find('input').val('');
            }

            hui.toast(ret.message)

            window.history.back(-1);
        }
    });
}




//点击确认审核
$(".determine").on("click",function () {
    submitAudit();
})


//回退按钮
$(".go-back").on("click",function () {
    history.go(-1)
});


/**
 * 获取url 参数
 * @param name
 * @param origin
 * @returns {*}
 */
function getUrlParams(name, origin = null) {
    let url = location.href;
    let temp1 = url.split('?');
    let pram = temp1[1];
    let keyValue = pram.split('&');
    let obj = {};
    for (let i = 0; i < keyValue.length; i++) {
        let item = keyValue[i].split('=');
        let key = item[0];
        let value = item[1];
        obj[key] = value;
    }
    return obj[name];
}

/**
 * 格式化时间日期
 * @param inputTime 时间戳
 * @returns {string}
 * @private
 */
function formatDateTime_(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+" "+h+":"+minute;
};

