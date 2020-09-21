/*跳转链接*/
var dataUrl;
/**
 * 查找百业联盟过来的用户提示抵扣卷
 */
$(function () {
    $.ajax({
        type:'GET',
        dataType:'json',
        url:"/localQuickPurchase/dApplicationAction/ifAllianceGold",
        data:{"seq":seq},
        async : false,
        success:function (data) {
            var code = data.code;
            if(code == 200){
                dataUrl = data.data.url;
                var word = data.data.word;
                $('.showModal').css('display', 'block');
                $('.word').html(word);
                /*hui.confirm(word+"是否要进入专区", ['取消','确认'], function () {
                    window.location.href = dataUrl;
                });*/
            }
        }
    })
})

$('.pop-upBtn').on('click',function () {
   window.location.href = dataUrl;
});

