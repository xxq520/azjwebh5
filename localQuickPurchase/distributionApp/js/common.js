/*外网域名配置*/

/*内网域名配置*/

/**
 * 获取url参数
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null){
        return decodeURI(decodeURI(r[2]));
    }
    return null;
}
//登录的用户类型（1 普通用户,2 代理商,3 线下服务中心
var distributorType = getCookie("distributorType");
//1：普通经销商，2：企业级经销商
var enterpriseAgent = getCookie("enterpriseAgent");
var userName = getCookie("userName");
var mydSeq = getCookie("mydSeq");
var isFirst =getCookie("isFirst");
var serverFanWei =getCookie("serverFanWei");
var mobileValue = getCookie("mobile");
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
    //exdate.setTime(exdate.getTime() + 60 * 1000);//过期时间 1分钟
    var cookieVal = cookName+ "="+escape(cookValue)
        +((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
        +";path=/";
    document.cookie=cookieVal;
    var hostname = window.location.hostname;
    if(hostname.indexOf("520shq.com")>0){
        cookieVal += ";domain=.520shq.com";
    }

    document.cookie=cookieVal;
};

function loginOffByBack(){
    setCookie("userName","",-1);
    //setCookie("userType","",-1);
    setCookie("serverFanWei","",-1);
    setCookie("seq","",-1);
    //setCookie("loginOff","back",30);
    setCookie("distributorType","",30);
    setCookie("consumer","",-1);
    setCookie("userInfo","",-1);
    setCookie("headImg","",-1);
    setCookie("headName","",-1);
    setCookie("mydSeq","",-1);
    setCookie("userGoodsHistory","",-1);
    setCookie("comboType","",-1);
    setCookie("isseq","",-1);
    setCookie("serverLevel","",-1);
    setCookie("nickName","",-1);
    setCookie("forbidden","",-1);
    setCookie("loginOff","",-1);
    setCookie("JSESSIONID","",-1);
    setCookie("shippingAddress","",-1);
    setCookie("mobile","",-1);
    try{
        $.cookie('shippingAddress', '', { expires: -1, path: '/' });
    }catch(e){
    }
    //限制登录的日期   30分钟
    setCookie("listWeeks","",-1);
    //限制登录的时间段  30分钟
    setCookie("listSaleTime","",-1);
    //warrant 是否显示某个页面
    setCookie("flagAlertLogout", "", -1);
    setCookie("flagLogout", "", -1);
    setCookie("flagLogoutDate", "", -1);
    setCookie("warrant","",-1);
    setCookie("investmentAccounts","",-1);//现场招商封装数据rediesKey
    setCookie("investmentSeq","",-1);//现场招商商家的seq
    setCookie("loginRetrunUrl","",-1);//现场招商usr路径
    setCookie("isAdd", "", -1);
    setCookie("shareSeq","",-1);
    setCookie("goodsLocalItems","",-1); //按多规格统计购物车商品数量
    setCookie("enterpriseAgent","",-1); //企业用户的角色

    // 判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        // 退出登录后给app调用方法
        window.action.loginOut();
    }
    //window.location.href="login1.jsp";
}

function setHistory(address,city,point){
    var stringCookie=getCookie('history');
    var list = stringCookie.split(",");
    var e=address+"|"+city+"|"+point;
    for (var i = 0; i < list.length; i++) {
        var add = list[i].split("|");
        try {
            if(add[0] == address){
                list.splice(i,1); //删除重复数据，开始位置,删除个数
                i=i-1; //下标归位
            }
        } catch (e) {
            break;
        }
    }

    if(list.length>=historyCount){
        //删除最开始的多余记录
        var count = list.length - historyCount + 1; //需要删除的个数
        list.splice(0,count); //开始位置,删除个数
    }

    list.push(e);//添加一个新的记录

    setCookie('history',list.toString(),30); //30天
};

function getHistory(){
    var historyJSON=getCookie('history');
    //console.log(historyJSON);
    if(historyJSON==""){

    }else{
        //var data = eval("("+historyJSON+")");
        var history = historyJSON.split(",");
        var length = history.length;
        if(length > historyCount){
            length = historyCount;
        }
        //从最后一个浏览记录开始获取
        var historyHtml="";
        for ( var i = length-1; i > 0; i--) {
            var text = history[i].split("|");
            if(i == length-1){
                //getPoint(text[0],text[1]);
            }
            historyHtml+=
                '<li class="downBox-li">'+
                '<div class="downBox-address" value="'+text[1]+'">'+text[0]+'</div>'+
                '<input type="hidden" class="downBox-point" value="'+text[2]+'"/>'+
                '</li>';
        }

        if(historyHtml!=""){
            $(".downBox ul").html(historyHtml);
        }
    }
};
//获取cookie值
function getUserInfoText(searchName){
    if("" != userInfo){
        var start = userInfo.indexOf(searchName+"=");
        if(start != -1){ //存在
            start = start + searchName.length+1;
            var end=userInfo.indexOf("&",start);
            var textValue = userInfo.substring(start, end);
            return textValue;
        }

        return "";
    }

    return "";
}
//通过seq登录
function loginBySeq(){
    $.ajax({
        type : "post",
        url : "/localQuickPurchase/shopMongo/loginBySeq",
        dataType : "json",
        data : {
            seq : seq
        },
        async : false,
        success : function(data) {
            var code = data.code;
            if(code == 200){

            } else{

            }
        },
        error:function(){}
    });
}
//获取登录后的userInfo
var nickName = getCookie("nickName");
var userInfo = getCookie("userInfo");
var serverFanWei = getCookie("serverFanWei");
var userName = getCookie("userName");
var seq = getCookie("seq");
var userType = "";
var FW = "";
var UT = "";
// if("" != userInfo){
//     // 获取seq
//     seq = getUserInfoText("SEQ",userInfo);
//     // 获取 userName（mobile）
//     userName = getUserInfoText("mobile",userInfo);
//     // 获取userType
//     userType = getUserInfoText("UT",userInfo);
//     // 获取FW
//     FW = getUserInfoText("FW",userInfo);
//     // 获取UT
//     UT = getUserInfoText("UT",userInfo);
//     /* 判断是否是主站那边登录,是的话重新登录一次 */
//     var seqFormCookie = getCookie("seq");
//     if(seq != seqFormCookie){
//         loginBySeq();
//     }
// } else{
//     setCookie("userName","",-1);
//     setCookie("seq","",-1);
//     setCookie("distributorType","",-1);
//     // 防止登录成功后跳转到未登录时保存的loginRetrunUrl路径
//     var nowHref = window.location.href;
//     if(nowHref.indexOf("login") < 0 && nowHref.indexOf("Login") < 0){
//         setCookie("loginRetrunUrl","",-1);
//     }
// }
seq = parseInt(seq);
// if(userName == "" || seq == ""){
//     setCookie("userName","",-1);
//     setCookie("seq","",-1);
//     setCookie("distributorType","",-1);
//
//     var urlFaest=window.location.href;
//     // 防止登录成功后跳转到未登录时保存的loginRetrunUrl路径
//     if(nowHref.indexOf("login") < 0 && nowHref.indexOf("Login") < 0){
//         setCookie("loginRetrunUrl","",-1);
//     }
//
//     var str=urlFaest.split("jspback");
//     if(str.length==2){
//         //window.location.href = "login1.jsp";
//     }
// } else{
//     setCookie("userName",userName,30);
//     setCookie("seq",seq,30);
// }

