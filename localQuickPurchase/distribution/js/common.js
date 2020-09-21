/* 重定义下拉加载列表中点击跳转和点击事件的触发，
 * url或者调用的方法写在class为mui-tab-item的元素的target属性内
 * 例如： <div class='mui-tab-link' target='www.baidu.com'><div>
 *      <div class='mui-tab-method' onclick='javascript:add();'><div>
 */
//mui('body').on('tap','a',function(){window.top.location.href=this.href;});
var stimeA; // 账户明细开始时间
var etimeA;	// 账户明细结束时间
// 登录的用户类型（1 普通用户，2 分销商，3 线下服务中心，4 成为分销商的线下服务中心）
var distributorType = getCookie("distributorType");
/*获取url参数*/
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }else{
        return "";
    }
}

$("a#back").on('click', function() {
	history.back();
});

function loading(flag){
	debugger;
	if(flag === true){
		if(document.getElementById("loading").length > 0){
			document.getElementById("loading").style="display:block;";
		}else{
			var _html = '<div id="loading" class="loading">'+
							'<div class="loading-content">'+
								'<img src="img/Spinner.gif"/>'+
						'</div></div>';
			$("body").append(_html);
			document.getElementById("loading").style="display:block;";
		}
	}else{
		document.getElementById("loading").style="display:none;";
	}
}

/*日期控件示例*/

/*判断开始结束日期*/
function judgeDate(stime,etime){
 	var d1 = new Date(stime.replace(/\-/g, "\/"));    
 	var d2 = new Date(etime.replace(/\-/g, "\/"));
	if(stime!="" && etime!="" && d1>d2){
		return false;
	}
}

/*日期控件*/
(function($) {
	/*账户明细日期选择*/
	$("#detailForm .datebtn").each(function(i, btn) {
		btn.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				$('#'+id)[0].value=rs.text;
				stimeA = $('#stardate')[0].value;
				etimeA = $('#enddate')[0].value;
				console.log(stimeA+" | "+etimeA);
				var datestate = judgeDate(stimeA,etimeA);
				//console.log(datestate);
				if(datestate==false){
					mui.toast('开始时间不能大于结束时间!',{ duration:'long', type:'div' });
					$('#'+id)[0].value="";
					return false;
				}else{
					picker.dispose();
					if (etimeA == "" || stimeA == "") {
						return;
					}
					// console.log(globalpagenum);
					globalpagenum = 1; // 重置页码
					var code = initOrders2(true, globalpagenum, stimeA, etimeA, true);
					if (code == 200) {
						globalpagenum++;
					}
					// alert("开始请求!");
				}
			});
		}, false);
	});
	/*个人业绩日期选择*/
	$("#resultsForm .datebtn").each(function(i, btn) {
		btn.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				$('#'+id)[0].value=rs.text;
				var stime = $('#stardate')[0].value;
				var etime = $('#enddate')[0].value;
				console.log(stime+" | "+etime);
				var datestate = judgeDate(stime,etime);
				console.log(datestate);
				if(datestate==false){
					mui.toast('开始时间不能大于结束时间',{ duration:'long', type:'div' });
					$('#'+id)[0].value="";
					return false;
				}else{
					picker.dispose();
				}
			});
		}, false);
	});
})(mui);


function getCookie(cookName){  
    if(document.cookie.length>0){  
        var c_start = document.cookie.indexOf(cookName + "=");  
        if(c_start!=-1){ //存在  
        	if(c_start == 0){
        		c_start = c_start + cookName.length + 1; //"history="后的开始位置  
                var c_end=document.cookie.indexOf(";",c_start); //找到JSESSIONID在的位置  
                if (c_end==-1){ //JSESSIONID不存在  
                    c_end=document.cookie.length;  
                }  
                return unescape(document.cookie.substring(c_start,c_end));
        	} else{
        		c_start = document.cookie.indexOf("; "+cookName + "=");
        		if(c_start!=-1){ //存在  
        			c_start = c_start + cookName.length + 3; //"history="后的开始位置  
                    var c_end=document.cookie.indexOf(";",c_start); //找到JSESSIONID在的位置  
                    if (c_end==-1){ //JSESSIONID不存在  
                        c_end=document.cookie.length;  
                    }  
                    return unescape(document.cookie.substring(c_start,c_end)); 
                }
        	}
              
        }   
    }  
    return "";  
};  

