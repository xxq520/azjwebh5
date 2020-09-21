
var pageIndex = 1;
var pageSize = 5
var state = 0;
var url = '/localQuickPurchase/presellGoods/findPresellGoods';
var cookieSeq = getUserSeq();
hui.refresh('#yushou', refresh);
hui.loadMore(getMore);
var elementName = "yushou";
function miaosha(){
	elementName = "miaosha";
	pageIndex = 1;
	state = 1;
	url = "/localQuickPurchase/selectionGoods/selectionGoodsByAppGroup?cELoveColumnId=8";
	hui.refresh('#' + elementName, refresh);
	hui.loadMore(getMore);
}

var isLoading = false;
var first = true;
var goodsList;


//下拉刷新
function refresh(){
	$.ajax({
		type : 'POST',
		dataType : 'json',
		url : url,
		data : {
			"pageIndex" : pageIndex,
			"pageSize" : pageSize
			},
		success : function(data){
			
			var html = "";
			if(data.code == 200) {
				var bookingGoodsList = data.data;
				if(bookingGoodsList != null && bookingGoodsList.length > 0){
					for (var i = 0; i < bookingGoodsList.length; i++) {
						var html = _setListData(bookingGoodsList);
						pageIndex = 2;
						backPageSize = 10;
						setTimeout(function(){
							$('#' + elementName).html(html);
							//结束刷新
							hui.endRefresh();
							//重置加载更多状态
							hui.resetLoadMore();
							//hui.loading('加载中...', true);
							if(!first){
								//hui.toast("下拉刷新成功");	            	
							}
							first = false;
						},500)
					}
					
				}else{
					html += '<p class="positionContent" style="text-align:center;">没有更多了!</p>';
					$('#yushou').append(html);
					hui.endRefresh();
			        hui.loading('加载中...', true);
				}
			}else{
				hui.endRefresh();
				$(".hui-loading-wrap").css("display","none");
			}
		},
		error : function(data){
			if (data.message == undefined) {
				hui.alert("没有更多了!！");
				$("#yushou").hide();
			}
		}
	});
	
};
//加载更多
function getMore(){
	if(isLoading){
		$(".hui-loading-wrap").css("display","none");
		return;
	}
	isLoading = true;
	var html = '';
    $.ajax({
    	type : 'POST',
		dataType : 'json',
		url :url,
		data : {
			"pageIndex" : pageIndex,
			"pageSize" : pageSize
			},
		async : false,
		success : function(data) {
			if(data.code == 200) {
				var html = "";
				var bookingGoodsList = data.data;
				if(bookingGoodsList != null && bookingGoodsList.length > 0){
					for (var i = 0; i < bookingGoodsList.length; i++) {
						html = _setListData(bookingGoodsList);
					}
					$(html).appendTo('#' + elementName);
					pageIndex++;
					hui.endLoadMore(false);
					isLoading = false;					
				}else{
//					hui.endLoadMore(true, '没有更多了...');
					//hui.endLoadMore(true, ' ');
					if(state == 0){
						hui.endLoadMore(false);
						miaosha();
						isLoading = false;	
						return false;
					}else{
						hui.endLoadMore(true, '');
						html += '<p class="positionContent" style="text-align:center;">没有更多了!</p>';
						$('#' + elementName).append(html);
						//hui.endLoadMore(true, ' ');
						//$(".hui-loading-wrap").addClass("msgtips");
						$("#hui-load-more").html("");
					}
				}
			} else {
				//hui.endLoadMore(true, '没有更多了...');
				//hui.endLoadMore(true, ' ');
				hui.endLoadMore(false);
				isLoading = true;	
				var _html = '<p class="positionContent" style="text-align:center;">没有更多了!</p>';
				$('#' + elementName).append(_html);
                return false;
			}
		},
		error : function(error) {
			hui.toast(error);
		}
	});
}

