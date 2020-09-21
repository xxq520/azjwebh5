var num = 20;

if(isRoleAgent() || isRoleDealer()) {
	satisfy();
} else if(isRoleConsumer() || isRoleVip()) {
	consumption();
}

function satisfy() {
	var html = "";
	$.ajax({
		type:'post',
		dataType:'json',
		url:'/localQuickPurchase/dApplicationAction/concludeCondition',
		data:{"distributeSeq":seq, "type":distributorType},
		async : false,
		success:function(data){
			var data = data.data;
			var recruitCounts = data.recruitCounts;
			var _num = num-recruitCounts;
			html += '<span class="uppro-text">';
			if(recruitCounts >= num) {
				html += '<p>已招募：'+recruitCounts+'个<span class="sidebar">(已满足条件)</span></p>';
				html += '<p>还差：<span class="color_red">0个</span></p></span>';
				html += '<span class="uppro-btn">申请升级</span>';
			} else {
				html += '<p>已招募：'+recruitCounts+'个</p>';
				html += '<p>还差：<span class="color_red">'+(num-recruitCounts)+'个</span></p></span>';
				html += '<span class="uppro-btn"><a href="/localQuickPurchase/distributionVA/store"></a>去招募</span>';
			}
			$("#recruits").show();
			$("#recruit").html(html);
			
			var isConsumption = data.isConsumption;
			var _html = "";
			if(!isConsumption) {
				_html += '<span class="uppro-text">一次性消费满7960升级为代理商</span>';
//				_html += '<span class="uppro-btn"><a href="/localQuickPurchase/distributionVA/shopCar/shopCar2">去升级</a></span>';
				_html += '<span class="uppro-btn">去升级</span>';
			} else {
				_html += '<span class="uppro-text">一次性消费满7960升级为代理商</span>';
				_html += '<span class="uppro-btn">申请升级</span>';
			}
			$("#consumption").html(_html);
		}
	});
}

function consumption() {
	$.ajax({
		type:'post',
		dataType:'json',
		url:'/localQuickPurchase/dOrders/findConsumptionOrder',
		data:{
			"seq":seq,
			"userType":distributorType
			},
		async : false,
		success:function(data){
			var data = data.data;
			var _html = "";
			if(!data) {
				_html += '<span class="uppro-text">一次性消费满7960升级为代理商</span>';
				_html += '<span class="uppro-btn"><a href="/localQuickPurchase/distributionVA/shopCar/shopCar2">去升级</a></span>';
			} else {
				_html += '<span class="uppro-text">一次性消费满7960升级为代理商</span>';
				_html += '<span class="uppro-btn">申请升级</span>';
			}
			$("#consumption").html(_html);
		}
		
	});
}