/**
 * 获取url参数
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&|&amp;)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(decodeURI(r[2]));
    return null;
}
if(!window.Promise) {
    document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"'+'>'+'<'+'/'+'script>');
}

var isFirst = getCookie("isFirst");

function getCookie(cookName) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(cookName + "=");
        if (c_start != -1) { //存在
            if (c_start == 0) {
                c_start = c_start + cookName.length + 1; //"history="后的开始位置
                var c_end = document.cookie.indexOf(";", c_start); //找到JSESSIONID在的位置
                if (c_end == -1) { //JSESSIONID不存在
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            } else {
                c_start = document.cookie.indexOf("; " + cookName + "=");
                if (c_start != -1) { //存在
                    c_start = c_start + cookName.length + 3; //"history="后的开始位置
                    var c_end = document.cookie.indexOf(";", c_start); //找到JSESSIONID在的位置
                    if (c_end == -1) { //JSESSIONID不存在
                        c_end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
        }
    }
    return "";
}

function setCookie(cookName, cookValue, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays * 24 * 3600 * 1000);
    //exdate.setTime(exdate.getTime() + 60 * 1000);//过期时间 1分钟
    var cookieVal = cookName + "=" + escape(cookValue)
        + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
        + ";path=/";
    var hostname = window.location.hostname;
    if (hostname.indexOf("520shq.com") > 0) {
        cookieVal += ";domain=.520shq.com";
    }
    document.cookie = cookieVal;
}


function loginOffByBack() {

    setCookie("userName", "", -1);
    setCookie("serverFanWei", "", -1);
    setCookie("seq", "", -1);
    setCookie("distributorType", "", -1);
    setCookie("consumer", "", -1);
    setCookie("userInfo", "", -1);
    setCookie("headImg", "", -1);
    setCookie("headName", "", -1);
    setCookie("mydSeq", "", -1);
    setCookie("userGoodsHistory", "", -1);
    setCookie("comboType", "", -1);
    setCookie("isseq", "", -1);
    setCookie("serverLevel", "", -1);
    setCookie("nickName", "", -1);
    setCookie("forbidden", "", -1);
    setCookie("loginOff", "", -1);
    setCookie("JSESSIONID", "", -1);
    setCookie("shippingAddress", "", -1);
    setCookie("mobile", "", -1);
    try {
        $.cookie('shippingAddress', '', {expires: -1, path: '/'});
    } catch (e) {
    }
    //限制登录的日期   30分钟
    setCookie("listWeeks", "", -1);
    //限制登录的时间段  30分钟
    setCookie("listSaleTime", "", -1);
    //warrant 是否显示某个页面
    setCookie("flagAlertLogout", "", -1);
    setCookie("flagLogout", "", -1);
    setCookie("flagLogoutDate", "", -1);
    setCookie("warrant", "", -1);
    setCookie("investmentAccounts", "", -1);//现场招商封装数据rediesKey
    setCookie("investmentSeq", "", -1);//现场招商商家的seq
    setCookie("loginRetrunUrl", "", -1);//现场招商usr路径
    setCookie("isAdd", "", -1);
    var referrer = window.location.href;
    if (referrer != "") {
        if (referrer.indexOf("jump.html") == -1) {
            setCookie("shareSeq", "", -1);
        }
    } else {
        setCookie("shareSeq", "", -1);
    }
    setCookie("goodsLocalItems", "", -1); //按多规格统计购物车商品数量
    setCookie("enterpriseAgent", "", -1); //企业用户的角色
    setCookie("popupDistriIndex", "", -1);//网络店主弹窗控制(首页)
    setCookie("popupDistriOrder", "", -1);//网络店主弹窗控制(订单)

    //清除localStorage中所有的用户信息
    window.localStorage.clear();
    // 判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if (isappwebview) {
        // 退出登录后给app调用方法
        window.action.loginOut();
    }
}


function setHistory(address, city, point) {
    var stringCookie = getCookie('history');
    var list = stringCookie.split(",");
    var e = address + "|" + city + "|" + point;
    for (var i = 0; i < list.length; i++) {
        var add = list[i].split("|");
        try {
            if (add[0] == address) {
                list.splice(i, 1); //删除重复数据，开始位置,删除个数
                i = i - 1; //下标归位
            }
        } catch (e) {
            break;
        }
    }

    if (list.length >= historyCount) {
        //删除最开始的多余记录
        var count = list.length - historyCount + 1; //需要删除的个数
        list.splice(0, count); //开始位置,删除个数
    }

    list.push(e);//添加一个新的记录

    setCookie('history', list.toString(), 30); //30天
}


function getHistory() {
    var historyJSON = getCookie('history');
    if (historyJSON == "") {

    } else {
        var history = historyJSON.split(",");
        var length = history.length;
        if (length > historyCount) {
            length = historyCount;
        }
        //从最后一个浏览记录开始获取
        var historyHtml = "";
        for (var i = length - 1; i > 0; i--) {
            var text = history[i].split("|");
            if (i == length - 1) {
                //getPoint(text[0],text[1]);
            }
            historyHtml +=
                '<li class="downBox-li">' +
                '<div class="downBox-address" value="' + text[1] + '">' + text[0] + '</div>' +
                '<input type="hidden" class="downBox-point" value="' + text[2] + '"/>' +
                '</li>';
        }

        if (historyHtml != "") {
            $(".downBox ul").html(historyHtml);
        }
    }
}

//获取cookie值
function getUserInfoText(searchName) {
    if ("" != userInfo) {
        var start = userInfo.indexOf(searchName + "=");
        if (start != -1) { //存在
            start = start + searchName.length + 1;
            var end = userInfo.indexOf("&", start);
            var textValue = userInfo.substring(start, end);
            return textValue;
        }
        return "";
    }
    return "";
}


function getDistance(i) {
    if (i > 0 && i < 1000) {
        return i.toFixed(0) + '米';
    } else {
        return (i / 1000).toFixed(2) + '公里';
    }
};

//根据两点的经纬度算距离，单位米
var EARTH_RADIUS = 6378137.0;    // 单位M
var PI = Math.PI;

function getRad(d) {
    return d * PI / 180.0;
}

//获取2点间的距离
function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = getRad(lat1);
    var radLat2 = getRad(lat2);

    var a = radLat1 - radLat2;
    var b = getRad(lng1) - getRad(lng2);

    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;

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
    return y + '-' + m + '-' + d;
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
function fun_date(time, day) {
    var date2 = new Date(time);
    var time2 = date2.setDate(date2.getDate() + day);
    return time2;
}

//将时间转换成时间戳
function changeToData(date1) {
    var date = new Date(date1);
    return date.getTime();
}

//获取当天时间的时间戳
function getToData() {
    var date = new Date();
    return date.getTime();
}

//传入时间，返回时分
function AccordingTime(imputTime) {
    hour = Math.floor(imputTime / (1000 * 3600));
    minute = Math.floor(imputTime / (1000 * 60) - (hour * 60));
    if (hour > 1) {
        return hour + "小时" + minute + "分"
    } else {
        return minute + "分";
    }
}

//带天数的倒计时
function countDowns(timess, id) {
    var timer = null;
    var times = new Date(timess);
    timer = setInterval(function () {
        var day = 0,
            hour = 0,
            minute = 0,
            second = 0;//时间默认值
        if (times > 0) {
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
        console.log(day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒");
        if (day == 0) {
            document.getElementById(id).innerHTML = "还剩" + hour + "小时";
        } else {
            document.getElementById(id).innerHTML = "还剩" + day + "天" + hour + "小时";
        }
        times--;
    }, 1000);
    if (times <= 0) {
        clearInterval(timer);
    }
}

//根据对应的角色跳转的首页
function getMyJspUrl() {
    personalCenterUrl();
}

//loadScript 用于插入官方js
function loadScript(url, done) {
    var script = document.createElement('script');
    script.src = url;
    script.onload = onreadystatechange = function () {
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
function deviceDetect(str) {
    var u = navigator.userAgent;
    if (u.indexOf(str) > 0) {
        return true;
    } else {
        return false;
    }
}

//分享  可能会调用原生分享方法  注释
function share520Love(url, title, digest, pic, className) {
    if (title == "") {
        title = "爱之家商城分享";
    }
    if (pic == "") {
        pic = "http://nfxts.520shq.com:7050/localQuickPurchase/distributionApp/images/azj.png"
    }
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if (isappwebview) {
        try {
            // 调app原生分享     url、title 分享内容、图片链接
            window.action.shareGoods(url, title, digest, pic);
        } catch (e) {
            //调用新的生活圈，百业惠盟的App唤醒。

        }

        //window.action.qrcodeImgUrl(url);
    } else {
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
            sites: ['weixin', "weixintimeline", 'qq', 'weibo']
        });
    }
}
//判断是否是在小程序当中
function isMiniprogram() {
    var ua = navigator.userAgent.toLowerCase();
    //返回得是一个promise对象
    return new Promise(function(resolve, reject){
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
            //如果是小程序中打开则不显示分享方式弹窗，直接跳转至微信小程序分享界面
            wx.miniProgram.getEnv(function(res){
                if (res.miniprogram) {
                    //是否显示二维码图片分享选项
                    resolve(true)
                }else{
                    reject(false)
                }
                reject(false)
            })
        }else{
            reject(false)
        }
    });
}
//web端调用分享
function share520LoveWeb(url, title, digest, pic, className) {
    if (title == "") {
        title = "爱之家商城分享";
    }
    if (pic == "") {
        pic = "http://nfxts.520shq.com:7050/localQuickPurchase/distributionApp/images/azj.png"
    }
    try {
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
            //如果是小程序中打开则不显示分享方式弹窗，直接跳转至微信小程序分享界面
            wx.miniProgram.getEnv(function(res){
                if (res.miniprogram) {
                    //是否显示二维码图片分享选项
                    var ewmpic=$(".shareUL").css("display")==="none"?'':location.origin+$(".ewmcode img").attr("src");
                    var mttbrowserURL = appendToQuerysting(location.href, {__soshmbridge: 'weixin'});
                    var minProgramUrl = "/pages/share/share?url="+ encodeURIComponent(mttbrowserURL)+"&title="+ encodeURIComponent(title)+"&pic="+encodeURIComponent(pic) +"&ewm="+encodeURIComponent(ewmpic);
                    wx.miniProgram.navigateTo({url:minProgramUrl});
                    $(".share-block").css("visibility", "hidden");
                    $("#hui-mask").css("visibility", "hidden");
                    setTimeout(function(){
                        $("#hui-mask").css("display", "none");
                        $(".share-block").slideUp(100);
                    },0);
                    return
                }else{
                    showShareMenu()
                }
            })
        }else{
            showShareMenu()
        }
    }catch (e) {
        showShareMenu()
    }
    //格式化当前分享的链接
    function appendToQuerysting(url, obj) {
        var arr = [];
        for(var k in obj) {
            arr.push(k + '=' + obj[k]);
        }
        return url + (url.indexOf('?') !== -1 ? '&' : '?') + arr.join('&');
    }
    //如果不是小程序的中打开的话需要执行的事件
    function showShareMenu(){
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
            sites: ['weixin', "weixintimeline", 'qq', 'weibo']
        });
    }
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

//查看是否禁用登录
function checkSaleTime() {
    var listWeeksStr = getCookie("listWeeks");
    var listWeekArray = null;
    if (listWeeksStr != '') {
        listWeekArray = JSON.parse(listWeeksStr)
    }
    var listSaleTimeStr = getCookie("listSaleTime");
    var effectSaleTime = getCookie("effectSaleTime");
    var listSaleTimeArrayObject = null;
    if (listSaleTimeStr != '') {
        listSaleTimeArrayObject = JSON.parse(listSaleTimeStr)
    }
    if (listWeeksStr != '' && listSaleTimeStr != '' && effectSaleTime == 'true') {
        //标记是否提示
        var flagAlertLogout = false;
        var fal = getCookie("flagAlertLogout");
        var fl = getCookie("flagLogout");
        if (fal != "" && (fal == "true" || fal == true)) {
            flagAlertLogout = true;
        }
        //是否退出
        var flagLogout = false;
        var fl = getCookie("flagLogout");
        if (fl != "" && (fl == "true" || fl == true)) {
            flagLogout = true;
        }
        var d = new Date();
        var nowData = d.getDay();
        var nowHours = d.getHours();
        var nowMinutes = d.getMinutes();
        var show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
        var temp_show_day = show_day[nowData];
        if (listWeeksStr.indexOf(temp_show_day) > 0) {
            var listSaleTimeAllStr = "";
            for (var i = 0; i < listSaleTimeArrayObject.length; i++) {
                var saleTime = listSaleTimeArrayObject[i];
                listSaleTimeAllStr += saleTime.startTime
                listSaleTimeAllStr += ("-" + saleTime.endTime);
                if (i < listSaleTimeArrayObject.length - 1) {
                    listSaleTimeAllStr += "、";
                }
            }
            for (var i = 0; i < listSaleTimeArrayObject.length; i++) {
                var saleTime = listSaleTimeArrayObject[i];
                var endTime = (saleTime.endTime).split(":");
                var startTime = (saleTime.startTime).split(":");
                //限制时间段之前的5分钟   现在时间   0:58       限时 1:03
                if (parseInt(nowHours) == parseInt(startTime[0]) - 1 && ((parseInt(startTime[1]) + 60) - parseInt(nowHours) <= 5)) {
                    if (!flagAlertLogout) {//当前时间(小时)+1  ==  限制登录开始时间
                        hui.alert("您即将进入限制登录时段；限制时段为:" + listSaleTimeAllStr, "确认", function () {
                            flagAlertLogout = true;
                            setCookie("flagAlertLogout", flagAlertLogout, 0.01);
                        });
                    }
                    //限制时间段内    现在时间   1:58     开始时间  0:33   结束时间 2:20
                } else if (parseInt(nowHours) > parseInt(startTime[0]) && parseInt(endTime[0]) > parseInt(nowHours)) {
                    //已经  进入限制时间段内
                    if (!flagLogout) {
                        hui.alert("您已经进入限制登录时段，五分钟后将被强制下线；限制时段为:" + listSaleTimeAllStr, "确认", function () {
                            setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                            setCookie("flagLogout", true, 0.01);
                        });
                    } else {
                        executeLogout(false);
                    }
                    //当前时间小时 与开始时间小时相等或结束时间小时相等           现在时间   1:58     开始时间  1:33   结束时间 2:20
                } else if (parseInt(nowHours) == parseInt(startTime[0]) && parseInt(endTime[0]) > parseInt(nowHours)) {//当前时间  == 限制登录开始时间 (小时)
                    // 5分钟前提示
                    if ((parseInt(nowHours) == parseInt(startTime[0])) && parseInt(startTime[1]) - parseInt(nowMinutes) <= 5 && parseInt(startTime[1]) - parseInt(nowMinutes) > 0) {
                        if (!flagAlertLogout) {
                            hui.alert("您即将进入限制登录时段；限制时段为:" + listSaleTimeAllStr, "确认", function () {
                                flagAlertLogout = true;
                                setCookie("flagAlertLogout", flagAlertLogout, 0.01);
                            });
                        }
                        // 限制时间段内提示     现在时间   0:58       限时 1:03
                    } else if (parseInt(nowMinutes) > parseInt(startTime[1])) {
                        if (!flagLogout) {
                            hui.alert("您已经进入限制登录时段，五分钟后将被强制下线；限制时段为:" + listSaleTimeAllStr, "确认", function () {
                                setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                                setCookie("flagLogout", true, 0.01);
                            });

                        } else {
                            executeLogout(false);
                        }
                    }//else   还不在限定时间段内的
                    // 限制时间段内  现在时间   1:30    开始时间  0:33   结束时间 1:50
                } else if (parseInt(nowHours) > parseInt(startTime[0]) && (parseInt(endTime[0]) == parseInt(nowHours))) {//当前时间  == 限制登录开始时间 (小时)

                    // 限制时间段内提示     现在时间   0:58       限时 1:03
                    if (parseInt(endTime[1]) > parseInt(nowMinutes)) {
                        if (!flagLogout) {
                            hui.alert("您的账号处于限制登录时段，限制时段内无法登录；限制时段为:" + listSaleTimeAllStr, "确认", function () {
                                setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                                setCookie("flagLogout", true, 0.01);
                            });

                        } else {
                            executeLogout(false);
                        }
                    }
                    //当前时间  == 限制登录开始时间 (小时)
                } else if (parseInt(nowHours) == parseInt(startTime[0]) && (parseInt(endTime[0]) == parseInt(nowHours))) {

                    // 限制时间段内提示     现在时间   0:58       限时 1:03
                    if (parseInt(startTime[1]) - parseInt(nowMinutes) <= 5 && parseInt(startTime[1]) - parseInt(nowMinutes) >= 0) {
                        if (!flagAlertLogout) {
                            hui.alert("您即将进入限制登录时段；限制时段为:" + listSaleTimeAllStr, "确认", function () {
                                flagAlertLogout = true;
                                setCookie("flagAlertLogout", flagAlertLogout, 0.01);
                            });
                        }
                    } else if (parseInt(endTime[1]) > parseInt(nowMinutes) && parseInt(startTime[1]) < parseInt(nowMinutes)) {
                        if (!flagLogout) {
                            hui.alert("您已经进入限制登录时段，五分钟后将被强制下线；限制时段为:" + listSaleTimeAllStr, "确认", function () {
                                setCookie("flagLogoutDate", d.Format("yyyy-MM-dd hh:mm:ss"), 0.01);
                                setCookie("flagLogout", true, 0.01);
                            });

                        } else {
                            executeLogout(false);
                        }
                    }
                }
            }
        } else {
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
function executeLogout(fulfillment) {
    if (fulfillment) {
        loginOffByBack();
        window.location.href = "/localQuickPurchase/distributionVA/index";
    } else {
        var flagLogoutDate = getCookie("flagLogoutDate");
        var flagDate = new Date(flagLogoutDate);
        var tHours = flagDate.getHours();
        var tMinutes = flagDate.getMinutes();
        var d = new Date();
        var nHours = d.getHours();
        var nMinutes = d.getMinutes();
        // 5分钟后退出登录
        if ((parseInt(tHours) == parseInt(nHours)) && (parseInt(tMinutes) + 5 <= parseInt(nMinutes))) {
            loginOffByBack();
            window.location.href = "/localQuickPurchase/distributionVA/index";
        } else if (((parseInt(tHours) == parseInt(nHours) - 1)) && (parseInt(tMinutes) - 60 + 5 <= parseInt(nMinutes))) {
            loginOffByBack();
            window.location.href = "/localQuickPurchase/distributionVA/index";
        }
    }
}

var warrant = getCookie("warrant");

function findShopBySeq() {
    if (seq != null && seq != 0) {
        // 获取代理商昵称
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/localQuickPurchase/virtualShopAction/findShopBySeq',
            data: {
                'seq': seq
            },
            async: false,
            success: function (result) {
                console.log(result);
                if (result.code == 200) {
                    var data = result.data;
                    var warrant = data.virtualShop.warrant;
                    if (warrant == null) {
                        warrant = 0;
                    }
                    if (data.virtualShop.promptUser) {
                        var confirmStr = ""
                        if (data.virtualShop.inviterType == 2) {
                            confirmStr = "经销商(" + data.virtualShop.inviterMobile + ")正邀请您和他在爱之家一起购物!";
                        } else {
                            confirmStr = "代理商(" + data.virtualShop.inviterMobile + ")正邀请您和他在爱之家一起购物!";
                        }
                        hui.confirm(confirmStr, ['取消', '接受'], function () {
                            //console.log('确认后执行...');
                            promptUser(true);
                        }, function () {
                            //console.log('取消后执行...');
                            promptUser(false);
                        });
                    }
                    setCookie("warrant", warrant, 1);
                    var effectSaleTime = data.virtualShop.effectSaleTime;
                    setCookie("effectSaleTime", effectSaleTime, 1);
                    //默认的禁止登陆日期
                    listWeekArray = data.virtualShop.listWeeks;
                    listSaleTimeArray = data.virtualShop.listSaleTime;
                    if (listWeekArray != null) {
                        //限制登录的日期   15分钟
                        var listWeekArrayStr = JSON.stringify(listWeekArray);
                        if (listWeekArrayStr != getCookie("listWeeks")) {
                            setCookie("flagAlertLogout", "", -1);
                            setCookie("flagLogout", "", -1);
                            setCookie("flagLogoutDate", "", -1);
                        }
                        setCookie("listWeeks", listWeekArrayStr, 0.01);
                    }
                    //限制登录的时间段  15分钟
                    if (listSaleTimeArray != null) {
                        var listSaleTimeArrayStr = JSON.stringify(listSaleTimeArray);
                        if (listSaleTimeArrayStr != getCookie("listSaleTime")) {
                            setCookie("flagAlertLogout", "", -1);
                            setCookie("flagLogout", "", -1);
                            setCookie("flagLogoutDate", "", -1);
                        }
                        setCookie("listSaleTime", listSaleTimeArrayStr, 0.01);

                    }
                }
            }
        });
    }
}

$(function () {
    checkSaleTime()
});

function promptUser(promp) {
    var flag = promp == true;
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/localQuickPurchase/virtualShopAction/promptUser',
        data: {
            'seq': seq,
            'promp': flag
        },
        async: false,
        success: function (result) {

        }
    });
}

/**
 * 判断是否是在qq微信打开
 * @returns true 符合, false 不符合
 */
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/QQ/i) == "qq") {
        return true;
    } else {
        return false;
    }
}

