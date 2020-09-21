 function initBank(){
    	/*银行卡选择picker*/
    	if($("#bankName").length>0){
    		var pickerbank = new huiPicker("#bankName", function(){
    			var bankname = pickerbank.getText(0);
    			var bankvalue = pickerbank.getVal(0);
    			$("#bankName").val(bankname).attr("data-values",bankvalue);
    		});
    		pickerbank.level = 1;
    		var names = new Array();
    		names = [
    			{
    				value: "1",
    				text:"中国建设银行"
    			},
    			{
    				value: "2",
    				text:"广发银行"
    			},
    			{
    				value: "3",
    				text:"中国银行"
    			},
    			{
    				value: "4",
    				text:"中国农业银行"
    			},
    			{
    				value: "5",
    				text:"中国工商银行"
    			},
    			{
    				value: "6",
    				text:"邮政储蓄银行"
    			},
    			{
    				value: "7",
    				text:"招商银行"
    			}
    			]
    		pickerbank.bindData(0, names);
    	}
    }
 

//检查银行卡信息是否为空
function checkBankMsg(){
	var param = getInputVal();
	if(param.issuingBank == ""){
		hui.alert("发卡行不能为空！");
		return false;
	}
	if(param.subbranch == ""){
		hui.alert("支行不能为空！！");
		return false;
	}
	if(param.userCartName == ""){
		hui.alert("持卡人姓名不能为空！！");
		return false;
	}
	if(param.cartNo == ""){
		hui.alert("银行卡号不能为空！！");
		return false;
	}
	if(!checkUserCartName(param.userCartName)){
		return false;
	}
	if(!ckechCartNo(param.cartNo)){
		return false;
	}
	
	return true;
}
//获取银行信息
function getInputVal(){
	var param = {};
	var issuingBank = $("input[name='issuingBank']").val();//发卡行
	var subbranch = $("input[name='subbranch']").val();//支行
	var userCartName = $("input[name='userCartName']").val();//持卡人姓名
	var cartNo = $("input[name='cartNo']").val();//银行卡号
	var bankId = $("input[name='issuingBank']").attr("data-values");//发卡行 对应的val
	param.issuingBank = issuingBank;
	param.subbranch = subbranch;
	param.userCartName = userCartName;
	param.cartNo = cartNo;
	param.bankId = bankId;
	return param
}
//快速付款点击事件
$(document).on('click','.bankButton',function(){
	var state = $(this).attr("tp");//根据这个属性判断隐藏还是显示
	if(state == 0){
		$(".userBankMsg").removeClass("userMsg");
		//$(this).attr("state",1);
	}else{
		$(".userBankMsg").addClass("userMsg");
		//$(this).attr("state",0);
	}
	//$(".bankButton").attr("state",0);
	//$(this).attr("state",1);
	$(".bankButton").removeClass("isClick");
	$(this).addClass("isClick");
});
//退款的时候添加银行卡信息
function getParamDatas(route,datas){
	if(route == 3 || route == 2){
		var state = $(".isClick").attr("state");
		if(state == 1){//判断是否点击快速付款
			if(!checkBankMsg()){
				return null;
			}
			var param = getInputVal();
			datas.issuingBank = param.issuingBank;
			datas.subbranch = param.subbranch;
			datas.userCartName = param.userCartName;
			datas.cartNo = param.cartNo;
			datas.bankId = param.bankId;
			datas.speediness = "1";//标识点击了快速退款
		}
	}
	return datas;
}

/*$("input[name='cartNo']").blur(function(){
	var value = $(this).val();
	var length = value.length;
	if(length){}
})*/
/*
	 	var issuingBank = $("input[name='issuingBank']").val();//发卡行
	var subbranch = $("input[name='subbranch']").val();//支行
	var userCartName = $("input[name='userCartName']").val();//持卡人姓名
	var cartNo = $("input[name='cartNo']").val();//银行卡号
	var bankId = $("input[name='issuingBank']").attr("data-values");//发卡行 对应的val
 */

function checkUserCartName(name_val){
	if(name_val.length < 2 ){
		hui.alert("持卡人姓名最少由两个汉字组成！");
		return false;
	}
	return true;
}

function ckechCartNo(val){
	if(val.length < 16){
		hui.alert("卡号不能少于16数字");
		return false;
	}
	return true;
}
