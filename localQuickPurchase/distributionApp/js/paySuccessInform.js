

function findAndUpdateDis(){
	$.ajax({
		type : 'post',
		url : '/localQuickPurchase/dApplicationAction/findDisBySeq',
		data : {
			seq : seq
		},
		async : false,
		success : function(result) {
			if(result.code == 200){
				var paySuccessInform = result.data.paySuccessInform;
				if(paySuccessInform != null && paySuccessInform != 'null' && paySuccessInform == 1){
					hui.alert("礼包购买成功,请重新登陆确认身份！");
					$.ajax({
						type : 'post',
						url : '/localQuickPurchase/dApplicationAction/upDis',
						data : {
							seq : seq
						},
						async : false,
						success : function(jsonResult) {
								console.info(jsonResult);
						}
					});
				}
			}
			
		}
	})
};

findAndUpdateDis();