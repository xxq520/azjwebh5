
function shareSDK(url,title) {
    try{
    	/*var type=1;
		if(typeVal=="weixin"){
			type=1; 
		}else if(typeVal=="weixintimeline"){
			type=2; 
		}else if(typeVal=="qq"){
			type=3; 
		}else if(typeVal=="qzone"){
			type=4; 
		}else if(typeVal=="weibo"){
			type=5; 
		}*/
		console.log(url+" | "+title+" | ");
    	action.share(url,title);
    }catch(e){
		console.log(e);
    }
}

function getRealPath(){
	  //获取当前网址，如： http://localhost:8083/localQuickPurchase/view/my.jsp
	  var curWwwPath=window.document.location.href;
	  //获取主机地址之后的目录，如： localQuickPurchase/view/my.jsp
	  var pathName=window.document.location.pathname;
	  
	  var pos=curWwwPath.indexOf(pathName);
	  //获取主机地址，如： http://localhost:8083
	  var localhostPaht=curWwwPath.substring(0,pos);
	  
	  //获取带"/"的项目名，如：/localQuickPurchase
	  var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	 //得到了 http://localhost:8083/localQuickPurchase
	  var realPath=localhostPaht+projectName;
	  alert(realPath);
}

function getFullImgUrl(src){
	  //获取当前网址，如： http://localhost:8083/localQuickPurchase/view/my.jsp
	  var curWwwPath=window.document.location.href;
	  //获取主机地址之后的目录，如： localQuickPurchase/view/my.jsp
	  var pathName=window.document.location.pathname;
	  var pos=curWwwPath.indexOf(pathName);
	  //获取主机地址，如： http://localhost:8083
	  var localhostPaht=curWwwPath.substring(0,pos);
	  return localhostPaht + src;
}

function downLoadImg(url,name) {
	try{
		//调手机原生去下载；
		var link = getFullImgUrl(url);
		action.downImg(link);
	}catch (e) {
		var browser = myBrowser();
		if (browser === "IE" || browser === "Edge") {
			//IE
			SaveAs5(url)
		} else {
		    var $a = $("<a></a>").attr("href", url).attr("download", name);
		    $a[0].click();
		}
	}
	
}

//判断浏览器类型
function myBrowser() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1;
	//判断是否Opera浏览器
	if (isOpera) {
		return "Opera";
	}
	//判断是否Firefox浏览器
	if (userAgent.indexOf("Firefox") > -1) {
		return "FF";
	} 
	if (userAgent.indexOf("Chrome") > -1) {
		return "Chrome";
	}
	//判断是否Safari浏览器
	if (userAgent.indexOf("Safari") > -1) {
		return "Safari";
	} 
	//判断是否IE浏览器
	if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1
			&& !isOpera) {
		return "IE";
	}
	
	//判断是否Edge浏览器
	if (userAgent.indexOf("Trident") > -1) {
		return "Edge";
	} 
}

function SaveAs5(imgURL) {
	var oPop = window.open(imgURL, "", "width=1, height=1, top=5000, left=5000");
	for (; oPop.document.readyState != "complete";) {
		if (oPop.document.readyState == "complete")
			break;
	}
	oPop.document.execCommand("SaveAs");
	oPop.close();
}

