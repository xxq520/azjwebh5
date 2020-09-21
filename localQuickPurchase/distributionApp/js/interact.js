var type = getQueryString("type");
if(type == null || type =='undefined'){
	type = 1;
}
var pageIndex = 1;
var pageSize = 10;
var  this_userswitch_userSeq;
$(function() {
	$('.userswitch').each(function() {
		var _this= this;
		this_userswitch = this ; 
		hui(_this).switchBox(['off', 'on'], function(res) {
			var userSeq =  $(_this).attr("data");
			
			$.ajax({
				url : "/localQuickPurchase/virtualShopAction/effectSaleTime",
				type : "post",
				data : {
					'seq':parseInt(userSeq),
					'manageSeq': seq,
					'effectSaleTime': res,
				},
				async : true,
				dataType : "json",
				success : function(result) {
					if(result.code != 200){
						
						if(result.code == 501){
							hui.toast(result.message);
						}else{
							hui.toast("操作失败");
						}
						//修改  switchBox组件的状态和 样式
						if(res) {
							$(_this).removeClass("hui-switch-on");
							$(_this).find("span").text("off");
						} else {
							$(_this).addClass("hui-switch-on");
							$(_this).find("span").text("on");
						}
					}
				},
			});
		});
	})
	
	$("#useredit").click(function() {
		if($(this).attr("data-state") == "edit") {
			$(this).html("取消");
			$(this).attr("data-state", "close");
			$('.userswitch').hide();
			$('.usercheckbox').show();
			$('#editbottom').show();
		} else if($(this).attr("data-state") == "close") {
			$(this).html("编辑");
			$(this).attr("data-state", "edit");
			$('.userswitch').show();
			$('.usercheckbox').hide().each(function() {
				$(this).find("input[name='usereidt']").attr("checked", false);
			});
			$('#editbottom').hide();
		}
	})
})

function initPage() {
	$(".sel-icon").on("click", function() {
		$(this).toggleClass("active");
	});
	initPicker();
}

//上拉加载更多
function getMore(){
	$.ajax({
		url : "/localQuickPurchase/virtualShopAction/findSalseTime",
		type : "post",
		data : {
			'bevaeringenSeq':seq,
			'pageIndex': pageIndex,
			'pageSize': pageSize,
			'type':type
		},
		async : false,
		dataType : "json",
		success : function(result) {
			var _html = "";
			if(result.code==200){
				var listMap = result.data.list;
				for(var i = 0;i<listMap.length;i++){
					_html += initHtml(listMap[i].virtualShop);
				}
				$(".userList").append(_html);
				if(result.data.hasNextPage){
					pageIndex++;
					hui.endLoadMore();
				}else{
					hui.endLoadMore(true, '没有更多了...');
					return;
				}
			}else{
				hui.toast(result.message);
			}
		},
		error : function(error) {
			
		}
		
	});
}
function hideWeek() {
	$(".layer").hide();
	$(".sel-week").css("transform", "translate3d(0,100%,0)");
}

function showWeek() {
	$(".layer").show();
	$(".sel-week").css("transform", "translate3d(0,0,0)");
}
//默认的禁止登陆日期
var  listWeekArray= ["周一"];
setCookie("installListWeek",JSON.stringify(listWeekArray),1);
function sureWeek() {
	var res = [];
	$(".sel-icon.active").each(function(i, t) {
		var txt = $(t).closest(".week-item").find(".week-txt").text();
		res.push(txt);
	})
	setCookie("installListWeek",JSON.stringify(res),1);
	if(res.length == 7) {
		$("#week-res").text("每天");
	} else {
		$("#week-res").text(res.join(" "));
	}
	hideWeek();
}