var isWeixin = is_weixin();

//点击分享
$("body").on("click", ".soshm-item-icon", function () {
    isWeiXinShare();
});

/**
 * 获取分销价
 * @returns
 */
function getDistributionPrice(data) {
    var distributionPrice = data[0].distributionPrice;
    if (distributionPrice == null) {
        var costPrice = (data[0].platformPrice * 1.15).toFixed(2);
        ;
        distributionPrice = (costPrice * 1.2).toFixed(2);
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
function judgeCity(tipCity) {
    if (tipCity.indexOf("北京") != -1 || tipCity.indexOf("天津") != -1 || tipCity.indexOf("重庆") != -1 || tipCity.indexOf("上海") != -1) {
        tipCity = "";
    }
    return tipCity;
}

//旧数据要求用户重新填写地址,返回true
function judgeTipProvinceOld(judgeTipProvince) {
    if (judgeTipProvince == null || judgeTipProvince == "") {
        return true;
    } else {
        if (judgeTipProvince.indexOf("省") < 0 && judgeTipProvince.indexOf("天津") < 0 && judgeTipProvince.indexOf("北京") < 0 &&
            judgeTipProvince.indexOf("重庆") < 0 && judgeTipProvince.indexOf("上海") < 0 && judgeTipProvince.indexOf("宁夏") < 0
            && judgeTipProvince.indexOf("新疆") < 0 && judgeTipProvince.indexOf("西藏") < 0 && judgeTipProvince.indexOf("内蒙古") < 0
            && judgeTipProvince.indexOf("广西壮族")) {
            return true;
        } else {
            return false;
        }
    }
}

// 给手机段 获取二维码地址
function getEwmcode() {
    var href = window.location.href;
    var appUrl = href.substring(0, href.indexOf("localQuickPurchase/"));
    var qrcodeImgUrl = appUrl + $(".ewmcode img").attr("src");
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1;
    if (isappwebview) {
        // 调app原生方法  传给手机端二维码的链接
        window.action.qrcodeImgUrl(qrcodeImgUrl);
    }
}

function getGoodsDetailUrl(goodsId, distributorSeq, checkShare) {
    var url = "/localQuickPurchase/distributionVA/goodsDetail/" + goodsId + "/" + distributorSeq + "/" + distributorSeq;
    if (checkShare != null && checkShare != "") {
        url += "?checkShare=1&goodsId=" + goodsId + "&seq=" + distributorSeq;
    } else {
        url += "?goodsId=" + goodsId + "&seq=" + distributorSeq;
    }
    return url;
}

//删除指定数组元素,直接调用remove传入该元素即可
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

//判断数组是否包含某个元素
function ifArray(array, element) {
    for (var i = 0; i < array.length; i++) {
        var arr = array[i];
        if (arr === element) {
            return true;
        }
    }
}

//判断是否登录
function noLogin(type) {
    if (type == 0) {
        hui.confirm('为了给您提供完整的服务，请登录后再进行该操作', ['暂不登录', '马上登录'], function () {
            loginPage();
        });
    } else {
        hui.alert("为了给您提供完整的服务，请登录后再进行该操作", "确认", function () {
            loginPage();
        });
    }
}

//判断是否登录
function checkIsLogin(type) {
    if (!isLogin()) {
        noLogin(type);
        return;
    }
}


var scancodeState = 0;// 0 标示有未处理的订单
function showWaitOrderView() {
    console.info(scancodeState + "=========");
    if (seq == null || seq == "null" || seq == 0) {
        return;
    }
    if (scancodeState == 1) {
        return;
    }
    var cookieSeq = getUserSeq();
    if (cookieSeq == 0 || cookieSeq == "" || cookieSeq == null) {
        return;
    }
    var localParam = {seqSeller: cookieSeq, orderStatus: 33, deliveryMethod: 0, pageIndex: 1, pageSize: 10};
    var json = findlocaleRecruitOrder(localParam);
    if (json != null) {
        var list = json.data.list;
        for (var i = 0; i < list.length; i++) {
            var order = list[i];
            var orderno = order.orderno;
            var isLogistic = order.isLogistic;//是否是偏远地区
            isLogistic = isLogistic != null && isLogistic == "1" ? "0" : "0";
            var scancode_length = $(".waitOrder").length;
            ;
            if (scancode_length > 0) {
                $("#orderno").html(orderno);
                $(".waitOrder").show();
                if (isLogistic == "1") {
                    hui.alert("此订单是偏远地区订单", "确认", function () {
                        $(".waitOrder").show();
                    });
                } else {
                    $(".waitOrder").show();
                }
            } else {
                var html = '';
                html += '<div class="scancode waitOrder" style="background: rgba(0,0,0,0.5);height: 100%;top: 0;width: 100%;position: absolute;z-index: 999;box-sizing: border-box;">';
                html += '<div class="set-goods-21" style="height:9.5rem ; width: 13.2rem;background: #fff;position: absolute;top: 0;bottom: 0;right: 0;left: 0;margin: auto;border-radius: 5px;" >';
                html += '<div class="set-goods-2-title1" style=" height: 15%;width: 100%;text-align: center;color: #212121;font-size: 0.65rem;line-height: 1.6rem;position: relative;">';
                html += '发货提示';
                html += '</div>';
                html += '<div class="set-goods-2-content1" style="text-align: center;height: 80%;padding: 1rem 1.1rem 0rem 1.1rem;">';
                html += '<p style="color: #212121;font-size: 0.65rem;margin-bottom: 1.49rem;">您有一个订单为：<span id="orderno">' + orderno + '</span>的订单已付款，请发货</p>';
                html += '<div class="set-goods-2-bottom1" style="width: 100%;">';
                html += '<button class="set-button-left1 my" isLogistic=' + isLogistic + ' style="width: 5.3rem;height:1.32rem;text-align: center;line-height: 1.32rem;color: #ffffont-size: 0.65rem;float: left;background: #cccccc;border: none;outline: none;border-radius:5px ;">是</button>';
                html += '<button class="set-button-right1 platform" isLogistic=' + isLogistic + ' style="width: 5.3rem;height:1.32rem;ext-align: center;float: right;line-height: 1.32rem;color: #fff;background: #e4393c;font-size: 0.65rem;border: none;border-radius:5px ;outline: none;">否</button>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                //$("body").append(html);

                if (isLogistic == "1") {
                    hui.alert("此订单是偏远地区订单", "确认", function () {
                        $("body").append(html);
                    });
                } else {
                    $("body").append(html);
                }
            }
            scancodeState = 1;
            break;
        }
    }
}

//平台发货
$(document).on("click", ".platform", function () {
    $(".scancode").hide();
})

//我发货
$(document).on("click", ".my", function () {
    var orderno = $("#orderno").html();
    var json = fahuo(1, orderno);
    if (json != null) {
        hui.toast("发货成功");
    } else {
        hui.toast("发货失败");
    }
})

//发货方式    state的值 1 自己发货(经销商) 2 平台发货   3  补充发货(经销商触发的)
function fahuo(state, orderno) {
    scancodeState = 0;
    console.info(scancodeState + "=========");
    //var orderno = $("#orderno").html();
    var param = {"orderno": orderno, "deliveryMethod": state, "orderStatus": 2};
    var json = updateLocaleRecruitOrder(param);
    $(".scancode").hide();
    return json;
}

//定时器检查是否有未发货的订单
if (isRoleDealer()) {
    setInterval("showWaitOrderView()", 3000);
}

//更新订单状态
function updateLocaleRecruitOrder(param) {
    var json = null;
    $.ajax({
        type: "post",//定义提交的类型
        contentType: "application/json;charset=utf-8",
        url: "/localQuickPurchase/dOrders/updateLocaleRecruitOrder",
        dataType: "json",//设置返回值得类型
        data: JSON.stringify(param),
        async: false,//是否异步请求，false为同步
        success: function (result) {//成功返回值执行函数
            if (result.code == 200) {
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
function findlocaleRecruitOrder(localParam) {
    /*var json = null;
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
    return json;*/

}


function checkGoodsToBuy(goodstype, startTime, endTime) {
    if (goodstype == null || goodstype == 0) {
        return 4;
    }
    var date = new Date();
    var nowTime = Number(date);
    if (startTime == null || endTime == null || startTime == '' || endTime == '') {
        return 4;
    } else if (nowTime > startTime && nowTime < endTime) {
        return 1;
    } else if (nowTime > endTime) {
        return 3;
    } else if (nowTime < startTime) {
        return 0;
    } else {
        return -1;
    }
}

function beforeStartTime(operation, goodstype, startTime, endTime) {
    var result = {"code": 200, "msg": "ok"};
    var code = checkGoodsToBuy(goodstype, startTime, endTime);
    if (code == 0) {
        result.code = "300";
        result.msg = "商品还没开始预售！";
    }
    return result;
}

//判断是否可以添加购物车
function addCar(operation, goodstype, startTime, endTime) {
    var result = {"code": 200, "msg": "ok"};
    var code = checkGoodsToBuy(goodstype, startTime, endTime);
    if (code == 1) {
        result.code = "300";
        result.msg = "在预售期中不能加入购物车！";
    } else if (code == 0) {
        result.code = "400";
        result.msg = "商品还没开始预售,不能加入购物车！";
    }
    return result;
}

//判断是否可以下单
function addOrder(goodstype, startTime, endTime) {
    var result = {"code": 200, "msg": "ok"};
    var code = checkGoodsToBuy(goodstype, startTime, endTime);
    if (code == 0) {
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
function goodsOperation(operation, goodstype, startTime, endTime) {
    var result = {"code": 200, "msg": "ok"};
    if (goodstype == 0) {
        return result;
    }
    if (operation == 0) {//添加购物车
        result = addCar(operation, goodstype, startTime, endTime);
    } else if (operation == 1) {//下单
        result = addOrder(operation, goodstype, startTime, endTime);
    } else if (operation == 2) {
        result = beforeStartTime(operation, goodstype, startTime, endTime);
    }
    return result;
}

//预售商品列表入口
$(document).on('click', '.yGoods', function () {
    window.location.href = "/localQuickPurchase/distributionVA/bookingGoods";
});


//设置的定时器
function show_time(endTime, timeServerClient, dataIndex) {

    var timerDay = document.getElementById("day" + dataIndex);
    var timerHour = document.getElementById("hour" + dataIndex);
    var timerMinute = document.getElementById("minute" + dataIndex);
    var timerSecond = document.getElementById("second" + dataIndex);
    if (!timerDay || !timerHour || !timerMinute || !timerSecond) {
        return;
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
    var time_now, timeDistance, strTime;  //1.当前时间		2.时间距离		3.拼接输出时间
    var day, hour, minute, second;  //1.天数		2.小时		3.分钟	4.秒
    //每秒钟都获取一次当前时间
    var time_now = new Date();
    //time_now = time_now.getTime();
    // 剩余时间 = 结束(开始)时间 - 当前时间
    //timeDistance = endTime-time_now;
    timeDistance = timeServerClient;
    timeServerClient = endTime - time_now;
    if (timeDistance > 0) {
        day = Math.floor(timeDistance / 86400000)  //计算天数
        timeDistance -= day * 86400000;
        hour = Math.floor(timeDistance / 3600000)  //计算小时
        timeDistance -= hour * 3600000;
        minute = Math.floor(timeDistance / 60000)  //计算分钟
        timeDistance -= minute * 60000;
        second = Math.floor(timeDistance / 1000)  //计算秒数

        //如果只剩下个位数，则在十位数加上0
        if (hour < 10)
            hour = "0" + hour;
        if (minute < 10)
            minute = "0" + minute;
        if (second < 10)
            second = "0" + second;

        //拼接时间
        //strTime=day+"天"+hour+"小时"+minute+"分钟"+second+"秒";

        //定时器输出时间
        timerDay.innerHTML = day + "天";
        timerHour.innerHTML = hour + "时";
        timerMinute.innerHTML = minute + "分";
        timerSecond.innerHTML = second + "秒";
        //每秒循环执行
        setTimeout("show_time(" + endTime + "," + timeServerClient + "," + dataIndex + ")", 1000);
    } else {//倒计时结束执行的操作
        timerHour.innerHTML = "00";
        timerMinute.innerHTML = "00";
        timerSecond.innerHTML = "00";
        clearTimeout("活动时间已结束！！！");
    }
}

/**
 * 商品默认图片加载
 */
function defaultGoodsImg(goodsImg) {
    var defGoodsImg = "/localQuickPurchase/distributionApp/images/goodsImg.png";
    if (goodsImg == null || goodsImg == "") {
        goodsImg = defGoodsImg;
    }
    return goodsImg;
}

/**
 * 设置绑定关系弹窗次数
 */
function setBindingWindowsVal(bindingWindows) {
    if (bindingWindows == "zero") {
        setCookie("bindingWindows", "one", 1);//用户绑定弹窗控制（一天弹窗三次）
    } else if (bindingWindows == "one") {
        setCookie("bindingWindows", "two", 1);//用户绑定弹窗控制（一天弹窗三次）
    } else {
        setCookie("bindingWindows", "three", 1);//用户绑定弹窗控制（一天弹窗三次）
    }
}

//查询商家的入住信息
function isMerchantEnter() {
    var rs = {"code": 400, "msg": "ok"};
    $.ajax({
        type: 'get',
        dateType: 'JSON',
        url: '/localQuickPurchase/merchantEnter/tmerchant',
        async: false,	//是否异步请求，false为同步
        data: {seq: getUserSeq(), terType: "1"},
        success: function (data) {
            if (data.code == 200) {
                var result = data.data;
                if (result == null) {
                    rs.msg = "";
                    rs.code = 200;
                    //location.href = "/localQuickPurchase/distributionVA/localeRecruit/merchantEnter"
                    return result;
                } else {
                    var status = result.status;
                    if (status == -3) {
                        rs.code = 330;
                        rs.msg = "尊敬的用户，您提交的入驻资料审核不通过，请重新提交";
                        //hui.alert(rs.msg);
                    } else if (status == -2) {
                        rs.code = 300;
                        rs.msg = "您的申请已删除";
                    } else if (status == -1) {
                        rs.code = 310;
                        rs.msg = "您的申请已禁用";
                    } else if (status == 1 || status == 0) {
                        rs.code = 320;
                        rs.msg = "系统已收到您的申请，请耐心等待审核";
                    } else if (status == 2) {
                        rs.code = 210;
                        rs.msg = "恭喜您通过商家入驻审核，您已具备现场招商权限";
                    }
                    //hui.alert(rs.msg);
                }
            }
        },
        error: function (error) {
            clearLoading();
            hui.iconToast("请求异常", "error");
        }
    });
    return rs;
}

try {
    (function () {
        var supportsOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange == 'object');
        var HTMLNode = document.body.parentNode;
        var updateOrientation = function () {
            // rewrite the function depending on what's supported
            if (supportsOrientation) {
                updateOrientation = function () {
                    var orientation = window.orientation;

                    switch (orientation) {
                        case 90:
                        case -90:
                            orientation = 'landscape';
                            break;
                        default:
                            orientation = 'portrait';
                    }

                    // set the class on the HTML element (i.e. )
                    HTMLNode.setAttribute('class', orientation);
                }
            } else {
                updateOrientation = function () {
                    // landscape when width is biggest, otherwise portrait
                    var orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';

                    // set the class on the HTML element (i.e. )
                    HTMLNode.setAttribute('class', orientation);
                }
            }

            updateOrientation();
        }
        var init = function () {
            // initialize the orientation
            updateOrientation();

            if (supportsOrientation) {
                window.addEventListener('orientationchange', updateOrientation, false);
            } else {
                // fallback: update every 5 seconds
                setInterval(updateOrientation, 5000);
            }

        }
        window.addEventListener('DOMContentLoaded', init, false);
    })();

} catch (e) {

}

//获取访问域名
function getRootPath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var path = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = path.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = path.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
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

//按多规格统计购物车商品数量
function goodsLocalItem() {
    $.ajax({
        type: "GET", // 定义提交的类型
        url: "/localQuickPurchase/dCart/getCartNum",// 请求的地址
        dataType: "json", // 设置返回值得类型
        data: {"userName": getUserName()},
        async: true, // 是否异步请求，false为同步
        success: function (data) { // 成功返回值执行函数
            if (data.code == 200) {
                var goodsLocalItems = data.data;
                setCookie("goodsLocalItems", goodsLocalItems);
                if (goodsLocalItems > 0) {
                    var goodsNumber = document.getElementById("goodsNumber");
                    if (goodsNumber) {
                        goodsNumber.innerHTML = goodsLocalItems;
                    }
                }
            }
        },
        error: function () {

        }
    });
}

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

/**
 第一个判断是微信内置浏览器
 第二个判断是Android QQ内置浏览器
 第三个判断是IOS QQ内置浏览器
 */
function browserType() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/WeiBo/i) == "weibo") {
        return 'weixin';
    } else if (ua.indexOf('mobile mqqbrowser') > -1) {
        return 'qq';
    } else if (ua.match(/QQ/i) == "qq") {
        return 'qq';
    }
    return ''
}

function getGoodsProStandardSpecs(goodsProStandard) {
    var specs = goodsProStandard.proStandAttached;
    var selectSpec = ""
    if (specs != null) {
        var standardName1 = specs.standardName1;
        if (standardName1 != null) {
            selectSpec += standardName1 + ",";
        }
        var standardName2 = specs.standardName2;
        if (standardName2 != null) {
            selectSpec += standardName2 + ",";
        }
        var standardName3 = specs.standardName3;
        if (standardName3 != null) {
            selectSpec += standardName3 + ",";
        }
        var standardName4 = specs.standardName4;
        if (standardName4 != null) {
            selectSpec += standardName4 + ",";
        }
        var standardName5 = specs.standardName5;
        if (standardName5 != null) {
            selectSpec += standardName5 + ",";
        }
        var standardName6 = specs.standardName6;
        if (standardName6 != null) {
            selectSpec += standardName6 + ",";
        }
        var standardName7 = specs.standardName7;
        if (standardName7 != null) {
            selectSpec += standardName7 + ",";
        }
        var standardName8 = specs.standardName8;
        if (standardName8 != null) {
            selectSpec += standardName8 + ",";
        }
    }
    return selectSpec.substring(0, selectSpec.length - 1);
}

//判断是否展示立即下单按钮
function getTimeBool(currentTime, beginTime) {
    var timeBool = false;
    if (currentTime > beginTime) {
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
        if (sellActivityQuantity < activityQuantity) {
            bool = true;
            break;
        }
    }
    return bool;
}


/**
 * 判断是否是微信端
 * @returns {boolean}
 */
function isWeixinClient() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

/**
 *
 * @param url 目标url
 * @param arg 需要替换的参数名称
 * @param arg_val 替换后的参数的值
 * @returns {string} 参数替换后的url
 */
function changeURLArg(url, arg, arg_val) {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + arg_val;
    if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        return tmp;
    } else {
        if (url.match('[\?]')) {
            return url + '&' + replaceText;
        } else {
            return url + '?' + replaceText;
        }
    }
    return url + '\n' + arg + '\n' + arg_val;
}

//初始化一级分类banner图
function initCategoryBanner(banner) {
    $("#advertisement").html(getBannerHtml(banner))
}

//根据一级分类id切换banner图
function attrCategory(categoryid) {
    initCategoryBanner(getBannerByCategoryId(categoryid));
}

//根据一级分类id获取对应的一级分类
function getBannerByCategoryId(categoryid) {
    if (categoryid == "") {
        return "";
    }
    //获取一级分类集合，根据一级分类id获取对应的一级分类
    var categoryList = resultData.data;
    for (var i = 0; i < categoryList.length; i++) {
        if (categoryid == categoryList[i].id) {
            return categoryList[i];
        }
    }
    return "";
}

//获取分类banner图  html
function getBannerHtml(banner) {
    if (banner == "") {
        //为空返回一个默认的banner图
        // return "<img src='"+classifiyImg()+"'/>";
        return "";
    }
    var imageLocation = banner.imageLocation;
    if (imageLocation == null || imageLocation == "") {
        imageLocation = classifiyImg();
        return "";
    }
    var jumpTarget = banner.jumpTarget == null ? "#" : banner.jumpTarget;
    return "<a href='" + jumpTarget + "'><img  src='" + imageLocation + "' /></a>";
}

//保存一级分类变量
var resultData;

//一级分类默认banner  a
function classifiyImg() {
    return "/localQuickPurchase/distributionApp/images/classifiyImg8.png";
}

//获取搜索关键字
function getHistoryRides() {
    var historyWord = "";
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: '/localQuickPurchase/hotWord/findHistorySearch',
        data: {
            "seq": seq
        },
        async: false,
        success: function (data) {
            if (data.code == 200) {
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
function getCoupon(couponsId, actBatchNo) {
    var bool = false;
    //当前点击对象id
    if (couponsId != null && couponsId != "") {
        $.ajax({
            type: 'POST',
            url: '/localQuickPurchase/couponCardBagAction/receiveAllcoupon',
            async: false,
            data: {
                userSeq: getUserSeq(),
                couponsId: couponsId,
                actBatchNo: actBatchNo
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
function webShare(url, title, digest, pic, className, type) {
    //判断是否是app
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if (isappwebview) {
        try {
            //点击分享  分享图片
            window.action.webShare(url, title, digest, pic, type)
        } catch (e) {
            console.log(e);
            try {
                //点击分享  分享图文
                share520Love(url, title, digest, pic)
            } catch (e1) {
                console.log(e1);
            }
        }
    } else {
        share520LoveWeb(url, title, digest, pic, className);
        hui.dialogBase();
        $(".share-block").slideDown(200);
    }
}


/**
 *非会员
 * @type {string}
 */
var consumer = "1";
/**
 * 会员
 * @type {string}
 */
var vip = "2";
/**
 * 代理商
 * @type {string}
 */
var agent = "3";
/**
 * 企业级代理商(enterprise_agent)
 * @type {string}
 */
var eAgent = "4";
/**
 * 经销商
 * @type {string}
 */
var dealer = "5";
/**
 * 企业级经销商(enterprise_dealer)
 * @type {string}
 */
var eDealer = "6";


//跳转未登录页面
function noLoginPage() {
    window.location.href = "/upms/static/noLogin.html";
}

//跳转个人中心页面
function personalCenter() {
    window.location.href = personalCenterUrl();
}

//个人中心页面链接
function personalCenterUrl() {
    return "/upms/static/personalCenter.html";
}

//跳转登录页面
function loginPage() {
    window.location.href = loginPageUrl();
}

//登录页面地址
function loginPageUrl() {
    return "/upms/static/login.html";
}

// 获取省市区
function  getLocation(){
    var myCity = new BMap.LocalCity();
    return new Promise(function(resolve, reject){
        myCity.get(function (result) {
            var myGeo = new BMap.Geocoder();
            var point = new BMap.Point(result.center.lng, result.center.lat);
            myGeo.getLocation(point, function(rs){
                var addComp = rs.addressComponents;
                resolve(addComp)
            })
        });
    });
}

/**
 * 判断是否登录
 */
//调手机原生去下载；
var u = navigator.userAgent;
var isappwebview = u.indexOf('app_webview') > -1;

function isLogin() {
    if (isappwebview) {
        return userName != null && userName != "";
    } else if (compatibleStorage()) {
        if (window.localStorage.getItem("authority") == null) {
            return compatibleAppIsLogin();
        }
        return true;
    } else {
        var cookie = getCookie("authority");
        if (cookie == null || cookie === "") {
            return compatibleAppIsLogin();
        }
        return true;
    }
}

//经销商权限
function getUserWarrant() {
    if (isRoleDealer()) {
        var getUserWarrant = {
            type: "GET",//定义提交的类型
            url: "/upms/virtualShop/getUserWarrant",
            dataType: "json",//设置返回值得类型
            data: {},
            async: false,//是否异步请求，false为同步
            success: function (data) {//成功返回值执行函数
                if (data.code == 1000) {
                    var warrant = data.data;
                    setCookie("warrant", warrant, 30);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        };
        refresh(getUserWarrant);
    }
}

var jumpStation = "";

/**
 * 登录成功
 */
function loginSuccess() {
    //如果从邀请页面进来注册登录的走邀请页流程，否则走正常流程
    var jumpHtml = getCookie("referrer");
    if (jumpHtml != null && jumpHtml.indexOf("jump.html") > -1) {
        jumpIntoStation();
        window.location.href = jumpStation;
    } else {
        var referrer = document.referrer;
        if (referrer == "") {
            personalCenter();
            return false;
        } else {
            if (referrer.indexOf("resetpw.html") > -1 || referrer.indexOf("register.html") > -1 || referrer.indexOf("findback.html") > -1) {
                if (loginReturnUrl()) {
                    return false;
                } else {
                    personalCenter();
                    return false;
                }
            }
        }

        var _href = location.href;
        if (_href.indexOf("oauthLogin.html") > -1 || _href.indexOf("weChatBindTel.html") > -1 || _href.indexOf("register.html") > -1) {
            if (loginReturnUrl()) {
                return false;
            } else {
                personalCenter();
                return false;
            }
        } else {
            if (referrer.indexOf("jump.html") > -1) {
                jumpIntoStation();
                window.location.href = jumpStation;
            } else {
                window.location.href = referrer;
            }
        }
    }

    return false;
}

function jumpIntoStation() {
    var seq = getCookie("seq");
    var shareSeq = getCookie("shareSeq");
    if (seq == null || seq == undefined || seq == "") {
        var storage = window.localStorage;
        seq = storage.getItem("seq");
    }
    $.ajax({
        type: "get",//定义提交的类型
        url: "/localQuickPurchase/brandSquare/queryEntityBySeq",
        dataType: "json",//设置返回值得类型
        data: {
            "seq": seq
        },
        async: false,//是否异步请求，false为同步
        success: function (data) {//成功返回值执行函数
            if (data.code == 200 || data.code == 202) {
                jumpStation = "/localQuickPurchase/distributionVA/brandSquare/supplierCompanyInfo?shareSeq=" + shareSeq;
            } else {
                hui.toast("商家不能入驻");
                return;
            }
        },
    });
}

/**
 * 根据Cookie中的存放的返回值调整
 */
function loginReturnUrl() {
    var loginRetrunUrl = getCookie("loginRetrunUrl");
    if (loginRetrunUrl != null && loginRetrunUrl !== "") {
        window.location.href = loginRetrunUrl;
        return true;
    }
    return false;
}

var shareSeq = getCookie("shareSeq"); //分享人seq
//密码登录
var validation = 0; //没登录过或长期不登录验证用
var investmentSeq = getCookie("investmentSeq");//现场招商商家的seq
var investmentAccounts = getCookie("investmentAccounts");//现场招商用户勾选礼包数据封装的redisKey
var enterpriseShareSeq = getQueryString("enterpriseShareSeq");//企业级代理商的邀请人seq
var generalAgent = getQueryString("generalAgent");//邀请品牌入驻标识

//获取分享人id
function getShareId() {
    //分享人Id
    if (shareSeq != null && shareSeq != "") {
        return shareSeq;
    }
    //现场招商 分享人Id
    if (investmentSeq != null && investmentSeq != "") {
        return investmentSeq;
    }
    //企业级代理商 分享人Id
    if (enterpriseShareSeq != null && enterpriseShareSeq != "") {
        return enterpriseShareSeq;
    }
}

/**
 * 当前用户是否为普通用户
 * @returns {boolean}
 */
function isRoleConsumer() {
    if (!isLogin()) {
        return false;
    }
    return consumer === getRoleType();
}

/**
 * 当前用户是否为Vip
 * @returns {boolean}
 */
function isRoleVip() {
    if (!isLogin()) {
        return false;
    }
    return vip === getRoleType();
}

/**
 * 当前用户是否为代理商/企业代理商
 * @returns {boolean}
 */
function isRoleAgent() {
    if (!isLogin()) {
        return false;
    }
    return agent === getRoleType() || isRoleEAgent();
}

/**
 * 当前用户是否为企业代理商
 * @returns {boolean}
 */
function isRoleEAgent() {
    if (!isLogin()) {
        return false;
    }
    return eAgent === getRoleType();
}

/**
 * 当前用户是否为经销商/企业级经销商
 * @returns {boolean}
 */
function isRoleDealer() {
    if (!isLogin()) {
        return false;
    }
    return dealer === getRoleType() || isRoleEDealer();
}

/**
 * 当前用户是否为企业级经销商
 * @returns {boolean}
 */
function isRoleEDealer() {
    if (!isLogin()) {
        return false;
    }
    return eDealer === getRoleType();
}

/**
 * 获取用户角色类型
 */
function getRoleType() {
    var authorityKey = "authority";
    var authority = getStorageValue(authorityKey);
    if (authority == null) {
        return compatibleAppRole();
    }
    return authority;
}

/**
 * 用户SEQ的获取
 */
var seq = getUserSeq();
var userSeq = seq;
if (seq == null || seq == undefined || seq == "") {
    seq = 0;
}

function getUserSeq() {
    var authority = "seq";
    var seq = getStorageValue(authority);
    if (seq == null || seq === "") {
        seq = compatibleAppSeq();
    }
    if (seq != "") {
        return parseInt(seq);
    }
    return seq;
}

/**
 * userName的获取
 */
var userName = getUserName();

function getUserName() {
    var authority = "username";
    var user_name = getStorageValue(authority);
    if (user_name == null || user_name === "") {
        return compatibleAppUserName();
    }
    return user_name;
}

function getStorageValue(item) {
    if (!compatibleStorage()) {
        return getCookie(item);
    }
    return window.localStorage.getItem(item);
}

/**
 * 获取登录时的用户角色类型
 * @returns {Number}
 */
function getLoginUserType() {
    return getRoleType();
}

//是否兼容Storage
function compatibleStorage() {
    return window.Storage && window.localStorage && window.localStorage instanceof Storage;
}

/**
 * 兼容App H5页面
 * @returns {*|string}
 */
function compatibleAppIsLogin() {
    var compatibleAppRole = getCookie("roleType");
    return compatibleAppRole != null && compatibleAppRole !== "";
}

function compatibleAppRole() {
    return getCookie("roleType");
}

function compatibleAppSeq() {
    return getCookie("seq");
}

function compatibleAppUserName() {
    return getCookie("userName");
}

/*判断是否是数字或者字母，是:true 不是:false*/
function checkPassWord(nubmer) {
    var re = /^[0-9a-zA-Z]*$/;  //判断字符串是否为数字和字母组合
    if (!re.test(nubmer)) {
        return false;
    } else {
        return true;
    }
}

/**
 *判断是否是数字
 *
 **/
function isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，
    if (val === "" || val == null) {
        return false;
    }
    if (!isNaN(val)) {
        //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
        //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
        return true;
    } else {
        return false;
    }
}

function verifyAutonymVerify(autonymVerify) {
    if (null == autonymVerify || "" == autonymVerify) {
        return false;
    }
    if (autonymVerify.length > 18) {
        return false;
    }
    return true;
}

/*消费券 lingqinchang 2019 11 11*/
function shopgd(seq) {
    var result = null;
    var code = 1034;
    var deviceType = "PC";
    var type = 2;
    var incomeSpending = 0;
    var source = 101;
    var pageSize = 10;
    var pageIndex = 1;
    $.ajax({
        type: "POST",//定义提交的类型
        headers: {"Content-Type": "application/json"},
        url: "/localQuickPurchase/selectionGoods/SelecsCoupon",
        data: JSON.stringify({
            seq: seq,
            pageIndex: pageIndex,
            pageSize: pageSize
        }),
        dataType: "json",//设置返回值得类型
        async: false,//是否异步请求，false为同步
        success: function (data) {//成功返回值执行函数
            if (data.code == 200) {
                result = data.data;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error');
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    });
    return result;
}

/*是否显示优惠券*/
function isShowCoupon() {
    var Coums = shopgd(seq)
    //会员和非会员和没有登录的要显示
    if (isRoleVip() || !getRoleType()) {
        return true;
    } else if ((isRoleAgent() || isRoleDealer) && Coums <= 100) { //代理商和企业代理商并且优惠券小于100小显示
        return true;
    }
    return false;
}

function imgInit(img, type, Coums) {
    if ((type == 3 || type == 4) && Coums > 100) {

    } else if (type == 1 || type == 2) {

    } else if (type == 5 || type == 6) {
        img = '';
    }
    return img;
}