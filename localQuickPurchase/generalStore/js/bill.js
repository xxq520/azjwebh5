var shoppingCartId = getQueryString("shoppingCartId");
var seq = getQueryString("seq");
var shippingAddressId = getQueryString("shippingAddressId");
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
	window.history.go(-1);
})