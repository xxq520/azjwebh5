var id = getQueryString("id");
seq;
if (id == null) {
	id = getCookie("smallId");
} else {
	setCookie("smallId",id,30);
}
$.ajax({
	type : 'GET',
	dataType : 'json',
	data : {"id":id,"userSeq":seq},
	url : '/localQuickPurchase/customer/information',
	success : function(data){
		if (data.code == 200) {
			
			var information = data.data.information;
			if (information != null && information != "[]") {
				var obj = JSON.parse(information); 
				console.log(obj);
				var html = '';
				for (var i = 0; i < obj.length; i++) {
					var id = obj[i].Id;// 自增Id
					var Issue = obj[i].Issue;// 问题
					var Sort = obj[i].Sort;// 排序
					var SubclassificationId = obj[i].SubclassificationId;// 小分类Id
					
					html += '<div class="question-row bd-bot">';
					//html += '<a href="./answer?subclassificationId='+SubclassificationId+'&id='+id+'&Issue='+Issue+'">'+Sort+'.'+Issue+'？</a>';			
					html += '<a href="./answer?subclassificationId='+SubclassificationId+'&id='+id+'">'+Sort+'.'+Issue+'？</a>';			
					html += '</div>';
				}
				$('.question-menu').html(html);
			} else {
				var html ='<div class="menu-list">没有更多数据了...';
				html+= '</div>';
				$('.content').html(html);
			}
			
		} else {
			var html ='<div class="menu-list">没有更多数据了...';
			html+= '</div>';
			$('.content').html(html);
		}
	},
	error : function(data){
		
	}
})
//客服
/*$(function () {
	$.getScript("//kefu.easemob.com/webim/easemob.js?tenantId=35647&hide=true&sat=false");
})
function customer(){
	Airlines();
};*/
