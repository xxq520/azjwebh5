$("body").on("click",".del",function () {
    $(".showAd").remove();
    $(".codeImg").remove();
})

$(function () {
    var is_WeiXin = browserType();
    if(is_WeiXin == "weixin"){
        vipcn();
    }
});
var connectionAdress;
var codeImg;
var name;
var message = "关注爱之家商城公众号 爱之家商城更多精彩活动等您来参加";
function vipcn() {
    $.ajax({
        type:"GET",
        dataType:"json",
        url:"/localQuickPurchase/vipcnAction/findVipcn",
        async:true,
        success:function (data) {
            var code = data.code;
            if(code == 200){
                connectionAdress = data.data.connectionAdress;
                codeImg = data.data.codeImg;
                name = data.data.name;
                if(name != null){
                    name = "关注"+name+"公众号";
                }else{
                    name = "关注公众号";
                }
                var floatingContent = data.data.floatingContent;
                if(floatingContent == null || floatingContent == ""){
                    floatingContent = message;
                }
                if(floatingContent.length < 24){
                    $(".showAd_ul li:nth-child(2)").css("line-height","inherit");
                }
                if(codeImg != null || connectionAdress != null){
                    $(".showAd").show();
                    $(".adText").html(floatingContent);
                }
            }
        }
    });
}

$("body").on("click",".attention",function () {
    var is_WeiXin = browserType();
    if(is_WeiXin == "weixin"){
        $(".showAd").remove();
        /*if(connectionAdress != null && connectionAdress != ""){
        	window.location.href = connectionAdress;
        }else{*/
        $(".codeImg").show();
        $(".ewmcode_Img img").attr("src",codeImg);
        $(".focusgz").html(name);
        // }
    }/*else if(is_WeiXin == "qq"){
        $(".codeImg").show();
        $(".ewmcode_Img img").attr("src",codeImg);
	//}

    /*$(".focusgz").html(name);
    $(".showAd").remove();
    $(".codeImg").show();
    $(".ewmcode_Img img").attr("src",codeImg);*/
})