/*var serverLevel = "";
var isseq=getCookie("isseq");
if(seq!=0&&isseq!=seq){
	serverLevel = getCookie("serverLevel");
	if(FW=="99"){
			 $.ajax({
				    async: false,
				    type: "GET",
				    dataType: 'json',
				    url: "/localQuickPurchase/shopMongo/getServiceLevel?seq="+seq ,
				    data: "",
				    contentType: "application/json;utf-8",
				    success: function(data) {
				    	if(data.code==200){
				    		setCookie("serverLevel",data.data,30);
	             			setCookie("isseq",seq,30);
	             			serverLevel=data.data;
	             			isseq=seq;
	             			//console.log(data.data.serviceType);
	             			//console.log(data.data);
				    	}
				    }
				  });
		}

}*/

function getDistance(i){
    if(i > 0 && i < 1000){
        return i.toFixed(0) + '米';
    }else{
        return (i/1000).toFixed(2) + '公里';
    }
};

//根据两点的经纬度算距离，单位米
var EARTH_RADIUS = 6378137.0;    // 单位M
var PI = Math.PI;
function getRad(d){
    return d*PI/180.0;
}
//获取2点间的距离
function getGreatCircleDistance(lat1,lng1,lat2,lng2){
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);

    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);

    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*EARTH_RADIUS;
    s = Math.round(s*10000)/10000.0;

    return getDistance(s);
};
/*获取当前日期*/
function getCurrentDateTime() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var week = d.getDay();
    /*时分秒*/
    /*var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var ms = d.getMilliseconds();*/
    var curDateTime = year;
    if (month > 9)
        curDateTime = curDateTime + "年" + month;
    else
        curDateTime = curDateTime + "年0" + month;
    if (date > 9)
        curDateTime = curDateTime + "月" + date + "日";
    else
        curDateTime = curDateTime + "月0" + date + "日";
    /*if (hours > 9)
        curDateTime = curDateTime + " " + hours;
    else
        curDateTime = curDateTime + " 0" + hours;
    if (minutes > 9)
        curDateTime = curDateTime + ":" + minutes;
    else
        curDateTime = curDateTime + ":0" + minutes;
    if (seconds > 9)
        curDateTime = curDateTime + ":" + seconds;
    else
        curDateTime = curDateTime + ":0" + seconds;*/
    var weekday = "";
    if (week == 0)
        weekday = "星期日";
    else if (week == 1)
        weekday = "星期一";
    else if (week == 2)
        weekday = "星期二";
    else if (week == 3)
        weekday = "星期三";
    else if (week == 4)
        weekday = "星期四";
    else if (week == 5)
        weekday = "星期五";
    else if (week == 6)
        weekday = "星期六";
    curDateTime = curDateTime + " " + weekday;
    return curDateTime;
}

/*时间日期格式化*/
function formatDateTime_(inputTime) {
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
    second = second < 10 ? ('0' + second) : second;
    //second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d;
    // return y + '-' + m + '-' + d+' &nbsp;'+h+':'+minute;// 有時間

    // return y + '-' + m + '-' + d ;  //沒有時間
};

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/*获取多少天后的时间   time:时间 day：天数*/
function fun_date(time,day){
    var date2 = new Date(time);
    var time2 = date2.setDate(date2.getDate()+day);
    return time2;
}

//将时间转换成时间戳
function changeToData(date1){
    var date = new Date(date1);
    return date.getTime();
}

//获取当天时间的时间戳
function getToData(){
    var date = new Date();
    return date.getTime();
}

//传入时间，返回时分
function AccordingTime(imputTime){
    //day = Math.floor(imputTime / (60 * 60 * 24));
    //hour = Math.floor(imputTime / (60 * 60)) - (day * 24);
    // minute = Math.floor(imputTime / 60) - (day * 24 * 60) - (hour * 60);
    // second = Math.floor(imputTime) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    hour = Math.floor(imputTime/(1000*3600));
    minute = Math.floor(imputTime/(1000*60)-(hour * 60));
    if(hour > 1){
        return hour+"小时"+minute+"分"
    }else{
        return minute+"分";
    }
}

//带天数的倒计时
function countDowns(timess,id){
    var timer=null;
    var times = new Date(timess);
    timer=setInterval(function(){
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        if(times > 0){
            day = Math.floor(times / (60 * 60 * 24));
            hour = Math.floor(times / (60 * 60)) - (day * 24);
            minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (day <= 9) day = '0' + day;
        if (hour <= 9) hour = '0' + hour;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        //
        console.log(day+"天:"+hour+"小时："+minute+"分钟："+second+"秒");
        if(day == 0){
            document.getElementById(id).innerHTML = "还剩" + hour+"小时";
        }else{
            document.getElementById(id).innerHTML = "还剩"+day+"天" + hour+"小时";
          
        }
        times--;
    },1000);
    if(times<=0){
        clearInterval(timer);
    }
}
var consumer =  getCookie("consumer");
//根据对应的角色跳转的首页
function getMyJspUrl(){
    return "/localQuickPurchase/distributionVA/personal/index";
}

//0 升级代理商   1 升级经销商

function condition(type){
    var result = {"code":200,"message":"ok"}
    //userType  2 商家   5  供应商  4 经销商   这几个userType不可以升级经销商
    if(UT == 4) {
        //result.code = 400;
        result.code = type == 0 ? 300 : 300;
        result.message = type == 0 ? "经销商不能申请经销商,确定要申请店主？" : "经销商不能申请代理";
    }else if(UT == 2){
        result.code = type == 0 ? 400 : 400;
        result.message =type == 0 ? "商家不能申请经销商,确定要申请店主？" : "商家不能申请代理";
    }else if(UT == 5){
        result.code = type == 0 ? 500 : 500;
        //result.message = type == 0 ? "供应商不能申请代理商" :"供应商不能申请代理";
        result.message = type == 0 ? "供应商不能申请经销商,确定要申请店主？" :"供应商不能申请代理";
    }
    return result;
}

//loadScript 用于插入官方js
function loadScript(url, done) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = onreadystatechange = function() {
        if (!this.readyState ||
            this.readyState === 'load' ||
            this.readyState === 'complete') {
            done && done();
            script.onload = onreadystatechange
            script.parentNode.removeChild(script);
        }
    };
    document.body.appendChild(script);
}
//判断浏览器是否为 指定的 浏览器
function deviceDetect(str){
    var u = navigator.userAgent;
    if(u.indexOf(str)>0){
        return true;
    }else{
        return false;
    }

}
//分享  可能会调用原生分享方法  注释
function share520Love(url,title,digest,pic,className){
    if(title == ""){
        title = "爱之家商城分享";
    }
    if(pic==""){
        pic="http://nfxts.520shq.com:7050/localQuickPurchase/distributionApp/images/azj.png"
    }
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        // 调app原生分享     url、title 分享内容、图片链接
        window.action.shareGoods(url,title,digest,pic);
        //window.action.qrcodeImgUrl(url);
    } else{
        isWeiXinShare();
        soshm(className, {
            // 分享的链接，默认使用location.href
            url: url,
            // 分享的标题，默认使用document.title
            title: title,
            // 分享的摘要，默认使用<meta name="description" content="">content的值
            digest: digest,
            // 分享的图片，默认获取本页面第一个img元素的src
            pic: pic,
            // 默认显示的网站为以下六个个,支持设置的网站有
            // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
            sites: ['weixin',"weixintimeline", 'qq','weibo']
        });
    }
}
//web端调用分享
function share520LoveWeb(url,title,digest,pic,className){
    isWeiXinShare();
    if(title == ""){
        title = "爱之家商城分享";
    }
    if(pic==""){
        pic="http://nfxts.520shq.com:7050/localQuickPurchase/distributionApp/images/azj.png"
    }
    //  http://www.cnblogs.com/ning-blogs/p/5670711.html    如果现在QQ、微信自带的浏览器上也能分享   请参考
    /*if (deviceDetect('Mobile MQQBrowser') && !deviceDetect('MicroMessenger')) {  //判断是QQ内置浏览器  调用内置分享
        //alert("deviceDetect");
        loadScript('http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js', function() {
          setShareInfo({
            title: title,
            summary: digest,
            pic:pic,
            url: url
          });
        })

      }*/
    //alert("开始调用");
    soshm(className, {
        // 分享的链接，默认使用location.href
        url: url,
        // 分享的标题，默认使用document.title
        title: title,
        // 分享的摘要，默认使用<meta name="description" content="">content的值
        digest: digest,
        // 分享的图片，默认获取本页面第一个img元素的src
        pic: pic,
        // 默认显示的网站为以下六个个,支持设置的网站有
        // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
        sites: ['weixin',"weixintimeline", 'qq','weibo']
    });
    //alert("web调用结束!");
}
/**
 *
 * @returns
 */