function showPopup() {
	var $selectedDate=$(".selected");
	if($selectedDate.length < 1){
		hui.toast("请选择目标用户");
		return;
	}else if($selectedDate.length == 1){
		var dataI = $selectedDate.eq(0).attr("data");
		$.ajax({
			type:'GET',
			dataType:'json',
			url:'/localQuickPurchase/virtualShopAction/findShopBySeq',
			data:{
				'seq' : parseInt(dataI)
			},
			async : true,
			success:function(result){
				if(result.code == 200  ){
					var data = result.data;
					//默认的禁止登陆日期
					var listWeekArray= data.virtualShop.listWeeks;
					var listSaleTimeArray= data.virtualShop.listSaleTime;
					if(listSaleTimeArray != null && listSaleTimeArray.length > 0){
						$(".sel-time-ul").html("");
						for(var i = 0; i < listSaleTimeArray.length; i++) {
							var saleTime = listSaleTimeArray[i];
							var  endTime = saleTime.endTime;
							var  startTime = saleTime.startTime;
							var  endTimeArr = endTime.split(":");
							var  startTimeArr = startTime.split(":");
							$(".sel-time-ul").append('<li class="sel-time sel-time'+i+'" style="overflow: hidden;" onclick="addIdfy(this)">' +
									'<span class="sHour">'+ startTimeArr[0] + '</span>:<span class="sMin">' +
									startTimeArr[1] + '</span> - <span class="eHour">'+ endTimeArr[0] +'</span>:<span class="eMin">' +
									endTimeArr[1] +'</span></li>');
							initPicker();
							$(".sel-time-ul").find(".sel-time" + i).slideDel(function(e) {
								e.stopPropagation();
								var $self = $(this);
								hui.confirm('您确认要这样做吗？', ['取消', '确定'], function() {
									$self.closest(".hui-wrap").find(".add-icon").css("visibility","visible");
									$self.closest("li").remove();
								}, function() {

								});
							})
						}
					}
					if(listSaleTimeArray.length >= 3){
						$(".add-icon").css("visibility","hidden");
					}else{
						$(".add-icon").css("visibility","visible");
					}
					if(listWeekArray != null && listWeekArray.length > 0){
						setCookie("installListWeek",JSON.stringify(listWeekArray),1);
						$(".week1").addClass("active");
						var listWeekStr = "";
						for(var i = 0; i < listWeekArray.length; i++) {
							var weekStr = listWeekArray[i]
							listWeekStr += weekStr+" ";
							if(weekStr === "周一"){
								$(".week1").addClass("active");
							}else if(weekStr === "周二"){
								$(".week2").addClass("active");
							}else if(weekStr === "周三"){
								$(".week3").addClass("active");
							}else if(weekStr === "周四"){
								$(".week4").addClass("active");
							}else if(weekStr === "周五"){
								$(".week5").addClass("active");
							}else if(weekStr === "周六"){
								$(".week6").addClass("active");
							}else if(weekStr === "周日"){
								$(".week7").addClass("active");
							}
						}
						$("#week-res").html(listWeekStr);
					}
				}
			}
		});
	}
	$(".popup").css("transform", "translate3d(0,0,0)");
}

function hidePopup() {
	$(".popup").css("transform", "translate3d(100%,0,0)");
}

function addTime() {
	if($(".hui-list ul li").length > 3){
		return ;
	}
	var _html = $('<li class="sel-time" style="overflow: hidden;" onclick="addIdfy(this)"><span class="sHour">00</span>:<span class="sMin">00</span> - <span class="eHour">00</span>:<span class="eMin">00</span></li>');
	$(".hui-list ul").append(_html);
	initPicker();
	_html.find(".sHour").parent(".sel-time").slideDel(function(e) {
		e.stopPropagation();
		var $self = $(this);
		hui.confirm('您确认要这样做吗？', ['取消', '确定'], function() {
			$self.closest(".hui-wrap").find(".add-icon").css("visibility","visible");
			$self.closest("li").remove();
		}, function() {

		});
	})
	_html.find(".slide-content").parent(".sel-time").trigger("click");
	
	//console.log(_html.find(".slide-content"));
	if($(".hui-list ul li").length == 3){
		$(".add-icon").css("visibility","hidden");
	}
	
}
$(".sel-time").on("click", function() {
	$(this).addClass("current-sel");
})
//移除限时登录时间段
$(".hui-list li").slideDel(function(e) {
	e.stopPropagation();
	var $self = $(this);
	hui.confirm('您确认要这样做吗？', ['取消', '确定'], function() {
		$self.closest("li").remove();
		$self.parents(".hui-wrap").find(".add-icon").css("visibility","visible");
	}, function() {

	});
});