function _setListData(_data){
	var dataIndex = 0;
	var index = 1;
	goodsList = _data;
	console.log(goodsList);
	var html = "";
	for (var i = 0; i < goodsList.length; i++) {
		var thumbnail = goodsList[i].thumbnail;//缩略图路径
		var goodsName = goodsList[i].goodsName;//商品名
		var goodsId = goodsList[i].goodsId;//商品名
		// ============== 默认取第一个规格的参数来比较 ================================================
		//var seckillPrice = goodsList[i].goodsProStandard[0].seckillPrice;//秒杀价
		var distributionPrice = goodsList[i].goodsProStandard[0].distributionPrice;//分销价
		var activityStartTime = goodsList[i].statrtTime;//活动开始时间
		var activityFinishTime = goodsList[i].endTime;//活动结束时间
		var distributionProfit = goodsList[i].goodsProStandard[0].distributionProfit;//分销商佣金
		var profitPrice = goodsList[i].goodsProStandard[0].profitPrice;//代理商佣金
		var distributionProfit = goodsList[i].goodsProStandard[0].distributionProfit;//分销商佣金
		var presellDay = goodsList[i].presellDay;
		var endTime = goodsList[i].endTime;
		/*=============== 定时器执行的参数 =============== begin ================*/
		// --->>> 1.开始时间  2.现在的时间	3.结束时间	4.客户端的服务器的时间	5.定时器ID <<<---
		var beginTime,timeNow,endTime,timeServerClient,timerID;  
		/*=============== 定时器执行的参数 ===============  end  ================*/
		html += '<div class="act_box_item">';
		//html += '<div class="act_tag1">';
		//html += '<div class="act_tag_txt">预购价</div>';
		//html += '<div class="act_tag_txt">￥'+distributionPrice+'</div>';
		//html += '</div>';
		html += '<div class="a_b_i_img"><img goodsId='+goodsId+' class="buying" src="'+thumbnail+'"/></div>';
		html += '<div class="a_b_i_con">';
		var length = 23;
		html += ' <div class="a_b_i_name">'+((goodsName != null && goodsName.length < length) ? goodsName : (goodsName.substring(0,length)+"...")  )+'</div>';
		//html += '<div class="a_b_i_tip">维维山楂柠檬自自然</div>';
		html += '<div class="a_b_i_num_box">';
		//html += '   <div class="a_b_i_num_txt color1">日供量<span class="dayNum">100</span>份</div>';
		//html += ' <div class="a_b_i_num_txt color1">剩余量<span class="leftNum">20</span>份</div>';
		html += ' </div>';
		html += ' <div class="a_b_i_price_box">';
		html += '<div class="a_b_i_price_txt"><span class="tag">活动价</span><i class="fh">￥</i><span class="actPrice color1">'+distributionPrice+'</span></div>';
		html += ' <div class="a_b_i_price_txt">';
		//html += '<div class="reprice"><del>￥163<del></div>';
		if(cookieSeq != '' && cookieSeq > 0){
			if(distributorType != null){
				if(isRoleAgent()){
					//分销商佣金
					html += ' <div class="earnMoney">赚：￥'+distributionProfit+'</div>';
				}else if(isRoleDealer()){
					//代理商佣金
					html += ' <div class="earnMoney">赚：￥'+profitPrice+'</div>';
				}
			}
			
		}
		html += ' </div>';
		html += '  </div>';
		if (elementName == "yushou") {
			html += ' <div class="a_b_i_btn"><img goodsId='+goodsId+' class="buying" src="/localQuickPurchase/distributionApp/images/but.png"/></div>';
		} else {
			html += ' <div class="a_b_i_btn"><img goodsId='+goodsId+' class="buying" src="/localQuickPurchase/distributionApp/images/but2.png"/></div>';
		}
		html += '</div>';
		html += '</div>';
	}
	return html;
}

