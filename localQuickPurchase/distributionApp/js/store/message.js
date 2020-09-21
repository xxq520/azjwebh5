$("body").on("click","#hui-back",function(){
	window.location.go(-1);
});
var html = '';
//用户类型
var userType = getRoleType();
var informId = '';//系统id
//网络店主首页一进加载通知系统信息类型
// var userName=getCookie("userName");

$(function(){
	systemMessageClick();
});

//判断用户是否登录
if(!isLogin()){
	hui.confirm('请先登录！！！', ['暂不登录','马上登录'], function(){
        loginPage();
    });
}

//加载通知系统信息类型
function systemMessageClick(){
	$(".systemMessageType").empty();
	$.ajax({
		type:"post",
		url:"/localQuickPurchase/systematicNotification/findSysClassify",
		data:{
			seq: getUserSeq(),
			userType:userType
		},
		dataType:"json",
		success:function(data){
			if(data.code = 200 ){
				var listMessageType = data.data;
				if(listMessageType == null || listMessageType.length == 0){
					hui.toast("暂时没有消息！");
					return;
				}
				html = '';
				html += '<ul>';
				for(var i = 0;i<listMessageType.length;i++){
					var messageType = listMessageType[i].messageType;//消息类型
					var count = listMessageType[i].messageTypeCount;//消息类型的个数
					var state = listMessageType[i].state; //当state为0时该信息类型有未读信息
                    var countStr = '';
                    if(count != 0){
                        countStr = '('+count+')';
					}
					if(messageType == 0 ){
						if(state == 0){
							html += '<li class="orderhelperJump"><span class="point point_list"></span><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_1.png" />订单助手'+countStr+'</a></li>';
						}else{
							html += '<li class="orderhelperJump"><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_1.png" />订单助手'+countStr+'</a></li>';
						}
					}
					if(messageType == 1){
						if(state == 0){
							html += '<li class="homeAnnouncement"><span class="point point_list"></span><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_03.png" />爱之家公告'+countStr+'</a></li>';
						}else{
							html += '<li class="homeAnnouncement"><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_03.png" />爱之家公告'+countStr+'</a></li>';
						}
					}
					if(messageType == 2){
						if(state == 0){
							html += '<li class="assistant"><span class="point point_list"></span><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_07.png" />爱之家助手'+countStr+'</a></li>';
						}else{
							html += '<li class="assistant"><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_07.png" />爱之家助手'+countStr+'</a></li>';
						}
					}
					if(messageType == 3){
						if(state == 0){
							html += '<li class="trainingnews"><span class="point point_list"></span><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_11.png" />培训消息'+countStr+'</a></li>';
						}else{
							html += '<li class="trainingnews"><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_11.png" />培训消息'+countStr+'</a></li>';
						}
					}
					if(messageType == 4){
						if(state == 0){
							html += '<li class="activeMessage"><span class="point point_list"></span><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_14.png" />活动消息'+countStr+'</a></li>';
						}else{
							html += '<li class="activeMessage"><a class="hui-arrow"><img src="../distributionApp/images/mes_icon_14.png" />活动消息'+countStr+'</a></li>';
						}
					}
				}
				html += '</ul>';				
				$(".systemMessageType").append(html);
			}
		},
		error:function(){

		}
	});
};

//订单助手
$(document).on("click",".orderhelperJump",function(){
    if (!isLogin()) {
        loginPage();
        return;
    }
	deliverStatus = 4;
	window.location.href="/localQuickPurchase/distributionVA/orderhelper?seq="+seq+"&deliverStatus="+deliverStatus;
});

//爱之家公告
$(document).on("click",".homeAnnouncement",function(){
    if (!isLogin()) {
        loginPage();
        return;
    }
	window.location.href="/localQuickPurchase/distributionVA/topic";
});

//爱之家助手
$(document).on("click",".assistant",function(){
    if (!isLogin()) {
        loginPage();
        return;
    }
	window.location.href="/localQuickPurchase/distributionVA/assistant";
});

//培训信息
$(document).on("click",".trainingnews",function(){
    if (!isLogin()) {
        loginPage();
        return;
    }
	if(informId == null || informId == ""){
		informId = "1111111";
	}
	messageType = 3;
	window.location.href="/localQuickPurchase/distributionVA/trainingnews?seq="+seq+"&userType="+userType+"&messageType="+messageType+"&informId="+informId;
});

//活动信息
$(document).on("click",".activeMessage",function(){
    if (!isLogin()) {
        loginPage();
        return;
    }
	if(informId == null || informId == ""){
		informId = "1111111";
	}
	messageType = 4;
	window.location.href="/localQuickPurchase/distributionVA/activeMessage?seq="+seq+"&userType="+userType+"&messageType="+messageType+"&informId="+informId;
});
//网络店主有我的粉丝功能
$(function(){
	if(isRoleAgent()){//网络店主
		
		
	}
});

//我的粉丝
/*$(document).on("click","#myFans",function(){
	seq = 3751621;
	deliverStatus = 4;
	window.location.href="/localQuickPurchase/systematicNotification/myFans.html?seq="+seq+"&deliverStatus="+deliverStatus;
});*/
function myFansClick(){
	seq = 3751621;
	deliverStatus = 4;
	window.location.href="/localQuickPurchase/distributionVA/myFans?seq="+seq+"&deliverStatus="+deliverStatus;
}
//店主私信
function privateMessageClick(){
	$(".systemMessageType").empty();//从被选元素中删除子元素
	hui.toast("暂无消息！");
};