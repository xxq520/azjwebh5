/*爱之家助手*/
//获取ModelAndView的值
hui.refresh('.main_container', downMove);
hui.loadMore(goodsList);

var isLoading = false;
var first = true;
var messageType = '';
var pageIndex = 1;

function goodsList(){
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/systematicNotification/findSysByMessageType",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"seq" : seq,"pageIndex" : pageIndex,"messageType":2}),
        dataType: "json",	//设置返回值得类型
        success: function (data) {
            if (data.code == 200 || data.code == 404) {
                var messageTopic = data.data.list;
                if (messageTopic != null && messageTopic.length > 0) {
                    $('.main_container #list').append(getDateList(messageTopic));
                    pageIndex++;
                    hui.endLoadMore(false);
                    isLoading = false;
                }else{
                    hui.endLoadMore(true, '已经到头了...');
                    return false;
                }
            }else{
                hui.endLoadMore(true, '已经到头了...');
                return false;
            }
        }
    });
};
function downMove(){
    $.ajax({
        type:"post",
        contentType: "application/json;charset=utf-8",
        url:"/localQuickPurchase/systematicNotification/findSysByMessageType",
        dataType : "json",//设置返回值得类型
        data:JSON.stringify({"seq" : seq,"pageIndex" : 1,"messageType":2}),
        dataType: "json",	//设置返回值得类型
        success:function(data){
            var messageTopic = data.data.list;
            if(messageTopic == null || messageTopic.length == 0){
                html = '<p class="positionContent">暂时没有爱之家助手消息!</p>';
                $('.main_container').append(html);
                return false;
            }
            if(messageTopic != null && messageTopic.length > 0){
                setTimeout(function(){
                    $('.main_container #list').empty();
                    $(getDateList(messageTopic)).appendTo('.main_container #list');
                    //结束刷新
                    pageIndex = 2;
                    hui.endRefresh();
                    //重置加载更多状态
                    hui.resetLoadMore();
                    hui.loading('加载中...', true);
                    if(!first){
                        hui.toast("下拉刷新成功");
                    }
                    first = false;
                },500)
            } else {
                //结束刷新
                hui.endRefresh();
                hui.loading('加载中...', true);
                hui.toast("暂时没有更多爱之家助手消息...");

            }
        }
    });
};
function getDateList(messageTopic){
    var html = '';
    for (var i = 0; i < messageTopic.length; i++) {
        var informType = messageTopic[i].informType; //小标题
        var informTitle = messageTopic[i].informTitle; //标题
        var informTime = messageTopic[i].informTime; //日期
        var date = formatDate(informTime);//转换时间格式
        var informContent = messageTopic[i].informContent; //内容
        var informImgUrl = messageTopic[i].informImgUrl; //图片路径
        var state = messageTopic[i].state; //当state状态为0时，该信息处于未读状态
        var id = messageTopic[i].id;
        if(informImgUrl == null || informImgUrl == ""){
            informImgUrl = "../distributionApp/images/img_03.png";
        }

        html += '<div class="notice_list margin-t-3">';
        if (state == 0) {
            html += '<div class="notice-block"><span class="point point_list"></span>';
        }else{
            html += '<div class="notice-block">';
        }
        html += '<span class="hui-badge hui-danger font-sm">' + informType + '</span>';
        if (informTitle != "null" && informTitle != null && informTitle != "") {
            html += '<span class="font-lg over_test">' + informTitle + '</span>';
        }
        html += '<span class="pull-right">' + date + '</span>';
        html += '</div>';
        html += '<div class="notice_detail">';
        html += '<span class="notice_text" data-state="' + state + '" data-informContent="' + informContent + '" id=' + id + '>' + informContent + '</span>';
        html += '<span class="notice_img"><img src="'+informImgUrl+'" height="158" width="14"></span>';
        html += '</div>';
        html += '<div class="operation"><span class="orderDetail" data-state="' + state + '" data-informContent="' + informContent + '" id=' + id + '>查看详情</span><span class="deleteOrder" data-id="'+id+'">删除</span></div>'
        html += '</div>';
    }
    return html;
}
$("body").on('click','.notice_list',function(){
    if($(this).find('.operation').is('.operationOpen')){
        $(this).find('.operation').removeClass('operationOpen');
    }else{
        $(this).find('.operation').addClass('operationOpen');
    }
})
/*删除*/
$('body').on('click','.deleteOrder',function(){
    $(this).parent().parent().remove();
    var _id = $(this).attr("data-id");
    var code;
    $.ajax({
        type: "post",
        url: "/localQuickPurchase/systematicNotification/deleteSys",
        data: {
            id: _id
        },
        dataType: "json",	//设置返回值得类型
        success: function (data) {
            code = data.code;
            if (code == 200) {
                hui.toast("删除成功!");
            }
        },
        error: function () {

        }
    });
})
//修改状态
$(document).on('click','.orderDetail',function(){
	var state = $(this).attr("data-state");
	var id = $(this).attr("id");
	if(state == 0){//未读状态
		state = 1;
		$.ajax({
			type:"post",
			url:"/localQuickPurchase/systematicNotification/updateSystematicNotificationState",
			data:{
				id:id
			},
			dataType: "json",	//设置返回值得类型
			success: function(data){
				if(data.code == 200){
					//alert("更新成功!");
				}
			},
			error:function(){
				
			}
		});
	}
	//删除红点
	//$(this).find(".point").remove();
	$(this).parent().siblings('.notice-block').find(".point_list").remove();
    window.location.href = "/localQuickPurchase/distributionVA/informationContent?id=" + id;
});