function isWeiXinShare() {
    if (isWeixin) {
        //alert("微信里点开的");
        soshm.weixinSharetip();
    }
}
/*
var isDis = 1;
isDisa();
function  isDisa(){
	$.post("/localQuickPurchase/dApplicationAction/findOne",{distributorSeq:seq},function(result){
		if(result.code == 200){
			isDis = 0
		}else{
			isDis = 1;
		}
	})
}*/

//判断当前用户的角色
function roleType(){
    var url = "/localQuickPurchase/upgredeOrder/roleType";
    var bool = false;
    $.ajax({
        type : "post",
        url : url,
        dataType : "json",
        data : {
            seq : seq,
            userType : distributorType
        },
        async : false,
        success : function(result) {
            var code = result.code;
            if(code == 200){
                var shopper = result.data;

                if(shopper.userType == "4" || shopper.serverFanWei == "99" || shopper.serverFanWei == "100"){
                    bool = true;
                }
            }else if(code == 300){
                var ty = result.data;
                if(ty == "3"){
                    bool = true;
                }
            }
        },
        error:function(){}
    });
    return bool;
}


//判断有没有购买直通车服务(升级经销商)
function zhiTongPay(){
    var url = "/localQuickPurchase/dApplicationAction/findDisBySeq";
    var bool = false;
    $.ajax({
        type : "post",
        url : url,
        dataType : "json",
        data : {
            seq : seq
        },
        async : false,
        success : function(result) {
            var code = result.code;
            if(code == 200){
                var dis = result.data;
                if(dis != null){
                    var comeForm = dis.comeForm;
                    var agentInPayState = dis.agentInPayState;
                    if(comeForm == 3 || agentInPayState == 1){
                        bool = true;
                    }
                }
            }
        },
        error:function(){}
    });
    return bool;
}
//查看是否禁用登录
function checkSaleTime(){
    var  listWeeksStr=  getCookie("listWeeks");
    var listWeekArray =null;
    if(listWeeksStr != ''){
        listWeekArray = JSON.parse(listWeeksStr)
    }
    var  listSaleTimeStr =  getCookie("listSaleTime");
    var  effectSaleTime =  getCookie("effectSaleTime");
    var listSaleTimeArrayObject = null;
    if(listSaleTimeStr != ''){
        listSaleTimeArrayObject = JSON.parse(listSaleTimeStr)
    }
    if(listWeeksStr != '' &&  listSaleTimeStr != '' && effectSaleTime == 'true'){
        //标记是否提示
        var  flagAlertLogout = false;
        var fal = getCookie("flagAlertLogout");var fl = getCookie("flagLogout");
        if(fal != "" && (fal =="true" || fal ==true)){
            flagAlertLogout= true;
        }
        //是否退出
        var  flagLogout = false;
        var fl = getCookie("flagLogout");
        if(fl != "" && (fl =="true" || fl ==true)){
            flagLogout= true;
        }
        var d = new Date();
        var nowData = d.getDay();
        var nowHours = d.getHours();
        var nowMinutes =d.getMinutes();
        var show_day=new Array('周日','周一','周二','周三','周四','周五','周六');
        var temp_show_day=show_day[nowData];
        if(listWeeksStr.indexOf(temp_show_day)> 0){
            var listSaleTimeAllStr="";
            for(var i=0; i <listSaleTimeArrayObject.length;i++){
                var saleTime = listSaleTimeArrayObject[i];
                listSaleTimeAllStr += saleTime.startTime
                listSaleTimeAllStr += ("-"+ saleTime.endTime);
                if(i < listSaleTimeArrayObject.length-1){
                    listSaleTimeAllStr += "、";
                }
            }
            for(var i = 0; i < listSaleTimeArrayObject.length; i++){
                var saleTime = listSaleTimeArrayObject[i];
                var endTime = (saleTime.endTime).split(":");
                var startTime = (saleTime.startTime).split(":");
                //限制时间段之前的5分钟   现在时间   0:58       限时 1:03
                if(parseInt(nowHours) == parseInt(startTime[0])-1 && ((parseInt(startTime[1])+ 60) - parseInt(nowHours) <= 5)){
                    if(!flagAlertLogout){//当前时间(小时)+1  ==  限制登录开始时间
                        hui.alert("您即将进入限制登录时段；限制时段为:" + listSaleTimeAllStr, "确认", function(){
                            flagAlertLogout = true;
                            setCookie("flagAlertLogout",flagAlertLogout,0.01);
                        });
                    }
                    //限制时间段内    现在时间   1:58     开始时间  0:33   结束时间 2:20
                }else if(parseInt(nowHours) > parseInt(startTime[0]) && parseInt(endTime[0]) > parseInt(nowHours)) {
                    //已经  进入限制时间段内
                    if(!flagLogout){
                        hui.alert("您已经进入限制登录时段，五分钟后将被强制下线；限制时段为:" + listSaleTimeAllStr, "确认", function(){
                            setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                            setCookie("flagLogout", true, 0.01);
                        });
                    }else{
                        executeLogout(false);
                    }
                    //当前时间小时 与开始时间小时相等或结束时间小时相等           现在时间   1:58     开始时间  1:33   结束时间 2:20
                }else  if(parseInt(nowHours) == parseInt(startTime[0]) && parseInt(endTime[0]) > parseInt(nowHours)){//当前时间  == 限制登录开始时间 (小时)
                    // 5分钟前提示
                    if( (parseInt(nowHours) == parseInt(startTime[0]))  &&   parseInt(startTime[1]) - parseInt(nowMinutes) <= 5 && parseInt(startTime[1]) - parseInt(nowMinutes) > 0  ){
                        if(!flagAlertLogout){
                            hui.alert("您即将进入限制登录时段；限制时段为:" + listSaleTimeAllStr, "确认", function(){
                                flagAlertLogout = true;
                                setCookie("flagAlertLogout",flagAlertLogout,0.01);
                            });
                        }
                        // 限制时间段内提示     现在时间   0:58       限时 1:03
                    }else if(parseInt(nowMinutes) > parseInt(startTime[1])) {
                        if(!flagLogout){
                            hui.alert("您已经进入限制登录时段，五分钟后将被强制下线；限制时段为:"+ listSaleTimeAllStr, "确认", function(){
                                setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                                setCookie("flagLogout", true, 0.01);
                            });

                        }else{
                            executeLogout(false);
                        }
                    }//else   还不在限定时间段内的
                    // 限制时间段内  现在时间   1:30    开始时间  0:33   结束时间 1:50
                }else  if(parseInt(nowHours) > parseInt(startTime[0]) &&  ( parseInt(endTime[0]) == parseInt(nowHours))){//当前时间  == 限制登录开始时间 (小时)

                    // 限制时间段内提示     现在时间   0:58       限时 1:03
                    if( parseInt(endTime[1]) > parseInt(nowMinutes)) {
                        if(!flagLogout ){
                            hui.alert("您的账号处于限制登录时段，限制时段内无法登录；限制时段为:"+ listSaleTimeAllStr, "确认", function(){
                                setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                                setCookie("flagLogout", true, 0.01);
                            });

                        }else{
                            executeLogout(false);
                        }
                    }
                    //当前时间  == 限制登录开始时间 (小时)
                }else  if(parseInt(nowHours) == parseInt(startTime[0]) &&  ( parseInt(endTime[0]) == parseInt(nowHours))){

                    // 限制时间段内提示     现在时间   0:58       限时 1:03
                    if(parseInt(startTime[1]) - parseInt(nowMinutes) <= 5 && parseInt(startTime[1]) - parseInt(nowMinutes) >= 0){
                        if(!flagAlertLogout){
                            hui.alert("您即将进入限制登录时段；限制时段为:" + listSaleTimeAllStr, "确认", function(){
                                flagAlertLogout = true;
                                setCookie("flagAlertLogout",flagAlertLogout,0.01);
                            });
                        }
                    }else if( parseInt(endTime[1]) > parseInt(nowMinutes) && parseInt(startTime[1]) < parseInt(nowMinutes)) {
                        if(!flagLogout){
                            hui.alert("您已经进入限制登录时段，五分钟后将被强制下线；限制时段为:"+ listSaleTimeAllStr, "确认", function(){
                                setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                                setCookie("flagLogout", true, 0.01);
                            });

                        }else{
                            executeLogout(false);
                        }
                    }
                }
            }
        }else{
            //不在限制登录时间内
        }
        /*if(flagLogout){
            //刷新当前页面
            window.location.href=window.location.href;
            return;
        }*/
    }
    //findShopBySeq();
}

