var seq = getQueryString("seq");
var shippingAddressId = getQueryString("shippingAddressId");

var dGoodsId = getQueryString("goodsId");
var shopSeq = getQueryString("shopSeq");
shopSeq = shopSeq == null || shopSeq == "" ? 0 : shopSeq;
var goodsNum = getQueryString("quantity");
var distributorSeq = getQueryString("distributorSeq");
var billHead = getQueryString("invoiceHead");
var billCont = getQueryString("invoiceContent");
var shareSeq = getQueryString("shareSeq");
shareSeq = shareSeq == null || shareSeq == "" ? 0 : shareSeq;
if(billHead!=""&&billHead!="null"&&billHead!=null){
	$(".sexRadio.nb").addClass("checked");
	if(billHead=="明细"){
		$(".sexRadio.mingxi").addClass("checked");
	}else if(billHead=="办公用品"){
		$(".sexRadio.bangong").addClass("checked");
	}else if(billHead=="耗材"){
		$(".sexRadio.haocai").addClass("checked");
	}
	
	if(billCont!=""){
		$("#billcont").val(billCont);
	}
}

$(".nebill .sexRadio").click(function(event) {
	if(!$(this).hasClass('checked')) {
		$(this).addClass('checked').closest(".nebill").siblings(".nebill").find(".sexRadio").removeClass('checked');
		$(".billType .sexRadio").removeClass('checked');
	}
});
$(".billType .sexRadio").click(function(event) {
	if(!$(this).hasClass('checked')) {
		$(this).addClass('checked').siblings(".sexRadio").removeClass('checked');
		$(".nebill .sexRadio").removeClass('checked');
		$(".sexRadio.nb").addClass('checked');
	}
});
$("#sureBill").on("click",function(){
	var billHead = '';
	var billCont = '';
	var nebill = $(".nebill .sexRadio.checked");
	if(nebill.length == 0){
		$(".resultTip").text("请先完善发票内容").show(300).delay(2000).hide(300);
		return;
	}else{
		if(nebill.text()=="不需要发票"){
			billHead = '';
			billCont = '';
		}else{
			var billType = $(".billType .sexRadio.checked").text();
			var billcont = $("input[name=billcont]").val();
			if(!billType){
				$(".resultTip").text("请先完善发票内容").show(300).delay(2000).hide(300);
				return
			}
			billHead = billType;
			billCont = billcont;
		}
	}
	var data = {};
	data.billHead = billHead;
	data.billCont = billCont;
	var tempBill = JSON.stringify(data);
	setCookie("tempBill",tempBill,365);
	
	window.location.href = 'placeOrder.jsp?invoiceHead='+billHead + '&invoiceContent='+billcont + '&shareSeq=' + shareSeq
							+'&goodsId=' + dGoodsId + '&shopSeq=' + shopSeq + '&quantity=' + goodsNum + '&seq=' + seq;
})