//设置的定时器
/*function show_time(endTime,timeServerClient,i){  
	var timer = document.getElementById("timer"+i);  
	if(!timer){  
		return ;  
	}  
	timer.innerHTML = timeServerClient;  

	var time_now,timeDistance,strTime;  //1.当前时间		2.时间距离		3.拼接输出时间
	var day,hour,minute,second;  //1.天数		2.小时		3.分钟	4.秒
	//每秒钟都获取一次当前时间
	var time_now = new Date();
	//time_now = time_now.getTime();
	// 剩余时间 = 结束(开始)时间 - 当前时间
	timeDistance = endTime-time_now;  
	
	if(timeDistance>0){  
		day = Math.floor(timeDistance/86400000)  //计算天数
		timeDistance -= day*86400000;  
		hour = Math.floor(timeDistance/3600000)  //计算小时
		timeDistance -= hour*3600000;  
		minute = Math.floor(timeDistance/60000)  //计算分钟
		timeDistance -= minute*60000;  
		second = Math.floor(timeDistance/1000)  //计算秒数
		
		//如果只剩下个位数，则在十位数加上0
		if(hour<10)  
		hour="0"+hour;  
		if(minute<10)  
		minute="0"+minute;  
		if(second<10)  
		second="0"+second;
		
		//拼接时间
		//strTime=day+"天"+hour+"小时"+minute+"分钟"+second+"秒";  
		strTime=("距离预售开始时间：")+day+"天  "+hour+":"+minute+":"+second;  
		//定时器输出时间
		timer.innerHTML=strTime;  
		//每秒循环执行
		setTimeout("show_time("+endTime+","+timeServerClient+","+i+")",1000);  
	} else {//倒计时结束执行的操作  
		timer.innerHTML ="活动时间已结束！！！";  
		//clearTimeout(timerID);
		clearTimeout("活动时间已结束！！！");
	}  
}

//判断是否登录
function noLogin(){
    sltHide();
    hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
        setCookie("loginRetrunUrl",urlVal);
        var url = "/localQuickPurchase/distributionVA/login/passwordLogin";
	    if (checkShare != null && checkShare != "") {
	    	url += "?rdSeq=" + shareSeq;
	    }
		window.location.href = url;
    });
}


hui(".hui-tab-title div").click(function(){
	var currentIndex=$(".hui-tab-body .hui-tab-item").eq($(this).index()).height()+54
    //var index = $(".hui-tab-title div.current").index() + 2;
    //var aH = $(".hui-tab-item").eq(index).height() + 10;
    $(".hui-tab-body").css("height",currentIndex);
});*/
//商品图片点击  进入商品详情
$("body").on('click', '.goodsDetail', function() {
	var goodsId = $(this).attr('goodsId');
	var num = $(this).attr('num');
	// addGoodsHistoryBySeq(seq,goodsId);//暂时注释
	if(seq == null || seq == 0) {
		seq = 0;
	}
	var url = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
	window.location.href = url;
});

$("body").on('click', '.buying', function() {
	var $this = $(this);
	var goodsId = $this.attr("goodsId");
	var url = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/0"+"/"+seq;
	window.location.href = url;
});

var urlVal = "http://192.168.1.66:8080/localQuickPurchase/distributionVA/bookingGoods";

function recruitUrl(){
	var href = window.location.href;
	var contentUrl = href.substring(0,href.indexOf("distributionVA/"))+"distributionVA/seckill/activityy?checkShare=1&shareSeq=" + seq;
	return contentUrl;
}

hui('#shareTops').click(function(){
	type = 1;
	shareType = 1;
	var urlVal = recruitUrl();
	//分享出去的链接
	
	
	//getQRCodeURL(type);//二维码链接
	var content = "“只有通过您分享的链接，进行注册才可以成为您的VIP”";
	$("#vip_context").html(content);
	$("html,body").css("overflow","hidden");
	//判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1;
    if(isappwebview){
	  	//点击分享
	  	share520Love(urlVal,'邀请好友分享',userName + '邀请您一起在爱之家购物','','.share-content');
    } else {
	  	share520LoveWeb(urlVal,'邀请好友分享',userName + '邀请您一起在爱之家购物','','.share-content');
	    hui.dialogBase();
	    $(".share-block").slideDown(200);
    }
});
