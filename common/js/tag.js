//选择绑定经销商提示信息
//var alertMessage = "尊敬的用户：欢迎您使用爱之家，您还没有上级经销商，您可以选择爱之家平台做为您的上级，或者是指定您熟悉的经销商为上级。选择上级将有利于您在爱之家的发展，更便于您升级为“自购省钱，分享赚钱”的代理商与经销商，请选择绑定。";
var alertMessage = 	'<div class="bindingRole">'+
						'<div class="topMessage">尊敬的用户：</div>'+
						'<div class="downMessage">欢迎您使用爱之家，您还没有上级经销商，您可以选择爱之家平台做为您的上级，或者是指定您熟悉的经销商为上级。选择上级将有利于您在爱之家的发展，更便于您升级为“自购省钱，分享赚钱”的代理商与经销商，请选择绑定。</div>'+
					'</div>';
/**
 <div class="scancode">
	<div class="set-goods-2">
		<div class="set-goods-2-title">
			支付成功
			<img src="${path}/distributionApp/images/localeRecruit/closeIco.png" />
		</div>
		<div class="set-goods-2-content">
			<p>您已成功升级为代理商，请退出账号再次登录查看权限。</p>
			<div class="set-goods-2-bottom">
				<button class="set-button-left">否</button>
				<button class="set-button-right">是</button>
			</div>
		</div>
	</div>
</div>
 */
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
/**
 * 验证是否登录
 * @returns
 */
function ifLogin() {
    console.log("登录的seq: " + seq);
    if (!isLogin()) {
        loginPage();
    }
}

/**
 * 校验手机号是否正确
 * @param str
 * @returns	false 不合格, true 合格
 */
function isPoneAvailable(str) {
    var myreg=/^[1][3,4,5,6,7,8,9,][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}
/**
 * 校验固话
 * @param str
 * @returns false 不合格, true 合格
 */
function checkPhone(str){
    var re = /^0\d{2,3}-?\d{7,8}$/;
    if(re.test(str)){
        return true;
    }else{
        return false;
    }
}
/**
 * 校验电话号码(手机号或者固定电话)
 * @param tel
 * @returns false 不合格, true 合格
 */
function checkTel(tel){
    if(isPoneAvailable(tel)|| checkPhone(tel)){
        return true;
    }else{
        return false;
    }
}
/**
 * 校验邮箱格式是否正确
 * @returns false 不合格, true 合格
 */
function isMail(mailStr) {
    //  /\w+[@]{1}\w+[.]\w+/
    var myemail = /^\w{3,}@\w+(\.\w+)+$/;
    if (!myemail.test(mailStr)) {
        return false;
    } else {
        return true;
    }
}

/**
 * 校验数字
 * @param tel
 * @returns false 不合格, true 合格
 */
function checkNumber(number){
    var telre = /^[0-9]*$/;
    if(!telre.test(number)){
        return false;
    } else {
        return true;
    }
}
/**
 * 校验字母
 * @param tel
 * @returns false 不合格, true 合格
 */
function checkLetter(letter){
    var telre = /^[a-zA-Z]*$/;
    if(!telre.test(letter)){
        return false;
    } else {
        return true;
    }
}
/**
 * 校验字母或数字
 * @param tel
 * @returns false 不合格, true 合格
 */
function checkLetOrNum(str){
    var telre = /^[0-9a-zA-Z]*$/;
    if(!telre.test(str)){
        return false;
    } else {
        return true;
    }
}


/**
 * 校验银行账号户名
 * @param peopleName
 * @returns  false 不合格, true 合格
 */
function checkPeopleName(peopleName){
    var telre = /^[a-zA-Z\u4e00-\u9fa5（）()]+$/;
    if(!telre.test(peopleName)){
        return false;
    } else {
        return true;
    }
}
/**
 * 校验用户名
 * @param peopleName
 * @returns
 */
function checkName(name){
    var telre = /^[\u4E00-\u9FA5]{1,6}$/;
    if(!telre.test(name)){
        return false;
    } else {
        return true;
    }
}

/**
 * 校验身份证号是否正确
 * @param str
 * @returns	false 不合格, true 合格
 */
function isIdCard(IdCardCode) {
    /*var patternMainLand = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    var patternHongkong = /^((\s?[A-Za-z])|([A-Za-z]{2}))\d{6}(\([0−9aA]\)|[0-9aA])$/;//香港
    var patternTaiwan = /^[a-zA-Z][0-9]{9}$/;//台湾
    var patternMacao = /^[1|5|7][0-9]{6}\([0-9Aa]\)/;//澳门
    var patternPassport = /^[a-zA-Z0-9]{3,10}$/;//护照
    if (patternMainLand.test(IdCardCode) || patternHongkong.test(IdCardCode) || patternTaiwan.test(IdCardCode) || patternMacao.test(IdCardCode) || patternPassport.test(IdCardCode)) {
        return true;
    } else {
        return false;
    }*/
    return true;
}

/**
 * 匿名用户
 * @param mobile
 * @returns {string}
 */
function cutMobile(mobile){
    var nmobile = "";
    if(mobile != null && mobile != "null"){
        nmobile = mobile.substring(0,3)+"****"+mobile.substring(mobile.length-4,mobile.length);
    }
    return nmobile;
}
/**
 * 验证密码正则（6-18字母加英文）
 * @param str
 * @return false 不符合,true 符合
 */
function ifRegular(pw){
    var reg = /^[0-9a-zA-Z]+$/;
    if(!reg.test(pw)){
        return false;
    }
    return true;
}
/**
 * wap支付站点
 * @param orderno 订单号
 * @param seq	购买者seq
 * @returns
 */
function payUrl(orderno, seq) {
    //在jsp获取的spring bean 配置中个url
    window.location.href =  payUrlBean + "&salenumber="+ orderno +"&seq="+ seq;
	/*var isWeixin = is_weixin();
	 if(isWeixin){
	 loadHtml();
	 loadStyleText(cssText);
	 window.location.href = "/localQuickPurchase/distributionVA/pay?salenumber="+ orderno+"&seq="+ seq;
	 }else{

	 }*/
}

/**
 * 获取随机数
 * @param random	随机数范围
 * @returns	返回一个随机数
 */
function getRandom(random) {
    return Math.round(Math.random() * random);
}
/**
 * 判断是否为微信打开
 */
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

/**
 * ios强制刷新
 * @returns
 */
function iosRe() {
    var isPageHide = false;
    window.addEventListener('pageshow', function () {
        if (isPageHide) {
            //alert("pageshow: " + isPageHide);
            window.location.reload(true);
        }
    });
    window.addEventListener('pagehide', function () {
        //alert("pagehide: " + isPageHide);
        isPageHide = true;
    });

}


/**
 * 没有图片时,加载默认图片
 * @returns
 */
function defaultImg(th) {
    console.log("成功加载默认图片!");
    th.src = "/localQuickPurchase/distributionApp/images/head.png";
}

/**
 * 获取url参数
 * @param name
 * @returns
 */
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }else{
        return "";
    }
}

