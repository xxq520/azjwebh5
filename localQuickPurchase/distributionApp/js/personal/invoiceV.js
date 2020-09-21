var invoice = {};
var invoiceCookie = getCookie("invoice");
if (invoiceCookie != null && invoiceCookie != "") {
    $('.invoiceOper').html("开发票"+'<i class="rightIco2">&gt;</i>'+"")
    invoice = JSON.parse(invoiceCookie);
}

/*发票*/
/*
$('body').on('click','.invoiceLi',function () {
    window.location.href = "/localQuickPurchase/invoice/invoice.html"
})*/
function invoiceCli() {
    window.location.href = "/localQuickPurchase/invoice/invoice.html"
}