// 马上执行
function  executeLogout(fulfillment){
    if(fulfillment){
        loginOffByBack();
        window.location.href="/localQuickPurchase/distributionVA/index";
    }else{
        var flagLogoutDate = getCookie("flagLogoutDate");
        var flagDate = new Date(flagLogoutDate);
        var tHours = flagDate.getHours();
        var tMinutes =flagDate.getMinutes();
        var d = new Date();
        var nHours = d.getHours();
        var nMinutes =d.getMinutes();
        // 5分钟后退出登录
        if( (parseInt(tHours) == parseInt(nHours)) && (parseInt(tMinutes) + 5 <= parseInt(nMinutes))){
            loginOffByBack();
            window.location.href="/localQuickPurchase/distributionVA/index";
        }else if(((parseInt(tHours)  == parseInt(nHours)-1 )) &&  (parseInt(tMinutes) - 60 + 5  <= parseInt(nMinutes))){
            loginOffByBack();
            window.location.href="/localQuickPurchase/distributionVA/index";
        }
    }

}
var  warrant = getCookie("warrant");
function findShopBySeq(){
    if(seq !="" && seq != 0 ){
        // 获取代理商昵称
        $.ajax({
            type:'GET',
            dataType:'json',
            url:'/localQuickPurchase/virtualShopAction/findShopBySeq',
            data:{
                'seq' : seq
            },
            async : false,
            success:function(result){
                console.log(result);
                if(result.code == 200  ){
                    var data = result.data;
                    var warrant = data.virtualShop.warrant;
                    if(warrant == null){
                        warrant = 0;
                    }
                    if(seq == "" || seq == 0){
                        return;
                    }
                    if(data.virtualShop.promptUser){
                        var confirmStr=""
                        if(data.virtualShop.inviterType == 2){
                            confirmStr = "经销商(" + data.virtualShop.inviterMobile + ")正邀请您和他在爱之家一起购物!";
                        }else{
                            confirmStr="代理商(" + data.virtualShop.inviterMobile + ")正邀请您和他在爱之家一起购物!";
                        }
                        hui.confirm(confirmStr, ['取消','接受'], function(){
                            //console.log('确认后执行...');
                            promptUser(true);
                        },function(){
                            //console.log('取消后执行...');
                            promptUser(false);
                        });
                    }
                    setCookie("warrant",warrant,1);
                    var effectSaleTime= data.virtualShop.effectSaleTime;
                    setCookie("effectSaleTime",effectSaleTime,1);
                    //默认的禁止登陆日期
                    listWeekArray= data.virtualShop.listWeeks;
                    listSaleTimeArray= data.virtualShop.listSaleTime;
                    if(listWeekArray != null){
                        //限制登录的日期   15分钟
                        var  listWeekArrayStr = JSON.stringify(listWeekArray);
                        if(listWeekArrayStr != getCookie("listWeeks")){
                            setCookie("flagAlertLogout", "", -1);
                            setCookie("flagLogout", "", -1);
                            setCookie("flagLogoutDate", "", -1);
                        }
                        setCookie("listWeeks",listWeekArrayStr,0.01);
                    }
                    //限制登录的时间段  15分钟
                    if(listSaleTimeArray != null){
                        var  listSaleTimeArrayStr = JSON.stringify(listSaleTimeArray);
                        if(listSaleTimeArrayStr != getCookie("listSaleTime")){
                            setCookie("flagAlertLogout", "", -1);
                            setCookie("flagLogout", "", -1);
                            setCookie("flagLogoutDate", "", -1);
                        }
                        setCookie("listSaleTime",listSaleTimeArrayStr,0.01);

                    }
                }
            }
        });
    }
}
$(function(){
    checkSaleTime()
});

function promptUser(promp){
    var  flag= promp==true;
    $.ajax({
        type:'GET',
        dataType:'json',
        url:'/localQuickPurchase/virtualShopAction/promptUser',
        data:{
            'seq' : seq,
            'promp':flag
        },
        async : false,
        success:function(result){

        }
    });
}
//升级店主的提示
function totalalert(){
    if(UT == 2){
        hui.alert("由于您已是商家,仅支持升级为店主,暂不支持升级为经销商");
        return;
    }else if(UT == 4){
        hui.alert("由于您已是经销商,已具备店主权限,不需要再次升级");
        return;
    }else if(UT == 5){
        hui.alert("由于您已是供应商,仅支持升级为店主,暂不支持升级为经销商");
        return;
    }
}

//升级店主的提示和状态
function totalalertMessage(){
    var result = {"code":200,"msg":"ok"};
    if(serverFanWei == "100" || serverFanWei == "99"){
        result.msg = "由于您已是经销商,已具备店主权限,不需要再次升级";
        result.code = 400;
        return result;
    }else if(UT == 2){
        //	result.msg = "由于您已是商家,仅支持升级为店主,暂不支持升级为经销商";
        //	result.code = 300;
        return result;
    }else if(UT == 4){
        //	result.msg = "由于您已是经销商,已具备店主权限,不需要再次升级";
        //	result.code = 400;
        return result;
    }else if(UT == 5){
        //	result.msg = "由于您已是供应商,仅支持升级为店主,暂不支持升级为经销商";
        //	result.code = 300;
        return result;
    }
    return result;
}
//升级经销商的提示和状态 T==1000
function totalalertT(){
    var result = {"code":200,"msg":"ok"};
    if(serverFanWei == "100" || serverFanWei == "99"){
        result.msg = "由于您已是经销商,不需要再次升级";
        result.code = 400;
        return result;
    }else if(UT == 2){
        result.msg = "由于您已是商家,仅支持升级为店主,暂不支持升级为经销商";
        result.code = 300;
        return result;
    }else if(UT == 4){
        result.msg = "由于您已是经销商,不需要再次升级";
        result.code = 400;
        return result;
    }else if(UT == 5){
        result.msg = "由于您已是供应商,仅支持升级为店主,暂不支持升级为经销商";
        result.code = 300;
        return result;
    }
    return result;
}

