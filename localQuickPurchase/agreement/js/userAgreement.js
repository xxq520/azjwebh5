
/*协议类型*/
var id = getQueryString("id");
var imgUrl = '';

$(function () {
    $.ajax({
        type:'get',
        url:'/localQuickPurchase/agreementAction/getAgreementContent',
        data:{
            "id":id,
            "userSeq":seq
        },
        dataType:"json",
        async:false,
        success:function (data) {
            var code = data.code;
            if(code == 200){
                var agreementList = data.data;
                if(agreementList != null){
                    /*用户满意度*/
                    var satisfaction = agreementList.satisfaction;
                    /*用户协议*/
                    var agreementContent = agreementList.agreementContent;
                    if (agreementContent != null){
                        imgUrl = agreementContent.imgUrl;
                        var html = ' <p class="contentText">'+agreementContent.content+'</p>';
                        $('.text').append(html);
                        $('.contentText').html(agreementContent.content);
                        // $('.imgUrl').attr("src",imgUrl);
                    }
                    if (satisfaction == 1){
                        $('.good').find('img').attr('src','./img/nice2@2x.png');
                        $('.good').find("p").css("color", "red");
                    }else if (satisfaction == 2){
                        $('.bad').find('img').attr('src','./img/error2@2x.png');
                        $('.bad').find("p").css("color", "red");
                    }

                }else{
                    hui.toast("该用户不符合升级条件")
                }
            }else {
                hui.toast("该用户不符合升级条件")
            }
        }
    });
})

/** 
 * 保存用户的满意度
 * */
function saveAgreementSatisfaction(satisfaction) {
    $.ajax({
        type:'post',
        url:'/localQuickPurchase/agreementAction/saveAgreementSatisfaction',
        data:{
            "satisfaction":satisfaction,
            "id":id,
            "userSeq":seq
        },
        dataType:"json",
        async:false,
        success:function (data) {
            var code = data.code;
            if(code == 200) {

            }
        }
    });
}

/*联系客服*/
$('.linkto').on('click',function () {
    window.location.href='/localQuickPurchase/distributionVA/customer/menu';
})

//返回上一级
function getBackClick(){
    try{
        window.action.app_back();
    }catch(e){

    }
    window.history.go(-1);
}

/*图片下载*/
$('.downloadAgreement').on('click',function () {
    downloadAgreement();
})
$('.save_logo').on('click',function () {
    downloadAgreement();
})

function downloadAgreement() {
    //调手机原生去下载；
    var u = navigator.userAgent;
    var isappwebview = u.indexOf('app_webview') > -1
    if(isappwebview){
        // 调app原生图片保存
        window.action.downImg(imgUrl);
    }else{
        downLoadImg(imgUrl);
    }
}

