/**
 * 截取小数点的保留数,只舍不入
 * @param price 需要截取的数据
 * @returns
 */
function cutPriceDown(price){
    price = parseFloat(price).toFixed(3);
    //先把数据转成字符串
    var priceStr = price.toString();
    //确定小数在第几位
    var index = priceStr.lastIndexOf(".");
    //把小数点后几位去掉
    var priceNew=priceStr.slice(0,index+3);
    //返回只舍不入的结果
    return priceNew;
}

/**parseFloat(platformPrice*1.15).toFixed(2)
 * 截取小数点的保留数,只入不舍
 * @param price 需要截取的数据
 * @returns
 */
function cutPriceUp(price){
    price = parseFloat(price).toFixed(3);
    //先把数据转成字符串
    var priceStr = price.toString();
    //确定小数在第几位
    var index = priceStr.lastIndexOf(".");
    //取把小数点后3位的值,如果为0就直接去掉,如果为非0就进1
    var a = priceStr[index+3];
    var priceNew = 0.0;
    if(a==0 || a==null){
        priceNew = cutPriceDown(price);
    }else{

        var a = cutPriceDown(price);
        priceNew = (parseFloat(a)+parseFloat(0.01));
    }
    //返回结果
    return priceNew;
}

/**
 * 处理利润的小数点（原则：只舍不入）
 * @param profits
 * @returns {string}
 */
