
//当前用户的seq
var seq = getUserSeq();
//代理商如何招募网络店主(代理商)
var daiLiShangRuHeZhaoMuWangLuoDianZhu = document.getElementById('daiLiShangRuHeZhaoMuWangLuoDianZhu');
//如何升级为代理商(代理商/分销商)
var ruHeShangJiWeiDaiLiShang = document.getElementById('ruHeShangJiWeiDaiLiShang');
//如何注册登录和购买(代理商/分销商/用户)
var ruHeZhuCeDengLuHeGouMai = document.getElementById('ruHeZhuCeDengLuHeGouMai');
//如何开店(代理商/分销商/用户)
var ruHeKaiDian = document.getElementById('ruHeKaiDian');
//如何提现(代理商/分销商)
var ruHeTiXian = document.getElementById('ruHeTiXian');
//如何退款、退换货(代理商/分销商/用户)
var ruHeTuiKuanTuiHuanHuo = document.getElementById('ruHeTuiKuanTuiHuanHuo');
//网络店主如何招募用户(代理商/分销商)
var wangLuoDianZhuRuHeZhaoMuYongHu = document.getElementById('wangLuoDianZhuRuHeZhaoMuYongHu');
//本地代理商添加本地商品(代理商)
var benDiDaiLiShangTianJiaBenDiShangPin = document.getElementById('benDiDaiLiShangTianJiaBenDiShangPin');

//判断用户类型显示不同的视频
if(isRoleConsumer() || isRoleVip()){//普通用户
	$("#daiLiShangRuHeZhaoMuWangLuoDianZhu").parents(".vItem").remove()
	$("#ruHeShangJiWeiDaiLiShang").parents(".vItem").remove()
	$("#ruHeTiXian").parents(".vItem").remove()
	$("#wangLuoDianZhuRuHeZhaoMuYongHu").parents(".vItem").remove()
	$("#benDiDaiLiShangTianJiaBenDiShangPin").parents(".vItem").remove()
}else if(isRoleAgent()){//分销商
	$("#daiLiShangRuHeZhaoMuWangLuoDianZhu").parents(".vItem").remove()
	$("#wangLuoDianZhuRuHeZhaoMuYongHu").parents(".vItem").remove()
	$("#benDiDaiLiShangTianJiaBenDiShangPin").parents(".vItem").remove()
}else if(isRoleDealer()){
	
}

/**
daiLiShangRuHeZhaoMuWangLuoDianZhu
ruHeKaiDian
ruHeShangJiWeiDaiLiShang
ruHeTiXian
ruHeTuiKuanTuiHuanHuo
ruHeZhuCeDengLuHeGouMai
wangLuoDianZhuRuHeZhaoMuYongHu
benDiDaiLiShangTianJiaBenDiShangPin
 * 
 */
var startDaiLiShangRuHeZhaoMuWangLuoDianZhu;//第一次留言发表时间
var startRuHeKaiDian;//第一次留言发表时间
var startRuHeShangJiWeiDaiLiShang;//第一次留言发表时间
var startRuHeTiXian;//第一次留言发表时间
var startRuHeTuiKuanTuiHuanHuo;//第一次留言发表时间
var startRuHeZhuCeDengLuHeGouMai;//第一次留言发表时间
var startWangLuoDianZhuRuHeZhaoMuYongHu;//第一次留言发表时间
var startBenDiDaiLiShangTianJiaBenDiShangPin;//第一次留言发表时间

var endDaiLiShangRuHeZhaoMuWangLuoDianZhu;//第二次留言发表时间
var endRuHeKaiDian;//第二次留言发表时间
var endRuHeShangJiWeiDaiLiShang;//第二次留言发表时间
var endRuHeTiXian;//第二次留言发表时间
var endRuHeTuiKuanTuiHuanHuo;//第二次留言发表时间
var endRuHeZhuCeDengLuHeGouMai;//第二次留言发表时间
var endWangLuoDianZhuRuHeZhaoMuYongHu;//第二次留言发表时间
var endBenDiDaiLiShangTianJiaBenDiShangPin;//第二次留言发表时间