function initPicker() {
	$(".hui-picker").remove();
	/* 时间选择器 非关联型绑定 */
	var picker1 = new huiPicker('.sel-time', function() {
		console.log(this);
		var sH = picker1.getVal(0);
		var sM = picker1.getVal(1);
		var eH = picker1.getVal(2);
		var eM = picker1.getVal(3);
		if(parseInt(sH) > parseInt(eH)) {
			hui.toast("开始时间不能大于结束时间");
			$(".layer").hide();
			$(".current-sel").remove();
			return;
		}
		if(parseInt(sH) > parseInt(eH)) {
			if(parseInt(sM) > parseInt(eM)) {
				hui.toast("开始时间不能大于结束时间");
				$(".layer").hide();
				$(".current-sel").remove();
				//$(".current-sel").removeClass("current-sel");
				return;
			}
		}
		$(".current-sel").find(".sHour").text(sH);
		$(".current-sel").find(".sMin").text(sM);
		$(".current-sel").find(".eHour").text(eH);
		$(".current-sel").find(".eMin").text(eM);
		$(".current-sel").removeClass("current-sel");
		$(".layer").hide();
	});
	picker1.level = 4;
	//年份
	var hour = new Array();
	for(var i = 0; i <= 23; i++) {
		var tt = i < 10 ? "0" + i : i;
		hour.push({
			value: tt,
			text: tt
		});
	}
	picker1.bindData(0, hour);
	//月份
	var min = new Array();
	for(var i = 0; i <= 59; i++) {
		if(i < 10) {
			i = '0' + i;
		}
		min.push({
			value: i,
			text: i
		});
	}
	picker1.bindData(1, min);
	picker1.bindData(2, hour);
	picker1.bindData(3, min);
	$(".hui-fl").on("click", function() {
		$(".current-sel").removeClass("current-sel");
		$(".layer").hide();
	});
}

//添加时间选择标识
function addIdfy(o) {
	o.classList.add("current-sel");
	$(".layer").show();
}

//条件限制登录的时间的限制
$(".sure-time").on("click", function() {

	data = [];
	var $lis_content = $(".sel-time-ul").find(".slide-content");
	console.log($lis);
	for(var k=0;k<$lis_content.length;k++){
		var $lis = $lis_content.eq(k);
		var evaOrder ={};
		evaOrder.startTime = $lis.children(".sHour").text()+":"+ $lis.children(".sMin").text();
		evaOrder.endTime =$lis.children(".eHour").text()+":"+ $lis.children(".eMin").text();
		if((evaOrder.startTime == null || evaOrder.startTime == "" ) 
				|| ( evaOrder.endTime == null || evaOrder.endTime == "")){
			hui.toast("开始时间或结束时间为空!!");
			return false;
		}
		//if(evaOrder.startTime>evaOrder.endTime){
		if(parseInt($lis.eq(k).children(".sHour").text()) > parseInt($lis.eq(k).children(".eHour").text())){
			hui.toast("开始时间不能大于结束时间!!");
			return false;
		}else if(parseInt($lis.eq(k).children(".sHour").text()) == parseInt($lis.eq(k).children(".eHour").text())){
			if(parseInt($lis.eq(k).children(".sMin").text()) > parseInt($lis.eq(k).children(".eMin").text())){
				hui.toast("开始时间不能大于结束时间!!");
				return false;
			}
		}
		data.push(evaOrder);
	}
	data.sort(function(a, b){  
	    return a < b ? 1 : -1;  
	});
	if(data.length == 0){
		hui.toast("请选择重复时间");
		return;
	}
	for(var i=1;i<data.length;i++){
		var startTime=data[i].startTime; 
		var endTime=data[i].endTime;
		var startTime1=data[i-1].startTime; 
		var endTime1=data[i-1].endTime;
		if(startTime == startTime1 &&  endTime == endTime1){
			hui.toast("开始时间结束时间相同了!!");
			return;
		}
		if(!((startTime<startTime1||startTime1<endTime)||(startTime<endTime1||endTime1<endTime))){
			hui.toast("输入的时间规则不符合要求!!");
			return;
		}
	}
	//console.log(data);
	var listDistributorSeq = [];
	var $selectedDate=$(".selected");
	for(var i=0;i<$selectedDate.length;i++){
		var dataI = $selectedDate.eq(i).attr("data");
		listDistributorSeq.push(parseInt(dataI));
	}
	if(listDistributorSeq.length == 0){
		hui.toast("请选择目标用户");
		return;
	}
	var listWeeks = getCookie("installListWeek");
	if(listWeeks != ""){
		listWeeks = JSON.parse(listWeeks);
		if(listWeeks.length == 0){	
			hui.toast("请选择重复日期");
			return;
		}
	}else{
		hui.toast("请选择重复日期");
		return;
	}
	var obj={};
	obj.adminSeq = seq;
	obj.listSalesTime = data;
	obj.listWeeks = listWeeks;
	obj.type = type;
	if(type == 2){
		obj.listMasterSeq = listDistributorSeq;
	}else{
		obj.listDistributorSeq = listDistributorSeq;
		
	}
	hui.confirm('您确认要这样做吗？', ['取消','确定'], function(){
		$.ajax({
			url : "/localQuickPurchase/virtualShopAction/addSalseTime",
			type : "post",
			contentType: "application/json;charset=utf-8",
			data : JSON.stringify(obj),
			async : false,
			dataType : "json",
			success : function(result) {
				if(result.code==200){
					if(result.data >0){
						hui.toast("操作成功!");
						window.location.reload();
					}else{
						hui.toast("操作失败!");
					}
					/* setTimeout(function(){
						location.href="waitapply.jsp";
					},1000); */
				}
				else{
					hui.toast(result.message);
				}
			},
			error : function(error) {
				
			}
		}); 
    },function(){
    
    });
	
});

