var _html = '';
var keyword=''; //关键字

/*$(function(){
    var historyWord = getHistoryRides();
    if(historyWord == null){
        return
    }
    historyWord = historyWord.split(",");
    var identifyMark = getQueryString("identifyMark");
    console.log("识别标识="+identifyMark);
	var i = 0;
	var value = '';
	for(i = 0; i<historyWord.length;i++){
		value = historyWord[i];
		if(!value == ""){
			if(identifyMark == "1"){
                _html += '<li class="recently-item"><a href="brandSquareSearchDetail?keyword=' + value + '&identifyMark=1' + '"' + '><i class="weui-icon-search recently-search-icon"></i>' + value + '<i class="arrow-right"></i></a></li>';
			}else {
                _html += '<li class="recently-item"><a href="searchDetail?keyword=' + value + '"' + '><i class="weui-icon-search recently-search-icon"></i>' + value + '<i class="arrow-right"></i></a></li>';
            }
		}
		$(".recently-search-list").html(_html);
	}

});*/

//保存搜索关键字
function saveHistorysearch(keyword){
    if(null == keyword || keyword == ""){
        //不保存
        return;
    }
    $.ajax({
        type:'post',
        dataType:'json',
        url:'/localQuickPurchase/hotWord/saveHistorySearch',
        data:{
            "seq":seq,
            "historySearch":keyword
        },
        async : false,
        success:function(data){
            if(data.code == 200){

            }
        }
    });
}

//删除历史记录
$(".deleteHistory").on('click',function(){
    hui.confirm('确认删除全部历史记录？', ['取消','确认'], function(event){
        $(".historySearchItem").empty();
        //$(".historyContent-title").hide();
        removeHistoryRides();
    });
})


//获取关键字
function getHistoryRides(){
    var historyWord = null;
    $.ajax({
        type:'post',
        dataType:'json',
        url:'/localQuickPurchase/hotWord/findHistorySearch',
        data:{
            "seq":seq
        },
        async : false,
        success:function(data){
            if(data.code == 200){
                historyWord = data.data;
            }
        }
    });

    return historyWord;
}
//删除关键字
function removeHistoryRides(){
    $.ajax({
        type:'post',
        dataType:'json',
        url:'/localQuickPurchase/hotWord/deletHistorySearch',
        data:{
            "seq":seq
        },
        async : false,
        success:function(data){
            if(data.code == 200){

            }
        }
    });
}




