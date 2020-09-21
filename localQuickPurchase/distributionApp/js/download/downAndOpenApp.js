//(function(){
    var ua = navigator.userAgent.toLowerCase();
    //config 配置文件 JS 传递 scheme  客户端进行匹配
    //scheme_IOS IOS端必要参数
    //scheme_Adr 安卓端必要参数
    //download_url_Adr download_url_IOS 下载地址  timeout 过期时间
    var config = {
        //scheme:必须
        //爱之家
        scheme_IOS:"lovefenxiao://",
        scheme_Adr:"com.huaxiang.fenxiao://",
        download_url_Adr : "https://sj.qq.com/myapp/detail.htm?apkName=com.huaxiang.fenxiao",
        download_url_IOS : "https://itunes.apple.com/app/id1329942009",//爱之家
        timeout : 600
        //批发
        // scheme_IOS: "ord ersys://",//'demo://',
        // scheme_Adr: "order://order.app/openwith",//'demo://start'
        // //download_url_Adr: "http://dh.520shq.com/dowAPK/shq_business_v1.0.0.apk",//document.getElementById('J-download-Adr').value,
        // download_url_Adr: "https://sj.qq.com/myapp/detail.htm?apkName=com.haolong.order",
        // download_url_IOS: "itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=1243425475",//document.getElementById('J-download-IOS').value,// ,
        // timeout: 600
    };

    function openclient() {
        //判断是安卓 还是IOS
        if (/iphone|ipad|ipod/.test(ua)) {
            // topHide();
            window.location.href = config.download_url_IOS;
        } else if (/android/.test(ua)) {
            // topHide();
            window.location.href = config.download_url_Adr;
        }else{
           console.info("else");
        }
    }



    function openApp() {
        // 用户点击时，在动态创建一个iframe，并且让这个iframe去加载config中的Schema
        var ifr = document.createElement('iframe');
        // 端口判断 安卓或IOS
        ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS : config.scheme_Adr;
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
    }




   


    //关闭
    $("#closeTop").click(function(){
        topHide();
    });

    function topHide(){
            //保存一年
           setCookie("isShow","0",360);
            $(".topBarad").addClass("addDisplay");
    }
    var open = true;

    var isShow  = getCookie("isShow");
    function openTop(){
        //后台禁止
        if(!open){
            return false;
        }
        //为空没关闭过时显示下载提示
        if(isShow == ""){
            $(".topBarsearch").css("position","static");
            $(".topBarad").removeClass("addDisplay");
        }
    }
     //点击事件  调用openclient方法 打开app
    window.addEventListener("DOMContentLoaded", function () {
        if (document.getElementById("download")){
               document.getElementById("download").addEventListener('click', openclient, true);
        }
      
    }, true);
    function check(){
        $.ajax({
            type : "get",
            url : "/localQuickPurchase/visitCount/openTopDown",
            dataType : "json",
            data : {

            },
            async : true,
            success : function(result) {
                var code = result.code;
                if(code == 200){
                    var topStatus =result.data;
                    if(topStatus != "" && topStatus == "0"){
                        open = false;
                    }
                }
                openTop();
            },
            error:function(){
                openTop();
            }
        });
    }
check();

