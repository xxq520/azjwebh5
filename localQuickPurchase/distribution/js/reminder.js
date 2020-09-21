
/*提示用户被拒绝的js*/
$(function(){
	$.post("/localQuickPurchase/dApplicationAction/findRefuseapplyDis",{distributorSeq:userSeq},function(result){
		var json = result.data;
		if(result.code==200){
			if(json==null||json.length==0)
				return;
			for(var i = 0;i<json.length;i++){
				if(!json[i].isReminder){
					alert("您的申请已被服务商拒绝");
					$.post("/localQuickPurchase/dApplicationAction/updateRefuseapplyDis",{"distributorSeq":json[i].distributorSeq,"masterSeq":json[i].masterSeq,"isReminder":true},function(r){
						if(r.code==200){
						}else alert("error");
					});
				}
			}
			
		}else{
			
		}
	});
});