//1:代理商如何招募网络店主,2:如何开店,3:如何升级为代理商,4:如何提现,5:如何退款、退换货,
//6:如何注册登录和购买,7:网络店主如何招募用户,8:本地代理商添加本地商品
var videoType;//当前点击
var module="爱之家商城系统";
var oldDaiLiShangRuHeZhaoMuWangLuoDianZhuClick;//前次点击
var oldRuHeKaiDianClick;//前次点击
var oldRuHeShangJiWeiDaiLiShangClick;//前次点击
var oldRuHeTiXianClick;//前次点击
var oldRuHeTuiKuanTuiHuanHuoClick;//前次点击
var oldRuHeZhuCeDengLuHeGouMaiClick;//前次点击
var oldWangLuoDianZhuRuHeZhaoMuYongHuClick;//前次点击
var oldBenDiDaiLiShangTianJiaBenDiShangPinClick;//前次点击

$(".submitBtn").click(function(){
	var message = $('.videoMessage').val();
	var s=document.getElementById("subscriberMessage").innerHTML;
	if(message == ""){
		showText("请写入您宝贵的留言！！！");
		return;
	}
	//为了防止用户一直提交留言，现控制每类视频留言我分钟内只能提交一次
	if(videoType == oldDaiLiShangRuHeZhaoMuWangLuoDianZhuClick){//当用户同一种视频留言第二次点击
		endDaiLiShangRuHeZhaoMuWangLuoDianZhu = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endDaiLiShangRuHeZhaoMuWangLuoDianZhu-startDaiLiShangRuHeZhaoMuWangLuoDianZhu)<(5*60*1000)){
			var nowTime = (startDaiLiShangRuHeZhaoMuWangLuoDianZhu+(5*60*1000)-endDaiLiShangRuHeZhaoMuWangLuoDianZhu)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}else if(videoType == oldRuHeKaiDianClick){//2
		endRuHeKaiDian = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endRuHeKaiDian-startRuHeKaiDian)<(5*60*1000)){
			var nowTime = (startRuHeKaiDian+(5*60*1000)-endRuHeKaiDian)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}else if(videoType == oldRuHeShangJiWeiDaiLiShangClick){//3
		endRuHeShangJiWeiDaiLiShang = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endRuHeShangJiWeiDaiLiShang-startRuHeShangJiWeiDaiLiShang)<(5*60*1000)){
			var nowTime = (startRuHeShangJiWeiDaiLiShang+(5*60*1000)-endRuHeShangJiWeiDaiLiShang)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}else if(videoType == oldRuHeTiXianClick){//4
		endRuHeTiXian = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endRuHeTiXian-startRuHeTiXian)<(5*60*1000)){
			var nowTime = (startRuHeTiXian+(5*60*1000)-endRuHeTiXian)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}else if(videoType == oldRuHeTuiKuanTuiHuanHuoClick){//5
		endRuHeTuiKuanTuiHuanHuo = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endRuHeTuiKuanTuiHuanHuo-startRuHeTuiKuanTuiHuanHuo)<(5*60*1000)){
			var nowTime = (startRuHeTuiKuanTuiHuanHuo+(5*60*1000)-endRuHeTuiKuanTuiHuanHuo)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}else if(videoType == oldRuHeZhuCeDengLuHeGouMaiClick){//6
		endRuHeZhuCeDengLuHeGouMai = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endRuHeZhuCeDengLuHeGouMai-startRuHeZhuCeDengLuHeGouMai)<(5*60*1000)){
			var nowTime = (startRuHeZhuCeDengLuHeGouMai+(5*60*1000)-endRuHeZhuCeDengLuHeGouMai)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}else if(videoType == oldWangLuoDianZhuRuHeZhaoMuYongHuClick){//7
		endWangLuoDianZhuRuHeZhaoMuYongHu = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endWangLuoDianZhuRuHeZhaoMuYongHu-startWangLuoDianZhuRuHeZhaoMuYongHu)<(5*60*1000)){
			var nowTime = (startWangLuoDianZhuRuHeZhaoMuYongHu+(5*60*1000)-endWangLuoDianZhuRuHeZhaoMuYongHu)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}else if(videoType == oldBenDiDaiLiShangTianJiaBenDiShangPinClick){//8
		endBenDiDaiLiShangTianJiaBenDiShangPin = new Date().getTime(); //用户第二次点击时间/毫秒
		//判断用户点击同一种视频留言前后时间是否有五分钟
		if((endBenDiDaiLiShangTianJiaBenDiShangPin-startBenDiDaiLiShangTianJiaBenDiShangPin)<(5*60*1000)){
			var nowTime = (startBenDiDaiLiShangTianJiaBenDiShangPin+(5*60*1000)-endBenDiDaiLiShangTianJiaBenDiShangPin)/1000+"";
			//var newTime = nowTime.substr(0,nowTime.length-4);
			var newTime = nowTime.substr(0,nowTime.indexOf("."));
			//var newTime = (startTime+(5*60))-endTime;
			showText("同类型的视频留言时间间隔为五分钟，剩余："+newTime+"秒");
			return;
		}
	}
	$.ajax({
		url:"/localQuickPurchase/dvideo/videoLeaveWords",
		type:"POST",
		data:{
			seq:seq,
			videoType:videoType,
			message:message,
			module:module
		},
		success:function(data){
			showText("感谢您宝贵的留言！");
			//发表成功后清空数据
			document.getElementById("subscriberMessage").value = "";
			//记录点击留言发表类型
			if(videoType == 1){
				oldDaiLiShangRuHeZhaoMuWangLuoDianZhuClick = videoType;				
				startDaiLiShangRuHeZhaoMuWangLuoDianZhu = new Date().getTime();//用户第一次发表留言时间/毫秒
			}else if(videoType == 2){
				oldRuHeKaiDianClick = videoType;
				startRuHeKaiDian = new Date().getTime();//用户第一次发表留言时间/毫秒
			}else if(videoType == 3){
				oldRuHeShangJiWeiDaiLiShangClick = videoType;
				startRuHeShangJiWeiDaiLiShang = new Date().getTime();//用户第一次发表留言时间/毫秒
			}else if(videoType == 4){
				oldRuHeTiXianClick = videoType;
				startRuHeTiXian = new Date().getTime();//用户第一次发表留言时间/毫秒
			}else if(videoType == 5){
				oldRuHeTuiKuanTuiHuanHuoClick = videoType;
				startRuHeTuiKuanTuiHuanHuo = new Date().getTime();//用户第一次发表留言时间/毫秒
			}else if(videoType == 6){
				oldRuHeZhuCeDengLuHeGouMaiClick = videoType;
				startRuHeZhuCeDengLuHeGouMai = new Date().getTime();//用户第一次发表留言时间/毫秒
			}else if(videoType == 7){
				oldWangLuoDianZhuRuHeZhaoMuYongHuClick = videoType;
				startWangLuoDianZhuRuHeZhaoMuYongHu = new Date().getTime();//用户第一次发表留言时间/毫秒
			}else if(videoType == 8){
				oldBenDiDaiLiShangTianJiaBenDiShangPinClick = videoType;
				startBenDiDaiLiShangTianJiaBenDiShangPin = new Date().getTime();//用户第一次发表留言时间/毫秒
			}
		},
		error:function(error){
			showText("网络异常,请销后再试！");
		}
	});
});