function setCookie(cookName,cookValue,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays*24*3600*1000);
    var cookieVal = cookName+ "="+escape(cookValue)
    	+((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    	+";path=/";
    var hostname = window.location.hostname;
    if(hostname.indexOf("520shq.com")>0){
    	cookieVal += ";domain=.520shq.com";
    }
    
    document.cookie=cookieVal;
};

var _content = "/localQuickPurchase";
var userName = getCookie("userName");

var lat = getCookie("a-lat");
var lng = getCookie("a-lng");


//获取当前位置信息
function getPosition() {
	var position ={};
	position.lng = getCookie("a-lng");
	position.lat = getCookie("a-lat");
	position.address = getCookie("a-address");
	
	position.isEmpty = function(){
		if(this.lng ==""||this.lat ==""){
			return true;
		}
		return false;
	};
	return position;
}


var userInfo = getCookie("userInfo");
var userSeq=0;
var FW="";
var distributorType=getCookie("distributorType");
var my_jspUrl=getMyJspUrl();
function getMyJspUrl(){
	if(distributorType=="2"){//分销商
		return "/localQuickPurchase/distribution/html/personalCenter/centerIndex.jsp";
	}else if(distributorType=="3"){//线下服务中心
		return "/localQuickPurchase/distribution/html/personalCenter/myAuthors.jsp";
	}else if(distributorType=="4"){//线下服务中心和分销商
		return "/localQuickPurchase/distribution/html/personalCenter/myAuthors.jsp";
	}else if(distributorType=="1"){//普通用户的
		return "/localQuickPurchase/distribution/html/personalCenter/myCommon.jsp";
	}else{
		return "/localQuickPurchase/distribution/html/login.jsp";
	}
}
function judgeMyJspUrl(mun){
	if(mun=="2"){//分销商
		return "/distribution/html/personalCenter/centerIndex.jsp";
	}else if(mun=="3"){//线下服务中心
		return "/distribution/html/personalCenter/myAuthors.jsp";
	}else if(mun=="4"){//线下服务中心和分销商
		return "/distribution/html/personalCenter/myAuthors.jsp";
	}else if(mun=="1"){//普通用户的
		return "/distribution/html/personalCenter/myCommon.jsp";
	}else{
		return ""
	}
}

if(userInfo!=""){
	var seqStart = userInfo.indexOf("SEQ=");
	if(seqStart != -1){ //存在  
		seqStart = seqStart + 4;
		var seqEnd=userInfo.indexOf("&",seqStart);
		userSeq = parseInt(userInfo.substring(seqStart, seqEnd));
	}
	// 获取FW
	var FWStart = userInfo.indexOf("FW=");
	if(FWStart != -1){ //存在  
		FWStart = FWStart + 3;
		var FWEnd=userInfo.indexOf("&",FWStart);
		FW = userInfo.substring(FWStart, FWEnd);
  }
}

function Format(now,mask)
{
    var d = now;
    var zeroize = function (value, length)
    {
        if (!length) length = 2;
        value = String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++)
        {
            zeros += '0';
        }
        return zeros + value;
    };
 
    return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0)
    {
        switch ($0)
        {
            case 'd': return d.getDate();
            case 'dd': return zeroize(d.getDate());
            case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
            case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            case 'M': return d.getMonth() + 1;
            case 'MM': return zeroize(d.getMonth() + 1);
            case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
            case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
            case 'yy': return String(d.getFullYear()).substr(2);
            case 'yyyy': return d.getFullYear();
            case 'h': return d.getHours() % 12 || 12;
            case 'hh': return zeroize(d.getHours() % 12 || 12);
            case 'H': return d.getHours();
            case 'HH': return zeroize(d.getHours());
            case 'm': return d.getMinutes();
            case 'mm': return zeroize(d.getMinutes());
            case 's': return d.getSeconds();
            case 'ss': return zeroize(d.getSeconds());
            case 'l': return zeroize(d.getMilliseconds(), 3);
            case 'L': var m = d.getMilliseconds();
                if (m > 99) m = Math.round(m / 10);
                return zeroize(m);
            case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z': return d.toUTCString().match(/[A-Z]+$/);
            // Return quoted strings with the surrounding quotes removed
            default: return $0.substr(1, $0.length - 2);
        }
    });
};

mui('body').on('tap','.alink',function(){document.location.href = this.getAttribute("href");});
//mui('.mui-add-list').on('tap','.mui-tab-item',function(){document.location.href = this.getAttribute("target");});
//mui('body').on('tap','.alink',function(){document.location.href = this.getAttribute("href");});
//mui('body').on('tap','a',function(){window.top.location.href=this.href;});

// 个人中心页面
$("#usertel").html(userName.substring(0,3)+"****"+userName.substring(userName.length-4,userName.length));
$(function(){
	$.ajax({
		url:"/localQuickPurchase/shopper/findShopperBySeq",
		type:"POST",
		data:{
			seq: userSeq
		},
		async:false,
		dataType:"json",
		success:function(data){
			var shopper = data.data.shopper;
			if(null != shopper){
				var userName = shopper.userName;
				var mobile = shopper.mobile;
				var imgUrl =getCookie("headImg"+userSeq)
				if(imgUrl==""){
					setTimeout(function () {
						// f1的任务代码
						getHeadUrl();
					}, 1);
				}
				$("#username").html(userName);
				$("#usertel").html(mobile);
				$(".userface").html('<img id="headImg"  src="'+imgUrl+'" onerror="this.src=\'../../img/head.png\'"/>');
				var platform=getCookie("platform");
				if(!(platform==="app")){
					var loginList = '<div class="userinfo" id="loginOut"><a href="#" class="login-out">退出登录</a></div>';
					$(".centerinfo").append(loginList);
				}
			}
		},
		error:function(error){
			$.alert("网络错误");
		}
	})
	
});
//分销商操作手册页面跳转
/*function getVideoUrlOfSeq(parameter){
	var seq = userSeq;
window.location.href = "/localQuickPurchase/distribution/vedio/index.jsp?roleVideoId="+parameter+"&seq="+seq;
}*/
function getHeadUrl(){
	$.ajax({
		url:"/localQuickPurchase/getcddata/getHeadUrl",
		type:"POST",
		data:{
			seq: userSeq
		},
		async:true,
		dataType:"json",
		success:function(data){
			if(data.code==200){
				if(data.data==""){
					setCookie("headImg",-1,1);
					setCookie("headName",-1,1);
				}else{
					setCookie("headImg",data.data.url,1);
					setCookie("headName",data.data.name,1);
				}
				
				$("#headImg").attr("src",data.data.url);
			}
		},
		error:function(error){
			//$.alert("网络错误");
		}
	})
}
//去登录
mui("body").on("tap",".login-out",function(){
	setCookie("userInfo","",-1);
	setCookie("userName","",-1);
	setCookie("serverFanWei","",-1);
	setCookie("loginFrom","",-1);
	setCookie("headImg"+userSeq,"",-1);
	window.location.href = "/localQuickPurchase/distribution/html/login.jsp";
});

