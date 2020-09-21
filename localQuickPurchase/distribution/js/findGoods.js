//保存关键字cookie
function setCookie(name, value, iDay) {
	var oDate=new Date();

	oDate.setDate(oDate.getDate()+iDay);

	document.cookie=name+'='+encodeURIComponent(value)+';expires='+oDate;
}
//获取关键字cookie
function getCookie(name){
	var arr=document.cookie.split('; ');
	var i=0;
	for(i=0;i<arr.length;i++)
	{
		//arr2->['username', 'abc']
		var arr2=arr[i].split('=');

		if(arr2[0]==name)
		{  
			var getC = decodeURIComponent(arr2[1]);
			return getC;
		}
	}

	return '';
}
//删除关键字cookie
function removeCookie(name){
	setCookie(name, '1', -1);
}
/*function Window_Load(){
    setCookie("name","111"); //临时cookie
    setCookie("age","222",24 * 7);  //保存7天
    setCookie("address","333",24,"/"); //保存1天,path为根目录
     
    //设定cookie为安全的(secure=true),只能在HTTPS或与其他安全协议
    //连接在一起的时候才被传输
    setCookie("phone","444",24,"/",".",false);
    alert(document.cookie);
    alert(getCookie("age"));
     
    //删除名称为"age"的cookie
    removeCookie("age") 
    alert(document.cookie);
    //删除名称为"address"的cookie,因为设置时设定的path,所以删除
    //时也需要传入对应path
    removeCookie("address","/") 
    alert(document.cookie);  
   }
    
   function setCookie(name,value,hours,path,domain,secure){
       var cdata = name + "=" + value;
       if(hours){
           var d = new Date();
           d.setHours(d.getHours() + hours);
           cdata += "; expires=" + d.toGMTString();
       }
       cdata +=path ? ("; path=" + path) : "" ;
       cdata +=domain ? ("; domain=" + domain) : "" ;
       cdata +=secure ? ("; secure=" + secure) : "" ;
       document.cookie = cdata;
   }
    
   function getCookie(name){
       var reg = eval("/(?:^|;\\s*)" + name + "=([^=]+)(?:;|$)/"); 
       return reg.test(document.cookie) ? RegExp.$1 : "";
   }
    
   function removeCookie(name,path,domain){
       this.setCookie(name,"",-1,path,domain);
   }*/