mui('body').on('tap', 'button', function() {
		this.click();
});

//视频点击播放次数
var daiLiShangRuHeZhaoMuWangLuoDianZhuNum = 0;
var ruHeKaiDianNum = 0;
var ruHeShangJiWeiDaiLiShangNum = 0;
var ruHeTiXianNum = 0;
var ruHeTuiKuanTuiHuanHuoNum = 0;
var ruHeZhuCeDengLuHeGouMaiNum = 0;
var wangLuoDianZhuRuHeZhaoMuYongHuNum = 0;
var benDiDaiLiShangTianJiaBenDiShangPinNum = 0;

	//获取视频按钮点击事件的值,通过点击次数来控制播放
	//1
	function daiLiShangRuHeZhaoMuWangLuoDianZhuClick(){
		ruHeKaiDianNum = 0; //将视频播放点击数次清零
		ruHeShangJiWeiDaiLiShangNum = 0; //将视频播放点击数次清零
		ruHeTiXianNum = 0; //将视频播放点击数次清零
		ruHeTuiKuanTuiHuanHuoNum = 0; //将视频播放点击数次清零
		ruHeZhuCeDengLuHeGouMaiNum = 0; //将视频播放点击数次清零
		wangLuoDianZhuRuHeZhaoMuYongHuNum = 0; //将视频播放点击数次清零
		benDiDaiLiShangTianJiaBenDiShangPinNum = 0; //将视频播放点击数次清零
		var videoClickVal = $(".vjs-play-control").attr('title');
		if(videoClickVal == "Play" ){
			daiLiShangRuHeZhaoMuWangLuoDianZhu.play();
			//videojs("daiLiShangRuHeZhaoMuWangLuoDianZhu").requestFullscreen();
			//daiLiShangRuHeZhaoMuWangLuoDianZhu.enterFullScreen();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	
	//2
	function ruHeKaiDianClick(){
		myAuthorsClickNum = 0; //将视频播放点击数次清零
		ruHeKaiDianNum += 1; //统计视频播放点击数次
		 ruHeShangJiWeiDaiLiShangNum = 0; 
		 ruHeTiXianNum = 0; 
		 ruHeTuiKuanTuiHuanHuoNum = 0; 
		 ruHeZhuCeDengLuHeGouMaiNum = 0; 
		 wangLuoDianZhuRuHeZhaoMuYongHuNum = 0; 
		 benDiDaiLiShangTianJiaBenDiShangPinNum = 0; 
		if(ruHeKaiDianNum%2 != 0){//点击播放数次为偶数时，该视频为播放状态
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.play();
			//videojs("ruHeKaiDian").requestFullscreen();
			//ruHeKaiDian.enterFullScreen();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	//3
	function ruHeShangJiWeiDaiLiShangClick(){
		myAuthorsClickNum = 0; //将视频播放点击数次清零
		ruHeKaiDianNum = 0;
		ruHeShangJiWeiDaiLiShangNum += 1;//统计视频播放点击数次
		ruHeTiXianNum = 0; 
		ruHeTuiKuanTuiHuanHuoNum = 0; 
		ruHeZhuCeDengLuHeGouMaiNum = 0; 
		wangLuoDianZhuRuHeZhaoMuYongHuNum = 0; 
		benDiDaiLiShangTianJiaBenDiShangPinNum = 0; 
		if(ruHeShangJiWeiDaiLiShangNum%2 != 0){//点击播放数次为偶数时，该视频为播放状态
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.play();
			//videojs("ruHeShangJiWeiDaiLiShang").requestFullscreen();
			//ruHeShangJiWeiDaiLiShang.enterFullScreen();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	//4
	function ruHeTiXianClick(){
		 myAuthorsClickNum = 0; //将视频播放点击数次清零
		 ruHeKaiDianNum = 0;
		 ruHeShangJiWeiDaiLiShangNum = 0; 
		 ruHeTiXianNum += 1; //统计视频播放点击数次
		 ruHeTuiKuanTuiHuanHuoNum = 0; 
		 ruHeZhuCeDengLuHeGouMaiNum = 0; 
		 wangLuoDianZhuRuHeZhaoMuYongHuNum = 0; 
		 benDiDaiLiShangTianJiaBenDiShangPinNum = 0; 
		if(ruHeTiXianNum%2 != 0){//点击播放数次为偶数时，该视频为播放状态
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.play();
			//videojs("ruHeTiXian").requestFullscreen();
			//ruHeTiXian.enterFullScreen();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	//5
	function ruHeTuiKuanTuiHuanHuoClick(){
		 myAuthorsClickNum = 0; //将视频播放点击数次清零
		 ruHeKaiDianNum = 0;
		 ruHeShangJiWeiDaiLiShangNum = 0; 
		 ruHeTiXianNum = 0; 
		 ruHeTuiKuanTuiHuanHuoNum += 1; //统计视频播放点击数次
		 ruHeZhuCeDengLuHeGouMaiNum = 0; 
		 wangLuoDianZhuRuHeZhaoMuYongHuNum = 0; 
		 benDiDaiLiShangTianJiaBenDiShangPinNum = 0; 
		if(ruHeTuiKuanTuiHuanHuoNum%2 != 0){//点击播放数次为偶数时，该视频为播放状态
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.play();
			//videojs("ruHeTuiKuanTuiHuanHuo").requestFullscreen();
			//ruHeTuiKuanTuiHuanHuo.enterFullScreen();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	//6
	function ruHeZhuCeDengLuHeGouMaiClick(){
		 myAuthorsClickNum = 0; //将服务商视频播放点击数次清零
		 ruHeKaiDianNum = 0;
		 ruHeShangJiWeiDaiLiShangNum = 0; 
		 ruHeTiXianNum = 0; 
		 ruHeTuiKuanTuiHuanHuoNum = 0; 
		 ruHeZhuCeDengLuHeGouMaiNum += 1; //统计视频播放点击数次
		 wangLuoDianZhuRuHeZhaoMuYongHuNum = 0; 
		 benDiDaiLiShangTianJiaBenDiShangPinNum = 0; 
		if(ruHeZhuCeDengLuHeGouMaiNum%2 != 0){//点击播放数次为偶数时，该视频为播放状态
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.play();
			//videojs("ruHeZhuCeDengLuHeGouMai").requestFullscreen();
			//ruHeZhuCeDengLuHeGouMai.enterFullScreen();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	//7
	function wangLuoDianZhuRuHeZhaoMuYongHuClick(){
		myAuthorsClickNum = 0; //将服务商视频播放点击数次清零
		ruHeKaiDianNum += 1;
		 ruHeShangJiWeiDaiLiShangNum = 0; 
		 ruHeTiXianNum = 0; 
		 ruHeTuiKuanTuiHuanHuoNum = 0; 
		 ruHeZhuCeDengLuHeGouMaiNum = 0; 
		 wangLuoDianZhuRuHeZhaoMuYongHuNum += 1; //统计视频播放点击数次
		 benDiDaiLiShangTianJiaBenDiShangPinNum = 0; 
		if(wangLuoDianZhuRuHeZhaoMuYongHuNum%2 != 0){//点击播放数次为偶数时，该视频为播放状态
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.play();
			//videojs("ruHeZhuCeDengLuHeGouMai").requestFullscreen();
			//wangLuoDianZhuRuHeZhaoMuYongHu.enterFullScreen();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	//8
	function benDiDaiLiShangTianJiaBenDiShangPinClick(){
		 myAuthorsClickNum = 0; //将服务商视频播放点击数次清零
		 ruHeKaiDianNum = 0;
		 ruHeShangJiWeiDaiLiShangNum = 0; 
		 ruHeTiXianNum = 0; 
		 ruHeTuiKuanTuiHuanHuoNum = 0; 
		 ruHeZhuCeDengLuHeGouMaiNum = 0; 
		 wangLuoDianZhuRuHeZhaoMuYongHuNum = 0; 
		 benDiDaiLiShangTianJiaBenDiShangPinNum += 1; //统计视频播放点击数次
		if(benDiDaiLiShangTianJiaBenDiShangPinNum%2 != 0){//点击播放数次为偶数时，该视频为播放状态
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.play();
			//videojs("benDiDaiLiShangTianJiaBenDiShangPin").requestFullscreen();
			//benDiDaiLiShangTianJiaBenDiShangPin.enterFullScreen();
		}else{
			daiLiShangRuHeZhaoMuWangLuoDianZhu.pause();
			ruHeKaiDian.pause();
			ruHeShangJiWeiDaiLiShang.pause();
			ruHeTiXian.pause();
			ruHeTuiKuanTuiHuanHuo.pause();
			ruHeZhuCeDengLuHeGouMai.pause();
			wangLuoDianZhuRuHeZhaoMuYongHu.pause();
			benDiDaiLiShangTianJiaBenDiShangPin.pause();
		}
	};
	
	
	$(".vedioItem").click(function(){
		$(this).attr("id");
	})
	//服务商
	/*var myAuthorsClickNum = 0; //记录服务商视频点击数次
	function videoMyAuthors(){*/
		/*centerIndexClickNum = 0; //将分销商视频播放数次清零
		myAuthorsClickNum += 1;
		//var myAuthorsClickVal = $(".vjs-play-control").attr('title');
		if(myAuthorsClickNum%2 !=0 ){
			myCommon.pause();
			centerIndex.pause();
			myAuthors.play();
		}else{
			myCommon.pause();
			centerIndex.pause();
			myAuthors.pause();
		}*/
	//};
	
	//返回时关掉视频
	/*$(".toback").click(function(){
		daiLiShangRuHeZhaoMuWangLuoDianZhu.controls = false;
		ruHeShangJiWeiDaiLiShang.controls = false;
		ruHeZhuCeDengLuHeGouMai.controls = false;
		ruHeKaiDian.controls = false;
		ruHeTiXian.controls = false;
		ruHeTuiKuanTuiHuanHuo.controls = false;
		wangLuoDianZhuRuHeZhaoMuYongHu.controls = false;
		benDiDaiLiShangTianJiaBenDiShangPin.controls = false;
	});*/
	/*$(document).on("click","button.vjs-fullscreen-control",function(){
		$(this).parents(".vedioItem").find('video').enterFullScreen();
	});*/
	//返回个人中心页面并关闭视频
	function toBackClick(){
		daiLiShangRuHeZhaoMuWangLuoDianZhu.controls = false;
		ruHeShangJiWeiDaiLiShang.controls = false;
		ruHeZhuCeDengLuHeGouMai.controls = false;
		ruHeKaiDian.controls = false;
		ruHeTiXian.controls = false;
		ruHeTuiKuanTuiHuanHuo.controls = false;
		wangLuoDianZhuRuHeZhaoMuYongHu.controls = false;
		benDiDaiLiShangTianJiaBenDiShangPin.controls = false;
        personalCenter();
	};
	//视频控制:先获取视频然后遍历，最后判断正在播放的视频，如果有视频播放就点击关闭按钮
	/*$(document).on("click",".vjs-big-play-button",function(){
		$(".vItem").each(function(){
			if($(this).find("div.video-js").hasClass("vjs-playing")){
				$(this).find(".vjs-play-control").click();
			}
		})
		$('.vjs-big-play-button').off();
	});*/
//	$(document).on("click",".vjs-play-control",function(){
//		if($(this).parents(".vItem").find("div.video-js").hasClass("vjs-paused")){
//			var sib = $(this).parents(".vItem").siblings();
//			sib.each(function(){
//				if($(this).find("div.video-js").hasClass("vjs-playing")){
//					$(this).find(".vjs-big-play-button").click();
//				}
//			})
//		}
//	})
	/*$(document).on("click",".vjs-control-bar",function(){
		$(".vItem").each(function(){
			//alert($(".vjs-play-control").text());
			//if($(".vjs-play-control").text()=="PlayPlayPlay"){
			if($(this).find("div.video-js").hasClass("vjs-playing")){
				//alert($(".vjs-play-control").text());
				$(this).find(".vjs-play-control").click();
			}
		});
	})*/
	
	$("body").on("click",".vMsg",function(){
		event.stopPropagation()
		$(".msgBox").toggleClass("toggle");
		$(".mask").show();
		$(".vList").hide();
		//alert($("div.video-js.vjs-playing").length);
		//$(".vjs-play-control").click();
		//视频类型留言
		videoType = $(this).attr("data-value");
	})
	
	$("body").on("click",".mask",function(){
		$(".msgBox").toggleClass("toggle");
		$(".mask").hide();
		$(".vList").show();
	})
	
	$(".icoDown").click(function(){
		$(".msgBox").toggleClass("toggle");
		$(".mask").hide();
		$(".vList").show();
	});
	
	function showText(value){
		$(".mskMsg").show();
		$(".mskMsg .textAlign").text(value);
		setTimeout(function(){
			$(".mskMsg").hide();
		},1250)
	}
