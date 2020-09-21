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
if(userInfo!=""){
	var seqStart = userInfo.indexOf("SEQ=");
	if(seqStart != -1){ //存在  
		seqStart = seqStart + 4;
		var seqEnd=userInfo.indexOf("&",seqStart);
		userSeq = userInfo.substring(seqStart, seqEnd);
	}
}