function initHtml(virtualShop){
	if(virtualShop == null){
		return "";
	}
	var listSaleTime = virtualShop.listSaleTime;
	var listWeeks = virtualShop.listWeeks;
	var _html = "";
	//设置限制时间登录的
	_html = '<div class="listItem">'+
	'<div class="userface"><img src="' + virtualShop.storeHeadImg + '" onerror="this.src=\'/localQuickPurchase/distributionApp/images/head.png\'"></div>'+
	'<div class="userinfo">' +
	'<p class="infoname">用 户 名：' + (virtualShop.nickName != null ? virtualShop.nickName:virtualShop.mobile) + '</p>' +
	'<p class="inforestime">注册日期：' +( virtualShop.regiterTime == null?'':(new Date(virtualShop.regiterTime).Format("yyyy-MM-dd"))) + '</p>';
	if(listSaleTime != null){
		var listSaleTimesStr = "";
		if(listSaleTime.length == 0){
			listSaleTimesStr = "未设置";
		}else{
			for(var i= 0; i< listSaleTime.length; i++){
				listSaleTimesStr += listSaleTime[i].startTime +"-"+ listSaleTime[i].endTime+"   ";
			}
		}
		var  listWeeksStr = "";
		if(listWeeks != null && listWeeks.length > 0){
			for(var i= 0; i< listWeeks.length; i++){
				listWeeksStr += listWeeks[i];
				if(i < listWeeks.length-1){
					listWeeksStr += "、";
				}
			}
		}else{
			listWeeksStr = "未设置"
		}
		_html += '<p class="infoperiod">限制时段：' + listSaleTimesStr + '</p>' +
		'<p class="infoperiod">重复日期：' + listWeeksStr + '</p>' +
		'</div>' ;
	//未设置限制时间登录的
	}else{
		_html += '<p class="infoperiod">限制时段：未设置</p>' +
		'<p class="infoperiod">重复日期：未设置</p>' +
		'</div>' ;
	}
	if(virtualShop.effectSaleTime == null || !virtualShop.effectSaleTime){
		//不生效的限制时间登录
		_html += '<div class="hui-switch userswitch" data="'+ virtualShop.seq +'"><span data="'+ virtualShop.seq +'">off</span><div class="hui-switch-in"></div></div>' ;
	}else{
		_html += '<div class="hui-switch userswitch  hui-switch-on" data="'+ virtualShop.seq +'"><span data="'+ virtualShop.seq +'">on</span><div class="hui-switch-in"></div></div>' ;
	}
	_html += '<div class="usercheckbox"><label class="checklabel"><i class="checkboxico" onclick="checkboxicoSelect(this);" data="'+ virtualShop.seq +'"></i></label></div>'+
	'</div>';
	return _html;
}

