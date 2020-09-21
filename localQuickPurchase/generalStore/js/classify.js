$(function(){
	getBusinessType();
	handleClick();
})
function getBusinessType(){
	$.ajax({
	url: _content+'/businessTypeMongo/findBusinessType',
	type: 'get',
	dataType:'JSON',
	data: {},
	})
	.done(function(res) {
		//console.log(res);
		if(res.code == 200){
			var data = res.data;
			var _html = '';
			$.each(data,function(index, el) {
				_html += '<li class="item" data-cataid="'+ el.id +'"><a href="javascript:0;">'+ el.businessTypeName +'</a></li>';
				getDealerGroup(el.id);
			});
			$(".classifyList").html(_html);
//			$('.job_sub li').eq(0).click();
		}
	})
	.fail(function() {
		//console.log("error");
	})
	.always(function() {
		//console.log("complete");
	});
}
function getDealerGroup(bId){
	var data = {};
	data.businessTypeId = bId;
	$.ajax({
	url: _content+'/dealerGroupMongo/findDealerGroup',
	type: 'post',
	dataType:'JSON',
	contentType: "application/json; charset=utf-8",
	data:JSON.stringify(data),
	})
	.done(function(res) {
		//console.log(res);
		if(res.code == 200){
			var data = res.data;
			var _html = '<div class="classify_Con classify_Con_'+ bId +' disp" data-cataid="'+ bId +'">';
			_html += '<div class="classifyItem"><div class="subList"><ul>';
			$.each(data,function(index, el) {
				_html += '<li class="subItem" data-id="'+ el.id +'"><a href="javascript:0;" class="subName">'+ el.dealerName +'</a></li>';
			});
			_html += '</ul></div></div></div></div>';
			$(".rightBox").append(_html);
		}
	})
	.fail(function() {
		//console.log("error");
	})
	.always(function() {
		//console.log("complete");
	});
}
function handleClick(){
	$('.job_sub').on("click","li",function(){
        $(this).addClass('off').siblings().removeClass('off');
        cataId = $(this).attr("data-cataId");
        $('.classify_Con_'+$(this).attr("data-cataId")).removeClass('disp').siblings().addClass('disp');
	});
}
$(document).on("click",".subItem",function(){
	var dealGroupId = $(this).attr("data-id");
	window.location.href = 'goodsSearch.jsp?dealGroupId='+dealGroupId;
})
$("input[name=keyword]").click(function(){
	window.location.href = 'search.jsp';
})