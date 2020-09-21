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
// 通过seq登录
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
// 获取登录后的userInfo
var userInfo = getCookie("userInfo");
var serverFanWei = getCookie("serverFanWei");
var userName = "";
var seq = 0;
var userType = "";
var FW = "";
if("" != userInfo){
	// 获取seq
	seq = getUserInfoText("SEQ",userInfo);
	// 获取 userName（mobile）
	userName = getUserInfoText("mobile",userInfo);
	// 获取userType
	userType = getUserInfoText("UT",userInfo);
	// 获取FW
	FW = getUserInfoText("FW",userInfo);
	/* 判断是否是主站那边登录,是的话重新登录一次 */
	var seqFormCookie = getCookie("seq");
	if(seq != seqFormCookie){
		loginBySeq();
	}
} else{
	setCookie("userName","",-1);
	setCookie("seq","",-1);
}
seq = parseInt(seq);
if(userName == "" || seq == ""){
	setCookie("userName","",-1);
	setCookie("seq","",-1);
	
	var urlFaest=window.location.href;
	var str=urlFaest.split("jspback");
	if(str.length==2){
		window.location.href = "login1.jsp";
	}
} else{
	setCookie("userName",userName,30);
	setCookie("seq",seq,30);
}

var serverLevel = "";
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
	
}

//$(".rightContent-header").append('<div class="person">欢迎您，'+userName+'！<a id="btn_exit" class="btn-exit">退出</a></div>');
