/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}

		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));


var _content = "/localQuickPurchase";
var lat = getCookie("a-lat");
var lng = getCookie("a-lng");

//获取url上的某个参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

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

$(function () {
	//, headers: { 'x-requested-with': 'XMLHttpRequest' }
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
});
//返回订单状态
function orderStatus(status){
	if(status==1){
		return '待接单';
	}else if(status==2){
		return '已取消';
	}else if(status==3){
		return '已拒绝';
	}else if(status==4){
		return '已接单';
	}else if(status==5){
		return '已完成';
	}
}

function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    //second = second < 10 ? ('0' + second) : second;
    // return y + '-' + m + '-' + d+'  '+h+':'+minute+':'+second;
    //return y + '-' + m + '-' + d+' &nbsp;'+h+':'+minute; 有時間
    return y + '.' + m + '.' + d + " " + h + ":" + minute ;  //沒有時間
};
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function getLoationName(){
	var geoc = new BMap.Geocoder();
    var point = new BMap.Point(getCookie("a-lng"),getCookie("a-lat"));
	geoc.getLocation(point, function(rs){
		var addComp = rs.addressComponents;
		if($(".city-name").length>0){
			$(".city-name").html("<i class='location font-ico'>&#xed3b;</i>"+addComp.city + addComp.district + addComp.street + addComp.streetNumber+"<i class='down-ico font-ico'>&#xf0dd;</i>")
		}
	});
}
function getLocat(callback){
	var lng=getCookie("a-lng");
	var lat=getCookie("a-lat");
	if(lng==""||lat==""){
	    var geolocation = new BMap.Geolocation();
	    geolocation.getCurrentPosition(function(r){
	        if(this.getStatus() == BMAP_STATUS_SUCCESS){
				setCookie("a-lng",r.point.lng,1);
				setCookie("a-lat",r.point.lat,1);
				getLoationName()
				callback();
	        }
	        else {
	            alert('failed'+this.getStatus());
	        }        
	    },{enableHighAccuracy: true});
	}else{
		getLoationName()
		callback();
	}
}
function getDistance(i){
    if(i > 0 && i < 1000){
        return i.toFixed(0) + '米';
    }else{
        return (i/1000).toFixed(2) + '千米';
    }
}

function indexPath() {
	window.location.href = "/localQuickPurchase/generalStore/html/index.jsp"; 
}

//判断是否是直辖市
function judgeCity(tipCity){
	if (tipCity.indexOf("北京") != -1 || tipCity.indexOf("天津") != -1 || tipCity.indexOf("重庆") != -1 || tipCity.indexOf("上海") != -1) {
		tipCity = "";
	}
	return tipCity;
}
