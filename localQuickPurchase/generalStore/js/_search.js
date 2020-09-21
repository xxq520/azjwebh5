$(function(){
	getHistory();
})
$(document).on("click",".btn-search",function(){
    var keyword = $("#search_inp").val();
    if(keyword == ""){
    	$.alert("请输入关键字");
    	return;
    }
    saveHistorySearch(keyword);
    window.location.href = "shopList.jsp?keyword="+keyword;
})
$(document).on("click",".btn-clear",function(){
	deleteHistorySearch();
	window.location.href = "search.jsp";
})
function getHistory(){
	var data = {};
	data.mobile = userName;
	$.ajax({
		url: _content+'/historySearchMongo/getHistorySearch',
		type: 'post',
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data)
	})
	.done(function(res) {
		console.log(res);
		var data = res.data;
		var _html = '';
	if(data){
	$.each(data.searchName,function(index,value){
		  _html += '<li class="recently-search-item"><a href="shopList.jsp?keyword='+ value+'"><i class="weui-icon-search recently-search-icon"></i>'+ value +'<i class="font-ico arrow-right">&#xe937</i></a></li>';
		})
	}
		$(".recently-search-list").html(_html);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}
function saveHistorySearch(searchName){
	var data = {};
	data.mobile = userName;
	data.searchName = searchName;
	$.ajax({
		url: _content+'/historySearchMongo/saveHistorySearch',
		type: 'post',
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data)
	})
}
function deleteHistorySearch(){
	var data = {};
	data.mobile = userName;
	$.ajax({
		url: _content+'/historySearchMongo/deleteHistorySearch',
		type: 'post',
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data)
	})
}