mui("body").on("tap",".goCenter",function(){
	var url = "/localQuickPurchase/distribution/html/personalCenter/";
	// 登录的用户类型（1 普通用户，2 分销商，3 线下服务中心，4 成为分销商的线下服务中心）
	if (isRoleConsumer() || isRoleVip()) {
		url += "myCommon.jsp";
	} else if (isRoleAgent()) {
		url += "centerIndex.jsp";
	} else if (isRoleDealer() || distributorType == 4) {
		url += "myAuthors.jsp";
	}
	window.location.href = url;
});
// 个人中心的返回键（给 app调用）
var returnAppBtn = getCookie("platform");
if(!(returnAppBtn == "app")){
	var testList = '<div class="centerinfo"><div class="userface"><img src="../../img/face.png" /></div>'+
		'<div class="userinfo" id="username"></div>'+
		'<div class="userinfo">手机号：<span id="usertel"></span></div></div>';
	$(".returnAppBtn").html(testList);
}
mui("body").on("tap",".distributionToBack",function(){
	setCookie("headImg",-1,1);
	setCookie("headName",-1,1);
	window.location.href = "distributorCenter/back";
});

//个人订单和分销订单点击事件
mui('body').on('tap','.cutOrder',function(){
	//console.log($(this).attr("id"));
	/*var className = $(this).attr("class");
	if($(this).hasClass("active"))
		return ;
	$($(this)).each(function() {
		$(this).removeClass('active');
	});
	
	$(this).addClass("active");*/
	var id = $(this).attr("id");
	if (id == "0") {
		//console.log("0");
		return window.location.href = "myOrders.jsp";
	} else if(id == "1") {
		//获取订单跳转路径
		var ordersHrefType = getOrdersHref(distributorType);
		if (ordersHrefType != "") {
			return window.location.href = ordersHrefType;
		}
	}
});

//我的订单点击事件
mui('body').on('tap','.goOrders',function(){
	//alert("A");
	//获取订单跳转路径
	var ordersHrefType = getOrdersHref(distributorType);
	if (ordersHrefType != "") {
		return window.location.href = ordersHrefType;
	}
});

//获取订单跳转路径
function getOrdersHref(distributorType) {
	var ordersHref = "/localQuickPurchase/distribution/html/";
	if (isRoleDealer()) {
		ordersHref += "ordersS.jsp";
	} else if (isRoleAgent()) {
		ordersHref += "ordersD.jsp";
	} else if (isRoleConsumer() || isRoleVip()) {
		ordersHref += "myOrders.jsp";
	} else {
		ordersHref = "";
	}
	return ordersHref;
}

// 判断是否登录，没登录的话话跳到登录页面
if (location.href.indexOf("/distribution/html/goodsDetail.jsp")>0
		||location.href.indexOf("/distribution/html/login.jsp")>0
		||location.href.indexOf("/distribution/html/loginTest.jsp")>0
		||location.href.indexOf("favoritesList.jsp")>0
		||location.href.indexOf("shareFavorites.jsp")>0) {
	
} else {
	if(userSeq==0){
		location.href="/localQuickPurchase/distribution/html/login.jsp"
	}
}

// 订单返回错误提示信息
function muiAlert(message) {
	if (message != null && message != "") {
		mui.toast(message);
	} else {
		mui.toast("操作失败,请稍后再试!");
	}
}

function isDistributor(){
	var isDistributor;
	$.ajax({
		url:"/localQuickPurchase/dApplicationAction/isDistributor",
		type:"POST",
		data:{
			seq: userSeq
		},
		async:false,
		dataType:"json",
		success:function(data){
			if(data.code==200){
				isDistributor = data.data;	
			}
		},
		error:function(error){
			//$.alert("网络错误");
		}
	})
	return isDistributor;
}

//商品详情
function findGoodsDetails(goodsId){
	location.href = "/localQuickPurchase/distribution/html/gdetail.jsp?goodsId="+goodsId;
}




