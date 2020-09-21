var orderno = getQueryString("orderno")
$.ajax({
    type : "GET",
    dataType : "json",
    url : "/localQuickPurchase/invoice/findInvoiceByOrderno",
    data : {"orderno":orderno},
    async : false,
    success : function (data) {
        var code = data.code;
        if(code == 200){
            var invoice = data.data;
            var ordertime = invoice.orderTime;//下单时间
            ordertime =  timetrans(ordertime,1);
            var invoicetitle = invoice.invoiceTitle;//发票抬头
            var invoicetype = invoice.invoicetype;//发票类型
            var invoicecontent = invoice.invoicecontent;//发票内容
            var invoiceType = '增值税电子普通发票';
            if(invoicetype == 2){
                invoiceType = '增值税专用发票';
            }
            var other2 = invoice.other2;
            var invoiceState = '已开发票';
            if(other2 == 0){
                invoiceState = '未开发票';
            }
            html = '';
            //html += '<p class="invoiceStatus">发票状态：<span class="status">'+invoiceState+'</span></p>';
            html += '<p class="invoiceP">订单编号：<span class="orderNum">'+orderno+'</span></p>';
            html += '<p class="invoiceP">下单时间：<span class="orderTime">'+ordertime+'</span></p>';
            html += '<p class="invoiceP">发票类型：<span class="invoiceType">'+invoiceType+'</span>';
            //html += '<span class="download" onclick="downloadInvoice()">下载发票</span>';
            //html += '<span class="sendEmail" onclick="sendEmail()">发送邮箱</span>';
            html += '</p>';
            html += '<p class="invoiceP">发票抬头：<span class="title">'+invoicetitle+'</span></p>';
            html += '<p class="invoiceP">发票内容：<span class="content">'+invoicecontent+'</span></p>-->';
            $('.invoice').append(html);
        } else {
          hui.alert("获取发票异常")
        }
    },
    error : function () {
        
    }
});

function backPage() {
    history.go(-1)
}