
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
        if(isMobile()){
            SaveAs5(url)
		}else{
            var a = '<a class="download" href="'+url+'" download="'+name+'"></a>';
            $('body').append(a);
            $(".download")[0].click()
		}
        // var browser = myBrowser();
		// if (browser === "IE" || browser === "Edge" || browser === "weixin" || browser === "qq") {
		// 	//IE
		// 	SaveAs5(url)
		// } else {
		// 	// var a = `<a class="download" href="${url}" download="${name}"></a>`;
         //    // $('body').append(a);
         //    // $(".download")[0].click()
		// }
	}
	
}

//判断浏览器类型
function myBrowser() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1;
	var ua = window.navigator.userAgent.toLowerCase();
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

	//判断是微信内置浏览器
    if(ua.match(/MicroMessenger/i)=="micromessenger"||ua.match(/WeiBo/i) == "weibo") {
        return 'weixin';
    }

    //判断是Android QQ内置浏览器
    if(ua.indexOf('mobile mqqbrowser')>-1){
        return 'qq';
    }

    //判断是IOS QQ内置浏览器
    if(ua.match(/QQ/i) == "qq"){
        return 'qq';
    }
}

function SaveAs5(imgURL) {
    var a = `<a class="download" href="${imgURL}" ></a>`;
    $('body').append(a);
    $(".download")[0].click()
	// var oPop = window.open(imgURL, "", "width=1, height=1, top=5000, left=5000");
	// for (; oPop.document.readyState != "complete";) {
	// 	if (oPop.document.readyState == "complete")
	// 		break;
	// }
	// oPop.document.execCommand("SaveAs");
	// oPop.close();
}

function savePicture(url) {

// 创建下载任务
    picurl=url;
//图片保存到手机后的路径
    picname="_downloads/shareRecuit.png.png";
    var dtask = plus.downloader.createDownload(picurl, {}, function ( d, status ) {
// 下载完成
        if ( status == 200 ) {
//	alert( "Download success: " + d.filename );
            plus.gallery.save(picname,function() {//保存到相册方法
                mui.toast('已保存到手机相册');
            }, function() {
                mui.toast('保存失败，请重试！');
            });
        } else {
//	alert( "Download failed: " + status ); 
        }
    });
//dtask.addEventListener( "statechanged", onStateChanged, false );
    dtask.start();//开始下载
}

function isMobile(){
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
        return true;
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        return true;
    } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
        return true;
    }
    return false;
}


