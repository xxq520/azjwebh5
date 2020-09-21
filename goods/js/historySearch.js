var _html = '';
var keyword=''; //关键字
$(function(){
    let historyRides = getHistoryRides();
    if (historyRides == null || historyRides == "") {
        return;
    }
    var historyWord = historyRides.split(",");
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
                _html += '<li class="recently-item"><a href="searchDetail.html?keyword=' + value + '"' + '><i class="weui-icon-search recently-search-icon"></i>' + value + '<i class="arrow-right"></i></a></li>';
            }
        }
        $(".recently-search-list").html(_html);
    }

});

//保存搜索关键字
function saveHistorysearch(keyword){
    if(null == keyword || keyword == ""){
        //不保存
        return;
    }
    var historySearch = {
        type:'post',
        dataType:'json',
        url:'/goods/hotWord/addHistory',
        data:{
            "historySearch":keyword
        },
        async : false,
        success:function(data){
            if(data.code == 1000){

            }
        }
    }
   if(!isLogin()){$.ajax(historySearch);return;}
   refresh(historySearch);
}

//删除历史记录
$(".deleteHistory").on('click',function(){
    hui.confirm('确认删除全部历史记录？', ['取消','确认'], function(event){
        $(".historyContent-list ul").empty();
        removeHistoryRides();
    });
})


//获取关键字
function getHistoryRides(){
    var historyWord = null;
    var history = {
        type:'post',
        dataType:'json',
        url:'/goods/hotWord/history',
        async : false,
        success:function(data){
            if(data.code == 1000){
                historyWord = data.data;
            }
        }
    }
    if(!isLogin()){$.ajax(history);return;}
    refresh(history);
    return historyWord;
}
//删除关键字
function removeHistoryRides(){
   if(!isLogin()){return;}
   var historyRedis = {
       type:'post',
       dataType:'json',
       url:'/goods/hotWord/deletHistory',
       async : false,
       success:function(data){
           if(data.code == 1000){

           }
       }
   }
   refresh(historyRedis);
}
