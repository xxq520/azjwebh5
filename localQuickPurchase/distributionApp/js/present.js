var userName = getCookie("userName");
  var addressVal = null;
  var data1={};
  function address(){
	  data1.userName=userName;
	  $.ajax({
			type : "POST",
			url : "/localQuickPurchase/shippingAddress/findDefaultAddressByUserName",
			contentType: "application/json; charset=utf-8",
			data:JSON.stringify(data1),
			dataType : "json", //设置返回值得类型
			//async : false, //是否异步请求，false为同步
			success : function(data) {
				/* if(data.code == 404){
					window.location.href ="/localQuickPurchase/generalStore/html/address.jsp";
				} */
				addressVal=data.data.shipping;
			}
		});
	}
	//勾选
	function changeStatus(ev){
		$(ev).toggleClass('checkboxchecked');
		
	}
  address();
  $(function(){
	//  totalalert();
		//购买服务按钮
		$("body").on("click",".purchase",function(){
			 var size= $(".checkboxchecked").length;
			  if(size == 1){
				  hui.toast("接受协议?");
				  return ;
			  }

			//查找是否有收货地址
			if(addressVal == null){
				window.location.href ="/localQuickPurchase/generalStore/html/address.jsp";
				return;
			}
			 var json = checkDistributorType();
			  if(json.code != 200){
				  hui.toast(json.message);
				  setTimeout(function(){
		   		   var url=json.url;
		   		   window.top.location.href =url;
		   	    },2000);
				  return;
			  }
			  
			window.location.href="/localQuickPurchase/distributionVA/placeOrderPay";
			
		});
  });