function checkDistributorType(){
    var json = {"code":200,"message":"ok","url":""}
    if(seq == 0){
        hui.confirm('去登录?', ['返回','确定'], function(){
            loginPage();
        },function(){
            window.history.back(-1)
        });
        return ;
    }
    if(distributorType == "2" ){
        var ispay = false;
        $.ajax({
            type : "post",
            url : "/localQuickPurchase/dApplicationAction/isPay",
            dataType : "json",
            data : {
                seq : seq,
                userType : distributorType
            },
            async : false,
            success : function(result) {
                var code = result.code;
                if(code == 200){
                    if(result.data || result.data == "true"){
                        ispay = true;
                    }
                }
            },
            error:function(){}
        });
        if(ispay){
            json.message = "代理商不能购买服务";
            json.url = "/localQuickPurchase/distributionVA/index/distributionIndex";
            json.code = 400;
            return json;
        }
    }
    if(distributorType == "3" ){
        json.message = "经销商不能购买服务";
        json.url = "/localQuickPurchase/distributionVA/index/distributionIndex";
        json.code = 400;
        return json;
    }
    return json;
}

/**
 * 判断是否是在qq微信打开
 * @returns true 符合, false 不符合
 */
function is_weixin() {

    return is_weixin2();
}
function is_weixin2() {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger"||ua.match(/WeiBo/i) == "weibo") {
        return true;
    }else if(ua.indexOf('mobile mqqbrowser')>-1){
        return true;
    }else if(ua.match(/QQ/i) == "qq"){
        return true;
    }
    return false
}

var isWeixin = is_weixin();

function isWeixinClient() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}


//点击分享
$("body").on("click",".soshm-item-icon",function() {
    isWeiXinShare();
});
/**
 * 获取分销价
 * @returns
 */
function getDistributionPrice(data) {
    var distributionPrice = data[0].distributionPrice;
    if(distributionPrice == null) {
        var costPrice = (data[0].platformPrice*1.15).toFixed(2);;
        distributionPrice = (costPrice*1.2).toFixed(2);
    }
    return distributionPrice;
}

/**
 * 获取平台价
 * @param data
 * @returns
 */
function getPlatformPrice(data) {
    var platformPrice = data[0].platformPrice;
    return platformPrice;
}

/**
 * 分销利润价
 * @param data
 * @returns
 */
function getProfitPrice(data) {
    var profitPrice = data[0].profitPrice;
    return profitPrice;
}

/**
 * 商品原价
 * @param data
 * @returns
 */
function getGoodsPrice(data) {
    var goodsPrice = data[0].goodsPrice;
    return goodsPrice;
}

/**
 * 起卖量
 * @param data
 * @returns
 */
function getSalesVolume(data) {
    var salesVolume = data[0].salesVolume;
    return salesVolume;
}
//判断是否是直辖市
function judgeCity(tipCity){
    if (tipCity.indexOf("北京") != -1 || tipCity.indexOf("天津") != -1 || tipCity.indexOf("重庆") != -1 || tipCity.indexOf("上海") != -1) {
        tipCity = "";
    }
    return tipCity;
}
//旧数据要求用户重新填写地址,返回true
function judgeTipProvinceOld(judgeTipProvince){
    if(judgeTipProvince == null || judgeTipProvince == ""){
        return true;
    }else{
        if(judgeTipProvince.indexOf("省") < 0 && judgeTipProvince.indexOf("天津") < 0 && judgeTipProvince.indexOf("北京") < 0 &&
            judgeTipProvince.indexOf("重庆") < 0 && judgeTipProvince.indexOf("上海") < 0 && judgeTipProvince.indexOf("宁夏") < 0
            && judgeTipProvince.indexOf("新疆") < 0 && judgeTipProvince.indexOf("西藏") < 0 && judgeTipProvince.indexOf("内蒙古") < 0
            && judgeTipProvince.indexOf("广西壮族")){
            return true;
        }else{
            return false;
        }
    }
}

// 给手机段 获取二维码地址
function getEwmcode(){
    var href = window.location.href;
    var appUrl = href.substring(0,href.indexOf("localQuickPurchase/"));
    var qrcodeImgUrl = appUrl + $(".ewmcode img").attr("src");
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1;
    if(isappwebview){
        // 调app原生方法  传给手机端二维码的链接
        window.action.qrcodeImgUrl(qrcodeImgUrl);
    }
}

function getGoodsDetailUrl(goodsId, distributorSeq, checkShare) {
    var url = "/localQuickPurchase/distributionVA/goodsDetail/"+goodsId+"/"+distributorSeq+"/"+distributorSeq;
    if (checkShare != null && checkShare != "") {
        url += "?checkShare=1&goodsId="+goodsId+"&seq=" + distributorSeq;
    }else{
        url += "?goodsId="+goodsId+"&seq=" + distributorSeq;
    }
    return url;
}
//删除指定数组元素,直接调用remove传入该元素即可
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

//判断数组是否包含某个元素
function ifArray(array,element){
    for(var i = 0; i < array.length;i++){
        var arr = array[i]
        if(arr === element) {
            return true;
        }
    }
}
//判断是否登录
function noLogin(type){
    if(type == 0){
        hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录','马上登录'], function(){
            //setCookie("loginRetrunUrl",urlVal);
            loginPage();
        });
    }else
        hui.alert("为了给您提供完整的服务，请登录后再进行该操作", "确认", function(){
            loginPage();
        });
}

//判断是否登录
function checkIsLogin(type){
    if(seq == 0 || seq == ''){
        noLogin(type);
        return ;
    }
}


var scancodeState = 0;// 0 标示有未处理的订单
function showWaitOrderView(){
    console.info(scancodeState+"=========");
    if(seq == null || seq == "null" || seq == 0 ){
        return;
    }
    if(scancodeState == 1){
        return;
    }
    var cookieSeq = getCookie("seq");
    if(cookieSeq == 0 || cookieSeq == "" || cookieSeq == null){
    	return;
    }
    var localParam = {seqSeller:cookieSeq,orderStatus:33,deliveryMethod:0,pageIndex:1,pageSize:10};
    var json = findlocaleRecruitOrder(localParam);
    if(json != null){
        var list = json.data.list;
        for(var i = 0 ; i < list.length ; i++){
            var order = list[i];
            var orderno = order.orderno;
            var isLogistic = order.isLogistic;//是否是偏远地区
            isLogistic = isLogistic != null && isLogistic == "1" ? "0" : "0";
            var scancode_length = $(".waitOrder").length;;
            if(scancode_length > 0){
                $("#orderno").html(orderno);
                $(".waitOrder").show();
                if(isLogistic == "1"){
                    hui.alert("此订单是偏远地区订单", "确认", function(){
                        $(".waitOrder").show();
                    });
                }else{
                    $(".waitOrder").show();
                }
            }else{
                var html = '';
                html += '<div class="scancode waitOrder" style="background: rgba(0,0,0,0.5);height: 100%;top: 0;width: 100%;position: absolute;z-index: 999;box-sizing: border-box;">';
                html += '<div class="set-goods-21" style="height:9.5rem ; width: 13.2rem;background: #fff;position: absolute;top: 0;bottom: 0;right: 0;left: 0;margin: auto;border-radius: 5px;" >';
                html += '<div class="set-goods-2-title1" style=" height: 15%;width: 100%;text-align: center;color: #212121;font-size: 0.65rem;line-height: 1.6rem;position: relative;">';
                html += '发货提示';
                html += '</div>';
                html += '<div class="set-goods-2-content1" style="text-align: center;height: 80%;padding: 1rem 1.1rem 0rem 1.1rem;">';
                html += '<p style="color: #212121;font-size: 0.65rem;margin-bottom: 1.49rem;">您有一个订单为：<span id="orderno">'+orderno+'</span>的订单已付款，请发货</p>';
                html += '<div class="set-goods-2-bottom1" style="width: 100%;">';
                html += '<button class="set-button-left1 my" isLogistic='+isLogistic+' style="width: 5.3rem;height:1.32rem;text-align: center;line-height: 1.32rem;color: #ffffont-size: 0.65rem;float: left;background: #cccccc;border: none;outline: none;border-radius:5px ;">是</button>';
                html += '<button class="set-button-right1 platform" isLogistic='+isLogistic+' style="width: 5.3rem;height:1.32rem;ext-align: center;float: right;line-height: 1.32rem;color: #fff;background: #e4393c;font-size: 0.65rem;border: none;border-radius:5px ;outline: none;">否</button>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                //$("body").append(html);

                if(isLogistic == "1"){
                    hui.alert("此订单是偏远地区订单", "确认", function(){
                        $("body").append(html);
                    });
                }else{
                    $("body").append(html);
                }
            }
            scancodeState = 1;
            break;
        }
    }
}

