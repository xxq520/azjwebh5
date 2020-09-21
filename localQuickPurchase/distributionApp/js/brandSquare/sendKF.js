 //点击联系在线客服
 $(".scrollsidebar").click(function () {
    //判断是否登录
    if (!isLogin()) {
        noLogin();
        return;
    }
     hui.dialogBase();
    $(".kefu-block").slideUp(200);
    sendKF();
 });

// $(".customerService").click(function () {
//
// });
//点击客服的图标携带商品信息的参数
$(".customerService").click(function () {

//判断是否登录
    if (!isLogin()) {
        noLogin();
        return;
    }
    setCookie("GoodsShow", JSON.stringify(goods_customer_service), 10 * 1000);
    console.log("添加Cookie成功");
    goods_customer_service = null;
    hui.dialogBase();
    $(".kefu-block").slideUp(200);
    sendKF();
});


//关闭客服
$("#hui-mask,.closeImg").click(function () {
    $(".kefu-block").slideUp(200);
    $("#hui-mask").css("display", "none");
    $(".scrollsidebar").css("display", "block");
});

//请求net获取联系客服的静态代码块
function sendKF() {
    $.ajax({
        type: 'GET',
        url: '/localQuickPurchase/brandShopInfoAction/getWebChatCodeInfo',
        async: false,
        data: {
            iSeq: supplierSeq
        },
        success: function (data) {
            if (data.code == 200) {


                $(".kefu-block").slideDown(200);
                $("#hui-mask").css("display", "block");
                $(".scrollsidebar").css("display", "none");

                var dataResult = eval('(' + data.data.returnStr + ')');
                if (dataResult != null && dataResult.code == "200") {
                    dataHtml = dataResult.result;
                    if (dataHtml != null && dataHtml != undefined) {
                        var serviceStr = "";
                        for (var i = 0; i < dataHtml.length; i++) {
                            serviceStr += "<li>" + dataHtml[i].HtmlCode + "</li>";
                        }
                        document.getElementById("serviceFloor").innerHTML = serviceStr;

                    }
                } else {
                    //请求客服出现错误
                    hui.alert("暂无客服", "确定");
                }
            } else if (data.code == 500) {
                //请求客服出现错误
                // hui.alert("暂无客服", "确定");
                window.location.href = "/localQuickPurchase/distributionVA/customer/menu?type=1";

            }else{
                hui.alert("暂无客服", "确定");
            }
        },
        error: function() {
            //请求客服出现错误
            hui.alert("暂无客服", "确定");
        }
    });
 }