function profitsPoint(profits){
    if(profits == null || profits == ""){
        return "0";
    }else{
        var f = Math.floor(profits * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }
};

/**
 * 直接获取小数点后两位
 * @param profits
 * @returns {number}
 */
function profitsMath(profits){
    return Math.round(profits*100)/100;
}

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 * @param num1加数1 | num2加数2
 */
function numAdd(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
};

/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param num1被减数  |  num2减数
 */
function numSub(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 * @param num1被乘数 | num2乘数
 */
function numMulti(num1, num2) {
    var baseNum = 0;
    try {
        baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
function numDiv(num1, num2) {
    var baseNum1 = 0, baseNum2 = 0;
    var baseNum3, baseNum4;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    with (Math) {
        baseNum3 = Number(num1.toString().replace(".", ""));
        baseNum4 = Number(num2.toString().replace(".", ""));
        return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
    }
};

/**
 * 生成随机验证码
 * @param n
 * @returns
 */
function getCode(n) {
	/*var all = "azxcvbnmsdfghjklqwertyuiop0123456789";
	 var b = "";
	 for (var i = 0; i < n; i++) {
	 var index = Math.floor(Math.random() * 28);
	 b += all.charAt(index);
	 }*/
    //return b;
    var randomNum = getRandom(9999) + "";
    if (randomNum.length < 4) {
        console.log("randomNum.length: " + randomNum.trim().length);
        console.log("randomNum: " + randomNum);
        randomNum += getRandom(9);
        console.log("拼接后的randomNum: " + randomNum);
    }
    return randomNum;
};

/**
 * 改变验证码
 * @returns
 */
function change(elmName) {
    code = getCode(4) + "  ";
    console.log("改变后的验证码: " + code);
    $(elmName).html(code);
}

/**
 * 根据省市区 + 详细地址得到完整的一个地址
 * @param tipName
 * @param address
 * @returns
 */
function getAddressStr(tipName, address) {
    var str = ''
    str = !!tipName ? tipName + address : address
    return str
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
    second = second < 10 ? ('0' + second) : second;
    //return y + '-' + m + '-' + d+'  '+h+':'+minute+':'+second;
    return y + '-' + m + '-' + d+' &nbsp;'+h+':'+minute;
};
Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

/**
 * 键盘录入后触发
 * @param va
 * @param th
 */
function keyup(va, th) {
    if (va.length == 1) {
        va = va.replace(/[^1-9]/g, '');
    } else {
        va = va.replace(/\D/g, '');
    }
    $(th).val(va);
}

/**
 * 粘贴后触发
 * @param va
 * @param th
 */
function cpup(va,th) {
    if (va.length == 1) {
        va = va.replace(/[^1-9]/g, '0');
    } else {
        va = va.replace(/\D/g, '');
    }
    $(th).val(va);
}
/**
 * 输入框只能输入数字和字母
 * @param th
 * @returns
 */
function numAndLetter(th) {
    var va = $(th).val().replace(/[^\w\.\/]/ig,'');
    $(th).val(va);
}
/**
 * 输入框禁用中文
 * @param th
 * @returns
 */
function banChinese(th) {
    var va = $(th).val();
    if (/[\u4E00-\u9FA5]/i.test(va)) {
        $(th).val('');
        // alert('有中文');
    } else {
        //alert('没有中文 通过');
    }
}

/**
 * 得到焦点
 */
function onfocusQuantity() {
    console.log("得到焦点");
}

/**
 * 加载中动画  异步有效
 * @param tipstxt
 */
function loadingdate(tipstxt) {

    var imgurl = "data:image/gif;base64,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";
    var loadingdiv = document.createElement("div");
    loadingdiv.id = "loadmask";
    loadingdiv.innerHTML = "<div class='loadmask' style='position:fixed;z-index:99999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.75);'><div class='uploadtips' style='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);font-size:14px;color:#fff;'><div class='loadingimg' style='text-align:center'><img style='width:40px;margin:0 0 10px' src='" + imgurl + "' /></div><p class='loadingtips' style='font-size:14px;color:#fff;text-align:center'>" + tipstxt + "</p></div></div>";
    if (document.querySelector("#loadmask")) {
        document.getElementById("loadmask").style.display = "block";
        document.querySelector(".loadmask").style.display = "block";

    } else {
        document.getElementsByTagName("body")[0].appendChild(loadingdiv);
    }

}

/**
 * 删除加载中动画
 **/
function clearLoading() {
    if(document.getElementById("loadmask")){
        document.body.removeChild(document.getElementById("loadmask"));
    }
}

/**
 * 数组去重
 * @param {} array
 */
function dedupe(array){
    return Array.from(new Set(array));
}