//平台发货
//$(".platform").on("click",function(){
$(document).on("click",".platform",function(){
    $(".scancode").hide();

    /*var orderno = $("#orderno").html();
    var isLogistic = $(this).attr("isLogistic");
    if(isLogistic == "1"){
         hui.confirm("此订单是偏远地区订单", ['取消','是'], function(){
             var json = fahuo(2,orderno);
                if(json != null){
                    hui.toast("发货成功");
                }else{
                    hui.toast("发货失败");
                }
            },function(){
                promptUser(false);
            });
    }else{
        var json = fahuo(2,orderno);
        if(json != null){
            hui.toast("发货成功");
        }else{
            hui.toast("发货失败");
        }
    }*/

})

//我发货
//$(".my").on("click",function(){
$(document).on("click",".my",function(){
    var orderno = $("#orderno").html();
    var json = fahuo(1,orderno);
    if(json != null){
        hui.toast("发货成功");
    }else{
        hui.toast("发货失败");
    }
})

//发货方式    state的值 1 自己发货(经销商) 2 平台发货   3  补充发货(经销商触发的)
function fahuo(state,orderno){
    scancodeState = 0;
    console.info(scancodeState+"=========");
    //var orderno = $("#orderno").html();
    var param = {"orderno":orderno,"deliveryMethod":state,"orderStatus":2};
    var json = updateLocaleRecruitOrder(param);
    $(".scancode").hide();
    return json;

}


if(seq != "" && seq != 0 && seq != null && seq != "null"){
    if(isRoleDealer() ){
        //定时器检查是否有未发货的订单
        //setInterval("showWaitOrderView()",3000);
    }
}

