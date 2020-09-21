//返回
function toBackClick(){
	window.history.back(-1);
}
//读取视频留言
var videoType = localStorage.getItem("data_val");
var pageIndex = 1;
var pageSize = 10;
var isLoading = false;
var first = true;
hui.refresh('#refreshContainer', refresh);
$(".content_comment").on("scroll",function(e){
	
	var maxTop = this.scrollHeight - this.clientHeight;
	if($(this).scrollTop() + 50  >= maxTop){
		if($(".content_comment").hasClass("loading")){
			return;
		}
		videoGetMoreMessage();
		$(".content_comment").addClass("loading");
		//数据加载完成后执行：$(".content_comment").removeClass("loading");
		console.log("到底了");
		var list = '<div class="nomoreDate">'+"到底了..."+'</div>';
		$(".nomore").html(list);
	}
})
//下拉刷新
function refresh(){
    pageIndex = 1;
    // 因渲染时获取分享图片路径找不到，固ajax方法放在jsp中
    videoRefreshMessage(0);
}
function videoRefreshMessage(num){
	$.ajax({
		url:"/localQuickPurchase/dvideo/findVideoManualMessage",
		type:"post",
		data:{
			seq:seq,
			videoType:videoType,
			pageIndex:1,
			pageSize:10
		},
		async : false,
		success:function(data){
			var list = data.data.list;
			if(data.code == 200 ){
				if(list != null && list.length>0){
					var _html = "";
					for(var i = 0;i < list.length; i++){
						var message = list[i].message; //留言内容
						var mobile = list[i].mobile; //用户手机号码
						var userName = list[i].userName; //用户名
						var userImgUrl = list[i].userImgUrl; //用户头像
						var updateTime = list[i].updateTime; //留言时间
						if(userImgUrl == null || userImgUrl == ""){
							userImgUrl = "/localQuickPurchase/distributionApp/images/_logo.png";
						}
						if(userName == null || userName == ""){
							if(mobile == null || mobile == ""){
								userName="用户名:未设置";
							}else{
								userName=mobile.substring(0,3)+"****"+mobile.substring(mobile.length-4,mobile.length)
							}
						}
						_html += '<li class="clearfix">';
						_html += '<div class="pic"><img src="'+userImgUrl+'" onerror="imgerror(this)"/></div>';
						_html += '<div class="detail">';
						_html += '<div class="head clearfix">';
						_html += '<p class="name">'+userName+'</p>';
						//_html += '<p class="praise flex_vertical">';
						//_html += '<span>"'++'"</span>';
						//_html += '<img src="${path}/distributionApp/images/praise.png" />';
						//_html += '</p>';
						_html += '</div>';
						_html += '<p class="comment_content">'+message+'</p>';
						_html += '<p class="comment_time">'+formatDateTime(updateTime)+'</p>';
						_html += '</div>';
						_html += '</li>';
						//$(".comment_container").append(_html);
					}
					pageIndex = 2;
					setTimeout(function(){
						$('.comment_container').html(_html);
			            //结束刷新
			            hui.endRefresh();
			            //重置加载更多状态
			            hui.resetLoadMore();
			            hui.loading('加载中...', true);
			            if(!first){
			            	if(num != 1){
			            		hui.toast("下拉刷新成功");       	
			            	}
			            }
			            first = false;
					},500)
					$(".content_comment").removeClass("loading");
				}else{
					_html = '<p class="positionContent">暂时没有留言</p>';
					$('.comment_container').html(_html);
					 //结束刷新
		            hui.endRefresh();
		            hui.loading('加载中...', true);
					/*html = '<p class="positionContent">暂时没有留言!</p>';
					$(".comment_container").append(html);
					return;*/
				}
			}else{
				html = '<p class="positionContent">暂时没有留言!</p>';
				//$(".comment_container").append(html);
				return;
			}
			
		}
	});
};
function videoGetMoreMessage(){
	$.ajax({
		url:"/localQuickPurchase/dvideo/findVideoManualMessage",
		type:"post",
		data:{
			seq:seq,
			videoType:videoType,
			pageIndex:pageIndex,
			pageSize:10
		},
		async : false,
		success:function(data){
			var list = data.data.list;
			if(data.code == 200 ){
				if(list != null && list.length>0){
					var _html = "";
					for(var i = 0;i < list.length; i++){
						var message = list[i].message; //留言内容
						var mobile = list[i].mobile; //用户手机号码
						var userName = list[i].userName; //用户名
						var userImgUrl = list[i].userImgUrl; //用户头像
						var updateTime = list[i].updateTime; //留言时间
						if(userImgUrl == null || userImgUrl == ""){
							userImgUrl = "/localQuickPurchase/distributionApp/images/head.png";
						}
						if(userName == null || userName == ""){
							if(mobile == null || mobile == ""){
								userName="用户名:未设置";
							}else{
								userName=mobile.substring(0,3)+"****"+mobile.substring(mobile.length-4,mobile.length)
							}
						}
						_html += '<li class="clearfix">';
						_html += '<div class="pic"><img src="'+userImgUrl+'" onerror="imgerror(this)"/></div>';
						_html += '<div class="detail">';
						_html += '<div class="head clearfix">';
						_html += '<p class="name">'+userName+'</p>';
						//_html += '<p class="praise flex_vertical">';
						//_html += '<span>"'++'"</span>';
						//_html += '<img src="${path}/distributionApp/images/praise.png" />';
						//_html += '</p>';
						_html += '</div>';
						_html += '<p class="comment_content">'+message+'</p>';
						_html += '<p class="comment_time">'+formatDateTime(updateTime)+'</p>';
						_html += '</div>';
						_html += '</li>';
						//$(".comment_container").append(_html);
					}
					$(_html).appendTo('.comment_container');
					pageIndex++;
		            hui.endLoadMore(false);
		            isLoading = false;
				}else{
					hui.endLoadMore(true, '已经到头了...');
	                return false;
				}
			}else{
				html = '<p class="positionContent">暂时没有留言!</p>';
				$(".comment_container").append(html);
				return;
			}


		}
	});
};
//发表留言
function publishedClick(){
	var message = $('#publishedMessage').val();
	if(message == ""){
		hui.toast("请写入您宝贵的留言！！！");
		return;
	}
	$.ajax({
		url:"/localQuickPurchase/dvideo/videoLeaveWords",
		type:"POST",
		data:{
			seq:seq,
			videoType:videoType,
			message:message
		},
		success:function(data){
			if(data.code == 200){
				hui.toast("感谢您宝贵的留言！");
				//发表成功后清空数据
				document.getElementById("publishedMessage").value = "";
				//刷新页面
				videoRefreshMessage(1);
			}
		},
		error:function(error){
			hui.toast("网络异常,请销后再试！");
		}
	});
}


//图片加载失败
function imgerror(thisValue){
	$(thisValue).attr("src","/localQuickPurchase/distributionApp/images/head.png");
}