//更新订单状态
function updateLocaleRecruitOrder(param){
    var json = null;
    $.ajax({
        type : "post",//定义提交的类型
        contentType: "application/json;charset=utf-8",
        url : "/localQuickPurchase/dOrders/updateLocaleRecruitOrder",
        dataType : "json",//设置返回值得类型
        data : JSON.stringify(param) ,
        async : false,//是否异步请求，false为同步
        success : function(result) {//成功返回值执行函数
            if(result.code == 200){
                //json = result.data.list;
                json = result;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return json;
}
//查询现场招商订单
function findlocaleRecruitOrder(localParam){
    var json = null;
    $.ajax({
        type : "post",//定义提交的类型
        contentType: "application/json;charset=utf-8",
        url : "/localQuickPurchase/dOrders/findLocaleRecruitOrder",
        dataType : "json",//设置返回值得类型
        data : JSON.stringify(localParam) ,
        async : false,//是否异步请求，false为同步
        success : function(result) {//成功返回值执行函数
            if(result.code == 200){
                //json = result.data.list;
                json = result;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        }
    });
    return json;

}




function checkGoodsToBuy(goodstype,startTime,endTime){
    if(goodstype == null || goodstype == 0){
        return 4;
    }
    var date = new Date();
    var nowTime = Number(date);
    if(startTime == null || endTime == null || startTime == '' || endTime == ''){
        return 4;
    }else if(nowTime > startTime && nowTime < endTime){
        return 1;
    }else if(nowTime > endTime){
        return 3;
    }else if(nowTime < startTime){
        return 0;
    }else {
        return -1;
    }
}

function beforeStartTime(operation,goodstype,startTime,endTime){
    var result = {"code":200,"msg":"ok"};
    var code =  checkGoodsToBuy(goodstype,startTime,endTime);
    if(code == 0){
        result.code = "300";
        result.msg = "商品还没开始预售！";
    }
    return result;
}

//判断是否可以添加购物车
function addCar(operation,goodstype,startTime,endTime){
    var result = {"code":200,"msg":"ok"};
    var code = checkGoodsToBuy(goodstype,startTime,endTime);
    if(code == 1){
        result.code = "300";
        result.msg = "在预售期中不能加入购物车！";
    }else if(code == 0){
        result.code = "400";
        result.msg = "商品还没开始预售,不能加入购物车！";
    }
    return result;
}
//判断是否可以下单
function addOrder(goodstype,startTime,endTime){
    var result = {"code":200,"msg":"ok"};
    var code = checkGoodsToBuy(goodstype,startTime,endTime);
    if(code == 0){
        result.code = "300";
        result.msg = "商品还没开始预售,不能购买！";
    }
    return result;
}

/*判断是否可以添加购物车或者下单  ()
 * goodsOperation = 0 添加购物车   ，goodsOperation = 1 ，下单
 * goodstype 商品类型  goodstype = 0 普通商品  goodstype = 1 预售商品
 * 预售开始时间    startTime 开始时间
 * 预售结束时间     endTime   结束时间
 * return result   result.code = 200 正常 ,result.code 非200 错误
 */
function goodsOperation(operation,goodstype,startTime,endTime){
    var result = {"code":200,"msg":"ok"};
    if(goodstype == 0){
        return  result;
    }
    if(operation == 0){//添加购物车
        result = addCar(operation,goodstype,startTime,endTime);
    }else if(operation == 1){//下单
        result = addOrder(operation,goodstype,startTime,endTime);
    }else if(operation == 2){
        result = beforeStartTime(operation,goodstype,startTime,endTime);
    }
    return result;
}

//预售商品列表入口
$(document).on('click','.yGoods',function(){
    window.location.href = "/localQuickPurchase/distributionVA/bookingGoods";
    //window.location.href = "http://192.168.1.128:8080/localQuickPurchase/distributionVA/bookingGoods";
})

//按多规格统计购物车商品数量
function goodsLocalItem(){
    $.ajax({
        type : "post", // 定义提交的类型
        url : "/localQuickPurchase/dCart/findCartV1",// 请求的地址
        dataType : "json", // 设置返回值得类型
        data : {
            "userName" : getCookie("userName"),
            "comefrom" : 1// 1 : 店下详情的购物车, 2 : 单独页面的购物车
        },
        async : true, // 是否异步请求，false为同步
        success : function(data) { // 成功返回值执行函数
            if (data.code == 200) {
                var localItems = data.data.localItems;
                var goodsLocalItems = 0;
                if(localItems != null && localItems != ""){
                    goodsLocalItems = localItems.length;
                }
                setCookie("goodsLocalItems",goodsLocalItems);
                if (goodsLocalItems > 0) {
                    var goodsNumber = document.getElementById("goodsNumber");
                    if(goodsNumber){
                        goodsNumber.innerHTML = goodsLocalItems;
                    }
                }
                //document.getElementById("number").innerHTML = goodsLocalItems;
            } else {
                //alert("查询失败!");
            }
        }
    });
};
//设置的定时器
function show_time(endTime,timeServerClient,dataIndex){

    var timerDay = document.getElementById("day"+dataIndex);
    var timerHour = document.getElementById("hour"+dataIndex);
    var timerMinute = document.getElementById("minute"+dataIndex);
    var timerSecond = document.getElementById("second"+dataIndex);
    if(!timerDay || !timerHour || !timerMinute || !timerSecond){
        return ;
    }
    timerDay.innerHTML = timeServerClient;
    timerHour.innerHTML = timeServerClient;
    timerMinute.innerHTML = timeServerClient;
    timerSecond.innerHTML = timeServerClient;

    /*if (dataIndex == 0) {
        timerHour.innerHTML = "00";
        timerMinute.innerHTML = "00";
        timerSecond.innerHTML = "00";
        return;
    }*/
    var time_now,timeDistance,strTime;  //1.当前时间		2.时间距离		3.拼接输出时间
    var day,hour,minute,second;  //1.天数		2.小时		3.分钟	4.秒
    //每秒钟都获取一次当前时间
    var time_now = new Date();
    //time_now = time_now.getTime();
    // 剩余时间 = 结束(开始)时间 - 当前时间
    //timeDistance = endTime-time_now;
    timeDistance = timeServerClient;
    timeServerClient = endTime-time_now;
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

        //定时器输出时间
        timerDay.innerHTML = day+"天";
        timerHour.innerHTML = hour+"时";
        timerMinute.innerHTML = minute+"分";
        timerSecond.innerHTML = second+"秒";
        //每秒循环执行
        setTimeout("show_time("+endTime+","+timeServerClient+","+dataIndex+")",1000);
    } else {//倒计时结束执行的操作
        timerHour.innerHTML = "00";
        timerMinute.innerHTML = "00";
        timerSecond.innerHTML = "00";
        clearTimeout("活动时间已结束！！！");
    }
}
//判断是否展示立即下单按钮
function getTimeBool(currentTime,beginTime){
    var timeBool = false;
    if (currentTime > beginTime){
        timeBool = true;
    }
    return timeBool;
}
function checkGoodsExists(goodsProStandard) {
    var bool = false;
    for (var j = 0; j < goodsProStandard.length; j++) {
        //该规格活动量
        var activityQuantity = goodsProStandard[j].activityQuantity;
        //该规格卖出的活动量
        var sellActivityQuantity = goodsProStandard[j].sellActivityQuantity;
        if (sellActivityQuantity < activityQuantity){
            bool = true;
            break;
        }
    }
    return bool;
}
//查询商家的入住信息
function isMerchantEnter(){
    var rs = {"code":400,"msg":"ok"};
    var n_seq = getCookie("seq");
    $.ajax({
        type : 'get',
        dateType : 'JSON',
        url : '/localQuickPurchase/merchantEnter/tmerchant',
        async : false,	//是否异步请求，false为同步
        data:{seq:n_seq,enterType:"1"},
        success : function(data){
            if (data.code == 200) {
                var result = data.data;
                if(result == null){
                    rs.msg = "";
                    rs.code = 200;
                    //location.href = "/localQuickPurchase/distributionVA/localeRecruit/merchantEnter"
                    return result;
                }else{
                    var status = result.status;
                    if(status == -3){
                        rs.code = 330;
                        rs.msg = "尊敬的用户，您提交的入驻资料审核不通过，请重新提交";
                        //hui.alert(rs.msg);
                    }else if(status == -2){
                        rs.code = 300;
                        rs.msg = "您的申请已删除";
                    }else if(status == -1){
                        rs.code = 310;
                        rs.msg = "您的申请已禁用";
                    }else if(status == 1 || status == 0){
                        rs.code = 320;
                        rs.msg = "系统已收到您的申请，请耐心等待审核";
                    }else if(status == 2){
                        rs.code = 210;
                        rs.msg = "恭喜您通过商家入驻审核，您已具备现场招商权限";
                    }
                    //hui.alert(rs.msg);
                }
            }else{
                //hui.iconToast("请求失败","error");
            }
        },
        error : function(error){
            clearLoading();
            hui.iconToast("请求异常","error");
        }
    });
    return rs;
}
//判断消息盒子是否有未读信息
function unreadSystematicNotification(seq){
	$.ajax({
		type:"post",
		url : "/localQuickPurchase/systematicNotification/findSysAndInforState",// 请求的地址
		dataType:"json",
		data:{
			"seq":seq
		},
		success : function(data){
			if(data==false){
				return false;
			}else{
				return true;
			}
        },
	});
};

try{
	(function(){
	    var supportsOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object');
	    var HTMLNode = document.body.parentNode;
	    var updateOrientation = function() {
	      // rewrite the function depending on what's supported
	      if(supportsOrientation) {
	        updateOrientation = function() {
	          var orientation = window.orientation;
	 
	          switch(orientation) {
	            case 90: case -90:
	              orientation = 'landscape';
	            break;
	            default:
	              orientation = 'portrait';
	          }
	 
	          // set the class on the HTML element (i.e. )
	          HTMLNode.setAttribute('class', orientation);
	        }
	      } else {
	        updateOrientation = function() {
	          // landscape when width is biggest, otherwise portrait
	          var orientation = (window.innerWidth > window.innerHeight) ? 'landscape': 'portrait';
	 
	          // set the class on the HTML element (i.e. )
	          HTMLNode.setAttribute('class', orientation);
	        }
	      }
	 
	      updateOrientation();
	    }
	    var init = function() {
	      // initialize the orientation
	      updateOrientation();
	 
	      if(supportsOrientation) {
	        window.addEventListener('orientationchange', updateOrientation, false);
	      } else {
	        // fallback: update every 5 seconds
	        setInterval(updateOrientation, 5000);
	      }
	 
	    }
	    window.addEventListener('DOMContentLoaded', init, false);
	  })();
	
}catch(e){
	
}

function getLocalStorage() {
    var localStorage = window.localStorage;
    return localStorage;
}

/**
 * 获取AccessToken
 * @returns {*}
 */
function getAccessToken() {
    var localStorage = getLocalStorage();
    if(localStorage != null && localStorage.length > 0) {
        var item = localStorage.getItem("access_token");
        if(item != null) {
            return item;
        }
    }
    var accessToken = getCookie("access_token");
    return accessToken;
}

/**
 *  刷新token
 */
function refreshToken(){
    var localStorage = getLocalStorage();

}

/**
 * 获取登录时的用户角色类型
 * @returns {null}
 */
function getLoginUserType() {
    if(distributorType != null) {
        if(isRoleDealer()) {
            return 4;
        }
        if(isRoleAgent()) {
            return 3;
        }
        if(isRoleConsumer() || isRoleVip()) {
            if(consumer != null && consumer != "") {
                return 2;
            }
            return 1;
        }
    }
    return null;
}

/**
 * 商品默认图片加载
 */
function defaultGoodsImg(goodsImg){
	var defGoodsImg = "/localQuickPurchase/distributionApp/images/goodsImg.png";
	if(goodsImg == null || goodsImg == ""){
		goodsImg = defGoodsImg;
	}
	return goodsImg;
}

/**
 * 设置绑定关系弹窗次数
 */
function setBindingWindowsVal(bindingWindows){
    if(bindingWindows == "zero"){
        setCookie("bindingWindows","one", 1);//用户绑定弹窗控制（一天弹窗三次）
    }else if(bindingWindows == "one"){
        setCookie("bindingWindows","two", 1);//用户绑定弹窗控制（一天弹窗三次）
    }else {
        setCookie("bindingWindows","three", 1);//用户绑定弹窗控制（一天弹窗三次）
    }
}

function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var path=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=path.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=path.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return localhostPaht;
}

//转化时间格式:返回年月日
function formatDate(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};

//转化时间格式:返回年月日
function formatDateStr(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '.' + m + '.' + d;
};

/*订单状态修改*/
function updateSysState(id) {
    $.ajax({
        type: "post",
        url: "/localQuickPurchase/systematicNotification/updateSystematicNotificationState",
        data: {
            id: id
        },
        dataType: "json",	//设置返回值得类型
        success: function (data) {
            if (data.code == 200) {
                //alert("更新成功!");
            }
        },
        error: function () {

        }
    });
}
/*时间戳转换*/
function timetrans(date,type) {
    if (typeof (date) !== "undefined" && date !== null && date !== "") {
        var weekday = new Array(7)
        weekday[0] = "星期天"
        weekday[1] = "星期一"
        weekday[2] = "星期二"
        weekday[3] = "星期三"
        weekday[4] = "星期四"
        weekday[5] = "星期五"
        weekday[6] = "星期六"
        if (date.length == 10) {
            var date = new Date(date * 1000);
        } else {
            var date = new Date(date);
        }
        var Y = date.getFullYear();
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var W = weekday[date.getDay()];
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        if (type == "0") {
            return Y + '-' + M + '-' + D ;
        } else if (type == "1") {
            return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
        } else if (type == "2") {
            return Y + '年' + M + '月' + D + '日' + ' ' + W + ' ' + h + ':' + m + ':' + s;
        }
    } else {
        return "";
    }
}


var roleConsumer = "ROLE_CONSUMER";
var roleVip = "ROLE_VIP";
var roleDistributor = "ROLE_DISTRIBUTOR";
// const roleAgent = "ROLE_AGENT";
var roleAgent = "3";
var roleEnterAgent = "4";

/**
 * 当前用户是否为普通用户 返回boolean值
 */
function isRoleConsumer() {
    if (!isLogin()) {
        return false;
    }
    let roleType = getRoleType();
    return roleConsumer === roleType;
}

/**
 * 当前用户是否为Vip 返回boolean值
 */
function isRoleVip() {
    if (!isLogin()) {
        return false;
    }
    let roleType = getRoleType();
    return roleVip === roleType;
}

/**
 * 当前用户是否为网络店主 返回boolean值
 */
function isRoleDistributor() {
    if (!isLogin()) {
        return false;
    }
    let roleType = getRoleType();
    return roleDistributor === roleType;
}

/**
 * 当前用户是否为代理商 返回boolean值
 */
function isRoleAgent() {
    if (!isLogin()) {
        return false;
    }
    let roleType = getRoleType();
    return roleAgent === roleType || roleEnterAgent === roleType;
}

/**
 * 获取用户角色类型
 */
function getRoleType() {
    let authority = "authority";
    return getStorageValue(authority);
}
/**
 * 用户SEQ的获取
 */
var seq = getUserSeq();
if (seq == null || seq == undefined){
    seq = 0;
}
function getUserSeq() {
    let authority = "seq";
    return getStorageValue(authority);
}

/**
 * userName的获取
 */
var userName = getUserName();

function getUserName(){
    let authority = "username";
    return getStorageValue(authority);
}

function getStorageValue(item) {
    let localStorage = window.localStorage;
    return localStorage.getItem(item);
}

/**
 * 获取登录时的用户角色类型
 * @returns {Number}
 */
var consumerType = 1;
var vipType = 2;
var distriType = 3;
var agentType = 4;
function getLoginUserType() {
    if (isRoleVip()) {
        return vipType;
    } else if (isRoleDistributor()) {
        return distriType;
    } else if (isRoleAgent()) {
        return agentType;
    } else {
        return consumerType;
    }
}

/**
 第一个判断是微信内置浏览器
 第二个判断是Android QQ内置浏览器
 第三个判断是IOS QQ内置浏览器
 */
function browserType() {
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger"||ua.match(/WeiBo/i) == "weibo") {
        return 'weixin';
    }else if(ua.indexOf('mobile mqqbrowser')>-1){
        return 'qq';
    }else if(ua.match(/QQ/i) == "qq"){
        return 'qq';
    }
    return ''
}
function getGoodsProStandardSpecs(goodsProStandard){
    var specs = goodsProStandard.proStandAttached;
    var  selectSpec = ""
    if(specs != null) {
        var standardName1 = specs.standardName1;
        if(standardName1 != null) {
            selectSpec += standardName1 + ",";
        }
        var standardName2 = specs.standardName2;
        if(standardName2 != null) {
            selectSpec += standardName2 + ",";
        }
        var standardName3 = specs.standardName3;
        if(standardName3 != null) {
            selectSpec += standardName3 + ",";
        }
        var standardName4 = specs.standardName4;
        if(standardName4 != null) {
            selectSpec += standardName4 + ",";
        }
        var standardName5 = specs.standardName5;
        if(standardName5 != null) {
            selectSpec += standardName5 + ",";
        }
        var standardName6 = specs.standardName6;
        if(standardName6 != null) {
            selectSpec += standardName6 + ",";
        }
        var standardName7 = specs.standardName7;
        if(standardName7 != null) {
            selectSpec += standardName7 + ",";
        }
        var standardName8 = specs.standardName8;
        if(standardName8 != null) {
            selectSpec += standardName8 + ",";
        }
    }
    return selectSpec.substring(0, selectSpec.length -1);
}

//初始化一级分类banner图
function initCategoryBanner(banner){
    $("#advertisement").html(getBannerHtml(banner))
}

//根据一级分类id切换banner图
function attrCategory(categoryid){
    initCategoryBanner(getBannerByCategoryId(categoryid));
}

//根据一级分类id获取对应的一级分类
function getBannerByCategoryId(categoryid){
    if(categoryid == ""){
        return "";
    }
    //获取一级分类集合，根据一级分类id获取对应的一级分类
    var categoryList = resultData.data;
    for(var i = 0 ; i < categoryList.length ; i++){
        if(categoryid == categoryList[i].id){
            return categoryList[i];
        }
    }
    return "";
}

//获取分类banner图  html
function getBannerHtml(banner){
    if(banner == ""){
        //为空返回一个默认的banner图
       // return "<img src='"+classifiyImg()+"'/>";
        return "";
    }
    var imageLocation = banner.imageLocation;
    if(imageLocation == null || imageLocation == ""){
        imageLocation = classifiyImg();
        return "";
    }
    var jumpTarget = banner.jumpTarget == null ? "#" : banner.jumpTarget;
    return "<a href='" + jumpTarget + "'><img  src='" + imageLocation + "' /></a>";
}
//保存一级分类变量
var resultData;






//拼接图路径
// function appendImgPrefix(imageLocation){
//     if(imageLocation == "" || imageLocation == null || imageLocation == "null"){
//         return "";
//     }
//    return resultData.equipmentData + imageLocation;
// }

//一级分类默认banner  a
function classifiyImg(){
    return "/localQuickPurchase/distributionApp/images/classifiyImg8.png";
}

//获取搜索关键字
function getHistoryRides(){
    var historyWord = "";
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

/**
 * 领取优惠券
 * couponsId:优惠券标识
 * actBatchNo:活动批次号
 */
function getCoupon(couponsId,actBatchNo){
    var bool = false;
    //当前点击对象id
    if(couponsId != null && couponsId != ""){
        $.ajax({
            type: 'POST',
            url: '/localQuickPurchase/couponCardBagAction/receiveAllcoupon',
            async: false,
            data : {
                userSeq : seq,
                couponsId : couponsId,
                actBatchNo : actBatchNo
            },
            success: function (data) {
                if (data.code == 200) {
                    bool = true;
                }
            }
        });
    }
    return bool;
}



/**
 * 分享 type 0 图片分享，1 图文分享
 */
function webShare(url,title,digest,pic,className,type){
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        try{
            //点击分享  分享图片
            window.action.webShare(url,title,digest,pic,type)
        } catch (e){
            console.log(e);
            try{
                //点击分享  分享图文
                share520Love(url,title,digest,pic)
            } catch (e1){
                console.log(e1);
            }
        }
    } else{
        share520LoveWeb(url,title,digest,pic,className);
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
}
